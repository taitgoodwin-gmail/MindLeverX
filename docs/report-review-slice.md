# Saved evidence to an internal report review — MIN-7

19 September 2026. Local engineering slice under the continuing MVP goal. The saved vendor sample remains unqualified for a customer audit. This slice connects evidence, a retained PDF and an owner review; it does not complete MIN-7's qualified real-report acceptance, production identity, client delivery or payment.

## Recovered owner-draft QA — 23 September 2026

The original loopback preview/database could not be reverified at its former path. Its portable export in ignored local evidence passed the current `scripts/verify-report-export.mjs` verifier: revision `125783a7-4235-43d1-b433-95426afbf184`, pinned legacy method `answer-text-literal-substring-lowercase-v1`, original source SHA-256 `dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58`, limited result 0/16, and a **pending** local review. This is exact stored-data reproduction, not source provenance or review authentication. The PDF was recovered byte-for-byte as [MindLeverX-preserved-owner-review.pdf](../output/pdf/MindLeverX-preserved-owner-review.pdf), 76,484 bytes, SHA-256 `365bddecc4b4291a1b88ece2a608d2ed89b87301c11415a628e84d3ea28ccda7`.

An independent 23 September read of the recovered PDF with `pypdf` found eight pages and 16 page-one internal evidence-link annotations. Page one states the narrow finding and the saved-data limitation; page two discloses the unverified consumer/API surface, one-question scope, unknown attempts/failures, repeated response-ID warnings, and a validation-first next action with dependencies and reversibility. Pages three through eight show numbered source rows and excerpts. This is a useful internal owner review under the draft RES-001/002/004/007 narratives. It does not satisfy qualified collection, a representative panel, owner/client comprehension, client release or the full requirements. The owner has not accepted its content or appearance; styling feedback remains open. No PDF bytes, review decision or provider data were changed during this QA.

## Outcome, authority and choice

The operator can prepare one report revision from the currently inspected saved evidence, find it in the review queue, read its retained answers and exact PDF, and record an internal decision against that revision. Later source-file changes cannot change the report that was reviewed. The current internal subject is MindLeverX / mindleverx.com. The operator-configured source-to-domain association is recorded as configuration, not vendor-proven provenance.

Gap at the start of this slice (now resolved locally): saved-results JSON/PDF is generated from a process-wide file, whereas existing review cards contain separate stored text. A decision on those cards does not approve that PDF. Existing PDF metadata timestamps vary across generation; exact retrieval must use the stored PDF bytes, not regenerate a supposedly identical approved artifact.

Use an additive local SQLite table and the existing review queue, PDF renderer and local session boundary. Store source bytes, structured result and generated PDF in one transaction with their hashes and one review entry. A filesystem package plus database pointer is a credible alternative, but introduces a second persistence boundary and orphan-file recovery for this small local slice. Existing command-line packages remain supported. This choice is not a production storage/retention decision or proof against a privileged person editing the database.

Owner authority: local MVP implementation, useful frontend chunks and GitHub backup are already authorized. Preserve existing release, contact, spending and deployment boundaries. No new provider calls, subscriptions, publication or customer release. Pending vendor-contact question remains unanswered; no automatic resend or repeated qualification research.

## Current requirement narratives — review drafts

Source: [revised requirement register](requirements-rubric-review/revised-requirements.md). These are bounded contributions, not full requirement approval.

**MLX3-INV-007 — Evidence-Backed Conclusions.** Every material report conclusion resolves to retained evidence and its processing versions, or is explicitly identified as an inference or unknown with its basis and limitations.

Contribution: retain the computed saved-sample finding, full answers, limits, source identity and processing version. No semantic visibility, causal lift or representative baseline is inferred.

**MLX3-EVD-006 — Stable Evidence Addressing.** Each permitted evidence reference resolves to a stable internal identifier and recorded byte hash, while expired or deleted evidence resolves to an explicit unavailable state.

Contribution: stable revision/answer references and fingerprints; safe missing-revision behavior. Production retention expiry/deletion remains separate and unimplemented.

**MLX3-NFR-009 — Exact Result Reproducibility.** Pinned deterministic processing reproduces measurement values from retained evidence, and approved generated prose is reproduced by retrieving its stored version rather than regenerating it.

Contribution: retain source/report/PDF bytes and their processing identifiers; retrieve the original PDF across source changes and restarts. This local renderer creates deterministic counts without generative prose. Content immutability is separate from the review decision.

**MLX3-RES-004 — Evidence Drill-Down.** An authorized reader can trace each measurement or conclusion to the contributing permitted observations and receipts, with clear explanations for evidence unavailable under retention or access rules.

Contribution: linked internal review, retained answers and PDF. Session/origin controls are local access checks, not customer identity or tenant authorization.

