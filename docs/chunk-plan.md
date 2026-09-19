# Visible chunk plans and requirement traceability

Owner direction recorded 19 September 2026. Before implementation, show a short numbered plan with outcome, estimate, current step and requirement links. During work, report Step N of M, what changed and what remains. At handoff, link verification evidence and say what the owner can try. Keep each chunk bounded and separate from the next.

Every chunk identifies the requirement ID, title, current full narrative/source link, the applicable pillar rationale, the particular behavior being implemented, its acceptance test and status. Show the narrative and pillar rationale in the chunk plan itself; IDs and links alone are insufficient. Use the current rewritten narrative and label its review-draft status; retain the original baseline for traceability rather than silently treating it as the latest wording. Distinguish existing baseline, unapproved rewrite, accepted owner correction and implementation choice. A passing local test is not full requirement acceptance. If a task has no requirement basis, flag it as proposed scope before implementing it; do not silently invent an approved ID or add scope. This is a visibility/traceability practice, not a new approval gate for already-authorized work.

## Capability notes and learning

Owner direction, 19 September follow-up: open the active Linear issue beside the conversation at the start of each chunk, and identify it by both ID and readable title. A link alone does not satisfy the requested side-by-side walkthrough when browser access is available. Include a concise model/reasoning recommendation with the plan when useful, distinguishing recommendation from the user's actual selected setting. Prefer proportional reasoning and agents; do not automatically escalate to maximum or change settings. The owner reports GPT-6 Astra selected. For the current qualification review, Astra with High reasoning is the coordinator's recommendation, not a measured optimum or a verified UI setting. [Official model guidance](https://developers.openai.com/api/docs/models/gpt-6-astra), checked 19 September 2026.

Owner also asks to learn about the skills, plugins and tools used while building (19 September 2026). Include a brief capability note with a chunk's plan: which relevant skill/tool will be used, why it fits, and whether it is already available or needs a connection. Explain one useful concept in plain language when applying it, without turning each update into a long tutorial. Distinguish installed from actually used, and assistant tooling from functionality implemented in MindLeverX. Skills guide work; executed tests and inspected artifacts provide verification evidence.

## Current example: PDF report download

**Status:** COMPLETE for the local PDF chunk; owner review and full requirement acceptance remain open. **Estimate:** 30–60 minutes, subject to existing PDF tooling. **Outcome:** replace the customer-facing text download with a readable PDF of the same bounded saved-evidence results. This does not complete a live audit, approve the evidence, deploy a portal or release a customer report.

**Accepted owner correction:** the customer-facing report should be a polished PDF, not a text file. Recorded as decision `PDF-FORMAT-2026-09-19` in this document; this is a local decision reference, not an ID added to the formal requirements register. V4 RES-006 separately requires a machine-readable export; PDF does not replace that requirement.

### Requirement basis

Original baseline: [V4 result contract](</Users/tag/Desktop/Builds/MindLeverX - Claude Code Build/01 - REQUIREMENTS INPUT/01 - MindLeverX Clean-Slate Requirements v4.0.md:136>). Original IDs/wording below remain subject to later accepted decisions. The [rubric rewrite](requirements-rubric-review/revised-requirements.md:594) is still a review draft.

| ID and title | Original requirement wording | Contribution from this chunk |
| --- | --- | --- |
| MLX3-RES-001 — Plain-Language Lead Finding | The result opens with a concise plain-language finding; method and proof are available one level deeper. | PDF opens with the supported saved-sample finding; method/evidence follow. |
| MLX3-RES-002 — Measurement Context and Limitations | The result identifies scope, engine/model, panel, date, n, incomplete work, and limitations next to the relevant measurement. | Show known context and explicitly missing context alongside counts; no inferred metadata. |
| MLX3-RES-004 — Evidence Drill-Down | A user can drill from any measurement or finding to the contributing prompts, answers, sources, and receipts permitted by policy. | Trace PDF findings to source rows/appendix and local browser details; no publicly shared local-only URLs. This is partial support, not production access-policy acceptance. |
| MLX3-RES-007 — One Evidence-Linked Next Action | The result ends with one prioritized, evidence-linked next action or an honest “no justified action” state. | Explain the next evidence-validation action and why the current sample does not justify a site/content fix. |
| PDF-FORMAT-2026-09-19 — Owner format correction | Customer-facing report should be a polished PDF. | Working PDF download with visual layout verification. |

### Current rewritten narratives and pillar rationale

These are the completed **review-draft** formulations from the [revised register](requirements-rubric-review/revised-requirements.md:594), rather than just the original V4 shorthand above. The original IDs are preserved. Rewriting is complete as a local draft; independent review, unresolved decisions and live-Sheet synchronization are separate outstanding work.

**MLX3-RES-001 — Plain-Language Lead Finding**

The client report opens with an understandable principal finding and its material limitation, with supporting method and evidence reachable through clearly labeled detail.

**MLX3-RES-002 — Measurement Context and Limitations**

Each displayed measurement presents its scope, surface or engine, known model context, panel, date, sample, incomplete work and material limitations beside the claim.

**MLX3-RES-004 — Evidence Drill-Down**

An authorized reader can trace each measurement or conclusion to the contributing permitted observations and receipts, with clear explanations for evidence unavailable under retention or access rules.

**MLX3-RES-007 — One Evidence-Linked Next Action**

The report identifies one prioritized evidence-linked action, or explains why none is justified, and discloses confidence, expected effort, dependencies and reversibility; recurring reports also state the known status of the prior action.

All four use the [report pillar profile](requirements-rubric-review/rubric-profiles.md#report). These are contribution judgments, not measured benefits or implemented capabilities:

| Pillar | Why it matters to these report requirements | Boundary for this PDF chunk |
| --- | --- | --- |
| Premier owner/client UX | A clear finding and optional evidence support comprehension; owner reviews exceptions without rereading all raw answers. | Check readable layout and evidence navigation; actual reader comprehension remains unmeasured. |
| Recurring revenue | Useful findings and next actions may give customers a reason to return. | No renewal or revenue benefit is established by PDF export. |
| Repeatability | Consistent report structure can be reused across supported inputs. | Reuse the saved-results contract and test fixed inputs. |
| Automation | Structured results can be assembled into a report automatically. | Download preparation is deterministic automation; approval is unchanged. |
| AI intelligence | Evidence-constrained interpretation can help prioritize justified actions. | PDF formatting does not implement or prove AI judgment. |
| Competitive leadership | Report usefulness could differentiate the service. | Unknown until compared with alternatives and customer evidence. |
| Behavioral design | Plain language, visible limits and an explicit next action support informed decisions. | This is a design hypothesis; customer behavior has not been tested. |

### Numbered plan

| Step | Work | Requirement / decision | Status |
| --- | --- | --- | --- |
| 1 | Inspect the existing report design and PDF tooling; define exact acceptance cases before coding. | RES-001, RES-002; PDF-FORMAT-2026-09-19 | Complete |
| 2 | Build the PDF layout: principal finding, platform counts, limitations, justified next step and evidence detail. | RES-001, RES-002, RES-004, RES-007 | Complete locally |
| 3 | Connect Download PDF on the local results page with the existing local access boundary. | PDF-FORMAT-2026-09-19; partial support to RES-004 | Complete locally |
| 4 | Verify PDF values/source identity, successful download, every rendered page, clipping and failure states. | PDF-01–PDF-07; requirements above | Passed locally |
| 5 | Open the PDF and show how to download it; link actual verification and remaining gaps. | Handoff for the same requirements; not a release approval | PDF available for owner review |

Requirement links use full IDs in the basis table; step table abbreviates only their common MLX3 prefix. Existing draft test families [T24](requirements-rubric-review/acceptance-tests.md#t24), [T21](requirements-rubric-review/acceptance-tests.md#t21), [T07](requirements-rubric-review/acceptance-tests.md#t07) and [T13](requirements-rubric-review/acceptance-tests.md#t13) supply traceability but do not establish executable PDF-specific cases or a passing result.

PDF-specific executable cases are now frozen in [pdf-results-slice.md](</Users/tag/Documents/ChatGPT/MindLeverX evidence-inspection/docs/pdf-results-slice.md>).

Actual result: Download PDF works on the local results page. Eight rendered pages inspected;74projecttests and public-build checks pass. The artifact and detailed verification are in the [PDF slice record](</Users/tag/Documents/ChatGPT/MindLeverX evidence-inspection/docs/pdf-results-slice.md>). Original requirement status is not changed to fully accepted.
