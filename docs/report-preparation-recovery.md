# MIN-18 — Durable local draft preparation

20 September 2026. Owner-authorized independent MVP engineering. Based on c00da406ef4aa22175f6ff80476a60ace186cb76; isolated branch `codex/draft-recovery-2026-09-20` in `/private/tmp/mindleverx-recovery-20260920`. All three steps completed locally; initial estimate 30–45 minutes.

## Outcome, authority and requirements

Persist attempts for the existing local draft-preparation flow, coordinate across processes, show truthful status and retain explicit retry history. The former Map deduplicates only inside one instance; failed render/commit attempts leave no durable status. This is useful shipped-flow recovery, not a general collector, billing worker, scheduler or new release authority. Existing operator session controls and immutable report contract remain in force. The current 97-row register remains a review draft; the following are partially supported, not fully accepted by this slice.

**MLX3-AUD-005 — Idempotent Engagement and Run Creation**

Repeating the same engagement or run creation request produces one logical engagement or run and no duplicate fulfillment, while distinct authorized requests remain distinguishable.

**MLX3-AUD-006 — Truthful Run Status**

Each displayed run state comes from persisted server state, and a failed or unacknowledged operation never displays completion.

**MLX3-OPS-003 — Stage-Level Recovery**

An authorized retry targets only an eligible failed stage, preserves completed artifacts and appends a new attempt; automated retry, where approved, follows the same bounded recovery contract.

**MLX3-OPS-005 — Automated Action Audit Trail**

Every state-changing automated action appends an attributable event containing the action, reason, input references, outcome and time without recording unnecessary sensitive content.

## Three-step plan and tenets

1. Define fixed executable concurrency, failure/restart and preservation cases (all four draft mappings).
2. Add durable attempts and single-active-attempt coordination; show recent history within the existing local draft section (AUD-005/006, OPS-005). Explicit requests append retries after failure/interruption (OPS-003).
3. Verify failure paths, fenced late completion, existing reports, API boundaries and backup compatibility, then record and commit (all mappings).

Repeatability and automation contribute directly; clear persisted status supports owner usability. Continuity supports recurring delivery, with no measured revenue or client-experience benefit. AI judgment is unnecessary. Competitive advantage is unknown; reducing uncertainty through explicit states is a usability hypothesis. Keep the existing visual language, with no redesign. One writer; no subagents.

Implementation choice: one active attempt per exact client/source hash/processing identity. Persist actor as Local operator (not authenticated human identity), input references, retry reason, start/deadline/finish times and safe outcome code/message. Store no raw evidence, exception stack or local file path in attempt rows. Completed attempts cannot be updated. Existing stored revisions are returned without a new attempt or rendering. New source/processing identity creates distinct work.

Local attempt expiry is 30 seconds, allowing the existing renderer's 15-second subprocess limit plus local persistence. This is a chosen coordination/fencing timeout, not a service SLA, approved operating spend limit or measured RTO. Expiry is reconciled when the workspace is read or a new preparation is requested; it means interrupted/timed out, never success. An expired renderer cannot commit a report. No automatic retry: the owner initiates the next request after resolving the recorded problem. No remote paid work exists in this slice; remote uncertain outcomes must not inherit this local retry policy. Shared-disk multi-host operation and clock-change tolerance are not established.

## Sources checked 2026-09-20

- https://sqlite.org/lang_transaction.html — documented transaction/write-lock behavior; short `BEGIN IMMEDIATE` operations serialize claims and atomically persist success with report/review.
- https://sqlite.org/partialindex.html — documented unique partial indexes; enforce at most one running attempt for a logical preparation.
- https://sqlite.org/lang_conflict.html — documented conflict behavior; avoid REPLACE, which can delete old rows/history.

Schema addition is additive. Backup tooling must accept both the exact seven-table schema from c00da406 and the current schema, preserving the manifest's actual schema/counts. Restoring an old snapshot does not invent attempt history; normal app open adds the new empty table. Both versions require integrity and foreign-key checks and report hash validation.

## Executable cases — defined before implementation

Prerequisites: Node >=24; exact base c00da406; synthetic source with two fixed answers, one literal MindLeverX mention; synthetic deterministic PDF for timing/failure seams; real-PDF path remains covered by existing integration/recovery tests. Every case uses an isolated temporary DB and removes it. PASS requires every expected observation; unavailable loopback/runtime is BLOCKED; assertion mismatch is FAIL. No owner data or existing preview ports.

