# MIN-15 — Homepage accuracy and interaction pass

19 September 2026. Owner first requested discussion before changes, then explicitly authorized reversible implementation and GitHub push/Vercel publication. Preserve the existing visual direction. This authorization covers the public website; it does not release the private application, purchase a plan, start collection or accept a scoring model.

Work: [MIN-15 — Homepage — clarify evidence, sample metrics and navigation](https://linear.app/mindleverx-codex-build/issue/MIN-15/homepage-clarify-evidence-sample-metrics-and-navigation).

## Outcome and plan

1. Correct research claims and explain illustrations (INV-005, RES-002).
2. Clarify local/public availability and improve navigation, readability and motion (NFR-007; owner feedback).
3. Verify, retain reversible commits, push the public-only release and inspect Vercel (all three requirements).

Estimate at authorization: 30–45 minutes. Current status: implemented, pushed and deployed; owner visual review remains open. A browser call spanned a long host/service interruption, so wall-clock completion exceeded that estimate. Product writer and independent source reviewer were temporary AI assignments, not human/customer validation.

## Requirement narratives and pillars

These are current review-draft formulations from the requirements register; this slice supplies partial coverage and does not accept whole requirements.

**MLX3-INV-005 — No Outcome Guarantees:** Every public or client-facing claim distinguishes observed evidence from inference and excludes guarantees of rankings, AI citations, traffic, leads or revenue.

**MLX3-RES-002 — Measurement Context and Limitations:** Each displayed measurement presents its scope, surface or engine, known model context, panel, date, sample, incomplete work and material limitations beside the claim.

**MLX3-NFR-007 — WCAG 2.2 AA Accessibility:** Shipped customer and operator-critical flows satisfy applicable WCAG 2.2 Level A and AA acceptance criteria, with failures resolved and manual/automated evidence retained; any explicitly agreed scope exception is disclosed without a full conformance claim.

Client UX and behavioral design contribute directly through explicit meaning and next steps; comprehension is unmeasured. Owner UX benefits are proposed through reviewable, reversible changes. Repeatability is supported by consistent linked explanations and existing build checks. AI contributes source review here, not a new product capability. Automation, recurring revenue and competitive advantage receive no claimed improvement. The tradeoff is less dramatic marketing language and more explicit examples; the simpler alternative is removing all numerical illustrations. Retain the examples only with visible definitions and fictional status. Real metric/model acceptance remains separate.

## Source and claim record

Checked 19 September 2026; source findings are not product-performance evidence.

| Claim or observation | Evidence and scope | Implementation decision |
| --- | --- | --- |
| Pew 8% and attributed KPI quotation | [Pew original study](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/): 900 U.S. adults, March 2025 browsing; traditional-result clicks on 8% of Google visits with summaries vs 15% without. Summary-link clicks were a separate 1%. Observational; results reconstructed in April. | Remove unsupported quotation; scope and date the paraphrased finding. No universal citation KPI prescription or causal claim. |
| GEO 40% customer lift | [GEO v3 full methods](https://arxiv.org/html/2311.09735v3), [version record](https://arxiv.org/abs/2311.09735v3): controlled source-prominence evaluation; research engine, selected sources and metric-specific relative gains. The Perplexity appendix used uploaded sources. | Replace headline lift with bounded research wording. No consumer ChatGPT discovery, customer traffic or business-outcome promise. |
| Cross-platform compounding; brand demand beats backlinks | No supporting causal evidence established. Missing effect size does not establish mechanism. | Remove unsupported mechanism statements. |
| Five moves ranked by leverage; fourth item biggest lever | Direct contradiction in current homepage; no evidenced order. | Use neutral review areas; no new ranking. |
| Google AI Search eligibility | [Google official AI-feature guidance](https://developers.google.com/search/docs/appearance/ai-features): ordinary SEO foundations apply; no special AI markup; eligibility does not guarantee inclusion. Applies to Google Search only. | Keep platform scope explicit and avoid universal guarantees. |
| Four engine values and arrows | Existing 42/38/33/27 percentages lack defined metric and trend baseline. | Use an explicitly fictional brand-mention illustration with fictional answer counts; remove deltas. This is not adopted operational scope or a sample-size standard. |
| Composite 87/100 | Existing component values 82/91/78/88 do not average to 87; no validated formula. | Preserve visual illustration with explicit unvalidated status; remove unsupported mean/model attribution. Real composite definition/validation deferred. |
| Navigation and motion | [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [pause/stop/hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Existing ticker pause works; broad accessibility conformance unproven. | Test actual layouts, keyboard and preferences. Preserve working controls. |
| Reversible Vercel release | [Vercel Git](https://vercel.com/docs/git), [rollback](https://vercel.com/docs/deployments/rollback-production-deployment). Existing main triggers public-only production. | Retain source baseline and previous deployment; Git revert/redeploy remains available without relying on a particular instant-rollback plan entitlement. |

## Fixed verification cases

Common setup: product baseline `47a79f0fe53a9f5de6ffa54f0a025f7d5a4d6b74`; record final commit. Build local `dist` and separate `public-dist` using repository commands. Test data only; no customer submission. PASS requires all listed observations; a contrary observation is FAIL; missing runtime/access is BLOCKED and cannot count as passed. Browser checks use actual rendered content; no static-copy snapshot tests are added merely to mirror edits.

**HOME-01 — claims and example interpretation (INV-005/RES-002).**
1. Read rendered hero, research cards, review areas, engine board, scorecard and linked explanations.
2. Open the source links and compare each research assertion to the recorded scope above.
3. Expect no Pew KPI attribution, guaranteed lift, unsupported causal mechanism or contradictory ranking. Expect fictional status, definition and fictional denominator beside the engine values; no unqualified trend. Composite must not claim a validated formula. No fictitious real collection date/count.
4. Source inspection can prove wording/links and known contradictions, not actual reader comprehension. Cleanup: close temporary source tabs.

**HOME-02 — navigation and layout (NFR-007).**
1. At 1440, 1122, 768, 390 and 320 CSS-pixel widths, inspect homepage and a linked page. Record actual viewport and capture representative screenshots.
2. Use keyboard to open Menu, reach Method/Research/example destinations, close with Escape and inspect focus/state. Follow an anchor link and confirm menu closes without trapping focus.
3. Expect all destinations reachable, visible focus, accurate expanded state, no overlap or two-direction page scrolling at 320px. Check 200% enlargement where browser capability permits and disclose if not executed.
4. Restore viewport and original theme after checks. These are affected-scope checks, not a complete WCAG audit.

**HOME-03 — motion and readability (NFR-007).**
1. Use the ticker control by keyboard; expect movement to pause and accessible action/state to match; resume and confirm.
2. Emulate reduced motion; reload and expect no ticker/pulse movement and every ticker topic readable rather than clipped offscreen. Restore preference afterward.
3. Inspect current caption, note, link and button colors against actual backgrounds in light/dark; compute relevant text contrast. Expect >=4.5:1 normal text, >=3:1 qualifying large text; focus/control checks separately. Text size alone is not a failure.

**HOME-04 — local intake (owner feedback 5).**
1. Run an isolated local server with disposable database. Use `ui-feedback@example.com` and `example.com` as synthetic input.
2. Submit empty form; expect useful validation and focus. Enter valid data without consent; expect consent error. Check consent, submit after minimum form age; expect explicit local-save/no-audit/no-email confirmation.
3. Confirm exactly one matching local row through the disposable database or local workspace. Retry and confirm duplicate protection. Inspect failure/recovery tests for unchanged handler.
4. Stop isolated server and remove only its disposable database. Do not submit on production or the owner's existing preview database.

**HOME-05 — public build and production boundary.**
1. Run `npm run build:public` and inspect exact seven-page/support-file allowlist; no forms, local fetch client, workspace, API, secrets or private artifacts.
2. On public homepage follow the main action; expect availability explanation and no intake. Public wording must not promise a local save or completed audit.
3. Build and verify again from the focused release checkout based on main. After authorized push, confirm Vercel READY deployment SHA equals that release commit and production alias points to it. Inspect live desktop/narrow pages and links; request representative `/app/`, `/results/`, `/api/health`, database and source paths; expect404. Check public file hashes against that release checkout's verified artifact where hosting does not transform bytes.
4. Record old/new commit, deployment and rollback action. No payment, collection, report release, customer acceptance or production application readiness inferred.

## Before-change references and rollback

Product baseline: `47a79f0fe53a9f5de6ffa54f0a025f7d5a4d6b74`. Root documentation baseline: `1aab41972a2613fa84148a838bc1b6b83bb6febe`.

GitHub production baseline verified 19 September: `0fc5498899994c2de271b6fc76673acaa1672db7`. Previous production `dpl_9vdh6v363WrvL6usAfYNhre2xBG5`, `https://mindleverx-de8ch41wq-mind-lever-gmail.vercel.app`, READY and assigned to mindleverx.com when inspected. Existing hosted public availability remains closed. User's new publication instruction supersedes the earlier coordinator publication hold for this static-site correction; it does not authorize a purchase, remove the recorded Hobby/commercial-use discrepancy or establish plan suitability.

Publish a focused release commit based on current main containing the reviewed website files. Revert that commit and redeploy to restore the former public site without reverting private report work. Check current main and intervening changes before any later revert. No rollback performed during this slice.

## Actual results

Completed 19 September Eastern (production verification 20 September 02:49 UTC). Detailed logs, manifests and receipts are in ignored `artifacts/unattended-work/evidence/2026-09-19-homepage/`; browser screenshots were inspected in the task rather than saved as local image files.

| Feedback | Disposition and evidence |
| --- | --- |
| 1. Pew attribution | Implemented: scoped 8% versus15% traditional-result finding, separate1% source-link figure, study context/date and original source link; unsupported quotation removed. |
| 2. Adjacent claims | Implemented: controlled GEO experiment described without customer lift, unsupported mechanisms removed, matching claims corrected on linked pages. Stale model-API-as-consumer-proxy wording corrected across seven footers and About to match accepted direction. |
| 3. Ranking | Implemented: five review areas, neutral off-site evidence description; no invented reranking. |
| 4. Percentages | Implemented: explicitly fictional literal-brand-mention share; fictional42/38/33/27 of100 answers. Deltas removed. Ticker now names report topics instead of undefined percentages/trends. Real measurement scope and sample adequacy remain separate. |
| 5. CTA | Implemented: adjacent local-save/no-audit/email note, transformed to public availability. Disposable browser submission validated required email/consent, saved exactly one row and rejected immediate duplicate. Public artifact has no forms or intake handler. |
| 6. Composite | Implemented illustration boundary:87 and components clearly fictional, no calculated/validated model or unweighted-mean claim. Real composite definition/validation deferred; no scoring implementation added. |
| 7. Navigation | Implemented: visible priority destinations where they fit, labeled disclosure for remaining links. Actual keyboard Enter/Tab/Escape and anchor focus passed. Method and Research destinations opened. |
| 8. Readability/design | Existing serif/accent/hierarchy preserved. Explanatory text enlarged selectively. Actual homepage reflow1440/1122/768/390/320px; linked Research page320px passed with no page overflow. Sampled contrast minimum5.38:1 light,5.01:1 dark. Actual200% browser text enlargement and full assistive-technology audit NOT RUN. |
| 9. Motion | Pause/resume and accessible state passed by keyboard. Reduced-motion320px shows all six original topics, duplicate hidden and animation none. Independent review found inline-display cascade bug; browser found zero-width mobile ticker mask. Both corrected and affected cases rechecked. |

HOME-01 passed bounded wording/source review; comprehension remains unmeasured. HOME-02 passed executed keyboard/reflow cases with the enlargement/AT limitations above. HOME-03 passed affected motion/contrast checks. HOME-04 passed synthetic browser and independent read-only SQLite confirmation; handler unchanged and existing integration tests passed. HOME-05 passed public build, exact release/production file identity and private-path exclusions. Fresh production visual interaction was BLOCKED by the browser-control service after publication; local browser checks used byte-identical public files. Do not represent the live visual check as executed. No customer evaluation or conversion/revenue improvement claimed.

Verification: product suite127/127 tests plus site/platform/public checks; focused release checkout12/12 tests plus site/platform/public checks. Focused release has only public-site changes on the older production baseline, so these are different applicable suites, not contradictory counts. No extra tests merely mirror static text. All11 files in the focused release matched the locally browser-tested artifact, then the live domain matched all11 SHA-256 hashes. All seven probes returned404: `/app/`, `/results/`, `/api/health`, `/data/mindleverx.sqlite`, `/.env`, `/server/app.mjs`, `/site/index.html`.

## Verified publication and rollback receipt

- Product commit: `51ef362361e9affe312fb1e365d61bc85a21341f`, backed up as `codex/homepage-product-2026-09-19` (remote peeled hash verified).
- Focused public release: `836eaa58091a91ea28c08bfb4b3719ee84ebfecd`, pushed to GitHub `main`; remote hash verified. It changes seven public pages, shared CSS/JS, one explicit public-copy transform and three interaction tests. No private application release.
- Production: [mindleverx.com](https://mindleverx.com/), deployment `dpl_F9synXrfyPua9VHr9JbtmpATMiZf`, READY with matching Git SHA and production aliases. [Vercel deployment](https://vercel.com/mind-lever-gmail/mindleverx/F9synXrfyPua9VHr9JbtmpATMiZf). Vercel buildingAt-to-ready interval4.346seconds; static site, no runtime application logs/drains evaluation or new monitor.
- Previous public commit retained and remotely verified under `codex/homepage-before-2026-09-19` → `0fc5498899994c2de271b6fc76673acaa1672db7`.
- To undo this pass, inspect current main, `git revert 836eaa58091a91ea28c08bfb4b3719ee84ebfecd` on a clean branch from main, verify the public build, then push the revert to main under the applicable authorization. This restores the prior public content without reverting the local report work. No rollback was performed.

An invalid local reference named `refs/heads/codex/evidence-inspection-2026-09-18 2` blocked fetch. Its bytes were preserved in the private evidence directory, its referenced commit was verified as an ancestor of the valid product branch, and only the malformed ref was removed. Fetch then passed. No cause such as filesystem synchronization was established.
