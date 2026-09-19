import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';
import { createApp } from '../server/app.mjs';
import { readPilotPanelDraft, validatePilotPanelDraft } from '../server/pilot-panel-draft.mjs';

// Synthetic contract controls. These are not the actual pilot or measured buyer queries.
function fixture() {
  return {
    schemaVersion: 'mlx-pilot-panel-draft-v1', panelId: 'test-coverage', version: 1,
    state: 'draft', collectionStatus: 'blocked', subject: { brand: 'ExampleBrand', domain: 'example.test' },
    purpose: 'Test candidate display only.', preparedBy: 'Test fixture', owner: 'Test owner — approval pending',
    language: 'en', market: null, locale: null, collectionSurface: null, repetitions: null,
    sources: [{ id: 'fixture', title: 'Synthetic source', kind: 'test_fixture', reference: '../ignored/private-fixture.json', sha256: 'a'.repeat(64), limitation: 'Fictional test content, not buyer research.' }],
    intents: [
      { id: 'discovery_problem', title: 'Discovery', definition: 'Finding an approach.' },
      { id: 'comparison', title: 'Comparison', definition: 'Comparing approaches.' },
      { id: 'trust_method', title: 'Trust', definition: 'Judging evidence.' },
      { id: 'direct_brand', title: 'Direct brand', definition: 'Asking about the named brand.' },
    ],
    questions: [
      { id: 'Q1', text: 'Which services assess AI visibility?', version: 1, intentId: 'discovery_problem', anchoring: 'unanchored', role: 'discovery_candidate', headlineEligibility: 'unresolved', provenance: 'retained_observed_prompt', sourceIds: ['fixture'], rationale: 'Exercise retained provenance.', uncertainty: 'Synthetic source only.' },
      { id: 'Q2', text: 'How should I compare an audit and monitoring?', version: 1, intentId: 'comparison', anchoring: 'unanchored', role: 'exploratory_candidate', headlineEligibility: 'excluded', provenance: 'ai_generated_hypothesis', sourceIds: ['fixture'], rationale: 'Exercise exploratory display.', uncertainty: 'No buyer evidence.' },
      { id: 'Q3', text: 'What is ExampleBrand?', version: 1, intentId: 'direct_brand', anchoring: 'brand_anchored', role: 'brand_diagnostic', headlineEligibility: 'excluded', provenance: 'ai_generated_hypothesis', sourceIds: ['fixture'], rationale: 'Keep brand diagnostics separate.', uncertainty: 'Not spontaneous discovery.' },
    ],
    alternatives: [{ text: 'Which agencies should I consider?', decision: 'deferred', reason: 'Possible overlap; untested.' }],
    gaps: ['Collection permission and sample design unresolved.'],
    measurementBoundary: 'No accepted denominator or permission to collect.',
  };
}

test('candidate validation retains wording, metadata and unresolved values without a fixed question count', () => {
  const input = fixture();
  assert.deepEqual(validatePilotPanelDraft(input), input);
  input.questions = [input.questions[0]];
  assert.equal(validatePilotPanelDraft(input).questions.length, 1);
  for (const field of ['market', 'locale', 'collectionSurface', 'repetitions']) assert.equal(input[field], null);
});

test('candidate validation rejects defective identity, references, provenance and collection claims', async t => {
  const cases = [
    ['frozen state', draft => { draft.state = 'frozen'; }],
    ['approved collection', draft => { draft.collectionStatus = 'approved'; }],
    ['release metadata', draft => { draft.approved = true; }],
    ['duplicate question ID', draft => { draft.questions[1].id = 'Q1'; }],
    ['duplicate question wording', draft => { draft.questions[1].text = draft.questions[0].text.toUpperCase(); }],
    ['missing rationale', draft => { delete draft.questions[0].rationale; }],
    ['invalid question version', draft => { draft.questions[0].version = 0; }],
    ['missing source reference', draft => { draft.questions[0].sourceIds = ['missing']; }],
    ['duplicate source reference', draft => { draft.questions[0].sourceIds = ['fixture', 'fixture']; }],
    ['invented provenance', draft => { draft.questions[0].provenance = 'verified_buyer_demand'; }],
    ['unhashed retained prompt', draft => { draft.sources[0].sha256 = null; }],
    ['malformed hash', draft => { draft.sources[0].sha256 = 'not-a-hash'; }],
    ['duplicate intent', draft => { draft.intents[1].id = draft.intents[0].id; }],
    ['invalid repetition value', draft => { draft.repetitions = 0; }],
  ];
  for (const [name, change] of cases) await t.test(name, () => {
    const input = fixture(); change(input);
    assert.throws(() => validatePilotPanelDraft(input), TypeError);
  });
});

test('brand anchoring and exploratory exclusions cannot become approved discovery eligibility', async t => {
  const cases = [
    ['named brand labeled unanchored', draft => { draft.questions[0].text = 'Who competes with eXaMpLeBrAnD?'; }],
    ['direct brand labeled unanchored', draft => { draft.questions[2].anchoring = 'unanchored'; }],
    ['direct brand not excluded', draft => { draft.questions[2].headlineEligibility = 'unresolved'; }],
    ['exploration becomes a discovery candidate', draft => { draft.questions[1].headlineEligibility = 'unresolved'; }],
    ['eligibility approved', draft => { draft.questions[0].headlineEligibility = 'approved'; }],
  ];
  for (const [name, change] of cases) await t.test(name, () => {
    const input = fixture(); change(input);
    assert.throws(() => validatePilotPanelDraft(input), TypeError);
  });
});

