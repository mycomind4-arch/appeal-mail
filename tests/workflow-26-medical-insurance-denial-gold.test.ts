import test from "node:test";
import assert from "node:assert/strict";
import { MEDICAL_INSURANCE_DENIAL_GOLD, MEDICAL_INSURANCE_DENIAL_PRICING } from "../src/domain/medical-insurance-denial-gold";
import { calculateQuote, type MailClass } from "@mailmypdf/pricing";

test("Workflow #26 exposes the locked authority and pricing contract", () => {
  assert.equal(MEDICAL_INSURANCE_DENIAL_GOLD.workflowId, "medical-insurance-denial");
  assert.equal(MEDICAL_INSURANCE_DENIAL_GOLD.lifecycle, "authority");
  assert.ok(MEDICAL_INSURANCE_DENIAL_GOLD.capabilities.includes("independent-validation"));
  assert.ok(MEDICAL_INSURANCE_DENIAL_GOLD.capabilities.includes("human-approval"));
  assert.equal(MEDICAL_INSURANCE_DENIAL_PRICING.preparationFee, 69.99);
  assert.equal(MEDICAL_INSURANCE_DENIAL_PRICING.includedResponsePages, 8);
  assert.ok(MEDICAL_INSURANCE_DENIAL_PRICING.supportingPagePrice >= 0);
});

test("Workflow #26 pricing charges only for response pages beyond inclusion plus supporting sheets and mailing", () => {
  const quote = calculateQuote({ workflowId: "medical-insurance-denial", verticalId: "appeal-mail", actualPages: 6, supportingPages: 2, mailClass: "certified" as MailClass });
  assert.equal(quote.basePriceCents, 6999);
  assert.equal(quote.extraPageCost, 0);
  assert.equal(quote.supportingPageCost, 50);
  assert.equal(quote.totalCents, 8044);
});

test("Workflow #26 standard mail has no upgrade cost", () => {
  const quote = calculateQuote({ workflowId: "medical-insurance-denial", verticalId: "appeal-mail", actualPages: 5, supportingPages: 2, mailClass: "standard" as MailClass });
  assert.equal(quote.mailServiceCost, 0);
  assert.equal(quote.totalCents, 7049);
});
