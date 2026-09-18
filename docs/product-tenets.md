# MindLeverX product and business tenets

Recorded 17 September 2026 from the owner's explicit directions in the MindLeverX requirements task. These principles guide product, service, engineering, design and operating decisions. They do not claim that the current product meets them.

This is the canonical project record. Link to this document from requirements and execution trackers rather than maintaining independently edited copies. The owner expressed these as principles for their ventures generally; this change records them for MindLeverX and does not modify other projects or global instructions.

## Owner-directed principles

| ID | Tenet | Meaning in practice | Evidence to examine |
| --- | --- | --- | --- |
| TEN-UX | Premier UI/UX; low to no friction for both owner and client | Make the whole journey clear, accessible and easy, including onboarding, payment, status, reports, approval, help, cancellation and recovery. Ask for information once. Use plain language, sensible defaults and progressive detail. Minimize avoidable owner involvement. Visual presentation and ease of understanding are core product requirements. | Completion without assistance; time to complete; repeated data entry; clarification requests; errors and recovery; report comprehension; owner intervention minutes and frequency. Evaluate owner and client separately. |
| TEN-REV | Recurring revenue | Deliver continuing customer value that supports renewal and sustainable margins. An initial paid audit can establish a baseline, but the service needs a reason to continue each cycle. | Paid conversion, renewal and cancellation when observed; ongoing usefulness; revenue and actual delivery cost; contribution margin including human effort. Signup, first payment and renewal are separate milestones. |
| TEN-REP | Repeatability | Reuse a consistent process across customers, product lines and businesses, with bounded configuration rather than a new custom project each time. | Reusable inputs, evidence contracts, templates and acceptance checks; successful repeated runs; variation in effort; exceptions and customer-specific changes. |
| TEN-AUTO | Automation | Automate routine collection, checking, preparation, tracking and handoffs, with visible failures and reliable recovery. Preserve agreed human approval where needed. Automation must reduce total effort rather than move work to the customer. | Manual touches, intervention time, successful unattended steps, failure rate, retries, recovery and duplicate prevention. A scripted happy path alone is insufficient. |
| TEN-AI | Evidence-grounded AI intelligence | Use AI to interpret evidence, discover patterns, challenge assumptions and prioritize useful actions. Keep judgment distinct from automated execution, disclose uncertainty, and validate benefit against a simpler approach. | Supported factual claims, independent recommendation review, missing-data handling, comparison with a baseline, correction regression checks, cost and review effort. |
| TEN-LEAD | Competitive leadership | Stay at the forefront through useful differentiation, current platform knowledge and rapid evidence-driven improvement. Adopt new capabilities when they improve customer outcomes and economics. | Dated comparison with credible alternatives on report usefulness, traceability, turnaround, experience, reliability and cost; customer feedback on differentiation. Tool novelty and vendor marketing do not establish leadership. |
| TEN-BEH | Evidence-informed behavioral design: buyer psychology and I-O psychology | Use consumer psychology for buyer attraction, decisions, engagement and renewal; retain I-O psychology for human work, teams and adoption. Understand the people, actions and context behind follow-through. Design for useful informed action and test the proposed mechanism; apply I-O methods to human work and teams. | Defined target behavior, observed barriers, comprehension, informed action, follow-through, workload and unintended effects. See the [behavioral design reference](../.agents/skills/evidence-led-thinking-partner/references/behavioral-design.md). |

## How decisions use the tenets

For a meaningful scope, design, priority or implementation decision, record the affected requirement or roadmap step, contribution to each tenet, owner/client friction, evidence, tradeoffs, unresolved questions and next validation. Use the [MVP assessment](mvp-tenet-assessment.md) as the initial example. This is a review practice, not a new task queue or approval ceremony for every routine edit.

The owner made UI/UX premier. The coordinator's proposed operational interpretation is that an unacceptable owner or client journey cannot be compensated for by a high weighted business score. Specific usability acceptance thresholds still need to be defined with the actual journey and tested; none are silently adopted here. Necessary consent, security, payment clarity and existing owner approval boundaries remain intact.

