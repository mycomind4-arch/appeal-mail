import { describe, expect, it } from "vitest";
import { buildAiDocumentContext, normalizeExtractedText, validateCaseDocumentInput } from "./case-document-pipeline";

describe("case document pipeline", () => {
  it("accepts supported source documents", () => {
    expect(validateCaseDocumentInput({ filename: "notice.pdf", mimeType: "application/pdf" })).toBe(true);
  });

  it("rejects unsupported document types", () => {
    expect(() => validateCaseDocumentInput({ filename: "file.exe", mimeType: "application/octet-stream" })).toThrow();
  });

  it("sanitizes extracted text", () => {
    expect(normalizeExtractedText("hello\u0000   \nworld")).toBe("hello\nworld");
  });

  it("builds bounded AI context only from ready documents", () => {
    const context = buildAiDocumentContext([
      { id: "1", caseId: "c", ownerId: "u", filename: "notice.pdf", mimeType: "application/pdf", kind: "source", status: "ready", extractedText: "Notice facts", createdAt: "now" },
      { id: "2", caseId: "c", ownerId: "u", filename: "pending.pdf", mimeType: "application/pdf", kind: "evidence", status: "processing", extractedText: "Should not appear", createdAt: "now" },
    ]);
    expect(context).toContain("notice.pdf");
    expect(context).not.toContain("Should not appear");
  });
});
