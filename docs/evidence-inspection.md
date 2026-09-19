# Local export inspection — 18 September 2026

Owner authorization: update the thinking-partner skill, review the roadmap and begin coding. This bounded slice supports MIN-5 qualification. It does not qualify a provider, accept MIN-6, generate a customer report or complete MIN-7.

## Current implementation and verification

Implemented locally in isolated checkout `/Users/tag/Documents/ChatGPT/MindLeverX evidence-inspection`, branch `codex/evidence-inspection-2026-09-18`, based on verified approved implementation `9a3ad43b5c3df68df866300cd5af1059f604e9e9`. Run commands below from that checkout, not the original checkout. Current owner guidance was copied into it without disturbing original changes. No merge, push or deployment.

Actual verification, 18 September 2026, Node v26.7.0: 10 inspection tests passed; full `npm run check` passed (65 tests plus site/platform build checks). TC-INS-10 also passed against the saved real export: 0/16 literal matches; all 16 rows retained; 12 repeated-ID warnings across engines; original bytes/hash unchanged. JSON at `/Users/tag/Documents/ChatGPT/MindLeverX Build/artifacts/unattended-work/evidence/2026-09-18-test-case/otterly-inspection-v1.json`. No live collection or customer report tested. Node 24 compatibility is declared by the existing project but was not separately executed in this run.

Reviewer: coordinator self-review plus automated tests and comparison with prior independent saved-data arithmetic. No separate specialist or human customer review claimed. Skill v1.1 passed structural validation; applying the method in this slice is not proof of future automatic adherence.

## Requirement LOC-EVD-001 (local slice ID, not a spreadsheet requirement ID)

An operator can inspect a saved Otterly-format JSON export for literal brand mentions with a reusable local command. The result preserves the source fingerprint, per-row attribution and missing-data findings. Invalid or duplicate observations block the aggregate rather than appearing as absent mentions. Qualification and release always remain unaccepted.

Why now: the same check was manually reconstructed twice. A local, tested command removes that repeated work and makes the next export inspectable. It advances repeatability and automation; it supports owner UX and evidence credibility. Revenue is an indirect contribution. AI judgment is unnecessary for literal counting; customer UX and behavioral outcomes are not tested here. It does not establish competitive superiority.

## Contract frozen before coding

- Command: `node scripts/inspect-evidence.mjs --input <export.json> --brand <literal-name> --output <new-result.json> [--expected-sha256 <64-hex-digits>]`. Existing output parent required. No dependencies, network, provider calls or writes to the input.
- A nonempty top-level array is required. Each row needs nonempty `response_text`, `prompt` and `engine`. Missing response ID or vendor timestamp is a warning, not fabricated metadata. No inference of consumer-web versus model-API collection from engine names.
- Match a literal substring in answer text only, ignoring capitalization with JavaScript `toLowerCase`. Count each answer once; do not search questions, citations or vendor flags. No alias, word-boundary, semantic, sentiment or citation measurement. Keep platform labels verbatim. The denominator is exported records, not all attempts or unique buyers.
- Preserve every row in input order. If engine, prompt, timestamp and response ID all repeat, block the aggregate as an ambiguous duplicate; do not deduplicate silently. Repeated IDs across different engines are retained with a warning.
- Hash mismatch, unreadable/invalid JSON, empty/non-array input or invalid required fields block inspection. Aggregate is null when blocked. It must never substitute a smaller denominator. Unknown attempt history, method, locale, timestamp precision and reporting rights remain limitations.
- JSON output: schema/method version, source SHA-256 and byte count, requested literal brand, inspection status (`complete` or `blocked`), record count, literal-match aggregate or null, row observations, issues and explicit limitations. No raw answer bodies. Inspection complete never means qualified or client-ready.
- CLI exit 0 = inspection complete, 2 = blocked data with diagnostic JSON, 1 = invocation/filesystem failure. Existing output or input-as-output must be refused without modification. New output private (0600 on POSIX); no approval/release action. Deterministic content for identical input/options; execution time and code version recorded separately in run evidence.

