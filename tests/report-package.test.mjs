import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { execFile, execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { syncBuiltinESMExports } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { buildReportPackage, ReportInputError } from '../server/report-package.mjs';

const cli = resolve(dirname(fileURLToPath(import.meta.url)), '../scripts/build-report.mjs');
const execute = promisify(execFile);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

function fixture() {
  return {
    schemaVersion: 'mlx-report-input-v1',
    reportId: 'test-report-1',
    subject: { name: 'Fictional Example', website: 'https://example.invalid/' },
    preparedAt: '2026-09-13T13:20:00Z',
    fixture: true,
    method: { id: 'fixture-review', version: '1', description: 'Fictional test material; no collection occurred.' },
    limitations: ['Fixture only. Methods are not established as comparable.'],
    evidence: [
      {
        id: 'ev-consumer', family: 'consumer_ai', surface: 'Fictional consumer surface', status: 'observed',
        capturedAt: '2026-09-12T09:00:00-04:00', sourceUrl: 'https://example.invalid/source',
        content: 'Fictional retained answer.\r\nNo actual consumer service was queried.\n', limitation: 'Fictional evidence.',
        context: { question: 'A fictional question?', locale: null, engine: 'Fictional engine', model: null, panelVersion: 'panel-v1' },
      },
      {
        id: 'ev-api', family: 'model_api', surface: 'Fictional API', status: 'failed',
        capturedAt: '2026-09-12T13:01:00Z', sourceUrl: null, content: 'Fictional collection error.', limitation: 'No answer was collected.',
        context: { question: null, locale: null, engine: null, model: null, panelVersion: null },
      },
      {
        id: 'ev-search', family: 'search_performance', surface: 'Ordinary search', status: 'not_measured',
        capturedAt: null, sourceUrl: null, content: '', limitation: 'Search was not measured.',
        context: { question: null, locale: null, engine: null, model: null, panelVersion: null },
      },
      {
        id: 'ev-site', family: 'website_readiness', surface: 'Website fixture', status: 'observed',
        capturedAt: '2024-02-29T23:59:59.123456Z', sourceUrl: 'http://example.invalid/', content: 'Fictional website text.', limitation: '',
        context: { question: null, locale: 'en-US', engine: null, model: null, panelVersion: null },
      },
    ],
    findings: [{ id: 'finding-1', text: 'The fictional API attempt failed; it does not establish an absent answer.', evidenceIds: ['ev-api'], limitations: ['No consumer inference.'] }],
  };
}

function workspace(t) {
  const dir = mkdtempSync(join(tmpdir(), 'mlx-report-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function writeInput(dir, input = fixture(), bytes = Buffer.from(JSON.stringify(input))) {
  const path = join(dir, 'source.json');
  writeFileSync(path, bytes);
  return { path, bytes };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function assertManifest(dir) {
  const manifest = readJson(join(dir, 'manifest.json'));
  for (const entry of manifest.files) {
    const bytes = readFileSync(join(dir, entry.path));
    assert.equal(entry.bytes, bytes.length, entry.path);
    assert.equal(entry.sha256, hash(bytes), entry.path);
  }
  assert.deepEqual(manifest.files.filter(file => file.path.startsWith('report.')).map(file => file.path).sort(), ['report.json', 'report.md']);
  return manifest;
}

test('retains exact input/evidence bytes and produces private, traceable drafts with all families', t => {
  const dir = workspace(t);
  const input = fixture();
  input.evidence[0].content += 'Café — 東京 🚲';
  // Noncanonical spacing, a BOM, and CRLF prove we retain source bytes rather
  // than merely serializing a parsed object and calling it the original.
  const original = Buffer.from(`\uFEFF${JSON.stringify(input, null, '\t').replaceAll('\n', '\r\n')}\r\n`);
  const source = writeInput(dir, input, original);
  const outputDir = join(dir, 'draft');
  const result = buildReportPackage({ inputPath: source.path, outputDir });
  assert.equal(result.state, 'draft');
  assert.equal(result.warnings.length, 0);
  assert.deepEqual(readFileSync(source.path), original);
  assert.deepEqual(readFileSync(join(outputDir, 'input.json')), original);
  const report = readJson(join(outputDir, 'report.json'));
  assert.equal(report.state, 'draft');
  assert.equal(report.fixture, true);
  assert.equal(report.semanticReview, 'required');
  assert.deepEqual(report.method, input.method);
  assert.deepEqual(report.limitations, input.limitations);
  assert.equal(report.input.sha256, hash(original));
  report.evidence.forEach((item, index) => {
    const bytes = readFileSync(join(outputDir, item.contentFile));
    assert.deepEqual(bytes, Buffer.from(input.evidence[index].content));
    assert.equal(item.contentSha256, hash(bytes));
    assert.equal(item.fixture, true);
    assert.deepEqual(item.context, input.evidence[index].context);
    assert.equal(item.capturedAt, input.evidence[index].capturedAt);
    assert.equal(item.status, input.evidence[index].status);
    assert.equal(item.family, input.evidence[index].family);
  });
  const md = readFileSync(join(outputDir, 'report.md'), 'utf8');
  for (const text of ['Website readiness', 'Ordinary search performance', 'Consumer AI answers', 'Model API benchmarks', 'State: Failed', 'State: Not measured', 'Unknown (not supplied)', 'DEC-006', 'semantic review', 'not numeric zero']) assert.ok(md.includes(text), text);
  assert.equal((md.match(/\*\*Fixture: YES/g) || []).length, 5);
  assertManifest(outputDir);
  if (process.platform !== 'win32') {
    assert.equal(lstatSync(outputDir).mode & 0o777, 0o700);
    assert.equal(lstatSync(join(outputDir, 'evidence')).mode & 0o777, 0o700);
    for (const entry of result.manifest.files) assert.equal(lstatSync(join(outputDir, entry.path)).mode & 0o777, 0o600);
  }
  assert.deepEqual(readdirSync(dir).sort(), ['draft', 'source.json']);
});

test('incomplete collection remains explicit without manufacturing evidence, context or scores', t => {
  const dir = workspace(t);
  const input = fixture();
  input.fixture = false;
  input.evidence = [input.evidence[2]];
  input.findings = [];
  input.limitations = [];
  const { path } = writeInput(dir, input);
  const outputDir = join(dir, 'draft');
  buildReportPackage({ inputPath: path, outputDir });
  const report = readJson(join(outputDir, 'report.json'));
  assert.equal(report.fixture, false);
  assert.equal(report.evidence[0].status, 'not_measured');
  assert.equal(report.evidence[0].capturedAt, null);
  assert.equal(report.evidence[0].context.model, null);
  assert.deepEqual(report.findings, []);
  assert.equal(Object.hasOwn(report, 'score'), false);
  const md = readFileSync(join(outputDir, 'report.md'), 'utf8');
  assert.match(md, /supplied declaration; provenance has not been independently verified/);
  assert.match(md, /No evidence supplied for this family; measurement is unknown/);
  assert.match(md, /No limitations supplied/);
  assertManifest(outputDir);
});

test('empty evidence is a valid explicit unknown draft, not an observed zero', t => {
  const dir = workspace(t);
  const input = fixture();
  input.evidence = [];
  input.findings = [];
  const { path } = writeInput(dir, input);
  const outputDir = join(dir, 'empty');
  buildReportPackage({ inputPath: path, outputDir });
  assert.deepEqual(readdirSync(join(outputDir, 'evidence')), []);
  assertManifest(outputDir);
});

const invalidCases = [
  ['unsupported schema', input => { input.schemaVersion = 'future'; }],
  ['unsafe report ID', input => { input.reportId = '../outside'; }],
  ['duplicate evidence IDs', input => { input.evidence[1].id = input.evidence[0].id; }],
  ['duplicate finding IDs', input => { input.findings.push(structuredClone(input.findings[0])); }],
  ['duplicate IDs across records', input => { input.findings[0].id = input.evidence[0].id; }],
  ['broken reference', input => { input.findings[0].evidenceIds = ['missing']; }],
  ['empty references', input => { input.findings[0].evidenceIds = []; }],
  ['repeated references', input => { input.findings[0].evidenceIds = ['ev-api', 'ev-api']; }],
  ['invalid calendar day', input => { input.preparedAt = '2026-02-30T00:00:00Z'; }],
  ['invalid leap day', input => { input.preparedAt = '2025-02-29T00:00:00Z'; }],
  ['invalid capture date', input => { input.evidence[0].capturedAt = '2026-13-01T00:00:00Z'; }],
  ['missing timezone', input => { input.preparedAt = '2026-09-13T12:00:00'; }],
  ['date without time', input => { input.preparedAt = '2026-09-13'; }],
  ['unsafe source scheme', input => { input.evidence[0].sourceUrl = 'javascript:alert(1)'; }],
  ['unsafe website scheme', input => { input.subject.website = 'file:///etc/passwd'; }],
  ['relative source URL', input => { input.evidence[0].sourceUrl = '/source'; }],
  ['observed without capture time', input => { input.evidence[0].capturedAt = null; }],
  ['observed without content', input => { input.evidence[0].content = '   '; }],
  ['failed without limitation', input => { input.evidence[1].limitation = ''; }],
  ['not measured without limitation', input => { input.evidence[2].limitation = ''; }],
  ['implicit unknown metadata', input => { delete input.evidence[0].context.model; }],
  ['empty metadata', input => { input.evidence[0].context.model = ''; }],
  ['unknown family', input => { input.evidence[0].family = 'combined'; }],
  ['array masquerading as family', input => { input.evidence[0].family = ['consumer_ai']; }],
  ['array masquerading as status', input => { input.evidence[0].status = ['observed']; }],
  ['object family', input => { input.evidence[0].family = {}; }],
  ['object status', input => { input.evidence[0].status = {}; }],
  ['unknown status', input => { input.evidence[0].status = 'approved'; }],
  ['nonboolean fixture', input => { input.fixture = 'false'; }],
  ['approval field', input => { input.approved = true; }],
  ['release field', input => { input.release = 'automatic'; }],
  ['nested approval field', input => { input.evidence[0].approved = true; }],
  ['unknown score field', input => { input.score = 100; }],
  ['malformed Unicode content', input => { input.evidence[0].content = '\uD800'; }],
];
for (const [name, mutate] of invalidCases) {
  test(`rejects ${name} before writing output`, t => {
    const dir = workspace(t);
    const input = fixture();
    mutate(input);
    const source = writeInput(dir, input);
    const outputDir = join(dir, 'invalid');
    assert.throws(() => buildReportPackage({ inputPath: source.path, outputDir }), ReportInputError);
    assert.equal(existsSync(outputDir), false);
    assert.deepEqual(readFileSync(source.path), source.bytes);
    assert.deepEqual(readdirSync(dir), ['source.json']);
  });
}

test('rejects malformed JSON and invalid UTF-8 without publishing anything', t => {
  const dir = workspace(t);
  for (const bytes of [Buffer.from('{'), Buffer.from([0xff, 0xfe, 0x7b]), Buffer.from('null')]) {
    const { path } = writeInput(dir, null, bytes);
    assert.throws(() => buildReportPackage({ inputPath: path, outputDir: join(dir, 'invalid') }), ReportInputError);
    assert.deepEqual(readdirSync(dir), ['source.json']);
  }
});

test('all supplied prose stays inside inert fences, including malicious fence/HTML/link content', t => {
  const dir = workspace(t);
  const input = fixture();
  const attack = 'UNTRUSTED\n```\n``````````\n# INJECTED HEADING\n<script>alert(1)</script>\n[open](javascript:alert(1))\n![fetch](https://example.invalid/track)\n~~~\nEND-UNTRUSTED';
  input.subject.name = attack;
  input.method = { id: attack, version: attack, description: attack };
  input.limitations = [attack];
  input.evidence[0].id = '../outside';
  input.evidence[0].surface = attack;
  input.evidence[0].content = attack;
  input.evidence[0].limitation = attack;
  input.evidence[0].context = Object.fromEntries(Object.keys(input.evidence[0].context).map(key => [key, attack]));
  input.findings[0] = { id: attack, text: attack, evidenceIds: ['../outside'], limitations: [attack] };
  const { path } = writeInput(dir, input);
  const outputDir = join(dir, 'draft');
  buildReportPackage({ inputPath: path, outputDir });
  assert.equal(existsSync(join(dir, 'outside')), false);
  assert.equal(readFileSync(join(outputDir, 'evidence/0001.txt'), 'utf8'), attack);
  const md = readFileSync(join(outputDir, 'report.md'), 'utf8');
  let openFence = null;
  let untrustedCount = 0;
  for (const line of md.split('\n')) {
    if (openFence === null) {
      const opening = /^(`{3,})text$/.exec(line);
      if (opening) openFence = opening[1];
      else assert.doesNotMatch(line, /UNTRUSTED|INJECTED|<script>|javascript:|!\[fetch\]/);
    } else if (new RegExp(`^${openFence}\x60*\\s*$`).test(line)) {
      openFence = null;
    } else if (line.includes('UNTRUSTED')) {
      untrustedCount++;
    }
  }
  assert.equal(openFence, null);
  assert.ok(untrustedCount > 20);
  assertManifest(outputDir);
});

test('structural validation permits questionable prose but never certifies its truth or approves it', t => {
  const dir = workspace(t);
  const input = fixture();
  input.findings[0].text = 'An unsupported claim about all consumer engines based on a failed API attempt.';
  const { path } = writeInput(dir, input);
  const outputDir = join(dir, 'draft');
  buildReportPackage({ inputPath: path, outputDir });
  const report = readJson(join(outputDir, 'report.json'));
  assert.equal(report.findings[0].text, input.findings[0].text);
  assert.equal(report.semanticReview, 'required');
  assert.match(report.reviewBoundary, /do not establish truth/);
  assert.equal(report.state, 'draft');
  assert.equal(Object.hasOwn(report, 'approved'), false);
  assert.equal(Object.hasOwn(report, 'score'), false);
});

test('identical input produces identical package bytes across directories and a separate CLI process', t => {
  const dir = workspace(t);
  const { path } = writeInput(dir);
  const first = join(dir, 'first');
  const second = join(dir, 'second');
  buildReportPackage({ inputPath: path, outputDir: first });
  const stdout = execFileSync(process.execPath, [cli, '--output', second, '--input', path], { encoding: 'utf8' });
  assert.match(stdout, /Draft package created/);
  assert.match(stdout, /No approval or release occurred/);
  const manifest = assertManifest(first);
  assertManifest(second);
  for (const file of [...manifest.files.map(item => item.path), 'manifest.json']) {
    assert.deepEqual(readFileSync(join(first, file)), readFileSync(join(second, file)), file);
  }
});

test('refuses every existing destination, including empty directories, files, symlinks and source', t => {
  const dir = workspace(t);
  const source = writeInput(dir);
  const empty = join(dir, 'empty');
  mkdirSync(empty);
  const occupied = join(dir, 'occupied');
  mkdirSync(occupied);
  writeFileSync(join(occupied, 'sentinel'), 'keep');
  const file = join(dir, 'file');
  writeFileSync(file, 'keep file');
  const symlink = join(dir, 'link');
  symlinkSync(occupied, symlink, 'dir');
  const dangling = join(dir, 'dangling');
  symlinkSync(join(dir, 'nonexistent'), dangling, 'dir');
  for (const outputDir of [empty, occupied, file, symlink, dangling, source.path]) {
    assert.throws(() => buildReportPackage({ inputPath: source.path, outputDir }), error => error.code === 'EEXIST');
  }
  assert.deepEqual(readdirSync(empty), []);
  assert.equal(readFileSync(join(occupied, 'sentinel'), 'utf8'), 'keep');
  assert.equal(readFileSync(file, 'utf8'), 'keep file');
  assert.deepEqual(readFileSync(source.path), source.bytes);
  assert.equal(readdirSync(dir).some(name => name.startsWith('.mlx-report-')), false);
});

test('filesystem failure has no successful package or staging residue', t => {
  const dir = workspace(t);
  const { path } = writeInput(dir);
  const impossible = join(dir, 'missing-parent', 'draft');
  assert.throws(() => buildReportPackage({ inputPath: path, outputDir: impossible }), error => error.code === 'ENOENT');
  assert.equal(existsSync(impossible), false);
  assert.deepEqual(readdirSync(dir), ['source.json']);
});

test('a filesystem error after partial publication removes output and never publishes a completion manifest', t => {
  const dir = workspace(t);
  const source = writeInput(dir);
  const outputDir = join(dir, 'interrupted');
  const originalLink = fs.linkSync;
  let links = 0;
  let observedPartialPublication = false;
  try {
    fs.linkSync = (...args) => {
      links++;
      if (links === 2) {
        observedPartialPublication = existsSync(join(outputDir, 'input.json'));
        assert.equal(existsSync(join(outputDir, 'manifest.json')), false);
        throw Object.assign(new Error('Simulated filesystem I/O failure'), { code: 'EIO' });
      }
      return originalLink(...args);
    };
    syncBuiltinESMExports();
    assert.throws(() => buildReportPackage({ inputPath: source.path, outputDir }), error => error.code === 'EIO');
  } finally {
    fs.linkSync = originalLink;
    syncBuiltinESMExports();
  }
  assert.equal(observedPartialPublication, true);
  assert.equal(existsSync(outputDir), false);
  assert.deepEqual(readFileSync(source.path), source.bytes);
  assert.deepEqual(readdirSync(dir), ['source.json']);
});

test('two concurrent CLI builders cannot overwrite or combine output', async t => {
  const dir = workspace(t);
  const { path } = writeInput(dir);
  const outputDir = join(dir, 'contested');
  const results = await Promise.allSettled([1, 2].map(() => execute(process.execPath, [cli, '--input', path, '--output', outputDir])));
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter(result => result.status === 'rejected').length, 1);
  assert.match(results.find(result => result.status === 'rejected').reason.stderr, /Report build failed/);
  assertManifest(outputDir);
  assert.equal(readdirSync(dir).some(name => name.startsWith('.mlx-report-')), false);
});

test('CLI rejects release/approval options and malformed arguments without producing output', t => {
  const dir = workspace(t);
  const { path } = writeInput(dir);
  const outputDir = join(dir, 'draft');
  for (const extra of [['--release'], ['--approved', 'true'], ['--input', path]]) {
    assert.throws(() => execFileSync(process.execPath, [cli, '--input', path, '--output', outputDir, ...extra], { stdio: 'pipe' }), error => error.status === 1);
    assert.equal(existsSync(outputDir), false);
  }
  assert.throws(() => execFileSync(process.execPath, [cli], { stdio: 'pipe' }), error => error.status === 1);
  assert.match(execFileSync(process.execPath, [cli, '--help'], { encoding: 'utf8' }), /No approval, release or network action/);
});
