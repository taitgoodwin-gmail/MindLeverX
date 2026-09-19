import { createHash } from 'node:crypto';

const text = value => typeof value === 'string' && value.trim().length > 0;

// This inspects supplied export records, not the provider's collection method.
export function inspectEvidence(bytes, { brand, expectedSha256 } = {}) {
  if (!Buffer.isBuffer(bytes)) throw new TypeError('Input must be the original file bytes.');
  if (!text(brand)) throw new TypeError('A nonempty literal brand is required.');
  if (expectedSha256 !== undefined && !/^[a-f0-9]{64}$/i.test(expectedSha256)) {
    throw new TypeError('Expected SHA-256 must contain 64 hexadecimal digits.');
  }
  const result = {
    schemaVersion: 'mlx-evidence-inspection-v1',
    method: 'answer-text-literal-substring-lowercase-v1',
    source: { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') },
    brand: brand.trim(),
    status: 'blocked',
    collectionQualification: 'required',
    clientRelease: 'not_authorized_by_inspection',
    recordCount: null,
    aggregate: null,
    rows: [],
    issues: [],
    limitations: [
      'Local inspection of supplied vendor export; not a client-ready audit or evidence of collection permission.',
      'Literal substring in answer text only; ignores capitalization, not spacing. No aliases, word boundaries, semantic, sentiment or citation analysis.',
      'Denominator is exported records, not all attempts, unique people or a representative market sample.',
      'Engine labels and timestamps are vendor supplied. Collection method, model, session, locale, attempt history and timestamp precision are not verified.',
      'Hash verifies byte identity only. Retention/reporting rights and collection qualification still require review.',
    ],
  };
  const issue = (severity, code, row = null, field = null) => result.issues.push({ severity, code, row, field });
  if (expectedSha256 !== undefined && result.source.sha256 !== expectedSha256.toLowerCase()) {
    issue('error', 'source_hash_mismatch');
    return result;
  }
  let records;
  try {
    records = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    issue('error', 'invalid_json_or_utf8');
    return result;
  }
  if (!Array.isArray(records) || records.length === 0) {
    issue('error', 'nonempty_array_required');
    return result;
  }
  result.recordCount = records.length;
  const seenIds = new Set();
  const seenObservations = new Set();
  const needle = result.brand.toLowerCase();
  records.forEach((record, index) => {
    const row = index + 1;
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      issue('error', 'record_object_required', row);
      result.rows.push({ row, prompt: null, engine: null, vendorTimestamp: null, vendorResponseId: null, answerPresent: false, literalMention: null });
      return;
    }
    for (const field of ['response_text', 'prompt', 'engine']) {
      if (!text(record[field])) issue('error', 'required_text_missing_or_invalid', row, field);
    }
    for (const field of ['response_id', 'timestamp']) {
      if (!text(record[field])) issue('warning', 'metadata_missing_or_invalid', row, field);
    }
    const observation = {
      row,
      prompt: text(record.prompt) ? record.prompt : null,
      engine: text(record.engine) ? record.engine : null,
      vendorTimestamp: text(record.timestamp) ? record.timestamp : null,
      vendorResponseId: text(record.response_id) ? record.response_id : null,
      answerPresent: text(record.response_text),
      literalMention: text(record.response_text) ? record.response_text.toLowerCase().includes(needle) : null,
    };
    result.rows.push(observation);
    if (observation.vendorResponseId !== null) {
      if (seenIds.has(observation.vendorResponseId)) issue('warning', 'repeated_vendor_response_id', row, 'response_id');
      seenIds.add(observation.vendorResponseId);
    }
    const identity = [observation.engine, observation.prompt, observation.vendorTimestamp, observation.vendorResponseId];
    if (identity.every(value => value !== null)) {
      const key = JSON.stringify(identity);
      if (seenObservations.has(key)) issue('error', 'duplicate_observation_identity', row);
      seenObservations.add(key);
    }
  });
  if (!result.issues.some(item => item.severity === 'error')) {
    result.status = 'complete';
    result.aggregate = {
      numerator: result.rows.filter(row => row.literalMention).length,
      denominator: result.recordCount,
      meaning: 'Exported answer records containing the literal brand at least once',
    };
  }
  return result;
}
