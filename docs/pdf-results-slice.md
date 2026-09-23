# PDF results chunk — 19 September 2026

Owner wants a PDF customer report, small demonstrable chunks, visible numbered plans and requirement/pillar narratives. The full narratives and qualitative seven-pillar rationale are in the original checkout's `docs/chunk-plan.md`. This chunk implements only a local draft from saved observations; it does not qualify the evidence or complete production report delivery.

## Plan and traceability

1. Review existing design/tools — RES-001/002; complete. Reuse September13 visual mockup's Spectral/Plex, white, burgundy, explicit counts and optional detail. Bundled ReportLab4.4.9, pypdf, pdfplumber and Poppler available. No Figma or Drive dependency.
2. Build the PDF — RES-001 (understandable finding), RES-002 (context/unknowns beside measures), RES-004 (traceable source detail), RES-007 (justified next action). In progress.
3. Connect Download PDF — owner decision PDF-FORMAT-2026-09-19. Pending.
4. Verify generation, download, accuracy, failure handling and every rendered page — cases below. Pending.
5. Open the PDF for owner review — pending. Local passing checks do not accept the full requirement.

Implementation choice: two summary/method pages followed by a complete source-row ledger with clearly labeled short answer excerpts. Full answers remain available on the local results screen; excerpts are not a substitute for the full text used in counting. No unsupported visibility score, causal fix or trend. Reuse current data contract; general accepted-report packaging and machine-readable export remain separate requirements. PDF generation uses a configurable local Python executable and pinned ReportLab dependency; subprocess has timeout/output bounds, no shell/network. PDF and font assets stay out of the public build.

## Acceptance fixed before coding

Prerequisites: Node>=24, Python with `requirements-pdf.txt`, local built server, fixed original source SHA256 `dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58`, 67,622 bytes. PASS requires every expected result; missing prerequisite is BLOCKED; wrong behavior is FAIL; unexecuted case NOT RUN. Dispose only temporary synthetic files/servers; preserve source and leave actual PDF available.

| Case / requirement | Numbered procedure | Expected result |
| --- | --- | --- |
| PDF-01 / RES-001,002 | 1. Start real configured local server. 2. Establish session. 3. Request PDF for displayed SHA256. 4. Parse text and render every page. | Real PDF attachment, local-draft labels, 0/16 full-sample literal matches, 4 vendor labels, 1 question, all4 platform counts0/4, vendor dates14–17September, no composite/causal claim; missing model/locale/panel and unverified collection explicit. |
| PDF-02 / RES-004 | 1. Compare PDF ledger to source rows1–16. 2. Compare excerpts to normalized source prefixes. 3. Follow an internal evidence link. | Every row mapped to platform, supplied date/ID and exact labeled excerpt (typographic dash normalization/whitespace collapse disclosed); clickable internal links reach evidence ledger; SHA256 identifies full source; no hidden file paths or active vendor HTML. |
| PDF-03 / RES-007 | 1. Read next-action block. 2. Compare its justification against the single-question data. | Validate collection/question coverage; no invented website/content fix, promised lift, time/cost or numerical confidence. Expected effort unknown; dependency and reversibility disclosed. |
| PDF-04 / format | 1. In browser filter ChatGPT. 2. Click Download PDF. 3. Inspect attachment bytes/header. | Browser download event and valid PDF with full0/16 scope; .txt control removed; file is not HTML renamed as PDF. |
| PDF-05 / local access/recovery | 1. Call without session/with foreign origin. 2. Use wrong hash, malformed source, missing source, no source and unavailable Python. 3. Restore valid runtime/input. | 401/403, 409, 503/404 as appropriate; no successful PDF attachment on failures, no local-path disclosure; valid input works again. |
| PDF-06 / rendering safety | 1. Render two-record synthetic1/2 fixture with long strings and script/image-like text. 2. Extract and inspect. | Correct1/2 result, input remains inert, unknown date shown honestly, no URI/JavaScript actions, no clipping/overlap; finite PDF generation. Unsupported glyphs explicitly escaped rather than silently lost. |
| PDF-07 / regression | 1. Run project checks/public build. 2. Inspect all actual PDF pages and text bounds/fonts. 3. Rehash original source. | Existing tests pass; public output has no PDFs/private assets; fonts embedded and readable; no text outside margins; source unchanged. No PDF/UA or human comprehension certification claimed. |

