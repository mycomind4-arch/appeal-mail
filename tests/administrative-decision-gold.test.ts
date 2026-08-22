import assert from "node:assert/strict";
import test from "node:test";
import { ADMINISTRATIVE_DECISION_GOLD, ADMINISTRATIVE_DECISION_GOLD_CAPABILITIES } from "../src/domain/administrative-decision-gold.ts";

test("administrative decision Gold contract is complete", () => {
  assert.equal(ADMINISTRATIVE_DECISION_GOLD.workflowId, "administrative-decision-appeal");
  assert.equal(ADMINISTRATIVE_DECISION_GOLD.lifecycle, "authority");
  for (const capability of ADMINISTRATIVE_DECISION_GOLD_CAPABILITIES) assert.ok(ADMINISTRATIVE_DECISION_GOLD.capabilities.includes(capability));
  assert.ok(ADMINISTRATIVE_DECISION_GOLD.authorityRules.includes("Never infer a universal deadline."));
  assert.ok(ADMINISTRATIVE_DECISION_GOLD.authorityRules.includes("Never assume exhaustion."));
});

test("administrative decision page and API boundaries are wired", async () => {
  const fs = await import("node:fs/promises");
  const files = await Promise.all([
    fs.readFile("src/routes/workflows/administrative-decision.tsx", "utf8"),
    fs.readFile("src/routes/api/workflows/administrative-decision/analyze.ts", "utf8"),
    fs.readFile("src/routes/api/workflows/administrative-decision/draft.ts", "utf8"),
    fs.readFile("src/routes/api/workflows/administrative-decision/approve.ts", "utf8"),
    fs.readFile("src/routes/api/workflows/administrative-decision/checkout.ts", "utf8"),
    fs.readFile("src/routes/api/stripe-webhook.ts", "utf8"),
  ]);
  const source = files.join("\n");
  assert.match(source, /administrative-decision-appeal/);
  assert.match(source, /Gemini/);
  assert.match(source, /MailMyPDF/);
  assert.match(source, /proof/);
});
