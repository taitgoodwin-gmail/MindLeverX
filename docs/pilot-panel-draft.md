# Internal pilot question draft — MIN-13

19 September 2026. **Candidate draft, version 1. Collection blocked; no panel freeze or new observations.** Canonical content is [pilot-panel-draft.json](pilot-panel-draft.json). The local app reads that artifact, and Linear displays a dated projection. Neither is a second independently editable register.

## Outcome and scope

Let the owner inspect the proposed questions, their intended coverage, evidence and uncertainty before choosing a bounded collection design. The resulting six-question set comprises two discovery candidates, three exploratory questions and one direct-brand diagnostic. Six is an output of this draft, not a sample-size standard or adequacy claim. Question Q001 preserves the exact prompt in the saved export; Q002–Q006 are AI-generated hypotheses. No buyer interviews, query-volume evidence or question-response equivalence study supports this selection yet.

English describes the prompt wording. Market, collection locale, provider/surface and repetitions remain explicitly unresolved. Consumer ChatGPT is the intended leading outcome; the qualified route remains open. The historical US setting and illustrative B2B SaaS site copy do not select those parameters for this pilot.

The simplest alternative is a document-only draft. A small read-only app view is selected because the owner wants to see and inspect real progress beside the conversation; it reuses current UI components and does not require a database migration. Existing client panels store immutable lists of strings without draft/freeze semantics, so inserting this unapproved artifact there would misrepresent its status. Integrating the complete panel lifecycle is separate work.

## Requirement basis and authority

These are the current **review-draft** narratives, not an assertion of full approval or acceptance. Source: [revised register](requirements-rubric-review/revised-requirements.md). The owner's accepted direction is to use AI to improve useful coverage and reduce redundant work, not target inherited or competitor question counts; see [the correction](pilot-prompt-benchmarks-2026-09-19.md#owner-correction--19-september-2026).

**MLX3-MEA-001 — Versioned Pilot Prompt Panel.** Before collection, an authorized operator freezes a panel with stable ID, version, owner, purpose, prompt list and an approved bounded sample design; the historical 10–15-prompt range remains a candidate, not an automatically adopted current threshold.

Contribution: versioned candidate with responsible owner marked approval pending. Final approval, sample design and freeze remain blocked; this view cannot freeze or execute it.

**MLX3-MEA-002 — Complete Prompt Metadata.** Every prompt retains its exact text, category, market, language or locale, provenance, anchoring classification and version, marking unavailable context explicitly.

Contribution: metadata, sources and source hashes are retained in the artifact; shared unknown market/locale remain explicit. This is draft validation, not evidence of captured execution metadata.

**MLX3-MEA-003 — Prompt Class Taxonomy.** The versioned panel taxonomy identifies discovery/problem, comparison, trust/method and direct-brand intent separately from brand anchoring, recording ambiguous classifications for review before execution.

Contribution: explicit intent and anchoring, purpose/rationale and uncertainty. Automated checks can find structural conflicts; they do not establish semantic coverage or actual buyer intent.

**MLX3-MEA-004 — Unanchored Headline Visibility.** A headline unanchored-visibility rate includes only eligible unanchored observations in its denominator and reports anchored or direct-brand observations separately.

Contribution: direct-brand diagnostics and exploratory method/value questions are excluded from the proposed discovery metric; even Q001–Q002 eligibility remains unresolved. No rate is calculated from this draft.

**MLX3-MEA-005 — Frozen Panel Versioning.** A used or frozen panel cannot be edited in place; an accepted change creates a successor version and preserves the former panel and comparability boundary.

Contribution: a version and original artifact byte hash identify what was reviewed; Git preserves this candidate revision. No claim that the complete production freeze/successor lifecycle is implemented. Existing immutable client-panel behavior remains separate and must continue passing its regression tests.

## Pillars and smallest validation

