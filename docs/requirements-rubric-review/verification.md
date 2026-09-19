# Requirements rewrite verification

## Current validation behavior — 19 September 2026

The original successful reconciliation below is historical. Current owner guidance has changed since that review. Do not rewrite the source hashes or repeat the full requirements rewrite merely to obtain a green result.

Portable document check: `python3 docs/requirements-rubric-review/validate_review.py --structure-only`. Exit 0 / structure PASS means the checked-in package is coherent; source verification explicitly remains NOT RUN. This works from another checkout without the original Desktop archive.

Full reconciliation check: `python3 docs/requirements-rubric-review/validate_review.py`. Exit 0 = structural and source checks pass; exit 1 = document defect; exit 2 = missing or changed source prerequisites, with named blockers. Repository source paths follow the checkout being tested; historical external archives retain their recorded paths. A document defect takes precedence over a source blocker. Successful source checks still do not establish independent review or product acceptance.

Regression checks: `python3 docs/requirements-rubric-review/test_validate_review.py`. Seven isolated synthetic scenarios cover valid full input, missing source, changed guidance without hash rewriting, portable structure-only use with unavailable sources, a duplicate requirement alongside a missing source, an unknown dependency and a dependency cycle. Initial test fixtures lacked sibling linked documents; the fixture was corrected, without weakening link checks. All seven pass. Synthetic source fixtures test checker behavior, not historical reconciliation.

Current outcome: portable structure PASS; full reconciliation BLOCKED by changed current context/guidance. Assess affected requirements against those changes before declaring the register current. Original acceptance case families remain NOT RUN. Actual current command output is saved separately from the original `validation-result.json`.

Boundary: source reconciliation, document completeness, dependency/link checks and independent synthetic-fixture arithmetic. These checks do not exercise the product or accept a real report.

## Outcome

Document checks **PASS** for 97 review rows: 86 original/service requirement IDs, six existing provisional IDs and five new proposals. All rows map to the seven-tenet rubric, separate owner/client friction, dependencies, decision references and applicable acceptance-case families. There are 39 case families and ten decision records. Nine source requirements retain an unresolved material scope/policy disposition; 77 are clarified. None of these counts describes product completion.

The live Sheet was successfully read through a fresh browser XLSX export. Its 78 original requirement texts match the local V4 source exactly. All 86 IDs in its prior detailed review and all six provisional IDs are preserved. The snapshot and per-row prior proposed wording/acceptance are retained. No spreadsheet formulas were changed, recalculated or certified; no Sheet/Linear synchronization occurred. An initial lack of native connector access was resolved with browser export, and the draft's earlier source-gap wording was corrected.

## Reproduce the document check

Prerequisites: Python 3; this package; the historical source files and current project inputs at the paths recorded in requirements.json. Fixed review version: `review-2026-09-18.1`. Source hashes are part of the fixture. Run from the original MindLeverX Build checkout.

1. Run `python3 docs/requirements-rubric-review/validate_review.py`.
2. Expect 86 source IDs, 78 live original rows, 86 live reviewed rows, six preserved provisional IDs, 97 total rows, 11 proposals, 39 case families and ten decision records.
3. Expect unique IDs, exact source-ID coverage, matching source hashes, unchanged live-original V4 wording, complete profile/friction/case references, no unknown dependencies, no cycles, and working local links/anchors.
4. Expect the independently calculated synthetic fixture to yield eligible A1–A4, two matches/four eligible observations = 50%, six attempted and five completed. This is a document-fixture calculation, not the saved Otterly sample or a product result.
5. PASS only if the command exits 0 with an empty errors array. Any mismatched invariant is FAIL; unavailable fixed sources prevent reproducing this check and should be reported BLOCKED rather than changing expected counts to force a pass.

Actual: executed successfully on 18 September Eastern; full output retained in [validation-result.json](validation-result.json). Cleanup: none; validator reads only. Source files, raw evidence, the local running application and cloud records remain unchanged by the validator.

## Review corrections actually made

- Removed seven accidental dependency cycles that confused related features with hard prerequisites (panel/registry, headline/context, reproduction/export, families/results, method/registry, cancellation/view and accessibility/view).
- Removed the recurring-brief dependency from the one-time next-action requirement; a one-time report need not wait for recurring implementation.
- Reused live provisional IDs for buyer/renewal and operating effort, preserving four other existing proposals instead of introducing competing duplicates.
- Retained stronger prior wording for script-dependent pages, backups, separate anchoring and intent, contextual comparability, cancellation/entitlement, recipient routes and synthetic-data exclusion.
- Restored the accessibility acceptance obligation: assessing criteria alone is not enough to accept a release with unresolved applicable failures.
- Made interface binding, policy decisions and actual version pinning explicit prerequisites for product scenarios. Draft test prose is not represented as a runnable production suite.
- Preserved actual same-agent review coverage per row. Earlier reviewers of the live Sheet are not credited with reviewing this new text.

## Limits and next use

Product/evaluation cases T01–T39 are NOT RUN here; missing production interfaces, fixtures or policies are explicitly listed. Independent specialist review of the revised wording, real provider qualification, a complete real report, private paid delivery and customer validation remain outstanding. This documentation pass did not rerun the application test suite because product code did not change.

The accepted V5 share-of-voice and verbatim-quote directions are preserved in the crosswalk and D10; their unprovided detailed requirement IDs and measurement design are not fabricated. Live source readback is complete for the captured export, but any future Sheet update must first check for edits since that snapshot.

Review by: Codex coordinator, same agent. No new specialist, customer or independent-human review occurred. The existing unattended batch must not repeat this completed local draft.
