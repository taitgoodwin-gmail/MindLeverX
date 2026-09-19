# Vercel website deployment

September 13 plan and billing follow-up: see the [purchase and release record](build-guidance.md#purchases-and-release-record) for the owner's intended upgrade timing and Vercel's commercial-use requirement. The currently deployed marketing website and the future functional application are separate release states.

The first Vercel deployment publishes the seven public website pages. Audit requests and newsletter subscriptions are not open yet, and the published pages show this directly without collecting email addresses or company domains.

The Vercel project is `mindleverx` in the **MindLeverX** team (slug `mind-lever-gmail`). Its connected Git repository is `taitgoodwin-gmail/MindLeverX`. Vercel uses Node.js 24.x, the Other framework preset, `npm run build:public`, and the `public-dist` output directory. The local project link and downloaded environment files are ignored by Git.

Production website: **https://mindleverx.com/**. Both the apex domain and `www.mindleverx.com` are verified and attached to this project. The fallback https://mindleverx.vercel.app/ remains available. Project dashboard: https://vercel.com/mind-lever-gmail/mindleverx. Pushes to `main` trigger production builds through the GitHub integration.

The first production deployment was verified on September 12, 2026: all seven pages and four support files returned HTTP 200; page canonical URLs used the production hostname; public pages contained no forms. The operator workspace, API, database, environment-file and source-page paths returned HTTP 404. Desktop and mobile browser checks verified layout, navigation and theme switching. The public build checks and all nine local integration tests passed.

## Build and verify

```sh
node scripts/build.mjs --public
node scripts/check-public.mjs
```

The public build writes only the seven pages, `runtime.js`, `robots.txt`, `sitemap.xml` and `llms.txt` to `public-dist/`. It excludes the operator workspace, API, database, reference documents and project source files. The Vercel project's output directory must be `public-dist`; the framework preset is Other. No application server is needed for these static pages.

Default `npm run build` still writes the full local website and operator interface to `dist/`. Run `npm run dev` for the existing local workflows and SQLite persistence. Public build changes do not remove or rewrite local data.

## Canonical origin

The public build selects the origin for canonical links, Open Graph URLs, structured data, the sitemap, robots and `llms.txt` in this order:

1. `MLX_SITE_URL`, an HTTPS origin such as `https://your-domain.example`.
2. Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, prefixed with `https://`.
3. The existing `https://mindleverx.com` fallback for local builds without deployment configuration.

`MLX_SITE_URL=https://mindleverx.com` is configured in Vercel for production and preview builds. When changing the primary domain, verify and attach it, update this environment variable, and rebuild so generated metadata follows that domain. Preview builds should retain the production origin.

## Production application work remains

The local HTTP server binds to loopback and rejects other Host/Origin values. Its session token protects local actions but does not authenticate an operator. It also stores sessions in process memory and persists business records to a local SQLite file. Public operator access requires production authentication and authorization, a durable hosted data store, and a deployment-compatible API. Those changes are outside this website deployment.

Sample measurement labels and the dated case-study context remain visible on the published site. Engine collection, automated audit execution, email delivery, subscriptions and billing remain unconnected.

## Release checkpoint — 17 September 2026

Owner requested harmonization/finalization followed by GitHub push and Vercel deployment. Framework and project skill release contains no public HTML, CSS, theme or runtime changes. Existing local report-builder code is included in the branch but remains excluded from the public website artifact. `npm run check` passed all 55 tests and site/platform checks; `npm run build:public` passed the website-only boundary check. No new live audit, payment workflow or private client delivery is established by this release.

Read-only billing inspection on 17 September Eastern showed **Hobby Plan — Active**, with no payment method. Current [Vercel Hobby guidance](https://vercel.com/docs/plans/hobby), checked the same date, restricts Hobby to personal noncommercial use. New production publication is therefore held pending a suitable plan; no upgrade, card entry or new paid usage is authorized by a deployment request alone. The current production deployment remains `0fc5498` / `dpl_9vdh6v363WrvL6usAfYNhre2xBG5`, READY when inspected.

The prepared work was backed up and the remote verified at commit `84f6cf0` as Git tag `codex/tenets-v1-2026-09-17`, preserving a reviewable GitHub checkpoint without moving the production branch or the preview branch. No GitHub Actions workflows are present in this repository. Branch release and production deployment remain pending the hosting-plan decision. Verify the remote tag and Vercel deployment list after pushing. This records a coordinator hold, not a Vercel build rejection.

## Reconciliation — 18 September 2026

Owner repeated the finalize/push/deploy request. Clean working tree and remote tag `84f6cf0` were reverified; the completed framework and independent trials do not need repeating. The project skill is now present in the available-skills catalog and the project instructions are supplied to this task. This verifies discovery/presence, not consistent future application.

Fresh signed-in billing inspection at approximately09:29Eastern again showed **Hobby Plan — Active** and no payment method. Rechecked official [Hobby](https://vercel.com/docs/plans/hobby) and [Pro](https://vercel.com/docs/plans/pro-plan) documentation on18September: commercial use requires an appropriate plan; Pro's base platform fee is$20/month with one deploying seat and$20usage credit, plus tax and possible additional usage. No subscription, overage, add-on or account setting was changed. Deployment authorization is retained; purchase authorization is still missing.

Release scope remains the existing static website. Finalized internal instructions, roadmap and local report packaging do not add a public audit service. The public-site source is unchanged, so the September17 test/build evidence remains applicable; no repeat test was run for this documentation-only reconciliation. Production and preview branches remain held; the reconciliation is saved as a separate GitHub tag `codex/release-readiness-2026-09-18`. No active automation change is included.

## Current owner decision — 18 September 2026

Stay on Hobby until final launch unless a specific internal-testing limitation requires reconsideration. This supersedes the pending upgrade-review question above; no purchase is authorized. Continue local internal testing, which does not depend on the Vercel plan. Hosted release remains separate from local readiness; preserve the documented commercial-use discrepancy without asking for an upgrade again absent final-launch work or a concrete new blocker. No deployment or account change performed for this decision.