| Pillar | Contribution and evidence boundary |
| --- | --- |
| Owner/client UX | Owner can read exact questions and optional reasons in one view. Client experience and comprehension are untested. |
| Recurring revenue | Q005 explores continuing usefulness; an answer would not demonstrate willingness to pay or renewal. |
| Repeatability | IDs, taxonomy, version, source references and byte hashes preserve the draft context. |
| Automation | Deterministic loading/validation avoids manual re-entry. No collection or freeze automation is added. |
| AI intelligence | AI proposed distinct intents, alternatives and gaps; reduced question count alone is not evidence of success. |
| Competitive leadership | Useful interpretation is a hypothesis; no advantage or broad market coverage is demonstrated. |
| Behavioral design | Problem, comparison and trust questions are design hypotheses about buyer decisions, not measured behavior. |

Missing buyer-language evidence or materially different answers to held-out alternatives would justify revising the candidates. More questions are useful only if they add relevant information at acceptable collection/review effort. No threshold, cost saving or effort reduction is claimed.

## Numbered chunk plan

Estimate before work: 25–40 minutes. Model: the user's reported GPT-6 Astra remains appropriate; no setting changed. One bounded reviewer drafted the candidate coverage, a second implements/reviews local integration, and the coordinator checks sources and integrates evidence. These are temporary AI assignments, not independent customer validation. Existing thinking-partner/Project Next guidance and the Linear connector are used; no new plugin or service is needed.

1. **Source and classify — MEA-001–003:** inspect accepted direction, the provisional site/offer and the saved prompt; retain hashes and source limitations. Done: Q001 exact text checked against the original file; five sources fingerprinted.
2. **Version and expose — MEA-001–005 (partial):** save the candidate artifact and a session-protected read-only app view. Display draft/blocked state, unknown context, exact wording, categories, provenance, alternatives and gaps. No collect/freeze control or client-panel mutation.
3. **Verify and hand off — cases below:** check valid/invalid artifacts, access boundaries, inert text and error recovery; inspect the browser and retain exact evidence. Update MIN-13 with the draft; keep final SPEC-01 blocked.

## Executable verification fixed before integration

Prerequisites: Node >=24, the product checkout's local server/test fixtures, the exact candidate JSON, and a temporary synthetic draft fixture for invalid/hostile-input cases. No provider access is required. Tests use a temporary database with no customer data.

| Case | Numbered actions | Expected result / decision |
| --- | --- | --- |
| DRAFT-01 — source and content | 1. Recompute each available source hash. 2. Compare Q001 with the retained export. 3. Load the draft through a local session. 4. Compare displayed/API wording and artifact hash with the original bytes. | Exact matches; six current candidate questions, five labeled hypotheses, unresolved parameters remain unknown. FAIL on drift or fabricated approval. Missing private sources in a clean checkout mean source re-verification BLOCKED, not automatic document failure. |
| DRAFT-02 — validation | 1. In independent synthetic copies remove required metadata, duplicate IDs/text, break source/intent references and mislabel direct-brand text. 2. Supply frozen/approved state. 3. Supply malformed JSON. | Each invalid copy rejected with safe errors; no valid-looking empty result or zero metric. Valid draft is a positive control. Operational size guards are not sample policy. |
| DRAFT-03 — access and isolation | 1. Request without local session. 2. Request with foreign origin. 3. Load through valid session. 4. Compare client panels/activity before and after read/refresh. | Unauthorized access denied; valid read succeeds; no persisted panels, approval or scheduled work created. Original source paths never become browser-selected file inputs. |
| DRAFT-04 — failure and recovery | 1. Start a temporary test app with missing then malformed artifact. 2. Open another workspace page. 3. Restore valid artifact and retry. | Clear unavailable/error state; other pages still work; retry loads valid draft. No stale success presented as current. |
| DRAFT-05 — rendered review | 1. Open the draft directly in a desktop browser. 2. Expand question details with keyboard. 3. Inspect on a narrow viewport. 4. Use a synthetic markup-containing fixture for rendering verification. | Exact readable wording, visible draft/blocked limitations, inert text, usable details and no horizontal clipping. Record actual inspected scope; do not infer usability from a screenshot. |
| DRAFT-06 — boundaries and regression | 1. Run relevant artifact/API tests and existing panel persistence tests. 2. Run the public build check. | Existing immutable panels remain unchanged; candidate/operator content absent from public artifact. |

