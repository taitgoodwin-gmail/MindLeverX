import { createHash, randomUUID } from 'node:crypto';
import { open } from 'node:fs/promises';
import { savedResults } from './saved-results.mjs';
import { savedResultsPdf, SAVED_RESULTS_RENDERER_VERSION } from './saved-results-pdf.mjs';

import { createReportExport, REPORT_SCOPE_BOUNDARY, LOCAL_REVIEW_LIMITATION } from './report-export.mjs';
export { REPORT_SCOPE_BOUNDARY } from './report-export.mjs';
const SOURCE_LIMIT = 2 * 1024 * 1024;
const PDF_LIMIT = 8 * 1024 * 1024;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const encoded = value => Buffer.from(JSON.stringify(value));
function fail(status, message) { throw Object.assign(new Error(message), { status }); }

async function sourceBytes(path) {
  if (!path) fail(409, 'Connect saved evidence before preparing a local draft.');
  let file;
  try { file = await open(path, 'r'); }
  catch { fail(503, 'Saved evidence is unavailable. Restore the source and refresh.'); }
  try {
    const bytes = Buffer.alloc(SOURCE_LIMIT + 1);
    let size = 0;
    while (size < bytes.length) {
      const read = await file.read(bytes, size, bytes.length - size, null);
      if (read.bytesRead === 0) break;
      size += read.bytesRead;
    }
    if (size > SOURCE_LIMIT) fail(413, 'Saved evidence exceeds the local snapshot size limit.');
    return bytes.subarray(0, size);
  } catch (error) {
    if (error.status) throw error;
    fail(503, 'Saved evidence could not be read. Restore the source and refresh.');
  } finally { await file.close(); }
}

