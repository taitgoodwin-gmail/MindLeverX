# Metric provenance, pressure test and benchmarking method

Reviewed 17 September 2026. Scope: pressure-test the proposed metrics and persistence method, not run a customer study, new provider collection or paid benchmark. No claim that the product meets these criteria or leads the market follows from this review.

## How the initial metrics were derived

Initially the owner supplied six values; a seventh, behavioral design, was added later. The coordinator translated each into observable behaviors, then chose candidate measures and provisional operating targets. For example: low friction → independent completion and active minutes; recurring value → paid renewal and contribution; intelligence → supported conclusions and useful recommendations.

The precise 2/5/10-minute thresholds, 60% margin, 80% reuse/automation, three successful runs, four-of-five preferences, three competitors and two advantages were coordinator judgment. They were not measured baselines, official OpenAI requirements or quoted GEO industry benchmarks. The weighted roadmap ratings were also judgment, not empirical estimates. The initial documents labeled these proposals, but the numbers still conveyed more confidence than was warranted. This review tightens their use.

## Findings and disposition

| Metrics | Provenance / benchmark fit | Decision after pressure test |
| --- | --- | --- |
| UX-01, UX-03: four of five users succeed/comprehend | NN/g supports small qualitative rounds to discover problems, not population success-rate claims. The exact four-of-five and two-minute cutoffs came from us. | Remove four-of-five as an acceptance gate. Use initial sessions to identify and retest issues, recording individual results. Quantitative targets need predefined precision, representative recruitment and an appropriate sample. Keep two minutes only as an unvalidated comprehension design hypothesis. |
| UX-02, UX-04: five-minute intake / ten-minute owner effort | No matching external benchmark established by this review; task scope and required review differ by service. | Retain as provisional effort budgets, not SLAs. Measure baseline, range and failures. Derive owner budget from expected customer load and available owner hours as well as usability. |
| UX-05: visual/interaction quality | Operational checklist aligned to the project's existing accessibility and UX guidance; not a universal numerical score. | Keep task-based review; log severity and ensure aesthetic preference does not substitute for usability evidence. Existing accessibility guidance remains applicable. |
| REV-01, REV-02, REV-04: payment, renewal and usefulness | Direct business events/customer evidence, not externally validated rate thresholds. | Keep explicit milestones and cohort definitions. First payment or renewal does not establish conversion/retention rates. Report the eligible count and observation cutoff. |
| REV-03: 60% contribution | Benchmarkit's 2025 B2B SaaS study reports median gross margins of 81% for subscriptions and 30% for professional services; total 77%. Different businesses and accounting definitions from our proposed contribution measure. | Use that range only as context about business-model differences. It neither validates nor disproves 60%. Derive target from MindLeverX costs, labor, price and capacity; keep 60% a scenario until economics are observed. Do not average those external percentages into our target. |
| REP-01: three accepted runs | Internal smoke test of repeat execution, not reliability statistics. | Keep as an early operational check; log all attempts and adversarial recovery cases. Longer-term reliability requires a relevant sample and observation period. |
| REP-02: 80% reusable activities | Internal heuristic; checklist granularity can distort the percentage. | Supporting measure only. Pair with per-customer setup minutes, bespoke code/configuration and exception load. Two configurations show limited portability, not cross-industry scalability. |
| REP-03: recalculable reports | Evidence integrity/reconstruction requirement chosen for this product. | Keep; test actual retained input and processing version. New model answers need not be identical. |
| AUT-01: 80% automated activities | Internal heuristic; easily gamed by splitting steps or excluding difficult work. | Demote to supporting metric. Lead with actual human minutes per accepted cycle and routine cycles reaching the required approval boundary without avoidable rescue; retain failures and rework. |
| AUT-02: measured time saved | Direct matched baseline comparison, sensitive to case difficulty and output quality. | Keep; count verification, recovery and review cost. Do not compare unlike cases or assume owner time is free. |
| AUT-03, AUT-04: recovery / approval | Designed scenario acceptance and authorization integrity, not observed uptime benchmarks. | Keep zero tolerated duplicate charges/unauthorized releases in evaluated cases. Passing tests does not promise zero production failures. |
| AI-01: 100% supported material claims | Report-level acceptance policy, not a claim that a model is 100% accurate. | Keep coverage across every material final-report claim. Disclose reviewer fallibility; retain draft defect rates and corrections. Define materiality before review. |
| AI-02: four of five comparisons | OpenAI supports task-specific evaluations, pairwise criteria, representative cases and human calibration. It does not establish four-of-five as sufficient proof. | Remove numeric gate. Five cases can debug the rubric only. Compare held-out representative cases with blinded/randomized presentation, human calibration and measured uncertainty; determine sample size from the decision before a superiority claim. |
| AI-03, AI-04: uncertainty and correction | Task-specific failure cases and regression practice, consistent with OpenAI evaluation guidance. | Keep. Add concrete reference examples, record disagreement and avoid having the same agent's approval count as independent customer validation. |
| LEAD-01, LEAD-02, LEAD-03: competitors, preference and adaptation | Internal research plan; no actual competitor performance benchmark or customer preference study completed in this review. | Three alternatives is a starting sample, not market coverage. Choose by buyer substitution, compare equivalent deliverables, disclose vendor claims/unavailable evidence and ties. Two favorable dimensions support a narrow advantage, not an overall leadership claim. Recheck only changes consequential to the work. |

## Sources actually checked

