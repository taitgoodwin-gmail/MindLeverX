import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { savedResults } from './saved-results.mjs';
import { SUPPORTED_EVIDENCE_METHODS } from './evidence-inspection.mjs';

export const REPORT_SCOPE_BOUNDARY = 'The brand and domain are operator-configured source scope, not independently verified vendor provenance. This is an internal saved sample; local review does not qualify collection or authorize client release.';
export const LOCAL_REVIEW_LIMITATION = 'Local operator record only; human identity and decision authenticity are not verified. This record does not authorize collection or client release.';
export const REPORT_EXPORT_LIMITS = Object.freeze({ envelope: 32 * 1024 * 1024, source: 2 * 1024 * 1024, report: 8 * 1024 * 1024, pdf: 8 * 1024 * 1024, snapshot: 64 * 1024, review: 64 * 1024 });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const jsonBytes = value => Buffer.from(JSON.stringify(value));
const fingerprint = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const id = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value);
const instant = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const boundaries = Object.freeze({
  origin: 'Not authenticated by this verification; a separately recorded snapshot hash pins immutable content only.',
  review: 'Review decisions and export time are not authenticated or anchored by the expected snapshot hash.',
  pdf: 'Only retained PDF byte integrity and framing are checked; rendering and semantic truth are not independently verified.',
  collectionQualification: 'required', clientRelease: 'unavailable',
  privacy: 'Contains original unsanitized source and local review notes; not prepared for client sharing.',
});
function fail(code) { throw Object.assign(new Error(code), { verificationStatus: 'FAIL', code }); }
function requireValue(condition, code = 'invalid_structure') { if (!condition) fail(code); }
function supported(value, allowed, code) { if (!allowed.includes(value)) throw Object.assign(new Error(code), { verificationStatus: 'UNSUPPORTED', code }); }
function keys(value, expected) {
  requireValue(value !== null && typeof value === 'object' && !Array.isArray(value));
  const actual = Object.keys(value);
  requireValue(actual.length === expected.length && expected.every(key => Object.hasOwn(value, key)));
}
function parse(bytes) {
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { fail('invalid_json_or_utf8'); }
}
function decode(entry, limit) {
  keys(entry, ['encoding', 'bytes', 'sha256', 'data']);
  requireValue(entry.encoding === 'base64' && Number.isSafeInteger(entry.bytes) && entry.bytes > 0 && entry.bytes <= limit, 'invalid_entry_size_or_encoding');
  requireValue(fingerprint(entry.sha256), 'invalid_fingerprint');
  // Buffer accepts whitespace, URL-safe variants and nonzero padding bits. Our format does not.
  requireValue(typeof entry.data === 'string' && entry.data.length === 4 * Math.ceil(entry.bytes / 3) && /^[A-Za-z0-9+/]*={0,2}$/.test(entry.data), 'invalid_base64');
  const bytes = Buffer.from(entry.data, 'base64');
  requireValue(bytes.length === entry.bytes && bytes.toString('base64') === entry.data, 'invalid_base64');
  requireValue(sha(bytes) === entry.sha256, 'artifact_hash_mismatch');
  return bytes;
}
function artifact(value, entry) {
  keys(value, ['sha256', 'bytes']);
  requireValue(value.sha256 === entry.sha256 && value.bytes === entry.bytes, 'artifact_link_mismatch');
}
function validateSnapshot(snapshot, entries) {
  keys(snapshot, ['id','clientId','version','reviewId','preparedAt','scope','subject','schemaVersion','reportSchemaVersion','method','rendererVersion','brand','clientName','domain','processingIdentity','scopeBoundary','collectionQualification','clientRelease','source','report','pdf']);
  supported(snapshot.schemaVersion, ['mlx-report-revision-v1'], 'unsupported_snapshot_schema');
  supported(snapshot.reportSchemaVersion, ['mlx-saved-results-v1'], 'unsupported_report_schema');
  supported(snapshot.method, SUPPORTED_EVIDENCE_METHODS, 'unsupported_method');
  supported(snapshot.rendererVersion, ['mlx-saved-results-pdf-v1', 'mlx-saved-results-pdf-v2'], 'unsupported_renderer');
  requireValue(id(snapshot.id) && id(snapshot.clientId) && id(snapshot.reviewId) && Number.isSafeInteger(snapshot.version) && snapshot.version > 0 && instant(snapshot.preparedAt));
  keys(snapshot.subject, ['clientName','domain','brand']);
  requireValue(text(snapshot.brand, 200) && snapshot.brand === snapshot.brand.trim() && text(snapshot.clientName, 160) && snapshot.clientName === snapshot.clientName.trim());
  requireValue(typeof snapshot.domain === 'string' && snapshot.domain.length <= 253 && snapshot.domain.includes('.') && !/^\d+(\.\d+){3}$/.test(snapshot.domain) && !/\.(local|localhost|internal)$/.test(snapshot.domain) && snapshot.domain.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)), 'invalid_subject');
  requireValue(snapshot.subject.brand === snapshot.brand && snapshot.subject.clientName === snapshot.clientName && snapshot.subject.domain === snapshot.domain, 'subject_link_mismatch');
  requireValue(snapshot.scope === 'internal_saved_sample' && snapshot.collectionQualification === 'required' && snapshot.clientRelease === 'unavailable' && snapshot.scopeBoundary === REPORT_SCOPE_BOUNDARY, 'invalid_scope_boundary');
  // Property order is the v1 processing identity contract used when retaining the revision.
  const processing = { schemaVersion: snapshot.schemaVersion, reportSchemaVersion: snapshot.reportSchemaVersion, method: snapshot.method, rendererVersion: snapshot.rendererVersion, brand: snapshot.brand, clientName: snapshot.clientName, domain: snapshot.domain };
  requireValue(fingerprint(snapshot.processingIdentity) && sha(jsonBytes(processing)) === snapshot.processingIdentity, 'processing_identity_mismatch');
  for (const kind of ['source','report','pdf']) artifact(snapshot[kind], entries[kind]);
}
function validateReview(review, snapshot) {
  keys(review, ['id','clientId','revisionId','status','note','createdAt','decidedAt','limitation']);
  requireValue(review.id === snapshot.reviewId && review.clientId === snapshot.clientId && review.revisionId === snapshot.id && review.createdAt === snapshot.preparedAt, 'review_link_mismatch');
  requireValue(['pending','approved','returned'].includes(review.status) && review.limitation === LOCAL_REVIEW_LIMITATION, 'invalid_review_state');
  if (review.status === 'pending') requireValue(review.note === null && review.decidedAt === null, 'invalid_review_state');
  else requireValue(text(review.note, 3000) && instant(review.decidedAt), 'invalid_review_state');
}

