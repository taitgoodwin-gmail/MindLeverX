# Acceptance cases — review fixture v1

Prepared 18 September 2026 Eastern. **Product/evaluation cases T01–T39: NOT RUN.** These are scenario definitions executable against the stated boundary once their named prerequisites exist. They are not passing tests, invented endpoints or a claim that today's local prototype supports production flows. Several cases remain blocked from execution until a production interface or policy is supplied.

Each Txx section is a case family with separately scored numbered subcases (Txx.1, Txx.2, etc.). Reset the named fixture before each subcase unless the step explicitly continues the prior transaction. Record each subcase independently; a happy-path pass cannot hide a failed negative or recovery subcase. The register lists all applicable families. The same-agent document checks in verification.md are a different boundary.

## Fixed prerequisites and recording rules

- Fixture version: `requirements-review-fixture-v1`, with source data in [fixtures.json](fixtures.json). All values are synthetic test choices, not selected production prices, quotas, retention periods or method thresholds.
- Record the actual tested commit, any uncommitted diff hash, interface-contract version, schema version, browser/OS and enabled configuration before product execution. Do not label the implementation merely `latest`. Until a release artifact and its action-to-UI/API mapping exist, the affected product case is **BLOCKED at execution preflight**, not ready for somebody else to guess the missing interface. This is a named implementation dependency, not a requirement to invent endpoints in this review.
- Use an isolated test environment with disposable data, fake external adapters, no real recipient, no live payment, no production tenant and no customer content. Seed the fixture through the release candidate's documented test setup; that setup command and the UI/API action mapping must be supplied by the implementing slice. The current release has no such complete production fixture loader; affected cases therefore remain NOT RUN with a known prerequisite gap.
- Fixed clock: `2026-09-18T12:00:00Z`, with explicit advances specified by each case. Tenant A is `review-a`, tenant B is `review-b`; each has its own user, property and report. `owner-a` can operate and release A only; `viewer-a` can read released A only; `owner-b` can operate B only; anonymous has no private permissions. This is a **test policy**, not adoption of a production role matrix. D05 must be resolved before production role acceptance.
- Capture per subcase: ID, exact artifact/config hashes, inputs, numbered actions, observed result, evidence path, PASS/FAIL/BLOCKED, reviewer and timestamp. **PASS** requires every stated observation in that subcase. **FAIL** is an observed mismatch with prerequisites available. **BLOCKED** identifies missing authority, interface, environment, fixture or decision. **NOT RUN** means no execution occurred. Do not convert missing functionality into a successful negative test merely because every request fails.
- Default cleanup: revoke test sessions/shares; stop fake jobs; remove only the disposable test database/output directory after retaining sanitized evidence and hashes; restore the test clock and configuration. Each case below adds specific cleanup. Never delete original evidence or modify the running owner preview.
- No case here establishes statistical validity, security certification, full accessibility conformance, live-provider entitlement, customer usability, payment acceptance or market superiority unless it explicitly tests that boundary. A synthetic contract pass is not a real customer outcome.

## T01

**Claim/boundary:** approved scope is consistent across offer and flow; INV-001/002. **Prerequisites:** approved offer version resolving D01, plus test offer `offer-v1` whose buyer is `Example B2B software team`, one-time scope is `one bounded audit`, price is `100 test units`, and recurring offer is separately optional. The synthetic offer cannot close D01. **Actual:** NOT RUN.

1. Compare the accepted offer version with the rendered pricing/offer, intake, checkout summary and receipt. **Expect:** identical buyer, scope, test price, timing/failure terms and no invented package details; any missing approved field blocks launch acceptance.
2. Walk a first-time test buyer from the offer to order review. **Expect:** the complete amount and deliverable are visible before confirmation; recurring enrollment is not required to buy the one-time audit.
3. Inspect source dispositions for the old no-checkout rule. **Expect:** conflict is visible and linked to the current decision; the implementation neither silently ignores an active restriction nor claims an unresolved package is approved.

**Cleanup:** default; void all test orders. **Not tested:** willingness to pay or a live purchase.

## T02

**Claim/boundary:** payment-gated fulfillment for an approved one-time journey. **Prerequisites:** D01/D02 resolved; fake payment adapter supports `pending`, `succeeded`, `failed`, and duplicate confirmation events; order `order-a1`, engagement A and authorized property A. **Actual:** NOT RUN.

1. Submit `pending`, then visit a success-looking return URL without a confirmed payment event. **Expect:** no paid status and no fulfillment job.
2. Submit the authenticated fake `succeeded` event bound to `order-a1` once, then replay its event ID twice. **Expect:** one paid order and one eligible logical fulfillment job; no duplicate charge/collection.
3. On a fresh order submit `failed`, and separately submit a success event bound to tenant B or the wrong amount. **Expect:** no paid A order or A fulfillment; a safe, attributable rejection or review state.

**Cleanup:** reset fake payment event ledger and test orders. **Not tested:** live billing, provider fees, refund/dispute policy or production webhook security. Those require the selected payment contract.

## T03

**Claim/boundary:** distinguish measured surface, provider labels and adapters. **Prerequisites:** D03 accepted for production use; fake adapter `review-adapter-v1`; A1 consumer-labelled record and separate API-labelled B1 record from fixtures; model field null in A1. **Actual:** NOT RUN.