test('reader preserves original-byte provenance including UTF-8 BOM and rejects broken encoding', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'mlx-pilot-reader-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'draft.json');
  const input = fixture();
  const bytes = Buffer.from('\ufeff' + JSON.stringify(input, null, 2) + '\n');
  await writeFile(path, bytes);
  const result = await readPilotPanelDraft(path);
  assert.deepEqual(result.draft, input);
  assert.equal(result.source.bytes, bytes.length);
  assert.equal(result.source.sha256, createHash('sha256').update(bytes).digest('hex'));
  for (const invalid of [Buffer.from('{'), Buffer.from([0xff, 0xfe]), Buffer.alloc(512 * 1024 + 1, 32)]) {
    await writeFile(path, invalid);
    await assert.rejects(readPilotPanelDraft(path));
  }
});

async function localApp(t) {
  const directory = await mkdtemp(join(tmpdir(), 'mlx-pilot-api-'));
  const path = join(directory, 'private-draft.json');
  await writeFile(path, JSON.stringify(fixture()));
  const app = createApp({ dbPath: ':memory:', seed: false, pilotPanelPath: path });
  t.after(async () => { await app.close(); await rm(directory, { recursive: true, force: true }); });
  app.server.listen(0, '127.0.0.1');
  await once(app.server, 'listening');
  const base = `http://127.0.0.1:${app.server.address().port}`;
  const session = await fetch(`${base}/api/session`);
  const cookie = session.headers.getSetCookie()[0].split(';')[0];
  const csrf = (await session.json()).csrf_token;
  const request = (route, options = {}) => fetch(`${base}${route}`, { ...options, headers: { Cookie: cookie, ...options.headers } });
  return { app, directory, path, base, request, csrf };
}

test('draft API requires local session and origin, ignores query paths and performs no panel mutation', async t => {
  const { base, request, csrf } = await localApp(t);
  const route = '/api/pilot-panel-draft';
  assert.equal((await fetch(`${base}${route}`)).status, 401);
  assert.equal((await request(route, { headers: { Origin: 'https://foreign.invalid' } })).status, 403);
  const before = await (await request('/api/workspace')).json();
  const response = await request(route);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const data = await response.json();
  assert.deepEqual(data.draft, fixture());
  assert.deepEqual(await (await request(`${route}?path=/private/other.json`)).json(), data);
  const mutation = await request(route, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify({ state: 'frozen' }) });
  assert.equal(mutation.status, 404);
  assert.deepEqual(await (await request('/api/workspace')).json(), before);
});

test('missing and invalid drafts fail safely without blocking the workspace, then recover on retry', async t => {
  const { path, directory, request } = await localApp(t);
  const before = await (await request('/api/workspace')).json();
  const frozen = fixture(); frozen.state = 'frozen';
  for (const bytes of [null, '{', JSON.stringify(frozen)]) {
    if (bytes === null) await rm(path);
    else await writeFile(path, bytes);
    const response = await request('/api/pilot-panel-draft');
    assert.equal(response.status, 503);
    const body = await response.text();
    assert.match(body, /retry/i);
    assert.ok(!body.includes(directory));
    assert.deepEqual(await (await request('/api/workspace')).json(), before);
  }
  const next = fixture(); next.version = 2;
  await writeFile(path, JSON.stringify(next));
  const response = await request('/api/pilot-panel-draft');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).draft.version, 2);
  assert.deepEqual(await (await request('/api/workspace')).json(), before);
});

async function renderer() {
  const script = (await readFile(new URL('../platform/app.js', import.meta.url), 'utf8')).replace(/\nstart\(\);\s*$/, '\n');
  const context = vm.createContext({
    document: { addEventListener() {} },
    window: { addEventListener() {}, matchMedia: () => ({ addEventListener() {} }) },
    URL, setTimeout, clearTimeout,
  });
  vm.runInContext(script, context);
  return context;
}

test('draft rendering keeps metadata inert, nulls unresolved and collection controls absent', async () => {
  const context = await renderer();
  const draft = fixture();
  const payload = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
  draft.questions[0].text = payload;
  draft.questions[0].rationale = payload;
  draft.sources[0].title = payload;
  draft.sources[0].reference = 'javascript:alert(3)';
  context.input = { draft, source: { sha256: 'b'.repeat(64), bytes: 1234 } };
  const html = vm.runInContext('state.pilotDraft = input; state.pilotDraftLoaded = true; pilotPanelPage();', context);
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('<script'));
  assert.match(html, /&lt;img/);
  assert.ok(!html.includes('href="javascript:'));
  assert.match(html, /Reference \(text only\)/);
  assert.equal((html.match(/<dd>Unresolved<\/dd>/g) || []).length, 4);
  assert.match(html, /Collection is blocked/);
  assert.match(html, /not an approved sample-size requirement/);
  assert.match(html, /AI-generated hypothesis/);
  assert.match(html, /Question retained in a saved export/);
  assert.ok(!html.includes('<form'));
  assert.deepEqual([...html.matchAll(/data-action="([^"]+)"/g)].map(match => match[1]), ['refresh-pilot']);
});

test('draft renderer exposes separate loading and recoverable error states', async () => {
  const context = await renderer();
  const loading = vm.runInContext('pilotPanelPage();', context);
  assert.match(loading, /role="status"/);
  assert.match(loading, /Loading the saved question draft/);
  const failure = vm.runInContext('state.pilotDraftLoaded = true; state.pilotDraftError = "Saved draft unavailable"; pilotPanelPage();', context);
  assert.match(failure, /role="alert"/);
  assert.match(failure, /Retry draft/);
  assert.match(failure, /Other workspace records remain available/);
});
