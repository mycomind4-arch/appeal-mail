import { z } from "zod";

/* ═══════════════════════════════════════════════════════════
   Appeal Mail — Canonical Workflow Catalog
   ═══════════════════════════════════════════════════════════ */

export type AppealCategory =
  | "Insurance"
  | "Disability & Social Security"
  | "Unemployment"
  | "Government Benefits"
  | "Workers' Compensation"
  | "Veterans"
  | "Administrative"
  | "Tax & IRS";

export type WorkflowStatus = "IMPLEMENTED" | "COMING_SOON";

export interface AppealWorkflowEntry {
  /** Stable slug for routing and SEO */
  slug: string;
  /** Display name for cards and page titles */
  title: string;
  /** Category grouping */
  category: AppealCategory;
  /** Short description for cards */
  shortDescription: string;
  /** Long-form description for the placeholder page */
  longDescription: string;
  /** Who this appeal is for */
  intendedUser: string;
  /** What problem it solves */
  problemSolved: string;
  /** What we analyze */
  whatWeAnalyze: string[];
  /** What the user should prepare */
  whatYouNeed: string[];
  /** What Appeal Mail will identify */
  whatWeIdentify: string[];
  /** What the resulting appeal can address */
  whatAppealAddresses: string[];
  /** SEO title */
  seoTitle: string;
  /** SEO description */
  seoDescription: string;
  /** Primary keyword */
  primaryKeyword: string;
  /** Related keywords */
  relatedKeywords: string[];
  /** Canonical route path */
  route: string;
  /** Status */
  status: WorkflowStatus;
  /** Which engine this belongs to in the architecture */
  engine: string;
  /** Whether this workflow can actually be executed */
  executable: boolean;
  /** CTA text */
  /** Route to the actual executable workflow */
  workflowRoute: string;
  cta: string;
}

/* ── Category metadata ── */

export const CATEGORY_ORDER: AppealCategory[] = [
  "Insurance",
  "Disability & Social Security",
  "Unemployment",
  "Government Benefits",
  "Workers' Compensation",
  "Veterans",
  "Administrative",
  "Tax & IRS",
];

export const CATEGORY_DESCRIPTIONS: Record<AppealCategory, string> = {
  "Tax & IRS": "IRS notice responses — CP2000, CP14, CP504, and CP523 — with document-intelligence parsing, deadline tracking, and evidence-grounded response drafting.",
  "Insurance":
    "Denied insurance claims, health coverage, prior authorizations, out-of-network, timely filing, Medicare, and dental appeals.",
  "Disability & Social Security":
    "SSI, SSDI, Social Security reconsideration, overpayment, and Appeals Council appeals.",
  "Unemployment":
    "Unemployment benefit denials, EDD appeals, and state-specific unemployment decision appeals.",
  "Government Benefits":
    "Medicaid, SNAP/food stamp, and general benefits denial appeals.",
  "Workers' Compensation":
    "Workers' compensation claim denials and disputed benefit decisions.",
  "Veterans":
    "VA claim appeals under the Appeals Modernization Act.",
  "Administrative":
    "Agency decisions, administrative rulings, licensing, and regulatory appeals.",
};

/* ═══════════════════════════════════════════════════════════
   CATALOG
   ═══════════════════════════════════════════════════════════ */