1. Import A1 and inspect result, evidence and export. **Expect:** consumer-surface/vendor attribution retained, model explicitly unavailable, no invented ChatGPT model version or independent verification claim.
2. Import B1 and inspect the same surfaces. **Expect:** API benchmark label; never merged into consumer results or labeled identical to what a customer saw in ChatGPT.
3. Run the same contract fixture through a second fake adapter with unsupported model/source metadata. **Expect:** identical semantic outcome fields and explicit unsupported metadata; raw input and adapter versions retained. A real-adapter contract run remains separately blocked until qualification and included access are verified.

**Cleanup:** default. **Not tested:** truth of a vendor's collection method, upstream permission or representative consumer visibility.

## T04

**Claim/boundary:** separate result families and diagnostic scope. **Prerequisites:** report fixture `families-v1`: technical access observed, readiness not measured, off-site evidence failed, visibility descriptive 2/4, separate search-performance and API-benchmark records. **Actual:** NOT RUN.

1. Render the report and export. **Expect:** all four core families retain their distinct state/reason/evidence/action; optional search and API observations are separately labeled.
2. Inspect the technical finding `robots-disallow-test` with its receipt and severity. **Expect:** itemized evidence-backed finding; no overall SEO/readiness or blended cross-engine score.
3. Remove the off-site evidence reference. **Expect:** validation failure or explicit unavailable state, never a fabricated result or cross-family imputation.

**Cleanup:** remove synthetic report output only. **Not tested:** correctness of an actual crawl or Google/ChatGPT optimization effect.

## T05

**Claim/boundary:** claim support and action integrity in a report. **Prerequisites:** candidate draft with four labeled claims: C1 `2 of 4 eligible answers mention ExampleCo`; C2 `The sample proves a 50% revenue increase`; C3 `The timeout is measured zero`; C4 `A question-panel change may explain the difference` marked inference. Evidence fixture A1–A6. **Actual:** NOT RUN.

1. Independently calculate C1 from eligible records and follow its references. **Expect:** C1 accepted only with descriptive sample context; raw 2/4 arithmetic is not a population or causal claim.
2. Submit C2 and C3 to the report review process. **Expect:** both identified as unsupported and prevented from release until corrected; no automatic pass based only on a schema or nonempty citation field.
3. Review C4 and action `review the missing property authorization` with dependency, effort, confidence and reversibility fields. **Expect:** inference remains labeled; action cites the actual authorization gap. Replace it with `buy backlinks to guarantee leads`. **Expect:** unsupported guarantee and out-of-scope action rejected.

**Cleanup:** retain review outcomes and sanitized revisions; discard trial drafts. **Not tested:** independent human calibration. A model reviewing itself is recorded as same-agent review.

## T06

**Claim/boundary:** release and external-action authority. **Prerequisites:** monthly report `report-a1` in `draft`, owner-a and viewer-a; fake outbound adapter recording attempted sends; approved monthly owner-release rule. One-time acceptance additionally needs D02. **Actual:** NOT RUN.

1. Complete preparation with valid evidence but no owner decision. **Expect:** awaiting owner release; viewer-a cannot access draft; zero outbound sends.
2. Have viewer-a attempt release, then owner-a release the exact reviewed version twice. **Expect:** viewer denied; owner release recorded once; duplicate request has no duplicate effect; the released hash matches the approved artifact.
3. Change the report after approval and attempt delivery of the new bytes under the old approval. **Expect:** refusal pending approval of that version.
4. Include `publish to CMS`, `email a prospect`, and `buy credits` instructions in generated content. **Expect:** no tool invocation, credential access or external action is authorized by the text. An unconfigured one-time release policy must not default to monthly auto-release or automatic delivery.

**Cleanup:** revoke test release access and clear fake send ledger. **Not tested:** sending a real message or authorizing a one-time release policy.

## T07

**Claim/boundary:** stable evidence and drill-down. **Prerequisites:** retained bytes `ExampleCo is mentioned.` at evidence ID `ev-a1`, pinned hash calculated from those exact UTF-8 bytes, linked finding F1 and report A. **Actual:** NOT RUN.

1. As authorized A user, navigate F1 → observation → receipt and export its permitted evidence. **Expect:** same evidence ID and byte hash at every layer, with method/classification versions present.
2. Replace bytes in the disposable store without changing the recorded hash. **Expect:** integrity failure; no presentation as verified original evidence.
3. Reset, then expire the content under the synthetic retention policy. **Expect:** an explicit unavailable/expired reference with the applicable reproduction limitation; no dangling link masquerading as evidence.

**Cleanup:** discard disposable evidence store, preserve original project exports. **Not tested:** provider authenticity, production immutability or retention-policy legality.

## T08

**Claim/boundary:** provisioning, permission and tenant isolation. **Prerequisites:** test role policy and A/B fixture; production acceptance requires D05. Interface map covers create, list, detail, search, update, role change, export and cached view. **Actual:** NOT RUN.

1. As owner-a create complete engagement A; omit organization, property and responsible owner in three fresh attempts. **Expect:** valid record accepted; each incomplete record blocked with field-specific feedback and no active engagement.
2. As owner-a request each mapped B operation by substituting B's identifier. Repeat anonymously and as viewer-a for writes. **Expect:** denied without B names, counts or records; denied actions leave B unchanged. Authorized A reads and permitted writes must still succeed as positive controls.
3. Prime a cache as owner-b, then request the equivalent view as owner-a. **Expect:** no cached B content, count or identifier; record timing observations but do not claim proof of absence of timing channels from one sample.
4. Provision the second tenant using configuration only, then repeat the complete setup. **Expect:** isolated correct records and no product code modification; record actual setup steps, assistance, exceptions and time rather than claiming zero friction.

