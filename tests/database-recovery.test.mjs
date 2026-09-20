import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { openDatabase } from '../server/database.mjs';
import { createReportRevisions } from '../server/report-revisions.mjs';
import { createApp } from '../server/app.mjs';
import { backupDatabase, verifyDatabaseBackup, restoreDatabaseBackup } from '../server/database-recovery.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const cli = resolve('scripts/database-recovery.mjs');
const tables = ['metadata', 'clients', 'reviews', 'panels', 'leads', 'activity', 'report_revisions'];
const rows = db => Object.fromEntries(tables.map(table => [table, db.prepare(`SELECT * FROM ${table} ORDER BY ${table === 'metadata' ? 'key' : 'id'}`).all()]));
const exists = async path => lstat(path).then(() => true, error => { if (error.code === 'ENOENT') return false; throw error; });

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'mlx-recovery-test-'));
  const source = join(root, 'source.sqlite');
  const db = openDatabase(source, false);
  let open = true;
  const close = () => { if (open) { db.close(); open = false; } };
  t.after(async () => { close(); await rm(root, { recursive: true, force: true }); });
  return { root, source, db, close, bundle: join(root, 'backup') };
}

function client(db, id = 'client-1', domain = 'fixture.test') {
  db.prepare("INSERT INTO clients (id,name,domain,status,stage,created_at) VALUES (?, 'Recovery fixture', ?, 'active', 1, '2026-09-20T12:00:00Z')").run(id, domain);
}

async function rehash(bundle) {
  const path = join(bundle, 'manifest.json');
  const manifest = JSON.parse(await readFile(path, 'utf8'));
  const bytes = await readFile(join(bundle, 'workspace.sqlite'));
  manifest.database.sha256 = sha(bytes);
  manifest.database.bytes = bytes.length;
  await writeFile(path, JSON.stringify(manifest));
}

test('REC-01: captures committed WAL, all records and real PDF; fresh app restores exact bytes without source', async t => {
  const f = await fixture(t);
  f.db.exec('PRAGMA wal_autocheckpoint=0; PRAGMA wal_checkpoint(TRUNCATE)');
  const baselineMain = await readFile(f.source);
  client(f.db);
  for (let version = 1; version <= 2; version++) {
    f.db.prepare('INSERT INTO panels (id,client_id,version,prompts,note,created_at) VALUES (?,?,?,?,?,?)')
      .run(`panel-${version}`, 'client-1', version, JSON.stringify([{ id: 'Q001', text: `Question version ${version}` }]), `Version ${version}`, '2026-09-20T12:00:00Z');
  }
  f.db.prepare("INSERT INTO leads (id,email,domain,source,kind,consent,created_at) VALUES ('lead-1','synthetic@example.test','fixture.test','fixture','audit',1,'2026-09-20T12:00:00Z')").run();
  const evidence = join(f.root, 'evidence.json');
  const sourceBytes = Buffer.from(JSON.stringify([
    { engine: 'chatgpt', prompt: 'Which service?', response_id: 'a', timestamp: '2026-09-20T12:00:00Z', response_text: 'MindLeverX.' },
    { engine: 'copilot', prompt: 'Which service?', response_id: 'b', timestamp: '2026-09-20T12:00:00Z', response_text: 'Another service.' },
  ]));
  await writeFile(evidence, sourceBytes);
  const reports = createReportRevisions({ db: f.db, evidenceInputPath: evidence, evidenceBrand: 'MindLeverX', evidenceSubjectDomain: 'fixture.test', pdfPython: process.env.MLX_PDF_PYTHON });
  const { revision } = await reports.prepare('client-1', { sourceSha256: sha(sourceBytes) });
  const expected = rows(f.db);
  assert.equal(expected.reviews[0].status, 'pending');
  assert.equal(expected.activity.length, 1);
  assert.equal(expected.report_revisions.length, 1);
  assert.match(Buffer.from(expected.report_revisions[0].pdf_bytes).toString('latin1'), /^%PDF-/);
  assert.ok((await stat(`${f.source}-wal`)).size > 0);
  assert.deepEqual(await readFile(f.source), baselineMain, 'fixtures exist only in WAL before backup');
  const mainBefore = await readFile(f.source), walBefore = await readFile(`${f.source}-wal`);
  const backed = await backupDatabase(f.source, f.bundle);
  assert.deepEqual(await readFile(f.source), mainBefore);
  assert.deepEqual(await readFile(`${f.source}-wal`), walBefore);
  assert.equal(backed.counts.panels, 2);
  assert.equal(backed.counts.report_revisions, 1);
  assert.equal((await verifyDatabaseBackup(f.bundle, { expectedSha256: backed.sha256 })).sha256, backed.sha256);
  f.close();
  await rm(f.source);
  await rm(evidence);
  const result = await restoreDatabaseBackup(f.bundle, join(f.root, 'restored'), { expectedSha256: backed.sha256 });
  const app = createApp({ dbPath: result.databasePath, seed: false });
  try {
    assert.deepEqual(rows(app.db), expected);
    const recovered = createReportRevisions({ db: app.db });
    assert.equal(recovered.verify(revision.id).snapshotSha256, revision.snapshotSha256);
    assert.deepEqual(recovered.bytes(revision.id, 'source'), sourceBytes);
    assert.equal(recovered.get(revision.id).report.aggregate.numerator, 1);
    assert.equal(recovered.get(revision.id).report.aggregate.denominator, 2);
    assert.throws(() => app.db.prepare("UPDATE report_revisions SET pdf_bytes=X'00'").run(), /immutable/);
    client(app.db, 'after-recovery', 'new.test');
    assert.equal(app.db.prepare('SELECT COUNT(*) AS n FROM clients').get().n, 2);
  } finally { await app.close(); }
  const reopened = openDatabase(result.databasePath, false);
  assert.equal(reopened.prepare('SELECT COUNT(*) AS n FROM clients').get().n, 2);
  reopened.close();
  assert.equal((await verifyDatabaseBackup(f.bundle)).sha256, backed.sha256, 'restoring and editing do not change backup');
});

