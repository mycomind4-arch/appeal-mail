import type { Decision, DecisionFact, DecisionReason, TimelineEvent } from "@/domain/decision";

/* ─────────────────────────────────────────────
   Document Extraction Engine
   Pattern-matching heuristics to extract
   structured data from decision letter text.
   ───────────────────────────────────────────── */

/* Date patterns — matches common US and ISO date formats */
const DATE_PATTERNS = [
  /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2}),?\s+(\d{4})\b/gi,
  /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/g,
  /\b(\d{4})-(\d{2})-(\d{2})\b/g,
];

/* Deadline keywords */
const DEADLINE_KEYWORDS = [
  /(?:must|shall|should)?\s*(?:file|submit|mail|send|postmark).{0,20}(?:within|by|no later than|not later than|before)\s+/i,
  /(?:deadline|due date|last day|final day|expiration)\s*(?:is)?\s*/i,
  /(?:appeal|review|reconsider|reconsideration).{0,30}(?:within|by|no later than|deadline)/i,
  /\bwithin\s+(\d+)\s+(?:calendar\s+)?days?\b/i,
  /\bby\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+/i,
];

/* Reference number patterns */
const REF_PATTERNS = [
  /(?:case|claim|reference|ref|docket|matter|file|account|policy)\s*(?:no\.?|number|#|num)\s*[:#]?\s*([A-Z0-9\-\/]{4,})/i,
  /\b(?:case|claim|reference)\s+([A-Z0-9\-]{6,})\b/i,
  /\b([A-Z]{2,4}[-\s]?\d{4,}[-\s]?\d{3,})\b/,
];

/* Agency / organization patterns */
const AGENCY_PATTERNS = [
  /(?:from|by|issued by|department of|bureau of|office of|division of)\s+([A-Z][A-Za-z\s&,]{3,60}?)(?:\.|,|;|\n|$)/,
  /^(.{5,80}?)\s*\n\s*(?:decision|notice|ruling|determination|order|letter)/im,
  /\b(Department|Bureau|Office|Division|Administration|Agency|Service|Board|Commission|Tribunal|Court|Agency)\s+of\s+([A-Z][A-Za-z\s&]{3,50}?)(?:\.|,|\n|$)/,
];

/* Decision type keywords */
const DECISION_TYPE_PATTERNS: Record<string, string[]> = {
  "denial": ["denial", "denied", "reject", "rejected", "disapproved"],
  "termination": ["termination", "terminated", "closed", "closure"],
  "revocation": ["revocation", "revoked", "suspended", "suspension"],
  "overpayment": ["overpayment", "overpaid", "excess payment"],
  "reconsideration": ["reconsideration", "reconsidered", "re-review"],
  "judgment": ["judgment", "judgement", "ruling", "order", "verdict", "conviction"],
  "determination": ["determination", "decision", "finding"],
  "assessment": ["assessment", "evaluated", "evaluation"],
};

/* Appeal instruction extraction */
const APPEAL_INSTRUCTION_PATTERNS = [
  /(?:you may|you have the right to|to appeal|how to appeal|appeal rights|right to appeal|to request (?:an |a )?(?:appeal|review|reconsideration))(.{20,500}?)(?:\n\n|\. [A-Z]|\.$|$)/is,
  /(?:appeal|review|reconsideration)\s+(?:must be|should be|may be)\s+(?:filed|submitted|sent|mailed)(.{20,400}?)(?:\n\n|\. [A-Z]|\.$|$)/is,
];

/* Extract a date string and normalize to ISO format */
function extractDate(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  if (!match) return null;
  const dateStr = match[0];
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return dateStr;
}

/* Find the earliest date that follows a deadline keyword */
function extractDeadlineDate(text: string): { date: string | null; daysWindow: number | null; raw: string | null } {
  for (const pattern of DEADLINE_KEYWORDS) {
    const match = pattern.exec(text);
    if (!match) continue;

    // Check for "within N days" pattern
    const daysMatch = match[0].match(/\bwithin\s+(\d+)\s+(?:calendar\s+)?days?\b/i);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      return { date: null, daysWindow: days, raw: match[0].trim() };
    }

    // Look for a date after the deadline keyword
    const afterKeyword = text.slice(match.index + match[0].length, match.index + match[0].length + 200);
    for (const datePattern of DATE_PATTERNS) {
      const dateMatch = afterKeyword.match(datePattern);
      if (dateMatch) {
        const parsed = new Date(dateMatch[0]);
        if (!isNaN(parsed.getTime())) {
          return { date: parsed.toISOString().split("T")[0], daysWindow: null, raw: match[0].trim() };
        }
      }
    }
  }
  return { date: null, daysWindow: null, raw: null };
}

/* Extract all dates from text */
function extractAllDates(text: string): string[] {
  const dates: string[] = [];
  for (const pattern of DATE_PATTERNS) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const parsed = new Date(match[0]);
      if (!isNaN(parsed.getTime())) {
        dates.push(parsed.toISOString().split("T")[0]);
      }
    }
  }
  return [...new Set(dates)].sort();
}

/* Extract reference number */
function extractReferenceNumber(text: string): string | null {
  for (const pattern of REF_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }
  return null;
}

/* Extract agency name */
function extractAgency(text: string): string | null {
  for (const pattern of AGENCY_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const agency = (match[1] || match[0]).trim().replace(/[.,;]$/, "");
      if (agency.length >= 4 && agency.length <= 80) return agency;
    }
  }
  return null;
}

/* Detect decision type */
function detectDecisionType(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [type, keywords] of Object.entries(DECISION_TYPE_PATTERNS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  return null;
}

/* Extract appeal instructions */
function extractAppealInstructions(text: string): string | null {
  for (const pattern of APPEAL_INSTRUCTION_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const instruction = (match[1] || match[0]).trim();
      if (instruction.length >= 20) return instruction.slice(0, 1000);
    }
  }
  return null;
}

