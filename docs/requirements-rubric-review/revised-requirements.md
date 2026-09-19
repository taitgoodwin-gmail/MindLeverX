# MindLeverX requirements — rubric review draft

Prepared 18 September 2026 Eastern. **Review draft, not a release declaration or blanket scope approval.**

This package reconciles 78 V4 IDs, 8 recurring-service IDs from the V5 proposal, all 6 existing provisional IDs from the live Google Sheet, and 5 new rubric-coverage proposals: **97 rows total**. Every original ID remains traceable. The live Sheet was read through a fresh browser export on 18 September Eastern and its 86-row prior review was compared with this rewrite. The Sheet and original files are unchanged. The captured snapshot establishes what was read, not that future Sheet edits are synchronized.

The intended journey is an evidence-backed paid audit leading to a repeatable recurring service with low owner/client effort. ChatGPT consumer visibility is the leading measurement interest; broader platform coverage remains an ambition subject to qualification. Scope, buyer, price and one-time release policy remain unresolved. Monthly reports require owner release approval. The existing evidence frontend is an internal saved-data inspector, not the finished client report.

Read [the change summary and decisions](decisions-needed.md), [source crosswalk](source-crosswalk.md), [test cases](acceptance-tests.md), [rubric profiles](rubric-profiles.md), and [verification](verification.md). The generated views share [one structured draft](requirements.json); they are not a new external tracker. Regeneration command: `python3 docs/requirements-rubric-review/build_review.py` from the project root. Verify with `python3 docs/requirements-rubric-review/validate_review.py`.

## Authority and interpretation

Current owner instructions and September accepted decisions take precedence over historical working drafts. Preserved source wording is evidence of the earlier baseline, not an instruction to revive the old builder, old design, no-checkout journey, Perplexity-only scope, or unapproved numerical gates. Clarification improves wording; unresolved means a material conflict remains. Proposed additions translate the tenets into observable evaluations without approving new product modules.

Each requirement has one observable responsibility; detailed edge cases live in linked tests. Existing IDs group closely related contract fields rather than inventing a renumbering scheme. Dependencies are logical acceptance prerequisites, not an instruction to implement every module first. Drafting specifications and local isolated tests may continue while production policy choices remain open. Rubric labels describe intended contribution, not achieved results. All seven tenets are assessed through each named profile; profile reasons apply to the stated behavior, with row-specific conflict rationale recorded below. No numerical total or weight is used.

## Current implementation evidence

The public marketing site is deployed separately. Local report-package tests and the saved-data checker/frontend have recorded passing evidence; 68 project tests and desktop/mobile checks were last recorded for the isolated evidence checkout. Those checks cover bounded sub-behaviors only. None certifies complete real collection, production tenant security, paid delivery, client usefulness or renewal. The product scenarios in this package are NOT RUN; missing production fixtures and policy choices are listed explicitly. No build-readiness or product-pass status is inferred from the wording rewrite.

## Requirements


### MLX3-INV-001 — Mid-Market B2B SaaS Focus

Before a customer-facing launch, the owner records the selected buyer segment and the service uses that segment consistently in its offer, intake and examples; mid-market B2B SaaS remains the historical candidate until that decision is settled.

