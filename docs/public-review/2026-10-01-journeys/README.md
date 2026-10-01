# Public journey hardening — 1 October 2026

Base: b3049e211ce645935d7a41432fa19461f94d72a5, approved public branch. No visual redesign, logo, private dashboard, data collection, report-engine or private delivery changes.

Reproduced: browser Back from the explorer to the hashless homepage left focus on BODY; direct fragment loading could reset report/explorer heading focus after deferred scripts; secondary public pages linked “Example scorecard” to the introductory #score anchor; the explorer's mailto action had no displayed address to copy. Fixes restore focus after native fragment processing with pageshow/animation-frame handling, preserve any already-focused control, open the actual fictional report and expose the existing approved inbox. No mail is sent by tests.

PASS: 149 application tests plus local site/platform build checks; public build and boundary allowlist; 18 public tests; seven requirements-validator scenarios and structure check; editorial lint with zero errors/warnings; diff whitespace. Chromium explorer/axe and report suites at 320/390/768/1024/1440 verify keyboard, mobile navigation, invalid-route recovery, no-JS, reduced motion and 200% CSS zoom. New journey tests at 320/390/1440 verify direct entry, Back/Forward focus, four secondary-page report journeys, two legal-page reflow checks and a copyable enquiry fallback. JSON receipts are adjacent.

Initial checks failed on the reproduced focus defects, stale four-email-link expectations (now five with the fallback), and a test's incorrect assumption that legal pages included report links. These were corrected and final checks rerun. The temporary axe dependency was restored under /tmp after environment restart; no repository dependency changed.

UNRUN / BLOCKED: Firefox and WebKit binaries are not installed; actual Safari/iPhone, screen-reader and email-client behavior are not claimed. Hosted interactions/assets/private-route probes need existing normal Vercel authentication. Requirements original-source reconciliation is not performed by structure-only validation. No TypeScript check is configured. No GitHub Actions workflow exists in this checkout; remote commit/deployment status is reported separately from local tests.

Use `tests/public-ui/README.md` for prerequisites, numbered actions, expected outcomes and cleanup. Browser evidence uses only the public build and fictional examples. No production, PR, main or private integration change. Missing newer Mac integration remains the source-reconciliation gate.
