# Evidence review frontend — 18 September 2026

Authorized by owner request to develop something visible on the frontend. Local operator screen using existing light workspace design; no marketing-site redesign or deployment. Continue the existing isolated evidence-inspection checkout.

Requirement: open /app/#/evidence to review a configured saved export through the tested checker, with counts, per-platform coverage, filterable row attribution, plain-language warnings and explicit sample limitations. Read-only; no collection, qualification, approval or release action.

Before-build acceptance:
1. Start the local server configured with the original saved export; visit /app/#/evidence. Expect 16 answers, 0 literal matching answers, four vendor platforms, one question, and a saved-sample/not-client-audit label. Counts must originate in the inspection API.
2. Choose ChatGPT in the platform filter. Expect four rows; return All platforms for 16. Aggregate cards continue to describe the full saved sample, and row count describes the filter.
3. Expand source details. Expect source hash matching the original export, byte count 67622, and warnings explaining repeated IDs without silently dropping rows. No raw answer body or filesystem path is served.
4. Start a test server with no evidence path. Expect an explicit empty state, not fictional counts. With unreadable evidence expect recoverable error; malformed or incomplete data must produce blocked inspection and no numerical aggregate.
5. Request the inspection API without local session and from a foreign origin. Expect refusal. A session authorizes only local access; this is not production identity.
6. Inspect desktop and narrow mobile browser layouts; verify navigation, filter, details and refresh. Source text must render inertly. No page-wide horizontal overflow or browser errors.
7. Run existing project checks and public-build exclusion checks. Private evidence must never enter platform assets, dist or public-dist; source remains unchanged. Save browser/test evidence and leave preview open for owner.

Test data: existing fixed export and TC-EVD-001 hash; synthetic missing/hostile inputs used only in tests. Original data kept outside build directories. Tests pass on expected blocking behavior; unavailable prerequisites are distinguished from product defects. Styling is an implementation choice based on existing project tokens; browser checks do not establish full WCAG conformance.

## Actual verification

Local frontend implemented in branch codex/evidence-inspection-2026-09-18. Preview: http://127.0.0.1:4328/app/#/evidence . Server is loopback-only, with source configured by MLX_EVIDENCE_INPUT and optional MLX_EVIDENCE_BRAND; no file path accepted from browser requests. Preview uses real retained evidence and an unseeded local workspace. No source export copied into frontend assets or public output.

All 68 project tests passed, including three new API tests for session/origin boundary, absent input, real calculation, blocked data and unavailable file. Public build exclusion checks passed. Browser checked at 1440x1050 and 390x844: no page-wide overflow; real cards 16 / 0 of 16 / 4 / 1; ChatGPT filter gives four rows, All gives 16; source details expose correct hash; refresh works; mobile navigation opens/closes and navigates. Browser console and page-error logs empty. Empty, blocked, unavailable and hostile-text rendering additionally checked with temporary browser-state simulation, restored to real data afterward; those simulations are not real collection outcomes. Screenshots retained under the original checkout artifacts/unattended-work/evidence/2026-09-18-test-case/evidence-frontend-{desktop,mobile}.png .

Browser check is coordinator verification, not human usability research or full accessibility certification. Real report acceptance remains open. No public deployment, push, merge, provider request or client release. Codex panel open request returned queued; direct local preview link is available.
