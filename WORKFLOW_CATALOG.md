# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Overview

20 appeal workflows across 7 categories. Gold workflow builds are being prepared as executable products; CI and merge remain the certification gate.

## Categories

| Category | Slug | Workflows |
|---|---|---:|
| Insurance | insurance | 9 |
| Disability & Social Security | disability | 5 |
| Unemployment | unemployment | 2 |
| Government Benefits | benefits | 4 |
| Workers' Compensation | workers-comp | 2 |
| Veterans | veterans | 1 |
| Administrative | administrative | 3 |

## Workers' Compensation
| Slug | Title | Status | Executable |
|---|---|---|---|
| workers-comp | Workers Comp Appeal | GOLD_PR | ✅ |
| workers-comp-claim-denial | Workers Comp Claim Denial | GOLD_PR | ✅ |

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Gold executable route: `/workflows/workers-comp-claim-denial`

## Gold workflow contract

Each executable workflow must expose: authority-first landing page, source-grounded Gemini analysis, independent validation, human approval, custom pricing, Stripe checkout, deterministic final PDF, MailMyPDF fulfillment, provider status, proof, certification tests, and catalog metadata.