PASS applies only to the exercised case and boundary; FAIL means an expected observation differs; BLOCKED means a named prerequisite is missing; unexecuted cases remain NOT RUN. Cleanup: close temporary test servers, remove temporary fixtures/databases, retain the versioned real candidate and verification receipt. Do not overwrite real evidence.

**MIN-13 SPEC-01 remains BLOCKED:** qualification, approved sample design, attempt budget/repetitions, collection window and final approval are not supplied by a successful draft preview. Full T20 freeze/use/successor acceptance is NOT RUN in this chunk. The four Otterly questions are prepared; sending them requires explicit owner instruction, requested separately.

## Actual verification — 19 September 2026

All three draft-preview steps are complete within their stated scope. Artifact `mlx-internal-coverage` v1 is 10,772 bytes, SHA-256 `de686eed201787226df1e2e69965b41ff33a6baf654ae2f735e627519f9564c6`. Product and canonical copies match. Node 26.7.0 ran the application tests; the existing PDF runtime was supplied for the full check. Retained logs and machine-readable receipt are in the original project's ignored `artifacts/unattended-work/evidence/2026-09-19-pilot-draft/` directory; they are local evidence, not included in source backup.

| Case | Actual result and boundary |
| --- | --- |
| DRAFT-01 | PASS. Five source hashes matched current files; Q001 exactly matched all 16 retained rows. The real draft loaded in the app with six questions, labeled hypotheses and unknown parameters. Original artifact fingerprint retained in `source-check.json`; no new collection. |
| DRAFT-02 | PASS. Automated checks rejected malformed/state/metadata/reference/anchoring conflicts, duplicate IDs/text, encoding and size failures. Different valid candidate counts passed; no fixed sample-size policy was introduced. |
| DRAFT-03 | PASS. API tests observed 401 without session, 403 for foreign origin, valid reads with no database mutation, ignored browser query-path input and no supported write endpoint. This is the existing local access boundary, not production identity. |
| DRAFT-04 | PASS. API tests and a separate browser app with an in-memory database exercised missing/malformed files. The browser showed Draft unavailable; Clients remained usable with zero records. Restoring a valid synthetic artifact and clicking Retry draft loaded all questions. |
| DRAFT-05 | PASS within inspected scope. Desktop at 1280×720 and narrow viewport at 390×844 were inspected; keyboard Enter expanded questions and long text wrapped. The initial coverage table was too narrow, so it was replaced with responsive cards and rechecked: document width 390, cards width 356, no horizontal page clipping. A synthetic markup fixture appeared literally; DOM checks found zero injected images/scripts, zero executable reference links and no execution marker. Actual buyer comprehension and complete accessibility conformance remain untested. |
| DRAFT-06 | PASS. Full `npm run check`: 102 tests passed, no failures, plus site/platform checks. `npm run build:public`: seven-page allowlist/private content checks passed. After the coverage-only HTML/CSS correction, `npm run build` and all 27 draft-focused checks passed again; existing immutable-panel tests had passed in the full suite. JavaScript syntax and diff whitespace checks passed. |

The two temporary specialist assignments had different roles: one authored the candidate proposal and checked the coordinator's artifact/source consistency; the other implemented and checked local integration. The coordinator reviewed code, independently checked original source bytes, integrated changes, ran the full checks and performed browser verification. This is not independent semantic validation of the question author's own selection, human acceptance or customer validation.

The browser failure fixture was isolated from the canonical artifact; its tab/server were closed after verification. The deliverable preview remains at [Pilot question draft](http://127.0.0.1:4329/app/#/pilot-panel), using a separate empty temporary database with no saved-results source connected. Existing port 4328 was left untouched. Temporary viewport overrides were reset. Runtime availability must be rechecked in a later session.

Owner walkthrough: (1) open the preview; (2) expand a question to read exact wording, source basis and uncertainty; (3) compare the four proposed intent groups and review the unresolved scope. This review can inform revisions; it does not freeze the panel. The next independent engineering candidate is MIN-7's saved-evidence-to-report-review connection while qualification is resolved.