## Source basis

19September2026: https://docs.reportlab.com/reportlab/userguide/ch6_paragraphs/ documents wrapping/styling and markup; all untrusted values escaped before Paragraph use. https://nodejs.org/api/child_process.html documents child processes; implementation uses execFile without shell, timeout and maxBuffer. Existing mockup font provenance is retained from `artifacts/client-report-mockup/design-notes.md`: official Google Fonts Spectral and IBM Plex repositories, retrieved13September. Design and pagination are project choices, not external standards. Font licenses retained with assets.

## Actual outcome

Steps1–5 complete for the local PDF chunk. PDF-01 through PDF-07 passed within the stated local test boundary. 74 automated project tests pass; public-only build checks pass. Browser Download PDF succeeded with ChatGPT selected while the PDF retains the full0/16 scope. Browser console errors/warnings empty. Actual source SHA256 unchanged.

Generated and retained `output/pdf/MindLeverX-saved-answer-review.pdf`: 8 pages, 76,495 bytes; SHA256 `2717228bffe6dc0fd1bbd2b3ddb1a8d42d2dadfd3cc64cb1db070a9d42b40155`. Two summary/context pages and six evidence-ledger pages. Every page visually inspected at rendered resolution; no clipped or overlapping content found. First render had orphaned note pages, corrected before delivery. All16 source rows and excerpt prefixes reconcile with the original; all16 internal evidence links resolve to appendix pages. HTTP-generated page content exactly matches the inspected render. Custom Spectral/Plex fonts embedded, text selectable; body/headers within tested page bounds. PDF/UA tagging and assistive-technology reading order are not implemented or certified.

A separate 3-page synthetic1/2 fixture exercised missing/invalid dates, long prompt/response-ID strings and image/script-like text; all pages inspected, no URI/JavaScript actions and no active source markup. Backend tests reject missing sessions, foreign origins, stale hashes, blocked/missing evidence and unavailable runtime without a successful attachment or private-path leak. Valid input works after the failure cases.

Verification, project/public logs and final page renders retained in original checkout `artifacts/unattended-work/evidence/2026-09-19-pdf/`. Human customer comprehension, provider qualification, production private delivery and overall RES-001/002/004/007 acceptance remain open. No paid calls, Figma/Drive dependency, external deployment, new task or schedule.

## Local runtime and reproduction

Use Python with `requirements-pdf.txt` installed, and set `MLX_PDF_PYTHON` to that Python executable before starting the local Node server or running project checks. Unset defaults to python3. This machine uses the already-bundled Codex Python; no packages were installed. The Python generator reads only projected report JSON on stdin and writes the PDF to stdout. The Node wrapper caps runtime at15seconds and output at8MiB; renderer accepts at most128records/12platforms and4MiB input for this local slice. These are implementation bounds, not customer-service limits.

For exact fixed-source checks, start the existing4328preview with its saved source, establish `/api/session`, then GET `/api/saved-results/draft.pdf?sha256=dfb34e1b540066b1990b32d0b599cb0968993a3a2d810fac907c883d08be5b58`. Expect application/pdf and attachment filename. PDF metadata timestamps vary per generation; page content and source identity are what the verification compares. Render with pdftoppm, inspect each page, use pypdf/pdfplumber for text/links/bounds. Run project checks with MLX_PDF_PYTHON configured; then public build checks. All evidence/PDF files remain outside dist/public-dist.
