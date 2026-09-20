import { DatabaseSync, backup } from 'node:sqlite';
import { constants } from 'node:fs';
import { chmod, lstat, mkdir, mkdtemp, open, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { openDatabase } from './database.mjs';
import { createReportRevisions } from './report-revisions.mjs';

const FORMAT = 'mlx-local-database-backup-v1';
const TABLES = ['metadata', 'clients', 'reviews', 'panels', 'leads', 'activity', 'report_revisions', 'report_preparation_attempts'];
const DATABASE_LIMIT = 1024 * 1024 * 1024; // Bounded local tool, not production storage policy.
const MANIFEST_LIMIT = 64 * 1024;
const sha = value => createHash('sha256').update(value).digest('hex');
const fail = message => { throw new Error(message); };
const schema = db => db.prepare("SELECT type,name,tbl_name,sql FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' ORDER BY type,name").all();
let expectedSchema;

function inspectDatabase(path) {
  const db = new DatabaseSync(path, { readOnly: true });
  try {
    db.exec('PRAGMA trusted_schema=OFF');
    const integrity = db.prepare('PRAGMA integrity_check').all();
    if (integrity.length !== 1 || integrity[0].integrity_check !== 'ok') fail('Database integrity check failed.');
    if (!expectedSchema) {
      const reference = openDatabase(':memory:', false);
      try { expectedSchema = schema(reference); } finally { reference.close(); }
    }
    const actualSchema = schema(db);
    // c00da406 backups predate preparation attempts. Accept that exact schema too;
    // preserve it during verification, then normal app open adds the empty table.
    const legacySchema = expectedSchema.filter(row => row.tbl_name !== 'report_preparation_attempts');
    if (!isDeepStrictEqual(actualSchema, expectedSchema) && !isDeepStrictEqual(actualSchema, legacySchema)) fail('Unsupported database schema; use the matching application version.');
    if (db.prepare('PRAGMA foreign_key_check').all().length) fail('Database foreign-key check failed.');
    if (db.prepare("SELECT value FROM metadata WHERE key='initialized'").get()?.value !== '1') fail('Database is not initialized.');
    const available = new Set(actualSchema.filter(row => row.type === 'table').map(row => row.name));
    const counts = Object.fromEntries(TABLES.filter(table => available.has(table)).map(table => [table, db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n]));
    const revisions = createReportRevisions({ db });
    for (const { id } of db.prepare('SELECT id FROM report_revisions').iterate()) revisions.verify(id);
    return { counts, schemaSha256: sha(JSON.stringify(actualSchema)) };
  } finally { db.close(); }
}

async function regularFile(path, limit) {
  // O_NONBLOCK prevents a FIFO from hanging before fstat; O_NOFOLLOW rejects symlinks.
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const info = await file.stat();
    if (!info.isFile() || info.size === 0 || info.size > limit) fail('Input must be a nonempty regular file within the local size limit.');
    return file;
  } catch (error) { await file.close(); throw error; }
}

async function copyAndHash(source, destination) {
  const input = await regularFile(source, DATABASE_LIMIT);
  let output;
  try {
    output = await open(destination, 'wx', 0o600);
    const digest = createHash('sha256');
    const buffer = Buffer.alloc(64 * 1024);
    let bytes = 0;
    while (true) {
      const read = await input.read(buffer, 0, buffer.length, null);
      if (!read.bytesRead) break;
      bytes += read.bytesRead;
      if (bytes > DATABASE_LIMIT) fail('Database exceeds the local size limit.');
      const chunk = buffer.subarray(0, read.bytesRead);
      digest.update(chunk);
      await output.writeFile(chunk);
    }
    await output.sync();
    return { bytes, sha256: digest.digest('hex') };
  } finally { await output?.close(); await input.close(); }
}

async function hashFile(path) {
  const input = await regularFile(path, DATABASE_LIMIT);
  try {
    const digest = createHash('sha256');
    let bytes = 0;
    for await (const chunk of input.createReadStream()) {
      bytes += chunk.length;
      if (bytes > DATABASE_LIMIT) fail('Database exceeds the local size limit.');
      digest.update(chunk);
    }
    return { bytes, sha256: digest.digest('hex') };
  } finally { await input.close(); }
}

async function writeJSON(path, value) {
  const file = await open(path, 'wx', 0o600);
  try { await file.writeFile(`${JSON.stringify(value, null, 2)}\n`); await file.sync(); }
  finally { await file.close(); }
}

async function newDirectory(path) {
  const destination = resolve(path);
  // Nonrecursive mkdir is the exclusive claim, including for concurrent invocations.
  // Parent must already exist. Never remove a directory unless this operation created it.
  await mkdir(destination, { mode: 0o700 });
  return destination;
}