## Executable cases

Prerequisites: Node >=24; this checkout; temporary local directory for synthetic files. For every CLI case, create the stated JSON fixture, run the command above with brand `MindLeverX`, inspect JSON and exit code, compare source bytes before/after, and remove only the temporary directory. Automated cases use `node --test tests/evidence-inspection.test.mjs` and implement these actions directly. All synthetic fixtures are explicitly test material.

| Case | Input and numbered actions | Exact expected observation |
| --- | --- | --- |
| TC-INS-01 | 1. Save two valid synthetic records with different IDs. First answer `MiNdLeVeRx and MindLeverX`; second `Another agency`. 2. Inspect. | complete; numerator 1, denominator 2; row flags true/false. Two occurrences in one answer count once. |
| TC-INS-02 | 1. In the second row put the brand only in prompt/citations/vendor flag. 2. Set both answer bodies to `Another agency`. 3. Inspect. | complete; 0/2. Original strings and bytes unchanged. |
| TC-INS-03 | 1. From TC-INS-01 independently remove, empty, whitespace-fill or change one response_text to a number. 2. Inspect each variant. | blocked; aggregate null; issue identifies the affected row. Never 0/2 or 1/1. |
| TC-INS-04 | 1. Independently omit prompt or engine, supply a null row, empty array, object or malformed JSON. 2. Inspect each. | blocked with diagnostic issue; no aggregate. |
| TC-INS-05 | 1. Give two records the same response ID but different engines. 2. Inspect. 3. Repeat with the same ID, engine, timestamp and question. | First retains both rows plus repeated-ID warning. Second blocked with duplicate-observation issue and no aggregate. |
| TC-INS-06 | 1. Remove ID and timestamp from one otherwise valid row. 2. Inspect. | complete; per-row metadata null and named warnings. Collection qualification still required; missing context never invented. |
| TC-INS-07 | 1. Supply a deliberately wrong expected source hash. 2. Inspect. | blocked/hash-mismatch; aggregate null. With correct hash, complete and exact original byte count/hash. |
| TC-INS-08 | 1. Inspect through CLI into new file. 2. Parse JSON. 3. Run into a second new file and compare bytes. 4. Try existing output, input-as-output and a symlink to input. | Exit 0 and same output bytes for fresh destinations; existing destinations fail with exit 1 and remain byte-identical. No source mutation. |
| TC-INS-09 | 1. CLI-inspect a missing-answer fixture into a new file. 2. Inspect result/exit. 3. Try missing/duplicate/unknown flags and missing source. | Blocked fixture: diagnostic JSON and exit 2. Invocation/read failures: exit 1 without success output. |
| TC-INS-10 | 1. Inspect preserved real export at `artifacts/unattended-work/evidence/2026-09-17-otterly/raw-answers.json` in the original checkout with expected SHA-256 `dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58`. 2. Compare with independent TC-EVD-001. 3. Verify original hash again. | 67,622 bytes; 16 records; 0/16 literal matches; four rows each chatgpt/perplexity/google/copilot; source unchanged. Qualification remains required. This is real saved-data verification, not a new collection or report test. |

Expected arithmetic is hand-verifiable from the two synthetic sentences. TC-INS-10 uses the independently executed, fixed-source check as its reference. PASS means the expected product behavior occurred, including correct blocking; BLOCKED in tool output is not automatically a failed software test.

## Sources and release boundary

Official [Node filesystem](https://nodejs.org/api/fs.html), [crypto](https://nodejs.org/api/crypto.html), and [test runner](https://nodejs.org/api/test.html) documentation checked 18 September 2026 for read-only source handling, exclusive output creation, SHA-256 and test execution. Matching rules, schema and exit codes are our implementation choices. Saved vendor export is the observed input format, not a claim of a stable provider API contract. No hosting-plan change, public UI change, merge, push or deployment in this slice.