export const APPEAL_CATALOG: AppealWorkflowEntry[] = [
  /* ── INSURANCE ── */
  {
    slug: "insurance-claim",
    title: "Insurance Claim Appeal",
    category: "Insurance",
    shortDescription:
      "Turn a denied insurance claim into an organized, evidence-supported appeal.",
    longDescription:
      "Insurance claim denials are common, but many are reversible with a well-organized appeal that addresses the insurer's stated reasons, cites policy provisions, and includes supporting evidence. Appeal Mail helps you extract the denial reasons, cross-reference your documents, identify contradictions, and build a point-by-point appeal letter.",
    intendedUser:
      "Anyone whose insurance claim — auto, property, liability, or other — has been denied and who wants to appeal the decision.",
    problemSolved:
      "Insurers deny claims for many reasons: missing documentation, policy exclusions, late filing, or factual disputes. A strong appeal addresses each reason individually with evidence.",
    whatWeAnalyze: [
      "The stated denial reasons in the denial letter",
      "Policy provisions cited as the basis for denial",
      "Claim reference numbers and filing dates",
      "Supporting documents for contradictions or gaps",
      "Whether the denial cites the correct policy language",
    ],
    whatYouNeed: [
      "The denial letter or explanation of benefits",
      "Your insurance policy or plan documents",
      "Claim correspondence and reference numbers",
      "Supporting evidence: receipts, photos, reports, medical records",
      "Any prior correspondence with the insurer",
    ],
    whatWeIdentify: [
      "Date conflicts between the denial and your documents",
      "Policy provisions that may not support the denial",
      "Evidence the insurer did not consider or acknowledge",
      "Factual discrepancies in the denial rationale",
      "Missing documentation that could strengthen your appeal",
    ],
    whatAppealAddresses: [
      "Each denial reason with a specific, evidence-backed response",
      "Policy provisions that support coverage",
      "Procedural errors in how the claim was handled",
      "New or previously unconsidered evidence",
      "A clear request for reconsideration or review",
    ],
    seoTitle: "Insurance Claim Appeal — Appeal Mail",
    seoDescription:
      "Turn a denied insurance claim into an organized, evidence-supported appeal. Upload your denial letter, identify issues, and build a point-by-point appeal.",
    primaryKeyword: "denial of insurance claim",
    relatedKeywords: [
      "insurance appeal",
      "appealing insurance denial",
      "insurance claim appeal",
      "insurance appeal letter",
      "appeal letter for insurance denial",
    ],
    route: "/appeal/insurance-claim",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/insurance-claim-denial",
        cta: "Start Appeal",
  },
  {
    slug: "health-insurance",
    title: "Health Insurance Appeal",
    category: "Insurance",
    shortDescription:
      "Appeal a denied health insurance claim or coverage decision with medical evidence.",
    longDescription:
      "Health insurance denials often involve medical necessity disputes, coding errors, or coverage exclusions. A successful appeal requires understanding the clinical rationale, citing the correct plan provisions, and providing supporting medical documentation.",
    intendedUser:
      "Patients, advocates, and caregivers dealing with a denied health insurance claim or coverage decision.",
    problemSolved:
      "Health insurance denials are frequently overturned on appeal when the patient provides the right clinical documentation and addresses the specific denial reason.",
    whatWeAnalyze: [
      "Medical necessity denials and the stated rationale",
      "Coding or billing discrepancy claims",
      "Plan exclusion or limitation citations",
      "Prior authorization status and requirements",
      "Appeal deadline and process instructions from the denial letter",
    ],
    whatYouNeed: [
      "Explanation of Benefits (EOB) or denial letter",
      "Health insurance plan documents or summary of benefits",
      "Medical records, lab results, or physician letters",
      "Prior authorization correspondence",
      "Itemized bills or coding documentation",
    ],
    whatWeIdentify: [
      "Whether the denial reason aligns with your plan's actual coverage terms",
      "Medical documentation that contradicts the denial rationale",
      "Coding errors or billing discrepancies",
      "Missing prior authorization issues",
      "Deadline and process errors in the denial letter",
    ],
    whatAppealAddresses: [
      "Medical necessity arguments with supporting documentation",
      "Coverage provisions that support the claim",
      "Coding or billing corrections",
      "Procedural errors in the denial process",
      "A clear request for review with specific relief sought",
    ],
    seoTitle: "Health Insurance Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied health insurance claim with medical evidence. Address medical necessity denials, coding errors, and coverage exclusions.",
    primaryKeyword: "health insurance appeal",
    relatedKeywords: ["medical claim appeal", "insurance appeal letter"],
    route: "/appeal/health-insurance",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/medical-insurance-denial",
        cta: "Join the workflow",
  },
  {
    slug: "prior-authorization",
    title: "Prior Authorization Appeal",
    category: "Insurance",
    shortDescription:
      "Appeal a denied prior authorization request with clinical justification.",
    longDescription:
      "Prior authorization denials can delay necessary treatment. A strong appeal addresses the clinical criteria the insurer used and provides documentation showing the treatment meets medical necessity standards.",
    intendedUser:
      "Patients and providers appealing a denied prior authorization for a procedure, medication, or service.",
    problemSolved:
      "Insurers deny prior authorizations based on internal criteria that may not account for your specific clinical situation.",
    whatWeAnalyze: [
      "The clinical criteria cited in the denial",
      "Whether your medical records support the requested treatment",
      "Plan provisions governing prior authorization",
      "Whether the denial followed required timeline rules",
      "Appeal rights and deadlines",
    ],
    whatYouNeed: [
      "Prior authorization denial letter",
      "Letter of medical necessity from your provider",
      "Medical records supporting the request",
      "Plan documents on prior authorization requirements",
      "Any peer-to-peer review notes",
    ],
    whatWeIdentify: [
      "Clinical documentation gaps that weakened the original request",
      "Whether the insurer applied the correct criteria",
      "Timeline violations in the authorization process",
      "Evidence supporting medical necessity",
      "Plan provisions that support coverage",
    ],
    whatAppealAddresses: [
      "Medical necessity with specific clinical evidence",
      "Why the insurer's criteria do not fit your situation",
      "Procedural errors in the denial process",
      "A request for expedited review if treatment is urgent",
    ],
    seoTitle: "Prior Authorization Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied prior authorization with clinical justification and supporting medical documentation.",
    primaryKeyword: "prior authorization appeal",
    relatedKeywords: ["health insurance appeal", "medical necessity appeal"],
    route: "/appeal/prior-authorization",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/prior-authorization-denial",
        cta: "Join the workflow",
  },
  {
    slug: "out-of-network",
    title: "Out-of-Network Appeal",
    category: "Insurance",
    shortDescription:
      "Appeal a denied out-of-network coverage claim with network adequacy or medical necessity arguments.",
    longDescription:
      "Out-of-network denials often occur when in-network providers are unavailable or when the treatment was medically necessary and could not wait for network authorization.",
    intendedUser:
      "Patients who received care from an out-of-network provider and had their claim denied.",
    problemSolved:
      "Out-of-network denials can often be reversed when you demonstrate network inadequacy or urgent medical necessity.",
    whatWeAnalyze: [
      "The insurer's stated reason for the out-of-network denial",
      "Whether in-network alternatives were actually available",
      "Medical necessity documentation for the specific provider",
      "Plan provisions on out-of-network coverage",
      "Whether the care was emergency or urgent",
    ],
    whatYouNeed: [
      "Out-of-network denial letter",
      "Documentation of in-network provider availability (or lack thereof)",
      "Medical records justifying the provider choice",
      "Plan documents on out-of-network benefits",
      "Any correspondence about network referral",
    ],
    whatWeIdentify: [
      "Network adequacy gaps that support your provider choice",
      "Medical necessity documentation supporting the out-of-network care",
      "Plan provisions that may require coverage in certain circumstances",
      "Whether the denial followed proper process",
    ],
    whatAppealAddresses: [
      "Why in-network alternatives were not available or appropriate",
      "Medical necessity for the specific provider or facility",
      "Plan provisions requiring coverage in your situation",
      "A request for coverage at in-network rates",
    ],
    seoTitle: "Out-of-Network Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied out-of-network coverage claim with network adequacy and medical necessity arguments.",
    primaryKeyword: "out-of-network appeal",
    relatedKeywords: ["health insurance appeal", "no authorization appeal"],
    route: "/appeal/out-of-network",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/out-of-network-denial",
        cta: "Join the workflow",
  },
  {
    slug: "timely-filing",
    title: "Timely Filing Appeal",
    category: "Insurance",
    shortDescription:
      "Appeal a claim denied for late submission with proof of timely filing.",
    longDescription:
      "Insurers deny claims for timely filing when they believe the claim was submitted after the deadline. A successful appeal requires proof of when the claim was actually submitted.",
    intendedUser:
      "Providers or patients whose claim was denied solely for untimely filing.",
    problemSolved:
      "Timely filing denials are often reversed when you can document the actual submission date and method.",
    whatWeAnalyze: [
      "The filing deadline stated in the denial",
      "Your submission records and proof of delivery",
      "Plan provisions on filing timelines and extensions",
      "Whether the insurer's deadline calculation is correct",
      "Any prior correspondence about the claim",
    ],
    whatYouNeed: [
      "Timely filing denial letter",
      "Proof of claim submission (electronic confirmation, certified mail receipt, etc.)",
      "Plan documents on filing deadlines",
      "Any correspondence acknowledging receipt of the claim",
    ],
    whatWeIdentify: [
      "Whether your submission records contradict the denial's timeline",
      "Errors in the insurer's deadline calculation",
      "Plan provisions that may allow extensions or exceptions",
      "Evidence of prior submission acknowledgment",
    ],
    whatAppealAddresses: [
      "Proof of timely submission with documentation",
      "Disputes with the insurer's deadline calculation",
      "Plan provisions supporting an extension or exception",
      "A request for the claim to be processed on the merits",
    ],
    seoTitle: "Timely Filing Appeal — Appeal Mail",
    seoDescription:
      "Appeal a claim denied for late submission with proof of timely filing and documentation of the actual submission date.",
    primaryKeyword: "timely filing appeal",
    relatedKeywords: ["insurance appeal", "claim denial appeal"],
    route: "/appeal/timely-filing",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/insurance-claim-denial",
        cta: "Join the workflow",
  },
  {
    slug: "medicare",
    title: "Medicare Appeal",
    category: "Insurance",
    shortDescription:
      "Appeal a denied Medicare claim through the five-level Medicare appeals process.",
    longDescription:
      "Medicare appeals follow a structured five-level process: Redetermination, Reconsideration, Administrative Law Judge hearing, Appeals Council review, and Federal District Court. Each level has specific deadlines and requirements.",
    intendedUser:
      "Medicare beneficiaries or their representatives appealing a coverage or payment decision.",
    problemSolved:
      "Medicare denials can be appealed through a formal multi-level process, but each level has strict deadlines and specific documentation requirements.",
    whatWeAnalyze: [
      "The Medicare denial notice and stated reason",
      "Which level of appeal is appropriate (redetermination, reconsideration, etc.)",
      "The applicable deadline for the current appeal level",
      "Medical and coverage documentation supporting the appeal",
      "Whether the denial followed Medicare coverage rules",
    ],
    whatYouNeed: [
      "Medicare denial notice (MSN or REMIT)",
      "Medical records supporting the service or item",
      "Medicare coverage documents or NCD/LCD references",
      "Any prior appeal correspondence",
    ],
    whatWeIdentify: [
      "The correct appeal level and its deadline",
      "Coverage rules or NCDs/LCDs that support your claim",
      "Medical documentation gaps",
      "Whether the denial reason aligns with Medicare policy",
    ],
    whatAppealAddresses: [
      "Coverage arguments citing specific Medicare rules",
      "Medical necessity documentation",
      "Procedural errors in the denial",
      "A request for the specific appeal level with correct forms",
    ],
    seoTitle: "Medicare Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied Medicare claim through the five-level Medicare appeals process with proper documentation and deadline tracking.",
    primaryKeyword: "Medicare appeal",
    relatedKeywords: ["Medicare appeal letter", "Medicare denial appeal"],
    route: "/appeal/medicare",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/medical-insurance-denial",
        cta: "Join the workflow",
  },
  {
    slug: "dental-insurance",
    title: "Dental Insurance Appeal",
    category: "Insurance",
    shortDescription:
      "Appeal a denied dental insurance claim with documentation of medical necessity and plan coverage.",
    longDescription:
      "Dental insurance denials often involve disputes over whether a procedure is medically necessary, covered under the plan, or correctly coded.",
    intendedUser:
      "Patients or dental providers appealing a denied dental insurance claim.",
    problemSolved:
      "Dental claim denials can often be reversed with supporting documentation showing medical necessity and correct coding.",
    whatWeAnalyze: [
      "The denial reason and cited plan exclusion or limitation",
      "Whether the procedure coding is correct",
      "Plan coverage documents and waiting periods",
      "Medical necessity documentation",
    ],
    whatYouNeed: [
      "Dental claim denial letter or EOB",
      "Dental plan documents and coverage schedule",
      "Clinical notes and x-rays from the dental provider",
      "Pre-treatment authorization correspondence",
    ],
    whatWeIdentify: [
      "Coding errors that may have triggered the denial",
      "Plan provisions that support coverage",
      "Medical necessity documentation gaps",
      "Whether the waiting period or limitation applies correctly",
    ],
    whatAppealAddresses: [
      "Medical necessity with clinical documentation",
      "Corrected coding if applicable",
      "Plan provisions supporting coverage",
      "A request for claim reconsideration",
    ],
    seoTitle: "Dental Insurance Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied dental insurance claim with documentation of medical necessity, correct coding, and plan coverage.",
    primaryKeyword: "dental insurance appeal",
    relatedKeywords: ["dental claim appeal", "insurance appeal"],
    route: "/appeal/dental-insurance",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/dental-insurance-appeal",
        cta: "Join the workflow",
  },

  /* ── DISABILITY & SOCIAL SECURITY ── */
  {
    slug: "ssi",
    title: "SSI Appeal",
    category: "Disability & Social Security",
    shortDescription:
      "Appeal a denied Supplemental Security Income claim through reconsideration, hearing, or Appeals Council.",
    longDescription:
      "SSI appeals follow the SSA appeals process: Reconsideration, Administrative Law Judge hearing, Appeals Council review, and Federal Court. Many initial denials are reversed on appeal, especially at the hearing level.",
    intendedUser:
      "Individuals denied Supplemental Security Income benefits who want to appeal the decision.",
    problemSolved:
      "SSI denials are common at the initial level but many are reversed on appeal with better documentation and argument.",
    whatWeAnalyze: [
      "The denial notice and stated medical or non-medical reasons",
      "Which appeal level is appropriate",
      "The applicable deadline (typically 60 days from receipt)",
      "Medical evidence supporting the disability claim",
      "Whether the SSA considered all relevant evidence",
    ],
    whatYouNeed: [
      "SSA denial notice",
      "Medical records and treatment history",
      "Work history and income documentation",
      "Any prior SSA correspondence",
    ],
    whatWeIdentify: [
      "Medical evidence the SSA may not have considered",
      "Gaps in the medical record that need to be filled",
      "Whether the SSA applied the correct evaluation criteria",
      "Deadline and appeal level requirements",
    ],
    whatAppealAddresses: [
      "Medical evidence supporting disability",
      "Arguments addressing each specific denial reason",
      "Request for the appropriate appeal level",
      "Updated or additional evidence",
    ],
    seoTitle: "SSI Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied SSI claim through reconsideration, hearing, or Appeals Council with organized medical evidence and deadline tracking.",
    primaryKeyword: "SSI appeal",
    relatedKeywords: [
      "SSI benefits appeal",
      "appeal SSI benefits",
      "SSI appeal form",
      "appeal SSI decision",
      "SSI denial",
    ],
    route: "/appeal/ssi",
    status: "IMPLEMENTED",
    engine: "Disability Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/ssi-denial",
        cta: "Join the workflow",
  },
  {
    slug: "ssdi",
    title: "SSDI Appeal",
    category: "Disability & Social Security",
    shortDescription:
      "Appeal a denied Social Security Disability Insurance claim with organized medical and work evidence.",
    longDescription:
      "SSDI appeals follow the same SSA appeals process as SSI. The key difference is that SSDI is based on work history and earnings records, and the medical evidence must demonstrate an inability to engage in substantial gainful activity.",
    intendedUser:
      "Individuals denied Social Security Disability Insurance benefits who want to appeal.",
    problemSolved:
      "SSDI denials are frequently reversed on appeal, particularly at the ALJ hearing level, with better medical documentation and legal argument.",
    whatWeAnalyze: [
      "The denial notice and stated medical or vocational reasons",
      "Medical evidence in the record and potential gaps",
      "Work history and earnings records",
      "Whether the SSA correctly applied the sequential evaluation",
      "The applicable deadline and appeal level",
    ],
    whatYouNeed: [
      "SSA denial notice",
      "Comprehensive medical records",
      "Work history and earnings documentation",
      "Physician statements or residual functional capacity assessments",
      "Any prior SSA correspondence",
    ],
    whatWeIdentify: [
      "Medical evidence gaps that need to be filled",
      "Whether the SSA's vocational analysis was correct",
      "Evidence the SSA may not have properly considered",
      "Deadline and appeal level requirements",
    ],
    whatAppealAddresses: [
      "Medical evidence supporting disability under SSA criteria",
      "Vocational arguments if applicable",
      "Arguments addressing each denial reason",
      "Updated medical evidence and provider statements",
    ],
    seoTitle: "SSDI Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied SSDI claim with organized medical and work evidence. Track deadlines through the SSA appeals process.",
    primaryKeyword: "denied SSDI",
    relatedKeywords: [
      "SSDI reconsideration",
      "appeal SSDI denial",
      "social security denial appeal",
      "denied SSDI benefits",
    ],
    route: "/appeal/ssdi",
    status: "IMPLEMENTED",
    engine: "Disability Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/ssdi-denial",
        cta: "Join the workflow",
  },
  {
    slug: "social-security-reconsideration",
    title: "Social Security Reconsideration",
    category: "Disability & Social Security",
    shortDescription:
      "Request reconsideration of a Social Security denial — the first formal appeal level.",
    longDescription:
      "Reconsideration is the first level of appeal for Social Security denials. A different reviewer examines the claim and any new evidence you provide.",
    intendedUser:
      "Individuals who received an initial Social Security denial and want to request reconsideration.",
    problemSolved:
      "Reconsideration gives you the opportunity to have a different reviewer look at your claim with additional evidence.",
    whatWeAnalyze: [
      "The initial denial reasons",
      "What new evidence could strengthen the claim",
      "Whether the reconsideration deadline is met (60 days)",
      "Medical records submitted and gaps",
    ],
    whatYouNeed: [
      "Initial denial notice",
      "New or updated medical records",
      "Reconsideration request forms",
      "Any new physician statements",
    ],
    whatWeIdentify: [
      "Medical evidence gaps to address",
      "Arguments for why the initial decision was wrong",
      "Whether the deadline is met",
      "New evidence to submit",
    ],
    whatAppealAddresses: [
      "New medical evidence",
      "Arguments addressing each initial denial reason",
      "Request for reconsideration with proper forms",
    ],
    seoTitle: "Social Security Reconsideration — Appeal Mail",
    seoDescription:
      "Request reconsideration of a Social Security denial with new evidence and organized arguments.",
    primaryKeyword: "Social Security reconsideration",
    relatedKeywords: ["SSI reconsideration", "SSDI reconsideration"],
    route: "/appeal/social-security-reconsideration",
    status: "IMPLEMENTED",
    engine: "Disability Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/reconsideration",
        cta: "Join the workflow",
  },
  {
    slug: "social-security-overpayment",
    title: "Social Security Overpayment Appeal",
    category: "Disability & Social Security",
    shortDescription:
      "Appeal a Social Security overpayment notice or request a waiver of recovery.",
    longDescription:
      "If the SSA claims you were overpaid, you can appeal the overpayment determination or request a waiver if the overpayment was not your fault and recovery would be unfair.",
    intendedUser:
      "Individuals who received a Social Security overpayment notice and want to appeal or request a waiver.",
    problemSolved:
      "Overpayment notices can be appealed on the merits or waived if recovery would be inequitable and you were not at fault.",
    whatWeAnalyze: [
      "The overpayment notice and amount claimed",
      "Whether the overpayment calculation is correct",
      "Whether you were at fault for the overpayment",
      "Whether recovery would be against equity and good conscience",
    ],
    whatYouNeed: [
      "Overpayment notice from SSA",
      "Income and expense records",
      "Any correspondence about the overpayment",
      "Records showing you reported changes timely",
    ],
    whatWeIdentify: [
      "Calculation errors in the overpayment amount",
      "Evidence that you were not at fault",
      "Financial hardship documentation for waiver",
      "Whether you reported changes that should have prevented the overpayment",
    ],
    whatAppealAddresses: [
      "Disputes with the overpayment calculation",
      "Waiver request with financial documentation",
      "Arguments that recovery would be inequitable",
      "Request for reconsideration or waiver",
    ],
    seoTitle: "Social Security Overpayment Appeal — Appeal Mail",
    seoDescription:
      "Appeal a Social Security overpayment notice or request a waiver of recovery with financial documentation.",
    primaryKeyword: "Social Security overpayment appeal",
    relatedKeywords: ["SSI overpayment appeal", "SSDI overpayment appeal"],
    route: "/appeal/social-security-overpayment",
    status: "IMPLEMENTED",
    engine: "Disability Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/social-security-denial",
        cta: "Join the workflow",
  },
  {
    slug: "appeals-council",
    title: "Appeals Council Appeal",
    category: "Disability & Social Security",
    shortDescription:
      "Request Appeals Council review of an Administrative Law Judge decision.",
    longDescription:
      "The Appeals Council reviews ALJ decisions and can issue its own decision, remand for a new hearing, or deny review. You must request review within 60 days of the ALJ decision.",
    intendedUser:
      "Individuals who received an unfavorable ALJ decision and want to request Appeals Council review.",
    problemSolved:
      "The Appeals Council can review ALJ decisions for errors of law, insufficient evidence, or new and material evidence.",
    whatWeAnalyze: [
      "The ALJ decision and reasoning",
      "Potential legal errors in the ALJ's analysis",
      "New and material evidence not considered by the ALJ",
      "Whether the deadline for Appeals Council review is met",
    ],
    whatYouNeed: [
      "ALJ hearing decision",
      "New evidence if available",
      "Written arguments identifying specific errors",
      "Medical records from after the ALJ hearing",
    ],
    whatWeIdentify: [
      "Legal errors in the ALJ's decision",
      "Evidence gaps or improperly weighed evidence",
      "New and material evidence for the Appeals Council",
      "Deadline compliance",
    ],
    whatAppealAddresses: [
      "Specific legal errors in the ALJ decision",
      "New and material evidence",
      "Arguments for remand or a favorable decision",
      "Request for Appeals Council review with proper forms",
    ],
    seoTitle: "Appeals Council Appeal — Appeal Mail",
    seoDescription:
      "Request Appeals Council review of an ALJ decision with identified legal errors and new evidence.",
    primaryKeyword: "SSDI Appeals Council",
    relatedKeywords: ["Appeals Council appeal", "Social Security appeal"],
    route: "/appeal/appeals-council",
    status: "IMPLEMENTED",
    engine: "Disability Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/social-security-denial",
        cta: "Join the workflow",
  },

  /* ── UNEMPLOYMENT ── */
  {
    slug: "unemployment",
    title: "Unemployment Appeal",
    category: "Unemployment",
    shortDescription:
      "Appeal a denied unemployment benefits decision with evidence of eligibility.",
    longDescription:
      "Unemployment denials can often be reversed on appeal. Common reasons for denial include misconduct, voluntary quit without good cause, or insufficient earnings. A successful appeal addresses the specific reason with evidence.",
    intendedUser:
      "Workers whose unemployment benefits claim was denied and who want to appeal the decision.",
    problemSolved:
      "Unemployment denials are frequently reversed at the hearing level when the appellant presents evidence and testimony contradicting the initial determination.",
    whatWeAnalyze: [
      "The determination notice and stated reason for denial",
      "Whether the denial is based on misconduct, voluntary quit, or earnings",
      "Employment records and separation documentation",
      "The applicable deadline (varies by state, often 10–30 days)",
    ],
    whatYouNeed: [
      "Unemployment determination/denial notice",
      "Employment separation documentation",
      "Pay stubs and earnings records",
      "Any correspondence with the employer about separation",
      "Witness statements if applicable",
    ],
    whatWeIdentify: [
      "Whether the denial reason is supported by the evidence",
      "Gaps in documentation that need to be filled",
      "Contradictions between the employer's account and your records",
      "Deadline and hearing preparation requirements",
    ],
    whatAppealAddresses: [
      "Evidence of eligibility for benefits",
      "Arguments addressing each specific denial reason",
      "Documentation of the employment separation",
      "Request for a hearing with proper forms",
    ],
    seoTitle: "Unemployment Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied unemployment benefits decision with evidence of eligibility and documentation of employment separation.",
    primaryKeyword: "unemployment appeal",
    relatedKeywords: [
      "appeal of unemployment",
      "appeal on unemployment",
      "lawyer for unemployment appeal",
      "denied unemployment",
      "appeal unemployment decision",
      "appealing unemployment denial",
    ],
    route: "/appeal/unemployment",
    status: "IMPLEMENTED",
    engine: "Unemployment Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/unemployment-denial",
        cta: "Join the workflow",
  },
  {
    slug: "edd",
    title: "EDD Appeal",
    category: "Unemployment",
    shortDescription:
      "Appeal a California EDD unemployment determination with evidence and deadline tracking.",
    longDescription:
      "California EDD appeals go through the California Unemployment Insurance Appeals Board (CUIAB). You must appeal within 20 days of the determination mailing date.",
    intendedUser:
      "California workers whose EDD unemployment claim was denied and who want to appeal.",
    problemSolved:
      "EDD denials can be reversed at the CUIAB hearing with proper evidence and argument.",
    whatWeAnalyze: [
      "The EDD determination and stated reason",
      "Whether the 20-day deadline is met",
      "California UI Code provisions relevant to the denial",
      "Employment separation documentation",
    ],
    whatYouNeed: [
      "EDD determination notice",
      "Employment separation records",
      "Earnings documentation",
      "Any EDD correspondence",
    ],
    whatWeIdentify: [
      "Whether the denial aligns with California UI Code",
      "Evidence gaps for the CUIAB hearing",
      "Deadline compliance",
      "Contradictions in the employer's account",
    ],
    whatAppealAddresses: [
      "California UI Code arguments",
      "Evidence of eligibility",
      "Arguments for each denial reason",
      "Request for CUIAB hearing",
    ],
    seoTitle: "EDD Appeal — Appeal Mail",
    seoDescription:
      "Appeal a California EDD unemployment determination with evidence, California UI Code arguments, and deadline tracking.",
    primaryKeyword: "EDD appeal",
    relatedKeywords: ["unemployment appeal", "California unemployment appeal"],
    route: "/appeal/edd",
    status: "IMPLEMENTED",
    engine: "Unemployment Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/edd-denial",
        cta: "Join the workflow",
  },

  /* ── GOVERNMENT BENEFITS ── */
  {
    slug: "medicaid",
    title: "Medicaid Appeal",
    category: "Government Benefits",
    shortDescription:
      "Appeal a denied Medicaid claim or eligibility determination with supporting documentation.",
    longDescription:
      "Medicaid denials can involve eligibility disputes, coverage issues, or service authorization denials. Each state has its own Medicaid appeals process, typically involving a fair hearing request.",
    intendedUser:
      "Individuals denied Medicaid coverage or eligibility who want to appeal.",
    problemSolved:
      "Medicaid denials are often reversible when you provide the correct income, household, or medical documentation and follow the state's fair hearing process.",
    whatWeAnalyze: [
      "The Medicaid denial notice and stated reason",
      "Eligibility criteria and whether you meet them",
      "Income and household documentation",
      "The applicable deadline for requesting a fair hearing",
      "State-specific Medicaid appeal procedures",
    ],
    whatYouNeed: [
      "Medicaid denial notice",
      "Income and household documentation",
      "Medical records if the denial involves service authorization",
      "Any prior Medicaid correspondence",
    ],
    whatWeIdentify: [
      "Eligibility documentation gaps",
      "Whether the denial applied the correct criteria",
      "Deadline and fair hearing requirements",
      "Evidence supporting eligibility or medical necessity",
    ],
    whatAppealAddresses: [
      "Income and household documentation supporting eligibility",
      "Medical necessity arguments if applicable",
      "Procedural errors in the denial",
      "Request for a fair hearing",
    ],
    seoTitle: "Medicaid Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied Medicaid claim or eligibility determination with supporting documentation and fair hearing request.",
    primaryKeyword: "appeal for Medicaid",
    relatedKeywords: [
      "Medicaid denied",
      "appeal Medicaid denial",
      "appealing a Medicaid denial",
      "appeal Medicaid decision",
    ],
    route: "/appeal/medicaid",
    status: "IMPLEMENTED",
    engine: "Benefits Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/medicaid-denial",
        cta: "Join the workflow",
  },
  {
    slug: "snap",
    title: "SNAP / Food Stamp Appeal",
    category: "Government Benefits",
    shortDescription:
      "Appeal a denied SNAP or food stamp benefits determination with evidence of eligibility.",
    longDescription:
      "SNAP denials can involve income calculations, household composition disputes, or work requirement issues. You have the right to request a fair hearing, typically within 90 days.",
    intendedUser:
      "Individuals denied SNAP/food stamp benefits who want to appeal the determination.",
    problemSolved:
      "SNAP denials are often reversed on appeal when you provide correct income documentation and address the specific denial reason.",
    whatWeAnalyze: [
      "The SNAP denial notice and stated reason",
      "Income calculation and whether it is correct",
      "Household composition determination",
      "Work requirement issues if applicable",
      "The fair hearing deadline",
    ],
    whatYouNeed: [
      "SNAP denial notice",
      "Income documentation (pay stubs, tax returns, etc.)",
      "Household expense records",
      "Any SNAP correspondence",
    ],
    whatWeIdentify: [
      "Income calculation errors",
      "Household composition disputes",
      "Whether the work requirement was properly applied",
      "Deadline compliance",
    ],
    whatAppealAddresses: [
      "Correct income documentation",
      "Household composition arguments",
      "Work requirement exemptions if applicable",
      "Request for a fair hearing",
    ],
    seoTitle: "SNAP / Food Stamp Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied SNAP or food stamp benefits determination with evidence of eligibility and income documentation.",
    primaryKeyword: "SNAP appeal",
    relatedKeywords: ["food stamp appeal", "benefits denial appeal"],
    route: "/appeal/snap",
    status: "IMPLEMENTED",
    engine: "Benefits Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/medicaid-denial",
        cta: "Join the workflow",
  },

  /* ── WORKERS' COMPENSATION ── */
  {
    slug: "workers-comp",
    title: "Workers' Compensation Appeal",
    category: "Workers' Compensation",
    shortDescription:
      "Appeal a denied workers' compensation claim with medical evidence and injury documentation.",
    longDescription:
      "Workers' compensation denials can involve disputes about whether the injury is work-related, the extent of disability, or the necessity of treatment. Each state has its own workers' comp appeals process.",
    intendedUser:
      "Workers whose workers' compensation claim was denied and who want to appeal.",
    problemSolved:
      "Workers' comp denials are frequently reversed on appeal with proper medical documentation connecting the injury to the workplace.",
    whatWeAnalyze: [
      "The denial notice and stated reason",
      "Medical evidence connecting the injury to work",
      "Whether the injury was reported within the required timeframe",
      "State-specific workers' comp appeal procedures",
      "Wage and disability documentation",
    ],
    whatYouNeed: [
      "Workers' comp denial letter",
      "Medical records and physician reports",
      "Incident report and witness statements",
      "Wage records",
      "Any prior correspondence with the insurer or employer",
    ],
    whatWeIdentify: [
      "Medical evidence gaps connecting the injury to work",
      "Whether the injury was reported on time",
      "Contradictions in the insurer's denial rationale",
      "Whether the correct state procedures were followed",
    ],
    whatAppealAddresses: [
      "Medical evidence of a work-related injury",
      "Arguments addressing each denial reason",
      "Wage and disability documentation",
      "Request for the appropriate appeals board hearing",
    ],
    seoTitle: "Workers' Compensation Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied workers' compensation claim with medical evidence and injury documentation.",
    primaryKeyword: "workers compensation appeal",
    relatedKeywords: [
      "workers comp appeal",
      "my workers comp claim was denied",
      "appealing workers compensation decision",
    ],
    route: "/appeal/workers-comp",
    status: "IMPLEMENTED",
    engine: "Workers Compensation Engine",
    executable: true,
    workflowRoute: "/workflows/insurance-claim-denial",
        cta: "Join the workflow",
  },

  /* ── VETERANS ── */
  {
    slug: "va-claim",
    title: "VA Claim Appeal",
    category: "Veterans",
    shortDescription:
      "Appeal a denied VA disability claim under the Appeals Modernization Act review pathways.",
    longDescription:
      "VA claim appeals under the Appeals Modernization Act offer three review pathways: Higher-Level Review, Supplemental Claim, and Board Appeal. Each has different requirements and timelines.",
    intendedUser:
      "Veterans whose VA disability claim was denied and who want to appeal the decision.",
    problemSolved:
      "VA denials can be reversed through the appropriate review pathway with new evidence or identification of errors in the original decision.",
    whatWeAnalyze: [
      "The VA decision and stated reason for denial",
      "Which review pathway is appropriate (HLR, Supplemental Claim, or Board)",
      "Service connection evidence and medical nexus",
      "Whether the VA properly considered all evidence",
      "The applicable deadline for the chosen pathway",
    ],
    whatYouNeed: [
      "VA decision letter",
      "Service treatment records and personnel records",
      "Medical evidence and nexus opinions",
      "Any prior VA correspondence or claims",
    ],
    whatWeIdentify: [
      "Medical evidence gaps in the service connection chain",
      "Errors in the VA's evaluation of your evidence",
      "New evidence that could support a Supplemental Claim",
      "Arguments for a Higher-Level Review or Board Appeal",
    ],
    whatAppealAddresses: [
      "Service connection arguments with medical nexus evidence",
      "Identification of errors in the original decision",
      "New and relevant evidence",
      "Request for the appropriate review pathway",
    ],
    seoTitle: "VA Claim Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied VA disability claim under the Appeals Modernization Act with organized evidence and pathway selection.",
    primaryKeyword: "appeal VA claim",
    relatedKeywords: ["VA appeal", "VA disability appeal", "VA claim denial"],
    route: "/appeal/va-claim",
    status: "IMPLEMENTED",
    engine: "Veterans Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/government-decision",
        cta: "Join the workflow",
  },

  /* ── ADMINISTRATIVE ── */
  {
    slug: "agency-decision",
    title: "Agency Decision Appeal",
    category: "Administrative",
    shortDescription:
      "Appeal an adverse agency decision with evidence, regulatory arguments, and deadline compliance.",
    longDescription:
      "Agency decisions can involve licensing, permits, regulatory compliance, or administrative penalties. Each agency has its own appeal process, often requiring a formal written appeal within a specific deadline.",
    intendedUser:
      "Individuals or businesses affected by an adverse agency decision who want to appeal.",
    problemSolved:
      "Agency decisions often have very short appeal deadlines and specific procedural requirements that must be followed exactly.",
    whatWeAnalyze: [
      "The agency decision and stated basis",
      "Applicable regulations and whether the decision aligns with them",
      "The appeal deadline and process requirements",
      "Supporting documentation and evidence",
    ],
    whatYouNeed: [
      "Agency decision letter or order",
      "Relevant regulations or statutes",
      "Supporting documentation and correspondence",
      "Any prior agency correspondence",
    ],
    whatWeIdentify: [
      "Whether the decision aligns with applicable regulations",
      "Procedural errors in the agency's process",
      "Evidence the agency may not have considered",
      "Deadline and process compliance requirements",
    ],
    whatAppealAddresses: [
      "Regulatory arguments challenging the decision",
      "Evidence supporting your position",
      "Procedural errors in the decision-making process",
      "Request for review or hearing",
    ],
    seoTitle: "Agency Decision Appeal — Appeal Mail",
    seoDescription:
      "Appeal an adverse agency decision with evidence, regulatory arguments, and deadline compliance.",
    primaryKeyword: "agency decision appeal",
    relatedKeywords: ["administrative decision appeal", "regulatory appeal"],
    route: "/appeal/agency-decision",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/government-decision",
        cta: "Join the workflow",
  },
  {
    slug: "licensing",
    title: "Licensing Appeal",
    category: "Administrative",
    shortDescription:
      "Appeal a denied, suspended, or revoked professional license with evidence and regulatory arguments.",
    longDescription:
      "Licensing appeals involve professional boards, state licensing agencies, or regulatory bodies. The appeal process typically requires a formal written response and may include a hearing.",
    intendedUser:
      "Professionals whose license was denied, suspended, or revoked and who want to appeal.",
    problemSolved:
      "Licensing decisions can often be reversed on appeal when you address the specific grounds for discipline or denial.",
    whatWeAnalyze: [
      "The licensing decision and stated grounds",
      "Whether the decision aligns with licensing regulations",
      "The appeal deadline and process",
      "Evidence supporting reinstatement or approval",
    ],
    whatYouNeed: [
      "Licensing decision or order",
      "Professional license records",
      "Evidence of compliance or rehabilitation",
      "Any prior correspondence with the licensing board",
    ],
    whatWeIdentify: [
      "Whether the licensing board followed proper procedure",
      "Evidence supporting your case for licensure or reinstatement",
      "Regulatory arguments challenging the decision",
      "Deadline compliance",
    ],
    whatAppealAddresses: [
      "Arguments addressing each ground for denial or discipline",
      "Evidence of compliance, rehabilitation, or good standing",
      "Procedural errors in the licensing process",
      "Request for hearing or review",
    ],
    seoTitle: "Licensing Appeal — Appeal Mail",
    seoDescription:
      "Appeal a denied, suspended, or revoked professional license with evidence and regulatory arguments.",
    primaryKeyword: "licensing appeal",
    relatedKeywords: ["professional license appeal", "regulatory appeal"],
    route: "/appeal/licensing",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/license-suspension-appeal",
        cta: "Join the workflow",
  },
  /* ── EDUCATION & FINANCIAL AID ── */
  {
    slug: "financial-aid-appeal",
    title: "Financial Aid Appeal",
    category: "Administrative",
    shortDescription: "Appeal a financial aid decision with changed circumstances or new information.",
    longDescription: "Financial aid appeals can adjust your aid package when circumstances change — job loss, medical expenses, or family changes. A strong appeal documents the change and connects it to the aid formula.",
    intendedUser: "Students and families appealing a financial aid award or denial.",
    problemSolved: "Financial aid offices can adjust awards when circumstances change, but only if you document the change and connect it to the aid formula.",
    whatWeAnalyze: ["The original aid decision and award letter", "Stated reasons for the aid amount", "Deadline and process for appeal", "Supporting documentation for changed circumstances"],
    whatYouNeed: ["Financial aid award letter or denial", "Documentation of changed circumstances", "Tax returns or income documentation", "Any correspondence with the financial aid office"],
    whatWeIdentify: ["Gaps between your circumstances and the aid formula", "Missing documentation", "Deadline and process errors", "Grounds for professional judgment review"],
    whatAppealAddresses: ["Documented change in circumstances", "Request for professional judgment review", "Specific adjustment requested", "Supporting evidence"],
    seoTitle: "Financial Aid Appeal — Appeal Mail",
    seoDescription: "Appeal a financial aid decision with documented changed circumstances and supporting evidence.",
    primaryKeyword: "financial aid appeal",
    relatedKeywords: ["financial aid appeal letter", "FAFSA appeal", "college financial aid appeal"],
    route: "/appeal/financial-aid-appeal",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/financial-aid-appeal",
    cta: "Start Appeal",
  },
  {
    slug: "financial-aid-suspension",
    title: "Financial Aid Suspension Appeal",
    category: "Administrative",
    shortDescription: "Appeal a financial aid suspension for unsatisfactory academic progress.",
    longDescription: "Financial aid suspension often results from not meeting SAP (Satisfactory Academic Progress) requirements. A successful appeal documents the circumstances that caused the academic issues and shows a plan to regain good standing.",
    intendedUser: "Students whose financial aid has been suspended due to unsatisfactory academic progress.",
    problemSolved: "SAP appeals require documenting mitigating circumstances and presenting a remediation plan.",
    whatWeAnalyze: ["The SAP policy and requirements", "Your academic record vs. SAP thresholds", "Stated grounds for suspension", "Appeal deadline and process"],
    whatYouNeed: ["SAP suspension notice", "Academic transcript", "Documentation of mitigating circumstances", "Academic improvement plan"],
    whatWeIdentify: ["Whether the SAP calculation is correct", "Mitigating circumstances documentation", "Gaps in the appeal record", "Deadline compliance"],
    whatAppealAddresses: ["Documented mitigating circumstances", "Academic improvement plan", "Request for reinstatement", "Specific relief sought"],
    seoTitle: "Financial Aid Suspension Appeal — Appeal Mail",
    seoDescription: "Appeal a financial aid suspension for unsatisfactory academic progress with documented mitigating circumstances.",
    primaryKeyword: "financial aid suspension appeal",
    relatedKeywords: ["SAP appeal", "financial aid reinstatement", "academic progress appeal"],
    route: "/appeal/financial-aid-suspension",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/financial-aid-suspension-appeal",
    cta: "Start Appeal",
  },
  {
    slug: "financial-aid-reinstatement",
    title: "Financial Aid Reinstatement Appeal",
    category: "Administrative",
    shortDescription: "Request reinstatement of financial aid after suspension or loss of eligibility.",
    longDescription: "Reinstatement appeals focus on showing that the circumstances that caused the suspension have been resolved and that you are now positioned to meet academic requirements.",
    intendedUser: "Students seeking reinstatement of financial aid after a suspension period.",
    problemSolved: "Reinstatement requires demonstrating that prior issues are resolved and future success is likely.",
    whatWeAnalyze: ["The original suspension decision", "Current academic standing", "Prior appeal history", "Reinstatement requirements"],
    whatYouNeed: ["Original suspension letter", "Current transcript", "Documentation of resolved circumstances", "Academic plan"],
    whatWeIdentify: ["Whether reinstatement criteria are met", "Evidence of changed circumstances", "Academic progress since suspension", "Gaps in documentation"],
    whatAppealAddresses: ["Evidence of resolved circumstances", "Academic plan for success", "Request for reinstatement", "Supporting documentation"],
    seoTitle: "Financial Aid Reinstatement — Appeal Mail",
    seoDescription: "Request financial aid reinstatement after suspension with evidence of resolved circumstances and an academic plan.",
    primaryKeyword: "financial aid reinstatement",
    relatedKeywords: ["financial aid reinstatement appeal", "aid reinstatement letter", "FAFSA reinstatement"],
    route: "/appeal/financial-aid-reinstatement",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/financial-aid-reinstatement",
    cta: "Start Appeal",
  },
  {
    slug: "financial-aid-special-circumstances",
    title: "Financial Aid Special Circumstances Appeal",
    category: "Administrative",
    shortDescription: "Request a financial aid adjustment for special circumstances not reflected in FAFSA.",
    longDescription: "Special circumstances appeals ask the financial aid office to use professional judgment to adjust your aid based on circumstances not captured in the FAFSA — such as loss of income, medical expenses, or family changes.",
    intendedUser: "Students whose financial situation has changed since filing the FAFSA.",
    problemSolved: "The FAFSA uses prior-prior year tax data. If your circumstances have changed, a special circumstances appeal can adjust your aid.",
    whatWeAnalyze: ["The original aid calculation", "Stated special circumstances", "Documentation supporting the adjustment", "Professional judgment criteria"],
    whatYouNeed: ["FAFSA submission summary", "Documentation of special circumstances", "Updated income or expense documentation", "Prior aid award letter"],
    whatWeIdentify: ["Whether circumstances qualify for professional judgment", "Documentation gaps", "Impact on aid calculation", "Missing evidence"],
    whatAppealAddresses: ["Documented special circumstances", "Request for professional judgment adjustment", "Specific financial impact", "Supporting evidence"],
    seoTitle: "Financial Aid Special Circumstances — Appeal Mail",
    seoDescription: "Request a financial aid adjustment for special circumstances not reflected in your FAFSA.",
    primaryKeyword: "financial aid special circumstances",
    relatedKeywords: ["special circumstances appeal", "professional judgment appeal", "FAFSA special circumstances"],
    route: "/appeal/financial-aid-special-circumstances",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/financial-aid-special-circumstances",
    cta: "Start Appeal",
  },
  {
    slug: "sap-appeal",
    title: "SAP Appeal",
    category: "Administrative",
    shortDescription: "Appeal a Satisfactory Academic Progress (SAP) determination affecting financial aid.",
    longDescription: "SAP appeals challenge a financial aid suspension or warning based on not meeting academic progress standards. A successful appeal documents the circumstances and presents a plan to regain compliance.",
    intendedUser: "Students facing financial aid loss due to SAP non-compliance.",
    problemSolved: "SAP standards require minimum GPA, completion rate, and maximum timeframe. Appeals document why these were not met.",
    whatWeAnalyze: ["The SAP policy and thresholds", "Your academic record vs. requirements", "Stated grounds for non-compliance", "Appeal process and deadline"],
    whatYouNeed: ["SAP determination letter", "Academic transcript", "Documentation of mitigating circumstances", "Academic success plan"],
    whatWeIdentify: ["Whether the SAP calculation is correct", "Mitigating circumstances", "Plan feasibility", "Deadline compliance"],
    whatAppealAddresses: ["Documented mitigating circumstances", "Academic success plan", "Request for continued aid", "Specific relief sought"],
    seoTitle: "SAP Appeal — Appeal Mail",
    seoDescription: "Appeal a Satisfactory Academic Progress determination with documented circumstances and an academic plan.",
    primaryKeyword: "SAP appeal",
    relatedKeywords: ["satisfactory academic progress appeal", "SAP appeal letter", "financial aid SAP appeal"],
    route: "/appeal/sap-appeal",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/sap-appeal",
    cta: "Start Appeal",
  },
  {
    slug: "fafsa-appeal",
    title: "FAFSA Appeal",
    category: "Administrative",
    shortDescription: "Appeal a FAFSA determination or request a dependency override or income adjustment.",
    longDescription: "FAFSA appeals include dependency overrides, income adjustments, and special circumstance requests that adjust the Student Aid Index calculation.",
    intendedUser: "Students who need to adjust their FAFSA-based aid calculation.",
    problemSolved: "The FAFSA does not capture all circumstances. Appeals can adjust the calculation through professional judgment.",
    whatWeAnalyze: ["The FAFSA submission and SAI calculation", "Stated grounds for appeal", "Documentation supporting adjustment", "Financial aid office process"],
    whatYouNeed: ["FAFSA confirmation", "Documentation of circumstances", "Income or expense documentation", "Prior aid award"],
    whatWeIdentify: ["Whether the SAI calculation can be adjusted", "Documentation gaps", "Eligibility for dependency override", "Missing evidence"],
    whatAppealAddresses: ["Documented circumstances", "Request for SAI adjustment or dependency override", "Financial impact documentation", "Supporting evidence"],
    seoTitle: "FAFSA Appeal — Appeal Mail",
    seoDescription: "Appeal a FAFSA determination with documented circumstances and request an adjustment to your aid calculation.",
    primaryKeyword: "FAFSA appeal",
    relatedKeywords: ["FAFSA appeal letter", "dependency override", "FAFSA adjustment appeal"],
    route: "/appeal/fafsa-appeal",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/fafsa-appeal",
    cta: "Start Appeal",
  },
  {
    slug: "scholarship-appeal",
    title: "Scholarship Appeal",
    category: "Administrative",
    shortDescription: "Appeal a scholarship denial, reduction, or revocation decision.",
    longDescription: "Scholarship appeals challenge decisions to deny, reduce, or revoke scholarship funding based on academic performance, eligibility disputes, or changed circumstances.",
    intendedUser: "Students appealing a scholarship decision.",
    problemSolved: "Scholarship decisions can sometimes be reversed with additional documentation or evidence of qualifying circumstances.",
    whatWeAnalyze: ["The scholarship decision and criteria", "Your eligibility record", "Stated grounds for the decision", "Appeal process"],
    whatYouNeed: ["Scholarship decision letter", "Academic transcript", "Documentation of circumstances", "Scholarship criteria documentation"],
    whatWeIdentify: ["Whether the decision aligns with scholarship criteria", "Documentation gaps", "Eligibility disputes", "Missing evidence"],
    whatAppealAddresses: ["Documented eligibility or circumstances", "Request for reconsideration", "Specific relief sought", "Supporting evidence"],
    seoTitle: "Scholarship Appeal — Appeal Mail",
    seoDescription: "Appeal a scholarship denial, reduction, or revocation with documented evidence.",
    primaryKeyword: "scholarship appeal",
    relatedKeywords: ["scholarship appeal letter", "scholarship denial appeal", "merit scholarship appeal"],
    route: "/appeal/scholarship-appeal",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/scholarship-appeal",
    cta: "Start Appeal",
  },
  {
    slug: "life-insurance-denial",
    title: "Life Insurance Denial Appeal",
    category: "Insurance",
    shortDescription: "Appeal a denied life insurance claim with policy evidence and beneficiary documentation.",
    longDescription: "Life insurance claim denials often cite policy exclusions, misrepresentation, or eligibility disputes. A successful appeal addresses each denial reason with policy provisions and supporting evidence.",
    intendedUser: "Beneficiaries of a denied life insurance claim.",
    problemSolved: "Life insurance denials can be reversed when the appeal addresses the specific policy language and provides evidence contradicting the denial rationale.",
    whatWeAnalyze: ["The stated denial reason", "Policy provisions cited", "Claim and policy reference numbers", "Beneficiary documentation", "Whether the denial cites correct policy language"],
    whatYouNeed: ["Denial letter", "Life insurance policy", "Death certificate", "Beneficiary documentation", "Any correspondence with the insurer"],
    whatWeIdentify: ["Policy provisions that may not support the denial", "Factual discrepancies in the denial", "Evidence not considered", "Procedural errors"],
    whatAppealAddresses: ["Each denial reason with evidence", "Policy provisions supporting coverage", "Procedural errors", "Request for reconsideration"],
    seoTitle: "Life Insurance Denial Appeal — Appeal Mail",
    seoDescription: "Appeal a denied life insurance claim with policy evidence and beneficiary documentation.",
    primaryKeyword: "life insurance denial appeal",
    relatedKeywords: ["life insurance claim denial", "life insurance appeal letter", "contested life insurance claim"],
    route: "/appeal/life-insurance-denial",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/life-insurance-denial",
    cta: "Start Appeal",
  },
  {
    slug: "car-insurance-appeal",
    title: "Car Insurance Appeal",
    category: "Insurance",
    shortDescription: "Appeal a denied auto insurance claim with accident evidence and policy analysis.",
    longDescription: "Auto insurance claim denials often involve coverage disputes, liability determinations, or damage assessments. A strong appeal addresses the specific denial reason with accident reports, photos, and policy language.",
    intendedUser: "Drivers appealing a denied auto insurance claim.",
    problemSolved: "Auto claim denials can be reversed with evidence showing coverage applies, liability is incorrect, or damage assessments are wrong.",
    whatWeAnalyze: ["The stated denial reason", "Policy coverage provisions", "Liability determination", "Damage assessment", "Accident report facts"],
    whatYouNeed: ["Denial letter", "Auto insurance policy", "Accident report", "Photos of damage", "Repair estimates", "Any witness statements"],
    whatWeIdentify: ["Coverage provisions supporting the claim", "Liability disputes", "Damage assessment errors", "Evidence not considered"],
    whatAppealAddresses: ["Each denial reason with evidence", "Policy provisions supporting coverage", "Liability or damage corrections", "Request for reconsideration"],
    seoTitle: "Car Insurance Appeal — Appeal Mail",
    seoDescription: "Appeal a denied auto insurance claim with accident evidence and policy analysis.",
    primaryKeyword: "car insurance appeal letter",
    relatedKeywords: ["auto insurance appeal", "car insurance claim denial appeal", "auto claim dispute"],
    route: "/appeal/car-insurance-appeal",
    status: "IMPLEMENTED",
    engine: "Insurance Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/car-insurance-appeal",
    cta: "Start Appeal",
  },
  {
    slug: "drivers-license-suspension",
    title: "Driver's License Suspension Appeal",
    category: "Administrative",
    shortDescription: "Appeal a driver's license suspension with evidence and hardship documentation.",
    longDescription: "Driver's license suspensions can affect employment and daily life. An appeal may challenge the suspension grounds or request a hardship or restricted license.",
    intendedUser: "Drivers appealing a license suspension.",
    problemSolved: "Suspension appeals can challenge the grounds for suspension or request a restricted/hardship license.",
    whatWeAnalyze: ["The suspension notice and stated grounds", "Your driving record", "Eligibility for hardship/restricted license", "Appeal deadline and process"],
    whatYouNeed: ["Suspension notice", "Driving record", "Hardship documentation (employment, medical, education)", "Any court orders"],
    whatWeIdentify: ["Whether the suspension grounds are supported", "Hardship eligibility", "Procedural errors", "Missing documentation"],
    whatAppealAddresses: ["Challenge to suspension grounds", "Hardship/restricted license request", "Documentation of need", "Request for hearing"],
    seoTitle: "Driver's License Suspension Appeal — Appeal Mail",
    seoDescription: "Appeal a driver's license suspension with evidence and hardship documentation.",
    primaryKeyword: "drivers license suspension appeal",
    relatedKeywords: ["license suspension appeal", "hardship license appeal", "DMV suspension appeal"],
    route: "/appeal/drivers-license-suspension",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/drivers-license-suspension",
    cta: "Start Appeal",
  },
  {
    slug: "license-revocation-appeal",
    title: "License Revocation Appeal",
    category: "Administrative",
    shortDescription: "Appeal a license revocation with evidence of compliance or rehabilitation.",
    longDescription: "License revocation appeals challenge the revocation decision or demonstrate that circumstances warrant reinstatement.",
    intendedUser: "Individuals or businesses appealing a license revocation.",
    problemSolved: "Revocation can be reversed by challenging the grounds or showing rehabilitation or compliance.",
    whatWeAnalyze: ["The revocation order and grounds", "Compliance or rehabilitation evidence", "Procedural requirements", "Appeal deadline"],
    whatYouNeed: ["Revocation order", "Compliance documentation", "Rehabilitation evidence", "Prior license history"],
    whatWeIdentify: ["Whether revocation grounds are supported", "Rehabilitation or compliance evidence", "Procedural errors", "Missing documentation"],
    whatAppealAddresses: ["Challenge to revocation grounds", "Evidence of rehabilitation", "Request for reinstatement", "Specific relief sought"],
    seoTitle: "License Revocation Appeal — Appeal Mail",
    seoDescription: "Appeal a license revocation with evidence of compliance or rehabilitation.",
    primaryKeyword: "license revocation appeal",
    relatedKeywords: ["license revocation hearing", "license reinstatement appeal", "professional license revocation"],
    route: "/appeal/license-revocation-appeal",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/license-revocation-appeal",
    cta: "Start Appeal",
  },
  {
    slug: "registration-suspension-appeal",
    title: "Registration Suspension Appeal",
    category: "Administrative",
    shortDescription: "Appeal a vehicle registration suspension with evidence and hardship documentation.",
    longDescription: "Vehicle registration suspensions can result from unpaid fines, insurance lapses, or emissions failures. An appeal can challenge the grounds or request a hardship exception.",
    intendedUser: "Vehicle owners appealing a registration suspension.",
    problemSolved: "Registration suspensions can be reversed by addressing the underlying cause or demonstrating hardship.",
    whatWeAnalyze: ["The suspension notice and grounds", "Underlying cause status", "Hardship documentation", "Appeal process"],
    whatYouNeed: ["Suspension notice", "Proof of compliance (insurance, emissions, payment)", "Hardship documentation", "Vehicle records"],
    whatWeIdentify: ["Whether the suspension grounds are resolved", "Hardship eligibility", "Procedural errors", "Missing documentation"],
    whatAppealAddresses: ["Proof of compliance", "Hardship request", "Request for reinstatement", "Specific relief sought"],
    seoTitle: "Registration Suspension Appeal — Appeal Mail",
    seoDescription: "Appeal a vehicle registration suspension with evidence and hardship documentation.",
    primaryKeyword: "registration suspension appeal",
    relatedKeywords: ["vehicle registration suspension", "registration appeal", "DMV registration appeal"],
    route: "/appeal/registration-suspension-appeal",
    status: "IMPLEMENTED",
    engine: "Administrative Appeal Engine",
    executable: true,
    workflowRoute: "/workflows/registration-suspension-appeal",
    cta: "Start Appeal",
  },

  // ── Tax & IRS (Wave 2 — Document Intelligence Anchor) ──
  {
    slug: "irs-cp2000-response",
    title: "Respond to CP2000 Notice",
    category: "Tax & IRS",
    shortDescription: "Verify income discrepancies and build an item-by-item response to the IRS underreporter notice.",
    longDescription: "The CP2000 is the IRS's Automated Underreporter (AUR) program notice. It proposes changes to your tax return based on income the IRS believes was underreported — typically because a 1099 or W-2 doesn't match your return. You have 30 days to respond. This workflow parses the notice, extracts each discrepancy, matches it against your income documents, and builds an item-by-item response that agrees, disputes with evidence, or requests further review for each line item.",
    intendedUser: "Taxpayers who received a CP2000 Notice of Underreported Income and need to respond within 30 days.",
    problemSolved: "The CP2000 is not a bill — it is a proposal. But ignoring it turns it into an assessment. This workflow helps you verify each discrepancy against your actual income documents, agree where the IRS is right, dispute where the IRS is wrong, and produce a response that the IRS can process efficiently.",
    whatWeAnalyze: ["Notice number and date", "Tax year", "Each income discrepancy (reported vs. IRS amount)", "Response deadline (30 days from notice)", "Whether a corrected return (1040X) is needed", "Evidence gaps for disputed items"],
    whatYouNeed: ["The CP2000 notice (mailed or PDF)", "Tax return for the disputed year", "All W-2s, 1099s, K-1s for the year", "Brokerage statements (if investment income is disputed)", "Prior IRS correspondence about this tax year"],
    whatWeIdentify: ["Notice number and exact deadline", "Each income discrepancy with its source", "Which items you agree with", "Which items you disagree with and why", "Missing evidence for disputed items", "Whether an amended return is needed"],
    whatAppealAddresses: ["Agreement with IRS adjustments (sign and pay)", "Disagreement with specific items (attach evidence)", "Partial agreement (agree on some, dispute others)", "Request for audit reconsideration", "Corrected return (1040X) if needed"],
    seoTitle: "Respond to IRS CP2000 Notice — Underreported Income Response",
    seoDescription: "Upload your CP2000 notice, verify each income discrepancy against your tax documents, and build a source-grounded response. 30-day deadline.",
    primaryKeyword: "cp2000 response letter",
    relatedKeywords: ["irs cp2000 notice", "underreported income notice", "cp2000 response", "irs notice response letter", "automated underreporter notice"],
    route: "/appeal/irs-cp2000-response",
    status: "IMPLEMENTED",
    engine: "IRS Notice Response Engine",
    executable: true,
    workflowRoute: "/workflows/irs-cp2000-response",
    cta: "Start Response",
  },
  {
    slug: "irs-cp14-response",
    title: "Respond to CP14 Balance Due Notice",
    category: "Tax & IRS",
    shortDescription: "Verify the amount owed and build a response to pay, dispute, or request a payment plan.",
    longDescription: "The CP14 is the IRS's first balance-due notice. It tells you that you owe taxes, shows the amount with penalties and interest, and asks for payment. This workflow parses the notice, verifies the balance against your records, and helps you decide whether to pay in full, set up an installment agreement, or dispute the amount — with a response letter that includes the right forms and documentation.",
    intendedUser: "Taxpayers who received a CP14 Balance Due notice and need to pay, set up a payment plan, or dispute the amount.",
    problemSolved: "A CP14 starts the collection process. Ignoring it escalates to CP501, CP503, and eventually CP504 (levy notice). This workflow helps you verify the balance, choose the right response, and produce documentation — whether that's a payment, an installment agreement request (Form 9465), or a dispute with evidence.",
    whatWeAnalyze: ["Notice number and date", "Tax period", "Amount owed with penalty and interest breakdown", "Whether the balance is correct", "Payment plan eligibility", "Dispute evidence"],
    whatYouNeed: ["The CP14 notice", "Tax return for the period shown", "IRS account transcript (Form 4506-T)", "Payment records if any payments were made", "Financial information for payment plan (Form 433-F)"],
    whatWeIdentify: ["Notice number and exact amount owed", "Whether the balance matches your records", "Penalty and interest breakdown", "Payment plan eligibility and proposed monthly payment", "Dispute grounds if the amount is incorrect"],
    whatAppealAddresses: ["Payment in full", "Installment agreement request (Form 9465)", "Offer in Compromise (Form 656)", "Currently Not Collectible status", "Dispute of the balance with evidence"],
    seoTitle: "Respond to IRS CP14 Balance Due — Payment Plan or Dispute",
    seoDescription: "Upload your CP14 notice, verify the amount owed, and build a response to pay, request an installment agreement, or dispute the balance.",
    primaryKeyword: "cp14 irs notice response",
    relatedKeywords: ["irs cp14 notice", "balance due notice", "cp14 response", "irs payment plan request", "irs balance due response"],
    route: "/appeal/irs-cp14-response",
    status: "IMPLEMENTED",
    engine: "IRS Notice Response Engine",
    executable: true,
    workflowRoute: "/workflows/irs-cp14-response",
    cta: "Start Response",
  },
  {
    slug: "irs-cp504-response",
    title: "Respond to CP504 Levy Notice",
    category: "Tax & IRS",
    shortDescription: "Request a Collection Due Process hearing or pay — within the critical 30-day deadline before levy.",
    longDescription: "The CP504 is the IRS's Final Notice of Intent to Levy. It gives you 30 days to act before the IRS can seize your bank accounts, wages, and other assets. This is a critical deadline — missing it forfeits your right to a Collection Due Process (CDP) hearing permanently. This workflow parses the notice, computes the exact CDP deadline, assesses your options, and helps you prepare a Form 12153 CDP hearing request or negotiate a collection alternative.",
    intendedUser: "Taxpayers who received a CP504 Final Notice of Intent to Levy and need to act within 30 days to preserve their rights.",
    problemSolved: "The CP504 is the last notice before levy. After 30 days, the IRS can seize assets without further notice. This workflow ensures you understand the deadline, know your CDP hearing rights, and produce either a hearing request (Form 12153), a payment, or a collection alternative proposal — before the window closes.",
    whatWeAnalyze: ["Notice number and date", "Exact 30-day CDP hearing deadline", "Balance owed", "CDP hearing eligibility", "Collection alternatives (installment, OIC, CNC)", "Levy risk assessment"],
    whatYouNeed: ["The CP504 notice", "IRS account transcript", "Prior IRS notices (CP14, CP501, CP503)", "Financial statement (Form 433-F)", "Documentation of hardship or dispute"],
    whatWeIdentify: ["Notice number and exact CDP deadline", "Whether the deadline has passed", "CDP hearing eligibility and grounds", "Collection alternative options", "Levy risk level"],
    whatAppealAddresses: ["Collection Due Process hearing request (Form 12153)", "Payment in full", "Installment agreement (Form 9465)", "Offer in Compromise (Form 656)", "Currently Not Collectible (Form 433-F)"],
    seoTitle: "Respond to IRS CP504 Levy Notice — CDP Hearing Request",
    seoDescription: "Upload your CP504 notice, compute the 30-day CDP hearing deadline, and prepare a response to stop the levy. Critical deadline.",
    primaryKeyword: "cp504 levy notice response",
    relatedKeywords: ["irs cp504 notice", "intent to levy notice", "cdp hearing request", "form 12153", "irs levy response", "collection due process"],
    route: "/appeal/irs-cp504-response",
    status: "IMPLEMENTED",
    engine: "IRS Notice Response Engine",
    executable: true,
    workflowRoute: "/workflows/irs-cp504-response",
    cta: "Start Response — Critical Deadline",
  },
  {
    slug: "irs-cp523-response",
    title: "Respond to CP523 Installment Agreement Default",
    category: "Tax & IRS",
    shortDescription: "Reinstate, renegotiate, or request a hearing — within 30 days of the installment agreement default notice.",
    longDescription: "The CP523 tells you that your IRS installment agreement has defaulted — usually because of a missed payment or new tax debt. You have 30 days to reinstate the agreement, request a new one, or request a hearing. This workflow parses the notice, identifies the default reason, assesses reinstatement eligibility, and helps you prepare a response with the right forms and financial documentation.",
    intendedUser: "Taxpayers who received a CP523 Notice of Default on their installment agreement and need to act within 30 days.",
    problemSolved: "If the installment agreement terminates, the full balance becomes immediately due and the IRS can levy. This workflow helps you understand why the agreement defaulted, whether reinstatement is possible, and what documentation you need to either reinstate, propose new terms, or request a CDP hearing.",
    whatWeAnalyze: ["Notice number and date", "30-day reinstatement deadline", "Default reason (missed payment, new debt, etc.)", "Defaulted amount and remaining balance", "Reinstatement eligibility", "Updated financial situation"],
    whatYouNeed: ["The CP523 notice", "Original installment agreement terms", "Payment history showing missed payments", "Current financial statement (Form 433-F)", "Documentation of changed circumstances"],
    whatWeIdentify: ["Notice number and exact reinstatement deadline", "Default reason and missed amount", "Reinstatement eligibility (generally allowed once)", "Proposed new terms if renegotiating", "CDP hearing eligibility if disputing the default"],
    whatAppealAddresses: ["Reinstatement of the agreement (bring current)", "New installment agreement (Form 9465)", "Offer in Compromise (Form 656)", "Currently Not Collectible (Form 433-F)", "CDP hearing if disputing the default (Form 12153)"],
    seoTitle: "Respond to IRS CP523 Installment Agreement Default",
    seoDescription: "Upload your CP523 notice, determine why your installment agreement defaulted, and build a response to reinstate or renegotiate within 30 days.",
    primaryKeyword: "cp523 installment agreement default response",
    relatedKeywords: ["irs cp523 notice", "installment agreement default", "cp523 response", "irs payment plan default", "form 9465", "irs installment agreement reinstatement"],
    route: "/appeal/irs-cp523-response",
    status: "IMPLEMENTED",
    engine: "IRS Notice Response Engine",
    executable: true,
    workflowRoute: "/workflows/irs-cp523-response",
    cta: "Start Response",
  },

];

