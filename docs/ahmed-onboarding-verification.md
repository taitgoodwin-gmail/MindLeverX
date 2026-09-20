# Ahmed onboarding cleanup — verification
20 September 2026 · [MIN-16](https://linear.app/mindleverx-codex-build/issue/MIN-16/prepare-ahmeds-brief-and-reconcile-github-linear-entry-points)

## Scope and implementation choice
Owner requested a three-step execution including Linear cleanup and Ahmed's brief. This is a documentation/tracker change. The reading path points to the actual newer product checkpoint instead of copying its entire divergent code/doc tree into public main. This keeps one versioned requirement source and makes integration work explicit.

- Local documentation branch and remote tag: `codex/ahmed-collaboration-brief`, based on main `836eaa58091a91ea28c08bfb4b3719ee84ebfecd`.
- Tested product: `e976747564a5d039ac42129ab085246e77f8d1a9`, from the remotely fetched tag `codex/otterly-inquiry-handoff-2026-09-20`.
- Existing product/root checkouts and their dirty documents were not overwritten.
- The obsolete 12 September implementation-status file is preserved byte-for-byte under `docs/archive/`; replacement routes to current sources. Other original notes have visible scope notices.
- No issue was archived merely for being old, and no incomplete MVP outcome was marked Done. Relevant dependency edges were inspected and retained: MIN-12 → MIN-13, MIN-5 → MIN-6, MIN-6 → MIN-7.

## Fixed checks and actual evidence
| Case | Actions and pass condition | Actual result |
| --- | --- | --- |
| ONBOARD-01: fresh product | Fetch repository; check out exact product SHA in a separate worktree without owner's ignored data; build and run full checks with specified PDF runtime. Pass only with zero failed tests. | PASS: Node 26.7.0; Python 3.12.14 / ReportLab 4.4.9; site/platform checks and 127 tests passed. Initial sandbox run blocked localhost sockets (EPERM); rerun with localhost capability passed. No product defect inferred from sandbox failure. |
| ONBOARD-02: portable requirements | Run `npm run check:requirements` from fresh product. Pass only if structure and validator regression suite succeed. | PASS: 97 rows, 7 regression tests. Source reconciliation NOT RUN; missing original archives are not fabricated. |
| ONBOARD-03: public boundary | Run `npm run build:public` from product. Require website allowlist and private-data/route exclusions. | PASS. No release/deployment initiated. |
| ONBOARD-04: documented startup | Start `npm start` on 4337 with new `data/ahmed-preview.sqlite`, no evidence environment configuration. Request /, /app/, /results/; acquire session and request saved-results API. Require HTTP 200 and honest unavailable evidence. | PASS: all three pages HTTP 200; API returned `{"available":false}`. Test server stopped and only its disposable DB/journals removed. Existing previews untouched. Rendered browser/human usability NOT RUN in this cleanup. |
| ONBOARD-05: documentation | Check local relative links and GitHub-pinned paths against fetched objects; diff check; verify historical snapshot matches old bytes. Require no missing documented source. | PASS: 15 local links, 15 pinned GitHub paths/objects, archive byte identity; whitespace check corrected and passed. |
| ONBOARD-06: shareable brief | Create PDF from the 432-word Markdown, require one page, inspect rendered page and clickable annotations. | PASS: one page, 8 links, rendered page inspected without clipped text or overlap. PDF is a dated derivative; Markdown is editable source. |
| ONBOARD-07: remote/tracker | Push only the docs checkpoint tag; verify its commit and changed paths. Read back edited Linear records and verify status/dependency preservation. | Final remote and readback receipt belongs on MIN-16. |
| ONBOARD-08: Ahmed first visit | Ahmed opens GitHub/Linear/Figma using his own accounts and follows setup without the owner narrating. Expected: correct baseline, current vs proposed scope, one agreed next action. | NOT RUN. Invitations/account access and Ahmed's own machine are outside this cleanup. |

A failed command/incorrect result is FAIL; missing access/runtime/source is BLOCKED; an unexecuted check is NOT RUN. None is converted into product acceptance. The optional pip environment-install commands were not executed; an existing runtime supplied PDF dependencies.

## Linear corrections
- Project overview: collaborator links, accurate authority map, owner-machine preview limitation.
- MIN-14: current pointer ahead of historical receipts; obsolete bridge-as-next-work and unsent-inquiry statements explicitly dated.
- MIN-10: distinguish owner's retained-sample walkthrough from fresh-clone setup.
- MIN-15: proposed Figma concept visible in the description, with approval and verification limits.
- MIN-16: this bounded cleanup and its remote/verification receipt. Product statuses and blockers remain.

## Source basis
Git/Linear facts above were read directly on 20 September 2026. Current project policy remains in the pinned [delivery governance](https://github.com/taitgoodwin-gmail/MindLeverX/blob/e976747564a5d039ac42129ab085246e77f8d1a9/docs/delivery-governance.md).

Official pages checked 20 September:
- [GitHub: creating a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request): source/base branch selection and draft PR workflow. Our choice: isolated local docs-only branch; no PR or merge because branch publication can trigger previews.
- [Linear: issue relations](https://linear.app/docs/issue-relations): blocked/related/duplicate semantics; resolving a blocker moves its relation to Related. Our choice: retain unresolved qualification issues and real blocking edges.
These are documented behaviors; the short reading path and recommended initial UX review are our implementation choices. Time saved, comprehension, revenue and client benefit are not measured.

Publication adjustment: only the explicit tag is pushed. [Vercel Git integration](https://vercel.com/docs/git) documents automatic branch-push deployments; [tag/release deployments](https://vercel.com/kb/guide/can-you-deploy-based-on-tags-releases-on-vercel) describes a separately configured workflow. These sources were checked 20 September, and no repository Actions workflow is present. This follows the existing checkpoint convention without changing deployment settings. Main still needs a separately scoped documentation integration.

## Public-repository follow-up — 20 September
Owner supplied the repository settings URL and reported making GitHub public for Ahmed. GitHub API confirmed visibility=public and private=false. Added the shareable repository URL (not its administration settings URL) to the Markdown/PDF brief and corrected setup/access wording. The revised PDF remains one page; its rendered output and eight link annotations were checked. Source-text whitespace checks passed; PDF xref whitespace is format data and excluded. No product tests rerun for this link-only edit. New checkpoint tag: `codex/ahmed-collaboration-brief-v2`; prior tag retained. Linear invitation instructions checked against https://linear.app/docs/invite-members on 20 September. No invitation sent.
