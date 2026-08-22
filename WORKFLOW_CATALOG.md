# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Overview

The catalog includes workflow landing pages and executable Gold workflows. Each executable workflow has a dedicated authority-first page, domain contract, pricing profile, and fulfillment path.

### Disability & Social Security
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| ssi | SSI Appeal | COMING_SOON | ❌ |
| ssdi | SSDI Appeal | IMPLEMENTED | ✅ |
| social-security-reconsideration | Social Security Reconsideration | IMPLEMENTED | ✅ |
| social-security-overpayment | Social Security Overpayment Appeal | IMPLEMENTED | ✅ |
| appeals-council | Appeals Council Appeal | IMPLEMENTED | ✅ |

### Administrative
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| agency-decision | Agency Decision Appeal | COMING_SOON | ❌ |
| administrative-decision | Administrative Decision Appeal | COMING_SOON | ❌ |
| licensing | Licensing Appeal | COMING_SOON | ❌ |

All other existing catalog entries retain their prior status until their dedicated Gold build is merged.

## Appeals Council

- User-facing workflow: **Request Appeals Council Review**
- Route: `/workflows/appeals-council`
- Authority sources: SSA current hearing-review guidance, SSA Appeals Council process guidance, HA-520 instructions, and 20 CFR §§404.968 / 416.1468.
- Primary procedural rule surfaced from current SSA guidance: generally 60 days after receipt, with the applicable notice and governing rules controlling.
- Pricing: $34.99 preparation, 4 response pages included, $0.45 extra response sheet, $0.25 supporting-document sheet, plus selected mailing service and explicit flat-packet surcharge when required.
- Engine: P03 Appeal / Reconsideration
- Status: IMPLEMENTED on this feature branch; CI certification required before production merge.
