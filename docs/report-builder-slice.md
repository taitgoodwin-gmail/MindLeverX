# Local evidence-to-report slice and bounded review trial

Recorded 2026-09-13. Owner authorization handed back from the MVP side conversation: begin the next dependency-ready local/reversible implementation and run one bounded review trial. This is not approval of an undefined customer package or standing improvement loop.

## Why this slice is ready

The existing plan permits a report template before collection. MIN-7 remains dependent on MIN-6 for an actual measured report; a fictional fixture cannot complete that dependency. The current local workspace stores sample review content but has no retained, portable evidence-to-report package. Build a dependency-free local package generator now, without changing public or operator UI, the database, provider integrations, billing, or release paths.

Relevant requirement IDs: MLX3-INV-007; MLX3-EVD-002/006; MLX3-MEA-006/012/013/014/015; MLX3-RES-001/002/004/005/006; MLX3-NFR-009; MLX3-ADM-011. These links identify bounded contributions, not full satisfaction of the proposed requirements. DEC-006 monthly owner release approval remains intact.

## Frozen implementation acceptance v1

1. A local command accepts a versioned JSON evidence/report input and writes a new private local output directory. No network, database, provider calls or external actions. No new package dependencies.
2. Preserve exact input bytes as `input.json`; retain each supplied evidence content and SHA-256, plus hashes of output report bytes in a manifest. Repeat identical input deterministically. Hashes demonstrate local byte identity, not authenticity, trusted timestamps or production immutable storage.
3. Produce readable `report.md` and machine-readable `report.json`; both always identify the draft state, fixture status, method/version, supplied collection dates/context and limitations. Monthly client release still needs owner approval; this tool has no approval or release action.
4. Keep website readiness, ordinary search performance, consumer AI answers and model-API benchmarks distinct. Render observed, failed and not-measured states explicitly. Never manufacture missing context or convert failure to numeric zero. No composite score or new scoring method.
5. Validate input structure, unique IDs, known evidence references, valid supplied dates and permitted source-URL schemes. Unknown metadata is explicit. Preserve supplied content as untrusted quoted/code text; prevent it from becoming active Markdown/HTML or injected report headings/links.
6. Structural validation and hashes do not establish whether a prose claim is true or whether a comparison is justified. Report must say that evidence/claims still require review. No structural-pass badge may imply semantic acceptance or approval.
7. Never overwrite an existing output directory or source input. Failure must not leave an apparently complete package. Tests cover valid/incomplete input, broken references, duplicate IDs, unsafe content, deterministic bytes/hashes, no-overwrite and no-release behavior, using temporary storage.

## Input contract v1 — project implementation choice

`schemaVersion: "mlx-report-input-v1"`; `reportId` a safe stable ID; `subject: {name, website}`; `preparedAt` an explicit ISO timestamp; `fixture` boolean; `method: {id, version, description}`; `limitations` string array; `evidence` array; `findings` array.

Each evidence record has `id`, `family` (website_readiness, search_performance, consumer_ai, model_api), `surface`, `status` (observed, failed, not_measured), `capturedAt` (ISO timestamp or null), `sourceUrl` (http/https URL or null), `content` string, `limitation` string, and `context: {question, locale, engine, model, panelVersion}` with each metadata value a nonempty string or null. Observed records require capture time and nonempty content. Failed/not-measured records require a limitation; they cannot represent observed absence. Fixture provenance is report-wide and repeated beside evidence. Findings contain `id`, `text`, `evidenceIds` (one or more existing IDs), and `limitations` (string array). Findings can discuss failures; referencing an item is not proof that the prose follows from it. No release/approval fields are accepted.

## Frozen review trial criteria v1

Use the clearly labeled fictional fixture adapted from `server/seed.mjs`; no qualifying retained real-answer capture was found in that source. Preserve its baseline draft and evidence before the reviewer starts. One reviewer examines the draft against these criteria, then the coordinator performs at most one correction pass; compare both versions afterward. Do not silently alter criteria to make the revision pass.

- T1: Every material claim is supported by its cited retained evidence; no API-to-consumer equivalence or fictional-to-real inference.
- T2: Missing context, failed collection and unknown facts remain explicit, never a clean zero.
- T3: Comparisons require compatible, identified methods/context; no unsupported causal lift or inherited illustrative score formula.
- T4: Draft/fictional labels and DEC-006 monthly owner release boundary survive revision; no wording implies client approval or automatic release.
- T5: Evidence bytes and unaffected correct statements are preserved; no new material errors.

Budget choice for this local slice: up to 90 minutes wall time for implementation and trial, one semantic review and one correction; no paid calls. Record actual elapsed/task phases and any available active effort rather than claiming wall time equals labor. A five-minute owner review is only a proposed target. Owner review time is unknown until observed. Record material errors corrected, new errors, reviewer false alarms, observable AI usage/cost, total effort and uncertainty. The cap is not a passing result. Conclude adopt/adjust/stop with evidence; ongoing adoption stays undecided until the owner reviews it. Do not add a standing improvement instruction to build guidance yet.

## Sources and scope (checked 2026-09-13)

- [OpenAI evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices): official recommendations for task-specific criteria, retained evaluation cases and human calibration. The page currently warns of Evals-platform deprecation; this slice uses the general practice without selecting that product.
- [Anthropic effective agents](https://www.anthropic.com/engineering/building-effective-agents): engineering pattern for evaluator–optimizer work when clear criteria and measurable value warrant it; not a required architecture. Its tooling references carry an age caveat.
- [ISO/IEC 42001 public overview](https://www.iso.org/standard/42001): organizational AI management and PDCA context only; full standard not read, certification not claimed.
- [Node.js24 crypto](https://nodejs.org/docs/latest-v24.x/api/crypto.html) and [filesystem](https://nodejs.org/docs/latest-v24.x/api/fs.html): documented SHA-256 hashing and exclusive filesystem operations. The file layout, field names, iteration/effort caps and acceptance checklist above are our implementation choices.

Results belong in this task's verification note, MIN-7 progress and existing requirements Team review field. No new dashboard or recurring schedule.
