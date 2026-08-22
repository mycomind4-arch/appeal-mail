export const AGENCY_DECISION_APPEAL_PRICING={preparationFee:29.99,includedResponsePages:3,responsePagePrice:0.4,supportingPagePrice:0.25,standardMail:5.49,certifiedMail:12.49,certifiedReturnReceipt:14.99,registeredMail:29.99,flatEnvelopeFee:2.5} as const;
export const AGENCY_DECISION_APPEAL_AUTHORITY_SOURCES=[
{title:"U.S. Administrative Procedure Act — federal agency procedure",url:"https://www.archives.gov/federal-register/codification/executive-order/"},
{title:"eCFR — current federal administrative regulations",url:"https://www.ecfr.gov/"},
{title:"U.S. Courts — Administrative Law",url:"https://www.uscourts.gov/about-federal-courts/types-cases/appeals"},
{title:"State agency authority directory",url:"https://www.usa.gov/state-government"},
] as const;
export const AGENCY_DECISION_APPEAL_CAPABILITIES=["classification","fact-extraction","authority","deadline-analysis","evidence","contradictions","timeline","strategy","drafting","validation","readiness","pricing","proof"] as const;
export const AGENCY_DECISION_APPEAL_GOLD={workflowId:"agency-decision-appeal",lifecycle:"authority",capabilities:[...AGENCY_DECISION_APPEAL_CAPABILITIES],authorityRules:["Never invent agency deadlines, recipients, forms, filing destinations, hearing rights, exhaustion requirements, or outcomes.","Identify the issuing agency and jurisdiction before applying procedural authority.","Separate agency findings, cited authority, disputed facts, and unresolved procedure.","Treat the decision notice and current authoritative sources as the controlling record."],authoritySources:[...AGENCY_DECISION_APPEAL_AUTHORITY_SOURCES],pricing:AGENCY_DECISION_APPEAL_PRICING} as const;
