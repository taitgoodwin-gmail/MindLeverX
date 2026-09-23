import { createHash } from 'node:crypto';
import { chmodSync, linkSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const INPUT_VERSION = 'mlx-report-input-v1';
const FAMILIES = {
  website_readiness: 'Website readiness',
  search_performance: 'Ordinary search performance',
  consumer_ai: 'Consumer AI answers',
  model_api: 'Model API benchmarks',
};
const STATUSES = { observed: 'Observed', failed: 'Failed', not_measured: 'Not measured' };
const CONTEXT_KEYS = ['question', 'locale', 'engine', 'model', 'panelVersion'];
const REVIEW_BOUNDARY = 'Evidence and prose claims still require semantic review. Structural validation and hashes do not establish truth, evidence authenticity, or justified comparisons.';
const RELEASE_BOUNDARY = 'Draft only. This tool has no approval or release action. Monthly client release requires owner approval under DEC-006.';
const HASH_BOUNDARY = 'SHA-256 hashes identify retained local bytes; they are not proof of authenticity, trusted timestamps, or production immutable storage.';

export class ReportInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ReportInputError';
  }
}

function invalid(path, message) {
  throw new ReportInputError(`${path}: ${message}`);
}

function object(value, keys, path) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(path, 'must be an object');
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) invalid(`${path}.${key}`, 'is required; use null only where permitted');
  }
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) invalid(path, `unknown field ${JSON.stringify(key)}; approval/release fields are not accepted`);
  }
}

function string(value, path, { nonempty = true } = {}) {
  if (typeof value !== 'string') invalid(path, 'must be a string');
  if (!value.isWellFormed()) invalid(path, 'must contain well-formed Unicode');
  if (nonempty && !value.trim()) invalid(path, 'must be nonempty');
}

function strings(value, path) {
  if (!Array.isArray(value)) invalid(path, 'must be an array');
  value.forEach((item, index) => string(item, `${path}[${index}]`, { nonempty: false }));
}

function timestamp(value, path) {
  string(value, path);
  // A timezone is mandatory. Validate calendar components before Date.parse,
  // which otherwise accepts rollovers such as February 30.
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!match) invalid(path, 'must be an ISO timestamp with seconds and an explicit timezone');
  const [, year, month, day, hour, minute, second, , offsetHour = '0', offsetMinute = '0'] = match;
  const y = Number(year);
  const m = Number(month);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (m < 1 || m > 12 || Number(day) < 1 || Number(day) > days[m - 1]
    || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59
    || Number(offsetHour) > 23 || Number(offsetMinute) > 59 || !Number.isFinite(Date.parse(value))) {
    invalid(path, 'must be a valid calendar timestamp');
  }
}

function url(value, path) {
  string(value, path);
  let parsed;
  try { parsed = new URL(value); } catch { invalid(path, 'must be an absolute http/https URL'); }
  if (!/^https?:\/\//i.test(value) || !['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
    invalid(path, 'must be an absolute http/https URL');
  }
}

