# Vercel website deployment

The first Vercel deployment publishes the seven public website pages. Audit requests and newsletter subscriptions are not open yet, and the published pages show this directly without collecting email addresses or company domains.

The Vercel project is `mindleverx` in the **MindLeverX** team (slug `mind-lever-gmail`). Its connected Git repository is `taitgoodwin-gmail/MindLeverX`. Vercel uses Node.js 24.x, the Other framework preset, `npm run build:public`, and the `public-dist` output directory. The local project link and downloaded environment files are ignored by Git.

Production website: **https://mindleverx.vercel.app/**. Project dashboard: https://vercel.com/mind-lever-gmail/mindleverx. Pushes to `main` trigger production builds through the GitHub integration.

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

For the initial deployment, use the actual Vercel production hostname returned by the project configuration, or set `MLX_SITE_URL` once the chosen domain is verified and attached. Do not set an invented Vercel hostname. When adding a custom domain, update the environment variable and rebuild so generated metadata follows that domain. Preview builds should retain the production origin.

## Production application work remains

The local HTTP server binds to loopback and rejects other Host/Origin values. Its session token protects local actions but does not authenticate an operator. It also stores sessions in process memory and persists business records to a local SQLite file. Public operator access requires production authentication and authorization, a durable hosted data store, and a deployment-compatible API. Those changes are outside this website deployment.

Sample measurement labels and the dated case-study context remain visible on the published site. Engine collection, automated audit execution, email delivery, subscriptions and billing remain unconnected.
