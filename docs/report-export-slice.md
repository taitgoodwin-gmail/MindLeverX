# Portable retained-report export — MIN-7

19 September 2026. Local implementation chunk under the active full-MVP objective. The preceding report-review bridge is complete; this chunk adds an independently checkable export of one retained revision. It does not qualify collection, release a report, select a delivery provider or establish production tenant authentication.

## Outcome and decision

The owner can download one machine-readable file containing a revision's exact source, structured result, original PDF, scope/processing manifest and local review state at export time. An offline verifier can check integrity and reproduce the supported literal result without the running app, its database, the original input path, Python, or network access. The PDF remains the human-readable report.

Observed gap: `/report.json` is only the measurement projection. Scope, renderer identity and review association live elsewhere, and the complete owner revision currently depends on a temporary local SQLite database. Git backup excludes that database. This export provides a portable retained artifact; storing it in the same local directory is not an independent disaster-recovery backup.

Choice: a versioned JSON envelope with canonical Base64 byte fields and bounded parsing, using built-in Node APIs. A ZIP containing separate files is a credible alternative; it is friendlier for manual extraction but adds archive-handling work. The current requirement is machine-readable portability; keep the existing PDF download for reading. Revisit an archive if actual users need manual evidence-folder recovery. No dependency or compression is added.

Authority: existing local MVP implementation, frontend chunks and GitHub source-backup direction. Original vendor bytes stay private within the existing local operator boundary. The export is not sanitized for customer sharing. All operator-selected source fields are preserved to keep exact evidence identity; no claim of automatic secret detection or production access isolation is made. Provider rights and production retention remain unresolved.

## Requirement narratives and contribution

These formulations are **review drafts**, from [the reconciled register](requirements-rubric-review/revised-requirements.md), with partial local coverage only.

**MLX3-RES-006 — Reproducible Machine-Readable Export.** A private machine-readable report export includes the scope, result states, evidence references and pinned processing versions needed to reproduce supported values, without leaking secrets or another tenant's data.

Contribution: one specified revision and its linked local review, not the whole database; original byte hashes, versions and limits travel with it. No cookie, CSRF token, filesystem path, provider key or unrelated client row is added by the exporter. This local operator download does not satisfy production recipient/tenant or raw-source sanitization policy.

**MLX3-NFR-009 — Exact Result Reproducibility.** Pinned deterministic processing reproduces measurement values from retained evidence, and approved generated prose is reproduced by retrieving its stored version rather than regenerating it.

Contribution: retain exact source/result/PDF bytes and verify the existing literal-substring method independently of the live app. Never regenerate the PDF. Unknown processing versions return an explicit unsupported result, not a false pass. There is no generated prose in this slice.

**MLX3-EVD-004 — Untrusted Content Isolation.** Retrieved text is processed as untrusted evidence and cannot change tool permissions, release decisions, collection scope or system instructions.

Contribution: parse data with strict structure/size limits; never execute embedded text, visit citations, load a source-specified file or invoke a renderer. This is not a proof of every production tool permission.

Pillars: one export reduces expected owner file-reconciliation effort; exact artifacts support repeatability and automated verification. Client experience is unchanged. AI contributes implementation/review assistance, not product conclusions. Recurring revenue and competitive benefit remain unmeasured. Plain scope and integrity labels support informed decisions; actual comprehension has not been tested. These are proportionate contributions, not a seven-tenet score.

## Four-step plan

Estimate before implementation: 30–45 minutes. GPT-6 Astra remains adequate; no model/global change. One product-checkout writer, one read-only reviewer, coordinator on plan and independent verification.

1. **Freeze bounded contract and fixed cases — RES-006, NFR-009, EVD-004.** State byte identity, version handling and acceptance-versus-integrity boundaries.
2. **Build export and offline verification — all three.** Reuse verified stored bytes; reproduce the deterministic result; reject malformed, corrupt, mismatched or unsupported input.
3. **Connect download — RES-006.** Add a secondary evidence-export link beside the retained PDF with a clear local/private label and disclosure that it contains raw source and local review notes.
4. **Verify and persist — all three.** Run isolated API/CLI and original-source checks, inspect browser/download and public exclusions, update MIN-7 and verified GitHub backup.

