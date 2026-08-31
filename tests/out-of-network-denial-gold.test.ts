import test from "node:test";
import assert from "node:assert/strict";
import { OUT_OF_NETWORK_DENIAL_GOLD } from "../src/domain/out-of-network-denial-gold";

test("locks authority-first behavior and packet pricing", () => {
  assert.equal(OUT_OF_NETWORK_DENIAL_GOLD.workflowId, "out-of-network-denial");
  assert.ok(OUT_OF_NETWORK_DENIAL_GOLD.authorityRules.some((rule) => rule.includes("Never invent network status")));
  assert.ok(OUT_OF_NETWORK_DENIAL_GOLD.capabilities.includes("independent-validation"));
  assert.ok(OUT_OF_NETWORK_DENIAL_GOLD.capabilities.includes("pricing"));
  assert.ok(OUT_OF_NETWORK_DENIAL_GOLD.capabilities.includes("proof"));
  assert.equal(OUT_OF_NETWORK_DENIAL_GOLD.pricing.preparationFee, 39.99);
  assert.equal(OUT_OF_NETWORK_DENIAL_GOLD.pricing.includedResponsePages, 3);
});
