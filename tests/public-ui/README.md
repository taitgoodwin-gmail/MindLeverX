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
