export type AuthorityVerificationState = "verified" | "partially_verified" | "unverified" | "conflicting";

export interface AuthoritySource {
  claim: string;
  sourceType: "document" | "agency" | "court" | "statute" | "regulation" | "rule" | "other";
  sourceUrl: string;
  sourceTitle: string;
  jurisdiction: string;
  effectiveDate?: string;
  retrievedAt: string;
  confidence: "high" | "medium" | "low";
  verificationState: AuthorityVerificationState;
  notes?: string;
}

export const AGENCY_AUTHORITY_RULES = {
  requireOfficialSourceForProcedure: true,
  allowUnverifiedDeadline: false,
  allowInferredExhaustion: false,
  allowInferredRecipient: false,
  allowInferredFilingMethod: false,
  allowedSourceTypes: ["agency", "court", "statute", "regulation", "rule"] as const,
};

export function isProceduralClaimVerified(source: AuthoritySource | undefined): boolean {
  return Boolean(source && source.verificationState === "verified" && source.sourceType !== "document");
}

export function classifyProceduralDate(date: string | undefined, source: AuthoritySource | undefined): "verified" | "extracted" | "unverified" {
  if (!date) return "unverified";
  return isProceduralClaimVerified(source) ? "verified" : "extracted";
}
