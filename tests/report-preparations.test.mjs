import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import vm from 'node:vm';
import { openDatabase } from '../server/database.mjs';
import { createReportRevisions } from '../server/report-revisions.mjs';
import { createReportPreparations, PREPARATION_TIMEOUT_MS } from '../server/report-preparations.mjs';
import { backupDatabase, verifyDatabaseBackup, restoreDatabaseBackup } from '../server/database-recovery.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');
const source = Buffer.from(JSON.stringify([
  { engine: 'chatgpt', prompt: 'Which service?', response_id: 'A', timestamp: '2026-09-20T12:00:00Z', response_text: 'MindLeverX.' },
  { engine: 'copilot', prompt: 'Which service?', response_id: 'B', timestamp: '2026-09-20T12:00:00Z', response_text: 'Another service.' },
]));
const pdf = Buffer.from('%PDF-1.4\nSynthetic renderer for attempt coordination\n%%EOF\n');
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'mlx-preparations-'));
  const path = join(directory, 'workspace.sqlite'), input = join(directory, 'source.json');
  await writeFile(input, source);
  const db = openDatabase(path, false);
  db.prepare("INSERT INTO clients (id,name,domain,status,stage,created_at) VALUES ('client','Synthetic client','fixture.test','active',1,'2026-09-20T12:00:00Z')").run();
  const opened = new Set([db]);
  const connect = () => { const connection = openDatabase(path, false); opened.add(connection); return connection; };
  const close = connection => { connection.close(); opened.delete(connection); };
  const reports = (connection = db, options = {}) => createReportRevisions({ db: connection, evidenceInputPath: input, evidenceBrand: 'MindLeverX', evidenceSubjectDomain: 'fixture.test', pdfRenderer: async () => pdf, ...options });
  t.after(async () => { for (const connection of opened) connection.close(); await rm(directory, { recursive: true, force: true }); });
  return { directory, path, input, db, connect, close, reports, request: { sourceSha256: sha(source) } };
}

test('PREP-01: two database connections claim one render and replay returns the exact stored revision', async t => {
  const f = await fixture(t), entered = deferred(), release = deferred();
  let renders = 0;
  const first = f.reports(f.db, { pdfRenderer: async () => { renders++; entered.resolve(); await release.promise; return pdf; } });
  const second = f.reports(f.connect(), { pdfRenderer: async () => { renders++; return pdf; } });
  const a = first.prepare('client', f.request);
  await entered.promise;
  const b = second.prepare('client', f.request);
  assert.equal(second.preparations()[0].status, 'running');
  await new Promise(resolve => setTimeout(resolve, 60));
  assert.equal(renders, 1);
  release.resolve();
  const results = await Promise.all([a, b]);
  assert.deepEqual(results.map(result => result.created).sort(), [false, true]);
  assert.equal(results[0].revision.id, results[1].revision.id);
  assert.equal(first.preparations().length, 1);
  assert.equal(first.preparations()[0].status, 'succeeded');
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n, 1);
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM activity').get().n, 1);
  const restoredInstance = f.reports(f.connect(), { pdfRenderer: async () => { throw new Error('Replay must not render'); } });
  assert.equal((await restoredInstance.prepare('client', f.request)).revision.id, results[0].revision.id);
  assert.equal(restoredInstance.preparations().length, 1);
  const changed = Buffer.from(source.toString().replace('Another service.', 'MindLeverX as well.'));
  await writeFile(f.input, changed);
  const next = await second.prepare('client', { sourceSha256: sha(changed) });
  assert.equal(next.revision.version, 2);
  assert.equal(second.preparations().length, 2);
  assert.deepEqual(first.bytes(results[0].revision.id, 'source'), source);
});

test('PREP-02: failure remains after reopening; explicit retry appends history without leaking exception text', async t => {
  const f = await fixture(t);
  const reports = f.reports(f.db, { pdfRenderer: async () => { throw new Error('/private/secret-python-path'); } });
  await assert.rejects(reports.prepare('client', f.request), /PDF generation is unavailable/);
  const failed = reports.preparations()[0];
  assert.equal(failed.status, 'failed');
  assert.equal(failed.outcomeCode, 'PDF_UNAVAILABLE');
  assert.equal(failed.attempt, 1);
  assert.ok(!JSON.stringify(failed).includes('/private/'));
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n, 0);
  f.close(f.db);
  const connection = f.connect(), fresh = f.reports(connection);
  assert.deepEqual(fresh.preparations(), [failed]);
  assert.equal(connection.prepare('SELECT COUNT(*) AS n FROM report_revisions').get().n, 0);
  const result = await fresh.prepare('client', f.request);
  const attempts = fresh.preparations();
  assert.equal(attempts.length, 2);
  assert.deepEqual(attempts.find(row => row.attempt === 1), failed);
  assert.equal(attempts[0].attempt, 2);
  assert.match(attempts[0].reason, /Explicit retry after failed attempt 1/);
  assert.equal(attempts[0].revisionId, result.revision.id);
  assert.throws(() => connection.prepare("UPDATE report_preparation_attempts SET message='changed' WHERE id=?").run(failed.id), /immutable/);
});