test('REC-01b: decided review note, timestamp and activity survive restoration', async t => {
  const f = await fixture(t); client(f.db);
  f.db.prepare("INSERT INTO reviews (id,client_id,kind,title,summary,body,evidence,status,created_at,decided_at,note) VALUES ('review-1','client-1','finding','Fixture','Summary','Body','[]','returned','2026-09-20T12:00:00Z','2026-09-20T12:01:00Z','Synthetic return note')").run();
  f.db.prepare("INSERT INTO activity VALUES ('event-1','Review returned','review','review-1','Local operator','Synthetic return','2026-09-20T12:01:00Z')").run();
  const expected = rows(f.db);
  await backupDatabase(f.source, f.bundle);
  const restored = await restoreDatabaseBackup(f.bundle, join(f.root, 'restored'));
  const db = openDatabase(restored.databasePath, false);
  try { assert.deepEqual(rows(db), expected); } finally { db.close(); }
});

test('REC-02: existing files, directories and symlinks are preserved; concurrent output claim has one winner', async t => {
  const f = await fixture(t);
  await backupDatabase(f.source, f.bundle);
  const sentinel = join(f.root, 'sentinel');
  await writeFile(sentinel, 'keep');
  const link = join(f.root, 'link'); await symlink(sentinel, link);
  const directory = join(f.root, 'directory'); await mkdir(directory);
  await writeFile(join(directory, 'keep'), 'preserved');
  for (const path of [sentinel, link, directory, f.source, f.bundle]) {
    await assert.rejects(backupDatabase(f.source, path), { code: 'EEXIST' });
    await assert.rejects(restoreDatabaseBackup(f.bundle, path), { code: 'EEXIST' });
  }
  assert.equal(await readFile(sentinel, 'utf8'), 'keep');
  assert.equal(await readFile(join(directory, 'keep'), 'utf8'), 'preserved');
  const destination = join(f.root, 'contended');
  const results = await Promise.allSettled([backupDatabase(f.source, destination), backupDatabase(f.source, destination)]);
  assert.deepEqual(results.map(result => result.status).sort(), ['fulfilled', 'rejected']);
  assert.equal((await verifyDatabaseBackup(destination)).status, 'verified');
});

