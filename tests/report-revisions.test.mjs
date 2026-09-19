import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';
import { createApp } from '../server/app.mjs';
import { savedResultsPdf } from '../server/saved-results-pdf.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');
// Fixed synthetic oracle: A has one matching answer, B has two. Neither is customer evidence.
const answersA = [
  { engine: 'chatgpt', prompt: 'Which service should I consider?', response_id: 'A', timestamp: '2026-09-19T12:00:00Z', response_text: 'MiNdLeVeRx. <script>alert(1)</script>' },
  { engine: 'copilot', prompt: 'Which service should I consider?', response_id: 'B', timestamp: '2026-09-19T12:00:00Z', response_text: 'Another service.' },
];
const sourceA = Buffer.from('\ufeff' + JSON.stringify(answersA) + '\n');
const sourceB = Buffer.from(JSON.stringify([answersA[0], { ...answersA[1], response_text: 'MindLeverX as well.' }]));
// Deterministic test seam isolates persistence/failure cases from Python startup.
// The first integration case invokes the real renderer and checks its exact captured bytes.
const syntheticPdf = Buffer.from('%PDF-1.4\nsynthetic persistence test only\n%%EOF\n');

async function fixture(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'mlx-review-bridge-'));
  const sourcePath = join(directory, 'private-source.json');
  const dbPath = join(directory, 'workspace.sqlite');
  await writeFile(sourcePath, sourceA);
  let app;
  let base, cookie, csrf;
  const config = { dbPath, seed: false, evidenceInputPath: sourcePath, evidenceSubjectDomain: 'https://EXAMPLE.test/path', reportPdfRenderer: async () => syntheticPdf, ...options };
  async function start(overrides = {}) {
    app = createApp({ ...config, ...overrides });
    app.server.listen(0, '127.0.0.1');
    await once(app.server, 'listening');
    base = `http://127.0.0.1:${app.server.address().port}`;
    const session = await fetch(`${base}/api/session`);
    cookie = session.headers.getSetCookie()[0].split(';')[0];
    csrf = (await session.json()).csrf_token;
  }
  t.after(async () => { if (app) await app.close(); await rm(directory, { recursive: true, force: true }); });
  await start();
  async function request(route, { method = 'GET', body, session = true, token = true, headers = {} } = {}) {
    const response = await fetch(`${base}${route}`, { method, headers: { ...(session ? { Cookie: cookie } : {}), ...(token ? { 'X-CSRF-Token': csrf } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    const bytes = Buffer.from(await response.arrayBuffer());
    let data;
    try { data = JSON.parse(bytes.toString('utf8')); } catch { data = bytes.toString('utf8'); }
    return { status: response.status, data, bytes, headers: response.headers };
  }
  async function client(domain = 'example.test', name = 'Fixture client') {
    const result = await request('/api/clients', { method: 'POST', body: { name, domain } });
    assert.equal(result.status, 201);
    return result.data.client;
  }
  async function prepare(clientId, source = sourceA, extra = {}) {
    return request(`/api/clients/${clientId}/report-revisions`, { method: 'POST', body: { sourceSha256: sha(source) }, ...extra });
  }
  return { directory, sourcePath, dbPath, request, client, prepare, app: () => app, restart: async overrides => { await app.close(); await start(overrides); } };
}

test('real PDF snapshot retains exact BOM source, report, PDF, counts and immutable subject after restart', async t => {
  let renders = 0, renderedPdf;
  const f = await fixture(t, { reportPdfRenderer: async (report, options) => { renders++; renderedPdf = await savedResultsPdf(report, options); return renderedPdf; } });
  const client = await f.client();
  const result = await f.prepare(client.id);
  assert.equal(result.status, 201);
  const { revision, review } = result.data;
  assert.equal(revision.subject.domain, 'example.test');
  assert.equal(revision.subject.clientName, 'Fixture client');
  assert.equal(revision.subject.brand, 'MindLeverX');
  assert.equal(revision.scope, 'internal_saved_sample');
  assert.equal(revision.collectionQualification, 'required');
  assert.equal(revision.clientRelease, 'unavailable');
  assert.equal(review.status, 'pending');
  const detail = await f.request(`/api/report-revisions/${revision.id}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.data.report.aggregate.numerator, 1);
  assert.equal(detail.data.report.aggregate.denominator, 2);
  assert.deepEqual(detail.data.report.answers.map(row => row.answer), answersA.map(row => row.response_text));
  const { snapshotSha256, ...snapshot } = revision;
  assert.equal(sha(Buffer.from(JSON.stringify(snapshot))), snapshotSha256);
  const downloads = {};
  for (const [kind, suffix] of [['source','source.json'], ['report','report.json'], ['pdf','draft.pdf']]) {
    const downloaded = await f.request(`/api/report-revisions/${revision.id}/${suffix}`);
    assert.equal(downloaded.status, 200);
    assert.equal(downloaded.headers.get('cache-control'), 'no-store');
    assert.equal(sha(downloaded.bytes), revision[kind].sha256);
    assert.equal(downloaded.bytes.length, revision[kind].bytes);
    downloads[kind] = downloaded.bytes;
  }
  assert.deepEqual(downloads.source, sourceA);
  assert.deepEqual(downloads.pdf, renderedPdf);
  assert.match(downloads.pdf.toString('latin1'), /^%PDF-/);
  assert.match(downloads.pdf.toString('latin1'), /%%EOF\s*$/);
  assert.deepEqual(JSON.parse(downloads.report), detail.data.report);
  await rm(f.sourcePath);
  await f.restart({ reportPdfRenderer: async () => { throw new Error('Must not regenerate'); } });
  assert.deepEqual((await f.request(`/api/report-revisions/${revision.id}`)).data, detail.data);
  assert.deepEqual((await f.request(`/api/report-revisions/${revision.id}/draft.pdf`)).bytes, downloads.pdf);
  assert.deepEqual((await f.request(`/api/report-revisions/${revision.id}/source.json`)).bytes, sourceA);
  assert.equal(renders, 1);
  const workspace = (await f.request('/api/workspace')).data;
  assert.equal(workspace.reportRevisions.length, 1);
  assert.equal(workspace.reviews[0].revision.id, revision.id);
  assert.ok(!JSON.stringify(workspace.reportRevisions).includes('response_text'));
  assert.ok(!JSON.stringify(workspace).includes(f.directory));
});

test('concurrent repeats deduplicate, changed source appends and old revision cannot be updated', async t => {
  let renders = 0;
  const f = await fixture(t, { reportPdfRenderer: async () => { renders++; await new Promise(resolve => setTimeout(resolve, 20)); return syntheticPdf; } });
  const client = await f.client();
  const results = await Promise.all([f.prepare(client.id), f.prepare(client.id), f.prepare(client.id)]);
  assert.deepEqual(results.map(result => result.status).sort(), [200,200,201]);
  assert.equal(new Set(results.map(result => result.data.revision.id)).size, 1);
  assert.equal(renders, 1);
  const first = results[0].data.revision;
  const before = (await f.request(`/api/report-revisions/${first.id}`)).data;
  const decision = { decision: 'approved', note: 'Synthetic local acceptance.', revisionId: first.id, snapshotSha256: first.snapshotSha256 };
  assert.equal((await f.request(`/api/reviews/${first.reviewId}/decision`, { method: 'POST', body: decision })).status, 200);
  const repeated = await f.prepare(client.id);
  assert.equal(repeated.status, 200);
  assert.equal(repeated.data.review.status, 'approved');
  assert.equal(renders, 1);
  await writeFile(f.sourcePath, sourceB);
  const next = await f.prepare(client.id, sourceB);
  assert.equal(next.status, 201);
  assert.equal(next.data.revision.version, 2);
  assert.equal(next.data.review.status, 'pending');
  const after = await f.request(`/api/report-revisions/${next.data.revision.id}`);
  assert.equal(after.data.report.aggregate.numerator, 2);
  assert.equal(after.data.report.aggregate.denominator, 2);
  assert.deepEqual((await f.request(`/api/report-revisions/${first.id}`)).data, before);
  assert.throws(() => f.app().db.prepare('UPDATE report_revisions SET pdf_bytes=? WHERE id=?').run(Buffer.from('changed'), first.id), /immutable/);
  const workspace = (await f.request('/api/workspace')).data;
  assert.equal(workspace.reportRevisions.length, 2);
  assert.equal(workspace.reviews.length, 2);
  assert.equal(workspace.activity.filter(event => event.action === 'Local draft prepared').length, 2);
});

test('missing setup, wrong client, samples, stale hashes and incomplete evidence cannot create a snapshot', async t => {
  const f = await fixture(t, { seed: true });
  const client = await f.client();
  const other = await f.client('other.example');
  const before = (await f.request('/api/workspace')).data;
  assert.equal((await f.prepare('missing')).status, 404);
  assert.equal((await f.prepare(other.id)).status, 409);
  assert.equal((await f.prepare('northwind')).status, 409);
  assert.equal((await f.prepare(client.id, sourceB)).status, 409);
  const incomplete = Buffer.from(JSON.stringify([{ ...answersA[0], response_text: '' }]));
  await writeFile(f.sourcePath, incomplete);
  assert.equal((await f.prepare(client.id, incomplete)).status, 409);
  const malformed = Buffer.from('{');
  await writeFile(f.sourcePath, malformed);
  assert.equal((await f.prepare(client.id, malformed)).status, 409);
  await rm(f.sourcePath);
  const missing = await f.prepare(client.id);
  assert.equal(missing.status, 503);
  assert.ok(!JSON.stringify(missing.data).includes(f.directory));
  await writeFile(f.sourcePath, Buffer.alloc(2 * 1024 * 1024 + 1, 32));
  assert.equal((await f.prepare(client.id)).status, 413);
  await f.restart({ evidenceSubjectDomain: null });
  assert.equal((await f.prepare(client.id)).status, 409);
  const after = (await f.request('/api/workspace')).data;
  assert.deepEqual(after.reviews, before.reviews);
  assert.deepEqual(after.activity, before.activity);
  assert.deepEqual(after.reportRevisions, []);
});

test('PDF failures and a transaction insertion failure leave no orphan snapshot, review or event', async t => {
  const f = await fixture(t, { reportPdfRenderer: async () => { throw new Error('/private/renderer-failure'); } });
  const client = await f.client();
  const before = (await f.request('/api/workspace')).data;
  const failure = await f.prepare(client.id);
  assert.equal(failure.status, 503);
  assert.ok(!JSON.stringify(failure.data).includes('/private/renderer-failure'));
  assert.deepEqual((await f.request('/api/workspace')).data, before);
  await f.restart({ reportPdfRenderer: savedResultsPdf, pdfPython: '/unavailable-private-mlx-python' });
  const unavailable = await f.prepare(client.id);
  assert.equal(unavailable.status, 503);
  assert.ok(!JSON.stringify(unavailable.data).includes('/unavailable-private-mlx-python'));
  assert.deepEqual((await f.request('/api/workspace')).data, before);
  // Restore the real fixture seam after the deliberate renderer failure.
  await f.restart({ reportPdfRenderer: async () => syntheticPdf });
  f.app().db.exec("CREATE TRIGGER fixture_reject_activity BEFORE INSERT ON activity WHEN NEW.action='Local draft prepared' BEGIN SELECT RAISE(ABORT, 'fixture rollback'); END;");
  assert.equal((await f.prepare(client.id)).status, 500);
  assert.deepEqual((await f.request('/api/workspace')).data, before);
  f.app().db.exec('DROP TRIGGER fixture_reject_activity');
  assert.equal((await f.prepare(client.id)).status, 201);
});

test('API protects snapshot writes and decision identity while preserving the local-only release boundary', async t => {
  const f = await fixture(t);
  const client = await f.client();
  assert.equal((await f.prepare(client.id, sourceA, { session: false })).status, 401);
  assert.equal((await f.prepare(client.id, sourceA, { token: false })).status, 403);
  assert.equal((await f.prepare(client.id, sourceA, { headers: { Origin: 'https://foreign.invalid' } })).status, 403);
  for (const body of [{}, { sourceSha256: 'bad' }, { sourceSha256: sha(sourceA), sourcePath: '/private/source.json' }, { sourceSha256: sha(sourceA), approved: true }]) {
    assert.equal((await f.prepare(client.id, sourceA, { body })).status, 400);
  }
  const revision = (await f.prepare(client.id)).data.revision;
  for (const suffix of ['', '/draft.pdf', '/source.json', '/report.json']) {
    const route = `/api/report-revisions/${revision.id}${suffix}`;
    assert.equal((await f.request(route, { session: false })).status, 401);
    assert.equal((await f.request(route, { headers: { Origin: 'https://foreign.invalid' } })).status, 403);
    assert.equal((await f.request(route, { method: 'PATCH', body: { approved: true } })).status, 404);
    assert.equal((await f.request(route, { method: 'DELETE' })).status, 404);
    assert.equal((await f.request(`/api/report-revisions/missing${suffix}`)).status, 404);
  }
  const path = `/api/reviews/${revision.reviewId}/decision`;
  assert.equal((await f.request(path, { method: 'POST', body: { decision: 'approved', note: 'Missing identity.' } })).status, 400);
  const body = { decision: 'approved', note: 'Synthetic review only.', revisionId: revision.id, snapshotSha256: revision.snapshotSha256 };
  assert.equal((await f.request(path, { method: 'POST', body: {...body,note:'   '} })).status, 400);
  for (const change of [{revisionId:'wrong'}, {snapshotSha256:'0'.repeat(64)}]) assert.equal((await f.request(path, { method: 'POST', body: {...body,...change} })).status, 409);
  assert.equal((await f.request(path, { method: 'POST', body: {...body,release:true} })).status, 400);
  const decisions = await Promise.all([f.request(path, { method: 'POST', body }), f.request(path, { method: 'POST', body: {...body,decision:'returned'} })]);
  assert.deepEqual(decisions.map(result => result.status).sort(), [200,409]);
  assert.equal((await f.request(path, { method: 'POST', body })).status, 409);
  const stored = (await f.request(`/api/report-revisions/${revision.id}`)).data.revision;
  assert.equal(stored.clientRelease, 'unavailable');
  assert.equal(stored.collectionQualification, 'required');
  assert.equal((await f.request(`/api/report-revisions/${revision.id}/release`, {method:'POST',body:{}})).status, 404);
});

test('retrieval, duplicate preparation and decisions fail closed on snapshot corruption', async t => {
  for (const column of ['source_bytes','report_bytes','pdf_bytes','manifest_identity']) await t.test(column, async t => {
    const f = await fixture(t);
    const client = await f.client();
    const revision = (await f.prepare(client.id)).data.revision;
    // Explicitly bypass the guard in this disposable corruption fixture only.
    f.app().db.exec('DROP TRIGGER report_revisions_no_update');
    if (column === 'manifest_identity') {
      const {snapshotSha256, ...altered} = revision;
      altered.clientId = 'wrong-client';
      const text = JSON.stringify(altered);
      f.app().db.prepare('UPDATE report_revisions SET snapshot_json=?,snapshot_sha256=? WHERE id=?').run(text,sha(Buffer.from(text)),revision.id);
    } else f.app().db.prepare(`UPDATE report_revisions SET ${column}=? WHERE id=?`).run(Buffer.from('corrupted'), revision.id);
    for (const suffix of ['', '/draft.pdf', '/source.json', '/report.json']) {
      const response = await f.request(`/api/report-revisions/${revision.id}${suffix}`);
      assert.equal(response.status, 503);
      assert.match(response.data.error, /integrity/);
    }
    const response = await f.request(`/api/reviews/${revision.reviewId}/decision`, {method:'POST',body:{decision:'approved',note:'Must stay pending.',revisionId:revision.id,snapshotSha256:revision.snapshotSha256}});
    assert.equal(response.status, 503);
    assert.equal((await f.prepare(client.id)).status, 503);
    assert.equal((await f.request('/api/workspace')).data.reviews[0].status, 'pending');
  });
});

test('separate application writers recheck duplicates after rendering before committing', async t => {
  const f = await fixture(t, { reportPdfRenderer: async () => { await new Promise(resolve => setTimeout(resolve, 30)); return syntheticPdf; } });
  const client = await f.client();
  const second = createApp({dbPath:f.dbPath,seed:false,evidenceInputPath:f.sourcePath,evidenceSubjectDomain:'example.test',reportPdfRenderer:async () => { await new Promise(resolve => setTimeout(resolve, 10)); return syntheticPdf; }});
  t.after(() => second.close());
  second.server.listen(0,'127.0.0.1');
  await once(second.server,'listening');
  const base = `http://127.0.0.1:${second.server.address().port}`;
  const session = await fetch(`${base}/api/session`);
  const cookie = session.headers.getSetCookie()[0].split(';')[0];
  const csrf = (await session.json()).csrf_token;
  const other = fetch(`${base}/api/clients/${client.id}/report-revisions`, {method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({sourceSha256:sha(sourceA)})});
  const [first,response] = await Promise.all([f.prepare(client.id),other]);
  const body = await response.json();
  assert.deepEqual([first.status,response.status].sort(),[200,201]);
  assert.equal(first.data.revision.id,body.revision.id);
  const workspace = (await f.request('/api/workspace')).data;
  assert.equal(workspace.reportRevisions.length,1);
  assert.equal(workspace.reviews.length,1);
  assert.equal(workspace.activity.filter(event=>event.action==='Local draft prepared').length,1);
});

test('linked review and direct preview render retained evidence inertly with local-only labels', async t => {
  const f = await fixture(t);
  const client = await f.client('example.test', '<img src=x onerror="alert(1)">');
  const prepared = (await f.prepare(client.id)).data;
  const detail = (await f.request(`/api/report-revisions/${prepared.revision.id}`)).data;
  const context = vm.createContext({ document: {addEventListener(){}}, window: {addEventListener(){},matchMedia:()=>({addEventListener(){}})}, location:{hash:`#/preview/${prepared.review.id}`}, URL, setTimeout, clearTimeout, input:{prepared,detail,client} });
  const script = (await readFile(new URL('../platform/app.js', import.meta.url),'utf8')).replace(/\nstart\(\);\s*$/,'\n');
  vm.runInContext(script,context);
  const html = vm.runInContext('state.clients=[input.client];state.reviews=[input.prepared.review];state.revisionDetails.set(input.prepared.revision.id,input.detail);previewPage(input.prepared.review.id);',context);
  assert.match(html,/Accept local draft/);
  assert.match(html,/Client release is unavailable/);
  assert.match(html,/Download retained PDF/);
  assert.match(html,/&lt;script&gt;/);
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('Readiness'));
  assert.ok(!html.includes('Where the engagement is'));
  assert.ok(html.includes(`data-snapshot-hash="${prepared.revision.snapshotSha256}"`));
  const unavailable = vm.runInContext('reportPreparationPanel({status:"complete",source:{sha256:"test"}});',context);
  assert.ok(!unavailable.includes('id="report-prepare"'));
  const ready = vm.runInContext('state.reportPreparation={sourceConfigured:true,subjectDomain:"example.test",brand:"MindLeverX"};reportPreparationPanel({status:"complete",source:{sha256:"test"}});',context);
  assert.match(ready,/id="report-prepare"/);
  assert.ok(!ready.includes('<img'));
  const sample = vm.runInContext('state.clients[0].sample=true;reportPreparationPanel({status:"complete",source:{sha256:"test"}});',context);
  assert.ok(!sample.includes('id="report-prepare"'));
});
