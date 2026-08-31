import test from "node:test";
import assert from "node:assert/strict";
import { PRIOR_AUTHORIZATION_DENIAL_GOLD, PRIOR_AUTHORIZATION_DENIAL_PRICING } from "../src/domain/prior-authorization-denial-gold";

test("Workflow #28 prior-authorization-denial locks authority-first behavior", () => {
  assert.equal(PRIOR_AUTHORIZATION_DENIAL_GOLD.workflowId, "prior-authorization-denial");
  assert.equal(PRIOR_AUTHORIZATION_DENIAL_GOLD.lifecycle, "authority");
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_GOLD.capabilities.includes("independent-validation"));
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_GOLD.capabilities.includes("human-approval"));
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_GOLD.capabilities.includes("pricing"));
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_GOLD.capabilities.includes("proof"));
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_GOLD.authorityRules.some((rule: string) => rule.includes("Never invent")));
});

test("Workflow #28 pricing is transparent and bounded", () => {
  assert.equal(PRIOR_AUTHORIZATION_DENIAL_PRICING.preparationFee, 59.99);
  assert.equal(PRIOR_AUTHORIZATION_DENIAL_PRICING.includedResponsePages, 8);
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_PRICING.supportingPagePrice >= 0);
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_PRICING.certifiedMail > PRIOR_AUTHORIZATION_DENIAL_PRICING.standardMail);
  assert.ok(PRIOR_AUTHORIZATION_DENIAL_PRICING.registeredMail >= PRIOR_AUTHORIZATION_DENIAL_PRICING.certifiedMail);
});