/** Local snapshots only. Production identity, collection and client release are absent. */
export function createReportRevisions({ db, evidenceInputPath, evidenceBrand, evidenceSubjectDomain, pdfPython, pdfRenderer = savedResultsPdf }) {
  const pending = new Map();
  const metadata = row => row && { ...JSON.parse(row.snapshot_json), snapshotSha256: row.snapshot_sha256 };
  const selectMetadata = 'SELECT id,snapshot_json,snapshot_sha256 FROM report_revisions';
  const find = (clientId, sourceSha256, processingIdentity) => db.prepare(`${selectMetadata} WHERE client_id=? AND source_sha256=? AND processing_identity=?`).get(clientId, sourceSha256, processingIdentity);
  function clientFor(id) {
    const client = db.prepare('SELECT * FROM clients WHERE id=?').get(id);
    if (!client) fail(404, 'Client not found.');
    if (client.sample) fail(409, 'Choose a real local client record, not a fictional sample.');
    if (!evidenceSubjectDomain) fail(409, 'Configure the saved evidence subject domain before preparing a draft.');
    if (client.domain !== evidenceSubjectDomain) fail(409, 'This client does not match the configured evidence subject domain.');
    return client;
  }
  function read(id) {
    const row = db.prepare('SELECT * FROM report_revisions WHERE id=?').get(id);
    if (!row) fail(404, 'Report revision not found.');
    let snapshot;
    try {
      snapshot = JSON.parse(row.snapshot_json);
      if (hash(Buffer.from(row.snapshot_json)) !== row.snapshot_sha256) throw new Error('snapshot');
      if (snapshot.id !== row.id || snapshot.clientId !== row.client_id || snapshot.reviewId !== row.review_id || snapshot.version !== row.version || snapshot.source.sha256 !== row.source_sha256 || snapshot.processingIdentity !== row.processing_identity) throw new Error('snapshot identity');
      for (const kind of ['source', 'report', 'pdf']) {
        const bytes = Buffer.from(row[`${kind}_bytes`]);
        if (bytes.length !== snapshot[kind].bytes || hash(bytes) !== snapshot[kind].sha256) throw new Error(kind);
      }
    } catch { fail(503, 'Stored report revision failed its integrity check. Restore the saved snapshot before reviewing.'); }
    return row;
  }
  async function prepare(clientId, body) {
    if (Object.keys(body).length !== 1 || !Object.hasOwn(body, 'sourceSha256') || typeof body.sourceSha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(body.sourceSha256)) fail(400, 'Supply only the saved source SHA-256 shown in the current evidence view.');
    const client = clientFor(clientId);
    const raw = await sourceBytes(evidenceInputPath);
    const sourceSha256 = hash(raw);
    if (sourceSha256 !== body.sourceSha256.toLowerCase()) fail(409, 'The saved source changed. Refresh evidence before preparing a draft.');
    const report = savedResults(raw, evidenceBrand);
    if (report.state !== 'complete') fail(409, 'Correct the saved evidence before preparing a local draft.');
    const processing = { schemaVersion: 'mlx-report-revision-v1', reportSchemaVersion: report.schemaVersion, method: report.method, rendererVersion: SAVED_RESULTS_RENDERER_VERSION, brand: report.brand, clientName: client.name, domain: client.domain };
    const processingIdentity = hash(encoded(processing));
    const existing = find(clientId, sourceSha256, processingIdentity);
    if (existing) return { created: false, revision: metadata(read(existing.id)) };
    const key = JSON.stringify([clientId, sourceSha256, processingIdentity]);
    if (pending.has(key)) return { ...(await pending.get(key)), created: false };
    const work = (async () => {
      let pdf;
      try { pdf = Buffer.from(await pdfRenderer(report, { python: pdfPython })); }
      catch { fail(503, 'PDF generation is unavailable. Check the local PDF runtime and try again.'); }
      if (pdf.length > PDF_LIMIT || !pdf.subarray(0, 5).equals(Buffer.from('%PDF-')) || !/%%EOF\s*$/.test(pdf.toString('latin1'))) fail(503, 'PDF generation did not produce a complete local draft. Try again.');
      const reportBytes = encoded(report);
      // Rendering/IO finish before taking the write lock. Recheck for another writer.
      db.exec('BEGIN IMMEDIATE');
      try {
        const currentClient = clientFor(clientId);
        if (currentClient.name !== client.name) fail(409, 'The client context changed. Refresh and prepare the draft again.');
        const duplicate = find(clientId, sourceSha256, processingIdentity);
        if (duplicate) { const revision = metadata(read(duplicate.id)); db.exec('COMMIT'); return { created: false, revision }; }
        const { version } = db.prepare('SELECT COALESCE(MAX(version),0)+1 AS version FROM report_revisions WHERE client_id=?').get(clientId);
        const id = randomUUID(), reviewId = randomUUID(), preparedAt = new Date().toISOString();
        const snapshot = {
          id, clientId, version, reviewId, preparedAt, scope: 'internal_saved_sample',
          subject: { clientName: client.name, domain: evidenceSubjectDomain, brand: report.brand },
          ...processing, processingIdentity, scopeBoundary: REPORT_SCOPE_BOUNDARY,
          collectionQualification: 'required', clientRelease: 'unavailable',
          source: { sha256: sourceSha256, bytes: raw.length },
          report: { sha256: hash(reportBytes), bytes: reportBytes.length },
          pdf: { sha256: hash(pdf), bytes: pdf.length },
        };
        const snapshotJSON = JSON.stringify(snapshot), snapshotSha256 = hash(Buffer.from(snapshotJSON));
        const summary = `${report.aggregate.numerator} of ${report.aggregate.denominator} saved answers contain the literal brand. Internal sample only; collection qualification and client release remain unavailable.`;
        db.prepare("INSERT INTO reviews (id,client_id,kind,title,summary,body,evidence,status,sample,created_at) VALUES (?,?,'report',?,?,?,?,'pending',0,?)")
          .run(reviewId, clientId, `${report.brand} · saved sample draft v${version}`, summary, REPORT_SCOPE_BOUNDARY, JSON.stringify([{ label: 'Retained source SHA-256', detail: sourceSha256 }]), preparedAt);
        db.prepare('INSERT INTO report_revisions (id,client_id,version,review_id,source_sha256,processing_identity,source_bytes,report_bytes,pdf_bytes,snapshot_json,snapshot_sha256,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
          .run(id, clientId, version, reviewId, sourceSha256, processingIdentity, raw, reportBytes, pdf, snapshotJSON, snapshotSha256, preparedAt);
        db.prepare('INSERT INTO activity (id,action,entity_type,entity_id,actor,detail,created_at) VALUES (?,?,?,?,?,?,?)')
          .run(randomUUID(), 'Local draft prepared', 'review', reviewId, 'Local operator', `${report.brand} saved sample v${version} retained for review. No collection, qualification or client release occurred.`, preparedAt);
        db.exec('COMMIT');
        return { created: true, revision: { ...snapshot, snapshotSha256 } };
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    })();
    pending.set(key, work);
    try { return await work; } finally { pending.delete(key); }
  }
  return {
    prepare,
    list: () => db.prepare(`${selectMetadata} ORDER BY created_at DESC,version DESC`).all().map(metadata),
    forReview: reviewId => metadata(db.prepare(`${selectMetadata} WHERE review_id=?`).get(reviewId)),
    verify: id => metadata(read(id)),
    get: id => { const row = read(id); return { revision: metadata(row), report: JSON.parse(Buffer.from(row.report_bytes).toString('utf8')) }; },
    export: id => {
      const row = read(id);
      const review = db.prepare('SELECT id,client_id,status,note,created_at,decided_at FROM reviews WHERE id=?').get(row.review_id);
      if (!review || review.client_id !== row.client_id) fail(503, 'The linked local review is unavailable.');
      try {
        return createReportExport({
          snapshotBytes: Buffer.from(row.snapshot_json), sourceBytes: Buffer.from(row.source_bytes),
          reportBytes: Buffer.from(row.report_bytes), pdfBytes: Buffer.from(row.pdf_bytes),
          review: { id: review.id, clientId: review.client_id, revisionId: row.id, status: review.status, note: review.note, createdAt: review.created_at, decidedAt: review.decided_at, limitation: LOCAL_REVIEW_LIMITATION },
        });
      } catch { fail(503, 'The retained revision or local review cannot be exported with the supported format.'); }
    },
    bytes: (id, kind) => {
      const row = read(id);
      const column = { pdf: 'pdf_bytes', source: 'source_bytes', report: 'report_bytes' }[kind];
      if (!column) fail(404, 'Report artifact not found.');
      // node:sqlite returns BLOBs as Uint8Array; HTTP must receive exact bytes.
      return Buffer.from(row[column]);
    },
  };
}