test('PREP-03: final transaction rolls back without a false success, and explicit retry succeeds', async t => {
  const f = await fixture(t), reports = f.reports();
  f.db.exec("CREATE TRIGGER fixture_fail BEFORE INSERT ON activity BEGIN SELECT RAISE(ABORT,'fixture rollback'); END");
  await assert.rejects(reports.prepare('client', f.request), /fixture rollback/);
  for (const table of ['report_revisions','reviews','activity']) assert.equal(f.db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n, 0);
  assert.equal(reports.preparations()[0].status, 'failed');
  assert.equal(reports.preparations()[0].outcomeCode, 'PERSISTENCE_FAILED');
  f.db.exec('DROP TRIGGER fixture_fail');
  await reports.prepare('client', f.request);
  assert.deepEqual(reports.preparations().map(row => row.status), ['succeeded', 'failed']);
});

test('PREP-03b: expired renderer is fenced from committing after a successor succeeds', async t => {
  const f = await fixture(t), entered = deferred(), release = deferred();
  let time = 100000;
  const options = { preparationClock: () => time };
  const stale = f.reports(f.db, { ...options, pdfRenderer: async () => { entered.resolve(); await release.promise; return pdf; } });
  const fresh = f.reports(f.connect(), options);
  const pending = stale.prepare('client', f.request);
  const rejection = assert.rejects(pending, /no longer active/);
  await entered.promise;
  assert.equal(fresh.preparations()[0].status, 'running', 'a second instance must not declare interruption before deadline');
  time += PREPARATION_TIMEOUT_MS + 1;
  const interrupted = fresh.preparations()[0];
  assert.equal(interrupted.status, 'interrupted');
  assert.equal(interrupted.outcomeCode, 'LOCAL_DEADLINE');
  const recovered = await fresh.prepare('client', f.request);
  release.resolve(); await rejection;
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM report_revisions').get().n, 1);
  assert.equal(fresh.preparations()[0].revisionId, recovered.revision.id);
  assert.deepEqual(fresh.preparations()[1], interrupted);
});

test('PREP-04: killed renderer process leaves recoverable persisted attempt rather than fictional completion', async t => {
  const f = await fixture(t);
  const helper = join(f.directory, 'killed-render.mjs');
  await writeFile(helper, `import { openDatabase } from ${JSON.stringify(new URL('../server/database.mjs', import.meta.url).href)};
import { createReportRevisions } from ${JSON.stringify(new URL('../server/report-revisions.mjs', import.meta.url).href)};
const db=openDatabase(${JSON.stringify(f.path)},false);
const reports=createReportRevisions({db,evidenceInputPath:${JSON.stringify(f.input)},evidenceBrand:'MindLeverX',evidenceSubjectDomain:'fixture.test',pdfRenderer:async()=>{process.stdout.write('RENDER_ENTERED\\n');await new Promise(()=>{});}});
await reports.prepare('client',${JSON.stringify(f.request)});`);
  const child = spawn(process.execPath, [helper], { stdio: ['ignore', 'pipe', 'pipe'] });
  let exited = false; child.on('exit', () => { exited = true; });
  t.after(() => { if (!exited) child.kill('SIGKILL'); });
  const output = await Promise.race([once(child.stdout, 'data'), once(child, 'exit').then(() => { throw new Error('Child exited before claiming'); }), new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('Child startup timeout')), 5000); timer.unref(); })]);
  assert.match(output[0].toString(), /RENDER_ENTERED/);
  const before = f.reports().preparations()[0];
  assert.equal(before.status, 'running');
  const exit = once(child, 'exit'); child.kill('SIGKILL'); await exit;
  const fresh = f.reports(f.connect(), { preparationClock: () => before.deadlineAt + 1 });
  assert.equal(fresh.preparations()[0].status, 'interrupted');
  assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n, 0);
  const retry = await fresh.prepare('client', f.request);
  assert.equal(retry.created, true);
  assert.equal(fresh.preparations().length, 2);
});