test('REC-03: checksum, manifest, foreign keys and schema corruption fail and remove partial restore', async t => {
  const f = await fixture(t); client(f.db);
  f.db.prepare("INSERT INTO panels VALUES ('panel-1','client-1',1,'[]','fixture',0,'2026-09-20T12:00:00Z')").run();
  await backupDatabase(f.source, f.bundle);
  const mutations = {
    checksum: async bundle => { await writeFile(join(bundle, 'workspace.sqlite'), 'not a database'); },
    manifest: async bundle => { const m = JSON.parse(await readFile(join(bundle, 'manifest.json'))); m.database.sha256 = '0'.repeat(64); await writeFile(join(bundle, 'manifest.json'), JSON.stringify(m)); },
    schema: async bundle => { const db = new DatabaseSync(join(bundle, 'workspace.sqlite')); db.exec('DROP TABLE activity'); db.close(); await rehash(bundle); },
    foreignKey: async bundle => { const db = new DatabaseSync(join(bundle, 'workspace.sqlite')); db.exec("PRAGMA foreign_keys=OFF; UPDATE panels SET client_id='missing'"); db.close(); await rehash(bundle); },
    counts: async bundle => { const m = JSON.parse(await readFile(join(bundle, 'manifest.json'))); m.counts.clients = 999; await writeFile(join(bundle, 'manifest.json'), JSON.stringify(m)); },
  };
  for (const [name, mutate] of Object.entries(mutations)) {
    const bundle = join(f.root, name); await cp(f.bundle, bundle, { recursive: true }); await mutate(bundle);
    await assert.rejects(verifyDatabaseBackup(bundle));
    const output = join(f.root, `${name}-restore`);
    await assert.rejects(restoreDatabaseBackup(bundle, output));
    assert.equal(await exists(output), false);
  }
});

test('REC-03b: stored report corruption fails even if outer database checksum is updated', async t => {
  const f = await fixture(t); client(f.db);
  const evidence = join(f.root, 'evidence.json');
  const bytes = Buffer.from(JSON.stringify([{ engine: 'chatgpt', prompt: 'Question?', response_id: 'a', timestamp: '2026-09-20T12:00:00Z', response_text: 'MindLeverX' }]));
  await writeFile(evidence, bytes);
  const reports = createReportRevisions({ db: f.db, evidenceInputPath: evidence, evidenceBrand: 'MindLeverX', evidenceSubjectDomain: 'fixture.test', pdfRenderer: async () => Buffer.from('%PDF-1.4\nSynthetic test seam\n%%EOF\n') });
  await reports.prepare('client-1', { sourceSha256: sha(bytes) });
  await backupDatabase(f.source, f.bundle);
  const db = new DatabaseSync(join(f.bundle, 'workspace.sqlite'));
  const trigger = db.prepare("SELECT sql FROM sqlite_schema WHERE name='report_revisions_no_update'").get().sql;
  db.exec("DROP TRIGGER report_revisions_no_update; UPDATE report_revisions SET pdf_bytes=X'00'");
  db.exec(trigger); db.close(); await rehash(f.bundle);
  await assert.rejects(verifyDatabaseBackup(f.bundle), /revision failed its integrity check/);
  await assert.rejects(restoreDatabaseBackup(f.bundle, join(f.root, 'restored')), /revision failed its integrity check/);
  assert.equal(await exists(join(f.root, 'restored')), false);
});

