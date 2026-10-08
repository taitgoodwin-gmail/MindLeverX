# MindLeverX product requirements for Codex

**Status: owner-approved P0/P1 wording retained; requirements reconciliation synchronized; product execution on hold.** On 8 October 2026, the owner approved the P0 evidence-qualification and P1 report-UX amendments under `OWN-2026-10-08-P0-P1`. The owner then asked to wait for another, similar business model before these requirements are pushed or implemented. The owner supplied the AugMind draft as the second business model, delegated PM reconciliation, and explicitly authorized resulting GitHub and Linear updates. This resumes requirements documentation and tracker synchronization only. Do not start the held MIN-10 validation unit, implement these amendments, merge, publish or release the product from this brief. Earlier independently authorized work retains its own gates.

This file is a **Codex-readable intake brief**, not another requirements register or implementation authorization. The authoritative wording, authority and status remain in `docs/requirements-rubric-review/requirements.json` (version `review-2026-10-08.2`), its readable rendering in `docs/requirements-rubric-review/revised-requirements.md`, and its executable cases in `docs/requirements-rubric-review/acceptance-tests.md`. If this brief and those files disagree, stop and reconcile them before work. `AGENTS.md` and `docs/codex-handoff.md` tell Codex how to orient in this repository; Linear records execution status.

## User outcome and product constraints

MindLeverX should deliver a defensible GEO/AI-search finding that a buyer can understand and act on, and that the owner can review and release as an exact version. Evidence rights, missing data and limitations must remain visible. The service should support repeatable delivery and recurring value without assuming an unqualified collection route or a settled commercial package. Automation, owner effort and client effort are distinct measures; AI-generated interpretation does not replace deterministic measurement or owner release decisions.

The project priority rubric in `docs/product-tenets.md` defines **P0** as the next blocking prerequisite, **P1** as necessary for first paid delivery, and **P2** as repeated value and renewal. These ranks are MindLeverX choices, not OpenAI standards or proof of market advantage. The exact buyer, commercial terms, cadence, collection route, private delivery and retention remain open under D01–D04; the delegated PM decision selects exact-version owner release for the one-time report in `docs/requirements-rubric-review/decisions-needed.md`.

## Approved wording now on hold

### P0 — `PROP-DATA-001`: Collection rights and evidence portability

> Before accepting a collection route for each offered measurement surface, verify the exact service, qualified collection method, and permitted collection, commercial reporting, retention, export, sensitive-data and cost boundaries. The release record identifies the method and conditions. A surface missing a mandatory right or evidence field is unavailable or explicitly excluded with a reason; its absence is never sold or displayed as observed zero visibility.

**Buyer outcome:** distinguish a genuinely observed absence from a surface MindLeverX lacks permission or reliable evidence to measure. **Existing basis:** `MLX3-MEA-012` and the linked evidence/measurement requirements in the canonical register. **Unresolved decisions:** D03 collection method and D04 retention/use conditions. **Delivery route:** MIN-12/MIN-5, subject to the current hold for this amendment. Real-route qualification is **BLOCKED**; no provider is selected by this requirement.

**Acceptance boundary:** `T12` exercises distinct missing, failed, insufficient and measured-zero states. `T37` uses a frozen offer/method version, a retained permitted observation and a separate intentionally unqualified synthetic surface. It passes the synthetic boundary only when rights, method and release conditions are traceable, the unqualified surface is unavailable or excluded with a reason, and no zero-visibility claim is inferred. A synthetic pass cannot qualify an actual provider. Both product cases are **NOT RUN**.

### P1 — `PROP-UX-001`: Whole-journey usability

> For a representative pilot, the initial report view lets an uncoached client identify the principal finding, material limitation and justified next action or no-action. The authorized owner can find exceptions, inspect linked evidence and record a release-or-return decision for the exact draft version under the selected release policy. Record client comprehension, completion, time, assistance, errors and recovery separately from owner preparation, review, decision and recovery effort.

**Buyer and owner outcome:** a client can explain the finding, limit and action without coaching; the owner can inspect exceptions and decide on the exact draft with observable effort. **Existing basis:** `MLX3-RES-001/002/007`, `MLX3-ADM-011` and `MLX3-NFR-007`. **Unresolved decisions:** D01 offer and D02 production private-delivery details. **Delivery route:** a bounded MIN-10 saved-report validation unit was defined but is now **ON HOLD**. Full MIN-7 acceptance still depends on qualified real evidence.

**Acceptance boundary:** `T24` checks report structure and honest desktop/mobile states; `T30` checks the scoped keyboard, screen-reader, reflow and other applicable WCAG 2.2 A/AA criteria. `T34` pins a report/build version and asks a representative client, without coaching, to explain its finding, limitation and action, then records the owner's exception/evidence review and exact-version decision. Record separate client and owner time, assistance, errors and recovery. Do not invent a numerical usability target. Technical subchecks, a representative human result and a full accessibility-conformance claim are separate outcomes. These cases are **NOT RUN**, and the human portion is **BLOCKED** until participants and a reviewable pinned build are available.

## Decisions outside this approval

- The public-site learning loop and P2 comparable recurring-report or optional first-party measurement ideas remain proposals in `docs/requirements-rubric-review/market-priority-slice-2026-10-08.md` and MIN-30. No site-loop requirement ID has been assigned.
- The other 18 provisional-origin rows in the 106-row register remain without scoped owner approval; the eight October 2 engineering additions are among them. Approval of these two amendments is not approval of the register as a whole.
- No provider choice, new paid usage, appearance change, customer contact, public-site publication, private client release or automatic monthly release follows from this brief.

## Business-model reconciliation

The owner-supplied AugMind AI Answer Visibility deck v0.1 was reconciled on 8 October 2026. The [PM decision record](docs/requirements-rubric-review/ai-answer-visibility-reconciliation-2026-10-08.md) identifies the selected first-offer architecture, exact-version owner release, proposed P1 offer-to-report fidelity, export clarification, no-change rows, excluded agency services and remaining D01–D04 gates. It preserves the earlier owner approval and product execution hold. MIN-10 is not resumed by this requirements push.

After a separate explicit product-execution resumption, a Build writer checks the current Git checkout and Linear state, works in an isolated implementation checkout, links each change to its requirement and test IDs, and records PASS, FAIL, BLOCKED or NOT RUN with actual evidence. `npm run check:requirements` is the current document/regression check. It passed earlier on 8 October for 105 rows, 47 acceptance-case families and eight validator scenarios; the later reconciled package has its own verification record; full historical source-fingerprint reconciliation remained **BLOCKED** by changed CURRENT/GUIDANCE files. Those document checks are not product acceptance. Push, merge and release remain separate decisions.

## Format and source notes

OpenAI's [Codex `AGENTS.md` guidance](https://learn.chatgpt.com/docs/agent-configuration/agents-md) (checked 8 October 2026) documents discoverable project instructions. Its [long-horizon Codex example](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex) (checked 8 October 2026) uses a durable Markdown spec with goals, constraints, deliverables and observable completion checks. The checked guidance does not specify a mandatory product-requirements schema; the structure above is a MindLeverX choice. The applicable accessibility standard is [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) (checked 8 October 2026); targeted T30 checks do not establish full conformance.
