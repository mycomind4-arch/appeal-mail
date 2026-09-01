# Appeal Mail — Production Packet Pipeline Status

## Implemented on `feat/production-packet-pipeline`

- Replaced the superseded hand-written `simple-pdf.ts` fulfillment dependency with `pdf-lib` packet assembly.
- Added authenticated `/api/packets/build` with appeal ownership checks and validation of page operations against submitted parts.
- Added packet page operations for ordering, removal, and rotation and persist those operations in the case packet record.
- Added a reusable packet editor to the workflow workspace for final draft edits and supporting-document insertion.
- Added locked final packet metadata, SHA-256 hashes, page count, and source document identities.
- Added generic Stripe fulfillment against the locked packet document rather than rebuilding a PDF in the webhook.
- Added final-draft integrity verification before mailing.
- Added authenticated dashboard APIs for cases and mailings and wired the dashboard UI to them.
- Added packet-builder regression coverage.
- Added a shared control-plane AI task runner and moved the dynamic workflow analysis route to resolve provider configuration centrally.

## Not yet certifiable in this environment

- package-lock.json regeneration after adding dependencies; shell access cannot reach npm.
- Full npm test, build, lint, and Cloudflare deployment execution from this environment.
- Full PDF.js thumbnail rendering; the editor currently operates on packet parts and server page operations.
- Universal migration of every workflow-specific AI route to the shared task runner; some specialized routes still contain provider-specific logic.
- End-to-end verification against live Supabase, Stripe, MailMyPDF, and control-plane credentials.
