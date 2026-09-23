# Tenet metrics and acceptance criteria

Prepared 17 September 2026 in response to the owner's request for criteria for every metric and additional thinking-partner recommendations. These are proposed MVP evaluation targets, not industry benchmarks, existing SLAs, implemented telemetry or demonstrated results. Definitions are ready for use; targets should be calibrated after the first observed journey and pilot. This document does not authorize development, purchases, release, new customer contact or changes to automation schedules.

Pressure-tested in the same session: see [derivation, sources and benchmarking methodology](metric-methodology.md). The four-of-five UX/AI acceptance gates below have been replaced with diagnostic testing, and step-count automation is now a supporting measure. Other numerical budgets remain unvalidated proposals.

Canonical principles: [Product and business tenets](product-tenets.md). Application to the roadmap: [MVP assessment](mvp-tenet-assessment.md).

## One outcome test above all seven tenets

Does the service help the customer understand their position and choose a useful next action, with acceptable effort and cost? Collect the customer's own explanation and intended action, then follow up on usefulness. Visibility metrics and tool activity alone do not establish business value. A customer's action is not proof that MindLeverX caused leads, revenue or visibility changes.

## Measurement rules

- Every recorded metric needs: metric ID, numerator/denominator or unit, subject/cohort, date window, method/version, evidence link, observed result, target, status, limitations and role accountable for review. The roles below describe responsibilities, not continuously running agents or new assignments.
- Report counts with percentages, especially for tiny samples. Use **Not measured**, **Insufficient evidence**, **Meets proposed target**, or **Needs improvement**. Unknown is never zero or a passing score; pending renewals are not renewals.
- Separate proposed design contribution (roadmap ratings) from verified performance (the metrics below). Do not turn either into a percentage-complete claim. A high planning score cannot offset an unresolved material usability, evidence, authorization or security defect.
- Freeze the task, rubric, eligible cohort and exclusions before a comparison. Log all attempts, failures and assistance. Show required owner approvals separately from avoidable interventions. Do not improve automation percentages by splitting easy steps or removing failed cases.
- Evaluate owner and client experience separately, using the worse outcome in the combined UX assessment. Include mobile and keyboard use where applicable. A visual mockup is not a tested end-to-end experience.

## 1. Premier UI/UX and low friction — product/design responsibility

| ID / metric | Definition and evidence | Proposed initial criterion |
| --- | --- | --- |
| UX-01 Independent journey completion | Participants completing the predefined critical journey without coaching / all participants attempting it. Record abandonment, errors and help. Owner and client journeys measured separately. | Use an initial qualitative round of roughly five representative participants per distinct client user group to find and retest issues. Assess the actual owner workflow separately; do not invent five owners. Record individual outcomes and critical blockers. No four-of-five pass gate or population success rate; choose an appropriate quantitative sample before making those claims. |
| UX-02 Client effort and repeated entry | Active time from beginning intake to submission, excluding provider wait/payment-provider delay but reporting those waits separately; count fields unnecessarily requested twice and avoidable accounts. | Initial intake median at most 5 minutes; zero avoidable repeated data entry and zero unnecessary third-party accounts. Show range and slowest case until there is enough data for percentiles. Necessary consent/authentication stays. |
| UX-03 Report comprehension | Without coaching, can the reader identify the main finding, a limitation and the top recommended next action? Record each answer against the report's evidence. | Observe representative readers explaining all three without coaching; log misunderstandings and retest corrections. Two minutes remains a provisional design hypothesis, not a validated limit; remove the four-of-five gate. Satisfaction alone is not comprehension. |
| UX-04 Owner effort | Active owner minutes per customer delivery cycle, separating required approval, avoidable support, rework and exception handling; elapsed waiting reported separately. | Proposed steady-cycle target at most 10 owner minutes per customer, with an explicit record of every intervention. Pilot/setup effort remains separately visible; unknown labor is not free. |
| UX-05 Interface and visual quality | Review hierarchy, readable type/contrast, consistent controls, useful charts with labels/units, plain language, mobile behavior, keyboard operation, loading/error states and approval/cancellation clarity. Record defects and task impact. | Every applicable critical journey reviewed; no critical blocker, illegible key finding or misleading chart. Minor findings logged. Existing accessibility target remains in build guidance; a checklist is not full conformance certification. |

## 2. Recurring revenue — product/commercial responsibility

| ID / metric | Definition and evidence | Proposed initial criterion |
| --- | --- | --- |
| REV-01 Paid value and recurring conversion | Paid audit buyers who start a paid recurring service / eligible paid audit buyers, with offer, dates and refunded transactions disclosed. | First real paid delivery, then first paid recurring customer recorded as separate milestones. Set a conversion-rate target only after the offer and eligible cohort are defined. |
| REV-02 Renewal | Paid renewals / subscriptions whose renewal date has arrived in the window, with late/pending/cancelled/refunded cases shown separately and a stated observation cutoff. | First actual paid renewal is an MVP commercial-validation milestone. One renewal is not evidence of a stable retention rate. Report counts until a meaningful cohort exists. |
| REV-03 Delivery contribution margin | (Net service revenue minus attributable delivery costs) / net service revenue. Include provider usage, payment fees, attributable subscription cost and human delivery labor at a stated rate. Report overhead/acquisition separately; this is not net profit. | Positive pilot contribution after attributable labor; proposed steady-service target at least 60%. Revisit against measured costs and chosen price. Unknown labor or unallocated costs prevent a verified margin claim. |
| REV-04 Continuing usefulness | Customer can name a useful decision or next action from the current cycle, plus whether the cycle added information beyond the previous report. Retain the customer's explanation. | Every pilot cycle has a recorded usefulness assessment. Mere willingness to renew is intention; actual renewal remains REV-02. A no-change month can be useful if the report explains why and what to watch. |

