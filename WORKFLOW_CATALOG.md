# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Government Benefits
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| medicaid | Medicaid Appeal | IMPLEMENTED / GOLD PENDING CI | ✅ |
| snap | SNAP Appeal | COMING_SOON | ❌ |
| benefits-denial | Benefits Denial Appeal | COMING_SOON | ❌ |
| snap-eligibility | SNAP Eligibility Appeal | COMING_SOON | ❌ |

## Medicaid Appeal

Route: `/workflows/medicaid-appeal`

The workflow includes authority-first analysis, federal/state distinction, evidence and contradiction mapping, Gemini drafting and independent validation, human approval, custom page-based pricing, Stripe checkout, deterministic PDF fulfillment, MailMyPDF submission, tracking, and proof.

## Catalog Entry Schema

Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta

## Canonical routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Executable workflows: `/workflows/*`
