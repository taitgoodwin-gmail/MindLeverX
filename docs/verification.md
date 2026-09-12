# Verification · 12 September 2026

Verified locally using Node.js 26.7.0 and the Codex in-app browser.

## Automated

`npm run check` passes:

- Seven generated website pages: internal links/anchors, one heading and canonical per page, balanced forms, JSON-LD and script syntax, consent/status hooks, stripped internal comments and unserved reference files.
- Platform assets: script syntax, accessible feedback, noindex declaration and minimum typography rules.
- Nine automated tests: sample evidence/panel consistency, local sessions and CSRF, cross-origin/Host rejection, client validation, inert text storage, one-time review transitions including a race, immutable panels, SQLite restart persistence, and intake validation/throttling.

## Browser workflows

Browser writes used a separate test server on port 4318 and `artifacts/browser-test.sqlite`. The normal workspace on port 4317 retains the initial three sample clients, pending reviews and empty lead inbox.

Verified:

- Website audit intake succeeds only after local persistence, then appears in the lead inbox with the submitted domain/email and audit type.
- Research interest saves as a subscription-interest request with no email-delivery claim.
- A new client begins unmeasured; status, stage and plain-text notes survive reload.
- Client search filters the displayed records.
- A second panel version preserves the original question list.
- Marking a lead reviewed changes its status/filter count.
- Approving a sample report saves the note and removes the pending state; the internal report preview contains the recorded decision and sample-data notice.
- The keyboard skip link focuses main content without changing the route. Mobile navigation opens, moves focus, closes on Escape, and is inert while closed.

## Responsive and visual checks

- Website: 7 pages × 3 widths (375, 960, 1280) × light/dark = **42 combinations**, with no horizontal page overflow in the final build.
- Platform: 9 views × the same 3 widths = **27 combinations**, with no horizontal page overflow in the final build. Wide tables scroll inside their own accessible regions.
- Visually inspected the desktop website, mobile method page, desktop operator console and mobile console/client layout.
- No browser errors were reported in the inspected workflow logs.

## Boundaries of verification

This verifies a local application. Production authentication, deployed domains, real audits, engine measurements, scoring, email and payment delivery are not connected and were not tested. Print styling is included; a full exported-PDF layout review was not performed.
