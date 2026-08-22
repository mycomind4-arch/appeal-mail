# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

---

## Overview

20 core appeal workflows across 7 categories, with the initial 20-workflow Gold pass complete. Gold retrofit pass is now underway for earlier transactional workflows.

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

## Workflow Notes

### Insurance Claim Appeal
Canonical public route: `/workflows/insurance-claim-appeal`
Execution engine: existing `denied-claim` workflow engine with Gold authority, pricing, approval, checkout, MailMyPDF fulfillment, provider tracking, and proof.

The Gold pricing model is transparent and packet-based: preparation fee, included response sheets, extra response sheets, supporting-document sheets, mailing method, and packet surcharge when required.

### Other Core Workflows
See the catalog entries below and the corresponding Gold PRs for their authority and execution contracts.

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Gold transactional workflow pages include workflow-specific `/workflows/...` routes.

## Catalog Entry Schema

Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta
