# Otterly qualification — decision card

19 September 2026 · MIN-12 · Evidence review complete; full collection qualification BLOCKED

## What we accomplished

Read the current linked terms, reconciled provider documentation with the saved export, and reduced the open work to explicit questions. The existing saved-data frontend/PDF remains useful for local engineering review. This does not accept a new collection route or a customer audit.

| Intended use | Decision | Reason |
| --- | --- | --- |
| Inspect the existing saved export and test local presentation | Continue within the existing internal scope | Actual exported bytes and answer fields are available; retain the sample limitations. |
| Describe these records as Otterly-provided observations | Supported with qualification | The engine is a vendor label; exact model/session and execution time remain unknown. |
| Describe this as a representative visibility baseline or our own controlled ChatGPT experiment | Unsupported | One selected question, incomplete execution context and no full attempt ledger. |
| Publish a customer report containing full answer reproductions | Not qualified | Exact downstream reuse and post-subscription retention boundaries remain unresolved. |
| Start a new accepted collection run | BLOCKED | Source-access basis, required execution evidence and current included allowance still need resolution. |

**Next executable work:** draft the AI-assisted question coverage map under MIN-13. Drafting is already allowed alongside qualification; final freeze and collection remain dependent on its resolution. Use evidence-backed buyer intents, group overlap, and identify gaps before selecting a count. Competitor prompt counts are references, not targets.

## Four-step chunk and traceability

| Step | Done condition | Actual result |
| --- | --- | --- |
| 1. Check current source documents | Versioned sources and relevant provisions recorded | Complete below |
| 2. Audit saved export fields | Fixed input verified; present and missing fields explicitly mapped | Complete; machine evidence linked below |
| 3. Write decision card | Every intended use has a supported disposition and precise next evidence | Complete; qualification remains blocked |
| 4. Update Linear and show result | Read back the updated MIN-12 card and open it | Recorded in Linear at handoff |

