import { describe, expect, it } from "vitest";
import { GOVERNMENT_DECISION_AUTHORITY_DISCLAIMER, GOVERNMENT_DECISION_AUTHORITY_SOURCES } from "./government-decision-authority";
import { getDomainPack, constructWorkflow, REQUIRED_GOLD_CAPABILITIES } from "./government-decision-gold-contract";
import { getWorkflow } from "./workflows";

/** Gold contract uses the same executable capability resolver as production. */

describe("Government Decision supreme authority Gold standard", () => {
  it("has an executable domain pack with every Gold capability", () => {
    const workflow = constructWorkflow(getWorkflow("government-decision"));
    expect(workflow.errors).toEqual([]);
    expect(workflow.lifecycle).toBe("authority");
    for (const capability of REQUIRED_GOLD_CAPABILITIES) expect(workflow.capabilities).toContain(capability);
    expect(getDomainPack("government-decision")).toBeDefined();
  });

  it("treats the decision notice and current official sources as controlling", () => {
    const pack = getDomainPack("government-decision");
    expect(pack?.deadline.jurisdictionDependent).toBe(true);
    expect(pack?.deadline.computationRules).toContain("Never infer a universal deadline.");
    expect(pack?.submission.recipientRules).toContain("Recipient must match the decision notice or verified official filing instruction.");
  });

  it("has an authority source library with freshness discipline", () => {
    expect(GOVERNMENT_DECISION_AUTHORITY_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(GOVERNMENT_DECISION_AUTHORITY_SOURCES.every((source) => source.freshnessRule === "verify-before-use")).toBe(true);
    expect(GOVERNMENT_DECISION_AUTHORITY_DISCLAIMER).toContain("jurisdiction- and agency-specific");
  });
});
