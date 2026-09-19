# Pilot prompt benchmarks

Checked 19 September 2026 against the vendors' primary pages. Research note for the owner's question about other providers' benchmarks. This is not an approved sample design, purchase, or collection instruction.

## Requirement traceability

- MEA-001: panel size, coverage and version freeze; historical 10–15 remains a candidate for bounded testing.
- MEA-007: repetition and uncertainty; historical conditional three-attempt rule is not established by this research.
- INV-003: qualify and label the actual collection surface; vendor platform coverage does not expand ours.
- Decision D-03 / Linear MIN-13: freeze the pilot specification after method qualification in MIN-12.

Canonical draft: [revised requirements](requirements-rubric-review/revised-requirements.md). Tracking: [MIN-13](https://linear.app/mindleverx-codex-build/issue/MIN-13/next-2-freeze-the-bounded-internal-pilot-specification).

## Evidence

| Source | Observed practice | Evidence class and limit |
| --- | --- | --- |
| [Otterly onboarding](https://help.otterly.ai/onboarding3), dated 14 September 2026 | Recommends approximately 100 questions per country/language/product category, with 50 as its floor. Favors unbranded purchase/evaluation questions and tags for segmentation. | Vendor recommendation, not an independently validated statistical minimum. The page's worked multiplication example is inconsistent; do not reuse it. |
| [Profound prompt design](https://www.tryprofound.com/blog/how-to-design-prompts-for-ai-visibility-tracking) | Recommends starting with 100; reports users tracking 100–1,000. Prioritizes unbranded questions, buyer-journey coverage and geographic relevance. | Vendor guidance and self-reported usage, not a representative industry survey. |
| [Peec pricing](https://peec.ai/pricing) | Starter/Pro/Advanced provide 50/150/350 prompts respectively, with daily tracking. | Commercial capacity, not a recommended minimum sample or reliability guarantee. |
| [Profound frequency study](https://www.tryprofound.com/blog/is-once-a-day-enough) | Compared one versus ten daily observations of 753 prompts across seven US platforms over two weeks. Reports roughly two percentage points of aggregate visibility difference. | Vendor-run study. Its large portfolio and aggregation cannot validate one daily observation for our small panel. Reported total run counts are not transparent from the nominal design; raw data were not independently checked. |

Otterly's [prompt allowances](https://help.otterly.ai/amount-searchprompts) include a 15-prompt Lite plan. This is a capacity statement, distinct from its onboarding recommendation above. Account allowance and suitability must be checked before execution.

## Interpretation and proposed next step

These sources do not establish a universal sample-size standard or universal passing visibility percentage. They support questioning the adequacy of 10–15 for broad customer-facing monitoring. Distinct questions, repetitions, observation days, platforms and locales are separate design dimensions.

Recommendation: retain a small explicitly bounded workflow test if useful, and design the customer monitoring panel against the 50–100-question guidance after defining its buyer intents, category, locale and claims. More questions alone do not establish representativeness. Draft the coverage map first, inspect meaningful gaps, then choose size and repetition within qualified access and cost limits. Any change remains a proposal for D-03, not a silent rewrite of acceptance criteria.

Tradeoffs: broader coverage supports competitive comparison and repeatability but raises collection, evidence-review and maintenance effort. Owner UX requires a curated panel; client UX requires readable limitations. Recurring-revenue value remains untested. Versioning supports automation; adding questions is not itself AI intelligence. Buyer-intent selection applies the behavioral tenet, without proving actual customer demand. Evidence of narrow sufficient coverage or excessive review cost could justify a smaller explicitly scoped service.

Verification: primary pages read on the date above. No independent replication, customer validation, provider collection, requirement approval, Linear update or GitHub publication was performed in this research step.

## Owner correction — 19 September 2026

The owner directs us to improve efficiency and use AI intelligence to achieve useful outcomes with less work. Do not turn competitor prompt counts into a volume target. This supersedes treating 50–100 as the starting design objective above; those counts remain external reference points.

Proposed application to MEA-001 / MIN-13:

1. Use available customer and business evidence to draft buyer intents and candidate questions, preserving provenance and labeling AI-generated hypotheses.
2. Use AI to group overlapping questions, propose representative questions and expose coverage gaps. Similar wording alone does not prove equivalent intent or answer behavior.
3. Review the proposed coverage map and choose the smallest panel justified by the intended claims. Final count and repetition rules remain unresolved.
4. After qualified collection, retain a fixed comparison panel and use separately labeled exploratory questions to investigate gaps or unstable results. Preserve version history so changing the panel cannot silently change the meaning of a trend.

AI intelligence here means assisting selection, diagnosis and interpretation. Automation means running the approved repeatable steps. Proposed validation: assess meaningful intent coverage, evidence accuracy, review effort and collection cost; reduced question count alone is not success. This records accepted direction and a proposed method, not implemented functionality or validated savings. No additional collection, spending, schedule or scope is authorized by this note.