**MLX3-ADM-011 — Result Review and Secure Delivery.** Monthly reports become client-visible only after the owner's recorded release decision; completeness and evidence checks precede that decision, and the one-time audit release policy remains explicit and unresolved.

Contribution: a one-time local review decision tied to the exact snapshot. Accepting a local draft does not qualify collection or release it. No client visibility or delivery control is introduced; monthly release remains required and one-time release policy remains unresolved.

**MLX3-SVC-005 — Exception Queue.** The operator queue contains actionable failures, blocked or insufficient work and reports awaiting required release, without duplicate entries; healthy preparation may still require one owner-release decision.

Contribution: one actionable internal draft review per identical source/subject/processing identity; retries cannot create duplicate queue entries. Full collection-failure routing and monthly release orchestration remain separate.

## Pillars and numbered plan

Owner UX benefits from one preparation action and evidence beside the decision; client UX remains untested. Repeatability is supported by immutable revisions and recoverable duplicate requests. Automation prepares and persists the package but never substitutes for judgment. Retained evidence supports future AI interpretation; no AI-generated conclusions are added. Recurring revenue and competitive usefulness remain hypotheses. Clear internal-review versus release labels support informed decisions, but actual comprehension is not measured.

Estimate before implementation: 40–60 minutes. Current setting GPT-6 Astra is adequate; no model/global setting change. One implementation agent owns the product checkout; a read-only requirements reviewer checks coverage; the coordinator owns this plan, integration and browser verification.

1. **Define scope and fixed cases — INV-007, EVD-006, ADM-011:** require an explicit source-domain binding and a matching non-sample local client; document the unqualified sample boundary and cases below.
2. **Persist the revision — EVD-006, NFR-009, SVC-005:** store original evidence, exact structured result/PDF and one review atomically; reject stale input and duplicate writes.
3. **Connect the browser — RES-004, ADM-011:** prepare from inspected evidence, navigate to the linked review, inspect the frozen content and record a revision-bound local decision. Preserve current visual direction.
4. **Verify and hand off — all above:** exercise failures, recovery, restart, immutable retrieval and browser flow; run applicable regressions/public-build exclusion; save evidence, update MIN-7 and verify GitHub backup.

## Fixed executable checks

Prerequisites: Node >=24 (actual installed runtime recorded with execution); existing Python/ReportLab runtime; isolated temporary SQLite DB and synthetic evidence file. Synthetic A contains exactly two valid rows with prompt `Which service can assess AI visibility?`, engine `chatgpt`, distinct IDs/timestamps, answers `MindLeverX is named in this synthetic answer.` and `No brand appears here.` Expected literal count 1/2. Synthetic B changes the second answer to `MindLeverX also appears here.`, expected 2/2. These are hand-specified test oracles, not real observations. Include a UTF-8 BOM variant and original-byte hash checks.

The actual private sample remains the unchanged file in the root checkout's `artifacts/unattended-work/evidence/2026-09-17-otterly/raw-answers.json`, 67,622 bytes and SHA-256 `dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58`: 16 saved answers, one prompt, four vendor platform labels, 0/16 contiguous literal MindLeverX mentions. It is a selected sample, not all attempts or a representative baseline. Missing private input in a fresh clone blocks this real-data walkthrough, not synthetic verification.