**Cleanup:** remove test memberships and isolated A/B database. **Not tested:** all possible side channels or production identity assurance.

## T09

**Claim/boundary:** current property/processing authority. **Prerequisites:** property `https://a.example.test`, authorization `auth-a1`, terms `terms-v1`, synthetic expiry `2026-09-19T12:00:00Z`, actor owner-a and frozen scope. D04 required for production terms. **Actual:** NOT RUN.

1. Begin collection before authorization, then authorize and retry. **Expect:** first blocked; second eligible with actor, property, scope, terms versions and timestamp retained.
2. Revoke authority, expire it by advancing the clock, and substitute property B in three separately reset cases. **Expect:** each blocks subsequent collection without overwriting earlier evidence.
3. Change terms to `terms-v2` with a material scope extension. **Expect:** reconfirmation required according to the approved change rule; unchanged valid scope does not demand duplicate intake.

**Cleanup:** default, reset clock and terms. **Not tested:** legal sufficiency of consent or a live customer's authority.

## T10

**Claim/boundary:** duplicate prevention and concurrent ownership. **Prerequisites:** fake job store, creation key `request-a1`, two worker instances W1/W2, disabled external network, persisted attempt ledger. **Actual:** NOT RUN.

1. Submit the same creation key three times sequentially and simultaneously to W1/W2. **Expect:** one logical engagement/run and one owned execution; responses refer to that logical record.
2. Submit a genuinely distinct authorized key `request-a2`. **Expect:** a separate logical run; deduplication must not erase valid new work.
3. Stop W1 after fake provider acknowledgement but before local completion; let ownership expire and recover with W2. **Expect:** provider reconciliation or explicit uncertain state before resubmission, no blind duplicate effect and complete attempt history.

**Cleanup:** stop both workers and clear fake provider ledger. **Not tested:** real provider idempotency when the provider supplies no reconciliation mechanism.

## T11

**Claim/boundary:** persisted truthful status and operator presentation. **Prerequisites:** one run per state `queued`, `running`, `partial`, `failed`, `unavailable`, `ready`, plus draft/released report states; render snapshot version pinned. **Actual:** NOT RUN.

1. Open each run, refresh and restart the test server. **Expect:** displayed state matches persisted state; no queued or failed item becomes complete merely through navigation or restart.
2. Simulate a refused write response and a lost acknowledgement. **Expect:** the UI reports failure or unresolved state and offers safe recovery; it never shows a success toast without confirmed server state.
3. Mark source health stale and credentials unavailable. **Expect:** explicit stale/degraded state with freshness and recovery guidance; no healthy summary. Verify status remains understandable without color and no private data leaks into public error copy.

**Cleanup:** restore fixture state and credentials. **Not tested:** full availability or all assistive technology behavior.

## T12

**Claim/boundary:** missingness, crawl failure and measured zero. **Prerequisites:** distinct fixtures: no collection requested; completed valid no-mention answer; DNS failure; connection timeout; robots blocked; script-dependent page without rendered capture; unsupported content type; incomplete sample. **Actual:** NOT RUN.

1. Process each fixture independently and inspect data, report and export. **Expect:** no collection → not measured; valid no-mention → observed absence with eligible denominator; failed collection → failure with cause; incomplete sample → insufficient. Repeat the script-dependent fixture with a successful rendered capture: script dependence alone must not label a successfully collected page failed.
2. Compare blocked, script-dependent and unsupported pages in the scoped collection summary. **Expect:** all remain listed with their distinct reasons; total scoped targets reconcile with outcomes.
3. Empty a required answer in an otherwise valid denominator. **Expect:** missing-answer/insufficiency handling; no unchanged 0/N or interpretation as a valid absence.

**Cleanup:** default. **Not tested:** production failure-rate estimates or the statistical sample rule.

## T13

**Claim/boundary:** private report access, exports and share expiry. **Prerequisites:** released report A, draft report A2, released B, selected test private-delivery interface, recipient viewer-a; share token bound to A/viewer-a and expiry `12:10Z`; D02/D05 for production. **Actual:** NOT RUN.

1. Access released A as viewer-a, then anonymous, owner-b and revoked viewer-a. **Expect:** authorized read succeeds; all unauthorized variants denied, including direct export and raw evidence routes.
2. Use the share as the bound recipient at `12:09Z`, then after `12:10Z`, from the wrong recipient and after revocation. **Expect:** only the valid recipient/time case succeeds. If the selected delivery method has no shares, record the share feature out of scope and separately test its equivalent selected recipient access; do not mark unimplemented share behavior passing.
3. Request draft A2 and substitute B's artifact ID in A export. **Expect:** denied without content leakage. Inspect fake email notification. **Expect:** no raw answers, credentials, tokens usable by an unintended recipient or private findings.

**Cleanup:** revoke all test access and clear fake notification ledger. **Not tested:** production delivery-provider assurance.

## T14

**Claim/boundary:** policy/support routes. **Prerequisites:** approved test policy version `policy-v1` with privacy, retention, support and revoke destinations on the test domain. D04/D05 govern actual selected policy. **Actual:** NOT RUN.

1. Follow each destination from the report as an authorized recipient. **Expect:** correct current text and an operable support/revocation route, without requiring unavailable staff contact details to be invented.
2. Substitute an expired policy version and one dead route. **Expect:** release/readiness review flags both; no claim that current policies are reachable.
3. Submit a synthetic revocation request through the documented route. **Expect:** persisted receipt and the selected revocation behavior, not a confirmation that silently transmits nothing.

