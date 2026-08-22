import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = process.cwd();

function file(path: string) { return readFileSync(`${root}/${path}`, "utf8"); }

test("agency decision gold pack exposes authority-safe capabilities", async () => {
  const pack = await import("../src/domain/agency-decision-gold-pack.ts");
  assert.equal(pack.agencyDecisionGoldPack.id, "agency-decision-appeal");
  assert.ok(pack.agencyDecisionGoldPack.capabilities.includes("authority-resolution"));
  assert.ok(pack.agencyDecisionGoldPack.capabilities.includes("deterministic-pdf"));
  assert.ok(pack.agencyDecisionGoldPack.prohibitedInferences.includes("universal-deadline"));
});

test("agency decision authority model rejects unsupported procedural conclusions", async () => {
  const authority = await import("../src/domain/agency-decision-authority.ts");
  assert.equal(authority.isProceduralClaimVerified(undefined), false);
  assert.equal(authority.classifyProceduralDate("2026-08-22", undefined), "extracted");
  assert.equal(authority.classifyProceduralDate(undefined, undefined), "unverified");
});

test("agency decision surface and pipeline exist", () => {
  const expected = [
    "src/routes/workflows/agency-decision.tsx",
    "src/routes/api/workflows/agency-decision/analyze.ts",
    "src/routes/api/workflows/agency-decision/draft.ts",
    "src/routes/api/workflows/agency-decision/approve.ts",
    "src/routes/api/workflows/agency-decision/checkout.ts",
    "src/platform/simple-pdf.ts",
    "docs/workflows/agency-decision-appeal-gold-standard.md",
  ];
  for (const path of expected) assert.equal(existsSync(`${root}/${path}`), true, path);
});

test("landing page visibly makes authority the product proposition", () => {
  const page = file("src/routes/workflows/agency-decision.tsx");
  for (const phrase of ["Authority-first administrative appeal", "Authority verification", "Evidence intelligence", "Independent validation", "No universal administrative-appeal rule is assumed"]) assert.match(page, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("catalog exposes agency decision as a gold candidate on this branch", () => {
  const catalog = file("WORKFLOW_CATALOG.md");
  assert.match(catalog, /\| agency-decision \| Agency Decision Appeal \| GOLD_CANDIDATE \|/);
});
