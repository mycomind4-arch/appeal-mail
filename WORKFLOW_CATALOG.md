# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Unemployment
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| unemployment | Unemployment Appeal | GOLD | ✅ |
| edd | EDD Appeal | COMING_SOON | ❌ |

The `unemployment` entry is implemented at `/workflows/unemployment-appeal` with the authority-first P03 pipeline, custom pricing, Gemini analysis/drafting/validation, human approval, Stripe checkout, deterministic PDF, MailMyPDF fulfillment, tracking, and proof.

## Existing catalog
All other catalog entries remain unchanged. The generic catalog schema remains: slug, title, category, descriptions, SEO metadata, route, status, engine, executable, and CTA.
