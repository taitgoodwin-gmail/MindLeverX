import { randomUUID } from 'node:crypto';

// Local renderer is separately limited to 15s. This is a coordination deadline,
// not a service SLA or permission to retry external/charged operations.
export const PREPARATION_TIMEOUT_MS = 30000;
const identityWhere = 'client_id=? AND source_sha256=? AND processing_identity=?';
const safeFields = row => ({ id: row.id, clientId: row.client_id, sourceSha256: row.source_sha256,
  processingIdentity: row.processing_identity, attempt: row.attempt, status: row.status,
  actor: row.actor, reason: row.reason, startedAt: row.started_at, deadlineAt: row.deadline_at,
  finishedAt: row.finished_at, outcomeCode: row.outcome_code, message: row.message, revisionId: row.revision_id });
const fail = message => { throw Object.assign(new Error(message), { status: 409 }); };

export function createReportPreparations(db, { clock = Date.now } = {}) {
  function expire() {
    const now = clock();
    db.prepare("UPDATE report_preparation_attempts SET status='interrupted',finished_at=?,outcome_code='LOCAL_DEADLINE',message=? WHERE status='running' AND deadline_at<=?")
      .run(now, 'Preparation did not finish within its local time limit. Refresh and retry when ready.', now);
  }
  function claim(clientId, sourceSha256, processingIdentity) {
    const identity = [clientId, sourceSha256, processingIdentity];
    db.exec('BEGIN IMMEDIATE');
    try {
      expire();
      const existing = db.prepare(`SELECT id FROM report_revisions WHERE ${identityWhere}`).get(...identity);
      if (existing) { db.exec('COMMIT'); return { revisionId: existing.id }; }
      const running = db.prepare(`SELECT * FROM report_preparation_attempts WHERE ${identityWhere} AND status='running'`).get(...identity);
      if (running) { db.exec('COMMIT'); return { acquired: false, attempt: safeFields(running) }; }
      const last = db.prepare(`SELECT attempt,status FROM report_preparation_attempts WHERE ${identityWhere} ORDER BY attempt DESC LIMIT 1`).get(...identity);
      const id = randomUUID(), started = clock();
      db.prepare("INSERT INTO report_preparation_attempts (id,client_id,source_sha256,processing_identity,attempt,status,actor,reason,started_at,deadline_at,message) VALUES (?,?,?,?,?,'running','Local operator',?,?,?,?)")
        .run(id, ...identity, (last?.attempt || 0) + 1, last ? `Explicit retry after ${last.status} attempt ${last.attempt}.` : 'Operator requested a retained local draft.', started, started + PREPARATION_TIMEOUT_MS, 'Preparing a retained local draft.');
      const row = db.prepare('SELECT * FROM report_preparation_attempts WHERE id=?').get(id);
      db.exec('COMMIT');
      return { acquired: true, attempt: safeFields(row) };
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  function get(id) {
    expire();
    const row = db.prepare('SELECT * FROM report_preparation_attempts WHERE id=?').get(id);
    if (!row) fail('Preparation attempt is unavailable. Refresh the workspace.');
    return safeFields(row);
  }
  function assertActive(id) {
    const attempt = get(id);
    if (attempt.status !== 'running') fail('This preparation attempt is no longer active. Refresh to inspect its outcome before retrying.');
    return attempt;
  }
  return {
    claim, get, assertActive,
    list() { expire(); return db.prepare('SELECT * FROM report_preparation_attempts ORDER BY started_at DESC, rowid DESC LIMIT 100').all().map(safeFields); },
    // Called inside the SAME transaction that retains the revision/review/activity.
    succeed(id, revisionId) {
      const now = clock();
      const result = db.prepare("UPDATE report_preparation_attempts SET status='succeeded',finished_at=?,outcome_code='DRAFT_RETAINED',message='Retained local draft prepared. Client release remains unavailable.',revision_id=? WHERE id=? AND status='running' AND deadline_at>?")
        .run(now, revisionId, id, now);
      if (result.changes !== 1) fail('Preparation expired before its draft could be retained. Refresh before retrying.');
    },
    fail(id, code, message) {
      expire();
      db.prepare("UPDATE report_preparation_attempts SET status='failed',finished_at=?,outcome_code=?,message=? WHERE id=? AND status='running'")
        .run(clock(), code, message, id);
    },
  };
}