**Cleanup:** delete only test requests and restore routes. **Not tested:** real support staffing or an unapproved response-time SLA.

## T15

**Claim/boundary:** bounded fetch policy and SSRF. **Prerequisites:** isolated network harness with fake DNS and HTTP responder; allow domain `a.example.test`; test rate at most one request per virtual second; robots disallow `/private`; redirect/DNS table in fixtures. No probe reaches a real internal service. **Actual:** NOT RUN.

1. Request allowed `/public`, disallowed `/private`, and off-scope `b.example.test`. **Expect:** only `/public` fetched; every blocked attempt has a reasoned receipt.
2. Resolve or redirect the allowed hostname to fake loopback, RFC1918, link-local/metadata, IPv6 loopback, IPv4-mapped IPv6 and a changed DNS answer on retry. **Expect:** rejection before any prohibited connection at each hop/resolution; positive allowed fetch remains functional.
3. Queue three allowed fetches at the same virtual instant. **Expect:** actual fake fetches honor the configured rate and record times; cancellation stops unsent attempts.

**Cleanup:** tear down fake DNS/network namespace and restore test policy. **Not tested:** exhaustive SSRF bypass coverage or production legal permission; use a versioned ASVS mapping in implementation.

## T16

**Claim/boundary:** complete attempt receipts and metadata. **Prerequisites:** A1–A6 measurement fixture plus one successful HTML fetch, one timeout and one redirect; adapter version `review-adapter-v1`; unavailable vendor fields null with reasons. **Actual:** NOT RUN.

1. Run/import all six measurement attempts. **Expect:** six retained outcomes, five completed and one refused; no failure disappears and missing model/cost/source data remains explicit.
2. Inspect successful, redirected and failed fetch receipts. **Expect:** attempted URL, resolved URL if available, status, time, content type if available, hash when bytes exist, render mode and version; no invented content hash for a timeout.
3. Supply returned source list, empty supported list and unsupported source field in separate inputs. **Expect:** those three conditions remain distinguishable in storage, report and export.

**Cleanup:** default. **Not tested:** truth of vendor-provided timestamps or billing data.

## T17

**Claim/boundary:** hostile text isolation. **Prerequisites:** hostile page/answer string from fixtures, fake tool recorder, read-only generation credentials, test admin session and permitted baseline evidence. **Actual:** NOT RUN.

1. Display text containing an HTML event-handler payload. **Expect:** inert text; no event execution, DOM privilege change or outbound request.
2. Process embedded instructions to ignore policy, retrieve secrets, publish a report and fetch a prohibited destination. **Expect:** no new permissions or tool actions; content remains attributable evidence.
3. Attempt direct write to raw evidence and release state using the generation adapter's identity, then perform a permitted draft write as positive control. **Expect:** protected writes denied by application/storage authorization; draft write succeeds within scope.

**Cleanup:** clear fake tools and draft artifacts. **Not tested:** universal immunity to all prompt injection.

## T18

**Claim/boundary:** deterministic classifications and corrections. **Prerequisites:** rule `literal-case-insensitive-v1`; first-party `a.example.test`, competitor `rival.example.test`, third-party `publisher.example.test`, unresolved `unknown.example.test`; A1 text exact as fixture. **Actual:** NOT RUN.

1. Apply source classification using the fixed entity registry. **Expect:** first-party, competitor, third-party and unknown respectively, each with rule/context version.
2. Classify `ExampleCo`, `exampleco`, and `Example Co` with the literal rule. **Expect:** first two match; third does not. State the rule's alias limitation; do not label literal detection complete semantic brand detection.
3. Append an approved alias-aware successor rule and reclassify. **Expect:** new derived records and version boundary; original bytes, hashes and previous classifications unchanged.

**Cleanup:** discard test successor, preserve sanitized comparison evidence. **Not tested:** real-world classifier accuracy or generative sentiment scores.

## T19

**Claim/boundary:** recovery, bounded retries and cancellation. **Prerequisites:** fake three-stage run fetch→measure→prepare; fetch artifact hash recorded; synthetic retry policy two retries after the initial attempt, delays one and two virtual seconds; retryable timeout and nonretryable refusal. **Actual:** NOT RUN.

1. Timeout measurement once, then succeed. **Expect:** initial failure plus retry recorded, prior fetch untouched, one accepted result and no owner action required for this permitted retry.
2. Timeout every attempt. **Expect:** three total attempts, configured waits, no fourth attempt, one actionable exhausted-retry item with recovery context. Refusal in a fresh run must follow its nonretryable rule rather than blindly retrying.
3. Cancel while one fake attempt is in flight. **Expect:** no new attempts scheduled, completed evidence retained, final in-flight outcome or unresolved status accounted for, and partial/cancelled state shown.
4. Retry an eligible failed stage as owner-a, then retry an already successful or stale-version stage. **Expect:** only eligible retry accepted; completed hashes stay identical; actor/reason/history retained.

**Cleanup:** stop fake workers and reset clock/retry configuration. **Not tested:** the production retry budget or real-provider cancellation guarantees.

## T20

**Claim/boundary:** panel lifecycle and prompt metadata. **Prerequisites:** `panel-v1` with exact P1/P2 prompts in fixtures, purpose, owner, locale, provenance, anchoring/class taxonomy, draft state; test panel-size policy exactly two, explicitly not production policy. **Actual:** NOT RUN.

