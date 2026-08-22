import assert from "node:assert/strict";
import test from "node:test";
import { constructWorkflow, getDomainPack } from "../src/domain/workflow-capabilities.ts";
import { getWorkflow } from "../src/domain/workflows.ts";
import { GOVERNMENT_DECISION_AUTHORITY_SOURCES } from "../src/domain/government-decision-authority.ts";

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
