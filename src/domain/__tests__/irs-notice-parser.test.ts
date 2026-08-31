/* ═══════════════════════════════════════════════════════════
   IRS NOTICE PARSER TESTS — tests the document-intelligence
   anchor module for Wave 2.

   Tests cover:
   - Notice type detection (CP2000, CP14, CP504, CP523, UNKNOWN)
   - Structured data extraction for each notice type
   - Deadline computation
   - Response strategy generation
   - Extraction confidence scoring
   - Missing field detection

   ═══════════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  detectNoticeType,
  parseIRSNotice,
  getResponseStrategy,
  type IRSNoticeData,
} from "../irs-notice-parser";

// ── Sample notice texts ─────────────────────────────────────

const CP2000_SAMPLE = `
Internal Revenue Service
CP 2000
Notice Date: March 15, 2026

Tax Year: 2024

Dear John Q. Taxpayer,
SSN: 123-45-6789

We are proposing changes to your 2024 tax return based on income
that appears to have been underreported.

The following discrepancies were identified:

Wages Income                    $45,000          $52,000          $7,000
Dividend Income                 $1,200           $3,500           $2,300
Capital Gains                   $5,000           $15,000          $10,000

Total adjustment: $19,300

You must respond within 30 days of the date of this notice.

Notice Number: CP2000
`;

const CP14_SAMPLE = `
Internal Revenue Service
CP 14
Notice Date: January 10, 2026

Tax Period: December 31, 2024

Dear Jane Taxpayer,
SSN: 987-65-4321

Amount you owe: $3,250.00
Penalty: $325.00
Interest: $85.00

Tax due and payable for the period shown above.

Notice Number: CP14
`;

const CP504_SAMPLE = `
Internal Revenue Service
CP 504
Notice Date: June 1, 2026

Final Notice of Intent to Levy

Dear Taxpayer,
SSN: 555-44-3333

Tax Year: 2023

We have sent you previous notices about your unpaid taxes.
This is our final notice before we levy your assets.

You must respond within 30 days of the date of this notice.

Balance Due: $12,500.00

Notice Number: CP504
`;

const CP523_SAMPLE = `
Internal Revenue Service
CP 523
Notice Date: April 20, 2026

Notice of Default on Installment Agreement

Dear Taxpayer,
SSN: 777-88-9999

Tax Year: 2022

Your installment agreement has defaulted because we did not receive
the required payment.

Defaulted amount: $450.00
Remaining balance: $8,200.00

You must respond within 30 days of the date of this notice.

Notice Number: CP523
`;

const UNKNOWN_SAMPLE = `
Some random letter that doesn't match any IRS notice pattern.
It's just a regular correspondence letter.
`;

// ── Notice Type Detection ────────────────────────────────────

describe("IRS Notice Parser — detectNoticeType", () => {
  it("detects CP2000 from notice number", () => {
    expect(detectNoticeType(CP2000_SAMPLE)).toBe("CP2000");
  });

  it("detects CP2000 from 'underreported income' pattern", () => {
    expect(detectNoticeType("Notice of Underreported Income for tax year 2024")).toBe("CP2000");
  });

  it("detects CP14 from balance due pattern", () => {
    expect(detectNoticeType(CP14_SAMPLE)).toBe("CP14");
  });

  it("detects CP504 from intent to levy pattern", () => {
    expect(detectNoticeType(CP504_SAMPLE)).toBe("CP504");
  });

  it("detects CP504 from 'final notice' + 'levy' pattern", () => {
    expect(detectNoticeType("Final Notice — Intent to Levy your property")).toBe("CP504");
  });

  it("detects CP523 from installment agreement default pattern", () => {
    expect(detectNoticeType(CP523_SAMPLE)).toBe("CP523");
  });

  it("detects CP523 from 'default on installment' pattern", () => {
    expect(detectNoticeType("Your installment agreement default is now in effect")).toBe("CP523");
  });

  it("returns UNKNOWN for non-IRS documents", () => {
    expect(detectNoticeType(UNKNOWN_SAMPLE)).toBe("UNKNOWN");
  });
});

// ── CP2000 Extraction ───────────────────────────────────────

describe("IRS Notice Parser — CP2000 extraction", () => {
  const data = parseIRSNotice(CP2000_SAMPLE);

  it("extracts notice type", () => {
    expect(data.noticeType).toBe("CP2000");
  });

  it("extracts taxpayer name", () => {
    expect(data.taxpayerName).toContain("John Q. Taxpayer");
  });

  it("extracts SSN", () => {
    expect(data.taxpayerSSN).toBe("123-45-6789");
  });

  it("extracts tax year", () => {
    expect(data.taxYear).toBe("2024");
  });

  it("extracts notice number", () => {
    expect(data.noticeNumber).toBe("CP2000");
  });

  it("extracts income discrepancies", () => {
    expect(data.discrepancies.length).toBeGreaterThan(0);
    const wages = data.discrepancies.find((d) => d.category.includes("Wages"));
    expect(wages).toBeDefined();
    expect(wages?.reportedAmount).toBe(45000);
    expect(wages?.irsAmount).toBe(52000);
    expect(wages?.difference).toBe(7000);
  });

  it("extracts total adjustment", () => {
    expect(data.totalAdjustment).toBe(19300);
  });

  it("computes extraction confidence > 0", () => {
    expect(data.extractionConfidence).toBeGreaterThan(0);
  });

  it("has no missing fields for key extracted data", () => {
    expect(data.missingFields).not.toContain("noticeNumber");
  });
});

// ── CP14 Extraction ─────────────────────────────────────────

describe("IRS Notice Parser — CP14 extraction", () => {
  const data = parseIRSNotice(CP14_SAMPLE);

  it("extracts notice type", () => {
    expect(data.noticeType).toBe("CP14");
  });

  it("extracts taxpayer name", () => {
    expect(data.taxpayerName).toContain("Jane Taxpayer");
  });

  it("extracts SSN", () => {
    expect(data.taxpayerSSN).toBe("987-65-4321");
  });

  it("extracts amount owed", () => {
    expect(data.amountOwed).toBe(3250);
  });

  it("extracts penalty amount", () => {
    expect(data.penaltyAmount).toBe(325);
  });

  it("extracts interest amount", () => {
    expect(data.interestAmount).toBe(85);
  });

  it("sets balanceDue from amount owed", () => {
    expect(data.balanceDue).toBe(3250);
  });
});

// ── CP504 Extraction ─────────────────────────────────────────

describe("IRS Notice Parser — CP504 extraction", () => {
  const data = parseIRSNotice(CP504_SAMPLE);

  it("extracts notice type", () => {
    expect(data.noticeType).toBe("CP504");
  });

  it("extracts SSN", () => {
    expect(data.taxpayerSSN).toBe("555-44-3333");
  });

  it("extracts tax year", () => {
    expect(data.taxYear).toBe("2023");
  });

  it("sets levy warning flag", () => {
    expect(data.levyWarning).toBe(true);
  });

  it("extracts balance due", () => {
    expect(data.balanceDue).toBe(12500);
  });
});

// ── CP523 Extraction ─────────────────────────────────────────

describe("IRS Notice Parser — CP523 extraction", () => {
  const data = parseIRSNotice(CP523_SAMPLE);

  it("extracts notice type", () => {
    expect(data.noticeType).toBe("CP523");
  });

  it("extracts SSN", () => {
    expect(data.taxpayerSSN).toBe("777-88-9999");
  });

  it("sets installment agreement default flag", () => {
    expect(data.installmentAgreementDefault).toBe(true);
  });

  it("extracts defaulted amount", () => {
    expect(data.defaultedAmount).toBe(450);
  });

  it("extracts remaining balance", () => {
    expect(data.remainingBalance).toBe(8200);
  });

  it("sets balanceDue from remaining balance", () => {
    expect(data.balanceDue).toBe(8200);
  });
});

// ── Unknown Notice ───────────────────────────────────────────

describe("IRS Notice Parser — unknown notice", () => {
  const data = parseIRSNotice(UNKNOWN_SAMPLE);

  it("returns UNKNOWN type", () => {
    expect(data.noticeType).toBe("UNKNOWN");
  });

  it("has zero confidence", () => {
    expect(data.extractionConfidence).toBe(0);
  });

  it("has all fields in missingFields", () => {
    expect(data.missingFields.length).toBeGreaterThan(0);
  });
});

// ── Response Strategy ───────────────────────────────────────

describe("IRS Notice Parser — response strategy", () => {
  it("returns CP2000 strategy with 30-day window", () => {
    const strategy = getResponseStrategy("CP2000");
    expect(strategy.responseWindow).toContain("30 days");
    expect(strategy.urgency).toBe("high");
    expect(strategy.strategy.length).toBeGreaterThan(0);
    expect(strategy.evidenceToGather.length).toBeGreaterThan(0);
    expect(strategy.warnings.length).toBeGreaterThan(0);
  });

  it("returns CP14 strategy with pay immediately urgency", () => {
    const strategy = getResponseStrategy("CP14");
    expect(strategy.urgency).toBe("high");
    expect(strategy.filingOptions).toContain("Pay in full — online, by phone, or by check");
  });

  it("returns CP504 strategy with CRITICAL urgency", () => {
    const strategy = getResponseStrategy("CP504");
    expect(strategy.urgency).toBe("critical");
    expect(strategy.responseWindow).toContain("30 days");
    expect(strategy.warnings.some((w) => w.includes("levy"))).toBe(true);
    expect(strategy.filingOptions.some((f) => f.includes("CDP hearing"))).toBe(true);
  });

  it("returns CP523 strategy with reinstatement option", () => {
    const strategy = getResponseStrategy("CP523");
    expect(strategy.urgency).toBe("high");
    expect(strategy.filingOptions.some((f) => f.includes("Reinstate"))).toBe(true);
    expect(strategy.warnings.some((w) => w.includes("terminated"))).toBe(true);
  });

  it("returns default strategy for UNKNOWN", () => {
    const strategy = getResponseStrategy("UNKNOWN");
    expect(strategy.urgency).toBe("standard");
    expect(strategy.warnings[0]).toContain("Unknown notice type");
  });
});