1. Remove each required field in separate copies and request validation. **Expect:** each missing-field defect identified; otherwise complete draft accepted under the synthetic policy.
2. Freeze and use the panel; attempt to edit a used prompt's text, locale and anchoring class in place. **Expect:** each mutation denied and original remains readable.
3. Create successor `panel-v2` with a recorded reason, review it and retire v1 for future use. **Expect:** readable diff, immutable v1 and visible comparability boundary; old runs retain v1.
4. Label a direct brand prompt unanchored without supporting provenance. **Expect:** validation/review identifies the taxonomy conflict rather than silently entering it into headline metrics.

**Cleanup:** default. **Not tested:** whether two, 10–15 or any other panel size is appropriate for real service claims; D03 remains open.

## T21

**Claim/boundary:** independent rate arithmetic, eligibility and context. **Prerequisites:** six attempts A1–A6; synthetic method `test-descriptive-v1` includes successful unanchored attempts only, reports refusal separately, floor four eligible observations and no population inference. D03 needed before production adoption. **Actual:** NOT RUN.

1. Independently enumerate eligible records before inspecting generated output. **Expect:** A1/A2/A3/A4 eligible; A5 refused and A6 anchored excluded. Mentions A1/A3 give 2/4 = 50%; six attempted, one refused and one completed anchored remain disclosed.
2. Render/export this rate. **Expect:** numerator 2, denominator 4 and its definition, attempt counts, dates, versioned panel/method, surface/engine and missing model context; descriptive small-fixture limitation, no invented confidence interval.
3. Remove A4 or empty its answer. **Expect:** below-fixture-floor/invalid-evidence state rather than the same 50% claim. Remove date or panel version in separate cases. **Expect:** report context validation fails.

**Cleanup:** default. **Not tested:** a publishable statistical method, independence of observations or real visibility.

## T22

**Claim/boundary:** comparability and movement. **Prerequisites:** cycles C1/C2 with equal method context and 2/4 counts; C3 with changed panel version; C4 insufficient; synthetic method returns `insufficient-for-change-inference` for all n=4 samples. **Actual:** NOT RUN.

1. Compare C1/C2. **Expect:** descriptive equality can be shown, but no population-level unchanged claim; uncertainty limitation remains visible.
2. Compare C1/C3, then independently change collection surface, classifier, formula, threshold and exposed model in fresh copies. **Expect:** each material difference creates a named boundary and suppresses an unbridged change claim.
3. Compare C1/C4. **Expect:** insufficient, not zero, loss or no meaningful change. Provide an unapproved bridge. **Expect:** rejection. A genuinely supported-change case remains blocked until D03 supplies a frozen publication rule and independently derived golden example.

**Cleanup:** default. **Not tested:** statistical power or acceptance of a production bridge. The blocked positive change case remains explicit.

## T23

**Claim/boundary:** deterministic reproduction versus stored prose. **Prerequisites:** retained A1–A6 bytes; pinned deterministic rule/config; stored approved prose `brief-v1`; fake generation adapter that emits different text each time. **Actual:** NOT RUN.

1. Recompute measurement twice from the same retained evidence with generation disabled. **Expect:** identical classifications, numerator and denominator; output lists exact versions.
2. Retrieve the approved brief twice. **Expect:** identical stored prose bytes/hash and no generation request.
3. Generate a new draft and then retrieve the approved brief. **Expect:** new version separately recorded with generation metadata; previously approved artifact unchanged and not silently replaced.
4. Remove a required raw artifact or processing version. **Expect:** explicit reproduction failure/limitation, never a claim that every value reproduced.

**Cleanup:** retain hashes, discard synthetic output. **Not tested:** repeating a live AI query to obtain the same answer.

## T24

**Claim/boundary:** report comprehension structure and honest visual states. **Prerequisites:** fixed report fixtures for first cycle, equal descriptive observations, supported change only when D03's golden case exists, insufficient cycle, synthetic sample and draft/approved versions. Accepted current visual tokens; no new design approval inferred. **Actual:** NOT RUN.

1. Inspect each available fixture at desktop 1440×1050 and mobile 390×844. **Expect:** principal finding and material limitation visible before evidence detail; no unsupported confidence, cut-off essential content or unexplained empty state.
2. Open detail and next action. **Expect:** clear labels, working permitted evidence path, priority/action reason, effort, confidence, dependency and reversibility; first cycle explicitly lacks a prior comparison and unknown prior-action completion stays unknown.
3. Inspect sample tables/charts and their export. **Expect:** synthetic label directly adjacent to each affected display; draft, released, missing and measured-zero states remain distinguishable.

**Cleanup:** restore baseline display; save screenshots with fixture/version labels. **Not tested:** human understanding—T34 supplies that separate check—or final client visual approval.

## T25

**Claim/boundary:** useful operator summary and exception queue. **Prerequisites:** five A cycles: one preparing normally, one failed after retry, one insufficient, one ready awaiting owner release, one released; B has one private failed run; cost null for one A attempt. **Actual:** NOT RUN.

1. Open A summary and inspect queue. **Expect:** three A actionable items (failed, insufficient, awaiting release), one each; the healthy preparing/released cycles add no exception. No B identity/count leakage.
2. Open each item and trace its stage, evidence and cost records. **Expect:** persisted state and correlation agree; unknown cost is unavailable rather than zero; diagnostic path does not require database editing.
3. Repeat ingestion of the same failure and mark a separate provider health sample stale. **Expect:** no duplicate exception and explicit freshness/degraded state. Any incident view remains unable to deploy, buy, publish or delete.