1. **PREP-01 — Concurrent deduplication (AUD-005/OPS-005).** Open two app/database instances on one fixture DB. Hold first renderer, send identical preparations through both instances, inspect running persisted row, release first renderer. Expect one rendering invocation, one attempt, one revision/review/activity; both requests resolve to the same revision. Replay after process restart: no new render/attempt. Different source: a distinct retained revision and attempt.
2. **PREP-02 — Failure and explicit retry (AUD-006/OPS-003/005).** Renderer throws a path-bearing error. Expect safe failed attempt, no orphan revision/review/activity, no path in API/database outcome. Restart with working renderer and repeat source request. Expect prior terminal attempt unchanged, new numbered attempt/retry reason and a pending local review. No automatic work happens between requests.
3. **PREP-03 — Atomicity and late completion (AUD-005/006/OPS-003).** Inject failure on final activity insertion: expect transaction rollback and a failed attempt. Remove trigger and explicitly retry: one report, history retained. Separately hold a render until a controlled clock passes its persisted deadline; reconcile interruption and start a successor. Let old renderer finish. Expect old request refused, no old artifact committed and one successful successor.
4. **PREP-04 — Actual process termination (AUD-006/OPS-003).** Start a child process that claims an attempt and signals after renderer entry, then terminate it. Open a fresh instance with controlled clock just past the recorded deadline. Expect interrupted state, zero report/review, retained attempt and explicit retry success. Termination before deadline must not be inferred merely from another server starting.
5. **PREP-05 — Controls, UI and old reports (all mappings).** Existing API tests reject missing session/CSRF/foreign origin and extra request fields. Workspace shows only persisted safe attempt fields and existing escaped markup; failure/running/success labels must not say released. History remains visible when source reading is unavailable. Test same-source replay after a report exists, and unchanged old revision hashes. Browser-check the added history within existing desktop/narrow layouts using synthetic data.
6. **PREP-06 — Backup/migration (OPS-003/005).** Recover a current snapshot with running/terminal attempt rows and compare them; verify a seven-table c00da406 fixture and restore/open it, expecting all previous records untouched and empty new attempt history. Existing corrupt-input/refusal-to-overwrite checks must still pass.

Initial execution was NOT RUN before implementation. Results below record the completed checks.

## Actual execution and evidence — 20 September 2026

- **Eight new focused cases PASS** (PREP-01–06, including separate late-completion and FIFO variants). Two distinct SQLite connections demonstrated one renderer and one retained result for concurrent requests. A child renderer process was actually killed; its persisted attempt later reconciled to interrupted, and explicit retry appended a successor. Late completion was refused. Success/attempt/report/review/activity transaction rollback and no raw exception leakage passed. These are automated synthetic tests, not human/customer acceptance.
- **143/143 application tests PASS**, including existing report/PDF/export, API controls and database recovery; build/site/platform checks passed. [Final full log](../artifacts/preparation-verification/check.log). [Focused lines extracted from that final run](../artifacts/preparation-verification/focused-final.txt). Node 26.7.0; `MLX_PDF_PYTHON=/Users/tag/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`; loopback test listeners enabled.
- Requirements structure and **7/7 validator regression scenarios PASS**; original-source freshness reconciliation NOT RUN. [Log](../artifacts/preparation-verification/requirements.log). Public build **PASS**, no deployment. [Log](../artifacts/preparation-verification/public-build.log). `git diff --check` PASS.
- **Browser walkthrough PASS:** connected in-app browser; agent-browser CLI unavailable. First synthetic preparation visibly failed; history refreshed without another click. Explicit retry opened one actual pending local review showing 1/2, then the evidence page retained failed attempt 1 and successful attempt 2. Reload preserved history. Expanded details included client, actor, retry reason and hash. Desktop and 390×844 checks passed; document scroll width was exactly390px at390px viewport. No console errors were observed. [Browser observations and persisted fixture result](../artifacts/preparation-verification/browser-result.json). Screenshots were inspected in the task's tool results; no local screenshot files claimed.
- Controlled preview used ephemeral port63291, process19412; terminated after verification. Synthetic preview DB/journals/source removed. Original previews on4328/4329 and owner records were not touched. No draft was accepted, released or sent.

Backup coverage now includes the eighth table. A current snapshot preserved both running and terminal attempts exactly. An exact pre-attempt schema snapshot verified, restored and opened with all earlier records retained and an empty new attempt table. Opening old code against a new DB is not the intended rollback: use the corresponding backup/code pair. No production migration or mixed-version concurrency claim.

Self-review improvement: preparation source reads now reject nonregular files without blocking on a FIFO, before claiming work; a bounded subprocess regression checks the refusal and absence of a phantom attempt. This is preparation-input protection, not a claim that every evidence-reading route was redesigned. Full raw-source read failures remain outside the attempt ledger because no validated source identity exists yet.

## What the operator can try

In the new product branch, configure the existing local saved-evidence/client mapping, open Evidence review, and use **Prepare local draft & open review**. Refresh during a preparation to see its persisted running state. Failed or timed-out attempts remain in **Recent local draft attempts**; after fixing the stated issue, the same preparation action explicitly retries. A completed matching draft opens its existing review without rendering again. Attempt details reveal the client, reason, actor and source hash. History stays available when the source is unavailable; no failed attempt is labeled a measured zero or released report.

Latest100 attempt summaries are returned to the local workspace; the panel shows the latest10 applicable attempts. All rows remain in SQLite for recovery/audit. No retention duration, automatic retry, spending cap, payment/provider execution, scheduler or client release is implemented. The UI updates on request completion/error or explicit refresh, not via a continuous progress feed. Deadline reconciliation is best effort at those accesses, not a background watchdog. Actor remains the existing local session identity, not production authentication. Same-host SQLite and matching code versions are the tested coordination context.

Implementation self-review only; no independent specialist was spawned. Direct verified improvement is persistent failure/retry history, cross-connection render deduplication and exact recovery; reductions in owner effort/cost remain unmeasured. This slice contributes to the requirement narratives without accepting the full draft or closing MIN-5/6/7's qualified-delivery gates.
