# Observed service-error classification — MIN-19

20 September 2026. Completed local correctness correction; collection qualification, owner acceptance and customer release remain open.

## Problem and decision

Three records in the privately preserved September 20 exports (row 11 in prompt-01, prompt-04 and prompt-11) contain the same nonempty service-error text. Under method v1, isolating these actual records in memory returns a complete 0/3 measurement and labels them answer records. Their full source files happen to be blocked by separate empty rows; that does not make classification of the error rows correct. The raw files were never edited or connected to an existing owner preview.

Method `answer-text-literal-substring-lowercase-v2` blocks the exact observed marker: `I'm sorry, I'm having trouble responding to requests right now. Let's try this again in a bit.` It sets `answerPresent: false`, `literalMention: null` and an error issue naming the source row/field. Any such error blocks the full aggregate and report preparation. No denominator is silently reduced and no zero result is fabricated.

This exact-match rule is an implementation choice grounded in retained evidence, not a documented vendor error protocol or a general failure detector. Similar language, quoted errors and ordinary negative answers are not heuristically excluded. Missing/empty data remains blocked by the existing checks. The limitation is explicit in v2 results; other outcome types still require evidence review and future supported rules. No complete attempt ledger, semantic classifier or eligible pilot sample is inferred.

## Plan, scope and full requirement narratives

Estimate before work: 20–30 minutes. All three steps complete: (1) reproduce and add exact-marker blocking; (2) preserve old version reproduction; (3) verify inspection, API, frontend, PDF boundaries and old exports. One agent; no independent specialist or human review claimed. Existing evidence-led thinking-partner and browser-verification workflows applied. Agent-browser CLI was unavailable, so the connected CUA browser supplied rendered checks. Linear MIN-19 was opened beside the task (app returned queued).

These current narratives remain **review drafts**, not newly approved full requirements:

- **MLX3-AUD-007 — Honest Unmeasurable-Property Handling:** When a property cannot be resolved, reached or measured, the result identifies the failed scope and reason without assigning a fabricated score or treating the failure as measured zero. Steps 1 and 3 partially implement this for one evidenced service-error marker in local saved data.
- **MLX3-MEA-010 — Versioned Answer Classification:** A pinned deterministic rule set derives measurement classifications from preserved raw observations; corrections append a versioned successor and do not overwrite evidence or prior classifications. Steps 2 and 3 implement a local method successor, with explicit legacy reproduction and unchanged raw bytes.

Source: [current revised narratives](requirements-rubric-review/revised-requirements.md). Existing authorized saved-results/report correctness work supplies implementation authority; the draft wording itself does not approve collection, deployment or commercial scope.

Owner/client UX benefits from a specific unavailable state and honest record counts. Repeatability comes from pinned methods and immutable sources; automation rejects the known bad input before rendering or adding review work. This deterministic guard adds no AI intelligence. Revenue, competitive advantage and comprehension improvements remain unmeasured. Avoiding a misleading zero supports informed decisions without introducing a new owner approval step.

## Compatibility and user-visible behavior

Live inspection, results, PDF and preparation use v2. A query parameter cannot select legacy behavior. New reports have a different processing identity because the method is part of that identity. Old revisions and PDFs remain stored bytes; no migration or rewrite occurs. The offline verifier explicitly selects the method pinned by each snapshot and accepts both v1 and v2; unsupported methods remain unsupported. A legacy PASS proves historical reproduction, not that its old classification rule is now recommended.

The results page explains the service-error block and disables PDF download. The operator page shows records retained (including unavailable outcomes), with mention count unavailable and row status Answer unavailable. An error record is not labeled a successful answer. Loading bad evidence after valid results hides the old finding and disables the old download path.

## Executable verification and actual results

Run from the product checkout with Node >=24. ReportLab Python for the complete suite: `/Users/tag/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`.

| Case | Actions and expected outcome | Actual |
| --- | --- | --- |
| ERR-01 known outcomes | Run `node --test tests/evidence-outcomes.test.mjs`. Exact marker alone, three rows, and mixed valid/error rows must block; aggregate and error-row literal mention null, record count unchanged and bytes unchanged. | PASS. New regressions first failed against v1, then passed after correction. |
| ERR-02 bounded recognition | Same test file: normal negative answer, quoted marker and apology text remain literal answers with the fixed 1/3 oracle. Unknown method throws; explicit v1 reproduces its historical 0/1 behavior. | PASS; no generic text classifier claimed. |
| ERR-03 report boundaries | Run `node --test tests/report-revisions.test.mjs`. Synthetic exact-marker source must show blocked results, reject TXT/PDF/revision requests with 409, ignore attempted legacy query selection and add no report/review or render call. | PASS. Also direct text/PDF helpers reject blocked input. |
| ERR-04 pinned versions | Run `node --test tests/report-export.test.mjs`. Both methods reproduce their pinned results; methods have distinct processing identities, cross-version report/snapshot mismatch fails and unknown versions remain unsupported. | PASS. Existing private v1 retained-report-export also independently passed the current verifier. |
| ERR-05 actual evidence | In memory, inspect the three retained error rows and unchanged original sample; verify the old private export using the current verifier. No provider run. | Error rows blocked with aggregate null; original sample complete 0/16, original SHA unchanged; legacy export PASS. Receipt below. |
| ERR-06 rendered state | Isolated synthetic preview: open results and operator evidence, inspect disabled download/no result count and unavailable row; replace only disposable source with known 1/2 fixture, reload, then restore error fixture and reload. | PASS: valid 1/2 appears; returning to error hides prior result/explore link and disables download. Operator shows Records retained and Answer unavailable. Desktop visual inspected; no console errors observed. No new mobile/full accessibility claim. |

FAIL if any known service-error row becomes a negative measurement, denominator shrinks, old export stops reproducing, source changes or stale results remain visible. BLOCKED if runtime/browser is unavailable; unavailable checks must not be recorded as PASS.

Final application suite: **149/149 PASS**, including six new tests; seven requirements-validator scenarios, structure, website/platform and public build checks PASS. Final platform wording was also verified in the rebuilt browser and repeated site/platform checks. Source evidence, focused regressions and final logs are in `artifacts/error-outcome-verification/`. These paths are private/local verification records, not cloud attachments.

The preview used only `/private/tmp/mindleverx-error-preview-20260920` and port 63292. Cleanup is recorded in the final receipt. Existing 4328/4329 previews, pending report approval and their database were untouched. No collection, outbound contact, purchase, push, merge or deployment occurred.

## Sources and limits

- [Official Otterly export documentation](https://help.otterly.ai/can-i-export-my-data-and-reports), dated 18 August 2026, rechecked 20 September: documents raw JSON/CSV export but supplies no machine-readable failure taxonomy. It does not justify guessing an error flag.
- [Preservation record](collection-qualification-2026-09-19.md): exact local source/time/hash provenance and observed marker; no new collection qualification. Raw evidence manifest SHA `053d316c34b8bd2bdfa3cabf4a3a0ee4300cb5950033f53535676195b6f11a64`.
- The owner-approved [official-source build practice](build-guidance.md) distinguishes failed collection from measured absence. This correction uses that existing principle; no new statistical, commercial or retention policy is invented.

The full MVP remains unfinished. Qualification, accepted pilot/offer, owner usability/release decisions and production identity/payment/private delivery are separate prerequisites. Do not repeat this correction or generalize the exact marker without evidence.
