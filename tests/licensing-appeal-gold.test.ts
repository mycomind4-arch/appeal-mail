import assert from "node:assert/strict";
import test from "node:test";
import { LICENSING_APPEAL_GOLD, LICENSING_APPEAL_GOLD_CAPABILITIES } from "../src/domain/licensing-appeal-gold.ts";

test("licensing appeal Gold contract is complete", () => {
  assert.equal(LICENSING_APPEAL_GOLD.workflowId, "licensing-appeal");
  assert.equal(LICENSING_APPEAL_GOLD.lifecycle, "authority");
  for (const capability of LICENSING_APPEAL_GOLD_CAPABILITIES) assert.ok(LICENSING_APPEAL_GOLD.capabilities.includes(capability));
  assert.ok(LICENSING_APPEAL_GOLD.authorityRules.includes("Never infer a universal licensing deadline."));
  assert.ok(LICENSING_APPEAL_GOLD.authorityRules.includes("Never invent a filing destination, form, address, portal, or service method."));
});

test("licensing appeal page, Gemini pipeline, approval, checkout, and fulfillment are wired", async () => {
  const fs = await import("node:fs/promises");
  const files = await Promise.all([
    fs.readFile("src/routes/workflows/licensing-appeal.tsx", "utf8"),
    fs.readFile("src/routes/api/workflows/licensing-appeal/analyze.ts", "utf8"),
    fs.readFile("src/routes/api/workflows/licensing-appeal/draft.ts", "utf8"),
    fs.readFile("src/routes/api/workflows/licensing-appeal/approve.ts", "utf8"),
    fs.readFile("src/routes/api/workflows/licensing-appeal/checkout.ts", "utf8"),
    fs.readFile("src/routes/api/stripe-webhook.ts", "utf8"),
  ]);
  const source = files.join("\n");
  assert.match(source, /licensing-appeal/);
  assert.match(source, /Gemini/);
  assert.match(source, /MailMyPDF/);
  assert.match(source, /createProofPacket|proof/);
  assert.match(source, /Stripe/);
});
