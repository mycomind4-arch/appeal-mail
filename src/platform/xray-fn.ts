import { createServerFn } from "@tanstack/react-start";
import { runXRayAnalysis, type AnalyzedDocument, type XRayResult } from "@/domain/xray";
import type { Decision } from "@/domain/decision";
import type { Evidence } from "@/domain/evidence";

/* ─────────────────────────────────────────────
   X-Ray Analysis Server Function
   Takes extracted text from all uploaded documents
   and runs the cross-document analysis engine.
   ───────────────────────────────────────────── */

export const analyzeDocuments = createServerFn()
  .validator((input: {
    documents: { id: string; name: string; text: string; isDecision: boolean; pageCount?: number }[];
    decision: Decision;
    evidence?: Evidence[];
  }) => {
    if (!input.documents || input.documents.length === 0) {
      throw new Error("At least one document is required for analysis");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const analyzedDocs: AnalyzedDocument[] = data.documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      text: doc.text,
      pageCount: doc.pageCount || Math.max(1, Math.ceil(doc.text.length / 3000)),
      isDecision: doc.isDecision,
    }));

    const result = runXRayAnalysis(
      analyzedDocs,
      data.decision,
      data.evidence || [],
    );

    return result;
  });