/** Pure byte verification. Imports no filesystem, database, renderer or networking code. */
export function verifyReportExport(bytes, { expectedSnapshotSha256 } = {}) {
  try {
    requireValue(Buffer.isBuffer(bytes) || bytes instanceof Uint8Array, 'input_bytes_required');
    requireValue(bytes.byteLength > 0 && bytes.byteLength <= REPORT_EXPORT_LIMITS.envelope, 'invalid_export_size');
    requireValue(expectedSnapshotSha256 === undefined || (typeof expectedSnapshotSha256 === 'string' && /^[a-f0-9]{64}$/i.test(expectedSnapshotSha256)), 'invalid_expected_fingerprint');
    const envelope = parse(bytes);
    keys(envelope, ['schemaVersion','exportedAt','entries']);
    supported(envelope.schemaVersion, ['mlx-report-export-v1'], 'unsupported_export_schema');
    requireValue(instant(envelope.exportedAt));
    keys(envelope.entries, ['snapshot','source','report','pdf','review']);
    const decoded = Object.fromEntries(Object.entries(envelope.entries).map(([kind, entry]) => [kind, decode(entry, REPORT_EXPORT_LIMITS[kind])]));
    const snapshotHash = envelope.entries.snapshot.sha256;
    if (expectedSnapshotSha256 !== undefined) requireValue(snapshotHash === expectedSnapshotSha256.toLowerCase(), 'expected_snapshot_mismatch');
    const snapshot = parse(decoded.snapshot), review = parse(decoded.review), report = parse(decoded.report);
    validateSnapshot(snapshot, envelope.entries);
    validateReview(review, snapshot);
    requireValue(report !== null && typeof report === 'object' && !Array.isArray(report));
    supported(report.schemaVersion, ['mlx-saved-results-v1'], 'unsupported_report_schema');
    supported(report.method, SUPPORTED_EVIDENCE_METHODS, 'unsupported_method');
    requireValue(report.schemaVersion === snapshot.reportSchemaVersion && report.method === snapshot.method && report.brand === snapshot.brand, 'report_link_mismatch');
    const recomputed = savedResults(decoded.source, snapshot.brand, { method: snapshot.method });
    requireValue(recomputed.state === 'complete' && isDeepStrictEqual(report, recomputed), 'report_reproduction_mismatch');
    requireValue(decoded.pdf.subarray(0, 5).equals(Buffer.from('%PDF-')) && /%%EOF\s*$/.test(decoded.pdf.toString('latin1')), 'invalid_pdf_framing');
    return {
      schemaVersion: 'mlx-report-export-verification-v1', status: 'PASS', code: 'integrity_and_reproduction_verified',
      revisionId: snapshot.id, clientId: snapshot.clientId, reviewId: snapshot.reviewId, version: snapshot.version,
      snapshotSha256: snapshotHash, source: snapshot.source,
      aggregate: { numerator: report.aggregate.numerator, denominator: report.aggregate.denominator },
      review: { status: review.status, decidedAt: review.decidedAt },
      anchor: { status: expectedSnapshotSha256 === undefined ? 'not_supplied' : 'matched', scope: 'immutable_content_only' },
      boundaries,
    };
  } catch (error) {
    return { schemaVersion: 'mlx-report-export-verification-v1', status: error.verificationStatus || 'FAIL', code: error.code && error.verificationStatus ? error.code : 'invalid_export', boundaries };
  }
}

/** Build only from already retained bytes; allowlist mutable review metadata separately. */
export function createReportExport({ snapshotBytes, sourceBytes, reportBytes, pdfBytes, review, exportedAt = new Date().toISOString() }) {
  const entries = {};
  for (const [kind, value] of Object.entries({ snapshot: snapshotBytes, source: sourceBytes, report: reportBytes, pdf: pdfBytes, review: jsonBytes(review) })) {
    const bytes = Buffer.from(value);
    requireValue(bytes.length > 0 && bytes.length <= REPORT_EXPORT_LIMITS[kind], 'invalid_entry_size_or_encoding');
    entries[kind] = { encoding: 'base64', bytes: bytes.length, sha256: sha(bytes), data: bytes.toString('base64') };
  }
  const bytes = jsonBytes({ schemaVersion: 'mlx-report-export-v1', exportedAt, entries });
  const result = verifyReportExport(bytes);
  if (result.status !== 'PASS') throw new Error('Stored revision cannot be exported with the supported format.');
  return bytes;
}
