# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Overview

20 appeal workflows across 7 categories. The catalog tracks public workflow status; executable workflows use the Gold Standard contract.

## Categories

| Category | Slug | Workflows |
|----------|-------|-----------|
| Insurance | insurance | 9 |
| Disability & Social Security | disability | 5 |
| Unemployment | unemployment | 2 |
| Government Benefits | benefits | 4 |
| Workers' Compensation | workers-comp | 2 |
| Veterans | veterans | 1 |
| Administrative | administrative | 3 |

## Government Benefits

| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| medicaid | Medicaid Appeal | IMPLEMENTED | ✅ |
| snap | SNAP Appeal | IMPLEMENTED | ✅ |
| benefits-denial-appeal | Government Benefits Denial Appeal | IMPLEMENTED | ✅ |
| snap-eligibility | SNAP Eligibility Appeal | COMING_SOON | ❌ |

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Executable workflow: `/workflows/benefits-denial-appeal`

## Catalog Entry Schema

Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta
