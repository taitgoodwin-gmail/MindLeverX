# Bounded fictional report-review trial

This folder is evaluation material, not an audit of a real business. Four material-error findings were deliberately seeded in the baseline, using situations already represented in `server/seed.mjs`. The straightforward errors do not represent a natural production error distribution.

1. `baseline.input.json` and `baseline.md` preserve the original draft and fictional evidence.
2. `review.json` records the single AI requirements/quality review against criteria T1–T5, frozen in `docs/report-builder-slice.md` before review.
3. `corrected.input.json` contains the coordinator's one correction pass. All six evidence records and the valid F5 recommendation are unchanged.
4. Run the local report builder on either JSON into separate new output directories. Each package preserves the exact input, evidence, draft outputs and hashes. The baseline can be structurally valid despite false prose: structural checks are not a semantic reviewer.

| Finding | Baseline error | Single correction |
| --- | --- | --- |
| F1 | Empty parsed list treated as no citations | Preserve the retained-one/parsed-zero discrepancy |
| F2 | Illustrative scores treated as measured causal improvement | Remove measured/causal interpretation; retain method uncertainty |
| F3 | API example treated as consumer ChatGPT evidence | Separate surfaces; consumer capture failed and remains unknown |
| F4 | Unknown company facts replaced by invented numbers | Return founding date and customer count to unknown |
| F5 | No material error found | Preserve the qualified content hypothesis and its no-change-authority boundary |

Final comparison, verification, observable effort and the adoption recommendation are recorded in `result.json` and `../../docs/report-builder-verification.md`. The coordinator's comparison is not an independent human evaluation. Reviewer confidence is not a measured false-alarm rate. Owner review time and unexposed assistant token/cost data must remain unknown until measured.

The draft/fictional labels and DEC-006 monthly owner-release boundary remain in force. No output is a release approval. Ongoing adoption is undecided; do not infer a new schedule or mandatory optimization loop from this trial.