/* Extract decision reasons — look for numbered lists or "because" clauses */
function extractReasons(text: string): DecisionReason[] {
  const reasons: DecisionReason[] = [];

  // Pattern: "1. Reason text" or "1) Reason text"
  const numberedPattern = /(?:^|\n)\s*(\d+)[.)]\s+([A-Z][^.]{20,300}\.?)/gm;
  let match;
  while ((match = numberedPattern.exec(text)) !== null) {
    reasons.push({
      id: crypto.randomUUID(),
      text: match[2].trim(),
      confidence: 0.7,
    });
  }

  // Pattern: "because..." or "the reason for..." or "based on..."
  const becausePattern = /(?:because|the reason for|based on|due to|on the grounds? that)\s+([A-Z][^.]{20,300}\.?)/gi;
  while ((match = becausePattern.exec(text)) !== null && reasons.length < 10) {
    reasons.push({
      id: crypto.randomUUID(),
      text: match[1].trim(),
      confidence: 0.6,
    });
  }

  return reasons.slice(0, 8);
}

/* Build a timeline from extracted dates */
function buildTimeline(text: string, dates: string[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const seen = new Set<string>();

  for (const date of dates) {
    if (seen.has(date)) continue;
    seen.add(date);

    // Try to find context around the date in the text
    const datePattern = new RegExp(date.replace(/-/g, "[\/\\-]"), "i");
    const textMatch = text.match(datePattern);
    const context = textMatch
      ? text.slice(Math.max(0, (textMatch.index ?? 0) - 80), (textMatch.index ?? 0) + 100).trim()
      : "";

    events.push({
      id: crypto.randomUUID(),
      date,
      description: context.slice(0, 200) || "Date mentioned in document",
      source: "extracted" as const,
    });
  }

  return events.slice(0, 10);
}

/* ── Main extraction function ── */

export interface ExtractionResult {
  agency?: string;
  referenceNumber?: string;
  decisionDate?: string;
  deadline?: { date?: string; daysWindow?: number | null; appealInstructions?: string };
  decisionTypeLabel?: string;
  appealInstructions?: string;
  reasons: DecisionReason[];
  chronology: TimelineEvent[];
  facts: DecisionFact[];
  extractionConfidence: number;
  rawText?: string;
}

export function extractFromText(text: string): ExtractionResult {
  if (!text || text.trim().length < 10) {
    return { reasons: [], chronology: [], facts: [], extractionConfidence: 0 };
  }

  const agency = extractAgency(text);
  const referenceNumber = extractReferenceNumber(text);
  const allDates = extractAllDates(text);
  const decisionDate = allDates.length > 0 ? allDates[0] : null;
  const deadlineInfo = extractDeadlineDate(text);
  const decisionTypeLabel = detectDecisionType(text);
  const appealInstructions = extractAppealInstructions(text);
  const reasons = extractReasons(text);
  const chronology = buildTimeline(text, allDates);

  // Build facts from extracted data
  const facts: DecisionFact[] = [];
  if (agency) facts.push({ id: crypto.randomUUID(), label: "Agency", value: agency, source: "extracted", confidence: 0.7 });
  if (referenceNumber) facts.push({ id: crypto.randomUUID(), label: "Reference Number", value: referenceNumber, source: "extracted", confidence: 0.8 });
  if (decisionDate) facts.push({ id: crypto.randomUUID(), label: "Decision Date", value: decisionDate, source: "extracted", confidence: 0.6 });

  // Calculate overall confidence
  const extractedFields = [agency, referenceNumber, decisionDate, deadlineInfo.date, decisionTypeLabel, appealInstructions].filter(Boolean);
  const extractionConfidence = Math.min(0.95, 0.3 + extractedFields.length * 0.1 + reasons.length * 0.05);

  return {
    agency: agency ?? undefined,
    referenceNumber: referenceNumber ?? undefined,
    decisionDate: decisionDate ?? undefined,
    deadline: {
      date: deadlineInfo.date ?? undefined,
      daysWindow: deadlineInfo.daysWindow,
      appealInstructions: appealInstructions ?? undefined,
    },
    decisionTypeLabel: decisionTypeLabel ?? undefined,
    appealInstructions: appealInstructions ?? undefined,
    reasons,
    chronology,
    facts,
    extractionConfidence,
    rawText: text.slice(0, 5000),
  };
}

/* Apply extraction results to a Decision object */
export function applyExtraction(decision: Decision, result: ExtractionResult): Decision {
  return {
    ...decision,
    agency: decision.agency || result.agency,
    referenceNumber: decision.referenceNumber || result.referenceNumber,
    decisionDate: decision.decisionDate || result.decisionDate,
    decisionTypeLabel: decision.decisionTypeLabel || result.decisionTypeLabel,
    appealInstructions: decision.appealInstructions || result.appealInstructions,
    deadline: decision.deadline?.date
      ? decision.deadline
      : result.deadline?.date
      ? {
          date: result.deadline.date,
          type: "appeal",
          source: "extracted",
          appealInstructions: result.deadline.appealInstructions,
          daysRemaining: undefined,
        }
      : decision.deadline,
    reasons: result.reasons.length > decision.reasons.length ? result.reasons : decision.reasons,
    chronology: result.chronology.length > decision.chronology.length ? result.chronology : decision.chronology,
    facts: result.facts.length > decision.facts.length ? result.facts : decision.facts,
    extractedAt: new Date().toISOString(),
    extractionConfidence: Math.max(decision.extractionConfidence, result.extractionConfidence),
    rawText: result.rawText,
  };
}
