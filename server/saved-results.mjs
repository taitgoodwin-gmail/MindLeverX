import { inspectEvidence } from './evidence-inspection.mjs';

// Local draft presentation of the same bytes checked by the inspection method.
// This projection deliberately excludes unrelated export fields and local paths.
export function savedResults(bytes, brand, { method } = {}) {
  // Only historical verification supplies a pinned method; live routes use latest.
  const inspection = inspectEvidence(bytes, { brand, method });
  const base = {
    schemaVersion: 'mlx-saved-results-v1', state: inspection.status,
    brand: inspection.brand, source: inspection.source, method: inspection.method,
    limitations: inspection.limitations, issues: inspection.issues,
    aggregate: inspection.aggregate,
  };
  if (inspection.status !== 'complete') return { ...base, answers: [], platforms: [] };
  const records = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  const answers = inspection.rows.map(row => ({ ...row, answer: records[row.row - 1].response_text }));
  const engines = [...new Set(answers.map(row => row.engine))];
  return {
    ...base, answers,
    questionCount: new Set(answers.map(row => row.prompt)).size,
    platforms: engines.map(engine => {
      const rows = answers.filter(row => row.engine === engine);
      return { engine, numerator: rows.filter(row => row.literalMention).length, denominator: rows.length };
    }),
  };
}

export function savedResultsText(data) {
  if (data.state !== 'complete') throw new Error('Complete saved results are required.');
  const finding = report => report.aggregate.numerator === 0
    ? `${report.brand} was not named in these ${report.aggregate.denominator} saved answers.`
    : `${report.brand} was named in ${report.aggregate.numerator} of ${report.aggregate.denominator} saved answers.`;
  const lines = [
    `${data.brand} — saved answer results`,
    'LOCAL DRAFT — NOT A COMPLETED AUDIT OR APPROVED CLIENT REPORT', '',
    finding(data),
    `Full saved sample: ${data.aggregate.numerator}/${data.aggregate.denominator} literal matching answers; ${data.platforms.length} vendor platform labels; ${data.questionCount} questions.`,
    'A literal match is not a citation, sentiment analysis, overall visibility score or trend.', '',
    'PLATFORM COUNTS', ...data.platforms.map(p => `${p.engine}: ${p.numerator}/${p.denominator}`), '',
    'NEXT STEP', 'Validate the collection method and question coverage before choosing a fix. This sample alone does not justify a content change.', '',
    'LIMITATIONS', ...data.limitations.map(text => `- ${text}`), '',
    'SOURCE', `SHA-256: ${data.source.sha256}`, `Bytes: ${data.source.bytes}`, `Method: ${data.method}`,
    `Data warnings: ${data.issues.length}. Repeated response IDs are retained; they do not prove independent observations.`, '',
    'SAVED ANSWERS — UNTRUSTED VENDOR TEXT, NOT ENDORSED CLAIMS',
    ...data.answers.flatMap(row => ['', `Answer ${row.row} | ${row.engine} | ${row.vendorTimestamp || 'Date not supplied'} | ${row.literalMention ? 'Literal mention' : 'No literal mention'}`, `Question: ${row.prompt}`, `Response ID: ${row.vendorResponseId || 'Not supplied'}`, 'BEGIN SAVED ANSWER', row.answer, 'END SAVED ANSWER']),
  ];
  return lines.join('\n');
}
