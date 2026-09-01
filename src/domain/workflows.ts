import { z } from "zod";

export type WorkflowStep =
  | "intro" | "document" | "xray" | "decision" | "timeline" | "grounds"
  | "evidence" | "arguments" | "stress-test" | "draft" | "final-stress-test"
  | "readiness" | "packet" | "recipient" | "mailing" | "checkout" | "proof" | "submitted";
export type ExperienceStage = "understand" | "build" | "send";
export interface WorkflowFieldDef { key: string; label: string; placeholder?: string; type: "text" | "date" | "textarea" | "select"; options?: string[]; required?: boolean; }
export interface WorkflowDefinition {
  id: string; title: string; description: string; disclaimer: string; steps: WorkflowStep[]; stepLabels: string[];
  decisionFields: WorkflowFieldDef[]; focusAreas: string[]; deadlineWarning: string;
  experienceStages: readonly ExperienceStage[]; primaryKeyword?: string; primaryMsv?: number; primaryCpc?: number;
  keywordIntent?: "transactional" | "commercial" | "informational"; workflowPrompt: string; acceptsDocuments: boolean; category: string;
}
export type WorkflowId = string;

const COMMON_STEPS: WorkflowStep[] = ["intro","document","xray","decision","timeline","grounds","evidence","arguments","stress-test","draft","final-stress-test","readiness","packet","recipient","mailing","checkout","proof","submitted"];
const COMMON_LABELS = ["Start","Document","X-Ray","Decision","Timeline","Grounds","Evidence","Arguments","Stress Test","Draft","Final Test","Readiness","Packet","Recipient","Mailing","Checkout","Proof","Done"];
const BASE = {
  disclaimer: "Appeal Mail provides document preparation and mailing assistance. It is not a law firm and does not provide legal advice.",
  steps: COMMON_STEPS, stepLabels: COMMON_LABELS,
  decisionFields: [
    { key: "referenceNumber", label: "Reference / Case Number", type: "text" as const },
    { key: "agency", label: "Decision-maker / Company", type: "text" as const },
    { key: "decisionDate", label: "Decision Date", type: "date" as const },
    { key: "deadline", label: "Response / Appeal Deadline", type: "date" as const },
  ],
  focusAreas: [] as string[], deadlineWarning: "Check the source document carefully for the response or appeal deadline.",
  experienceStages: ["understand","build","send"] as const, acceptsDocuments: true, category: "Administrative",
};
function makeWorkflow(id: string,title: string,description: string,primaryKeyword: string|undefined,primaryMsv: number|undefined,primaryCpc: number|undefined,focusAreas: string[],workflowPrompt: string,category?: string): WorkflowDefinition {
  return {...BASE,id,title,description,primaryKeyword,primaryMsv,primaryCpc,focusAreas,keywordIntent:"transactional",workflowPrompt,category:category||BASE.category};
}