**Disposition:** unresolved. September buyer decision remains open; the August ICP cannot be restated as a settled launch decision.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [offer](rubric-profiles.md#offer). **Owner friction:** Avoid bespoke quoting and repeatedly resolving scope. **Client friction:** Make price, scope and next step clear without repeated intake.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** D01.

**Acceptance cases:** [T01](acceptance-tests.md#t01). Product execution: **NOT RUN**.


### MLX3-INV-002 — Owner-Provisioned Paid Pilot

For the selected paid-audit journey, the system accepts only an authorized engagement with the required verified payment before fulfillment; the historical ban on checkout is recorded as conflicting with the later first-sale direction, pending final offer approval.

**Disposition:** unresolved. September first-sale journey conflicts with the August no-checkout invariant. The rewrite preserves that conflict and does not approve billing implementation.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [offer](rubric-profiles.md#offer). **Owner friction:** Avoid bespoke quoting and repeatedly resolving scope. **Client friction:** Make price, scope and next step clear without repeated intake.

**Depends on:** MLX3-AUD-002. **Unresolved decisions:** D01, D02.

**Acceptance cases:** [T01](acceptance-tests.md#t01), [T02](acceptance-tests.md#t02). Product execution: **NOT RUN**.


### MLX3-INV-003 — Single Named Measurement Engine

Each accepted collection run uses the specifically qualified surface and labels its provider, method and available context; model-API benchmarks never stand in for consumer ChatGPT observations, and additional platforms require an explicit scope decision with separate reporting.

**Disposition:** clarify. Current ChatGPT-first understanding and broader multi-platform ambition supersede silent Perplexity-only narrowing; exact qualified coverage remains open.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-006. **Unresolved decisions:** D03.

**Acceptance cases:** [T03](acceptance-tests.md#t03). Product execution: **NOT RUN**.


### MLX3-INV-004 — Diagnostic-Only SEO Signals

Website and SEO checks support the agreed GEO service as separately identified diagnostic findings, without an unsupported composite score, rank-tracking suite or implied Google-to-ChatGPT equivalence.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-EVD-009. **Unresolved decisions:** D03.

**Acceptance cases:** [T04](acceptance-tests.md#t04). Product execution: **NOT RUN**.


### MLX3-INV-005 — No Outcome Guarantees

Every public or client-facing claim distinguishes observed evidence from inference and excludes guarantees of rankings, AI citations, traffic, leads or revenue.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-INV-007. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T05](acceptance-tests.md#t05). Product execution: **NOT RUN**.


### MLX3-INV-006 — Human-Controlled External Actions

Report preparation cannot publish to customer sites, contact third parties, acquire credentials, buy services or release customer material outside the specifically authorized action and recorded release policy.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [control](rubric-profiles.md#control). **Owner friction:** Concentrate necessary review into a clear, evidence-backed decision. **Client friction:** Expose the actual delivery state and preserve informed control.

**Depends on:** MLX3-ADM-018. **Unresolved decisions:** D02.

**Acceptance cases:** [T06](acceptance-tests.md#t06). Product execution: **NOT RUN**.


### MLX3-INV-007 — Evidence-Backed Conclusions

Every material report conclusion resolves to retained evidence and its processing versions, or is explicitly identified as an inference or unknown with its basis and limitations.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-EVD-006, MLX3-MEA-010. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T05](acceptance-tests.md#t05), [T07](acceptance-tests.md#t07). Product execution: **NOT RUN**.


### MLX3-AUD-001 — Tenant-Scoped Engagement Provisioning

An authorized operator can create an engagement tied to one organization, authorized property, responsible contact, accepted offer version and permitted recipients; an approved recurring engagement also records cadence, time zone, start and active/paused/cancelled state.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** MLX3-NFR-001. **Unresolved decisions:** D05.

**Acceptance cases:** [T08](acceptance-tests.md#t08). Product execution: **NOT RUN**.


### MLX3-AUD-002 — Property and Processing Authorization

Collection starts only when a recorded, current authorization covers the property, processing scope and applicable terms; an expired, revoked or materially out-of-scope authorization blocks further collection.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [consent](rubric-profiles.md#consent). **Owner friction:** Reuse valid authority; surface only required reconfirmation. **Client friction:** Request essential information once and explain withdrawal consequences.

**Depends on:** MLX3-AUD-001. **Unresolved decisions:** D04.

**Acceptance cases:** [T09](acceptance-tests.md#t09). Product execution: **NOT RUN**.


### MLX3-AUD-005 — Idempotent Engagement and Run Creation

Repeating the same engagement or run creation request produces one logical engagement or run and no duplicate fulfillment, while distinct authorized requests remain distinguishable.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-AUD-001. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T10](acceptance-tests.md#t10). Product execution: **NOT RUN**.


### MLX3-AUD-006 — Truthful Run Status

Each displayed run state comes from persisted server state, and a failed or unacknowledged operation never displays completion.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-OPS-005. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T11](acceptance-tests.md#t11). Product execution: **NOT RUN**.


### MLX3-AUD-007 — Honest Unmeasurable-Property Handling

When a property cannot be resolved, reached or measured, the result identifies the failed scope and reason without assigning a fabricated score or treating the failure as measured zero.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-012. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T12](acceptance-tests.md#t12). Product execution: **NOT RUN**.


### MLX3-AUD-008 — Secure Authenticated Result Delivery

A released report is accessible only to its authorized recipient through the selected private delivery mechanism; expiry and revocation remove access, and notifications omit sensitive evidence.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** MLX3-ADM-011, MLX3-NFR-001. **Unresolved decisions:** D02, D05.

**Acceptance cases:** [T13](acceptance-tests.md#t13). Product execution: **NOT RUN**.


### MLX3-AUD-009 — Policy, Support, and Revocation Routes

The recipient can reach current privacy, retention, support and revocation information from the delivered report, and an approved recurring offer exposes its pause/cancellation route and effect on future work and retained reports.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [consent](rubric-profiles.md#consent). **Owner friction:** Reuse valid authority; surface only required reconfirmation. **Client friction:** Request essential information once and explain withdrawal consequences.

**Depends on:** MLX3-AUD-008. **Unresolved decisions:** D04, D05.

**Acceptance cases:** [T14](acceptance-tests.md#t14). Product execution: **NOT RUN**.


### MLX3-EVD-001 — Authorized Public-Site Crawl

The collection service fetches only authorized public targets allowed by the frozen domain, robots and rate policy, and records a blocked attempt when a target is disallowed.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [security](rubric-profiles.md#security). **Owner friction:** Show a specific safe failure and permitted recovery path. **Client friction:** Avoid exposing technical or secret details while explaining blocked work.

**Depends on:** MLX3-AUD-002, MLX3-EVD-008. **Unresolved decisions:** D03.

**Acceptance cases:** [T15](acceptance-tests.md#t15). Product execution: **NOT RUN**.


### MLX3-EVD-002 — Complete Fetch Receipts

Every attempted fetch has a receipt recording requested and resolved URL, outcome, time, content type, available content hash, render mode and collector version, with unavailable fields explicitly marked.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-EVD-001. **Unresolved decisions:** D03.

**Acceptance cases:** [T16](acceptance-tests.md#t16). Product execution: **NOT RUN**.


### MLX3-EVD-003 — Explicit Crawl Failure Findings

The audit retains every scoped page with its collection outcome and reason; script dependence is a characteristic and becomes a limitation only when the selected collector cannot obtain the required content.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-EVD-002. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T12](acceptance-tests.md#t12), [T16](acceptance-tests.md#t16). Product execution: **NOT RUN**.


### MLX3-EVD-004 — Untrusted Content Isolation

Retrieved text is processed as untrusted evidence and cannot change tool permissions, release decisions, collection scope or system instructions.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [security](rubric-profiles.md#security). **Owner friction:** Show a specific safe failure and permitted recovery path. **Client friction:** Avoid exposing technical or secret details while explaining blocked work.

**Depends on:** MLX3-NFR-003. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T17](acceptance-tests.md#t17). Product execution: **NOT RUN**.


### MLX3-EVD-005 — Source-Type Classification

Each retained source has a versioned first-party, competitor, third-party or unknown classification with the rule and entity context used to assign it.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-EVD-002. **Unresolved decisions:** D03.

**Acceptance cases:** [T18](acceptance-tests.md#t18). Product execution: **NOT RUN**.


### MLX3-EVD-006 — Stable Evidence Addressing

Each permitted evidence reference resolves to a stable internal identifier and recorded byte hash, while expired or deleted evidence resolves to an explicit unavailable state.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-EVD-002. **Unresolved decisions:** D04.

**Acceptance cases:** [T07](acceptance-tests.md#t07). Product execution: **NOT RUN**.


### MLX3-EVD-007 — Safe Idempotent Fetch Retries

A permitted fetch retry creates a distinct attempt within the configured retry budget while preserving the single logical observation and all earlier outcomes.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-EVD-002. **Unresolved decisions:** D03.

**Acceptance cases:** [T10](acceptance-tests.md#t10), [T19](acceptance-tests.md#t19). Product execution: **NOT RUN**.


### MLX3-EVD-008 — SSRF and Egress Protection

The collection service rejects internal or otherwise prohibited network destinations at initial resolution and every redirect or renewed resolution, using enforceable egress controls.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [security](rubric-profiles.md#security). **Owner friction:** Show a specific safe failure and permitted recovery path. **Client friction:** Avoid exposing technical or secret details while explaining blocked work.

**Depends on:** MLX3-NFR-003. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T15](acceptance-tests.md#t15). Product execution: **NOT RUN**.


### MLX3-EVD-009 — Itemized Technical Access Findings

Technical-access results show individual checks, observed evidence, severity and limitations without a fabricated readiness or SEO composite.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-EVD-002. **Unresolved decisions:** D03.

**Acceptance cases:** [T04](acceptance-tests.md#t04). Product execution: **NOT RUN**.


### MLX3-MEA-001 — Versioned Pilot Prompt Panel

Before collection, an authorized operator freezes a panel with stable ID, version, owner, purpose, prompt list and an approved bounded sample design; the historical 10–15-prompt range remains a candidate, not an automatically adopted current threshold.

**Disposition:** unresolved. No current approved panel specification establishes the historical 10–15 prompts as the correct new gate.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** D03.

**Acceptance cases:** [T20](acceptance-tests.md#t20). Product execution: **NOT RUN**.


### MLX3-MEA-002 — Complete Prompt Metadata

Every prompt retains its exact text, category, market, language or locale, provenance, anchoring classification and version, marking unavailable context explicitly.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-001. **Unresolved decisions:** D03.

**Acceptance cases:** [T20](acceptance-tests.md#t20). Product execution: **NOT RUN**.


### MLX3-MEA-003 — Prompt Class Taxonomy

The versioned panel taxonomy identifies discovery/problem, comparison, trust/method and direct-brand intent separately from brand anchoring, recording ambiguous classifications for review before execution.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-002. **Unresolved decisions:** D03.

**Acceptance cases:** [T20](acceptance-tests.md#t20). Product execution: **NOT RUN**.


### MLX3-MEA-004 — Unanchored Headline Visibility

A headline unanchored-visibility rate includes only eligible unanchored observations in its denominator and reports anchored or direct-brand observations separately.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-003. **Unresolved decisions:** D03.

**Acceptance cases:** [T21](acceptance-tests.md#t21). Product execution: **NOT RUN**.


### MLX3-MEA-005 — Frozen Panel Versioning

A used or frozen panel cannot be edited in place; an accepted change creates a successor version and preserves the former panel and comparability boundary.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-001. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T20](acceptance-tests.md#t20), [T22](acceptance-tests.md#t22). Product execution: **NOT RUN**.


### MLX3-MEA-006 — Versioned Engine Adapter Records

Each measurement attempt records collection surface, provider and engine labels, available model and settings, adapter version, time, request identifier, outcome and available latency and cost, identifying unavailable vendor metadata without inventing it.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-NFR-010. **Unresolved decisions:** D03.

**Acceptance cases:** [T03](acceptance-tests.md#t03), [T16](acceptance-tests.md#t16). Product execution: **NOT RUN**.


### MLX3-MEA-007 — Minimum Repeated Prompt Attempts

A run records actual attempts per prompt and applies the approved repetition and uncertainty rule, labeling a below-rule sample insufficient; the historical three-attempt floor is not silently adopted for the current panel.

**Disposition:** unresolved. The earlier repetition floor is retained in provenance while current sample/method qualification remains open.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-001, MLX3-MEA-008. **Unresolved decisions:** D03.

**Acceptance cases:** [T21](acceptance-tests.md#t21). Product execution: **NOT RUN**.


### MLX3-MEA-008 — Explicit Attempt Outcomes

Every attempted execution retains its completed, refused, truncated, timed-out, blocked, invalid, cancelled or provider-error outcome, and run totals reconcile with those attempts.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-MEA-006. **Unresolved decisions:** D03.

**Acceptance cases:** [T16](acceptance-tests.md#t16), [T19](acceptance-tests.md#t19). Product execution: **NOT RUN**.


### MLX3-MEA-009 — Returned Source Retention

Permitted provider-returned citations and retrieval/source sets are retained with their origin and type, distinguishing cited, retrieved-but-unused, empty, unsupported and uncollected data without implying an unavailable retrieval set was observed.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-MEA-006. **Unresolved decisions:** D03.

**Acceptance cases:** [T16](acceptance-tests.md#t16). Product execution: **NOT RUN**.


### MLX3-MEA-010 — Versioned Answer Classification

A pinned deterministic rule set derives measurement classifications from preserved raw observations; corrections append a versioned successor and do not overwrite evidence or prior classifications.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-EVD-006. **Unresolved decisions:** D03.

**Acceptance cases:** [T18](acceptance-tests.md#t18), [T23](acceptance-tests.md#t23). Product execution: **NOT RUN**.


### MLX3-MEA-011 — Complete Rate Context

Every rate exposes its numerator, denominator definition, eligible sample size, date, panel and method versions, collection surface and engine context, plus the approved uncertainty statement or an explicit insufficiency limitation.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-004, MLX3-MEA-008. **Unresolved decisions:** D03.

**Acceptance cases:** [T21](acceptance-tests.md#t21). Product execution: **NOT RUN**.


### MLX3-MEA-012 — Distinct Measurement States

The data model and presentation distinguish not measured, failed, insufficient, observed absence and measured zero without coercing missing evidence to zero.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-008. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T12](acceptance-tests.md#t12). Product execution: **NOT RUN**.


### MLX3-MEA-013 — Separate Measurement Families

Reports keep website technical access, answer readiness, off-site evidence and observed AI visibility distinguishable, keep ordinary search performance and model-API benchmarks separate when present, and display no unsupported overall composite.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T04](acceptance-tests.md#t04). Product execution: **NOT RUN**.


### MLX3-MEA-014 — Comparability Boundaries

A material change to panel, collection surface/context, engine or exposed model, classifier, formula or threshold creates a visible boundary; unobserved relevant context changes make comparability unknown, and an unapproved bridge cannot authorize a change claim.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-005. **Unresolved decisions:** D03, D06.

**Acceptance cases:** [T22](acceptance-tests.md#t22). Product execution: **NOT RUN**.


### MLX3-MEA-015 — Noise-Suppressed Movement Claims

A recurring report evaluates change only for comparable, sufficiently supported observations and distinguishes no supported change from insufficient evidence; a first pilot may omit movement, and a difference alone never establishes causal lift.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-014. **Unresolved decisions:** D03.

**Acceptance cases:** [T22](acceptance-tests.md#t22). Product execution: **NOT RUN**.


### MLX3-RES-001 — Plain-Language Lead Finding

The client report opens with an understandable principal finding and its material limitation, with supporting method and evidence reachable through clearly labeled detail.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-RES-002, MLX3-RES-004. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T24](acceptance-tests.md#t24). Product execution: **NOT RUN**.


### MLX3-RES-002 — Measurement Context and Limitations

Each displayed measurement presents its scope, surface or engine, known model context, panel, date, sample, incomplete work and material limitations beside the claim.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-MEA-011, MLX3-MEA-012. **Unresolved decisions:** D03.

**Acceptance cases:** [T21](acceptance-tests.md#t21), [T24](acceptance-tests.md#t24). Product execution: **NOT RUN**.


### MLX3-RES-003 — Standard Family Result Contract

Every report family records a measurement state, its reason, available evidence and a supported next action or an explanation that no action is justified.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-MEA-013. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T04](acceptance-tests.md#t04), [T12](acceptance-tests.md#t12). Product execution: **NOT RUN**.


### MLX3-RES-004 — Evidence Drill-Down

An authorized reader can trace each measurement or conclusion to the contributing permitted observations and receipts, with clear explanations for evidence unavailable under retention or access rules.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-EVD-006. **Unresolved decisions:** D04.

**Acceptance cases:** [T07](acceptance-tests.md#t07), [T13](acceptance-tests.md#t13). Product execution: **NOT RUN**.


### MLX3-RES-005 — Synthetic Data Labels

Fictional and synthetic observations remain distinguishable in storage and are labeled directly on each affected visualization, table and export, and cannot enter actual customer measurement calculations.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-RES-006. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T24](acceptance-tests.md#t24). Product execution: **NOT RUN**.


### MLX3-RES-006 — Reproducible Machine-Readable Export

A private machine-readable report export includes the scope, result states, evidence references and pinned processing versions needed to reproduce supported values, without leaking secrets or another tenant's data.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-NFR-009. **Unresolved decisions:** D04.

**Acceptance cases:** [T23](acceptance-tests.md#t23), [T13](acceptance-tests.md#t13), [T28](acceptance-tests.md#t28). Product execution: **NOT RUN**.


### MLX3-RES-007 — One Evidence-Linked Next Action

The report identifies one prioritized evidence-linked action, or explains why none is justified, and discloses confidence, expected effort, dependencies and reversibility; recurring reports also state the known status of the prior action.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-INV-007. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T05](acceptance-tests.md#t05), [T24](acceptance-tests.md#t24). Product execution: **NOT RUN**.


### MLX3-OPS-001 — Run Operations Console

An authorized operator can diagnose a run's status, scoped evidence, failures and available provider cost through the operational view without direct database editing.

**Disposition:** clarify. Keep this outcome ID linked to ADM-006 rather than silently ratifying the proposed V5 merge.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-ADM-006. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T11](acceptance-tests.md#t11), [T25](acceptance-tests.md#t25). Product execution: **NOT RUN**.


### MLX3-OPS-002 — Collision-Safe Job Execution

Concurrent workers and retried submissions produce one logical run result through persisted ownership and idempotency, with exhausted or uncertain work parked for review.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-AUD-005. **Unresolved decisions:** D03.

**Acceptance cases:** [T10](acceptance-tests.md#t10), [T19](acceptance-tests.md#t19). Product execution: **NOT RUN**.


### MLX3-OPS-003 — Stage-Level Recovery

An authorized retry targets only an eligible failed stage, preserves completed artifacts and appends a new attempt; automated retry, where approved, follows the same bounded recovery contract.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-OPS-002. **Unresolved decisions:** D03.

**Acceptance cases:** [T19](acceptance-tests.md#t19). Product execution: **NOT RUN**.


### MLX3-OPS-004 — Safe Collection Cancellation

An authorized cancellation stops further collection scheduling and retains completed observations, in-flight outcome accounting and an explicit partial or cancelled run state.

**Disposition:** clarify. Keep cancellation acceptance independently visible; ADM-007 is its operator control, not deletion of this requirement.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-OPS-002. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T19](acceptance-tests.md#t19). Product execution: **NOT RUN**.


### MLX3-OPS-005 — Automated Action Audit Trail

Every state-changing automated action appends an attributable event containing the action, reason, input references, outcome and time without recording unnecessary sensitive content.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-NFR-005. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T26](acceptance-tests.md#t26), [T28](acceptance-tests.md#t28). Product execution: **NOT RUN**.


### MLX3-NFR-001 — Tenant Data Isolation

Server-side access checks enforce the tenant boundary for organizations, engagements, runs, evidence and reports across reads, writes, searches, exports and caches.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** D05.

**Acceptance cases:** [T08](acceptance-tests.md#t08), [T13](acceptance-tests.md#t13). Product execution: **NOT RUN**.


### MLX3-NFR-002 — Secure Secret Storage

Provider credentials are stored only in the selected protected secret mechanism and are excluded from source control, ordinary records, prompts, logs, UI and exports.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [security](rubric-profiles.md#security). **Owner friction:** Show a specific safe failure and permitted recovery path. **Client friction:** Avoid exposing technical or secret details while explaining blocked work.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** D05.

**Acceptance cases:** [T28](acceptance-tests.md#t28). Product execution: **NOT RUN**.


### MLX3-NFR-003 — Enforced Tool and Network Permissions

Tool and network restrictions are enforced outside generated text so that an untrusted prompt or retrieved page cannot authorize a denied capability.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [security](rubric-profiles.md#security). **Owner friction:** Show a specific safe failure and permitted recovery path. **Client friction:** Avoid exposing technical or secret details while explaining blocked work.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** D05.

**Acceptance cases:** [T17](acceptance-tests.md#t17), [T15](acceptance-tests.md#t15). Product execution: **NOT RUN**.


### MLX3-NFR-004 — Sensitive Data Log Redaction

Application and operational logs redact credentials, payment details, authorization tokens and unnecessary customer content while retaining safe diagnostic references.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [security](rubric-profiles.md#security). **Owner friction:** Show a specific safe failure and permitted recovery path. **Client friction:** Avoid exposing technical or secret details while explaining blocked work.

**Depends on:** MLX3-NFR-005. **Unresolved decisions:** D04.

**Acceptance cases:** [T28](acceptance-tests.md#t28). Product execution: **NOT RUN**.


### MLX3-NFR-005 — End-to-End Run Correlation

A stable run correlation identifier links its attempts, evidence, classifications, result and attributable cost records without exposing private data to unauthorized users.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-AUD-005. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T25](acceptance-tests.md#t25), [T26](acceptance-tests.md#t26). Product execution: **NOT RUN**.


### MLX3-NFR-006 — Data Minimization and Retention

The service stores only data needed for the approved purpose and applies selected retention and deletion rules across raw evidence, receipts, reports, contacts and backups, recording deletions and resulting reproduction limits.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [consent](rubric-profiles.md#consent). **Owner friction:** Reuse valid authority; surface only required reconfirmation. **Client friction:** Request essential information once and explain withdrawal consequences.

**Depends on:** MLX3-EVD-006. **Unresolved decisions:** D04.

**Acceptance cases:** [T29](acceptance-tests.md#t29). Product execution: **NOT RUN**.


### MLX3-NFR-007 — WCAG 2.2 AA Accessibility

Shipped customer and operator-critical flows satisfy applicable WCAG 2.2 Level A and AA acceptance criteria, with failures resolved and manual/automated evidence retained; any explicitly agreed scope exception is disclosed without a full conformance claim.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [experience](rubric-profiles.md#experience). **Owner friction:** Measure owner effort, errors and assistance separately. **Client friction:** Measure client effort, comprehension and accessibility separately.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T30](acceptance-tests.md#t30). Product execution: **NOT RUN**.


### MLX3-NFR-008 — Asynchronous Responsive Processing

Long-running collection runs outside the page request path while the UI remains usable and displays persisted progress, freshness and recoverable failure without inventing completion.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-AUD-006. **Unresolved decisions:** D08.

**Acceptance cases:** [T11](acceptance-tests.md#t11), [T31](acceptance-tests.md#t31). Product execution: **NOT RUN**.


### MLX3-NFR-009 — Exact Result Reproducibility

Pinned deterministic processing reproduces measurement values from retained evidence, and approved generated prose is reproduced by retrieving its stored version rather than regenerating it.

**Disposition:** clarify. V5 decisions explicitly accept deterministic measurement reproduction and retrieval of stored generated prose.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-MEA-010. **Unresolved decisions:** D04.

**Acceptance cases:** [T23](acceptance-tests.md#t23). Product execution: **NOT RUN**.


### MLX3-NFR-010 — Replaceable Provider Adapters

Collection-provider integrations implement a documented versioned contract whose fake and real adapters preserve the same outcome and evidence semantics while disclosing unsupported fields.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** D03.

**Acceptance cases:** [T03](acceptance-tests.md#t03), [T16](acceptance-tests.md#t16). Product execution: **NOT RUN**.


### MLX3-ADM-001 — Authenticated Operator Portal

The operator can reach the controls required for the accepted delivery slice through an authenticated workspace; a full historical module list is not a prerequisite for the first report unless its need is retained explicitly.

**Disposition:** unresolved. Current roadmap permits a simpler private delivery mechanism; historical full-portal scope needs explicit release scoping.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** MLX3-NFR-001. **Unresolved decisions:** D05, D07.

**Acceptance cases:** [T08](acceptance-tests.md#t08), [T25](acceptance-tests.md#t25). Product execution: **NOT RUN**.


### MLX3-ADM-002 — Server-Enforced Role Permissions

Every privileged endpoint enforces the approved role-action policy on the server with deny-by-default behavior, including release, recovery, exports and user administration.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** MLX3-NFR-001. **Unresolved decisions:** D05, D06.

**Acceptance cases:** [T08](acceptance-tests.md#t08), [T13](acceptance-tests.md#t13). Product execution: **NOT RUN**.


### MLX3-ADM-003 — Tenant-Safe Portal Context

Each operator view and action binds to an explicit tenant, and search, totals, exports, cache entries and errors do not disclose another tenant's records.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** MLX3-NFR-001. **Unresolved decisions:** D05.

**Acceptance cases:** [T08](acceptance-tests.md#t08), [T13](acceptance-tests.md#t13). Product execution: **NOT RUN**.


### MLX3-ADM-004 — Authorized Time-Limited Support Access

Impersonation is unavailable; if support grants are selected for a release, access requires recorded customer authority, a named tenant and purpose, finite expiry, immediate revocation and an attributable access trail.

**Disposition:** unresolved. No impersonation retained; the historical support-console deferral and grant durations remain proposals.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** MLX3-ADM-002. **Unresolved decisions:** D05, D07.

**Acceptance cases:** [T27](acceptance-tests.md#t27). Product execution: **NOT RUN**.


### MLX3-ADM-005 — Client Registry and Provisioning

An authorized operator can provision a second customer through bounded configuration, reusing the engagement and authority workflow without code changes or repeated client data entry.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [experience](rubric-profiles.md#experience). **Owner friction:** Measure owner effort, errors and assistance separately. **Client friction:** Measure client effort, comprehension and accessibility separately.

**Depends on:** MLX3-AUD-001, MLX3-AUD-002. **Unresolved decisions:** D01, D05.

**Acceptance cases:** [T08](acceptance-tests.md#t08), [T09](acceptance-tests.md#t09). Product execution: **NOT RUN**.


### MLX3-ADM-006 — Operations Command Center

The operational summary reconciles persisted jobs, attempts, exceptions, freshness and available costs, with tenant-safe drill-down and no healthy label for stale, blocked or partial work.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-AUD-006, MLX3-NFR-005. **Unresolved decisions:** D07.

**Acceptance cases:** [T11](acceptance-tests.md#t11), [T25](acceptance-tests.md#t25). Product execution: **NOT RUN**.


### MLX3-ADM-007 — Run Timeline and Recovery Controls

The run view preserves stage and attempt history and exposes only authorized, state-valid cancellation, retry and parking actions with actor, reason and outcome.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-OPS-002, MLX3-OPS-003, MLX3-OPS-004. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T19](acceptance-tests.md#t19), [T26](acceptance-tests.md#t26). Product execution: **NOT RUN**.


### MLX3-ADM-008 — Evidence Inspection and Corrections

The evidence view exposes permitted source records, provenance, classifications, correction history and failures while preserving raw records and rendering external text inertly.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-EVD-006, MLX3-MEA-010. **Unresolved decisions:** D04.

**Acceptance cases:** [T07](acceptance-tests.md#t07), [T17](acceptance-tests.md#t17), [T18](acceptance-tests.md#t18). Product execution: **NOT RUN**.


### MLX3-ADM-009 — Prompt Panel Registry

The panel registry records draft, review, validation, freeze, successor and retirement states with readable differences and immutable used versions.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-005. **Unresolved decisions:** D03, D06.

**Acceptance cases:** [T20](acceptance-tests.md#t20). Product execution: **NOT RUN**.


### MLX3-ADM-010 — Methods and Engines Registry

The method registry preserves adapter, model-context, classifier, formula and threshold versions with their authority and comparability changes, displaying secret references without secret values.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [measure](rubric-profiles.md#measure). **Owner friction:** Avoid reconciling incompatible sources manually. **Client friction:** Explain what was measured without requiring provider expertise.

**Depends on:** MLX3-MEA-014. **Unresolved decisions:** D03, D06.

**Acceptance cases:** [T22](acceptance-tests.md#t22), [T28](acceptance-tests.md#t28). Product execution: **NOT RUN**.


### MLX3-ADM-011 — Result Review and Secure Delivery

Monthly reports become client-visible only after the owner's recorded release decision; completeness and evidence checks precede that decision, and the one-time audit release policy remains explicit and unresolved.

**Disposition:** clarify. Owner release is required for monthly briefs; one-time audit policy is unresolved, not automatically inherited.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [control](rubric-profiles.md#control). **Owner friction:** Concentrate necessary review into a clear, evidence-backed decision. **Client friction:** Expose the actual delivery state and preserve informed control.

**Depends on:** MLX3-RES-002, MLX3-RES-006. **Unresolved decisions:** D02.

**Acceptance cases:** [T06](acceptance-tests.md#t06), [T13](acceptance-tests.md#t13). Product execution: **NOT RUN**.


### MLX3-ADM-012 — User and Access Administration

The selected identity mechanism permits authorized membership provisioning and revocation with recorded history and tenant-safe role changes; a custom administration UI is included only if justified for the release.

**Disposition:** unresolved. Access control remains necessary; a dedicated UI versus selected provider administration remains a release choice.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [access](rubric-profiles.md#access). **Owner friction:** Use the least necessary administrative steps without bypassing authority. **Client friction:** Use the selected private access flow without unnecessary account steps.

**Depends on:** MLX3-ADM-002. **Unresolved decisions:** D05, D07.

**Acceptance cases:** [T08](acceptance-tests.md#t08), [T27](acceptance-tests.md#t27). Product execution: **NOT RUN**.


### MLX3-ADM-013 — Governance and Audit Ledger

Privileged reads and consequential actions append audit records with actor, reason where required, subject, correlation, outcome and time; ordinary application users cannot edit or suppress those records.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [control](rubric-profiles.md#control). **Owner friction:** Concentrate necessary review into a clear, evidence-backed decision. **Client friction:** Expose the actual delivery state and preserve informed control.

**Depends on:** MLX3-NFR-005. **Unresolved decisions:** D04.

**Acceptance cases:** [T26](acceptance-tests.md#t26). Product execution: **NOT RUN**.


### MLX3-ADM-014 — Incident and Support Workspace

Where incident tooling is included, an authorized operator can correlate a support case with permitted run evidence and logs without acquiring deployment, credential, billing, deletion, publication or outreach powers.

**Disposition:** unresolved. Incident safety retained; a separate incident workspace is not assumed necessary before first delivery.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-ADM-013. **Unresolved decisions:** D07.

**Acceptance cases:** [T25](acceptance-tests.md#t25), [T17](acceptance-tests.md#t17). Product execution: **NOT RUN**.


### MLX3-ADM-015 — Safe Provider Configuration

Provider configuration displays permitted identity, scope, version, health and verification freshness without revealing credentials, and unavailable credentials produce an explicit degraded state.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [security](rubric-profiles.md#security). **Owner friction:** Show a specific safe failure and permitted recovery path. **Client friction:** Avoid exposing technical or secret details while explaining blocked work.

**Depends on:** MLX3-NFR-002. **Unresolved decisions:** D05.

**Acceptance cases:** [T28](acceptance-tests.md#t28), [T11](acceptance-tests.md#t11). Product execution: **NOT RUN**.


### MLX3-ADM-016 — Accessible Responsive Admin Portal

Critical operator workflows support keyboard use, visible unobscured focus, meaningful labels and status, text enlargement and reflow, with the applicable WCAG 2.2 AA checks evidenced for the release version.

**Disposition:** clarify. Retain WCAG target and verifiable cases; do not reinstate the rejected historical design source or claim full conformance from browser checks.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [experience](rubric-profiles.md#experience). **Owner friction:** Measure owner effort, errors and assistance separately. **Client friction:** Measure client effort, comprehension and accessibility separately.

**Depends on:** MLX3-NFR-007. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T30](acceptance-tests.md#t30). Product execution: **NOT RUN**.


### MLX3-ADM-017 — Evidence-First Portal Presentation

The operator interface preserves the currently accepted visual direction and presents operational state before optional evidence detail, clearly distinguishing sample, unknown, insufficient, partial, stale, unauthorized, draft and released states.

**Disposition:** clarify. Current accepted design direction overrides August Linear-inspired authority. No appearance changes are implemented.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [experience](rubric-profiles.md#experience). **Owner friction:** Measure owner effort, errors and assistance separately. **Client friction:** Measure client effort, comprehension and accessibility separately.

**Depends on:** MLX3-AUD-006, MLX3-RES-005. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T11](acceptance-tests.md#t11), [T24](acceptance-tests.md#t24), [T30](acceptance-tests.md#t30). Product execution: **NOT RUN**.


### MLX3-ADM-018 — Safe Consequential Portal Actions

Before a consequential action, the UI identifies the tenant, target and effect; the server verifies authority and current state, prevents duplicate effects and returns the persisted outcome with the required reason and audit event.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V4 working baseline; reconcile with later accepted decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [control](rubric-profiles.md#control). **Owner friction:** Concentrate necessary review into a clear, evidence-backed decision. **Client friction:** Expose the actual delivery state and preserve informed control.

**Depends on:** MLX3-ADM-002. **Unresolved decisions:** D02, D04, D05.

**Acceptance cases:** [T06](acceptance-tests.md#t06), [T10](acceptance-tests.md#t10), [T26](acceptance-tests.md#t26). Product execution: **NOT RUN**.


### MLX3-SVC-001 — Recurring Measurement Schedule

An active recurring engagement has approved cadence, time zone and resource/entitlement rules; each scheduled opportunity creates at most one cycle with planned and actual time, while paused, cancelled or ineligible engagements create no collection work.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [recurring](rubric-profiles.md#recurring). **Owner friction:** Avoid manual cycle initiation and duplicate exception handling. **Client friction:** Provide useful updates without repeated intake or unexplained gaps.

**Depends on:** MLX3-AUD-002, MLX3-OPS-002. **Unresolved decisions:** D01, D08.

**Acceptance cases:** [T32](acceptance-tests.md#t32). Product execution: **NOT RUN**.


### MLX3-SVC-002 — Unattended Execution and Automated Retry

Routine recurring collection and report preparation advance to the required review boundary with bounded retries and visible exceptions; required owner release is not classified as an automation failure.

**Disposition:** clarify. End-to-end automation stops before required owner release.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [recurring](rubric-profiles.md#recurring). **Owner friction:** Avoid manual cycle initiation and duplicate exception handling. **Client friction:** Provide useful updates without repeated intake or unexplained gaps.

**Depends on:** MLX3-SVC-001, MLX3-ADM-011. **Unresolved decisions:** D03, D08.

**Acceptance cases:** [T19](acceptance-tests.md#t19), [T32](acceptance-tests.md#t32), [T06](acceptance-tests.md#t06). Product execution: **NOT RUN**.


### MLX3-SVC-003 — Meaningful-Change Detection

Each recurring report compares only eligible observations from comparable cycles and distinguishes supported change, no supported change and insufficient evidence under the approved method.

**Disposition:** clarify. Insufficient evidence cannot be mislabeled no meaningful change.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [recurring](rubric-profiles.md#recurring). **Owner friction:** Avoid manual cycle initiation and duplicate exception handling. **Client friction:** Provide useful updates without repeated intake or unexplained gaps.

**Depends on:** MLX3-MEA-014, MLX3-MEA-015. **Unresolved decisions:** D03.

**Acceptance cases:** [T22](acceptance-tests.md#t22). Product execution: **NOT RUN**.


### MLX3-SVC-004 — Recurring Client Brief

Each recurring brief states the current finding, available comparison, limitations, supporting evidence and prioritized action, and remains a draft until the owner's release approval.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [recurring](rubric-profiles.md#recurring). **Owner friction:** Avoid manual cycle initiation and duplicate exception handling. **Client friction:** Provide useful updates without repeated intake or unexplained gaps.

**Depends on:** MLX3-SVC-003, MLX3-ADM-011. **Unresolved decisions:** D01.

**Acceptance cases:** [T24](acceptance-tests.md#t24), [T06](acceptance-tests.md#t06). Product execution: **NOT RUN**.


### MLX3-SVC-005 — Exception Queue

The operator queue contains actionable failures, blocked or insufficient work and reports awaiting required release, without duplicate entries; healthy preparation may still require one owner-release decision.

**Disposition:** clarify. Healthy preparation still generates a required approval item, resolving the zero-queue contradiction.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [recurring](rubric-profiles.md#recurring). **Owner friction:** Avoid manual cycle initiation and duplicate exception handling. **Client friction:** Provide useful updates without repeated intake or unexplained gaps.

**Depends on:** MLX3-ADM-011, MLX3-SVC-002. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T25](acceptance-tests.md#t25), [T32](acceptance-tests.md#t32). Product execution: **NOT RUN**.


### MLX3-SVC-006 — Cycle Series Integrity

Recurring cycles retain ordered identity and pinned method context, and a material change creates an explicit successor series without silently merging incomparable observations.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [recurring](rubric-profiles.md#recurring). **Owner friction:** Avoid manual cycle initiation and duplicate exception handling. **Client friction:** Provide useful updates without repeated intake or unexplained gaps.

**Depends on:** MLX3-MEA-014. **Unresolved decisions:** D03.

**Acceptance cases:** [T22](acceptance-tests.md#t22), [T32](acceptance-tests.md#t32). Product execution: **NOT RUN**.


### MLX3-SVC-007 — Missed-Cycle Honesty

Missed, failed, cancelled and partial cycles remain visible with actual times and reasons; separately authorized service-status notices do not expose unapproved report content, and recovery never fabricates an on-time observation.

**Disposition:** clarify. Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [recurring](rubric-profiles.md#recurring). **Owner friction:** Avoid manual cycle initiation and duplicate exception handling. **Client friction:** Provide useful updates without repeated intake or unexplained gaps.

**Depends on:** MLX3-AUD-006. **Unresolved decisions:** D08.

**Acceptance cases:** [T32](acceptance-tests.md#t32). Product execution: **NOT RUN**.


### MLX3-SVC-008 — Bounded Generation Model

A separately configured, versioned generation adapter may draft interpretations from permitted evidence but cannot alter raw observations, deterministic measurement or release state; each stored draft records available model, prompt, adapter and usage metadata.

**Disposition:** unresolved. Three role boundaries are retained; recurring AI adoption and the historical single-generation-model restriction need evaluation, not automatic ratification.

**Authority:** V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions. **Status:** Review draft; not an acceptance of implementation or disputed scope.

**Rubric:** [intelligence](rubric-profiles.md#intelligence). **Owner friction:** Count verification and correction effort, not just drafting speed. **Client friction:** Present supported conclusions and uncertainty in understandable language.

**Depends on:** MLX3-MEA-010, MLX3-NFR-009, MLX3-ADM-011. **Unresolved decisions:** D09.

**Acceptance cases:** [T17](acceptance-tests.md#t17), [T23](acceptance-tests.md#t23), [T33](acceptance-tests.md#t33). Product execution: **NOT RUN**.


### PROP-UX-001 — Whole-journey usability

For a representative pilot, record client completion and comprehension and owner preparation, review and recovery effort separately, using the same defined journey and recording assistance and failures.

**Disposition:** proposed addition. Operationalizes an accepted tenet; this exact requirement is a new proposal, not approved product scope.

**Authority:** TENETS, METRICS and METHOD; proposed requirement formulation. **Status:** Proposal; not implementation authorization.

**Rubric:** [experience](rubric-profiles.md#experience). **Owner friction:** Measure owner effort, errors and assistance separately. **Client friction:** Measure client effort, comprehension and accessibility separately.

**Depends on:** MLX3-RES-001, MLX3-ADM-011. **Unresolved decisions:** D01.

**Acceptance cases:** [T34](acceptance-tests.md#t34). Product execution: **NOT RUN**.


### PROP-VAL-001 — Buyer and renewal validation

Before a paid pilot, specify the buyer, useful decision, bounded offer and evidence plan; after delivery, record observed usefulness, renewal eligibility and actual payment or cancellation separately from technical success and stated interest.

**Disposition:** proposed addition. Existing provisional ID preserved and clarified against the seven-tenet rubric; not a new scope approval.

**Authority:** Live Sheet Proposed additions; supplemented by TENETS, METRICS and METHOD. **Status:** Proposal; not implementation authorization.

**Rubric:** [offer](rubric-profiles.md#offer). **Owner friction:** Avoid bespoke quoting and repeatedly resolving scope. **Client friction:** Make price, scope and next step clear without repeated intake.

**Depends on:** MLX3-RES-001. **Unresolved decisions:** D01.

**Acceptance cases:** [T01](acceptance-tests.md#t01), [T35](acceptance-tests.md#t35). Product execution: **NOT RUN**.


### PROP-REP-001 — Second-customer portability

Demonstrate the approved workflow for two differently configured authorized test organizations using the same core contracts, and record configuration effort, exceptions and any custom code.

**Disposition:** proposed addition. Operationalizes an accepted tenet; this exact requirement is a new proposal, not approved product scope.

**Authority:** TENETS, METRICS and METHOD; proposed requirement formulation. **Status:** Proposal; not implementation authorization.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-ADM-005. **Unresolved decisions:** D01.

**Acceptance cases:** [T08](acceptance-tests.md#t08), [T35](acceptance-tests.md#t35). Product execution: **NOT RUN**.


### PROP-OPS-001 — Delivery economics and owner effort

Before a pilot, define cost/time measurement and spend/retry limits; during delivery record provider, allocated tool, billing/refund costs and setup, preparation, review and recovery labor separately from elapsed approval wait, preserving unknowns and failed attempts.

**Disposition:** proposed addition. Existing provisional ID preserved and clarified against the seven-tenet rubric; not a new scope approval.

**Authority:** Live Sheet Proposed additions; supplemented by TENETS, METRICS and METHOD. **Status:** Proposal; not implementation authorization.

**Rubric:** [operations](rubric-profiles.md#operations). **Owner friction:** Show only actionable exceptions and safe recovery controls. **Client friction:** Show honest progress without requiring support requests.

**Depends on:** MLX3-OPS-003. **Unresolved decisions:** D01, D08.

**Acceptance cases:** [T19](acceptance-tests.md#t19), [T35](acceptance-tests.md#t35). Product execution: **NOT RUN**.


### PROP-AI-001 — AI benefit evaluation

Before adopting recurring AI interpretation, compare its evidence support and action usefulness against a simpler baseline on fixed representative cases, with blinded review, disagreement, costs and uncertainty recorded.

**Disposition:** proposed addition. Operationalizes an accepted tenet; this exact requirement is a new proposal, not approved product scope.

**Authority:** TENETS, METRICS and METHOD; proposed requirement formulation. **Status:** Proposal; not implementation authorization.

**Rubric:** [intelligence](rubric-profiles.md#intelligence). **Owner friction:** Count verification and correction effort, not just drafting speed. **Client friction:** Present supported conclusions and uncertainty in understandable language.

**Depends on:** MLX3-INV-007, MLX3-SVC-008. **Unresolved decisions:** D09.

**Acceptance cases:** [T33](acceptance-tests.md#t33). Product execution: **NOT RUN**.


### PROP-LEAD-001 — Evidence of useful differentiation

Evaluate the proposed service against buyer-relevant alternatives on comparable scope, traceability, usefulness, effort and cost, distinguishing verified observations from vendor claims and unavailable evidence.

**Disposition:** proposed addition. Operationalizes an accepted tenet; this exact requirement is a new proposal, not approved product scope.

**Authority:** TENETS, METRICS and METHOD; proposed requirement formulation. **Status:** Proposal; not implementation authorization.

**Rubric:** [leadership](rubric-profiles.md#leadership). **Owner friction:** Use decision-relevant comparisons without continuous research overhead. **Client friction:** Make the service difference observable instead of relying on superiority claims.

**Depends on:** MLX3-RES-001. **Unresolved decisions:** D01.

**Acceptance cases:** [T36](acceptance-tests.md#t36). Product execution: **NOT RUN**.


### PROP-BEH-001 — Informed action and follow-through

For a consequential buyer or operator intervention, record the target action, observed or hypothesized barrier, proposed mechanism, comprehension, follow-through and unintended effects before claiming benefit.

**Disposition:** proposed addition. Operationalizes an accepted tenet; this exact requirement is a new proposal, not approved product scope.

**Authority:** TENETS, METRICS and METHOD; proposed requirement formulation. **Status:** Proposal; not implementation authorization.

**Rubric:** [behavior](rubric-profiles.md#behavior). **Owner friction:** Record work barriers without inventing motivation or adding needless surveys. **Client friction:** Preserve informed choice and observe confusion, regret and follow-through.

**Depends on:** PROP-UX-001. **Unresolved decisions:** D01.

**Acceptance cases:** [T34](acceptance-tests.md#t34). Product execution: **NOT RUN**.


### PROP-SEO-001 — Evidence-supported SEO and GEO advice

Each proposed improvement identifies the affected platform, observed problem and bounded verification step, citing applicable official guidance or explicitly labeling a supported inference or hypothesis without authorizing customer-site changes.

**Disposition:** proposed addition. Existing provisional ID preserved and clarified against the seven-tenet rubric; not a new scope approval.

**Authority:** Live Sheet Proposed additions; supplemented by TENETS, METRICS and METHOD. **Status:** Proposal; not implementation authorization.

**Rubric:** [report](rubric-profiles.md#report). **Owner friction:** Review material claims and exceptions without rereading every raw answer. **Client friction:** Understand the main limitation and next action before exploring detail.

**Depends on:** MLX3-INV-004, MLX3-RES-007. **Unresolved decisions:** D03.

**Acceptance cases:** [T05](acceptance-tests.md#t05), [T37](acceptance-tests.md#t37). Product execution: **NOT RUN**.


### PROP-DATA-001 — Collection rights and evidence portability

Before accepting a collection route, verify the exact service and permitted collection, commercial reporting, retention, export, sensitive-data and cost boundaries; an unmet mandatory right or evidence field blocks acceptance or requires an explicitly narrowed offer.

**Disposition:** proposed addition. Existing provisional ID preserved and clarified against the seven-tenet rubric; not a new scope approval.

**Authority:** Live Sheet Proposed additions; supplemented by TENETS, METRICS and METHOD. **Status:** Proposal; not implementation authorization.

**Rubric:** [evidence](rubric-profiles.md#evidence). **Owner friction:** Resolve a finding to its source without manual file hunting. **Client friction:** Offer optional proof without overwhelming the main finding.

**Depends on:** MLX3-MEA-006, MLX3-EVD-006. **Unresolved decisions:** D03, D04.

**Acceptance cases:** [T37](acceptance-tests.md#t37). Product execution: **NOT RUN**.


### PROP-BIZ-001 — Paid lifecycle matched to the offer

Before charging for the selected offer, define payment, collection, review, release, delivery, failure/refund, cancellation and renewal-entitlement states separately, preserving monthly owner release and the unresolved one-time policy.

**Disposition:** proposed addition. Existing provisional ID preserved and clarified against the seven-tenet rubric; not a new scope approval.

**Authority:** Live Sheet Proposed additions; supplemented by TENETS, METRICS and METHOD. **Status:** Proposal; not implementation authorization.

**Rubric:** [offer](rubric-profiles.md#offer). **Owner friction:** Avoid bespoke quoting and repeatedly resolving scope. **Client friction:** Make price, scope and next step clear without repeated intake.

**Depends on:** MLX3-AUD-002. **Unresolved decisions:** D01, D02.

**Acceptance cases:** [T01](acceptance-tests.md#t01), [T02](acceptance-tests.md#t02), [T06](acceptance-tests.md#t06), [T38](acceptance-tests.md#t38). Product execution: **NOT RUN**.


### PROP-GOV-001 — Team review and decision trace

For each proposed requirement rewrite and priority, retain actual reviewer coverage, rationale, dissent and resolution, labeling absent specialist or independent review explicitly and keeping scope approval distinct from review recommendations.

**Disposition:** proposed addition. Existing provisional ID preserved and clarified against the seven-tenet rubric; not a new scope approval.

**Authority:** Live Sheet Proposed additions; supplemented by TENETS, METRICS and METHOD. **Status:** Proposal; not implementation authorization.

**Rubric:** [control](rubric-profiles.md#control). **Owner friction:** Concentrate necessary review into a clear, evidence-backed decision. **Client friction:** Expose the actual delivery state and preserve informed control.

**Depends on:** No requirement prerequisite. **Unresolved decisions:** None recorded for this formulation.

**Acceptance cases:** [T39](acceptance-tests.md#t39). Product execution: **NOT RUN**.