async function manifestAt(bundle, expectedSha256) {
  if (!(await lstat(bundle)).isDirectory()) fail('Backup must be a directory, not a link.');
  const names = (await readdir(bundle)).sort();
  if (!isDeepStrictEqual(names, ['manifest.json', 'workspace.sqlite'])) fail('Backup must contain only manifest.json and workspace.sqlite; incomplete bundles and journal companions are refused.');
  const file = await regularFile(join(bundle, 'manifest.json'), MANIFEST_LIMIT);
  let manifest;
  try {
    const buffer = Buffer.alloc(MANIFEST_LIMIT + 1);
    let size = 0;
    while (size < buffer.length) {
      const read = await file.read(buffer, size, buffer.length - size, null);
      if (!read.bytesRead) break;
      size += read.bytesRead;
    }
    if (size > MANIFEST_LIMIT) fail('Manifest exceeds the local size limit.');
    manifest = JSON.parse(buffer.subarray(0, size).toString('utf8'));
  } finally { await file.close(); }
  if (manifest?.format !== FORMAT || manifest.database?.file !== 'workspace.sqlite'
    || !Number.isSafeInteger(manifest.database.bytes) || manifest.database.bytes <= 0
    || manifest.database.bytes > DATABASE_LIMIT || !/^[a-f0-9]{64}$/.test(manifest.database.sha256)
    || !/^[a-f0-9]{64}$/.test(manifest.schemaSha256) || !manifest.counts) fail('Unsupported or invalid backup manifest.');
  if (expectedSha256 !== undefined && (!/^[a-f0-9]{64}$/.test(expectedSha256) || manifest.database.sha256 !== expectedSha256)) fail('Backup does not match the expected database SHA-256.');
  return manifest;
}

async function verifiedCopy(bundle, destination, expectedSha256) {
  const manifest = await manifestAt(resolve(bundle), expectedSha256);
  const database = await copyAndHash(join(bundle, 'workspace.sqlite'), destination);
  if (database.sha256 !== manifest.database.sha256 || database.bytes !== manifest.database.bytes) fail('Backup database checksum or size mismatch.');
  // Inspect a private copy: SQLite cannot consume unverified adjacent WAL/SHM files
  // or change the backup, and concurrent edits cannot change the verified output.
  const inspection = inspectDatabase(destination);
  if (!isDeepStrictEqual(inspection.counts, manifest.counts) || inspection.schemaSha256 !== manifest.schemaSha256) fail('Backup inventory mismatch.');
  return { manifest, database, ...inspection };
}

export async function backupDatabase(source, destination) {
  const sourcePath = resolve(source);
  const input = await regularFile(sourcePath, DATABASE_LIMIT);
  await input.close();
  const directory = await newDirectory(destination);
  let db;
  try {
    const path = join(directory, 'workspace.sqlite');
    // Reserve private mode before SQLite opens the destination.
    const output = await open(path, 'wx', 0o600);
    await output.close();
    db = new DatabaseSync(sourcePath, { readOnly: true });
    await backup(db, path);
    db.close(); db = undefined;
    const snapshot = new DatabaseSync(path);
    try { snapshot.exec('PRAGMA journal_mode=DELETE'); } finally { snapshot.close(); }
    await chmod(path, 0o600);
    const inspection = inspectDatabase(path);
    const database = await hashFile(path);
    const manifest = {
      format: FORMAT, createdAt: new Date().toISOString(), runtime: process.version,
      database: { file: 'workspace.sqlite', ...database }, ...inspection,
      boundary: 'Local database snapshot only. External files, credentials and configuration are excluded. Hashes detect corruption, not authenticity. No off-device recovery or retention policy is established.',
    };
    // Manifest written last. An interrupted/incomplete bundle cannot verify.
    await writeJSON(join(directory, 'manifest.json'), manifest);
    return { status: 'verified', operation: 'backup', directory, ...database, ...inspection };
  } catch (error) {
    db?.close();
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

export async function verifyDatabaseBackup(bundle, { expectedSha256 } = {}) {
  const scratch = await mkdtemp(join(tmpdir(), 'mlx-backup-check-'));
  try {
    const result = await verifiedCopy(bundle, join(scratch, 'workspace.sqlite'), expectedSha256);
    return { status: 'verified', operation: 'verify', ...result.database, counts: result.counts, schemaSha256: result.schemaSha256 };
  } finally { await rm(scratch, { recursive: true, force: true }); }
}

export async function restoreDatabaseBackup(bundle, destination, { expectedSha256 } = {}) {
  const directory = await newDirectory(destination);
  try {
    const path = join(directory, 'workspace.sqlite');
    const result = await verifiedCopy(bundle, path, expectedSha256);
    const receipt = { status: 'verified', operation: 'restore', databasePath: path, ...result.database, counts: result.counts, schemaSha256: result.schemaSha256 };
    await writeJSON(join(directory, 'recovery.json'), { ...receipt, restoredAt: new Date().toISOString(), boundary: result.manifest.boundary });
    return receipt;
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}
