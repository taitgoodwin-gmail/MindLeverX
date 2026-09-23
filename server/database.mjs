import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { seedDatabase } from './seed.mjs';

export function openDatabase(path, seed = true) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT NOT NULL UNIQUE COLLATE NOCASE,
      status TEXT NOT NULL CHECK(status IN ('active','paused')),
      stage INTEGER NOT NULL CHECK(stage BETWEEN 1 AND 7), notes TEXT NOT NULL DEFAULT '',
      score REAL, previous_score REAL, sample INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY, client_id TEXT NOT NULL REFERENCES clients(id),
      kind TEXT NOT NULL CHECK(kind IN ('report','finding','anomaly')),
      title TEXT NOT NULL, summary TEXT NOT NULL, body TEXT NOT NULL, evidence TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending','approved','returned')),
      sample INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, decided_at TEXT, note TEXT
    );
    CREATE TABLE IF NOT EXISTS panels (
      id TEXT PRIMARY KEY, client_id TEXT NOT NULL REFERENCES clients(id), version INTEGER NOT NULL,
      prompts TEXT NOT NULL, note TEXT NOT NULL, sample INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL, UNIQUE(client_id, version)
    );
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY, email TEXT NOT NULL, domain TEXT NOT NULL, source TEXT NOT NULL,
      kind TEXT NOT NULL CHECK(kind IN ('audit','subscription')),
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewed','archived')),
      consent INTEGER NOT NULL, created_at TEXT NOT NULL, sample INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS leads_recent ON leads(email,kind,created_at);
    CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY, action TEXT NOT NULL, entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL, actor TEXT NOT NULL, detail TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS report_revisions (
      id TEXT PRIMARY KEY, client_id TEXT NOT NULL REFERENCES clients(id),
      version INTEGER NOT NULL CHECK(version > 0), review_id TEXT NOT NULL UNIQUE REFERENCES reviews(id),
      source_sha256 TEXT NOT NULL, processing_identity TEXT NOT NULL,
      source_bytes BLOB NOT NULL, report_bytes BLOB NOT NULL, pdf_bytes BLOB NOT NULL,
      snapshot_json TEXT NOT NULL, snapshot_sha256 TEXT NOT NULL, created_at TEXT NOT NULL,
      UNIQUE(client_id, version), UNIQUE(client_id, source_sha256, processing_identity)
    );
    CREATE TRIGGER IF NOT EXISTS report_revisions_no_update
      BEFORE UPDATE ON report_revisions BEGIN
        SELECT RAISE(ABORT, 'Stored report revisions are immutable; create a successor.');
      END;
    CREATE TABLE IF NOT EXISTS report_preparation_attempts (
      id TEXT PRIMARY KEY, client_id TEXT NOT NULL REFERENCES clients(id),
      source_sha256 TEXT NOT NULL, processing_identity TEXT NOT NULL,
      attempt INTEGER NOT NULL CHECK(attempt > 0),
      status TEXT NOT NULL CHECK(status IN ('running','succeeded','failed','interrupted')),
      actor TEXT NOT NULL, reason TEXT NOT NULL,
      started_at INTEGER NOT NULL, deadline_at INTEGER NOT NULL, finished_at INTEGER,
      outcome_code TEXT, message TEXT NOT NULL,
      revision_id TEXT REFERENCES report_revisions(id),
      CHECK(deadline_at > started_at),
      CHECK((status='running' AND finished_at IS NULL AND outcome_code IS NULL AND revision_id IS NULL)
        OR (status='succeeded' AND finished_at IS NOT NULL AND outcome_code IS NOT NULL AND revision_id IS NOT NULL)
        OR (status IN ('failed','interrupted') AND finished_at IS NOT NULL AND outcome_code IS NOT NULL AND revision_id IS NULL)),
      UNIQUE(client_id,source_sha256,processing_identity,attempt)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS report_preparation_one_running
      ON report_preparation_attempts(client_id,source_sha256,processing_identity) WHERE status='running';
    CREATE TRIGGER IF NOT EXISTS report_preparation_terminal_no_update
      BEFORE UPDATE ON report_preparation_attempts WHEN OLD.status != 'running' BEGIN
        SELECT RAISE(ABORT, 'Completed preparation attempts are immutable; append a retry.');
      END;
  `);
  if (!db.prepare("SELECT value FROM metadata WHERE key='initialized'").get()) {
    db.exec('BEGIN IMMEDIATE');
    try {
      if (seed) seedDatabase(db);
      db.prepare('INSERT INTO metadata (key,value) VALUES (?,?)').run('initialized','1');
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); db.close(); throw error; }
  }
  return db;
}
