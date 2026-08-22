import assert from "node:assert/strict";
import test from "node:test";
import { INSURANCE_CLAIM_APPEAL_AUTHORITY_SOURCES, INSURANCE_CLAIM_APPEAL_PRICING, INSURANCE_CLAIM_APPEAL_RULES } from "../src/domain/insurance-claim-appeal-gold.ts";

const read = async (path: string) => (await import("node:fs/promises")).readFile(path, "utf8");

test("Insurance Claim Appeal Gold pricing and authority contract", () => {
  assert.equal(INSURANCE_CLAIM_APPEAL_PRICING.preparationFee, 24.99);
  assert.equal(INSURANCE_CLAIM_APPEAL_PRICING.includedResponsePages, 3);
  assert.equal(INSURANCE_CLAIM_APPEAL_PRICING.responsePagePrice, 0.4);
  assert.equal(INSURANCE_CLAIM_APPEAL_PRICING.supportingPagePrice, 0.25);
  assert.equal(INSURANCE_CLAIM_APPEAL_PRICING.standardMail, 5.49);
  assert.equal(INSURANCE_CLAIM_APPEAL_PRICING.certifiedMail, 12.49);
  assert.equal(INSURANCE_CLAIM_APPEAL_PRICING.registeredMail, 29.99);
  assert.ok(INSURANCE_CLAIM_APPEAL_AUTHORITY_SOURCES.length >= 3);
  assert.ok(INSURANCE_CLAIM_APPEAL_RULES.some(rule => /never invent/i.test(rule)));
});

test("Insurance Claim Appeal is wired end to end", async () => {
  const files = await Promise.all([
    read("src/routes/workflows/insurance-claim-appeal.tsx"),
    read("src/components/workflow/appeal-workflow-workspace.tsx"),
    read("src/routes/api/workflows/denied-claim/analyze.ts"),
    read("src/routes/api/workflows/denied-claim/draft.ts"),
    read("src/routes/api/workflows/denied-claim/approve.ts"),
    read("src/routes/api/workflows/denied-claim/checkout.ts"),
    read("src/routes/api/stripe-webhook.ts"),
  ]);
  const source = files.join("\n");
  assert.match(source, /insurance-claim-appeal/);
  assert.match(source, /denied-claim/);
  assert.match(source, /Gemini/);
  assert.match(source, /independent/i);
  assert.match(source, /MailMyPDF/);
  assert.match(source, /24\.99/);
  assert.match(source, /0\.4/);
  assert.match(source, /0\.25/);
  assert.match(source, /12\.49/);
  assert.match(source, /29\.99/);
});
