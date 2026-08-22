import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { constructWorkflow, getDomainPack } from "../src/domain/workflow-capabilities.ts";
import { getWorkflow } from "../src/domain/workflows.ts";
import { GOVERNMENT_DECISION_AUTHORITY_SOURCES } from "../src/domain/government-decision-authority.ts";
import { GOVERNMENT_DECISION_PRICING, calculateGovernmentDecisionTotal } from "../src/domain/government-decision-pricing.ts";

const required = [
  "document-classification", "fact-extraction", "deadline-analysis", "evidence-analysis", "contradiction-analysis",
  "xray-analysis", "timeline-analysis", "stress-testing", "response-strategy", "drafting", "draft-validation",
  "readiness-review", "submission", "mailing", "proof",
];

test("government-decision reaches supreme authority Gold lifecycle", () => {
  const constructed = constructWorkflow(getWorkflow("government-decision"));
  assert.equal(constructed.errors.length, 0);
  assert.equal(constructed.lifecycle, "authority");
  assert.ok(getDomainPack("government-decision"));
  for (const capability of required) assert.ok(constructed.capabilities.includes(capability as never), `missing ${capability}`);
});

test("government-decision is jurisdiction-safe about deadlines and destinations", () => {
  const pack = getDomainPack("government-decision");
  assert.equal(pack?.deadline.jurisdictionDependent, true);
  assert.ok(pack?.deadline.computationRules.includes("Never infer a universal deadline."));
  assert.ok(pack?.submission.recipientRules.some((rule) => rule.includes("decision notice")));
});

test("government-decision authority source library is populated and freshness-gated", () => {
  assert.ok(GOVERNMENT_DECISION_AUTHORITY_SOURCES.length >= 4);
  assert.ok(GOVERNMENT_DECISION_AUTHORITY_SOURCES.every((source) => source.freshnessRule === "verify-before-use"));
});

test("government-decision uses transparent packet pricing", () => {
  assert.equal(GOVERNMENT_DECISION_PRICING.preparationFee, 24.99);
  assert.equal(GOVERNMENT_DECISION_PRICING.includedResponsePages, 3);
  assert.equal(calculateGovernmentDecisionTotal({ responseSheets: 3, supportingSheets: 0, mailingMethod: "certified" }).total, 37.48);
  assert.equal(calculateGovernmentDecisionTotal({ responseSheets: 5, supportingSheets: 8, mailingMethod: "certified" }).total, 40.68);
});

test("government-decision landing page and checkout expose the same pricing model", async () => {
  const route = await readFile("src/routes/workflows/government-decision.tsx", "utf8");
  const pricing = await readFile("src/components/workflow/government-decision-pricing.tsx", "utf8");
  const checkout = await readFile("src/routes/api/workflows/government-decision/checkout.ts", "utf8");
  const approval = await readFile("src/routes/api/workflows/government-decision/approve.ts", "utf8");
  assert.match(route, /GovernmentDecisionPricing/);
  assert.match(pricing, /\$24\.99/);
  assert.match(pricing, /\$0\.40/);
  assert.match(pricing, /\$0\.25/);
  assert.match(approval, /calculateGovernmentDecisionTotal/);
  assert.match(checkout, /a\.packet\.total/);
});