**Cleanup:** default. **Not tested:** a complete historical multi-module admin portal.

## T26

**Claim/boundary:** event integrity and consequential actions. **Prerequisites:** fixture operations create, authorized read of sensitive evidence, retry, cancel, approve/release, export, revoke, method change and simulated retention deletion; policies define which reads require logging. **Actual:** NOT RUN.

1. Perform each operation as its permitted test actor with reason `review-fixture`. **Expect:** event records actor, subject, correlation, outcome, time and required reason; automated events identify automation rather than a named human.
2. Repeat a duplicate action request and attempt unauthorized action. **Expect:** one business effect; attributable duplicate/denial handling without claiming two releases or two jobs. Event cardinality follows the documented action/attempt contract.
3. Attempt to alter or delete the event as operator, viewer and generation identity. **Expect:** rejected; original event remains retrievable and filterable by run/tenant.

**Cleanup:** preserve sanitized event export; destroy only disposable store. **Not tested:** tamper resistance against a production infrastructure administrator.

## T27

**Claim/boundary:** support grants and membership revocation. **Prerequisites:** only if support-grant feature is selected; synthetic read-only A grant, purpose `case-a1`, expiry `12:10Z`, no export; current user-membership mechanism. D05/D07 govern release inclusion. **Actual:** NOT RUN.

1. Search public/private route inventory for impersonation and attempt impersonation through the documented API. **Expect:** absent or denied; no privilege obtained.
2. Use grant for permitted A read, B read, export and a different purpose. **Expect:** only permitted A read succeeds with entry/read/exit audit; all others denied.
3. Advance to expiry and separately revoke before expiry. **Expect:** immediate denial including existing session/token usage. Revoke viewer-a membership and repeat a previously permitted report read. **Expect:** denied with no cross-tenant role changes.

**Cleanup:** revoke fixture grants/memberships and restore clock. **Not tested:** selection of support duration or authorization channel; omitted support functionality is not marked passing.

## T28

**Claim/boundary:** secrets and sensitive-data redaction. **Prerequisites:** fake credential `mlx_test_secret_DO_NOT_USE_7f92`, synthetic consent token, fake payment detail and customer-content sentinel; configured protected test credential store, ordinary data/log/UI/export/prompt capture. **Actual:** NOT RUN.

1. Exercise success, validation failure, provider error and export paths with sentinels. **Expect:** no secret or prohibited field in ordinary records, logs, generated prompts, UI, exports or screenshots; safe references remain usable.
2. Rotate the fake secret, then remove it. **Expect:** displayed identity/scope/version never reveals full credentials, old credential rejected by fake adapter, missing credential produces degraded state rather than a measured result.
3. Search the full test artifact bundle and repository diff for every sentinel. **Expect:** occurrences only in explicitly isolated fixture/protected-store input, never deployable source or normal outputs. Record exact search scope; a clean search is not an exhaustive leak proof.

**Cleanup:** remove all fixture credentials from the isolated secret store and outputs after sanitized evidence capture. **Not tested:** production secret-store selection or payment-data handling certification.

## T29

**Claim/boundary:** minimization, expiry and deletion consistency. **Prerequisites:** D04-approved production policy for production acceptance; synthetic policy retains evidence and linked reports together until `2026-09-20T12:00Z`, no personal fields beyond contact ID; test clock. **Actual:** NOT RUN.

1. Attempt to store an unnecessary sensitive field and inspect retained ordinary records. **Expect:** field rejected or omitted under schema/policy; required safe reference retained.
2. Run expiry at one second before and exactly at synthetic expiry, including retry of the job and inspection of the isolated backup copy. **Expect:** no early deletion; eligible records handled once; audit trail, backup handling and report/evidence availability agree with the defined policy. If backup/deletion behavior has no selected contract, that subcase is BLOCKED, never assumed covered by primary-store deletion.
3. Simulate an authorized early deletion request. **Expect:** protected access and retained content respond according to policy; dependent report clearly states unavailable evidence/reproduction limits and does not claim surviving proof.

**Cleanup:** reset clock, remove disposable fixtures only. **Not tested:** legal retention periods, unresolved backup/legal-hold policy or real customer deletion.

## T30

**Claim/boundary:** targeted accessibility acceptance. **Prerequisites:** pinned browser/OS/screen-reader versions and release pages for authorization, report, evidence, owner approval and recovery; keyboard and screen reader available; WCAG 2.2 A/AA criteria inventory scoped to these pages. **Actual:** NOT RUN.

1. Complete each named flow using keyboard only, then with the recorded screen reader. **Expect:** meaningful labels/status announcements, logical focus, visible unobscured focus, no traps, operable controls and access to validation errors/evidence.
2. Set text zoom 200%; separately test 320, 375, 880 and 1120 CSS-pixel widths, text-spacing overrides, and forced-colors mode. **Expect:** no loss of essential content/function; permitted two-dimensional content has an accessible handling pattern; state never relies only on color. Width choices are project fixtures, not all separate WCAG mandates.
3. Measure applicable text and non-text contrast and run automated checks, retaining criterion-level results. **Expect:** tested criteria satisfy their actual thresholds. Unexecuted manual criteria stay NOT RUN; partial checks never become a full WCAG conformance claim.

**Cleanup:** restore display settings. **Not tested:** every page, disability or assistive-technology combination; produce the missing-criteria inventory before any full conformance statement.

