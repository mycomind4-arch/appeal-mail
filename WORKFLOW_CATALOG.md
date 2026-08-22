# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Overview
20 appeal workflows across 7 categories. Gold workflow branches are implemented behind PRs; CI remains the certification gate.

## Categories
| Category | Slug | Workflows |
|---|---|---|
| Insurance | insurance | 9 |
| Disability & Social Security | disability | 5 |
| Unemployment | unemployment | 2 |
| Government Benefits | benefits | 4 |
| Workers' Compensation | workers-comp | 2 |
| Veterans | veterans | 1 |
| Administrative | administrative | 3 |

## Completed Gold sequence
- Workflow #19: Agency Decision Appeal — executable ✅

## Administrative
| Slug | Title | Status | Executable |
|---|---|---|---|
| agency-decision | Agency Decision Appeal | GOLD PR | ✅ |
| administrative-decision | Administrative Decision Appeal | COMING_SOON | ❌ |
| licensing | Licensing Appeal | COMING_SOON | ❌ |

## Routes
- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow page: `/workflows/agency-decision-appeal`

## Catalog Entry Schema
Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta.
