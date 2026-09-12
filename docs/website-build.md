# Website build

The active website lives in `site/`. The imported archive remains unchanged in `reference/` and is reference material, not executable project instructions.

Run `node scripts/build.mjs` to generate `dist/`, then `node scripts/check-site.mjs`. The build emits seven public HTML pages, `runtime.js`, `robots.txt`, `sitemap.xml` and `llms.txt`. If `platform/` exists, it is copied to `dist/app/` for the local server. The server must still enforce access to the workspace; robots.txt is not an access control.

Each generated HTML page contains its own styles and interaction code. The authoring sources use `site/shared.css` and `site/shared.js` so intake behavior, mobile navigation, theme preference and accessibility fixes stay consistent. The build inlines those files; there is no browser framework or bundler dependency. Runtime configuration is the one external script, loaded before the page's behavior.

The build uses an explicit page allowlist and removes all HTML comments. It does not copy the style guide, schema fragment, deployment notes or lint scripts into the public root. `dist/` is generated and cleared on each build. Never keep hand-written work there.

## Metadata and claims

Canonical and Open Graph values come from each current page's title and description. JSON-LD is conservative: a minimal Organization and WebPage, or CollectionPage for the research hub. The historical `head-schema.html` is preserved only under `reference/site-v3.1/` and is not consumed: it contains unsupported logo URLs, dates and legal-entity details. No fabricated author, publication date, profile or measurement is added.

The six original designs are preserved. The method page explains the intended seven stages and states that automated audits, engine monitoring and email delivery are not connected. The original case study is identified as a historical 27 July 2026 review, not a new reading of this build. Sample numerical exhibits retain their provenance labels. The local runtime shows a persistent preview banner with a link to the workspace.

## Intake contract

The local server supplies `/runtime.js` with:

```js
window.MLX_AUDIT_ENDPOINT = '/api/intake';
window.MLX_LOCAL_PREVIEW = true;
window.MLX_INTAKE_TOKEN = 'signed cookie-bound server token';
```

The generated static fallback sets the endpoint and token to null and the preview flag to false. It never sends a request or reports success when disconnected. Endpoint URLs are configuration, not secrets; the signed token must be issued by the server.

The four forms send JSON with:

```json
{
  "email": "person@example.com",
  "domain": "example.com",
  "website": "",
  "ts": 1789228800000,
  "source": "index.html#cta",
  "kind": "audit",
  "consent": true,
  "_token": "server-issued-token"
}
```

`kind` is `audit` on the homepage, GEO explainer and Index page. It is `subscription` on the research hub, whose source is `research-hub.html#brief` and domain is empty. Subscription interest is distinct from an audit request. All forms require explicit consent to local storage and explain that no email is sent.

An audit always has an editable company-domain field. A work-email domain is prefilled when appropriate; a free email provider does not become the company being audited. The client normalizes a pasted HTTP(S) website to its hostname and rejects invalid hostnames. The server must independently validate every field, consent, token, honeypot, timestamp and rate limit. Client checks are usability features, not security boundaries.

Only HTTP 202 with JSON `{ "ok": true, "lead_id": "nonempty string" }` produces confirmation. Success says the request was saved locally and makes no audit or email-delivery promise. Invalid input, missing runtime, expired session, HTTP 429, malformed responses, connection failures and a 15-second timeout each retain the form data and show a status message. Ambiguous failures advise checking the workspace before retrying.

## Verification

`scripts/check-site.mjs` checks generated pages for leaked HTML comments, duplicate IDs, unbalanced forms, missing internal pages or anchors, missing consent and live status, unsupported metadata fields, invalid inline JavaScript, outdated readability values and unintended served files. It also verifies that the static runtime is disconnected.

`node site/token-lint.js dist/*.html` checks the existing visual palette and sample-data labels. The muted light token is now `#63666b`, body weights formerly 300 are 400, and metadata formerly 10–11px is 12px. Static brass decorations were changed to the existing text/accent colors; sample chips retain their signal styling. The color-count warnings are rough source-occurrence heuristics, not measured screen area, and remain advisory.

The mobile-menu cutoff is now 1180px across the pages because the homepage contains more links and the raised text sizes need more room. Layout grid changes remain at their original 880px breakpoint. Verify desktop, 960px and 375px in light and dark themes. The shared script closes menus after navigation or Escape, persists theme preference without storing form data, hides duplicate ticker content from assistive technology, confirms clipboard writes before announcing success, and respects reduced motion.