## Frozen implementation contract

- `GET /api/report-revisions/:id/export.json` uses the existing session/origin boundary, integrity-checks the stored revision and exports only that revision plus its linked review. `Cache-Control: no-store`, JSON attachment with a safe revision-specific filename. Missing/corrupt revisions fail safely. No network, new report preparation, PDF rendering or current-source-file read occurs.
- JSON envelope schema `mlx-report-export-v1`. Exact snapshot JSON, source, report, PDF and an allowlisted review record use Base64 entries with byte length and SHA-256. Preserve the snapshot's original JSON bytes; parsing/re-serializing it must not silently change its hash. Review data is a snapshot of mutable local review state at export time and does not change the immutable content manifest.
- Review allowlist: linked review/client/revision IDs, local status, note, created/decided times and fixed local-operator limitation. Do not include unrelated activity, clients, contacts, session fields or local file paths. Preserve pending/approved/returned honestly; approval remains internal.
- `verifyReportExport(bytes, {expectedSnapshotSha256})` is a pure bounded verifier. Input size capped at 32 MiB, source at the existing 2 MiB limit, PDF at 8 MiB, report at 8 MiB, manifest/review metadata each at 64 KiB. Enforce exact known envelope/entry keys, canonical Base64, finite safe integer lengths, hashes, valid UTF-8 JSON, manifest/subject/processing identity, review linkage/status, supported schema/method and the retained internal/qualification/release boundary.
- Check that the decoded report equals the saved-results projection recomputed from source and the manifest's brand under the supported method. Reject self-consistent hash edits that change supported values. PDF verification establishes exact stored bytes and bounded PDF framing only; it does not independently establish rendering or semantic truth.
- An optional expected snapshot SHA pins immutable manifest/source/result/PDF content to a fingerprint recorded separately. It does not anchor the mutable review record or export time; the verifier must disclose that distinction even when an expected SHA matches. Without it, report internal integrity/reproduction while explicitly leaving origin unverified. Hashes cannot establish authenticity, trusted time, permission or an actual human's identity. Never use the review export as release authority.
- CLI `npm run report:verify -- --input <file> [--expected-snapshot <sha256>]`: no network, app, SQLite or Python needed. Output concise structured results without printing raw evidence or arbitrary input errors. Exit 0 on supported integrity/reproduction PASS, 1 on invalid/corrupt input, 2 on unsupported versions or unavailable input. `--help` documents the boundaries. No extraction, file overwrite, DB restore or release operation is added.

## Fixed executable checks

Prerequisites: Node runtime used by this checkout. Application cases use isolated temporary DBs; synthetic source has exactly two distinct answers, `MiNdLeVeRx. <script>do not execute</script>` and `Another service.`, same question, one literal mention out of two. Use a BOM variant and whitespace in source to prove original bytes remain unchanged. Synthetic PDF framing isolates format tests; a separate original-source check uses the previously rendered real PDF.