/* ── Helper functions ── */

export function getWorkflowBySlug(slug: string): AppealWorkflowEntry | undefined {
  return APPEAL_CATALOG.find((w) => w.slug === slug);
}

export function getWorkflowsByCategory(category: AppealCategory): AppealWorkflowEntry[] {
  return APPEAL_CATALOG.filter((w) => w.category === category);
}

export function getImplementedWorkflows(): AppealWorkflowEntry[] {
  return APPEAL_CATALOG.filter((w) => w.status === "IMPLEMENTED");
}

export function getComingSoonWorkflows(): AppealWorkflowEntry[] {
  return APPEAL_CATALOG.filter((w) => w.status === "COMING_SOON");
}

export function searchWorkflows(query: string): AppealWorkflowEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return APPEAL_CATALOG;
  return APPEAL_CATALOG.filter(
    (w) =>
      w.title.toLowerCase().includes(q) ||
      w.shortDescription.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.primaryKeyword.toLowerCase().includes(q) ||
      w.relatedKeywords.some((k) => k.toLowerCase().includes(q)),
  );
}

export function getCatalogStats() {
  return {
    total: APPEAL_CATALOG.length,
    implemented: APPEAL_CATALOG.filter((w) => w.status === "IMPLEMENTED").length,
    comingSoon: APPEAL_CATALOG.filter((w) => w.status === "COMING_SOON").length,
    categories: CATEGORY_ORDER.length,
  };
}

