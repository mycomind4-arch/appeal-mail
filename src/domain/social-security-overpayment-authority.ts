export const SOCIAL_SECURITY_OVERPAYMENT_AUTHORITY_SOURCES = [
  { title:"SSA Form SSA-561 — Request for Reconsideration", url:"https://www.ssa.gov/forms/ssa-561.html", sourceType:"agency-form", freshnessRule:"verify-before-use" },
  { title:"SSA Form SSA-632 — Request for Waiver of Overpayment Recovery", url:"https://www.ssa.gov/forms/ssa-632.html", sourceType:"agency-form", freshnessRule:"verify-before-use" },
  { title:"SSA — Resolve an Overpayment", url:"https://www.ssa.gov/manage-benefits/resolve-overpayment", sourceType:"agency-guidance", freshnessRule:"verify-before-use" },
  { title:"SSA POMS GN 02201.025 — Title II Overpayment Reconsideration Request", url:"https://secure.ssa.gov/apps10/poms.nsf/lnx/0202201025", sourceType:"poms", freshnessRule:"verify-before-use" },
  { title:"SSA POMS SI 02220.017 — SSI Overpayment Reconsideration", url:"https://secure.ssa.gov/apps10/poms.nsf/links/0502220017", sourceType:"poms", freshnessRule:"verify-before-use" },
  { title:"SSA Overpayments Fact Sheet", url:"https://www.ssa.gov/marketing/assets/materials/EN-05-10106.pdf", sourceType:"agency-publication", freshnessRule:"verify-before-use" },
] as const;

export const SOCIAL_SECURITY_OVERPAYMENT_AUTHORITY_DISCLAIMER = "SSA procedures differ by program and request type. The notice and current SSA sources control; unverified procedural claims remain unresolved.";
