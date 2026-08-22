import assert from "node:assert/strict";
import test from "node:test";
import { GOVERNMENT_DECISION_PRICING, calculateGovernmentDecisionTotal } from "../src/domain/government-decision-pricing.ts";

test("government-decision uses transparent Gold packet pricing", () => {
  assert.equal(GOVERNMENT_DECISION_PRICING.preparationFee, 24.99);
  assert.equal(GOVERNMENT_DECISION_PRICING.includedResponsePages, 3);
  assert.equal(GOVERNMENT_DECISION_PRICING.responsePagePrice, 0.4);
  assert.equal(GOVERNMENT_DECISION_PRICING.supportingPagePrice, 0.25);
  assert.equal(calculateGovernmentDecisionTotal({ responseSheets: 3, supportingSheets: 0, mailingMethod: "certified" }).total, 37.48);
  assert.equal(calculateGovernmentDecisionTotal({ responseSheets: 5, supportingSheets: 8, mailingMethod: "certified" }).total, 40.68);
});
