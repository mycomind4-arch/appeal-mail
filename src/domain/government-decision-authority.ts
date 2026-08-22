export type GovernmentDecisionAuthoritySource = {
  name: string;
  authorityType: "official-guide" | "official-regulation" | "official-court-guide";
  jurisdiction: "federal" | "state-example" | "agency-specific" | "general";
  url: string;
  purpose: string;
  freshnessRule: "verify-before-use";
};

/**
 * Authority anchors for the broad Government Decision workflow.
 * These are intentionally discovery anchors, not universal deadlines or rules.
 * The decision notice and the governing agency/jurisdiction source remain controlling.
 */
export const GOVERNMENT_DECISION_AUTHORITY_SOURCES: readonly GovernmentDecisionAuthoritySource[] = [
  {
    name: "FOIA.gov — Administrative Appeals FAQ",
    authorityType: "official-guide",
    jurisdiction: "federal",
    url: "https://www.foia.gov/faq.html",
    purpose: "Explains the existence and general mechanics of administrative appeals from agency FOIA determinations.",
    freshnessRule: "verify-before-use",
  },
  {
    name: "U.S. Department of Justice — OIP Administrative Appeals Guidance",
    authorityType: "official-guide",
    jurisdiction: "federal",
    url: "https://www.justice.gov/oip/oip-guidance/oip-guidance-adjudicating-administrative-appeals-under-foia",
    purpose: "Provides a federal example of independent administrative review, appeal procedures, and record-focused review.",
    freshnessRule: "verify-before-use",
  },
  {
    name: "U.S. Department of Justice — FOIA Reference Guide",
    authorityType: "official-guide",
    jurisdiction: "agency-specific",
    url: "https://www.justice.gov/oip/department-justice-freedom-information-act-reference-guide",
    purpose: "Shows how an agency-specific appeal path, filing method, and time limit can differ from generic assumptions.",
    freshnessRule: "verify-before-use",
  },
  {
    name: "Utah Courts — Appealing an Administrative Agency Decision",
    authorityType: "official-court-guide",
    jurisdiction: "state-example",
    url: "https://www.utcourts.gov/en/self-help/case-categories/appeals/admin-agency.html",
    purpose: "Illustrates the distinction between administrative review and judicial review and why the actual agency decision controls the next step.",
    freshnessRule: "verify-before-use",
  },
  {
    name: "eCFR — Administrative Appeal Procedures Example",
    authorityType: "official-regulation",
    jurisdiction: "federal",
    url: "https://www.law.cornell.edu/cfr/text/15/960.19",
    purpose: "Illustrates how a federal regulation can prescribe a specific appeal period, contents, and hearing process.",
    freshnessRule: "verify-before-use",
  },
];

export const GOVERNMENT_DECISION_AUTHORITY_DISCLAIMER =
  "Government appeal procedures are jurisdiction- and agency-specific. The decision notice, cited regulations, official filing instructions, and current agency source control. This workflow does not assume a universal deadline, form, standard of review, or exhaustion rule.";