| Case | Numbered actions | Expected result |
| --- | --- | --- |
| EXPORT-01 — full portable revision | 1. Prepare synthetic revision A and an unrelated client/review. 2. Download A's export. 3. Decode byte entries and compare to stored/downloaded originals. 4. Verify offline with known snapshot SHA. | Exact source/result/PDF/manifest, matching scope/renderer/review IDs, 1/2 literal count. No unrelated client's data, environment values, cookies or local paths added. |
| EXPORT-02 — app-independent and review snapshot | 1. Save pending export. 2. Decide the synthetic local review and save another export. 3. Remove input and close app. 4. Run verifier CLI on both. | Both reproduce original content; only review snapshot/export time differ. Old export stays pending, new records local decision. Qualification required and release unavailable. No app/Python/network access needed. |
| EXPORT-03 — corrupt, malformed and oversized | 1. Alter each byte field separately. 2. Try bad/canonicality-breaking Base64, invalid UTF-8/JSON, missing/extra fields, invalid lengths, oversized envelope/entries and malformed linkage. 3. Alter report counts and recompute its hash/manifest to hide basic hash mismatch. | Invalid data fails without raw content/paths in errors. Recomputed comparison rejects a false result even if its hashes are self-consistent. No decoded content executes. |
| EXPORT-04 — supported-version and anchor boundary | 1. Try unknown envelope, snapshot/result schema, renderer/method version and invalid processing identity. 2. Supply a different expected snapshot SHA. 3. Verify intact export without external SHA. 4. Change a structurally valid review record and recompute its entry hash, keeping the same snapshot anchor. | Unsupported versions are explicit and do not PASS; mismatch fails. Unanchored PASS claims internal integrity/reproduction only and explicitly does not verify origin/authenticity or qualification. A matching snapshot SHA never authenticates the review/export time. |
| EXPORT-05 — API, CLI and browser regression | 1. Fetch without session/with foreign Origin/unknown revision/corrupt DB fixture. 2. Run CLI missing file/argument errors and a no-writer FIFO with a bounded timeout. 3. Open existing real pending review and trigger the export download. 4. Verify its 16 answers and 0/16 independently offline. 5. Run affected/application/public checks. | Safe denied/unavailable states; correct CLI exits without waiting on nonregular files; new link works beside PDF; existing review remains pending; private content stays excluded from public build. |

PASS requires the observed result within the named boundary; FAIL means mismatch, BLOCKED names a prerequisite, NOT RUN is unexecuted. Preserve independent expected counts rather than deriving them solely from the implementation. Cleanup removes test DBs/files and stops disposable servers; keep the owner preview and ignored verification export. Original source remains unchanged. Owner/customer usability and production retention/access are NOT RUN.

## Official sources — checked 19 September 2026

