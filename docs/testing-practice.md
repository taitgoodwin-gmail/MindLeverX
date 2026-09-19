# Executable acceptance tests — owner correction, 18 September 2026

The owner requested discrete, reproducible, step-by-step scenarios grounded in their testing/implementation/training experience. Broad outcome prose and review questions are insufficient. The coordinator supplies the detail rather than asking the owner to invent it.

## Accepted decision — 18 September 2026

The owner approved a lightweight testability practice: a requirement is ready for development when another tester can execute its linked test cases and determine the outcome without inventing missing details or asking the author what they meant. Keep requirements concise and carry execution detail in linked cases. The coordinator supplies both; unresolved business rules remain explicit rather than being silently invented.

Each case contains setup/data, numbered actions, observable expected results, pass/fail/blocked rules, and actual results with retained evidence after execution. Cover relevant failure scenarios proportionately. An unexecuted case is NOT RUN, not PASS. An unavailable prerequisite is BLOCKED, not a product failure. Standards inform this practice; no formal compliance claim is made.

Sources checked 18 September 2026: [PMI Guide to Business Analysis](https://www.pmi.org/standards/business-analysis) establishes the broader business-analysis reference; [IIBA requirements quality criteria](https://www.iiba.org/contentassets/1dc6a35dff8c46ff85c6cb6b916b7ea3/9-quality-criteria-for-requirements.pdf) and [acceptance-criteria guidance](https://www.iiba.org/contentassets/896f15592ec44b3883e2e5cb9c819357/acceptance-and-evaluation-criteria--insight.pdf) support clear, testable requirements. The readiness rule and format above are our adopted project practice, not a verbatim standard or a mandate to buy certifications/tools.

For a consequential requirement specify: requirement/claim under test; case ID; named system boundary; prerequisites and exact input/version; numbered actions; expected observable result at each step; pass/fail/blocked rules; actual results and evidence; cleanup; and what was not tested. Derive expected results independently of the implementation. Cover the material positive, negative, missing-data and recovery paths as separate cases when applicable. Scale detail to risk; do not impose full suites on trivial reversible edits. A test definition is not execution, and an independent calculation is not a product-system test.

## Worked example: TC-EVD-001 — independent saved-data count

**Claim under test:** the retained sample has zero response_text records containing the contiguous literal brand name MindLeverX, compared without case sensitivity. This deliberately excludes aliases, spaced/punctuated variants, semantic attribution and citation analysis; do not call it complete brand detection.

**Boundary:** independent local evidence calculation. No product collector, report builder or rendered report is exercised. No live prompts submitted. This case does not accept MIN-5/6/7 or establish overall AI visibility.

**Prerequisites:** JSON reader; preserved original [raw export](../artifacts/unattended-work/evidence/2026-09-17-otterly/raw-answers.json) and [retrieval manifest](../artifacts/unattended-work/evidence/2026-09-17-otterly/manifest.json). Read only; do not replace this input with a fresh export. SHA256 must equal dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58; bytes67622. A different/missing file blocks this fixed-sample case rather than establishing a counting defect.

| Step | Action | Expected observation |
| --- | --- | --- |
| 1 | Verify the original file byte count and SHA256 against the values above. | Exact match; otherwise BLOCKED for wrong input. |
| 2 | Parse the top-level JSON array. Count its records and inspect each prompt and engine field. | 16 records; every prompt is “What are the best generative engine optimization services?”; four each labeled chatgpt, perplexity, google and copilot. Otherwise BLOCKED for sample mismatch. |
| 3 | Read response_text for every record, numbered1–16 in file order. Check that each is a nonempty string after whitespace trimming. | All16 present/nonempty; any missing/empty answer BLOCKS the count claim rather than being treated as no mention. |
| 4 | For each response_text only, perform case-insensitive substring search for contiguous mindleverx. Mark that record1 if found at least once, otherwise0. Do not search the prompt, citations or vendor brand_mentioned flag. | Each of the16 record flags is0. This is answers containing the brand, not total occurrences within an answer. |
| 5 | Sum the flags and retain the denominator and per-record results. | Numerator0, denominator16. PASS only for this narrow saved-data assertion if steps1–5 satisfy expectations; a different independently verified count FAILS the zero-count assertion. |

**Actual execution18September:** byte/hash/input checks passed;16 nonempty texts; all16 flags0; result0/16. Machine-readable [result with row evidence](../artifacts/unattended-work/evidence/2026-09-18-test-case/TC-EVD-001-result.json). The check was executed by the coordinator using Python standard-library JSON/hash/string operations; no application code was tested. Another tester can execute the defined procedure manually or independently automate it. Existing evidence limitations remain in the manifest.

## Separate controls on the checker

**Repeated walkthrough, 18 September 2026 at 13:59 UTC:** reran the fixed-input checks and both controls using Python 3 (exact runtime version retained in the result). Actual original count 0/16; synthetic positive 1/16; synthetic empty answer BLOCKED identifying row 1; original hash unchanged. All expectations passed within the independent-check boundary. [Rerun evidence](../artifacts/unattended-work/evidence/2026-09-18-test-case/TC-EVD-001-rerun-20260918T135901003116Z.json). Neither this run nor the earlier run establishes collection qualification or product/report acceptance.

- TC-EVD-001-P: create an in-memory copy of the original records; append a newline followed by MiNdLeVeRx to the first response_text; run the same counting rule. Expected1/16; actual1/16. This is synthetic control data, not a real AI observation.
- TC-EVD-001-N: create a fresh in-memory copy of the original; set the first response_text to an empty string; run the same validity/count procedure. ExpectedBLOCKED with missing-answer reason, not0/16; actualBLOCKED. This is synthetic control data.
- Cleanup: discard both in-memory copies; original export was not written. No account or provider state changed.

## Remaining product test

A report-rendering case must separately name the report-generation command/interface and version, its valid accepted input package, exact expected displayed numerator/denominator and sample limitation, output location, and inspection steps. Do not claim it passes from this calculation. It is not defined/executed here because qualified report input and real-report acceptance remain incomplete. Consumer-AI collection must separately record actual procedure/context and attempts; rerunning a changing AI service is not a promise of identical answers.

For comprehension tests, retain a defined participant/task/script/reference-answer scoring procedure and record assistance and disagreement. Do not confuse a deterministic arithmetic check with a human-usability test or a population-level success claim.
