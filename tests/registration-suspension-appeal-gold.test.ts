import test from "node:test";
import assert from "node:assert/strict";
import { REGISTRATION_SUSPENSION_APPEAL_GOLD } from "../src/domain/registration-suspension-appeal-gold";

test("enforces authority-first scope and transparent pricing", () => {
  assert.equal(REGISTRATION_SUSPENSION_APPEAL_GOLD.workflowId, "registration-suspension-appeal");
  assert.ok(REGISTRATION_SUSPENSION_APPEAL_GOLD.capabilities.includes("independent-validation"));
  assert.ok(REGISTRATION_SUSPENSION_APPEAL_GOLD.capabilities.includes("human-approval"));
  assert.ok(REGISTRATION_SUSPENSION_APPEAL_GOLD.capabilities.includes("pricing"));
  assert.ok(REGISTRATION_SUSPENSION_APPEAL_GOLD.capabilities.includes("proof"));
  assert.ok(REGISTRATION_SUSPENSION_APPEAL_GOLD.authorityRules.some((rule) => rule.includes("Never invent")));
  assert.equal(REGISTRATION_SUSPENSION_APPEAL_GOLD.pricing.preparationFee, 39.99);
  assert.equal(REGISTRATION_SUSPENSION_APPEAL_GOLD.pricing.certifiedMail, 14.94);
});
