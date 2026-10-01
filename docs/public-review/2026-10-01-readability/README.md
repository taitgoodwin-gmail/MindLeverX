# Reading correction — 1 October 2026

Owner feedback: “Looks good however cannot read text with backroubd”. The approved Integrated composition remains; source and finding now share one opaque paper sheet with a divider. The fictional label also has an opaque paper background. Dark ink #151714 on paper #F3F0E8 gives calculated 15.83:1 text contrast. Source typography is Manrope 500, 17/26px mobile and 20/30px desktop; labels 13/20px; reading padding 16px mobile / 20px desktop. Mobile finding increases to 30/34px. Device safe-area padding supplements normal document scrolling.

Parity follows the designer's supplied Figma reading wrappers 155:838/155:842 and fictional labels 155:837/155:841. No new creative variant. Original SVGs, claim, routes, local fonts and private integration are preserved.

## Direct browser evidence

- [Before, 390px](before-specimen-390.png): original CSS from commit 35e414eb3d59cec06bdebb79d85453abe14cf340, captured before the wrapper change against identical specimen HTML.
- [After, 390px](after-specimen-390.png)
- [After, 320px](after-specimen-320.png)
- [After, 1440px](after-specimen-1440.png)

Native Chromium element screenshots, reduced motion, local public build. Images were not edited. Before and after visually inspected; this is not owner acceptance or measured comprehension.

## Verification

PASS: public build and private-boundary allowlist; editorial palette/provenance lint (zero errors/warnings); 18 public tests; requirements structure and seven validator scenarios; diff whitespace. Chromium explorer/axe and five-page report suites at 320/390/768/1024/1440 pass, including keyboard focus/return, error recovery, history, no-JS fallback, reduced motion, animation completion and 200% CSS zoom. See [explorer results](explorer-results.json) and [report results](report-results.json).

PASS: independent [reading checks](readability-results.json) at 320/390/1440 × 650 verify actual opaque panel backgrounds, ink, source font size/line-height/weight and ability to scroll the finding and both public/explorer footers fully into the viewport. [Executable receipt](readability-check.mjs) expects the local public server at 127.0.0.1:4348, Chromium and the environment's Playwright installation; it writes screenshots/results under /tmp/mlx-readability. Build with `npm run build:public`, serve only `public-dist`, execute this script, then stop that server.

FAILED: none of the executed checks.

BLOCKED / NOT RUN: actual iPhone Safari and its browser chrome; authenticated hosted interaction/assets/private-route probes (existing Vercel Authentication). Local short-height scrolling does not establish Safari chrome behavior. No configured TypeScript check. Original requirements-source verification is not run by structure-only mode. The 149 application tests passed on the preceding checkpoint and were not rerun for this bounded public HTML/CSS correction.

Draft NFR-007 accessibility and RES-002 sample-context coverage improves the reading surface; claims remain fictional and limitations unchanged. Buyer reading effort is the direct design rationale; commercial results, automation, AI capability and competitive preference remain unmeasured. Missing unpushed Mac integration still blocks main reconciliation; this is preview-only, with no PR, main or production change.