| Case | Numbered actions | Expected observable result |
| --- | --- | --- |
| REVIEW-01 — prepare and bind | 1. Configure synthetic A for MindLeverX/mindleverx.com. 2. Create matching non-sample local client. 3. Load inspected evidence and submit its observed SHA. 4. Open queue/review and retained PDF/answers. | One immutable revision, one pending review and one preparation event; source hash/bytes exact, 1/2 count, full answer strings and original PDF hash/bytes match. Internal sample, qualification-required and no-release boundaries remain visible. |
| REVIEW-02 — wrong/stale scope | 1. Try a different-domain client, sample client, missing domain binding and missing client. 2. Submit stale/invalid SHA or extra fields claiming approval/file path. 3. Try incomplete, malformed, missing and oversized evidence. | Safe rejection, no revision/review/event created; no replacement client inferred, no browser-selected local path and no missing data coerced to zero. |
| REVIEW-03 — duplicates and successor | 1. Send concurrent preparation requests for A. 2. Repeat after decision. 3. Replace input with B, refresh and prepare again. 4. Compare former revision. | A returns the same revision/review with no duplicate queue/history entry; B gets a later client revision with 2/2; A retains original source/report/PDF and decision. |
| REVIEW-04 — persistence and exact retrieval | 1. Retain downloaded PDF and hashes. 2. Close app, change/remove process source. 3. Reopen same DB. 4. Download stored PDF/read report again. 5. Attempt unsupported content mutation. | Same revision, answer text, source/report/PDF bytes and hashes; no renderer/source reread for stored retrieval; content mutation rejected. Unknown revision is explicit 404. |
| REVIEW-05 — atomic failure, integrity and access | 1. Disable PDF executable and prepare. 2. Force a test-only storage failure. 3. In a disposable store, bypass the update guard to corrupt retained bytes without changing the recorded hashes; retrieve/retry preparation. 4. Request APIs without session, with foreign origin, missing CSRF and forged client fields. 5. Restore prerequisites and retry. | No partial package, orphan review or success event on failure; corrupt content is explicitly unavailable and cannot be accepted as an original; safe errors without local paths; access denied as applicable; successful retry produces one complete package. |
| REVIEW-06 — decision boundary | 1. On a synthetic review submit missing/wrong revision binding or blank note. 2. Submit a valid internal decision and race a conflicting second decision. 3. Reload. | Invalid decision rejected; exactly one valid transition/note/history entry; decision still tied to original revision. Collection qualification remains required, report remains internal draft, and no release/delivery becomes available. Real sample remains pending for owner review. |
| REVIEW-07 — visible workflow and regression | 1. Use the real retained sample in a separate local DB. 2. Prepare via browser. 3. Open Needs me, linked review, retained answers and PDF. 4. Inspect keyboard/narrow layout and error/retry messages. 5. Run application and public-build checks. | UI leads to the same stored revision and 0/16 fixed-sample result. Existing sample reviews/panels/results work; private source/revisions stay absent from public output. Actual owner review and customer comprehension remain NOT RUN. |

PASS requires every exercised observation within the named boundary to match. FAIL identifies a mismatch; BLOCKED identifies a missing prerequisite; unexecuted steps are NOT RUN. Cleanup: remove temporary synthetic files/DBs and stop test servers; retain private demo DB for owner inspection only with its path/limits recorded. Never modify original evidence. Local snapshots preserve copies; deletion/retention production policy is not selected here.

## Agreed API and browser mapping

Preparation uses `POST /api/clients/:id/report-revisions` with only `{sourceSha256}` from the inspected source. New preparation returns 201; an identical existing revision returns 200 with the same revision/review. Unsupported fields cannot select a local file or claim approval. `MLX_EVIDENCE_DOMAIN` supplies the explicit configured subject domain; a non-sample client must match it.

`GET /api/report-revisions/:id` returns revision metadata plus the retained structured report. Its `/source.json`, `/report.json` and `/draft.pdf` routes serve the stored bytes under the local session boundary, with integrity checks before retrieval. The manifest includes subject, source/report/PDF hashes and byte lengths, processing identities and an overall snapshot hash. Internal scope, collection qualification and client release are separate fields.

A linked review decision posts `{decision,note,revisionId,snapshotSha256}` to the existing review-decision route. Missing or mismatched revision identity fails; the existing sample review contract remains supported. The local operator may inspect all local records; these unscoped local routes do not claim client-facing tenant authorization.

Browser path: Evidence review → prepare the matching internal draft → linked review in Needs me → retained answers/PDF → optional internal decision. Direct navigation through the older report-preview route must also use the retained revision rather than its sample-oriented template. Final button labels and actual URLs are verified in the execution record.

## Official technical basis — checked 19 September 2026

