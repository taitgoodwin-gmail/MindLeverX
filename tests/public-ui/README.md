# Public audit-first foundation: executable checks

## Status and boundary, 1 October 2026

This is a **provisional functional foundation**, not the final design or a release approval. The owner subsequently requested a more ambitious modern visual direction for both businesses, including movement and less generic composition. Visual finalization is paused pending that Figma review. No push, merge or deployment was performed for this foundation.

Scope: [MIN-15: Homepage — clarify evidence, sample metrics and navigation](https://linear.app/mindleverx-codex-build/issue/MIN-15/homepage-clarify-evidence-sample-metrics-and-navigation). Make the public audit intelligible, let a visitor inspect clearly fictional evidence and next actions, and provide an honest enquiry path. This is partial coverage of the broader design requirement; usability, final design acceptance and launch remain open.

Protect [MIN-10: Try now — review the results page and PDF](https://linear.app/mindleverx-codex-build/issue/MIN-10/try-now-review-the-results-page-and-pdf): do not replace missing desktop integration, private reports, retained evidence or operator flows. The original `site/index.html`, `site/shared.css` and `site/shared.js` are unchanged. `npm run build` still uses that local homepage and its intake. Only `npm run build:public` selects `site/public-ui/homepage.html`.

The owner selected and corrected the business inbox to **connect@mindleverx.com**, and confirmed the intended inbox receives mail. This is user-confirmed, not an independent delivery test. All enquiry CTAs use `mailto:` and explain that the visitor's email app opens; the website submits nothing. No test message was sent and no mailbox was provisioned. Prices, turnaround, acceptance of an engagement and outcome guarantees are not invented.

### Implementation sequence

1. Read the actual Figma desktop, mobile and all five current sample pages; check business copy and contact sources
2. Implement the public-only foundation, keeping the local/private entry point intact
3. Verify deterministic interaction and serving boundaries, preserve a local review checkpoint, and defer final visuals to the new Figma direction

TEN-UX: direct contribution to visitor evidence inspection, keyboard recovery and honest contact; actual human comprehension is not measured. Owner UX: isolated changes reduce reconciliation work but effort saved is not measured. TEN-REP and TEN-AUTO: reusable public components and automated regression checks. TEN-AI: no new AI service or collection introduced. TEN-REV: supporting pre-sale clarity only; no subscription or renewal claim. TEN-LEAD and TEN-BEH: evidence-visible differentiation and informed action are design hypotheses, not measured advantages. Simpler alternative retained: a static site with a direct email link instead of an unconnected enquiry form.

## Functional review checkpoint — 1 October 2026

Exact source restored: `3e942b19701f3c5591e636c5f845f582f18f6a20`, imported from the eight-part bundle after all part hashes, decoded 23,911-byte SHA-256 (`3d2926d8abfa4e2689d954b657717e9f389f1f5ec05e5739a176d7e726a4cdc7`), prerequisite, ref and strict Git checks passed. Review branch: `codex/public-functionality-20261001`. Original import remains on `imported-checkpoint-20261001`.

The owner rejected the earlier generic compositions and is developing a new opening and signature interaction in Figma. This checkpoint deliberately completes functional fixes only; it does not finalize or expand that composition. Current Figma nodes 97:725, 97:726 and 104:842 were visually inspected. Their navy/cobalt design is not claimed to match this retained earlier source skin. No design score or conversion of the earlier provisional 63/100 is made.

Changes: keep all three homepage navigation links visible at mobile widths; enlarge former 11–12px labels to 14px; add five directly addressable report contents links and current-page state; make action evidence references clickable; make report skip targets focusable; show an invalid-page recovery message and focus it; validate all report headings before hiding static content. Clarify that the report contains two fictional excerpts, not the underlying set of 20 receipts, and remove an unsupported promise about complete report appendices. No real collection, price, timing, credential or client-outcome claim was added.

Requirements are existing review drafts, partial coverage only: NFR-007 requires accessible customer/operator-critical flows with failures resolved and evidence retained; RES-002 requires context, sample and limitations beside each measurement; RES-004 requires tracing measurements/conclusions to permitted observations and receipts, explaining unavailable evidence. Navigation/readability directly support client UX and informed choice; reusable tests support repeatability. No measured owner-effort, AI, competitive or recurring-revenue improvement is claimed. A simpler always-visible mobile navigation avoids adding a menu state machine during the pending redesign.

### Reproduce the added cases

Fixed prerequisites: imported checkpoint plus this branch's functional diff; Node 24.19.0, Python 3.12.14 with ReportLab 4.4.9 for product tests; build `dist/` and `public-dist/`. Serve **only** `public-dist/` on loopback; never the repository or private app. Actual test URL was `http://127.0.0.1:4328`.

1. `node --test tests/public-ui/*.test.mjs`: TC-PUB-14 starts on invalid page 99, expects visible/focused recovery, then page 3 with recovery cleared and exactly one current-page link. TC-PUB-15 removes a heading before script evaluation and expects every static page to stay readable, with no exception.
2. Run the browser-check command documented below. At each of five widths, expect all mobile/header destinations, labels at least 14px, every report page/current indicator/focused heading, working contents and evidence links, Back/Forward, Escape and reopen, invalid/direct URLs, reduced-motion transitions at zero, loaded visible icons at 22×22, and no document overflow or JavaScript exceptions. No-JavaScript mode shows all five pages.
3. Additional real-keyboard check at 390px: Tab to skip, Enter to main, Tab from brand through audit/sample, Enter sample, choose Answers, focus the scroll region and ArrowRight, Escape back to the actual opener, Shift+Tab to audit. Expect 3px solid focus ring and actual table scroll. At 1440px with CSS zoom 200%, expect no document overflow. This is CSS zoom, not native browser zoom.
4. PASS requires all listed assertions; a mismatch is FAIL and inaccessible tooling is BLOCKED. Close the browser and loopback server after inspection. Screenshots/logs are local review evidence, not source assets or public output.

### Results and limits

PASS: 149/149 existing application tests via `npm run check`; local site/platform checks; 15/15 public tests; public build/allowlist/privacy/internal links; requirements structure and seven validator scenarios; JS syntax and `git diff --check`. Chromium/Playwright passed the five-width suite and no-JS path. Supplemental keyboard/focus/table scroll and CSS zoom checks passed. Screenshots inspected include 320px homepage, 1440px homepage, 390px answers and 1440px actions. Visual inspection found a 200% CSS-zoom overlap missed by the document-overflow assertion. The hero grid now stacks based on available column width and its buttons wrap. A fresh five-width suite and supplemental zoom/keyboard run passed; the corrected zoom screenshot was inspected. Horizontal report tables scroll deliberately.

FAIL (pre-existing tooling mismatch): `node site/token-lint.js site/public-ui/homepage.html` requires the literal historical phrase `PROXY FOR THE LIVE CONSUMER PRODUCTS`. The imported original fails the same rule. No unsafe waiver or stale proxy wording was introduced. This legacy rule needs a separately reviewed update for fictional samples; it is not represented as a lint pass.

BLOCKED: agent-browser could not create its socket directory in the managed environment; Playwright with installed `/usr/bin/chromium` provided actual browser coverage. Google Fonts failed with `net::ERR_TUNNEL_CONNECTION_FAILED` in the supplemental capture, so screenshots demonstrate readable fallback fonts, not verified Fraunces/IBM Plex rendering.

NOT RUN / not accepted: original-source requirements reconciliation, native browser zoom, screen reader, comprehensive WCAG audit, throttled performance/field Core Web Vitals, new Figma visual acceptance, private Mac integration reconciliation, hosted/live-site evaluation. No configured TypeScript checker exists in this vanilla-JS repository; syntax/browser checks are not labelled type checks. Accessibility and performance remain release gates. The public homepage and four assets total 41,554 uncompressed bytes at this checkpoint, excluding third-party fonts; this is an inventory, not a performance score.

The inherited browser checker initially asserted geometry on hidden report icons and raced hashchange rendering. It now checks visible icons on homepage and each report page, and waits for the expected visible state. These harness failures were corrected before the passing run; no product failure was hidden.

Adobe Design review headings supplied by the owner govern the pending concept: **Design concept**, **Visual impact**, **Scalability**, **Brand cohesion**, **Functionality**. Exact full official criterion wording/source is still pending in this executor. Concept/originality and visual impact remain unaccepted; scalability has the bounded responsive evidence above; brand cohesion remains incomplete across legacy secondary pages; functionality has the bounded passes above. Motion is assessed separately: instant report changes, no decorative sequence, reduced-motion transitions disabled; timing/storytelling/pacing quality awaits the new concept. Photography/illustration/video categories are not applicable to this functional diff; existing arrow assets are retained.

No private reports/results/collection paths or integration code changed. At local verification, no publication had occurred. The owner subsequently authorized a separate working-branch push and Vercel preview only; main, production and private integration remain excluded. No customer message, credential or permission change occurred. Publication receipts are reported separately. The next handoff is the new Figma opening plus signature interaction, followed by integration reconciliation before publication.

## Sources

- [Figma desktop 78:545](https://www.figma.com/design/n3nwpdh6OMrqJNSdm9R3od?node-id=78-545), [mobile 78:546](https://www.figma.com/design/n3nwpdh6OMrqJNSdm9R3od?node-id=78-546)
- Latest five sample viewer frames: 83:725, 83:726, 83:727, 83:728, 83:729 on `02 — Audit first / 01 Oct refinement`. The older blue sample pages on the original page were inspected but not used as the final skin reference
- [Design decisions, 30 September](https://docs.google.com/document/d/17bzayX_cy95pIgQh4XxetnsA7llQzi79dua4Uu-xLc0): audience, fictional sample and scope/price/timing still distinguished from final approval
- Current public homepage and [About/contact](https://www.mindleverx.com/about.html#contact), read 1 October: had no public mailbox or working request capture before the owner's new inbox direction

The two local SVGs are exact read-only Figma exports of icon instances `I79:547;17:153` and `I79:563;17:159`. Figma asset HTTP URLs returned an HTML “Site Unavailable” response; official `exportAsync({format: 'SVG'})` recovered the original bytes without modifying the canvas. Their SVG roots are 22×22 and the HTML preserves that geometry. No screenshot is used as an implementation asset.

## Reproduce deterministic acceptance

Prerequisites: this checkout, Node 24+, Python 3 with the existing product PDF dependencies for the existing full suite. No private source bundle, database, provider login or live answer collection is needed for these public tests.

1. Run `npm run check`. Expect local build, site/platform checks and all 149 existing application tests to pass
2. Run `npm run check:requirements`. Expect structural validation and seven validator scenarios to pass. Original-source reconciliation must remain separately labelled NOT RUN
3. Run `npm run build:public`. Expect the explicit seven-page public artifact, disconnected runtime and four public assets to pass serving/privacy/link checks
4. Run `node --test tests/public-ui/*.test.mjs`. Expect all 13 new cases below to pass
5. Run `git diff --check`. Expect no whitespace errors

| Case | Fixed action/input | Expected observable result |
| --- | --- | --- |
| TC-PUB-01 | Evaluate the viewer against homepage hash; inspect source with JavaScript unavailable | Home is visible, viewer hidden only after enhancement; all five pages remain readable in no-JS HTML |
| TC-PUB-02 | Activate a sample link and navigate to `#sample-report` | Only page 1 visible; its heading receives focus; previous action returns home |
| TC-PUB-03 | Visit page hashes 1–5, then page 4 | Exactly one page visible; status, previous/next and skip target agree; page 5 has no next action; next reappears on page 4 |
| TC-PUB-04 | Start directly at page 3; simulate Back/Forward hash changes and invalid page hashes | Correct page for valid hashes; safe visible homepage for invalid hashes; no stale report state |
| TC-PUB-05 | Open by each opener, press Escape, then reopen | Homepage restored, focus returned to actual opener, viewer can reopen cleanly |
| TC-PUB-06 | Remove the original opener or load a report URL directly, then exit | Visible hero heading is the fallback focus target |
| TC-PUB-07 | Inspect all mail links and static client capabilities | Exactly four corrected inbox links; no form, intake client, network send or persistence; sending/scope boundaries stated |
| TC-PUB-08 | Independently sum three fictional answer rows | Totals 20, 6, 2, 11, 9; all five pages labelled fictional; baseline, sample and inference limits present |
| TC-PUB-09 | Inspect legacy fragments, HTML landmarks and CSS | Unique IDs, one H1, skip link, focus and reduced-motion rules, bounded scrollable report tables |
| TC-PUB-10 | Read local icon file metadata and HTML callsites | Real SVG files, root/callsite 22×22, no temporary Figma links or failed-download HTML |
| TC-PUB-11 | Compare generated local and public homepages and runtime | Local intake retained; public-only redesigned entry; no public form/private link/intake code; null endpoint/token and false preview flag |
| TC-PUB-12 | Compare emitted public asset tree with the allowlist/source bytes | Exactly two SVGs, one CSS and one JS; no source HTML or private directories emitted |
| TC-PUB-13 | Inspect emitted About contact and machine summary | Corrected business inbox and owner-led-service audience; stale missing-mailbox copy removed publicly |

Decision rules: every assertion passes for PASS. Any assertion mismatch is FAIL. Missing runtime or absent generated build is BLOCKED, not PASS. VM-based interaction tests establish deterministic state/focus commands, not actual browser rendering, screen-reader behavior or human usability.

Actual result on 1 October: 149/149 existing application tests, 13/13 new public tests, site/platform/public checks, requirements structure and all seven validator scenarios PASS. Original-source reconciliation NOT RUN. Browser screenshot, live keyboard, responsive/zoom and effective rendered asset-geometry checks NOT RUN here: the parent confirmed local Chromium has a socket restriction, and paused expensive visual finalization for the replacement Figma direction. No browser pass is inferred from the VM suite.

## Browser acceptance after the next visual direction

Prerequisites: the exact review commit is served as a public-only preview with a verified URL; working Playwright/browser environment. Never point this check at the private operator application. No email is sent by the test.

1. Set `MLX_PUBLIC_URL` to the verified public preview URL; use installed Playwright (or set `PLAYWRIGHT_MODULE` to its existing module path). Optionally set `MLX_BROWSER_EXECUTABLE`
2. Run `node tests/public-ui/browser-check.mjs`
3. Expect a readable homepage at 320, 390, 768, 1024 and 1440px, zero horizontal document overflow, all visible arrows loaded at 22×22, four correct email links and no form controls
4. At every width, use Enter to open and page through the sample, then Back/Forward, Escape, reopen, close and direct page-3 navigation. Expect correct visible page and focus recovery, with no runtime errors
5. Disable JavaScript. Expect all five static sample pages and the contact links remain readable
6. Inspect saved screenshots under `MLX_QA_OUTPUT` (default `/tmp/mlx-public-qa`) against the then-current Figma direction; inspect report-table horizontal scroll, text clipping, contrast, font loads and 200% zoom manually. Test actual keyboard Tab/Shift+Tab paths and a screen reader before any accessibility compliance claim

PASS requires both automated checks and visual inspection. An inaccessible preview or browser launch failure is BLOCKED. Owner design acceptance is separate. These browser cases are authored but NOT RUN at this checkpoint.

Cleanup: deterministic tests create no external state; existing product tests use their own temporary fixtures. Generated `dist/` and `public-dist/` remain ignored build products. The browser checker closes its browser and saves only local screenshots/results; remove those temporary outputs when no longer needed.

## Integration-sensitive patch to reconcile before merge

- `scripts/build.mjs`: select the isolated public homepage only with `--public`; copy four exact public assets only; narrowly update emitted About/contact and machine-readable audience/contact copy. Local source pages and private product output selection remain unchanged
- `scripts/check-public.mjs`: recognize and validate only the four-asset directory; assert the approved email/sending/scope disclosure; align machine-summary checks
- New `site/public-ui/` and `tests/public-ui/` only

Missing desktop design/integration source still needs the root's reconciliation. Nothing in this patch replaces the later private request-to-client, retained results, question summaries or version-pinned PDF work. Old secondary public pages still use the prior visual skin and portions of older audience/offer copy; that out-of-scope consistency work must be reviewed with the new design rather than presented as complete.

## Editorial explorer checkpoint — 1 October 2026

`explorer-browser-check.mjs` implements TC-EXP-01..08. Build and serve only `public-dist`, then set `MLX_PUBLIC_URL`, `PLAYWRIGHT_MODULE`, and (if needed) `MLX_BROWSER_EXECUTABLE`. Set `MLX_AXE_PATH` to a local axe-core script to include WCAG 2/2.1 A/AA automated checks; without it, output explicitly records axe as UNRUN. The script writes screenshots and `explorer-results.json` to `MLX_QA_OUTPUT` (default `/tmp/mlx-editorial-qa`).

1. At 320, 390, 768, 1024 and 1440px, load home, check fonts and keyboard skip focus, open the answer and verify Support is selected.
2. Select each claim. Exactly its source, limitation and action must be visible, with matching selected/tabbable control. No document overflow, failed assets or runtime errors.
3. Use Home, End, arrows, Tab and Shift+Tab. Focus and selection must be visible and coherent. Back/Forward restore the selected readout; Escape restores the opener. Direct/invalid links and transition into the five-page report must recover visibly.
4. Reduced motion must have no animation. With ordinary motion, the original path sequence plays once, settles, and does not restart after returning; the integrated claim/source/finding stay readable without motion. Claim dissolve is 320ms. At 200% CSS zoom the CTA remains reachable and unobscured.
5. With JavaScript disabled, all three linked readouts and all five sample-report pages must remain readable.

Any failed assertion is FAIL; unavailable browser/dependency/authentication is BLOCKED or UNRUN, never a pass. Tests close their contexts and do not send mail or mutate external services. `editorial-integrity.test.mjs` adds TC-EXP-09..11 for public offer consistency, exact vector path preservation/local licensed font provenance, and positive/negative fictional-provenance lint fixtures. Run it with the other `tests/public-ui/*.test.mjs` after local and public builds.

## Public journey hardening — 1 October 2026

Run `journeys-browser-check.mjs` with the same public URL / Playwright / Chromium / optional axe environment as the explorer checker. It records `journey-results.json` and enquiry screenshots under `MLX_QA_OUTPUT`.

1. At 320/390/1440px, open direct answer and report URLs. After document loading, focus must be on the displayed heading.
2. Open the answer from the homepage, then use browser Back and Forward. Back must restore the opener; Forward must focus the answer heading.
3. Read and keyboard-focus the visible `connect@mindleverx.com` fallback in the explorer. No email is sent. Check overflow and automated accessibility.
4. From About, Method, What is GEO and Research Hub, follow the existing report entry. It must open page one and focus its heading, including repeated document/history transitions. Privacy and Terms receive reflow checks only; they have no report entry.
5. Disable JavaScript and follow the Method report link. All five report pages and the copyable mailbox must remain readable.

Prerequisite: the exact public artifact is built and served, with no private server/database. Assertions or runtime errors fail the run. Missing browser/dependency means blocked, not pass. Browser contexts close automatically; stop the temporary static server after testing. Actual email-client handling, screen-reader use and Safari/Firefox remain separate manual checks.

`table-enquiry-browser-check.mjs` uses the same environment contract. At320/390/1440 with JS on/off, open report pages2/3; compare cue visibility to actual table overflow, focus/scroll with arrow keys and reach the last column; ensure evidence/provenance text remains. With JS test200% CSS zoom at each width; without JS test it at1440. Open page5, verify the visible copyable mailbox and scoped disclosure, then focus the link and Escape back to the report opener. No mail is sent. Assertions fail the run; unavailable browsers block it. The known no-JS+200%-at320 whole-document overflow outside the report is recorded in the review receipt, not passed by this suite. Contexts close automatically; stop the temporary public-only server after use.
