# Implementation status — integrated source checkpoint 23 September 2026

The 23 September integrated source branch combines the previously separate website, local product and review documents for release verification. Vercel's production artifact remains website-only. Earlier branch/path references below are dated implementation history, not current setup instructions. See the [collaborator setup](collaborator-start.md) and [handoff](codex-handoff.md) for current orientation.

## 20 September — MIN-19 local measurement correction

[Observed service-error classification](evidence-error-classification.md) is complete locally. Exact observed nonempty service error now blocks the full aggregate and new PDF/report preparation under method v2. Operator counts are explicitly records, including unavailable outcomes; error rows are not negative answers. Pinned v1 exports remain reproducible. 149 tests plus current validator/static/public checks pass; rendered blocking and valid→error recovery were verified. This does not complete collection qualification, owner acceptance or production delivery.

## 20 September — durable local preparation verified

[MIN-18](report-preparation-recovery.md) persists local draft attempts, coordinates identical work across SQLite connections, records failure/interruption, fences late completion and appends explicit retries. The evidence section shows recent saved status and reasons.143 application tests, requirements/public-build checks and desktop/narrow browser verification passed. The new product branch is `codex/draft-recovery-2026-09-20`; original preview processes/DBs are unchanged. This is not a production collection worker or automatic retry service.

## 20 September — local database recovery verified

[MIN-17](database-recovery.md) adds explicit private local backup, integrity verification and fresh-directory restore, with WAL-safe snapshotting and no overwrite. Synthetic recovery retains all seven tables and exact report artifacts; 135 application tests and required checks passed. Current product branch is `codex/local-recovery-2026-09-20` in `/private/tmp/mindleverx-recovery-20260920`, based on e976747. Off-device recovery, retention rules, production readiness and human acceptance remain open.

## Current state — 19 September 2026

Use [the current handoff](codex-handoff.md) for checkout, verification and next-work details. The dated September 12 inventory below is historical and does not define today's next task.

MIN-15's authorized homepage corrections are now live at [mindleverx.com](https://mindleverx.com/), public release `836eaa5` / Vercel `dpl_F9synXrfyPua9VHr9JbtmpATMiZf`. Product changes are retained in `51ef362`. See [all nine feedback dispositions and actual verification](homepage-feedback-slice.md). Product127 tests and focused-release12 tests passed; hosted11-file hashes and seven private-route404 probes passed. Local browser layouts/keyboard/motion/intake/contrast passed within recorded limits. This is a public website update, not deployment of the private application or launch of audit intake. Owner visual review remains open.

The active product checkout is `/Users/tag/Documents/ChatGPT/MindLeverX evidence-inspection`. In addition to the local saved-results frontend and eight-page PDF, MIN-7 now connects a configured internal subject to immutable source/result/PDF revisions and the actual review queue. Retained downloads survive source changes and restart; local decisions are bound to the displayed revision. See [scope, full requirement narratives, tests and owner walkthrough](report-review-slice.md). A subsequent [portable evidence export and offline verifier](report-export-slice.md) preserves the full revision plus local-review snapshot independently of the app/database. It complements the readable PDF and remains private/unsanitized for customer sharing.

Latest verification: all 124 application tests, site/platform and public-build checks passed. The actual report export independently reproduced 0/16 and exact original byte hashes after its test app/database were removed, under Node permissions denying network, subprocesses and unrelated file reads. Ten focused export tests and a separate AI review covered integrity/version/anchor boundaries; the reviewer-found FIFO hang was fixed and independently rechecked. Browser export download and desktop/narrow layout passed. Earlier renderer-v2 PDF content/layout verification remains valid; export does not re-render it. The actual review remains pending for the owner at port 4329. Latest commit and verified GitHub backup refs are on MIN-7; source backup excludes the private source, downloaded export and temporary SQLite DB. Local portability is not off-device recovery, deployment or customer acceptance.

The service is not yet end-to-end: no live collector, payment integration, production customer identity or private report delivery is implemented, and no renewal has been observed. Evidence preparation still takes its source from operator configuration; it now copies that source and generated artifacts into a specific client/report revision. Domain association is configuration, not independent vendor provenance. Internal acceptance cannot qualify collection or release a report. MIN-13's question coverage draft is ready; final pilot freeze remains dependent on MIN-12 qualification. Full requirement approval and Google Sheet synchronization are still outstanding.

The public marketing website has been deployed separately. The application remains local; the historical deployment row below refers to that application, not the marketing site. The full historical admin portal and sample scoring design are not automatically accepted MVP scope.

## Historical checkpoints

## September 18 frontend update

The [local evidence-review frontend](evidence-frontend.md) now displays saved real evidence through the tested inspection API: summary, platform coverage, filterable records and limitations. It is available in the isolated evidence-inspection checkout at http://127.0.0.1:4328/app/#/evidence while the local server runs. 68 tests and desktop/mobile browser checks passed. No production deployment or real-report acceptance.

## September 18 local export-inspection update

The local Otterly-format evidence checker is implemented in an isolated checkout, not merged into this checkout or deployed. It checks retained answer text, preserves input fingerprints, blocks incomplete/ambiguous aggregates and refuses to overwrite files. Ten new tests and the full 65-test check passed; the saved 16-answer real export reproduced 0/16 literal mentions and remained unchanged. See [implementation, exact test cases and evidence](evidence-inspection.md). This supports MIN-5; qualification, approved collection and real-report acceptance remain open. Later dated updates and the [current roadmap](mvp-tenet-assessment.md) supersede the historical next-slice recommendations below.

## September 13 local report preparation update

The local evidence-to-report builder is implemented and verified with supplied fictional inputs: exact input/evidence retention, draft Markdown/JSON, byte hashes, explicit measurement states and no overwrite/release. See [slice verification and remaining limits](report-builder-verification.md). A single bounded AI review/correction trial is complete; ongoing adoption remains undecided. The older integration and missing-source inventory below describes the September 12 checkpoint: requirements have since been recovered and reviewed, and the website is already deployed separately from the still-local operator application. No live collector, production identity or client delivery is established by the new report builder.


Start with the [collaborator brief](ahmed-brief.md) and [baseline/setup map](collaborator-start.md). Work status belongs in [Linear](https://linear.app/mindleverx-codex-build/project/mindleverx-next-release-bc7bec6a8dc4).

The **public website is deployed**. This source branch includes the newer report product, but the operator application remains a **local workflow**, excluded from Vercel’s public build. The product includes saved-results inspection, PDF rendering, immutable report revisions, local review and portable export. Its GitHub source availability does not constitute production release or customer acceptance.

Qualified collection, the final pilot specification, accepted offer/release policy, production identity/payment/private delivery, paid pilot and recurring validation remain unfinished. The requirements register exists as a **97-row review draft**; full source reconciliation and acceptance remain separate. The proposed Figma redesign is not an approved implementation.

The obsolete “missing master requirements,” “loopback-only deployment,” “reports are preview only,” and prescribed technical-audit next-step statements are preserved in the [12 September historical snapshot](archive/implementation-status-2026-09-12.md). They describe that date, not current project readiness.

This replacement is an orientation correction; it changes no product behavior or accepted scope.