/** Validate structure only; this deliberately does not certify prose or comparisons. */
export function validateReportInput(input) {
  object(input, ['schemaVersion', 'reportId', 'subject', 'preparedAt', 'fixture', 'method', 'limitations', 'evidence', 'findings'], 'input');
  if (input.schemaVersion !== INPUT_VERSION) invalid('input.schemaVersion', `must be ${INPUT_VERSION}`);
  string(input.reportId, 'input.reportId');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(input.reportId)) invalid('input.reportId', 'must be a safe stable ID using letters, numbers, dots, underscores or hyphens');
  object(input.subject, ['name', 'website'], 'input.subject');
  string(input.subject.name, 'input.subject.name');
  url(input.subject.website, 'input.subject.website');
  timestamp(input.preparedAt, 'input.preparedAt');
  if (typeof input.fixture !== 'boolean') invalid('input.fixture', 'must be boolean');
  object(input.method, ['id', 'version', 'description'], 'input.method');
  for (const key of ['id', 'version', 'description']) string(input.method[key], `input.method.${key}`);
  strings(input.limitations, 'input.limitations');
  if (!Array.isArray(input.evidence)) invalid('input.evidence', 'must be an array');
  if (!Array.isArray(input.findings)) invalid('input.findings', 'must be an array');
  const evidenceIds = new Set();
  input.evidence.forEach((item, index) => {
    const path = `input.evidence[${index}]`;
    object(item, ['id', 'family', 'surface', 'status', 'capturedAt', 'sourceUrl', 'content', 'limitation', 'context'], path);
    string(item.id, `${path}.id`);
    if (evidenceIds.has(item.id)) invalid(`${path}.id`, 'duplicate evidence ID');
    evidenceIds.add(item.id);
    string(item.family, `${path}.family`);
    string(item.status, `${path}.status`);
    if (!Object.hasOwn(FAMILIES, item.family)) invalid(`${path}.family`, 'must be a supported measurement family');
    if (!Object.hasOwn(STATUSES, item.status)) invalid(`${path}.status`, 'must be observed, failed or not_measured');
    string(item.surface, `${path}.surface`);
    if (item.capturedAt !== null) timestamp(item.capturedAt, `${path}.capturedAt`);
    if (item.sourceUrl !== null) url(item.sourceUrl, `${path}.sourceUrl`);
    string(item.content, `${path}.content`, { nonempty: item.status === 'observed' });
    string(item.limitation, `${path}.limitation`, { nonempty: item.status !== 'observed' });
    if (item.status === 'observed' && item.capturedAt === null) invalid(`${path}.capturedAt`, 'observed evidence requires a capture timestamp');
    object(item.context, CONTEXT_KEYS, `${path}.context`);
    for (const key of CONTEXT_KEYS) {
      if (item.context[key] !== null) string(item.context[key], `${path}.context.${key}`);
    }
  });
  const findingIds = new Set();
  input.findings.forEach((item, index) => {
    const path = `input.findings[${index}]`;
    object(item, ['id', 'text', 'evidenceIds', 'limitations'], path);
    string(item.id, `${path}.id`);
    if (findingIds.has(item.id) || evidenceIds.has(item.id)) invalid(`${path}.id`, 'duplicate record ID');
    findingIds.add(item.id);
    string(item.text, `${path}.text`);
    strings(item.evidenceIds, `${path}.evidenceIds`);
    if (!item.evidenceIds.length) invalid(`${path}.evidenceIds`, 'must reference at least one evidence ID');
    if (new Set(item.evidenceIds).size !== item.evidenceIds.length) invalid(`${path}.evidenceIds`, 'must not repeat an evidence ID');
    item.evidenceIds.forEach((id, refIndex) => {
      if (!evidenceIds.has(id)) invalid(`${path}.evidenceIds[${refIndex}]`, 'does not reference existing evidence');
    });
    strings(item.limitations, `${path}.limitations`);
  });
  return input;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function jsonBytes(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

// Every supplied text field uses a fence longer than any supplied backtick run.
// Never interpolate supplied text into Markdown headings, links or HTML.
function quote(value) {
  const text = value === null ? 'Unknown (not supplied)' : value;
  const longest = [...text.matchAll(/`+/g)].reduce((max, match) => Math.max(max, match[0].length), 0);
  const fence = '`'.repeat(Math.max(3, longest + 1));
  return `${fence}text\n${text}\n${fence}\n`;
}

function field(label, value) {
  return `**${label}**\n\n${quote(value)}\n`;
}

function limitations(items) {
  return items.length ? items.map(item => quote(item)).join('\n')
    : 'No limitations supplied. This does not establish that there are no limitations.\n';
}

function markdown(report) {
  let result = '# Draft evidence report\n\n';
  result += `**State: DRAFT — not approved or released.**\n\n${RELEASE_BOUNDARY}\n\n`;
  result += report.fixture
    ? '**Fixture: YES — fictional/test input, not measured customer evidence.**\n\n'
    : '**Fixture: NO — supplied declaration; provenance has not been independently verified.**\n\n';
  result += `${REVIEW_BOUNDARY}\n\n${HASH_BOUNDARY}\n\n`;
  result += 'A complete package requires manifest.json and matching hashes for all listed files. Completion is not semantic acceptance or release approval.\n\n';
  result += field('Report ID', report.reportId);
  result += field('Subject', report.subject.name);
  result += field('Website (supplied, not fetched)', report.subject.website);
  result += field('Prepared at (supplied timestamp)', report.preparedAt);
  result += '## Method and limitations\n\n';
  result += field('Method ID', report.method.id) + field('Method version', report.method.version) + field('Method description', report.method.description);
  result += limitations(report.limitations) + '\n';
  result += '## Findings awaiting semantic review\n\n';
  result += 'Evidence references establish traceability only; they do not prove that a claim follows from the evidence. No composite score is calculated.\n\n';
  if (!report.findings.length) result += 'No findings supplied.\n\n';
  report.findings.forEach((finding, index) => {
    result += `### Finding ${index + 1}\n\n`;
    result += field('Finding ID', finding.id) + field('Supplied claim (untrusted)', finding.text);
    result += '**Cited evidence IDs**\n\n' + finding.evidenceIds.map(id => quote(id)).join('\n') + '\n';
    result += '**Finding limitations**\n\n' + limitations(finding.limitations) + '\n';
  });
  result += '## Retained evidence by measurement family\n\n';
  result += 'These families are separate. Model API benchmarks do not establish consumer AI answer behavior. Failed and not-measured records are not observations of absence and are not numeric zero. Comparisons require semantic review of compatible methods and context.\n\n';
  for (const [family, label] of Object.entries(FAMILIES)) {
    result += `### ${label}\n\n`;
    const entries = report.evidence.filter(item => item.family === family);
    if (!entries.length) result += 'No evidence supplied for this family; measurement is unknown.\n\n';
    entries.forEach(item => {
      result += `#### Evidence record ${item.recordNumber}\n\n`;
      result += `**State: ${STATUSES[item.status]}**\n\n`;
      result += item.fixture ? '**Fixture: YES — fictional/test evidence.**\n\n' : '**Fixture: NO — supplied declaration, not independently verified.**\n\n';
      result += field('Evidence ID', item.id) + field('Surface', item.surface);
      result += field('Captured at (supplied timestamp)', item.capturedAt) + field('Source URL (supplied, not fetched)', item.sourceUrl);
      for (const key of CONTEXT_KEYS) result += field(`Context: ${key}`, item.context[key]);
      result += field('Limitation', item.limitation || 'No limitation supplied; absence of limitations has not been established.');
      result += field('Retained content file', item.contentFile) + field('Content SHA-256', item.contentSha256);
      result += '**Supplied content (untrusted; retained without modification)**\n\n' + quote(item.content) + '\n';
    });
  }
  return Buffer.from(result, 'utf8');
}

function packageFiles(bytes) {
  let input;
  try {
    // A BOM is allowed as UTF-8 input framing; the original bytes, including it,
    // remain unchanged in input.json. Invalid UTF-8 must not be replaced silently.
    input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new ReportInputError('input: must be valid UTF-8 JSON');
  }
  validateReportInput(input);
  const files = new Map([['input.json', bytes]]);
  const evidence = input.evidence.map((item, index) => {
    // IDs are data, never paths. Numeric filenames also permit arbitrary IDs
    // without directory traversal or platform-specific filename collisions.
    const contentFile = `evidence/${String(index + 1).padStart(4, '0')}.txt`;
    const contentBytes = Buffer.from(item.content, 'utf8');
    files.set(contentFile, contentBytes);
    return { ...item, recordNumber: index + 1, fixture: input.fixture, contentFile, contentSha256: sha256(contentBytes) };
  });
  const report = {
    schemaVersion: 'mlx-report-draft-v1',
    state: 'draft',
    fixture: input.fixture,
    semanticReview: 'required',
    reviewBoundary: REVIEW_BOUNDARY,
    releaseBoundary: RELEASE_BOUNDARY,
    hashBoundary: HASH_BOUNDARY,
    reportId: input.reportId,
    subject: input.subject,
    preparedAt: input.preparedAt,
    method: input.method,
    limitations: input.limitations,
    input: { file: 'input.json', sha256: sha256(bytes) },
    evidence,
    findings: input.findings,
  };
  files.set('report.json', jsonBytes(report));
  files.set('report.md', markdown(report));
  const manifest = {
    schemaVersion: 'mlx-report-manifest-v1',
    reportId: input.reportId,
    state: 'draft',
    fixture: input.fixture,
    hashAlgorithm: 'sha256',
    hashBoundary: HASH_BOUNDARY,
    contentEncoding: 'Evidence files contain the exact supplied JSON string content encoded as UTF-8; input.json preserves the original JSON bytes.',
    completionBoundary: 'All listed files must exist with matching byte lengths and hashes. Package completeness does not imply semantic acceptance, approval or release.',
    files: [...files].map(([path, content]) => ({ path, bytes: content.length, sha256: sha256(content) })),
  };
  files.set('manifest.json', jsonBytes(manifest));
  return { report, manifest, files };
}

/** Build a new private local draft package. Existing paths are never replaced. */
export function buildReportPackage({ inputPath, outputDir }) {
  if (typeof inputPath !== 'string' || !inputPath.trim() || typeof outputDir !== 'string' || !outputDir.trim()) {
    throw new TypeError('inputPath and outputDir must be nonempty strings');
  }
  const destination = resolve(outputDir);
  const { report, manifest, files } = packageFiles(readFileSync(resolve(inputPath)));
  // Stage complete bytes on the destination filesystem before claiming output.
  // Exclusive directory creation and hard links provide no-overwrite behavior;
  // the complete manifest is linked last, atomically, as the completion marker.
  const staging = mkdtempSync(join(dirname(destination), '.mlx-report-'));
  let ownsDestination = false;
  let complete = false;
  const warnings = [];
  try {
    chmodSync(staging, 0o700);
    mkdirSync(join(staging, 'evidence'), { mode: 0o700 });
    for (const [path, content] of files) writeFileSync(join(staging, path), content, { flag: 'wx', mode: 0o600 });
    mkdirSync(destination, { mode: 0o700 });
    ownsDestination = true;
    mkdirSync(join(destination, 'evidence'), { mode: 0o700 });
    for (const path of files.keys()) linkSync(join(staging, path), join(destination, path));
    complete = true;
    return { outputDir: destination, state: 'draft', reportId: report.reportId, manifest, warnings };
  } catch (error) {
    if (ownsDestination && !complete) {
      try { rmSync(destination, { recursive: true, force: true }); }
      catch (cleanupError) {
        throw new AggregateError([error, cleanupError], 'Report generation failed; incomplete output cleanup also failed. No completion manifest was published.');
      }
    }
    throw error;
  } finally {
    try { rmSync(staging, { recursive: true, force: true }); }
    catch { warnings.push(`Could not remove private staging directory: ${staging}`); }
  }
}