test('PREP-05: history renders persisted safe labels, escapes details and remains visible without evidence', async t => {
  const f = await fixture(t), reports = f.reports();
  await reports.prepare('client', f.request);
  const attempts = reports.preparations();
  const context = vm.createContext({ document: {addEventListener(){}}, window: {addEventListener(){},matchMedia:()=>({addEventListener(){}})}, location:{hash:'#/evidence'}, URL, setTimeout, clearTimeout, input:attempts });
  const script = (await readFile(new URL('../platform/app.js', import.meta.url),'utf8')).replace(/\nstart\(\);\s*$/,'\n');
  vm.runInContext(script, context);
  const html = vm.runInContext('state.reportPreparations=input;state.reportPreparations[0].message="<img src=x onerror=alert(1)>";state.inspectionError="Source unavailable";evidencePage();', context);
  assert.match(html, /Recent local draft attempts/);
  assert.match(html, /Draft retained/);
  assert.match(html, /&lt;img/);
  assert.ok(!html.includes('<img'));
  assert.match(html, /client release remains unavailable/);
  for (const [status, text] of [['failed','Preparation failed'],['running','Preparing'],['interrupted','Interrupted or timed out']]) {
    context.status = status;
    assert.ok(vm.runInContext('state.reportPreparations[0].status=status;reportPreparationHistory();', context).includes(text));
  }
});

test('PREP-05b: FIFO evidence is refused before claiming work, without hanging or creating an attempt', async t => {
  const f = await fixture(t);
  const fifo = join(f.directory, 'fifo'); execFileSync('mkfifo', [fifo]);
  const helper = `import { openDatabase } from ${JSON.stringify(new URL('../server/database.mjs', import.meta.url).href)};
import { createReportRevisions } from ${JSON.stringify(new URL('../server/report-revisions.mjs', import.meta.url).href)};
const db=openDatabase(${JSON.stringify(f.path)},false);
const reports=createReportRevisions({db,evidenceInputPath:${JSON.stringify(fifo)},evidenceBrand:'MindLeverX',evidenceSubjectDomain:'fixture.test'});
try { await reports.prepare('client',${JSON.stringify(f.request)}); process.exitCode=2; }
catch(error){ console.log(JSON.stringify({status:error.status,message:error.message})); }
finally{db.close();}`;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', helper], { encoding: 'utf8', timeout: 5000 });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 503);
  assert.match(JSON.parse(result.stdout).message, /regular file/);
  assert.equal(f.reports().preparations().length, 0);
});

test('PREP-06: current backup preserves attempts; exact pre-attempt schema restores and migrates without fabricating history', async t => {
  const f = await fixture(t); await f.reports().prepare('client', f.request);
  const running = createReportPreparations(f.db).claim('client', 'a'.repeat(64), 'b'.repeat(64));
  assert.equal(running.attempt.status, 'running');
  const expected = f.db.prepare('SELECT * FROM report_preparation_attempts ORDER BY id').all();
  const current = join(f.directory, 'current');
  const receipt = await backupDatabase(f.path, current);
  assert.equal(receipt.counts.report_preparation_attempts, 2);
  const restored = await restoreDatabaseBackup(current, join(f.directory, 'restored'));
  const db = openDatabase(restored.databasePath, false);
  try { assert.deepEqual(db.prepare('SELECT * FROM report_preparation_attempts ORDER BY id').all(), expected); } finally { db.close(); }
  f.db.exec('DROP TABLE report_preparation_attempts');
  const old = join(f.directory, 'legacy');
  const legacy = await backupDatabase(f.path, old);
  assert.equal(Object.hasOwn(legacy.counts, 'report_preparation_attempts'), false);
  assert.equal((await verifyDatabaseBackup(old)).status, 'verified');
  const oldRestored = await restoreDatabaseBackup(old, join(f.directory, 'legacy-restored'));
  const migrated = openDatabase(oldRestored.databasePath, false);
  try {
    assert.equal(migrated.prepare('SELECT COUNT(*) AS n FROM report_preparation_attempts').get().n, 0);
    assert.equal(migrated.prepare('SELECT COUNT(*) AS n FROM clients').get().n, 1);
    assert.equal(migrated.prepare('SELECT COUNT(*) AS n FROM report_revisions').get().n, 1);
  } finally { migrated.close(); }
});