## T31

**Claim/boundary:** asynchronous usability and freshness. **Prerequisites:** fake collector waits 30 virtual seconds; running job survives page reload; agreed performance budget D08 before speed acceptance. **Actual:** NOT RUN.

1. Start collection and, while pending, open another allowed page and inspect run details. **Expect:** interaction remains available without waiting for collection completion; actual progress/freshness shown.
2. Reload, disconnect/reconnect the test browser, and restart a worker in separate runs. **Expect:** stored job/status reconnects correctly; no duplicate work or invented success.
3. Measure interaction latency and queue age against the selected budget when available. **Expect:** explicit measured values and pass/fail against that version; absent budget produces BLOCKED for performance acceptance, not an invented 500 ms standard.

**Cleanup:** cancel remaining fake jobs and reset clock/network. **Not tested:** production load capacity or availability SLA.

## T32

**Claim/boundary:** recurring scheduling, missed cycles and approval queue. **Prerequisites:** fake scheduler fixed to `America/New_York`; active engagement A due 09:00 on September 18 and 19; B paused; explicit missed-opportunity policy in test config is record gap, never fabricate past observation; D08 controls real policy. **Actual:** NOT RUN.

1. Advance across each due instant twice. **Expect:** one A cycle per scheduled opportunity, scheduled/actual timestamps retained; zero B collection jobs. Repeat with A cancelled and with the test entitlement explicitly ineligible: neither creates new collection work.
2. Stop scheduler across a due instant and resume one hour later. **Expect:** missed/delayed state retained with actual time under the configured recovery policy; never backdated as collected on time.
3. Prepare a healthy monthly report. **Expect:** exactly one owner-release item; no client release before approval. Retry a failed cycle and cancel a different one. **Expect:** ordered history preserves each cycle and every gap, with no duplicate exception or silent omission.
4. Change the panel between cycles. **Expect:** successor series/boundary retained; no cross-boundary change claim. DST policy is a separate named prerequisite and test before scheduling across a transition.

**Cleanup:** stop scheduler; reset clock and engagement state. **Not tested:** the Codex desktop automation scheduler, continuous uptime or real recurring-client renewal.

## T33

**Claim/boundary:** bounded AI interpretation and evaluation design. **Prerequisites:** D09 adoption decision; fixed evidence packets for supported claim, missing evidence, conflicting contexts and unauthorized action; stored baseline summaries; model/prompt/adapter versions; human reviewer availability for calibration. **Actual:** NOT RUN.

1. Generate a draft with pinned configuration and retain prompt, model, adapter, input references and available usage. **Expect:** material factual claims trace to evidence, missing metadata marked unknown, no Tier-1 writes or release capability.
2. Give a blinded reviewer paired baseline/AI outputs in counterbalanced order with the scoring questions: factual support, main finding comprehension, action feasibility and material omitted limitation. **Expect:** per-case judgments and disagreements recorded; ties and rejected outputs remain visible.
3. Count actual drafting, review and correction effort and available attributable cost. **Expect:** like-for-like comparison includes failures/rework; no superiority claim from a handful of debugging cases. If reviewer, representative sample or decision-sized evaluation is absent, mark the relevant acceptance BLOCKED, not independently validated.

**Cleanup:** retain de-identified evaluation data; no client release. **Not tested:** population superiority or ongoing AI adoption from one fictional trial.

## T34

**Claim/boundary:** human comprehension, friction and behavioral hypothesis. **Prerequisites:** representative consenting test participant and owner; fixed report A (2/4 descriptive fixture, one refused, one anchored excluded, no population inference); task script below and observation sheet; no real purchase. **Actual:** NOT RUN.

1. Say: “Find what this report tells you, what it cannot tell you, and the recommended next action. Explain each in your own words.” Give no coaching initially. **Expect:** record verbatim response, time, assistance and errors. Reference meaning: two of four eligible answers mention the brand; limited synthetic sample cannot prove overall visibility or causal outcomes; action must match the displayed evidence-linked action.
2. Ask the owner to review and decide release using the same artifact. **Expect:** separately recorded owner effort, evidence inspected, uncertainties and decision; no assumption that low client effort implies low owner effort.
3. For a proposed interface intervention, record target behavior, observed/self-reported/hypothesized barrier and predicted mechanism before comparing versions. **Expect:** comprehension, follow-through, confusion/regret and extra workload retained; no invented personality diagnosis or numeric uplift.

**Cleanup:** remove identifying participant data per agreed test consent; preserve de-identified observations. **Not tested:** conversion/renewal rate, general-population usability or a two-minute/four-of-five acceptance threshold.

## T35

**Claim/boundary:** repeatability, effort and recurring economics records. **Prerequisites:** completed equivalent baseline and assisted test cycles for A/B, activity ledger, attributable provider costs if exposed, human time records, synthetic invoice/renewal ledger with one paid, one eligible-not-renewed, one not-yet-eligible. **Actual:** NOT RUN.

1. Reconstruct cycle cost from known provider cost plus separately measured preparation/review/recovery work; inspect missing entries. **Expect:** unknowns remain unknown, owner time not assumed free, account-wide Codex usage not attributed as task cost.
2. Compare equivalent workflow versions for both test organizations. **Expect:** accepted-output quality, total human time, failures, assistance and customer-specific changes reported together; no claimed savings from unequal cases or splitting trivial steps.
3. Inspect recurring ledger and client-usefulness feedback. **Expect:** payment, renewal eligibility, actual renewal, cancellation and stated interest are separate. One payment or synthetic ledger cannot be presented as a measured retention rate or real revenue.

