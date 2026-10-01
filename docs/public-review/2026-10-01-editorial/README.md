# Editorial public review checkpoint — 1 October 2026

Branch: `codex/public-functionality-20261001`, building on preserved `f1f60967e19e06ad28de6ef875510d8f08b32a80` (and imported original `3e942b1`). This is a tested public preview checkpoint, not production approval or full paid-audit MVP acceptance.

## Review experience

The opening asks “What does AI make of you?” and opens a three-state, explicitly fictional answer explorer. Each claim has its exact fictional source excerpt, uncertainty and next action. Support is the initial state. Local is supported within limits; Support overreaches; Leading is not supported by the displayed source. Native original vector paths and intended licensed fonts are local. No model call, data capture or mail sending occurs.

Mobile has the demo action before the artwork, selection instructions before the claims, arrows and separators on every row, selected wording repeated in the readout, and an onward `mailto:connect@mindleverx.com` enquiry. All five pages of the separate sample report remain accessible. Public About, navigation and footer wording now reflects service businesses and agreed scope, price and timing, with no free-audit offer. Public build transformations preserve local/private integration sources and historical observations.

[Asset/type/motion provenance and Figma reconciliation notes](../../../site/public-ui/ASSETS.md). The final implementation keeps 14px evidence labels, so mobile text may use more vertical space than the 12px Figma reference. Container queries also reflow the opening at 200% CSS zoom. These are deliberate usability refinements, not additional creative directions.

## Evidence and status

**PASS**

- `npm run check`: local build, site/platform checks, 149 application tests.
- `npm run check:requirements`: document structure and seven independent validator scenarios. This is not original-source reconciliation.
- `npm run build:public`: seven-page website-only build, explicit 15-asset allowlist, valid links/metadata, disconnected intake runtime and no private output.
- `node --test tests/public-ui/*.test.mjs`: 18 public regression/integrity tests.
- Public editorial palette/provenance lint: zero errors/warnings; negative fixtures reject missing fictional provenance and off-palette colours. JS syntax and `git diff --check` pass.
- Chromium report checks at 320, 390, 768, 1024, 1440px: all five pages, contents/current page, evidence links, focus, history, Escape/reopen, direct/invalid routes and no-JavaScript fallback. [Receipt](report-results.json).
- Chromium explorer checks at those widths: all three states, keyboard arrows/Home/End/Tab/Shift+Tab, focus, history, Escape, direct/invalid routes, report handoff, font/asset loading, no overflow/runtime errors and reduced motion. Axe WCAG 2/2.1 A/AA rules pass for home and each state. Automated axe is not a complete accessibility certification. [Receipt](explorer-results.json).
- Normal motion: original SVG draws once at 650–875ms; coordinated claim/marker sequence settles, does not restart on return; 320ms claim dissolve. 200% CSS zoom has no page overflow or occluded demo CTA.
- Visual review of actual desktop/mobile opening and evidence screenshots after final refinements. See PNG files here. No screenshot is used as an implementation asset.

**FAILED, THEN FIXED**

- Initial 200% CSS zoom compressed the desktop copy behind the artwork. Available-width container reflow corrected it; rerun passed.
- First build exposed a removed legacy `#score` target. The target is restored beside the report introduction; all internal links now pass.
- The old sample provenance linter demanded a consumer-product proxy sentence even for purely fictional material. The isolated editorial rule now requires explicit fictional/model-response/client-result boundaries; legacy pages keep their original rule.

**BLOCKED / UNRUN**

- Hosted browser and private-route/asset response checks remain blocked by existing Vercel Authentication. Do not disable protection or treat deployment READY as hosted QA.
- Original requirements-source reconciliation, Safari/Firefox/device testing, assistive-technology testing and customer usability validation are unrun. No TypeScript compiler is configured; JavaScript syntax/build/tests cover this vanilla implementation.
- Library upload previously failed in the supported helper before preparation because hosted tools/list networking failed. No upload is claimed. These public-only screenshots, receipts and report are committed to the review branch as explicitly authorized, and are excluded from the public build.

## Design assessment boundary

Qualitative evidence only, with no invented composite score or conversion of the earlier provisional 63/100. Design concept: concrete evidence-to-action demonstration. Visual impact: editorial condensed type and original vector artwork. Scalability: tested responsive/zoom states and local assets; broader browser support unrun. Brand cohesion: opening/explorer plus reconciled offer wording; other public editorial pages retain their earlier visual system. Functionality: tested public interactions and enquiry links; no automatic audit or private delivery implied. Motion intent/timing/storytelling/pacing were checked separately through runtime states and single-play behaviour; Figma's native playback remains unverified.

## Remaining MVP gates

Safe independent public work: authenticated hosted QA after the normal sign-in is available; reconcile the documented accessibility refinements into Figma; owner review of copy and interaction; later harmonization of the remaining public pages' visual styles. None requires touching private report, result or collection code.

Missing sources/decisions: retrieve and reconcile the newer unpushed Mac `work/mindleverx-integration` before merging into main. Remote inspection still finds `codex/mindleverx-integration-20260930` at `6926e30e145c2e5cad53127c76410c719e3af2b7`; this is not proof that the Mac work is synchronized. Main remains `e116e4bb9ab3676a1d7c921d9800a872037c2a7b`. Current collection qualification/entitlement, actual private report acceptance, commercial terms and first paid delivery gates need their original private sources/owner decisions; this public demo does not resolve them.

No main merge, production promotion, credential/permission changes, provider collection or customer contact was performed.