At meaningful delivery checkpoints, inspect actual friction and failures, identify one targeted improvement and assess its effect on all seven tenets. Use existing project reporting; this record does not add schedules or change automation authority. Checkpoints should produce useful decisions, not reporting overhead.

## Current decision rubric — seven tenets

Assess each tenet as **direct contribution**, **supporting contribution**, **material tension**, **not relevant to this decision**, or **unknown**, with the reason and evidence. These are qualitative judgments, not measured performance. Track owner and client UX separately. Do not add them into a composite score: several tenets share causal mechanisms and double-counting creates false confidence.

Prioritize by dependency and decision value: **P0** resolves the next blocking prerequisite; **P1** is necessary for first paid delivery; **P2** establishes repeated value and renewal. A later priority can be designed early without starting dependent execution. The current [roadmap assessment](mvp-tenet-assessment.md) applies all seven tenets. Earlier numerical ratings remain a historical appendix only; they do not determine today's build order.

For each meaningful decision retain: decision/requirement ID, options, seven-tenet tradeoffs, owner/client effort, evidence and confidence, recommendation and strongest objection, authority, and smallest validation. Use only the fields relevant to the decision; routine work does not require a new form.

## Measurable criteria

The [tenet metrics and acceptance criteria](tenet-metrics.md) define each metric, how to measure it, proposed pilot targets and evidence requirements. They also describe customer-value, trust, privacy, reliability, portability and economic safeguards. Targets are proposals; none is an observed result or external benchmark. Record unknown results as Not measured. The [pressure test and methodology](metric-methodology.md) document which thresholds came from judgment, what external sources support, and how evaluation changed after challenge.

## Related records and authority

- [Build guidance and owner decisions](build-guidance.md): current scope, official-source practice and purchase/release boundaries.
- [MVP assessment](mvp-tenet-assessment.md): six roadmap stages, ratings, mapping and validation needs.
- [Implementation status](implementation-status.md): distinguish local implementation from production functionality; consult later dated checkpoints where applicable.
- [Current checkpoint](../artifacts/unattended-work/checkpoint.md): latest evidence and operational state; local artifact, not guaranteed available in a cloned repository.

Source: owner messages explicitly naming recurring revenue, repeatability, automation, competitive leadership, AI intelligence distinct from automation, and low/no-friction premier UI/UX for owner and client, followed by the request to rerun and document the assessment. No external market research was performed for this scoring exercise. Competitive advantage remains a hypothesis until benchmarked. Follow the official-source practice in build guidance for consequential technical, provider, purchase and release decisions.

## Historical scoring record — superseded

The owner has since added behavioral science/I-O psychology as a seventh tenet. The current rubric above supersedes these weights. The numerical weights below and the linked six-criterion scores have not yet been rebalanced; do not call them a seven-tenet assessment or silently give the new tenet zero importance. Its specific interventions remain proposals.


The six-criterion weights below are a coordinator-proposed working revision after the owner explicitly distinguished AI intelligence from automation. The previous five-criterion weights were UX30/revenue25/repeatability15/automation15/leadership15. This revision keeps UX largest and gives AI its own weight; it is not an owner-approved permanent weighting policy. They are planning choices, not an official OpenAI standard, empirical model or immutable business policy.

| Criterion | Weight |
| --- | ---: |
| Owner and client UI/UX / low friction | 25% |
| Recurring revenue | 20% |
| Repeatability | 15% |
| Automation | 15% |
| AI intelligence | 15% |
| Competitive leadership | 10% |

Rate each from 1 to 5: **1 weak**, **2 limited**, **3 moderate**, **4 strong**, **5 central/direct contribution**. A high score describes the intended design's contribution; it does not certify delivery or customer outcomes.

Record owner UX and client UX separately. For this assessment, use the lower of the two as the combined UX rating so one side's friction cannot be hidden by averaging. This is a coordinator assessment choice.

Weighted total out of 100 = sum of `(rating / 5) × weight`. Strategic ranks compare expected contribution, not execution sequence, implementation readiness, scientific certainty or percentage completion. Preserve dependencies and state evidence confidence alongside scores. Reassess after the real-report review, paid pilot and first repeat cycle; do not change scores merely to show progress.