export const workflows: Record<string, WorkflowDefinition> = {
  "denied-claim": makeWorkflow(
    "denied-claim",
    "Appeal a Denied Claim",
    "Upload a denied claim and build a source-grounded response that identifies the denial, checks the stated reason against the available records, organizes supporting evidence, and produces a review-ready appeal package without inventing facts.",
    "appeal denied claim",
    480,
    8.50,
    ["Denial reason","Policy or claim reference","Decision date","Response deadline","Claim facts","Supporting records","Disputed facts","Evidence gaps","Requested outcome","Recipient / appeal instructions"],
    "Analyze the uploaded denied-claim notice and extract the issuer, claim or reference number, decision date, response deadline, exact stated denial reason, policy or coverage language cited, factual findings, procedural instructions, and requested next step. Separate source facts from user-supplied facts and unknowns. Identify possible factual or documentary gaps, contradictions, missing evidence, and unsupported assumptions. Do not invent policy terms, diagnoses, coverage, damages, eligibility, deadlines, or outcomes. Build a traceable issue-to-evidence map and a set of defensible response grounds tied to the available record. Where the document is a health-insurance denial, distinguish internal appeal, external review, and state-regulatory escalation as separate possible paths and treat the actual plan notice and governing rules as controlling. Draft only after the analysis is internally consistent, then validate dates, references, recipient instructions, requested relief, evidence references, and unsupported claims before human approval. Never represent draft creation or approval as mailing success; fulfillment remains review -> approval -> payment -> MailMyPDF -> tracking -> proof."
  ,"Insurance"
),
  "government-decision": makeWorkflow("government-decision","Appeal a Government Decision","Upload a government decision and prepare a documented administrative response.",undefined,undefined,undefined,["Agency identification","Deadline","Appeal instructions","Procedural requirements","Evidence"],"Analyze the government decision, agency instructions, deadlines, findings, procedural requirements, and evidence needed for an administrative appeal.","Administrative"),
  "court-ruling": makeWorkflow("court-ruling","Respond to a Court Ruling","Upload the ruling and prepare a review-ready response package.",undefined,undefined,undefined,["Court","Case number","Order or judgment date","Filing requirements","Deadline"],"Analyze the court ruling for dates, filing instructions, factual findings, procedural requirements, and source-supported response issues.","Administrative"),
  "reconsideration": makeWorkflow("reconsideration","Request Reconsideration","Upload the decision and build a focused reconsideration request before formal appeal.",undefined,undefined,undefined,["New information","Factual errors","Omitted evidence","Internal review process","Outcome"],"Analyze the original decision for new information, factual errors, omitted evidence, and the correct reconsideration path.","Disability & Social Security"),
  "insurance-claim-denial": makeWorkflow("insurance-claim-denial","Appeal an Insurance Claim Denial","Upload an insurance claim denial letter, identify coverage issues and policy violations, and build a documented appeal to your insurer.","denial of insurance claim",1300,47.028575,["Claim denial","Policy","Coverage","Evidence","Deadline"],"Analyze the insurance denial, policy/coverage references, factual disputes, evidence gaps, and appeal requirements.","Insurance"),
  "insurance-denial-letter": makeWorkflow("insurance-denial-letter","Respond to an Insurance Denial Letter","Upload the denial letter and turn it into a documented response.","insurance denial letter",210,38.850324,["Denial reasons","Instructions","Deadline","Supporting evidence"],"Analyze the insurance denial letter and identify exactly what the issuer says is missing or disqualifying.","Insurance"),
  "insurance-coverage-denial": makeWorkflow("insurance-coverage-denial","Appeal an Insurance Coverage Denial","Challenge a stated denial of insurance coverage with source-linked evidence.","denial of insurance coverage letter",210,38.850324,["Coverage rule","Reason for denial","Policy language","Evidence"],"Analyze the coverage denial and identify the stated coverage rule, supporting policy language, disputed facts, and evidence needed.","Insurance"),
  "medical-insurance-denial": makeWorkflow("medical-insurance-denial","Appeal a Medical Insurance Denial","Upload a medical insurance denial and prepare the response.","medical appeal letter",90,1.03374,["Medical reason","Coverage","Records","Medical documentation","Deadline"],"Analyze the medical insurance denial, stated medical/coverage reason, records referenced, and missing support.","Insurance"),
  "medical-necessity-appeal": makeWorkflow("medical-necessity-appeal","Appeal a Medical Necessity Denial","Build a source-supported appeal around a medical necessity denial.","medical necessity appeal letter",50,1.803314,["Medical necessity","Clinical support","Treatment","Documentation"],"Analyze the denial for medical-necessity criteria, supporting clinical evidence, stated deficiencies, and response needs.","Insurance"),
  "prior-authorization-denial": makeWorkflow("prior-authorization-denial","Appeal a Prior Authorization Denial","Upload the denial and prepare a focused prior-authorization appeal.","appeal prior authorization denial",40,0,["Authorization","Requested service","Denial reason","Clinical support"],"Analyze the prior-authorization denial and identify the requested service, denial rationale, criteria cited, and supporting evidence needed.","Insurance"),
  "out-of-network-denial": makeWorkflow("out-of-network-denial","Appeal an Out-of-Network Denial","Build a response to an out-of-network coverage or claim denial.","appeal letter to insurance company for out of network",10,0,["Network status","Plan terms","Service","Exception basis"],"Analyze the out-of-network denial and identify plan language, network facts, exceptions, and supporting records.","Insurance"),
  "dental-insurance-appeal": makeWorkflow("dental-insurance-appeal","Appeal a Dental Insurance Denial","Upload a dental denial and build the response.","dental insurance appeal letter",70,0,["Dental claim","Coverage","Procedure","Evidence"],"Analyze the dental insurance denial, procedure, coverage reason, and documentation gaps.","Insurance"),
  "car-insurance-appeal": makeWorkflow("car-insurance-appeal","Appeal a Car Insurance Claim","Upload the claim decision and prepare the response.","car insurance appeal letter",50,0,["Claim facts","Damage","Liability","Coverage","Records"],"Analyze the auto claim decision for disputed facts, damage, liability, coverage, and evidence.","Insurance"),
  "life-insurance-denial": makeWorkflow("life-insurance-denial","Appeal a Life Insurance Denial","Upload the denial and build a source-supported response.","life insurance denial appeal letter",10,0,["Policy","Denial reason","Coverage","Records"],"Analyze the life insurance denial and identify policy provisions, stated exclusions, dates, and supporting records.","Insurance"),
  "claim-denial-letter": makeWorkflow("claim-denial-letter","Respond to a Claim Denial Letter","Upload any claim denial letter and turn it into a documented response.","claim denial letter",70,132.34316,["Denial reason","Claim facts","Evidence","Response deadline"],"Analyze the claim denial letter and identify what is being denied, why, and what evidence or correction could respond to it.","Insurance"),
  "ssdi-denial": makeWorkflow("ssdi-denial","Appeal an SSDI Denial","Upload an SSDI denial and prepare the next response.","denied ssdi",390,18.462614,["SSA decision","Disability findings","Deadline","Medical evidence"],"Analyze the SSDI denial, stated findings, deadlines, evidence considered, and missing support. Do not invent medical facts.","Disability & Social Security"),
  "ssi-denial": makeWorkflow("ssi-denial","Appeal an SSI Denial","Upload an SSI denial and prepare a documented response.","ssi denial",210,11.614532,["SSA decision","Eligibility","Deadline","Evidence"],"Analyze the SSI denial for stated eligibility findings, deadlines, evidence, and response issues.","Disability & Social Security"),
  "social-security-denial": makeWorkflow("social-security-denial","Appeal a Social Security Denial","Upload a Social Security denial and build a response.","social security denial appeal",110,16.500946,["SSA decision","Findings","Deadline","Evidence"],"Analyze the Social Security denial and identify the decision basis, deadlines, findings, and relevant evidence.","Disability & Social Security"),
  "medicaid-denial": makeWorkflow("medicaid-denial","Appeal a Medicaid Denial","Upload the Medicaid denial and prepare the response.","appeal medicaid denial",210,12.434629,["Eligibility","Coverage","Agency","Deadline","Evidence"],"Analyze the Medicaid denial for eligibility/coverage findings, instructions, deadlines, and evidence gaps.","Government Benefits"),
  "unemployment-denial": makeWorkflow("unemployment-denial","Appeal an Unemployment Denial","Upload an unemployment decision and build the response.","unemployment insurance appeal",260,1.391115,["Eligibility","Employer facts","Decision reason","Deadline"],"Analyze the unemployment denial for stated reasons, facts, deadlines, and supporting records.","Unemployment"),
  "edd-denial": makeWorkflow("edd-denial","Appeal an EDD Denial","Upload the EDD decision and prepare a documented response.","appeal edd denial",10,36.123306,["EDD decision","Claim facts","Deadline","Evidence"],"Analyze the EDD decision and identify stated grounds, deadlines, disputed facts, and supporting evidence.","Unemployment"),
  "financial-aid-appeal": makeWorkflow("financial-aid-appeal","Appeal a Financial Aid Decision","Upload your financial aid decision and build a stronger appeal.","financial aid appeal letter",1000,10.869586,["Aid decision","Special circumstances","School policy","Evidence"],"Analyze the financial aid decision and identify the specific appeal basis, supporting facts, policy requirements, and evidence.","Administrative"),
  "sap-appeal": makeWorkflow("sap-appeal","Build a SAP Appeal","Upload your SAP decision and prepare a structured appeal.","sap appeal letter",210,0,["SAP decision","Academic progress","Extenuating circumstances","Plan"],"Analyze the SAP decision and identify the institution's stated requirements, factual circumstances, and evidence needed for an appeal.","Administrative"),
  "financial-aid-suspension-appeal": makeWorkflow("financial-aid-suspension-appeal","Appeal a Financial Aid Suspension","Upload the suspension notice and build the response.","financial aid suspension appeal letter sample",40,0,["Suspension reason","Academic record","Circumstances","Recovery plan"],"Analyze the financial aid suspension and identify the stated basis, supporting circumstances, and documentation needed.","Administrative"),
  "financial-aid-reinstatement": makeWorkflow("financial-aid-reinstatement","Request Financial Aid Reinstatement","Build a documented request to restore financial aid eligibility.","financial aid reinstatement letter example",10,0,["Eligibility","Prior decision","Recovery plan","Documentation"],"Analyze the prior financial-aid decision and construct a source-supported reinstatement case.","Administrative"),
  "financial-aid-special-circumstances": makeWorkflow("financial-aid-special-circumstances","Appeal for Financial Aid Special Circumstances","Document changed circumstances and build the appeal.","financial aid special circumstances letter sample",50,0,["Changed circumstances","Income","Family situation","Evidence"],"Analyze the financial-aid situation for documented special circumstances and required evidence.","Administrative"),
  "scholarship-appeal": makeWorkflow("scholarship-appeal","Appeal a Scholarship Decision","Upload the decision and prepare a focused scholarship appeal.","scholarship appeal letter",70,0,["Award decision","Eligibility","Accomplishments","Supporting evidence"],"Analyze the scholarship decision and identify factual, eligibility, or evidentiary grounds for appeal.","Administrative"),
  "fafsa-appeal": makeWorkflow("fafsa-appeal","Appeal a FAFSA/Financial Aid Decision","Upload the decision and prepare the appropriate appeal response.","fafsa appeal letter",110,0,["FAFSA decision","Dependency","Special circumstances","Evidence"],"Analyze the FAFSA/financial-aid decision and identify the specific appeal basis and evidence.","Administrative"),
  "license-suspension-appeal": makeWorkflow("license-suspension-appeal","Appeal a License Suspension","Upload the suspension notice and prepare the response.","license suspension appeal",140,27.394478,["License status","Suspension reason","Agency","Deadline"],"Analyze the license suspension notice, stated reasons, agency instructions, deadlines, and relevant records.","Administrative"),
  "drivers-license-suspension": makeWorkflow("drivers-license-suspension","Appeal a Driver's License Suspension","Upload your DMV suspension and prepare the response.","appeal driver's license suspension",20,32.52366,["DMV notice","Suspension reason","Hearing/appeal instructions","Deadline"],"Analyze the driver's license suspension notice for grounds, deadlines, hearing instructions, and supporting records.","Administrative"),
  "license-revocation-appeal": makeWorkflow("license-revocation-appeal","Appeal a License Revocation","Upload the revocation decision and build the response.","license revoked appeal",10,0,["Revocation reason","Agency","Deadline","Evidence"],"Analyze the license revocation decision and identify response grounds and procedural requirements.","Administrative"),

  // ── IRS Notice Workflows (Wave 2 — Document Intelligence Anchor) ──
  "irs-cp2000-response": makeWorkflow(
    "irs-cp2000-response",
    "Respond to IRS CP2000 Notice",
    "Upload your CP2000 Notice of Underreported Income, verify each income discrepancy against your tax documents, and build a source-grounded response that disputes or agrees with specific items — without inventing facts.",
    "cp2000 response letter",
    210,
    12.0,
    ["Notice number and date","Tax year","Income discrepancies","Reported vs. IRS amounts","Response deadline","Evidence documents","Disputed items","Agreed items","Corrected return need","IRS response address"],
    "Analyze the uploaded CP2000 notice and extract the notice number, tax year, notice date, response deadline, and each income discrepancy with reported amount, IRS amount, and the difference. Match each discrepancy against the taxpayer's actual income documents (W-2s, 1099s, K-1s, brokerage statements). Separate agreed items from disputed items. Do not invent income amounts, cost basis, or document references. Identify evidence gaps for disputed items. Build an item-by-item response that either agrees, disagrees with evidence, or requests further review for each discrepancy. Determine whether an amended return (1040X) is needed or whether a response letter is sufficient. Validate that all disputed items have evidence references, the notice number is correct, and the deadline has not passed before human approval."
  ,"Tax & IRS"
),
  "irs-cp14-response": makeWorkflow(
    "irs-cp14-response",
    "Respond to IRS CP14 Balance Due Notice",
    "Upload your CP14 Balance Due notice, verify the amount owed against your tax records, and build a response that either pays, disputes, or requests a payment plan — with documentation.",
    "cp14 irs notice response",
    170,
    9.0,
    ["Notice number and date","Tax period","Amount owed","Penalty breakdown","Interest calculation","Response deadline","Payment plan eligibility","Dispute evidence","IRS payment address"],
    "Analyze the uploaded CP14 notice and extract the notice number, tax period, amount owed, penalty amount, interest amount, and total balance. Verify the balance against the taxpayer's tax return and IRS account transcript. Identify whether the amount is correct, partially correct, or incorrect. If correct, determine payment options (full pay, installment agreement, offer in compromise). If incorrect, identify the specific error and supporting evidence. Do not fabricate amounts, dates, or account information. Build a response that clearly states the taxpayer's position with evidence references. For installment agreement requests, assess eligibility and compute proposed monthly payment. Validate that the notice number, tax period, and amount match the uploaded document before human approval."
  ,"Tax & IRS"
),
  "irs-cp504-response": makeWorkflow(
    "irs-cp504-response",
    "Respond to IRS CP504 Levy Notice",
    "Upload your CP504 Final Notice of Intent to Levy, assess levy risk, and build a response that either pays, requests a Collection Due Process hearing, or negotiates a payment plan — within the 30-day deadline.",
    "cp504 levy notice response",
    90,
    15.0,
    ["Notice number and date","Levy deadline (30 days)","Balance owed","CDP hearing eligibility","Collection Due Process rights","Financial statement (433-F)","Payment options","Levy risk assessment","IRS levy address"],
    "Analyze the uploaded CP504 notice and extract the notice number, notice date, 30-day deadline for CDP hearing, balance owed, and levy warning. Compute the exact CDP hearing deadline from the notice date. Assess whether a CDP hearing is appropriate (dispute of underlying tax, collection alternatives, hardship). If requesting a CDP hearing, prepare Form 12153 with required information. If paying, verify the balance and payment method. If requesting collection alternative, assess installment agreement or offer in compromise eligibility. Do not fabricate deadlines, amounts, or hearing rights. This is a CRITICAL deadline — missing it forfeits CDP hearing rights permanently. Validate that the 30-day deadline has not passed, the notice number is correct, and the requested action is available for CP504 before human approval."
  ,"Tax & IRS"
),
  "irs-cp523-response": makeWorkflow(
    "irs-cp523-response",
    "Respond to IRS CP523 Installment Agreement Default",
    "Upload your CP523 Notice of Default on your installment agreement, determine why the agreement defaulted, and build a response to reinstate, renegotiate, or request a hearing — within the 30-day window.",
    "cp523 installment agreement default response",
    70,
    10.0,
    ["Notice number and date","Default reason","Defaulted amount","Remaining balance","Reinstatement deadline (30 days)","Original agreement terms","Missed payments","Financial statement (433-F)","Reinstatement eligibility","IRS response address"],
    "Analyze the uploaded CP523 notice and extract the notice number, notice date, 30-day reinstatement deadline, defaulted amount, remaining balance, and default reason. Identify whether the default was due to missed payments, new tax debt, or other causes. Assess reinstatement eligibility (generally allowed once). If requesting reinstatement, determine the missed payment amount and bring-current strategy. If requesting a new agreement, assess updated financial situation and proposed terms. If disputing the default, identify the specific error. Do not fabricate payment history, agreement terms, or financial information. Build a response that clearly states the taxpayer's position and requested action with evidence references. Validate that the 30-day deadline has not passed, the notice number matches, and the requested action is available for CP523 before human approval."
  ,"Tax & IRS"
),
    "dmv-suspension-appeal": makeWorkflow("dmv-suspension-appeal","Appeal a DMV Suspension","Upload the DMV notice and prepare the response.","dmv license suspension appeal",20,0.94125,["DMV decision","Suspension basis","Deadline","Records"],"Analyze the DMV suspension and identify the stated basis, response path, deadlines, and records.","Administrative"),
  "registration-suspension-appeal": makeWorkflow("registration-suspension-appeal","Appeal a Registration Suspension","Upload the registration suspension notice and build the response.","penndot registration suspension appeal",10,0,["Registration","Agency notice","Reason","Deadline"],"Analyze the registration suspension notice and identify the agency decision, reason, and response requirements.","Administrative"),
};

export const workflowIds = Object.keys(workflows) as WorkflowId[];
export function getWorkflow(id: WorkflowId): WorkflowDefinition { const workflow = workflows[id]; if (!workflow) throw new Error(`Unknown workflow: ${id}`); return workflow; }
export function isWorkflowId(value: string): value is WorkflowId { return Boolean(workflows[value]); }
export const workflowCatalogVersion = "2026-08-20-appeal-mail-v2";
export const appealWorkflowCount = workflowIds.length;
export const workflowExperienceStandard = { stages: ["understand","build","send"] as const, upload: ["application/pdf","image/png","image/jpeg"], ai: "Gemini", review: "human", fulfillment: "MailMyPDF" };