[Node Buffer](https://nodejs.org/api/buffer.html) documents binary encoding/decoding; Base64 decoding is permissive, so strict canonical input checks are our implementation choice. [Node crypto](https://nodejs.org/api/crypto.html) documents SHA-256 hashing. [Node filesystem constants](https://nodejs.org/api/fs.html#file-system-flags) document nonblocking open where supported; the CLI uses that flag before rejecting nonregular input. Use stable APIs present in installed Node 26.7.0, even though current documentation identifies 26.9.0. Our envelope, limits, offline contract and tests are project choices. [Node permissions](https://nodejs.org/api/permissions.html) documents restricted network, filesystem and child-process access in enforce mode; installed Node help confirms the flags used for the isolated offline check. That check is evidence of these operations, not a sandbox guarantee against malicious native code (SQLite filesystem access has separate limitations). Existing [delivery governance](delivery-governance.md) retains the applicable OpenAI/GitHub/Linear sources checked today.

## Actual results

**Local export slice complete — all four steps finished. MIN-7 and the full MVP remain open.**

| Check | Actual evidence |
| --- | --- |
| Focused export/API/CLI | 10 tests passed. Covered exact source/manifest/report/PDF bytes, a separate unrelated client sentinel, app/database/source removal, review-state snapshots, canonical Base64, sizes, missing/extra fields, hash/link failures, unknown versions, external hash mismatch, and a false result with recomputed hashes. Existing scope/release boundaries stayed intact. |
| Independent real revision | Exported a read-only backup of the actual pending revision with no source path configured and a renderer that throws if called. Original source hash, PDF hash and snapshot hash match the prior retained record; all 16 answers match, one question/four vendor labels, 0/16 literal mentions. |
| Isolated offline check | Closed the isolated app, removed its DB, and copied only four verifier dependency files plus the export/package marker to a temporary directory. On Node 26.7.0, `--permission` with only that directory readable passed verification; negative controls confirmed unrelated file read, subprocess and loopback network access each failed with `ERR_ACCESS_DENIED`. No SQLite/Python/renderer dependency is imported by the verifier. This is bounded runtime evidence, not a general native-code sandbox guarantee. |
| Separate AI review and correction | Reviewer reproduced a hanging FIFO input because the initial CLI opened it before checking type. Corrected to nonblocking open followed by descriptor type validation. Added bounded CLI regression; independent reproducer completed in 0.238 seconds with exit 2, `UNAVAILABLE/input_unavailable`, no stderr. No other material finding within this review scope. |
| Full regression/public boundary | All 124 application tests, site/platform checks and the seven-page public-build/private-content exclusion checks passed after the final correction. |
| Browser | New **Private evidence export** link emitted a download event beside the existing PDF. The 390-pixel layout had no horizontal overflow and controls/help remained readable; viewport override reset. Actual review remains pending, with no owner decision performed by the agent. |

Independent export artifact: 271,579 bytes, SHA-256 `c9be815581f3d465fce0e426cc667b6dbac0730b0fced4687de669d8762c750b`. Its immutable snapshot SHA is `11cb98c576ddcbefcbb73462a5297de9b29a66961fd9309c9fe57cf7db08b385`, original source SHA `dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58`, and original PDF SHA `365bddecc4b4291a1b88ece2a608d2ed89b87301c11415a628e84d3ea28ccda7`. Export time makes later envelope hashes differ; the original content bytes remain fixed. The independently checked API export is not asserted to be the opaque browser-download file.

The false-result challenge correctly returned `FAIL/report_reproduction_mismatch` even after report and snapshot hashes were recomputed. A structurally valid changed review record retained the same immutable snapshot anchor and passed only integrity/reproduction; output explicitly stated that the review decision/export time were unauthenticated and client release remained unavailable. This is the intended boundary, not proof that a review cannot be altered outside the app.

Verifier envelope is `{schemaVersion, exportedAt, entries}`; entries are `snapshot`, `source`, `report`, `pdf`, `review`, each `{encoding, bytes, sha256, data}`. Review state is separately allowlisted. Supported renderer labels are v1 and v2; the verifier checks exact stored PDF bytes and framing, not re-rendering. The complete source is included privately and has not been sanitized for customer redistribution.

### Owner walkthrough

1. Open [the retained local report](http://127.0.0.1:4329/app/#/reviews/be043c4e-9707-4e4b-a2e2-708b9d74075a).
2. Choose **Download retained PDF** for reading, or **Private evidence export** for the full machine-readable evidence/context package. The disclosure explains the raw-source/review-note content.
3. To verify a downloaded export locally, use the product checkout's `npm run report:verify -- --input <downloaded-file> --expected-snapshot 11cb98c576ddcbefcbb73462a5297de9b29a66961fd9309c9fe57cf7db08b385`. A different revision needs its own separately recorded fingerprint. The CLI cannot release, extract or restore a report.

Evidence: root checkout's ignored `artifacts/unattended-work/evidence/2026-09-19-report-export/`, including `preflight.json`, `independent-cases.json`, `verify-real-export.mjs`, `retained-report-export.json`, `independent-verification.json`, focused/application/public logs, `review-record.json` and `browser-verification.json`. The initial independent harness used a macOS symlinked temporary path that the narrow read allowlist rejected; switching to a canonical `/private/tmp` directory resolved the harness issue without broadening permissions. Temporary test stores and verifier copies were removed; original source and actual pending review were untouched.

The loopback preview remains port 4329 with the same retained database and configured source/domain as the [report-review slice](report-review-slice.md). GitHub source backup refs and verified hashes are recorded on MIN-7. Downloadable evidence is now portable, but off-device/private-backup destination, restoration workflow, production retention and customer sharing remain unimplemented. This completed local export does not close collection qualification, production identity, payment, private delivery, accepted full report, pilot or renewal.
