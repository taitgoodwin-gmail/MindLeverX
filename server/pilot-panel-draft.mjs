import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const defaultPilotPanelPath = fileURLToPath(new URL('../docs/pilot-panel-draft.json', import.meta.url));
const intentIds = ['discovery_problem', 'comparison', 'trust_method', 'direct_brand'];

function invalid(field, message) { throw new TypeError(`${field}: ${message}`); }
function object(value, keys, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(field, 'must be an object');
  if (keys.some(key => !Object.hasOwn(value, key)) || Object.keys(value).some(key => !keys.includes(key))) invalid(field, 'must contain exactly the required fields');
}
function text(value, field, max = 5000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || !value.isWellFormed()) invalid(field, 'must be nonempty bounded text');
}
function id(value, field) {
  text(value, field, 100);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)) invalid(field, 'must be a stable identifier');
}
function list(value, field, min = 0) {
  // Resource bounds for this local reader, not a measurement sample-size policy.
  if (!Array.isArray(value) || value.length < min || value.length > 100) invalid(field, 'must be a bounded array');
}
function unique(values, field) {
  if (new Set(values).size !== values.length) invalid(field, 'must be unique');
}
function oneOf(value, choices, field) {
  if (!choices.includes(value)) invalid(field, 'has an unsupported value');
}

/** Validate a candidate for display, not its empirical coverage or permission to collect. */
export function validatePilotPanelDraft(draft) {
  object(draft, ['schemaVersion', 'panelId', 'version', 'state', 'collectionStatus', 'subject', 'purpose', 'preparedBy', 'owner', 'language', 'market', 'locale', 'collectionSurface', 'repetitions', 'sources', 'intents', 'questions', 'alternatives', 'gaps', 'measurementBoundary'], 'draft');
  if (draft.schemaVersion !== 'mlx-pilot-panel-draft-v1') invalid('schemaVersion', 'unsupported schema');
  id(draft.panelId, 'panelId');
  if (!Number.isSafeInteger(draft.version) || draft.version < 1) invalid('version', 'must be a positive integer');
  if (draft.state !== 'draft' || draft.collectionStatus !== 'blocked') invalid('state', 'only a draft with blocked collection can be displayed here');
  object(draft.subject, ['brand', 'domain'], 'subject');
  text(draft.subject.brand, 'subject.brand', 200);
  text(draft.subject.domain, 'subject.domain', 253);
  for (const key of ['purpose', 'preparedBy', 'owner', 'language', 'measurementBoundary']) text(draft[key], key);
  for (const key of ['market', 'locale', 'collectionSurface']) {
    if (draft[key] !== null) text(draft[key], key);
  }
  if (draft.repetitions !== null && (!Number.isSafeInteger(draft.repetitions) || draft.repetitions < 1)) invalid('repetitions', 'must be null or a positive integer');
  list(draft.sources, 'sources', 1);
  draft.sources.forEach(source => {
    object(source, ['id', 'title', 'kind', 'reference', 'sha256', 'limitation'], 'source');
    id(source.id, 'source.id');
    for (const key of ['title', 'kind', 'reference', 'limitation']) text(source[key], `source.${key}`);
    if (source.sha256 !== null && (typeof source.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(source.sha256))) invalid('source.sha256', 'must be null or a SHA-256 hash');
  });
  unique(draft.sources.map(source => source.id), 'source IDs');
  const sources = new Map(draft.sources.map(source => [source.id, source]));
  list(draft.intents, 'intents', 1);
  draft.intents.forEach(intent => {
    object(intent, ['id', 'title', 'definition'], 'intent');
    oneOf(intent.id, intentIds, 'intent.id');
    text(intent.title, 'intent.title');
    text(intent.definition, 'intent.definition');
  });
  unique(draft.intents.map(intent => intent.id), 'intent IDs');
  if (draft.intents.length !== intentIds.length) invalid('intents', 'must define all four intent categories');
  list(draft.questions, 'questions', 1);
  draft.questions.forEach(question => {
    object(question, ['id', 'text', 'version', 'intentId', 'anchoring', 'role', 'headlineEligibility', 'provenance', 'sourceIds', 'rationale', 'uncertainty'], 'question');
    id(question.id, 'question.id');
    text(question.text, 'question.text', 500);
    if (!Number.isSafeInteger(question.version) || question.version < 1) invalid('question.version', 'must be a positive integer');
    oneOf(question.intentId, intentIds, 'question.intentId');
    oneOf(question.anchoring, ['unanchored', 'brand_anchored'], 'question.anchoring');
    oneOf(question.role, ['discovery_candidate', 'exploratory_candidate', 'brand_diagnostic'], 'question.role');
    oneOf(question.headlineEligibility, ['unresolved', 'excluded'], 'question.headlineEligibility');
    oneOf(question.provenance, ['retained_observed_prompt', 'ai_generated_hypothesis'], 'question.provenance');
    text(question.rationale, 'question.rationale');
    text(question.uncertainty, 'question.uncertainty');
    list(question.sourceIds, 'question.sourceIds', 1);
    unique(question.sourceIds, 'question.sourceIds');
    question.sourceIds.forEach(sourceId => {
      if (!sources.has(sourceId)) invalid('question.sourceIds', 'must resolve to declared sources');
    });
    if (question.provenance === 'retained_observed_prompt' && !question.sourceIds.some(sourceId => sources.get(sourceId).sha256 !== null)) invalid('question.provenance', 'a retained prompt needs a hashed source reference');
    const namesBrand = question.text.toLowerCase().includes(draft.subject.brand.trim().toLowerCase());
    if (namesBrand && question.anchoring !== 'brand_anchored') invalid('question.anchoring', 'a question naming the subject brand cannot be unanchored');
    if (question.anchoring === 'brand_anchored' && question.headlineEligibility !== 'excluded') invalid('question.headlineEligibility', 'brand-anchored questions are excluded');
    if (question.role !== 'discovery_candidate' && question.headlineEligibility !== 'excluded') invalid('question.headlineEligibility', 'exploratory and brand-diagnostic questions are excluded');
    if (question.intentId === 'direct_brand' && (question.anchoring !== 'brand_anchored' || question.role !== 'brand_diagnostic' || question.headlineEligibility !== 'excluded')) invalid('question.intentId', 'direct-brand questions require an excluded brand diagnostic');
    if (question.role === 'brand_diagnostic' && question.intentId !== 'direct_brand') invalid('question.role', 'brand diagnostics require direct-brand intent');
  });
  unique(draft.questions.map(question => question.id), 'question IDs');
  unique(draft.questions.map(question => question.text.trim().replace(/\s+/g, ' ').toLowerCase()), 'question text');
  list(draft.alternatives, 'alternatives');
  draft.alternatives.forEach(alternative => {
    object(alternative, ['text', 'decision', 'reason'], 'alternative');
    text(alternative.text, 'alternative.text', 500);
    text(alternative.reason, 'alternative.reason');
    if (alternative.decision !== 'deferred') invalid('alternative.decision', 'must remain deferred');
  });
  list(draft.gaps, 'gaps');
  draft.gaps.forEach(gap => text(gap, 'gap'));
  return draft;
}

export async function readPilotPanelDraft(path = defaultPilotPanelPath) {
  const bytes = await readFile(path);
  if (bytes.length > 512 * 1024) invalid('draft', 'exceeds the local reader size limit');
  const draft = validatePilotPanelDraft(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
  return { draft, source: { sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length } };
}