test('REC-04: missing, empty, special and unrelated sources fail without creating data or partial output', async t => {
  const f = await fixture(t);
  const empty = join(f.root, 'empty'); await writeFile(empty, '');
  const junk = join(f.root, 'junk'); await writeFile(junk, 'not SQLite');
  const linked = join(f.root, 'linked'); await symlink(f.source, linked);
  const fifo = join(f.root, 'fifo'); execFileSync('mkfifo', [fifo]);
  const unrelated = join(f.root, 'unrelated'); const db = new DatabaseSync(unrelated); db.exec('CREATE TABLE unrelated (id TEXT)'); db.close();
  for (const source of [join(f.root, 'missing'), empty, junk, linked, fifo, f.root, unrelated]) {
    const output = join(f.root, 'invalid-output');
    const process = spawnSync(globalThis.process.execPath, [cli, 'backup', '--source', source, '--output', output], { encoding: 'utf8', timeout: 5000 });
    assert.equal(process.status, 1, process.stderr);
    assert.equal(await exists(output), false);
  }
  assert.equal(await exists(join(f.root, 'missing')), false);
});

test('REC-04b: bundle links, companions, malformed/oversized manifests and FIFO database are refused promptly', async t => {
  const f = await fixture(t); await backupDatabase(f.source, f.bundle);
  for (const extra of ['workspace.sqlite-wal', 'workspace.sqlite-shm', 'workspace.sqlite-journal']) {
    await writeFile(join(f.bundle, extra), 'unverified');
    await assert.rejects(verifyDatabaseBackup(f.bundle), /companions/);
    await rm(join(f.bundle, extra));
  }
  const linked = join(f.root, 'linked'); await symlink(f.bundle, linked);
  await assert.rejects(verifyDatabaseBackup(linked), /not a link/);
  const manifest = await readFile(join(f.bundle, 'manifest.json'));
  for (const bytes of [Buffer.from('{'), Buffer.alloc(65537, 'x')]) {
    await writeFile(join(f.bundle, 'manifest.json'), bytes);
    await assert.rejects(verifyDatabaseBackup(f.bundle));
  }
  await writeFile(join(f.bundle, 'manifest.json'), manifest);
  await rm(join(f.bundle, 'workspace.sqlite')); execFileSync('mkfifo', [join(f.bundle, 'workspace.sqlite')]);
  const result = spawnSync(process.execPath, [cli, 'verify', '--input', f.bundle], { encoding: 'utf8', timeout: 5000 });
  assert.equal(result.status, 1, result.stderr);
});

test('REC-05: CLI works from another directory, restricts files, pins expected hash and rejects ambiguous arguments', async t => {
  const f = await fixture(t); client(f.db);
  const call = args => spawnSync(process.execPath, [cli, ...args], { cwd: f.root, encoding: 'utf8', timeout: 10000 });
  const backup = call(['backup', '--source', f.source, '--output', f.bundle]);
  assert.equal(backup.status, 0, backup.stderr);
  const receipt = JSON.parse(backup.stdout);
  assert.equal(receipt.counts.clients, 1);
  assert.ok(!backup.stdout.includes('Recovery fixture'));
  assert.equal(call(['verify', '--input', f.bundle, '--expected-sha256', receipt.sha256]).status, 0);
  assert.equal(call(['verify', '--input', f.bundle, '--expected-sha256', '0'.repeat(64)]).status, 1);
  const output = join(f.root, 'restored');
  assert.equal(call(['restore', '--input', f.bundle, '--output', output, '--expected-sha256', '0'.repeat(64)]).status, 1);
  assert.equal(await exists(output), false);
  const restored = call(['restore', '--input', f.bundle, '--output', output, '--expected-sha256', receipt.sha256]);
  assert.equal(restored.status, 0, restored.stderr);
  for (const directory of [f.bundle, output]) {
    assert.equal((await stat(directory)).mode & 0o777, 0o700);
    for (const file of await readdir(directory)) assert.equal((await stat(join(directory, file))).mode & 0o777, 0o600);
  }
  for (const args of [[], ['backup'], ['restore', '--input', f.bundle], ['verify', '--input', f.bundle, '--input', f.bundle], ['verify', '--unexpected', f.bundle]]) assert.equal(call(args).status, 1);
  assert.equal(call(['--help']).status, 0);
  const ignored = execFileSync('git', ['check-ignore', 'backups/example/manifest.json', 'elsewhere/workspace.sqlite', 'elsewhere/workspace.sqlite-wal'], { encoding: 'utf8' });
  assert.equal(ignored.trim().split('\n').length, 3);
});