## 3. Repeatability — engineering/operations responsibility

| ID / metric | Definition and evidence | Proposed initial criterion |
| --- | --- | --- |
| REP-01 Repeat execution | Accepted runs / all attempted runs using the same documented workflow version and declared configuration. Record overrides and exceptions. | Three consecutive accepted internal cycles using the same workflow, without undocumented rescue. This tests the process, not identical AI answers or statistical stability of visibility. |
| REP-02 Customer portability | Standard activities reused unchanged / agreed activities in a frozen onboarding/delivery checklist; record bespoke code, manual adaptations and effort separately. | The earlier 80% is a supporting heuristic, not an acceptance gate. Record setup minutes, bespoke code/configuration and exceptions across two authorized business configurations. Until the second is tested, portability is unverified; two cases do not establish broad scalability. |
| REP-03 Evidence reproducibility | Ability to reconstruct a report from retained input, configuration and processing version, distinguishing deterministic calculations from variable model prose. | Every published metric can be recalculated from retained accepted evidence. Preserve original answers and report versions; do not require a fresh AI query to reproduce an old answer. |

## 4. Automation — engineering/operations responsibility

| ID / metric | Definition and evidence | Proposed initial criterion |
| --- | --- | --- |
| AUT-01 Routine execution without intervention | Eligible routine activity executions completed without human intervention / all eligible routine activity executions in the frozen workflow, including failed attempts. Display required approvals separately. | Supporting heuristic only: the proposed 80% is not a validated target or release gate. Lead with actual human minutes per accepted cycle and the fraction of eligible cycles reaching required approval without avoidable rescue. Disclose denominator, failures and rework; step-count changes cannot establish savings. |
| AUT-02 Human-time reduction | Active human minutes with the assisted workflow versus a comparable documented manual baseline, including verification, rework and recovery. | Show a measured reduction with equivalent accepted output before claiming time savings. No assumed percentage until the baseline exists. |
| AUT-03 Failure recovery and duplicate safety | Results from predefined scenarios: provider timeout, incomplete evidence, duplicate payment/event, interrupted job, retry and failed delivery. Retain state transitions and attempted actions. | All relevant scenarios recover or stop with an actionable exception; no duplicate charge/delivery, silent data loss or false success. Scenario tests do not prove long-term uptime. |
| AUT-04 Approval integrity | Releases with recorded required approval / all releases requiring approval; also record attempted bypasses. | 100% of applicable releases have approval; monthly briefs retain the owner's established approval. Automation must not count bypassing approval as a gain. |

## 5. Evidence-grounded AI intelligence — analysis/independent review responsibility

Automation executes a process. AI intelligence interprets evidence, identifies patterns, chooses appropriate questions and proposes actions. Neither model-call volume nor agent count measures intelligence.

| ID / metric | Definition and evidence | Proposed initial criterion |
| --- | --- | --- |
| AI-01 Claim correctness and grounding | Reviewed material factual claims supported by cited retained evidence / all reviewed material factual claims. Check arithmetic, evidence relevance and sample limits; label recommendations/inferences separately. | 100% of material factual claims supported in the final pilot report and zero unresolved material errors before release. Report draft error/correction rates separately. A link existing does not mean it supports a claim. |
| AI-02 Usefulness beyond a simpler baseline | Compare AI-assisted recommendations with a fixed simpler/template baseline on the same evidence, anonymizing order. An independent reviewer scores relevance, specificity, feasibility, evidence and prioritization; record ties and reviewer disagreements. | Use initial cases to debug the rubric only; remove the four-of-five acceptance gate. Before an advantage claim, determine a held-out sample and uncertainty appropriate to that decision, with blinded/randomized comparison and qualified human calibration. Record ties, correctness regressions, reviewer disagreement, cost and latency. Replace held-out cases if used for tuning. |
| AI-03 Uncertainty and missing-data judgment | Predefined cases with missing answers, conflicting sources, changed methods, weak samples and unsupported causal claims. Record whether output qualifies the finding, requests missing information or refrains from a conclusion. | All critical cases handled without presenting missing data as absence or correlation as causation. Record remaining errors rather than expressing invented confidence percentages. |
| AI-04 Learning from corrections | Accepted review corrections linked to a versioned instruction/process change, followed by replay of the failed case and a retained regression set. | Each material correction is tracked and rechecked before claiming the defect fixed; no known material regression introduced. This is managed improvement, not automatic model learning or permission to self-modify product policy. |

