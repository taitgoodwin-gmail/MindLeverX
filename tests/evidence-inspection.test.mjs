import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, lstatSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { inspectEvidence } from '../server/evidence-inspection.mjs';

const cli = resolve(dirname(fileURLToPath(import.meta.url)), '../scripts/inspect-evidence.mjs');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const encode = input => Buffer.from(JSON.stringify(input));
const inspect = records => inspectEvidence(encode(records), { brand: 'MindLeverX' });
const fixture = () => [
  { response_id: 'synthetic-1', engine: 'synthetic-a', timestamp: '2026-09-18T00:00:00Z', prompt: 'Fictional question?', response_text: 'MiNdLeVeRx and MindLeverX' },
  { response_id: 'synthetic-2', engine: 'synthetic-b', timestamp: '2026-09-18T00:00:00Z', prompt: 'Fictional question?', response_text: 'Another agency' },
];
function workspace(t) {
  const dir = mkdtempSync(join(tmpdir(), 'mlx-inspection-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function execute(input, output, more = []) {
  return spawnSync(process.execPath, [cli, '--input', input, '--brand', 'MindLeverX', '--output', output, ...more], { encoding: 'utf8' });
}

test('TC-INS-01 counts answer records once with explicit scope and unaccepted qualification', () => {
  const result = inspect(fixture());
  assert.equal(result.status, 'complete');
  assert.equal(result.aggregate.numerator, 1);
  assert.equal(result.aggregate.denominator, 2);
  assert.deepEqual(result.rows.map(row => row.literalMention), [true, false]);
  assert.equal(result.collectionQualification, 'required');
  assert.equal(result.clientRelease, 'not_authorized_by_inspection');
  assert.equal(result.rows[0].engine, 'synthetic-a');
  assert.ok(result.limitations.some(item => item.includes('not all attempts')));
  assert.ok(!JSON.stringify(result).includes('MiNdLeVeRx and MindLeverX'), 'Raw answer bodies must not be emitted');
});

test('TC-INS-02 excludes prompt, citation and vendor brand flags, preserving source bytes', () => {
  const rows = fixture();
  rows.forEach(row => { row.response_text = 'Another agency'; });
  rows[1].prompt = 'MindLeverX';
  rows[1].citations = ['https://mindleverx.com'];
  rows[1].brand_mentioned = true;
  const bytes = encode(rows);
  const original = Buffer.from(bytes);
  const result = inspectEvidence(bytes, { brand: 'MindLeverX' });
  assert.equal(result.aggregate.numerator, 0);
  assert.equal(result.aggregate.denominator, 2);
  assert.deepEqual(bytes, original);
});

test('TC-INS-03 missing answers block the full aggregate without shrinking the denominator', () => {
  for (const value of [undefined, '', ' \n\t ', 0, null]) {
    const rows = fixture();
    rows[1].response_text = value;
    const result = inspect(rows);
    assert.equal(result.status, 'blocked');
    assert.equal(result.aggregate, null);
    assert.equal(result.recordCount, 2);
    assert.equal(result.rows[1].literalMention, null);
    assert.ok(result.issues.some(item => item.row === 2 && item.field === 'response_text' && item.severity === 'error'));
  }
});

test('TC-INS-04 invalid input or attribution blocks with actionable diagnostics', () => {
  for (const field of ['prompt', 'engine']) {
    const rows = fixture();
    delete rows[0][field];
    const result = inspect(rows);
    assert.equal(result.aggregate, null);
    assert.ok(result.issues.some(item => item.row === 1 && item.field === field));
  }
  for (const records of [[null], [[]], [], {}, 'wrong shape']) {
    const result = inspect(records);
    assert.equal(result.status, 'blocked');
    assert.equal(result.aggregate, null);
    assert.ok(result.issues.length > 0);
  }
  for (const bytes of [Buffer.from('{bad'), Buffer.from([0xff])]) {
    const result = inspectEvidence(bytes, { brand: 'MindLeverX' });
    assert.equal(result.status, 'blocked');
    assert.equal(result.aggregate, null);
    assert.equal(result.issues[0].code, 'invalid_json_or_utf8');
  }
});

test('TC-INS-05 cross-engine repeated IDs retain rows; ambiguous duplicate observations block', () => {
  const rows = fixture();
  rows[1].response_id = rows[0].response_id;
  const crossEngine = inspect(rows);
  assert.equal(crossEngine.status, 'complete');
  assert.equal(crossEngine.aggregate.denominator, 2);
  assert.ok(crossEngine.issues.some(item => item.code === 'repeated_vendor_response_id' && item.row === 2));
  rows[1].engine = rows[0].engine;
  const duplicate = inspect(rows);
  assert.equal(duplicate.status, 'blocked');
  assert.equal(duplicate.aggregate, null);
  assert.equal(duplicate.rows.length, 2);
  assert.ok(duplicate.issues.some(item => item.code === 'duplicate_observation_identity' && item.row === 2));
});

test('TC-INS-06 missing metadata stays unknown without implying collection qualification', () => {
  const rows = fixture();
  delete rows[0].response_id;
  delete rows[0].timestamp;
  const result = inspect(rows);
  assert.equal(result.status, 'complete');
  assert.equal(result.rows[0].vendorResponseId, null);
  assert.equal(result.rows[0].vendorTimestamp, null);
  assert.equal(result.issues.filter(item => item.code === 'metadata_missing_or_invalid').length, 2);
  assert.equal(result.collectionQualification, 'required');
});

test('TC-INS-07 wrong fingerprint blocks; correct fingerprint preserves exact source identity', () => {
  const bytes = Buffer.from(`\uFEFF${JSON.stringify(fixture(), null, 2)}\r\n`);
  const blocked = inspectEvidence(bytes, { brand: 'MindLeverX', expectedSha256: '0'.repeat(64) });
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.aggregate, null);
  assert.equal(blocked.issues[0].code, 'source_hash_mismatch');
  const complete = inspectEvidence(bytes, { brand: 'MindLeverX', expectedSha256: hash(bytes).toUpperCase() });
  assert.equal(complete.status, 'complete');
  assert.equal(complete.source.sha256, hash(bytes));
  assert.equal(complete.source.bytes, bytes.length);
});

test('TC-INS-08 CLI writes deterministic private output and refuses existing files or symlinks', t => {
  const dir = workspace(t);
  const input = join(dir, 'input.json');
  const output = join(dir, 'result.json');
  const second = join(dir, 'second.json');
  const original = encode(fixture());
  writeFileSync(input, original);
  assert.equal(execute(input, output).status, 0);
  assert.equal(JSON.parse(readFileSync(output)).aggregate.numerator, 1);
  assert.equal(execute(input, second).status, 0);
  const savedResult = readFileSync(output);
  assert.deepEqual(readFileSync(second), savedResult);
  assert.equal(execute(input, output).status, 1);
  assert.deepEqual(readFileSync(output), savedResult);
  assert.equal(execute(input, input).status, 1);
  const link = join(dir, 'link.json');
  symlinkSync(input, link);
  assert.equal(execute(input, link).status, 1);
  assert.deepEqual(readFileSync(input), original);
  if (process.platform !== 'win32') assert.equal(lstatSync(output).mode & 0o777, 0o600);
});

test('TC-INS-09 CLI distinguishes blocked data from invocation and filesystem failures', t => {
  const dir = workspace(t);
  const input = join(dir, 'input.json');
  const output = join(dir, 'result.json');
  const rows = fixture();
  rows[0].response_text = '';
  writeFileSync(input, encode(rows));
  assert.equal(execute(input, output).status, 2);
  const result = JSON.parse(readFileSync(output));
  assert.equal(result.aggregate, null);
  assert.equal(result.status, 'blocked');
  const unused = join(dir, 'unused.json');
  for (const extra of [['--brand', 'duplicate'], ['--unexpected', 'x'], ['--expected-sha256', 'bad']]) {
    assert.equal(execute(input, unused, extra).status, 1);
    assert.equal(existsSync(unused), false);
  }
  assert.equal(execute(join(dir, 'missing.json'), unused).status, 1);
  assert.equal(existsSync(unused), false);
  assert.equal(spawnSync(process.execPath, [cli, '--input', input], { encoding: 'utf8' }).status, 1);
  assert.equal(spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8' }).status, 0);
});

test('invalid checker options fail without silently selecting a brand', () => {
  for (const brand of [undefined, '', '   ', 1]) assert.throws(() => inspectEvidence(encode(fixture()), { brand }));
  assert.throws(() => inspectEvidence('not bytes', { brand: 'MindLeverX' }));
});
