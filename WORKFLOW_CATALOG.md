# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22
**Commit:** licensing-appeal-gold

---

## Overview

20 appeal workflows across 7 categories. 5 implemented, 15 remaining.

## Categories

| Category | Slug | Workflows |
|----------|------|-----------|
| Insurance | insurance | 9 |
| Disability & Social Security | disability | 5 |
| Unemployment | unemployment | 2 |
| Government Benefits | benefits | 4 |
| Workers' Compensation | workers-comp | 2 |
| Veterans | veterans | 1 |
| Administrative | administrative | 3 |

### Implemented administrative Gold workflows

| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| agency-decision | Agency Decision Appeal | GOLD PR | ✅ |
| administrative-decision | Administrative Decision Appeal | GOLD PR | ✅ |
| licensing | Licensing Appeal | GOLD PR | ✅ |

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Executable workflow: `/workflows/licensing-appeal`

## Gold workflow contract

Each Gold administrative workflow includes an authority-first landing page, source-grounded Gemini analysis, authority-safe drafting, evidence/contradiction review, human approval, deterministic final-response PDF generation, Stripe checkout, MailMyPDF fulfillment, provider status/tracking, and proof-of-mailing state.

## Catalog Entry Schema

Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta
