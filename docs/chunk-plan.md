# Visible chunk plans and requirement traceability

Latest completed local chunk: [MIN-18 durable report preparation](report-preparation-recovery.md): all three steps complete; full draft narratives, PREP-01–06, eight new tests and browser evidence.143 application tests pass. Explicit local retry only; qualified delivery gates remain open.

Latest completed local chunk: [MIN-17 database recovery](database-recovery.md): three steps completed, full review-draft narratives and REC-01–05 verification. All eight focused recovery cases and 135 application tests passed. Local recovery only; off-device recovery and retention policy remain open.

Latest public-site chunk: [MIN-15 homepage feedback](homepage-feedback-slice.md) implemented and deployed to [mindleverx.com](https://mindleverx.com/), with nine-item dispositions, full narratives, HOME-01–05 evidence and a reversible public-only release commit. Owner visual review remains open; fresh hosted visual interaction was blocked by the browser service, while all hosted bytes matched the locally browser-tested artifact.

Latest completed local chunk: [MIN-7 portable retained-report export](report-export-slice.md), with full review-draft narratives, four completed steps and verified offline/API/browser cases. The PDF remains the human report; private source portability does not qualify collection or release.

Preceding completed local chunk: [MIN-7 saved evidence to internal report review](report-review-slice.md), with full review-draft narratives, pillar rationale, four numbered steps and REVIEW-01–07 cases. All four steps passed their bounded verification; the actual saved-sample report is pending owner review. This connects retained evidence and an exact PDF to the actual review queue without qualifying collection or enabling client release. The [MIN-13 candidate question preview](pilot-panel-draft.md) is complete locally; final specification freeze remains blocked. Earlier completed chunks below remain evidence of their own scope.

Owner direction recorded 19 September 2026. Before implementation, show a short numbered plan with outcome, estimate, current step and requirement links. During work, report Step N of M, what changed and what remains. At handoff, link verification evidence and say what the owner can try. Keep each chunk bounded and separate from the next.

Every chunk identifies the requirement ID, title, current full narrative/source link, the applicable pillar rationale, the particular behavior being implemented, its acceptance test and status. Show the narrative and pillar rationale in the chunk plan itself; IDs and links alone are insufficient. Use the current rewritten narrative and label its review-draft status; retain the original baseline for traceability rather than silently treating it as the latest wording. Distinguish existing baseline, unapproved rewrite, accepted owner correction and implementation choice. A passing local test is not full requirement acceptance. If a task has no requirement basis, flag it as proposed scope before implementing it; do not silently invent an approved ID or add scope. This is a visibility/traceability practice, not a new approval gate for already-authorized work.

## Capability notes and learning

Owner direction, 19 September follow-up: open the active Linear issue beside the conversation at the start of each chunk, and identify it by both ID and readable title. A link alone does not satisfy the requested side-by-side walkthrough when browser access is available. Include a concise model/reasoning recommendation with the plan when useful, distinguishing recommendation from the user's actual selected setting. Prefer proportional reasoning and agents; do not automatically escalate to maximum or change settings. The owner reports GPT-6 Astra selected. For the current qualification review, Astra with High reasoning is the coordinator's recommendation, not a measured optimum or a verified UI setting. [Official model guidance](https://developers.openai.com/api/docs/models/gpt-6-astra), checked 19 September 2026.

Owner also asks to learn about the skills, plugins and tools used while building (19 September 2026). Include a brief capability note with a chunk's plan: which relevant skill/tool will be used, why it fits, and whether it is already available or needs a connection. Explain one useful concept in plain language when applying it, without turning each update into a long tutorial. Distinguish installed from actually used, and assistant tooling from functionality implemented in MindLeverX. Skills guide work; executed tests and inspected artifacts provide verification evidence.

## Current example: PDF report download

### 19 September follow-up — saved-export decoding regression

Supporting work: [MIN-14 — Strengthen delivery handoff, verification and GitHub backup](https://linear.app/mindleverx-codex-build/issue/MIN-14/strengthen-delivery-handoff-verification-and-github-backup), linked to the existing MIN-9 local PDF outcome. Estimate: 5–10 minutes. A separate code reviewer reproduced an export that passes inspection but fails results preparation because a UTF-8 byte-order marker is decoded differently on the second parse.

**Requirement basis (review draft, partial local coverage): MLX3-RES-004 — Evidence Drill-Down.** An authorized reader can trace each measurement or conclusion to the contributing permitted observations and receipts, with clear explanations for evidence unavailable under retention or access rules.

**Related wording correction (accepted ChatGPT-first direction; review-draft INV-003):** Each accepted collection run uses the specifically qualified surface and labels its provider, method and available context; model-API benchmarks never stand in for consumer ChatGPT observations, and additional platforms require an explicit scope decision with separate reporting. Remove the unqualified API-as-proxy statement from the local operator preview; this does not add any collection capability.

Pillars: consistent decoding improves repeatability and automated preparation; source identity supports trustworthy evidence review. Owner/client UX benefits are expected from avoiding a failed download, not user-tested. This fix adds no AI judgment or measured recurring-revenue/competitive benefit.

1. Reproduce the mismatch with a synthetic two-answer export, then use the inspector's UTF-8 decoding behavior in saved results. Preserve the original bytes for provenance.
2. Verify complete answers, independently specified 1/2 mention count, original byte length and SHA-256; invalid evidence must remain blocked. Check the preview wording against INV-003.
3. Run the affected tests and public-build checks; save exact results on MIN-14. No live data collection or release is part of this regression fix.

**BOM-01 executable check:** prerequisites are the two synthetic source rows in `tests/saved-results.test.mjs` in the product checkout, prefixed with the three UTF-8 BOM bytes. Run `node --test tests/saved-results.test.mjs`. Expect `complete`, exact original answer strings, numerator 1/denominator 2 and hash/length of the original BOM-containing bytes. FAIL on an exception, missing answer, changed count or normalized-byte fingerprint; BLOCKED if the required Node runtime is unavailable. This fixture is an encoding test, not a provider or statistical sample. Cleanup: in-memory data only. Initial reproduction before the fix: inspector `complete`, saved results `SyntaxError`. Final evidence belongs on MIN-14.

**Actual result:** PASS. The agent's isolated copy failed the new regression before the fix and passed afterward. The coordinator reproduced the original mismatch separately, applied the reviewed patch, and ran all 75 application tests plus public-build checks successfully in the active product checkout. Seven requirements-validator regressions and the portable structure check also passed. These checks do not establish production deployment or customer acceptance.

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