## 6. Competitive leadership — product/research responsibility

| ID / metric | Definition and evidence | Proposed initial criterion |
| --- | --- | --- |
| LEAD-01 Comparable benchmark | Dated comparison against at least three credible alternatives using equivalent use cases on usefulness, traceability, owner/client effort, turnaround, reliability and cost. Distinguish tested features from vendor claims and unavailable evidence. | Use equivalent observed evidence to support only a scoped, dated comparative claim on the dimensions actually tested, disclosing tradeoffs, unavailable evidence and sample limits. Three alternatives/two dimensions are starting heuristics, not permission for an overall leadership claim. No current claim of outperforming competitors is supported; no benchmark purchases are authorized. |
| LEAD-02 Customer-perceived differentiation | Pilot customer's unprompted explanation of why this service is useful compared with their current alternative; record what they would choose and why. | At least one specific customer-validated reason to choose us, beyond lower price or generic AI branding. Broader preference claims require more customers and disclosed sample sizes. |
| LEAD-03 Adaptation to relevant changes | For a material provider/model/source change, record detection date, impact assessment, proposed response and verification result. Distinguish unresolved dependency from ignored change. | Assess consequential known changes before the affected next measurement or release. Adopt only changes that improve the measured outcome; there is no requirement to chase every new tool. Existing reporting cadence is unchanged. |

## 7. Evidence-informed behavioral design — product/behavioral responsibility

Consumer psychology leads buyer decisions and continued use. I-O psychology informs human work and team adoption. The [behavioral reference](../.agents/skills/evidence-led-thinking-partner/references/behavioral-design.md) explains methods and source limitations. The following are decision criteria, not demonstrated psychological effects or an additional mandatory survey.

| ID / metric | Definition and evidence | Proposed initial criterion |
| --- | --- | --- |
| BEH-01 Barrier evidence | For the actor and target action, record observed comprehension, capacity, opportunity, authority and motivation barriers; distinguish observation, self-report and hypothesis. | Each consequential intervention has a stated mechanism and supporting evidence or an explicit untested hypothesis. Do not infer a personality or motivation deficit from inaction alone. |
| BEH-02 Informed useful action | People completing the defined action with demonstrated understanding / all eligible people offered it; report conversion, comprehension and regret separately. | Define the action and comprehension check before testing. Seek better informed task completion, not clicks or conversion alone. No numeric uplift claim without a suitable comparison and sample. |
| BEH-03 Follow-through | Accepted actions completed by the agreed due date / accepted actions due in the observation window. Report declined, blocked and not-yet-due actions separately, with responsible human role. | Record reasons for delay and effort; assess whether the action helped the customer's goal. Completion is not proof of downstream commercial impact. |
| BEH-04 Unintended effects | Counts and descriptions of confusion, regret, complaints, opt-outs, extra workload and access barriers, with exposed cohort and observation window. | Review these alongside any claimed benefit; resolve material harm or loss of informed control before scaling. No observed complaints in a small sample does not prove absence of harm. |

## Additional safeguards — do not add more weighted tenets

These are thinking-partner recommendations that protect all seven principles. They do not introduce another owner-approval meeting or replace existing authorization boundaries.

| Safeguard | Criteria and evidence |
| --- | --- |
| Trust and customer control | Clear measurement scope and limitations; required approval recorded; understandable recurring charges/cancellation; no unsupported promise of ranking, revenue or causal lift. Client sees what happened and can access supporting evidence. |
| Privacy and security | Retain only required data; verify recipient-scoped access for customer reports; no secrets/private client data in shared status; record retention/deletion requirements and verify applicable controls before production use. Absence of detected incidents is not proof of security. |
| Reliability and portability | Preserve raw evidence and versions, maintain usable exports, test recovery and state what can be recovered if a vendor becomes unavailable. A backup is not verified until restoration is tested. Required work remains scoped to the MVP. |
| Sustainable economics | Record provider usage, attributable costs and human review effort; alert on agreed spending boundaries; no new purchases, overages or provider usage outside authorization. Do not equate shared Codex account usage with task billing. |

## Scoring observed performance without inventing results

For each metric, retain the actual value, proposed target and evidence status. Do not average in Not measured entries or turn a handful of passed checks into a validated product score. The current roadmap uses qualitative contributions and dependency priorities; its old 1–5 scores are historical only. A future performance score must disclose its metric selection, weights, sample sizes and missing values before use; none is manufactured here.

At the current checkpoint, Otterly access and one retained export are verified. The usability, renewal, margin, customer-portability, routine-automation, AI comparative-quality and competitive-performance targets above have not been tested. Do not mark them passing.

## Continuous improvement with little reporting burden

Capture evidence during the work, then review at meaningful milestones: the first real-report review, paid pilot and repeat cycle. Existing daily status should surface only important changes, failures and decisions. Record one prioritized improvement, its expected effect, evidence and verification result; more meetings, dashboards or new schedules are not required. Proposed thresholds are our working targets, not attributed to OpenAI, Google, Gartner or Forrester.
