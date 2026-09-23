"""Generate the local review package; never modifies historical authority or product code."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
BASE = Path('/Users/tag/Desktop/Builds/MindLeverX - Claude Code Build')
SOURCES = {
    'V4': BASE / '01 - REQUIREMENTS INPUT/01 - MindLeverX Clean-Slate Requirements v4.0.md',
    'V5': BASE / '04 - PROJECT CONTROL/V5 APPROVAL PACKAGE.md',
    'CURRENT': ROOT / 'docs/codex-handoff.md',
    'GUIDANCE': ROOT / 'docs/build-guidance.md',
    'TENETS': ROOT / 'docs/product-tenets.md',
    'TESTING': ROOT / 'docs/testing-practice.md',
    'METRICS': ROOT / 'docs/tenet-metrics.md',
    'METHOD': ROOT / 'docs/metric-methodology.md',
    'SHEET': OUT / 'live-sheet-snapshot.json',
}

def source_rows(path, prefix):
    result = {}
    for line in path.read_text().splitlines():
        if not line.startswith('| ' + prefix):
            continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if prefix == 'MLX3-SVC-' and len(cells) != 4:
            continue
        rid = cells[0].strip('`')
        if not re.fullmatch(r'MLX3-[A-Z]+-\d{3}', rid):
            continue
        result[rid] = dict(id=rid, title=cells[1], original=cells[2], original_verification=cells[3], source_trace=cells[4] if len(cells)>4 else 'V5 section 4')
    return result

originals = source_rows(SOURCES['V4'], 'MLX3-')
originals.update(source_rows(SOURCES['V5'], 'MLX3-SVC-'))
assert len(originals) == 86, len(originals)

# Each line: short ID | revised normative text | rubric profile | case IDs | unresolved decisions | dependencies.
# The sentences below are reviewed proposals; inherited source authority is retained separately.
ROWS = '''
INV-001|Before a customer-facing launch, the owner records the selected buyer segment and the service uses that segment consistently in its offer, intake and examples; mid-market B2B SaaS remains the historical candidate until that decision is settled.|offer|T01|D01|—
INV-002|For the selected paid-audit journey, the system accepts only an authorized engagement with the required verified payment before fulfillment; the historical ban on checkout is recorded as conflicting with the later first-sale direction, pending final offer approval.|offer|T01,T02|D01,D02|AUD-002
INV-003|Every reported AI observation identifies its actual collection surface and provider-labeled engine, and an API benchmark is never presented as a consumer ChatGPT observation; reporting multiple surfaces keeps their results separate.|measure|T03|D03|MEA-006
INV-004|Website and SEO checks support the agreed GEO service as separately identified diagnostic findings, without an unsupported composite score, rank-tracking suite or implied Google-to-ChatGPT equivalence.|measure|T04|D03|EVD-009
INV-005|Every public or client-facing claim distinguishes observed evidence from inference and excludes guarantees of rankings, AI citations, traffic, leads or revenue.|report|T05|—|INV-007
INV-006|Report preparation cannot publish to customer sites, contact third parties, acquire credentials, buy services or release customer material outside the specifically authorized action and recorded release policy.|control|T06|D02|ADM-018
INV-007|Every material report conclusion resolves to retained evidence and its processing versions, or is explicitly identified as an inference or unknown with its basis and limitations.|evidence|T05,T07|—|EVD-006,MEA-010
AUD-001|An authorized operator can create an engagement tied to one organization, authorized property, responsible contact and permitted recipients, with no access to another organization's records.|access|T08|D05|NFR-001
AUD-002|Collection starts only when a recorded, current authorization covers the property, processing scope and applicable terms; an expired, revoked or materially out-of-scope authorization blocks further collection.|consent|T09|D04|AUD-001
AUD-005|Repeating the same engagement or run creation request produces one logical engagement or run and no duplicate fulfillment, while distinct authorized requests remain distinguishable.|operations|T10|—|AUD-001
AUD-006|Each displayed run state comes from persisted server state, and a failed or unacknowledged operation never displays completion.|operations|T11|—|OPS-005
AUD-007|When a property cannot be resolved, reached or measured, the result identifies the failed scope and reason without assigning a fabricated score or treating the failure as measured zero.|measure|T12|—|MEA-012
AUD-008|A released report is accessible only to its authorized recipient through the selected private delivery mechanism; expiry and revocation remove access, and notifications omit sensitive evidence.|access|T13|D02,D05|ADM-011,NFR-001
AUD-009|The recipient can reach the current privacy, retention, support and access-revocation information from the delivered report without a dead link or contradictory promise.|consent|T14|D04,D05|AUD-008
EVD-001|The collection service fetches only authorized public targets allowed by the frozen domain, robots and rate policy, and records a blocked attempt when a target is disallowed.|security|T15|D03|AUD-002,EVD-008
EVD-002|Every attempted fetch has a receipt recording requested and resolved URL, outcome, time, content type, available content hash, render mode and collector version, with unavailable fields explicitly marked.|evidence|T16|D03|EVD-001
EVD-003|The audit retains blocked, unreachable, script-dependent and unsupported pages in its scoped findings with distinct outcomes rather than silently dropping them.|evidence|T12,T16|—|EVD-002
EVD-004|Retrieved text is processed as untrusted evidence and cannot change tool permissions, release decisions, collection scope or system instructions.|security|T17|—|NFR-003
EVD-005|Each retained source has a versioned first-party, competitor, third-party or unknown classification with the rule and entity context used to assign it.|measure|T18|D03|EVD-002
EVD-006|Each permitted evidence reference resolves to a stable internal identifier and recorded byte hash, while expired or deleted evidence resolves to an explicit unavailable state.|evidence|T07|D04|EVD-002
EVD-007|A permitted fetch retry creates a distinct attempt within the configured retry budget while preserving the single logical observation and all earlier outcomes.|operations|T10,T19|D03|EVD-002
EVD-008|The collection service rejects internal or otherwise prohibited network destinations at initial resolution and every redirect or renewed resolution, using enforceable egress controls.|security|T15|—|NFR-003
EVD-009|Technical-access results show individual checks, observed evidence, severity and limitations without a fabricated readiness or SEO composite.|measure|T04|D03|EVD-002
MEA-001|Before collection, an authorized operator freezes a panel with stable ID, version, owner, purpose, prompt list and an approved bounded sample design; the historical 10–15-prompt range remains a candidate, not an automatically adopted current threshold.|measure|T20|D03|ADM-009
MEA-002|Every prompt retains its exact text, category, market, language or locale, provenance, anchoring classification and version, marking unavailable context explicitly.|measure|T20|D03|MEA-001
MEA-003|The versioned panel taxonomy distinguishes unanchored discovery or problem questions, comparisons, trust or method questions and direct brand questions, with ambiguous classification recorded for review.|measure|T20|D03|MEA-002
MEA-004|A headline unanchored-visibility rate includes only eligible unanchored observations in its denominator and reports anchored or direct-brand observations separately.|measure|T21|D03|MEA-003,MEA-011
MEA-005|A used or frozen panel cannot be edited in place; an accepted change creates a successor version and preserves the former panel and comparability boundary.|measure|T20,T22|—|MEA-001
MEA-006|Each measurement attempt records collection surface, provider and engine labels, available model and settings, adapter version, time, request identifier, outcome and available latency and cost, identifying unavailable vendor metadata without inventing it.|measure|T03,T16|D03|NFR-010
MEA-007|A run records actual attempts per prompt and applies the approved repetition and uncertainty rule, labeling a below-rule sample insufficient; the historical three-attempt floor is not silently adopted for the current panel.|measure|T21|D03|MEA-001,MEA-008
MEA-008|Every attempted execution retains its completed, refused, truncated, timed-out, blocked, invalid, cancelled or provider-error outcome, and run totals reconcile with those attempts.|evidence|T16,T19|D03|MEA-006
MEA-009|The evidence record distinguishes sources actually returned by the provider from absent, unsupported or uncollected source data.|evidence|T16|D03|MEA-006
MEA-010|A pinned deterministic rule set derives measurement classifications from preserved raw observations; corrections append a versioned successor and do not overwrite evidence or prior classifications.|measure|T18,T23|D03|EVD-006
MEA-011|Every rate exposes its numerator, denominator definition, eligible sample size, date, panel and method versions, collection surface and engine context, plus the approved uncertainty statement or an explicit insufficiency limitation.|measure|T21|D03|MEA-004,MEA-008
MEA-012|The data model and presentation distinguish not measured, failed, insufficient, observed absence and measured zero without coercing missing evidence to zero.|measure|T12|—|MEA-008
MEA-013|Reports keep website technical access, answer readiness, off-site evidence and observed AI visibility distinguishable, keep ordinary search performance and model-API benchmarks separate when present, and display no unsupported overall composite.|measure|T04|—|RES-003
MEA-014|A material change to panel, collection surface, engine or exposed model, classifier, formula or threshold creates a visible boundary across which change claims are suppressed unless a documented bridge is approved.|measure|T22|D03,D06|MEA-005,ADM-010
MEA-015|A recurring report evaluates change only for comparable, sufficiently supported observations and distinguishes no supported change from insufficient evidence; it never treats a difference alone as causal lift.|measure|T22|D03|MEA-014
RES-001|The client report opens with an understandable principal finding and its material limitation, with supporting method and evidence reachable through clearly labeled detail.|report|T24|—|RES-002,RES-004
RES-002|Each displayed measurement presents its scope, surface or engine, known model context, panel, date, sample, incomplete work and material limitations beside the claim.|report|T21,T24|D03|MEA-011,MEA-012
RES-003|Every report family records a measurement state, its reason, available evidence and a supported next action or an explanation that no action is justified.|report|T04,T12|—|MEA-013
RES-004|An authorized reader can trace each measurement or conclusion to the contributing permitted observations and receipts, with clear explanations for evidence unavailable under retention or access rules.|report|T07,T13|D04|EVD-006
RES-005|Every visualization, table or result containing fictional or synthetic observations is directly labeled as such, including exports and empty-state examples.|report|T24|—|RES-006
RES-006|A private machine-readable report export includes the scope, result states, evidence references and pinned processing versions needed to reproduce supported values, without leaking secrets or another tenant's data.|evidence|T23,T13,T28|D04|NFR-009
RES-007|The report identifies one prioritized evidence-linked action, or explains why none is justified, and discloses confidence, expected effort, dependencies and reversibility; recurring reports also state the known status of the prior action.|report|T05,T24|—|INV-007,SVC-004
OPS-001|An authorized operator can diagnose a run's status, scoped evidence, failures and available provider cost through the operational view without direct database editing.|operations|T11,T25|—|ADM-006
OPS-002|Concurrent workers and retried submissions produce one logical run result through persisted ownership and idempotency, with exhausted or uncertain work parked for review.|operations|T10,T19|D03|AUD-005
OPS-003|An authorized retry targets only an eligible failed stage, preserves completed artifacts and appends a new attempt; automated retry, where approved, follows the same bounded recovery contract.|operations|T19|D03|OPS-002
OPS-004|An authorized cancellation stops further collection scheduling and retains completed observations, in-flight outcome accounting and an explicit partial or cancelled run state.|operations|T19|—|ADM-007
OPS-005|Every state-changing automated action appends an attributable event containing the action, reason, input references, outcome and time without recording unnecessary sensitive content.|operations|T26,T28|—|NFR-005
NFR-001|Server-side access checks enforce the tenant boundary for organizations, engagements, runs, evidence and reports across reads, writes, searches, exports and caches.|access|T08,T13|D05|—
NFR-002|Provider credentials are stored only in the selected protected secret mechanism and are excluded from source control, ordinary records, prompts, logs, UI and exports.|security|T28|D05|—
NFR-003|Tool and network restrictions are enforced outside generated text so that an untrusted prompt or retrieved page cannot authorize a denied capability.|security|T17,T15|D05|—
NFR-004|Application and operational logs redact credentials, payment details, authorization tokens and unnecessary customer content while retaining safe diagnostic references.|security|T28|D04|NFR-005
NFR-005|A stable run correlation identifier links its attempts, evidence, classifications, result and attributable cost records without exposing private data to unauthorized users.|operations|T25,T26|—|AUD-005
NFR-006|The service stores only the data needed for the approved purpose and applies the selected retention and deletion rules across raw evidence, receipts, reports and contacts, marking any resulting reproduction limitation.|consent|T29|D04|EVD-006
NFR-007|The agreed customer and operator release flows are assessed against applicable WCAG 2.2 Level A and AA success criteria, with manual and automated evidence and unresolved failures stated before any conformance claim.|experience|T30|—|RES-001,ADM-016
NFR-008|Long-running collection runs outside the page request path while the UI remains usable and displays persisted progress, freshness and recoverable failure without inventing completion.|operations|T11,T31|D08|AUD-006
NFR-009|Pinned deterministic processing reproduces measurement values from retained evidence, and approved generated prose is reproduced by retrieving its stored version rather than regenerating it.|evidence|T23|D04|MEA-010,RES-006
NFR-010|Collection-provider integrations implement a documented versioned contract whose fake and real adapters preserve the same outcome and evidence semantics while disclosing unsupported fields.|measure|T03,T16|D03|—
ADM-001|The operator can reach the controls required for the accepted delivery slice through an authenticated workspace; a full historical module list is not a prerequisite for the first report unless its need is retained explicitly.|access|T08,T25|D05,D07|NFR-001
ADM-002|Every privileged endpoint enforces the approved role-action policy on the server with deny-by-default behavior, including release, recovery, exports and user administration.|access|T08,T13|D05,D06|NFR-001
ADM-003|Each operator view and action binds to an explicit tenant, and search, totals, exports, cache entries and errors do not disclose another tenant's records.|access|T08,T13|D05|NFR-001
ADM-004|Impersonation is unavailable; if support grants are selected for a release, access requires recorded customer authority, a named tenant and purpose, finite expiry, immediate revocation and an attributable access trail.|access|T27|D05,D07|ADM-002
ADM-005|An authorized operator can provision a second customer through bounded configuration, reusing the engagement and authority workflow without code changes or repeated client data entry.|experience|T08,T09|D01,D05|AUD-001,AUD-002
ADM-006|The operational summary reconciles persisted jobs, attempts, exceptions, freshness and available costs, with tenant-safe drill-down and no healthy label for stale, blocked or partial work.|operations|T11,T25|D07|AUD-006,NFR-005
ADM-007|The run view preserves stage and attempt history and exposes only authorized, state-valid cancellation, retry and parking actions with actor, reason and outcome.|operations|T19,T26|—|OPS-002,OPS-003,OPS-004
ADM-008|The evidence view exposes permitted source records, provenance, classifications, correction history and failures while preserving raw records and rendering external text inertly.|evidence|T07,T17,T18|D04|EVD-006,MEA-010
ADM-009|The panel registry records draft, review, validation, freeze, successor and retirement states with readable differences and immutable used versions.|measure|T20|D03,D06|MEA-005
ADM-010|The method registry preserves adapter, model-context, classifier, formula and threshold versions with their authority and comparability changes, displaying secret references without secret values.|measure|T22,T28|D03,D06|MEA-014
ADM-011|Monthly reports become client-visible only after the owner's recorded release decision; completeness and evidence checks precede that decision, and the one-time audit release policy remains explicit and unresolved.|control|T06,T13|D02|RES-002,RES-006
ADM-012|The selected identity mechanism permits authorized membership provisioning and revocation with recorded history and tenant-safe role changes; a custom administration UI is included only if justified for the release.|access|T08,T27|D05,D07|ADM-002
ADM-013|Privileged reads and consequential actions append audit records with actor, reason where required, subject, correlation, outcome and time; ordinary application users cannot edit or suppress those records.|control|T26|D04|NFR-005
ADM-014|Where incident tooling is included, an authorized operator can correlate a support case with permitted run evidence and logs without acquiring deployment, credential, billing, deletion, publication or outreach powers.|operations|T25,T17|D07|ADM-013
ADM-015|Provider configuration displays permitted identity, scope, version, health and verification freshness without revealing credentials, and unavailable credentials produce an explicit degraded state.|security|T28,T11|D05|NFR-002
ADM-016|Critical operator workflows support keyboard use, visible unobscured focus, meaningful labels and status, text enlargement and reflow, with the applicable WCAG 2.2 AA checks evidenced for the release version.|experience|T30|—|NFR-007
ADM-017|The operator interface preserves the currently accepted visual direction and presents operational state before optional evidence detail, clearly distinguishing sample, unknown, insufficient, partial, stale, unauthorized, draft and released states.|experience|T11,T24,T30|—|AUD-006,RES-005
ADM-018|Before a consequential action, the UI identifies the tenant, target and effect; the server verifies authority and current state, prevents duplicate effects and returns the persisted outcome with the required reason and audit event.|control|T06,T10,T26|D02,D04,D05|ADM-002
SVC-001|An active recurring engagement has an approved cadence and time zone; each scheduled opportunity creates at most one cycle recording planned and actual time, while a paused engagement creates no collection work.|recurring|T32|D01,D08|AUD-002,OPS-002
SVC-002|Routine recurring collection and report preparation advance to the required review boundary with bounded retries and visible exceptions; required owner release is not classified as an automation failure.|recurring|T19,T32,T06|D03,D08|SVC-001,ADM-011
SVC-003|Each recurring report compares only eligible observations from comparable cycles and distinguishes supported change, no supported change and insufficient evidence under the approved method.|recurring|T22|D03|MEA-014,MEA-015
SVC-004|Each recurring brief states the current finding, available comparison, limitations, supporting evidence and prioritized action, and remains a draft until the owner's release approval.|recurring|T24,T06|D01|SVC-003,ADM-011
SVC-005|The operator queue contains actionable failures, blocked or insufficient work and reports awaiting required release, without duplicate entries; healthy preparation may still require one owner-release decision.|recurring|T25,T32|—|ADM-011,SVC-002
SVC-006|Recurring cycles retain ordered identity and pinned method context, and a material change creates an explicit successor series without silently merging incomparable observations.|recurring|T22,T32|D03|MEA-014
SVC-007|A missed, failed, cancelled or partial cycle remains visible with its actual collection time and reason, and later recovery never fabricates an on-time observation.|recurring|T32|D08|AUD-006
SVC-008|A separately configured, versioned generation adapter may draft interpretations from permitted evidence but cannot alter raw observations, deterministic measurement or release state; each stored draft records available model, prompt, adapter and usage metadata.|intelligence|T17,T23,T33|D09|MEA-010,NFR-009,ADM-011
'''

PROPOSALS = '''
PROP-UX-001|Whole-journey usability|For a representative pilot, record client completion and comprehension and owner preparation, review and recovery effort separately, using the same defined journey and recording assistance and failures.|experience|T34|D01|RES-001,ADM-011
PROP-VAL-001|Buyer and renewal validation|Before a paid pilot, specify the buyer, useful decision, bounded offer and evidence plan; after delivery, record observed usefulness, renewal eligibility and actual payment or cancellation separately from technical success and stated interest.|offer|T01,T35|D01|RES-001
PROP-REP-001|Second-customer portability|Demonstrate the approved workflow for two differently configured authorized test organizations using the same core contracts, and record configuration effort, exceptions and any custom code.|operations|T08,T35|D01|ADM-005
PROP-OPS-001|Delivery economics and owner effort|Before a pilot, define cost/time measurement and spend/retry limits; during delivery record provider, allocated tool, billing/refund costs and setup, preparation, review and recovery labor separately from elapsed approval wait, preserving unknowns and failed attempts.|operations|T19,T35|D01,D08|OPS-003
PROP-AI-001|AI benefit evaluation|Before adopting recurring AI interpretation, compare its evidence support and action usefulness against a simpler baseline on fixed representative cases, with blinded review, disagreement, costs and uncertainty recorded.|intelligence|T33|D09|INV-007,SVC-008
PROP-LEAD-001|Evidence of useful differentiation|Evaluate the proposed service against buyer-relevant alternatives on comparable scope, traceability, usefulness, effort and cost, distinguishing verified observations from vendor claims and unavailable evidence.|leadership|T36|D01|RES-001
PROP-BEH-001|Informed action and follow-through|For a consequential buyer or operator intervention, record the target action, observed or hypothesized barrier, proposed mechanism, comprehension, follow-through and unintended effects before claiming benefit.|behavior|T34|D01|PROP-UX-001
PROP-SEO-001|Evidence-supported SEO and GEO advice|Each proposed improvement identifies the affected platform, observed problem and bounded verification step, citing applicable official guidance or explicitly labeling a supported inference or hypothesis without authorizing customer-site changes.|report|T05,T37|D03|INV-004,RES-007
PROP-DATA-001|Collection rights and evidence portability|Before accepting a collection route, verify the exact service and permitted collection, commercial reporting, retention, export, sensitive-data and cost boundaries; an unmet mandatory right or evidence field blocks acceptance or requires an explicitly narrowed offer.|evidence|T37|D03,D04|MEA-006,EVD-006
PROP-BIZ-001|Paid lifecycle matched to the offer|Before charging for the selected offer, define payment, collection, review, release, delivery, failure/refund, cancellation and renewal-entitlement states separately, preserving monthly owner release and the unresolved one-time policy.|offer|T01,T02,T06,T38|D01,D02|AUD-002
PROP-GOV-001|Team review and decision trace|For each proposed requirement rewrite and priority, retain actual reviewer coverage, rationale, dissent and resolution, labeling absent specialist or independent review explicitly and keeping scope approval distinct from review recommendations.|control|T39|—|—
'''

# Shared profiles keep the register readable; every requirement explicitly names a profile.
# Direct/supporting/tension/unknown/not relevant describe expected contribution, never measured performance.
PROFILES = {
 'offer': ['supporting: consistent scope reduces confusion','direct: defines paid and recurring value','supporting: bounded offer can be reused','unknown: automation depends on chosen delivery scope','not relevant: this decision does not select AI behavior','unknown: buyer preference has not been observed','supporting: informed price and scope decisions'],
 'measure': ['supporting: understandable states reduce interpretation effort','supporting: comparable credible evidence can support continued value','direct: pinned methods enable comparable execution','supporting: deterministic contracts permit routine checks','supporting: trustworthy inputs constrain later interpretation','unknown: measurement rigor is not proven competitive advantage','supporting: visible uncertainty reduces misleading interpretation'],
 'evidence': ['supporting: evidence access reduces manual reconciliation','supporting: traceability supports trust across cycles','direct: retained inputs enable reconstruction','direct: structured receipts permit routine validation','supporting: provenance supports grounded analysis','unknown: differentiation requires an actual comparison','supporting: inspectable claims support informed action'],
 'report': ['direct: readable findings and optional detail support comprehension','supporting: useful actions may support renewal','supporting: a consistent report contract can be reused','supporting: structured outputs can be assembled automatically','supporting: constrained interpretation can prioritize actions','unknown: report preference needs customer evidence','direct: plain language and explicit limits support informed action'],
 'operations': ['direct: visible failures and targeted recovery reduce owner work','supporting: fewer avoidable failures support sustainable delivery','direct: common recovery and state contracts apply across customers','direct: bounded execution reduces routine intervention','not relevant: reliable execution does not require AI judgment','unknown: reliability advantage has not been measured','supporting: clear responsibilities and exception states reduce uncertainty'],
 'access': ['material tension: access controls add steps; minimize duplicate authentication','supporting: private delivery is necessary to serve paying customers','direct: one permission contract works across tenants','supporting: automated enforcement reduces manual checking','not relevant: authorization must not depend on generated judgment','not relevant: basic access control is not a leadership claim','supporting: visible scope and control support trust'],
 'consent': ['material tension: essential consent and privacy controls take effort','supporting: clear terms support a sustainable customer relationship','supporting: versioned terms reduce bespoke handling','supporting: expiry and revocation can be checked routinely','not relevant: consent authority must not be inferred by AI','not relevant: required privacy handling is not competitive proof','direct: comprehension and revocable authority support informed choice'],
 'security': ['material tension: protective controls can add friction or block an action','supporting: prevents unauthorized or unsafe service operation','supporting: reusable boundaries apply across integrations','direct: enforced permissions reduce reliance on manual policing','supporting: constrains untrusted content and generated actions','not relevant: basic security is not a proven differentiator','supporting: clear safe failure supports user control'],
 'control': ['material tension: required owner decisions consume review effort','supporting: trustworthy release preserves the customer relationship','supporting: explicit authority rules are reusable','material tension: automation stops at the required human boundary','supporting: AI can prepare material but cannot grant authority','not relevant: approval controls alone do not establish leadership','direct: informed consequential actions preserve agency'],
 'experience': ['direct: owner and client task completion is the intended outcome','supporting: usefulness and low friction may support renewal','supporting: common accessible interaction patterns are reusable','supporting: clarity reduces avoidable rescue and repeated entry','not relevant: a usable interface does not itself require AI','unknown: preferred experience requires comparison with alternatives','direct: comprehension and accessible control support useful action'],
 'recurring': ['supporting: predictable cycles and exceptions reduce coordination effort','direct: provides continuing evidence and follow-through','direct: stable cycle contracts support repeated delivery','direct: routine work advances to the agreed release boundary','supporting: grounded interpretation can explain changes','unknown: repeated execution is not proof of market leadership','supporting: meaningful updates support informed renewal'],
 'intelligence': ['unknown: benefit depends on usefulness and review effort','supporting: useful interpretation may support continuing value','supporting: versioned evaluation and output contracts are reusable','supporting: constrained drafting can reduce preparation work','direct: tests interpretation against a simpler credible baseline','unknown: superiority requires calibrated comparative evidence','supporting: transparent uncertainty supports informed action'],
 'leadership': ['supporting: comparisons focus on actual buyer and owner experience','supporting: useful differentiation may support a sustainable offer','supporting: a repeatable comparison method supports future decisions','not relevant: competitor analysis does not automate product delivery','not relevant: novelty or AI presence is not proof of superiority','direct: requires evidence before an advantage claim','supporting: compares informed buyer usefulness rather than persuasion alone'],
 'behavior': ['direct: observes barriers for owner and client separately','supporting: informed usefulness may support renewal','supporting: consistent observation scripts permit repeated learning','unknown: the useful intervention may be manual or automated','not relevant: behavioral benefit need not depend on AI','unknown: improved experience requires comparative evidence','direct: explicit mechanisms and unintended effects make the hypothesis testable'],
}
FRICTION = {
 'offer': ('Avoid bespoke quoting and repeatedly resolving scope.', 'Make price, scope and next step clear without repeated intake.'),
 'measure': ('Avoid reconciling incompatible sources manually.', 'Explain what was measured without requiring provider expertise.'),
 'evidence': ('Resolve a finding to its source without manual file hunting.', 'Offer optional proof without overwhelming the main finding.'),
 'report': ('Review material claims and exceptions without rereading every raw answer.', 'Understand the main limitation and next action before exploring detail.'),
 'operations': ('Show only actionable exceptions and safe recovery controls.', 'Show honest progress without requiring support requests.'),
 'access': ('Use the least necessary administrative steps without bypassing authority.', 'Use the selected private access flow without unnecessary account steps.'),
 'consent': ('Reuse valid authority; surface only required reconfirmation.', 'Request essential information once and explain withdrawal consequences.'),
 'security': ('Show a specific safe failure and permitted recovery path.', 'Avoid exposing technical or secret details while explaining blocked work.'),
 'control': ('Concentrate necessary review into a clear, evidence-backed decision.', 'Expose the actual delivery state and preserve informed control.'),
 'experience': ('Measure owner effort, errors and assistance separately.', 'Measure client effort, comprehension and accessibility separately.'),
 'recurring': ('Avoid manual cycle initiation and duplicate exception handling.', 'Provide useful updates without repeated intake or unexplained gaps.'),
 'intelligence': ('Count verification and correction effort, not just drafting speed.', 'Present supported conclusions and uncertainty in understandable language.'),
 'leadership': ('Use decision-relevant comparisons without continuous research overhead.', 'Make the service difference observable instead of relying on superiority claims.'),
 'behavior': ('Record work barriers without inventing motivation or adding needless surveys.', 'Preserve informed choice and observe confusion, regret and follow-through.'),
}

SPECIAL = {
 'INV-001': ('unresolved', 'September buyer decision remains open; the August ICP cannot be restated as a settled launch decision.'),
 'INV-002': ('unresolved', 'September first-sale journey conflicts with the August no-checkout invariant. The rewrite preserves that conflict and does not approve billing implementation.'),
 'INV-003': ('clarify', 'Current ChatGPT-first understanding and broader multi-platform ambition supersede silent Perplexity-only narrowing; exact qualified coverage remains open.'),
 'MEA-001': ('unresolved', 'No current approved panel specification establishes the historical 10–15 prompts as the correct new gate.'),
 'MEA-007': ('unresolved', 'The earlier repetition floor is retained in provenance while current sample/method qualification remains open.'),
 'NFR-009': ('clarify', 'V5 decisions explicitly accept deterministic measurement reproduction and retrieval of stored generated prose.'),
 'OPS-001': ('clarify', 'Keep this outcome ID linked to ADM-006 rather than silently ratifying the proposed V5 merge.'),
 'OPS-004': ('clarify', 'Keep cancellation acceptance independently visible; ADM-007 is its operator control, not deletion of this requirement.'),
 'ADM-001': ('unresolved', 'Current roadmap permits a simpler private delivery mechanism; historical full-portal scope needs explicit release scoping.'),
 'ADM-004': ('unresolved', 'No impersonation retained; the historical support-console deferral and grant durations remain proposals.'),
 'ADM-011': ('clarify', 'Owner release is required for monthly briefs; one-time audit policy is unresolved, not automatically inherited.'),
 'ADM-012': ('unresolved', 'Access control remains necessary; a dedicated UI versus selected provider administration remains a release choice.'),
 'ADM-014': ('unresolved', 'Incident safety retained; a separate incident workspace is not assumed necessary before first delivery.'),
 'ADM-016': ('clarify', 'Retain WCAG target and verifiable cases; do not reinstate the rejected historical design source or claim full conformance from browser checks.'),
 'ADM-017': ('clarify', 'Current accepted design direction overrides August Linear-inspired authority. No appearance changes are implemented.'),
 'SVC-002': ('clarify', 'End-to-end automation stops before required owner release.'),
 'SVC-003': ('clarify', 'Insufficient evidence cannot be mislabeled no meaningful change.'),
 'SVC-005': ('clarify', 'Healthy preparation still generates a required approval item, resolving the zero-queue contradiction.'),
 'SVC-008': ('unresolved', 'Three role boundaries are retained; recurring AI adoption and the historical single-generation-model restriction need evaluation, not automatic ratification.'),
}

requirements = []
LIVE_SHEET = json.loads(SOURCES['SHEET'].read_text())
LIVE_REVIEW = {r[0]: {'sheet_row':i+1, 'proposed_requirement':r[8], 'proposed_acceptance':r[9], 'decision':r[12], 'review_note':r[20] if len(r)>20 else None} for i,r in enumerate(LIVE_SHEET['sheets']['Evidence and MVP Review']) if r and re.fullmatch(r'MLX3-[A-Z]+-\d{3}',str(r[0]))}
LIVE_PROPOSALS = {r[0]: {'sheet_row':i+1,'title':r[1],'original':r[7],'original_acceptance':r[8],'boundary':r[11],'prior_review':r[12]} for i,r in enumerate(LIVE_SHEET['sheets']['Proposed additions']) if r and str(r[0]).startswith('PROP-')}
assert len(LIVE_REVIEW)==86 and len(LIVE_PROPOSALS)==6
WORDING_REFINEMENTS = {
 'INV-003': 'Each accepted collection run uses the specifically qualified surface and labels its provider, method and available context; model-API benchmarks never stand in for consumer ChatGPT observations, and additional platforms require an explicit scope decision with separate reporting.',
 'AUD-001': 'An authorized operator can create an engagement tied to one organization, authorized property, responsible contact, accepted offer version and permitted recipients; an approved recurring engagement also records cadence, time zone, start and active/paused/cancelled state.',
 'AUD-009': 'The recipient can reach current privacy, retention, support and revocation information from the delivered report, and an approved recurring offer exposes its pause/cancellation route and effect on future work and retained reports.',
 'EVD-003': 'The audit retains every scoped page with its collection outcome and reason; script dependence is a characteristic and becomes a limitation only when the selected collector cannot obtain the required content.',
 'MEA-003': 'The versioned panel taxonomy identifies discovery/problem, comparison, trust/method and direct-brand intent separately from brand anchoring, recording ambiguous classifications for review before execution.',
 'MEA-009': 'Permitted provider-returned citations and retrieval/source sets are retained with their origin and type, distinguishing cited, retrieved-but-unused, empty, unsupported and uncollected data without implying an unavailable retrieval set was observed.',
 'MEA-014': 'A material change to panel, collection surface/context, engine or exposed model, classifier, formula or threshold creates a visible boundary; unobserved relevant context changes make comparability unknown, and an unapproved bridge cannot authorize a change claim.',
 'MEA-015': 'A recurring report evaluates change only for comparable, sufficiently supported observations and distinguishes no supported change from insufficient evidence; a first pilot may omit movement, and a difference alone never establishes causal lift.',
 'RES-005': 'Fictional and synthetic observations remain distinguishable in storage and are labeled directly on each affected visualization, table and export, and cannot enter actual customer measurement calculations.',
 'NFR-006': 'The service stores only data needed for the approved purpose and applies selected retention and deletion rules across raw evidence, receipts, reports, contacts and backups, recording deletions and resulting reproduction limits.',
 'NFR-007': 'Shipped customer and operator-critical flows satisfy applicable WCAG 2.2 Level A and AA acceptance criteria, with failures resolved and manual/automated evidence retained; any explicitly agreed scope exception is disclosed without a full conformance claim.',
 'SVC-001': 'An active recurring engagement has approved cadence, time zone and resource/entitlement rules; each scheduled opportunity creates at most one cycle with planned and actual time, while paused, cancelled or ineligible engagements create no collection work.',
 'SVC-007': 'Missed, failed, cancelled and partial cycles remain visible with actual times and reasons; separately authorized service-status notices do not expose unapproved report content, and recovery never fabricates an on-time observation.',
}
DEPENDENCY_CORRECTIONS = {
    'MEA-001': [],
    'MEA-004': ['MLX3-MEA-003'],
    'MEA-013': [],
    'MEA-014': ['MLX3-MEA-005'],
    'RES-007': ['MLX3-INV-007'],
    'OPS-004': ['MLX3-OPS-002'],
    'NFR-007': [],
    'NFR-009': ['MLX3-MEA-010'],
}
for raw in ROWS.strip().splitlines():
    short, behavior, profile, cases, decisions, deps = raw.split('|')
    rid = 'MLX3-' + short
    behavior = WORDING_REFINEMENTS.get(short, behavior)
    source = originals[rid]
    disposition, rationale = SPECIAL.get(short, ('clarify', 'Make the source outcome observable and connect it to the current rubric and case definitions; no new implementation is authorized.'))
    dependencies = DEPENDENCY_CORRECTIONS.get(short, [] if deps=='—' else ['MLX3-'+d if not d.startswith('PROP-') else d for d in deps.split(',')])
    requirements.append(dict(id=rid, title=source['title'], requirement=behavior, profile=profile, tests=cases.split(','), decisions=[] if decisions=='—' else decisions.split(','), dependencies=dependencies, disposition=disposition, rationale=rationale, authority=('V5 section 4; scope direction accepted, detailed wording reviewed alongside later decisions' if short.startswith('SVC-') else 'V4 working baseline; reconcile with later accepted decisions'), source=source, prior_sheet_review=LIVE_REVIEW[rid], status='Review draft; not an acceptance of implementation or disputed scope'))

for raw in PROPOSALS.strip().splitlines():
    rid, title, behavior, profile, cases, decisions, deps = raw.split('|')
    existing=LIVE_PROPOSALS.get(rid)
    requirements.append(dict(id=rid,title=title,requirement=behavior,profile=profile,tests=cases.split(','),decisions=[] if decisions=='—' else decisions.split(','),dependencies=[] if deps=='—' else ['MLX3-'+d if not d.startswith('PROP-') else d for d in deps.split(',')],disposition='proposed addition',rationale=('Existing provisional ID preserved and clarified against the seven-tenet rubric; not a new scope approval.' if existing else 'Operationalizes an accepted tenet; this exact requirement is a new proposal, not approved product scope.'),authority=('Live Sheet Proposed additions; supplemented by TENETS, METRICS and METHOD' if existing else 'TENETS, METRICS and METHOD; proposed requirement formulation'),source=None,prior_proposal=existing,status='Proposal; not implementation authorization'))

manifest = {key:dict(path=str(path),sha256=hashlib.sha256(path.read_bytes()).hexdigest(),bytes=path.stat().st_size) for key,path in SOURCES.items()}
for r in requirements:
    r['review_coverage'] = {'reviewer':'Codex coordinator, same agent', 'scope':'wording, provenance, rubric mapping and case/dependency consistency', 'independent_specialist_review':'NOT RUN for this revised wording', 'owner_scope_approval':'not inferred from rewrite request'}
payload = dict(version='review-2026-09-18.1',date_eastern='2026-09-18',source_manifest=manifest,requirements=requirements,rubric_profiles=PROFILES,friction=FRICTION)
(OUT/'requirements.json').write_text(json.dumps(payload,indent=2,ensure_ascii=False)+'\n')

intro = '''# MindLeverX requirements — rubric review draft

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
'''
parts=[intro]
cross=['# Source-to-revision crosswalk\n\nSource rows and exact original wording are retained in requirements.json. All 86 source IDs are represented once below. The two AUD numbering gaps predate this review. V5 suggested merges of OPS-001 and OPS-004 are not silently accepted.\n\n| Original ID | Disposition | Revised ID | Why |\n|---|---|---|---|']
for r in requirements:
    short=r['id'].replace('MLX3-','')
    owner,client=FRICTION[r['profile']]
    parts.append('\n### '+r['id']+' — '+r['title']+'\n\n'+r['requirement']+'\n\n'
      +'**Disposition:** '+r['disposition']+'. '+r['rationale']+'\n\n'
      +'**Authority:** '+r['authority']+'. **Status:** '+r['status']+'.\n\n'
      +'**Rubric:** ['+r['profile']+'](rubric-profiles.md#'+r['profile']+'). **Owner friction:** '+owner+' **Client friction:** '+client+'\n\n'
      +'**Depends on:** '+(', '.join(r['dependencies']) or 'No requirement prerequisite')+'. **Unresolved decisions:** '+(', '.join(r['decisions']) or 'None recorded for this formulation')+'.\n\n'
      +'**Acceptance cases:** '+', '.join('['+t+'](acceptance-tests.md#'+t.lower()+')' for t in r['tests'])+'. Product execution: **NOT RUN**.\n')
    if r['source']:
        cross.append('| '+r['id']+' | '+r['disposition']+' | '+r['id']+' | '+r['rationale']+' |')
(OUT/'revised-requirements.md').write_text('\n'.join(parts))
cross.append('\n## Provisional ID continuity\n\n'+ '\n'.join('- '+r['id']+': '+r['title']+(' — existing live-Sheet proposal preserved and clarified.' if r.get('prior_proposal') else ' — new proposal only.') for r in requirements if not r['source']))
cross.append('''
## Non-ID authority text reconciliation

| Original section | Disposition and replacement interpretation |
|---|---|
| V4 status/purpose/source header | Preserve as historical working draft. This package is a September review copy, not a retroactive approval of V4/V5. |
| V4 §1 Product and §3 objective | Reconcile buyer and single-engine claims with D01/D03. Retain evidence-backed private paid delivery as the intended outcome. |
| V4 §2 Builder/engine distinction | Preserve independent builder, measured surface and generation roles; Codex is the current working environment. Do not turn a builder name into a product requirement. |
| V4 §4 Included scope | Retain outcomes by ID. Panel counts, attempt floor and full portal inventory remain explicit scoped decisions; no unnoticed promotion into launch gates. |
| V4 §4 Excluded scope | Preserve prohibitions on unsupported composites, causal guarantees, unauthorized outreach/site changes and speculative enterprise expansion. Reconcile historical checkout ban with the later proposed first-sale journey. Recurring measurement is allowed; self-serve subscription design remains unresolved. |
| V4 §5 Flow | Current proposed first-sale flow is essential intake/authority, verified payment, evidence, preparation, review policy, private delivery, then recurring value. An operator-provisioned pilot is a simpler alternative, not an imposed package. |
| V4 §7 Objects | Preserve required domain concepts; exact schema follows an accepted slice. The historical ban on checkout/subscription objects cannot decide today's commercial design. Do not create those objects in this documentation task. |
| V4 §8 Builder contract | Retain stable IDs, evidence, version separation and permission boundaries. Historical builder choice and universal implementation hold do not override later authorized local work. |
| V4 §9 Decisions | Reconciled into D01–D10; monthly release approval is settled, while one-off policy is not. Do not re-ask provider signup or Vercel upgrade timing. |
| V4 §10 Done | Product done requires supported real evidence, approved service workflow, tested access/recovery and accepted report. Rewrite tests do not establish launch readiness; remove stale no-checkout and full-module assumptions from any claimed current done state. |
| V4 §11 Removed process | Keep internal process outside product UX. This review package is a build artifact; it does not add customer-facing ceremony. |
| V5 accepted reproducibility decision | Preserve deterministic measurement and stored-prose retrieval; generative interpretation is separate. |
| V5 share-of-voice and sentiment decisions | Retain approved directions in D10: disclosed competitor set and qualified uncertainty; verbatim quote evidence with numeric sentiment deferred. Source IDs were not supplied for share of voice, so flag the gap rather than invent accepted IDs. |
| V5 design and role recommendations | Later rejection of Linear-style design prevails. Historical MFA durations, role matrix, support duration and retention periods are recommendations, not current approved values. |
| V5 service scope and healthy queue | Preserve recurring comparison direction and SVC IDs. Required owner release creates an actionable item even for a healthy cycle. Insufficient evidence is not no change. |
| Historical reconciliation work order | Reference only; proposals for public composite scorecards, growth widgets, forced trailing-three-run displays and unsupported advantage claims do not become scope. |

## Live Sheet reconciliation

The current Google Sheet was read through a browser XLSX export after native connector discovery found no Drive/Sheets reader. Requirements has 78 original rows; Evidence and MVP Review has 86 reviewed IDs; Proposed additions has six provisional IDs. All are retained. Prior proposed wording, acceptance, decisions and review notes are preserved per ID in requirements.json and in live-sheet-snapshot.json. Relevant strengths from the earlier review were retained: JavaScript dependence is not inherently failure, backup retention remains in scope, cancellation and entitlement are explicit, anchoring differs from question intent, and unknown comparability is not an approved comparison. The prior suggested OPS merges remain proposals; this draft keeps both trace IDs with linked operator implementations.

The Owner decisions sheet still asks whether monthly release should be automatic and names Perplexity Sonar as the initial channel; later local accepted decisions supersede those stale questions. The live overview/old review's 55-test and unresolved-access statements predate the verified Otterly export and 68-test local frontend checkpoint. No Sheet or Linear values were changed; synchronization is pending. Fresh source checking is required immediately before any eventual write.
''')
(OUT/'source-crosswalk.md').write_text('\n'.join(cross)+'\n')
rubric=['# Seven-tenet contribution profiles\n\nThese are qualitative review judgments for the proposed behavior, not measurements or benchmarks. Direct contribution does not mean implemented. Every requirement names a profile and separately records owner/client friction and material authority conflicts. Unknown means evidence is missing; not relevant means the decision does not materially affect that tenet. No weighting or composite score.\n']
for name,vals in PROFILES.items():
    rubric.append('## '+name+'\n\n| Tenet | Assessment and reason |\n|---|---|')
    for tenet,val in zip(['TEN-UX','TEN-REV','TEN-REP','TEN-AUTO','TEN-AI','TEN-LEAD','TEN-BEH'],vals):
        rubric.append('| '+tenet+' | '+val+' |')
    rubric.append('')
(OUT/'rubric-profiles.md').write_text('\n'.join(rubric)+'\n')
print(json.dumps({'source_requirements':86,'v4':78,'v5_service':8,'existing_proposals':6,'new_proposals':5,'total':len(requirements)}))