**Cleanup:** retain sanitized test ledger and effort sheets. **Not tested:** actual customer economics; production targets remain D01 decisions.

## T36

**Claim/boundary:** defensible competitive comparison. **Prerequisites:** selected buyer/task from D01, dated service artifact and at least one credible buyer substitute with accessible comparable evidence; criteria fixed before rating. **Actual:** NOT RUN.

1. Compare identical customer tasks and service scope on evidence traceability, useful action, turnaround, owner/client effort and cost definitions. **Expect:** criteria and source dates recorded; unmatched dimensions labeled incomparable.
2. Label competitor statements without independent observations as vendor claims and inaccessible items unavailable. **Expect:** no assumed failure or zero score for unknowns.
3. Draft the narrow supported comparison and its strongest contrary evidence. **Expect:** no market-leader or superiority claim beyond observed scope; record what further customer evidence would change the recommendation.

**Cleanup:** retain sources and scope notes without copying restricted material. **Not tested:** whole-market coverage or paid research not accessed.

## T37

**Claim/boundary:** scoped recommendations and provider qualification. **Prerequisites:** frozen offer evidence checklist requiring exact answer text, question, collection surface, date/context, retained export and permitted commercial report use; evidence packet with current provider terms/version and plan, explicit unsupported fields and one exported observation. D03/D04 determine actual necessary rights; synthetic policy packet may test blocking but cannot qualify a real provider. **Actual:** NOT RUN.

1. Map every mandatory evidence field and use right to a cited exact service/plan provision or documented confirmation. **Expect:** verified, unresolved and denied states remain distinct; downloadable text alone does not establish permitted client redistribution or upstream authorization.
2. Remove permission evidence for one mandatory use and remove answer text in a separate copy. **Expect:** collection-route acceptance blocked or an explicitly reviewed narrower offer required. Merely listing the gap is not a PASS.
3. Review a recommendation claiming special AI markup guarantees ChatGPT citations while citing only Google guidance. **Expect:** claim rejected for unsupported outcome and source scope. A bounded Google-specific recommendation supported by an observed Google-facing issue retains its scope and validation step; a nonofficial hypothesis remains labeled as such.

**Cleanup:** retain source/version references and limitation decision; no purchase or new collection. **Not tested:** legal assurance or acceptance of a real provider without its actual qualified evidence.

## T38

**Claim/boundary:** selected paid lifecycle and next-cycle entitlement. **Prerequisites:** D01/D02 accepted before production testing; synthetic lifecycle separates payment, collection, review, release and delivery; fake refund/cancellation ledger; selected test rule is cancellation prevents the next unstarted cycle and does not invent a refund. **Actual:** NOT RUN.

1. Mark payment succeeded while collection fails, then mark report prepared while release remains pending. **Expect:** distinct persisted states and appropriate next action; payment is not evidence of delivery and preparation is not release.
2. Cancel before the next scheduled opportunity and replay cancellation. **Expect:** no next collection, one effective cancellation, prior approved report access handled according to the selected policy. Do not assume cancellation automatically refunds payment.
3. Apply the selected fake refund outcome and a failed delivery notification in separate cases. **Expect:** each recorded distinctly with recoverable fulfillment/support handling; no automatic repeat charge or unapproved report release. An undefined refund, dispute or entitlement rule blocks that policy's acceptance instead of being invented by the tester.

**Cleanup:** clear synthetic payment/refund/notification ledgers and restore scheduler. **Not tested:** real funds, refunds, actual renewal or a provider contract.

## T39

**Claim/boundary:** actual requirements review coverage. **Prerequisites:** pinned requirements.json, source-crosswalk.md, current decisions and review evidence; named actual reviewers rather than a list of imagined specialist roles. **Actual:** NOT RUN as a team-review acceptance case; same-agent structure checks are reported separately in verification.md.

1. Enumerate every source and provisional requirement ID and join it to its actual review record. **Expect:** no missing rows or fabricated reviewer identities; any absent required specialist coverage is explicit.
2. Compare a proposed change and its authority record. **Expect:** recommendation, accepted decision and implementation evidence are distinguishable; prior reviewers are not credited with reviewing this new wording.
3. Inspect unresolved disagreement and coordinator correction records. **Expect:** reasons and remaining limits preserved. A same-agent review or schema validator cannot satisfy a requirement for independent team/customer review.

**Cleanup:** none; read-only document review. **Not tested:** independent specialist agreement or owner acceptance of changed scope.

## Existing verification to reuse, without inflating coverage

- [Local report builder verification](../report-builder-verification.md): fictional inputs, package retention, reproduction structure and one bounded AI review trial. It does not execute T05/T23/T33 against a customer report or establish production authority.
- [Saved-data checker](../evidence-inspection.md) and [frontend checks](../evidence-frontend.md): fixed 16-answer sample, provenance, blocking states, local session boundary and desktop/mobile UI. These are relevant prior evidence for parts of T07/T11/T12/T16/T24; they do not certify all assertions in those families.
- [TC-EVD-001](../testing-practice.md): independent saved-data arithmetic. Its input/hash and expected 0/16 stay distinct from this package's synthetic 2/4 fixture.

The implementing slice must bind each applicable subcase to actual interfaces and artifact versions before calling a requirement development-ready. Owner choices remain explicit; the tester must not invent policy or implementation setup.
