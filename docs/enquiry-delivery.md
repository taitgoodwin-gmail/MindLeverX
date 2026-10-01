# Website enquiry integration — public handoff

## Scope

MindLeverX uses a public enquiry form and a private, server-configured recipient. Public copy uses the MindLeverX brand and collective voice. The integration is prepared in source; this handoff does not claim production activation or verified inbox delivery.

This public version omits account setup history, infrastructure identifiers, operational security configuration and private deployment notes. The complete original notes remain in the local integration backup; they must not be copied to the public repository. Credentials, tokens and mailbox addresses are excluded from both this document and source configuration.

## Source map

- `api/enquiry.js`: isolated contact endpoint, separate from the private operator application.
- `lib/enquiry.mjs`: request validation, mail transport, provider error handling and submission throttling.
- `site/shared.js`: submission states, accessible status messages, input preservation on failure and duplicate-click prevention.
- `site/public-profile.json`: public availability and form configuration.
- `scripts/authorize-gmail.mjs`: local OAuth setup helper. Run only when explicitly setting up an authorized mailbox; it is not a website route.
- `.env.example`: configuration names with empty credential values. Supply actual values privately through the runtime environment.

## Expected behavior

Missing configuration fails closed. The server validates inputs and owns the sender and recipient; visitors cannot override delivery configuration. Provider errors must not reveal credentials or submitted personal information. A provider's acceptance response is not proof of inbox receipt. Failed submissions retain visitor input, and ambiguous sends are not automatically retried.

The authorization helper requests send-only access, preserves privately configured sender/recipient values, and writes credentials only to ignored local configuration. It contains no mailbox login hint. Supply `MLX_GMAIL_FROM` and `MLX_ENQUIRY_TO` privately before configuring delivery.

## Verification and release boundary

The focused enquiry and site-interaction tests passed 19/19 with mocked mail transport. The public build and serving-boundary checks also passed. These checks do not verify hosted delivery, effective distributed abuse protection or a recipient's inbox.

Before enabling public submission, verify the deployed function package, authorized sender/recipient configuration, effective abuse protection, actual receipt and error recovery. Record private operational evidence outside public source control. Production release is a separate decision.

## Implementation references

- [Gmail sending guide](https://developers.google.com/workspace/gmail/api/guides/sending)
- [Gmail scopes](https://developers.google.com/identity/protocols/oauth2/scopes#gmail)
- [Google server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js)
