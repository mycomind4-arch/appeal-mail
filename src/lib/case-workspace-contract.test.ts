import { describe, expect, it } from "vitest";
import { canAdvanceCaseWorkspace } from "./case-workspace-contract";

const base = {
  caseId: "case-1",
  ownerId: "user-1",
  stage: "overview" as const,
  sourceDocumentIds: [],
  evidenceDocumentIds: [],
  analysisStatus: "not_started" as const,
  draftStatus: "not_started" as const,
  packetStatus: "not_started" as const,
  mailingStatus: "not_ready" as const,
};

describe("case workspace stage contract", () => {
  it("allows analysis from the document workspace", () => {
    expect(canAdvanceCaseWorkspace(base, "analysis")).toBe(true);
  });

  it("does not allow response before analysis completes", () => {
    expect(canAdvanceCaseWorkspace(base, "response")).toBe(false);
  });

  it("allows response after analysis", () => {
    expect(canAdvanceCaseWorkspace({ ...base, analysisStatus: "complete" }, "response")).toBe(true);
  });

  it("does not allow mailing until the packet is locked", () => {
    expect(canAdvanceCaseWorkspace({ ...base, draftStatus: "approved", packetStatus: "assembled" }, "mail")).toBe(false);
    expect(canAdvanceCaseWorkspace({ ...base, draftStatus: "approved", packetStatus: "locked" }, "mail")).toBe(true);
  });
});
