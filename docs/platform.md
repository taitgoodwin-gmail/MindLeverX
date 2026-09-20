# Local operator workspace

> Scope notice added 20 September 2026: this document describes the original public-main/local-workspace baseline. It is not the latest report-product status or verification receipt. Start with the [current baseline map](collaborator-start.md); use its pinned product documentation for newer capabilities. Historical observations below remain dated evidence.

The platform turns the five reference screens into a connected local workflow. Open `/app/` while the application server is running.

## Available workflows

- `#/console`: review queue, client pulse and recent activity.
- `#/clients`: searchable client directory; `#/clients/new` creates a local client with no score.
- `#/clients/:id`: stage, status, notes, reviews, prompt panel and record history. Stage changes record operational status; they do not trigger automation.
- `#/reviews/:id`: review content and evidence, with an approval or return requiring a decision note. A saved approval does not deliver a report.
- `#/panels/:id`: read immutable prompt-panel versions and create a replacement version with an explanation.
- `#/leads`: filter local website submissions and record reviewed, archived or restored status. These actions do not send email.
- `#/activity`: persisted changes with actor and time.
- `#/preview/:reviewId`: internal, light-chrome report preview with browser printing / Save as PDF.

## Data and boundaries

The client calls `GET /api/session` before loading `GET /api/workspace`. Mutations send the session token in `X-CSRF-Token` and use the server's client, review-decision, lead and panel routes. No records are stored in browser localStorage.

Sample client scores and evidence remain labeled SAMPLE, including report previews. Newly created clients have no synthetic readings. Submitted leads are distinct from the sample client dataset. There are no working engine-run, payment, publishing or email actions in the interface. The local operator workspace is not an authenticated client portal.

The UI uses semantic links, buttons and labeled forms, responsive tables, visible keyboard focus, reduced-motion support, mobile navigation, informative empty/error states and a print stylesheet. The visual direction follows the reference's Spectral headings, IBM Plex Sans/Mono typography, paper surfaces, dark operator rail and oxblood actions, with darker metadata for readability.

The archive contains reference designs and historical decision documents rather than a complete backend specification. This build does not ratify audit pricing, ICP, scoring formulas, live measurement cadence or delivery commitments.
