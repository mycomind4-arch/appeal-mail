import { createServerFn } from "@tanstack/react-start";
import { extractFromText, applyExtraction } from "@/platform/document-extraction";
import type { Decision } from "@/domain/decision";

/* ─────────────────────────────────────────────
   Server function: extract decision data from
   document text. Client-side PDF/text extraction
   feeds this server-side pattern matching engine.
   ───────────────────────────────────────────── */

export const extractDecision = createServerFn()
  .validator((input: { text: string; decision: Decision }) => {
    if (!input.text || typeof input.text !== "string") {
      throw new Error("Text input is required");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { text, decision } = data;
    const result = extractFromText(text);
    const updated = applyExtraction(decision, result);

    return {
      decision: updated,
      extraction: result,
      confidence: result.extractionConfidence,
      fieldsExtracted: [
        result.agency && "agency",
        result.referenceNumber && "referenceNumber",
        result.decisionDate && "decisionDate",
        result.deadline?.date && "deadline",
        result.decisionTypeLabel && "decisionType",
        result.appealInstructions && "appealInstructions",
        result.reasons.length > 0 && "reasons",
        result.chronology.length > 0 && "timeline",
      ].filter(Boolean) as string[],
    };
  });