[Node SQLite](https://nodejs.org/api/sqlite.html) documents synchronous database operations, parameter binding and BLOB/Uint8Array conversion. [SQLite transactions](https://www.sqlite.org/lang_transaction.html) support the atomic write boundary; [SQLite triggers](https://www.sqlite.org/lang_createtrigger.html) support bounded content-update guards. Our schema, identity key and internal-review vocabulary are implementation choices. Use APIs present in the installed runtime; do not adopt newer APIs merely because the current documentation lists them. [Delivery governance](delivery-governance.md) retains the current OpenAI/GitHub/Linear practice and sources.

## Actual results

Subsequent local capability: [portable report export](report-export-slice.md) packages this exact revision and its local review snapshot for offline verification. The earlier standalone `/report.json` route remains a measurement projection.

**Local engineering slice complete; MIN-7 remains In Progress.** All four steps are finished within the boundaries below. Owner review, collection qualification and full supported-report acceptance remain outstanding.

| Verification | Actual result and scope |
| --- | --- |
| REVIEW-01–06 application coverage | 12 focused new tests passed, including real PDF rendering, BOM byte retention, same-process and separate-writer duplicate preparation, successors, restart without input, wrong/stale scope, malformed/missing/incomplete/oversized input, missing PDF runtime, transaction rollback, corruption, access controls and one-time bound decisions. Tests use their own explicitly synthetic inputs; root A/B fixtures provide a separate fixed oracle. |
| Application regression | `MLX_PDF_PYTHON=… npm run check` passed all 114 tests and site/platform checks on Node 26.7.0. This full run preceded the ledger-wording correction below; the 26 affected report-revision/server tests passed after that correction. |
| Public build | `npm run build:public` passed the seven-page allowlist and exclusion of private app/evidence. No deployment performed. |
| Separate real-source integration | Original 67,622 bytes and source hash unchanged. Independently checked all 16 retained answer strings, 0/16 literal count, one question and four vendor labels. Exact stored PDF/report bytes and hashes survived duplicate preparation and reopening the DB without a connected source. Temporary verification DB removed. |
| Browser — real sample | Created a matching internal client, prepared one revision, followed Needs me to its pending review, expanded answer text with keyboard Enter and triggered the retained PDF download. At a 390-pixel viewport, content fit without horizontal clipping. Viewport override reset. Actual report remains pending. |
| Browser — disposable synthetic data | An injected PDF failure produced a recoverable error and no review. Retry produced one review; a note and Accept local draft recorded the decision/history while qualification stayed required and release stayed unavailable. Test tab closed and in-memory server stopped. |
| Separate AI content review | Reviewer recalculated the limited finding and inspected PDF text/layout. It found the old ledger instruction pointed to a mutable results page. Corrected to source SHA-256 plus row number, bumped renderer identity to `mlx-saved-results-pdf-v2`, regenerated the verification artifact and rechecked pages 3–8. Eight-page document retained 0/16, one question and four labels without clipping. Narrow AI review PASS; this is not human or customer acceptance. |

The original renderer-v1 verification artifact is preserved under `renderer-v1-review/`. Counts are deterministic; regenerated PDFs may have different metadata timestamps, so revision downloads always retrieve stored bytes. `/report.json` is the measurement projection; subject, renderer and revision identity are in the base revision API envelope, not a complete standalone client-report export.

Evidence is in the root checkout's ignored `artifacts/unattended-work/evidence/2026-09-19-report-review/`: `application-check.log`, `focused-check.log`, `public-check.log`, `renderer-v2-check.log`, `verify-real-source.mjs`, `real-source-integration.json`, `real-source-retained-result.json`, `real-source-retained-draft.pdf`, `source-oracle.json` and `browser-verification.json`. Original private source and preview DB are outside Git backup. A clean clone can run synthetic tests with the documented runtime; private-source verification needs the retained input.

### Owner walkthrough and retained preview

Open [the pending internal review](http://127.0.0.1:4329/app/#/reviews/be043c4e-9707-4e4b-a2e2-708b9d74075a) while the loopback server is running.

1. Read **0 of 16 saved answers name MindLeverX** and its limitation. This is the saved sample's literal result, not a visibility score.
2. Expand a retained answer and choose **Download retained PDF**. Both belong to this exact revision, even if a later source is configured.
3. Optionally enter a review note and choose **Accept local draft** or **Return**. The local decision is recorded once. It does not qualify collection or release a client report. This real decision is left to the owner and has NOT RUN.

Preview client: `ebacfc17-ee6c-42b8-af0a-84a14a64974f`, MindLeverX — internal pilot / mindleverx.com. Revision `125783a7-4235-43d1-b433-95426afbf184`, version 1, renderer v2. Review `be043c4e-9707-4e4b-a2e2-708b9d74075a` is pending. Its PDF is 76,484 bytes, SHA-256 `365bddecc4b4291a1b88ece2a608d2ed89b87301c11415a628e84d3ea28ccda7`; snapshot hash `11cb98c576ddcbefcbb73462a5297de9b29a66961fd9309c9fe57cf7db08b385`. The isolated API-test artifact has a different revision/PDF identity; do not confuse it with this owner preview.

Preview DB: `/private/tmp/mindleverx-min13-preview.sqlite`, preserved for this demonstration, not durable production storage. Port 4329 now connects the unchanged original source with `MLX_EVIDENCE_BRAND=MindLeverX`, `MLX_EVIDENCE_DOMAIN=mindleverx.com`, `MLX_SEED=false` and the existing PDF Python runtime. The older 4328 preview remains separate. Verify current listeners before stopping/restarting anything. Use `npm run build` before `node server/start.mjs`, with `PORT`, `MLX_DB_PATH`, `MLX_EVIDENCE_INPUT` and `MLX_PDF_PYTHON` set appropriately; no new installation is necessary on this machine.

### Follow-through

The MIN-7 record carries verified commit/backup-ref receipts and this partial coverage. Next substantive acceptance work remains collection qualification and the accepted bounded specification; available engineering should be selected from the existing delivery-gap requirements after checking actual dependencies. Do not repeat this completed bridge, source research or draft production. Payment, production identity, secure private delivery, accepted one-time release policy, paid pilot and renewal remain separate unfinished MVP work.