1. **Nielsen Norman Group**, Raluca Budiu, July 11, 2021: https://www.nngroup.com/articles/5-test-users-qual-quant/ . Small qualitative samples diagnose issues; quantitative generalization needs appropriate sampling and uncertainty. Accessed 17 September 2026. This supports study-method correction, not our time thresholds.
2. **OpenAI, Evaluation best practices**: https://developers.openai.com/api/docs/guides/evaluation-best-practices . Accessed 17 September 2026; page publication date not established. Recommends task-specific representative evaluations, clear rubrics, human review/calibration and comparisons; warns of position and verbosity bias. This supports the evaluation method, not our numerical acceptance rates.
3. **Benchmarkit, 2025 SaaS Performance Metrics**: https://www.benchmarkit.ai/2025benchmarks . Accessed 17 September 2026. Historical B2B SaaS gross-margin context, not a GEO-service contribution-margin benchmark or target. Cohort/definition mismatch prevents direct comparison.
4. **OpenAI, Customization**: https://learn.chatgpt.com/docs/customization/overview . Accessed 17 September 2026; page publication date not established. Distinguishes persistent project instructions, reusable skills and memories carrying context. Supports the persistence recommendation below; does not guarantee future adherence or cross-product synchronization.

This was a bounded primary-source review. No Gartner/Forrester figures, paid research, competitor customer accounts or current GEO provider unit economics were accessed. Do not attribute our thresholds to those organizations.

## Method for validating and benchmarking from here

1. **Start with the decision.** State what the measure will change: redesign intake, adjust price, automate a step, adopt AI analysis or expand the pilot. Eliminate metrics with no decision attached.
2. **Classify provenance.** Label each number external benchmark, internal baseline, business constraint, normative acceptance rule or unvalidated hypothesis. Record dates, source and applicable population.
3. **Specify the comparison.** Freeze task, denominator, cohort, time window, quality definition, exclusions and costs. Match competitor service level and accounting definitions. For AI, compare the same evidence against a simpler credible alternative; control prompt/model/configuration versions.
4. **Collect a baseline without hiding friction.** Record raw results, active/elapsed time, assistance, required approval, failures, rework and costs. Start with the smallest useful diagnostic exercise; do not convert it into a population-rate claim.
5. **Challenge failure modes.** Inspect missing/conflicting data, off-scope prompts, changed methods, duplicate jobs and unclear reports. For AI quality, randomize/blind answer order, define severity/examples and calibrate reviewer agreement against qualified human judgments before scaling automated grading.
6. **Choose rigor proportionate to the claim.** A formative UX change needs observed problems and retesting. A conversion rate, superiority claim or reliability commitment needs adequate data, predetermined uncertainty and representative coverage. Choose sample size before the consequential evaluation; do not repeatedly peek or retest until a preferred result passes.
7. **Set targets from economics and user needs.** Derive effort budgets from price, cost, expected customer count and available hours. Compare internally across equivalent versions before using external industry percentiles. Record why a tradeoff is acceptable.
8. **Test sensitivity and revisit.** Change plausible weights/assumptions and disclose when rankings change. Preserve dependency order and critical quality boundaries. Update records when evidence changes, using existing reporting rather than adding meetings or autonomous schedules.

## Actual analytical checks performed in this review

No customer or AI output experiment was run. The following calculations pressure-test interpretation only.

**Five comparisons:** if five independent, binary comparisons had an equal chance of either system winning and no ties, at least four wins occur with probability `(5+1)/32 = 18.75%`. Thus four-of-five alone is weak evidence of superiority. These assumptions are an illustration, not a statistical analysis of real test results.

**Historical six-criterion weight sensitivity (superseded for prioritization):** recalculated the same proposed stage ratings under three illustrative weight sets. Order of weights: UX, revenue, repeatability, automation, intelligence, leadership.

| Step | Working 25/20/15/15/15/10 | Equal weights | UX emphasis 35/15/15/15/10/10 |
| --- | ---: | ---: | ---: |
| Evidence |74|76.7|73|
| Report |83|83.3|82|
| Offer |81|80|80|
| Paid workflow |84|80|87|
| Pilot |77|76.7|77|
| Recurring delivery |91|90|89|

Recurring delivery remains highest in these three scenarios. Report and paid-workflow ordering changes, so their one-point original difference is not a robust priority conclusion. This is a narrow weight test, not full uncertainty analysis: ratings themselves are subjective, criteria overlap, and dependencies still govern execution. Do not double-count intelligence-driven time savings as independent business proof in several columns.

## Preserving the thinking-partner approach

Use a short repository-root `AGENTS.md` for standing behavior: challenge assumptions proportionately, use evidence, label uncertainty, consider simpler alternatives, apply the seven tenets, recommend a concrete next validation and retain corrections. Link to these documents rather than embedding the full rubric in always-loaded instructions. The project working agreement has been saved locally; fresh-session discovery has not been tested.

A reusable skill is appropriate for the richer repeatable workflow—problem → alternatives → evidence → seven-tenet assessment → challenge → recommendation → validation—especially across ventures. The repository-scoped [evidence-led-thinking-partner skill](../.agents/skills/evidence-led-thinking-partner/SKILL.md) is now finalized; see its [release and validation record](skill-proposals/evidence-led-thinking-partner-proposal.md). Its method contains no fixed numeric thresholds. Global installation and cross-product behavior remain outside this release.

Memories can preserve useful context, but should not be the only copy of the operating agreement or a substitute for versioned decisions. No memory setting or global instruction was changed. Availability and cross-product behavior were not tested. Project instructions are guidance, not guaranteed flawless recall or an expansion of authorization.

## Seven-tenet reconciliation — 17 September 2026

The current roadmap uses qualitative seven-tenet mappings and dependency priorities. Historical arithmetic above is retained for provenance, not reused as a current ranking. BEH-01–04 now have canonical definitions in tenet-metrics.md; their source methods and limitations are in the skill behavioral reference. Independent review caught inconsistent leadership/reuse gates; both were corrected to match the dispositions above. The skill trial is recorded separately and is not a customer or commercial validation.
