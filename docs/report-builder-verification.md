# Report builder and bounded trial — verification

Checked 2026-09-13 (local date); final check completed 2026-09-14 01:28:58 UTC. Status: local slice complete; MIN-7's real measured-report outcome remains incomplete.

The new local builder preserves supplied evidence and creates draft Markdown/JSON packages with a manifest of exact byte hashes. It does not call a provider, alter the workspace database or UI, approve a report, send anything, or publish. The previous uncommitted README/deployment guidance work was preserved.

## Verification evidence

| Check | Result and limit |
| --- | --- |
| `npm run check` | 55 tests passed, zero failed; existing website/platform checks passed. 46 tests cover the new report package. |
| Runtime | Executed on Node 26.7.0. APIs target the repository's Node >=24 requirement; execution on Node 24 itself remains unverified. No deployment performed. |
| Real command path | Built baseline and corrected packages from `examples/report-trial/` through the CLI into separate `artifacts/report-trial/` directories. |
| Preservation | Independently checked 18 generated-file hashes, exact source-input bytes, all 6 unchanged evidence records and unchanged valid finding F5. Baseline and criteria hashes match the single review record. |
| Existing output | A repeated command against the existing corrected directory failed with EEXIST; no overwrite. Tests also cover files, empty directories, symlinks, concurrent writers and injected failure after partial output. |
| Local privacy | Output directory mode 0700; report and manifest mode 0600 observed on this Mac. This is not production access control. |
| Structural validation | Invalid enums/dates/refs/IDs/approval fields and malformed input are rejected. All supplied prose is inert fenced text; embedded headings/links/HTML cannot become report structure. |
| Truth/approval boundary | Both deliberately flawed baseline and corrected input can be structurally valid. Every generated package remains a draft requiring semantic review. No automatic approval or release operation exists. |

## Team review and trial result

Product coordinator selected the unblocked report-preparation portion of MIN-7. Engineering implemented the package and 46 focused tests. Coordinator code review found enum-type coercion that could omit a family from Markdown; Engineering corrected it and added array/object regressions. One AI requirements/quality reviewer assessed the fictional baseline against the frozen T1–T5 criteria, and the coordinator performed one semantic correction pass and comparison. No independent human calibration occurred.

The reviewer identified four deliberately seeded material-error findings: parser zero, unsupported causal comparison, API/consumer equivalence and invented company facts. All four were corrected; the coordinator comparison observed no new material-error finding and no reviewer false alarm. These are fixture-specific AI judgments, not independently measured error rates. F5 and the exact evidence were preserved. See [review record](../examples/report-trial/review.json), [comparison and metrics](../examples/report-trial/result.json), and [corrected local report](../artifacts/report-trial/corrected/report.md).

**Recommendation: adjust. Ongoing adoption remains undecided.** The bounded review caught obvious seeded errors, but customer usefulness, performance on representative unseeded reports, actual owner review time and full effort/cost are not established. The technical report layout should be simplified before client use. Five minutes of owner review is a proposed target, not a result. The observed reviewer reading/assessment interval was 25 seconds and excludes writing its artifact. Other wall-clock phases are recorded with qualifications; active effort, owner time and assistant billing/token data are unknown. There were no measurement-provider calls or new purchases. Do not equate absent billing data with free work.

## What remains open

- MIN-5 access qualification/specification and MIN-6 actual retained observations before MIN-7 can become a measured internal report. The fiction-based trial does not complete them.
- Buyer/package, provider and measurement method decisions. No automatic score, movement threshold, provider architecture or recurring offer was selected by this slice.
- Production evidence storage, identity, tenant isolation, delivery, retention and recovery. Local hashes/no-overwrite are a bounded contribution only.
- Owner review of the trial recommendation before adopting a standing improvement process. No new loop instruction or schedule has been installed.

Official sources, their scope and project choices are recorded in [the frozen slice](report-builder-slice.md). The existing [MVP plan](https://drive.google.com/file/d/1EI9FAoPqz-oQfOUEYrwdTyZn7M8YyhJv/view), [Considerations Log](https://drive.google.com/file/d/1K0QphizdOW2alE_WhyJX9AH4yU6Q4jH7/view) and [MIN-7](https://linear.app/mindleverx-codex-build/issue/MIN-7/batch-13-produce-and-independently-review-an-evidence-linked-report) record this checkpoint. Applicable requirements reuse their existing Team review field; no new dashboard was created.