/* ── Validation ── */

export const AppealWorkflowEntrySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  shortDescription: z.string().min(10),
  longDescription: z.string().min(20),
  intendedUser: z.string().min(5),
  problemSolved: z.string().min(10),
  whatWeAnalyze: z.array(z.string()).min(1),
  whatYouNeed: z.array(z.string()).min(1),
  whatWeIdentify: z.array(z.string()).min(1),
  whatAppealAddresses: z.array(z.string()).min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(10),
  primaryKeyword: z.string().min(1),
  relatedKeywords: z.array(z.string()).min(0),
  route: z.string().startsWith("/"),
  status: z.enum(["IMPLEMENTED", "COMING_SOON"]),
  engine: z.string().min(1),
  executable: z.boolean(),
  workflowRoute: z.string().startsWith("/"),
  cta: z.string().min(1),
});

export function validateCatalog(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  for (const entry of APPEAL_CATALOG) {
    const result = AppealWorkflowEntrySchema.safeParse(entry);
    if (!result.success) {
      errors.push(`Invalid entry "${entry.slug}": ${result.error.message}`);
    }
    if (seenSlugs.has(entry.slug)) {
      errors.push(`Duplicate slug: ${entry.slug}`);
    }
    seenSlugs.add(entry.slug);

    // COMING_SOON entries must not be executable
    if (entry.status === "COMING_SOON" && entry.executable) {
      errors.push(`Workflow "${entry.slug}" is COMING_SOON but marked executable`);
    }
    // IMPLEMENTED entries must be executable
    if (entry.status === "IMPLEMENTED" && !entry.executable) {
      errors.push(`Workflow "${entry.slug}" is IMPLEMENTED but not marked executable`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/* ═══════════════════════════════════════════════════════════
   CATEGORY SLUGS — for category parent pages
   ═══════════════════════════════════════════════════════════ */

export const CATEGORY_SLUGS: Record<AppealCategory, string> = {
  "Insurance": "insurance",
  "Disability & Social Security": "disability",
  "Unemployment": "unemployment",
  "Government Benefits": "benefits",
  "Workers' Compensation": "workers-comp",
  "Veterans": "veterans",
  "Administrative": "administrative",
  "Tax & IRS": "tax-irs",
};

export const SLUG_TO_CATEGORY: Record<string, AppealCategory> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([cat, slug]) => [slug, cat as AppealCategory])
);

export function getCategoryBySlug(slug: string): AppealCategory | undefined {
  return SLUG_TO_CATEGORY[slug];
}

export function getCategoryRoute(category: AppealCategory): string {
  return `/appeal/${CATEGORY_SLUGS[category]}`;
}