Estimate given before execution: 20–30 minutes. One coordinator; no specialist agents or independent reviewer. Model recommendation: GPT-6 Astra for this mixed research/technical task, based on [OpenAI's model page](https://developers.openai.com/api/docs/models/gpt-6-astra), checked today; reasoning-effort settings and app model were not changed. Project Next guided dependency selection; OpenAI Docs guided model research; the installed Linear connector supplied tracker access. These are assistant capabilities, not implemented MindLeverX AI features.

Current requirement narratives are **review drafts**, preserved in the [revised register](requirements-rubric-review/revised-requirements.md):

**MLX3-INV-003:** Each accepted collection run uses the specifically qualified surface and labels its provider, method and available context; model-API benchmarks never stand in for consumer ChatGPT observations, and additional platforms require an explicit scope decision with separate reporting.

**MLX3-NFR-006:** The service stores only data needed for the approved purpose and applies selected retention and deletion rules across raw evidence, receipts, reports, contacts and backups, recording deletions and resulting reproduction limits.

**PROP-DATA-001:** Before accepting a collection route, verify the exact service and permitted collection, commercial reporting, retention, export, sensitive-data and cost boundaries; an unmet mandatory right or evidence field blocks acceptance or requires an explicitly narrowed offer.

Pillars: owner UX is one decision and a short exception list; client UX is honest context. Repeatability benefits from fixed input identity. Automation can verify fields; AI intelligence helps interpret evidence and expose gaps. Buyer psychology favors understandable limitations. Revenue and competitive benefit remain unmeasured; additional process has an owner-effort cost, so stop repeating broad research and resolve the named questions.

## Source findings

All URLs below were opened on 19 September 2026. Provider statements are not independent operational verification. This is a project qualification review, not a legal determination of upstream permission.

| Source / version | Finding and limit |
| --- | --- |
| [Terms landing page](https://otterly.ai/terms), latest April 2026; [linked agreement](https://otterly.ai/Terms-OtterlyAI-2026-04.pdf), effective 24 April 2026 | Sections 6.3, 7.2 and 13.7 address post-termination download, customer rights and customer-data definition. Section 6.3 specifies a 30-day download window. Sections 8.3 and 9.1 provide general warranties and qualified indemnity; they do not identify engine-specific permissions. Section 11 assigns third-party compliance responsibilities. Section 5.1 allows excess-usage charges. These provisions do not clearly settle our exact full-answer redistribution use. |
| [Collection method](https://help.otterly.ai/how-otterlyai-collects-data), 17 July 2026 | Describes programmatic consumer-web collection, with a Claude API exception, daily monitoring and regional/session variation. Use a vendor-observation label; do not adopt its general customer-experience equivalence claim. |
| [Exports](https://help.otterly.ai/can-i-export-my-data-and-reports), 18 August 2026 | Documents raw CSV/JSON and PDF exports. The saved JSON demonstrates technical export; that alone does not settle all downstream rights. |
| [Client reporting](https://help.otterly.ai/generate-reports), 5 August 2026 | Documents agency/client reporting and white-label dashboards. This supports intended client-reporting use in principle, not an unrestricted license for every raw-answer publication. |
| [Cancellation](https://help.otterly.ai/cancel-subscription), 17 July 2026 | Says historical data will be deleted following cancellation. Reconcile actual trial/cancellation access with the agreement before relying on a later download. |
| [Security](https://otterly.ai/security), no version date observed | Backup text mentions both 30-day storage and removal of previous backups after 90 days. Exact deletion lifecycle is unclear. Do not promise immediate comprehensive deletion. |
| [Privacy](https://otterly.ai/privacy), no version date observed | Section 16 describes purpose/statutory-based personal-data retention. It does not resolve a concrete raw-monitoring-answer retention period. Customer-sensitive-data processing is outside this internal public-business sample. |

The initial guessed `/terms-of-service` and `/privacy-policy` paths were inaccessible; the actual linked `/terms` and `/privacy` pages above resolved. The older August 2025 terms found in search were not used as the current agreement. Account-specific agreements were not available for comparison.

## Export field map

Input: `artifacts/unattended-work/evidence/2026-09-17-otterly/raw-answers.json`. SHA256: `dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58`; 67,622 bytes.

| Evidence need | Actual source | Result |
| --- | --- | --- |
| Exact question and answer | `prompt`, `response_text` | Present/nonempty in all 16 rows; one distinct question |
| Platform label | `engine` | Four each: chatgpt, perplexity, google, copilot; Google subtype unknown |
| Observation identifier | `response_id` | Four distinct values; 12 repeats. Engine + timestamp + response ID is unique within this file, not a provider-wide uniqueness guarantee |
| Source identity | File hash plus row number | Reproducible local references; original IDs preserved |
| Vendor date | `timestamp` | Four dates, 14–17 September, all noon UTC; not verified execution times |
| Citations | `citations` | 111 entries / 51 distinct URLs; links retained, external claims not verified |
| Locale / retrieval context | Separate `manifest.json` | US from prior UI observation; locale absent from raw rows |
| Full attempt outcomes | No source field | Unknown: cannot reconcile failed, refused, cancelled, or absent attempts |
| Exact model, account/session context | No source fields | Unknown; do not infer |
| Panel ID/version and approved sampling design | No source fields | This single saved question is not the frozen pilot panel |
| Competitor annotations | `competitors_mentioned` | Empty arrays despite agency names in text; unsuitable as an authoritative absence signal |
| Sentiment, ads, shopping, fan-out | Corresponding fields all null | Not measured/unknown; not zero |

## Executable verification and actual result

**QUAL-01**, inherited from MIN-12: all mandatory constraints must be resolved for the intended collection/reporting use. **Actual result: BLOCKED** for full qualification, by the unresolved rights/source-access and attempt-context items above. The investigation deliverable is complete; the gate is not passed.

**QUAL-FIELDS-01**, independent local check (not a product-system test):

1. Run `python3 scripts/check-qualification-export.py` from the repository root using the exact input above. A missing file or mismatched hash produces BLOCKED.
2. Expect 16 rows, one question, four rows per engine, 16 nonempty answers, four distinct source IDs, and 16 distinct engine/time/ID composites. A mismatch after input identity passes is FAIL.
3. Expect 111 citation entries, 51 unique URLs, and no model/session/country/status fields in raw rows. Confirm the manifest separately carries UI country. Missing context stays unknown.
4. Read `field-audit.json`; PASS means only that this field map matches the fixed export. It does not qualify collection or commercial reuse.

Actual audit: **PASS**, all asserted field expectations matched. Evidence: [field-audit.json](../artifacts/unattended-work/evidence/2026-09-19-qualification/field-audit.json). Cleanup: original input untouched; no provider calls, account changes or collection performed. No product tests needed for this documentation/evidence-check chunk.

## Exact remaining questions — prepared, not sent

For Otterly support, subject: **Clarify raw-response reuse and collection metadata for an internal pilot**

1. Under our account's applicable terms, may we retain exported raw answers after trial/subscription end and reproduce them in private paid client PDF reports? Please identify conditions and the controlling provision.
2. What contractual/source-access basis covers your ChatGPT consumer-web collection and our downstream use of its results?
3. Can an export/API provide actual execution time, exact surface/model when known, locale/session context, and every attempted execution including failures? Which fields are unavailable?
4. How do trial expiry/cancellation affect download access, and what are the active-data and backup deletion timeframes?

Sending this inquiry requires the owner's explicit instruction to contact the vendor. It has not been sent. Current account allowance must be read immediately before any proposed collection; the 17 September trial snapshot is historical, not today's balance. The current task incurs no additional provider collection usage.
