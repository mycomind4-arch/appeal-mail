# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Overview

20 appeal workflows across 7 categories. Gold workflow builds are tracked separately by PR.

### Gold-completed workflow builds

- Denied Claim — flagship existing implementation
- Government Decision — PR #2
- Agency Decision Appeal — PR #3
- Administrative Decision Appeal — PR #4
- Licensing Appeal — PR #5
- SSDI Appeal — PR #6
- Social Security Reconsideration — PR #6
- Social Security Overpayment Appeal — PR #7
- Appeals Council Appeal — PR #8
- Unemployment Appeal — PR #9
- EDD Appeal — PR #10
- Medicaid Appeal — PR #11
- SNAP Appeal — PR #12
- Government Benefits Denial Appeal — PR #13
- SNAP Eligibility Appeal — PR #14
- Workers' Compensation Appeal — PR #15
- Workers' Compensation Claim Denial Appeal — PR #16
- VA Claim Appeal — current PR

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

## Workflow status

| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| insurance-claim | Insurance Claim Appeal | IMPLEMENTED | ✅ |
| health-insurance | Health Insurance Appeal | COMING_SOON | ❌ |
| medical-claim | Medical Claim Appeal | COMING_SOON | ❌ |
| prior-authorization | Prior Authorization Appeal | COMING_SOON | ❌ |
| out-of-network | Out-of-Network Appeal | COMING_SOON | ❌ |
| no-authorization | No Authorization Appeal | COMING_SOON | ❌ |
| timely-filing | Timely Filing Appeal | COMING_SOON | ❌ |
| medicare | Medicare Appeal | COMING_SOON | ❌ |
| dental-insurance | Dental Insurance Appeal | COMING_SOON | ❌ |
| ssi | SSI Appeal | COMING_SOON | ❌ |
| ssdi | SSDI Appeal | COMING_SOON | ❌ |
| social-security-reconsideration | Social Security Reconsideration | GOLD_PR_OPEN | ✅ |
| social-security-overpayment | Social Security Overpayment Appeal | GOLD_PR_OPEN | ✅ |
| appeals-council | Appeals Council Appeal | GOLD_PR_OPEN | ✅ |
| unemployment | Unemployment Appeal | GOLD_PR_OPEN | ✅ |
| edd | EDD Appeal | GOLD_PR_OPEN | ✅ |
| medicaid | Medicaid Appeal | GOLD_PR_OPEN | ✅ |
| snap | SNAP Appeal | GOLD_PR_OPEN | ✅ |
| benefits-denial | Benefits Denial Appeal | GOLD_PR_OPEN | ✅ |
| snap-eligibility | SNAP Eligibility Appeal | GOLD_PR_OPEN | ✅ |
| workers-comp | Workers Comp Appeal | GOLD_PR_OPEN | ✅ |
| workers-comp-claim-denial | Workers Comp Claim Denial | GOLD_PR_OPEN | ✅ |
| va-claim | VA Claim Appeal | GOLD_PR_OPEN | ✅ |
| agency-decision | Agency Decision Appeal | GOLD_PR_OPEN | ✅ |
| administrative-decision | Administrative Decision Appeal | GOLD_PR_OPEN | ✅ |
| licensing | Licensing Appeal | GOLD_PR_OPEN | ✅ |

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Executable Gold workflow pages use `/workflows/<slug>`.

## Catalog entry schema

Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta
