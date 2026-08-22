import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BENEFITS_DENIAL_APPEAL_PRICING } from "@/domain/benefits-denial-appeal-gold";

export const Route = createFileRoute("/workflows/benefits-denial-appeal")({
  head: () => ({ meta: [
    { title: "Appeal a Government Benefits Denial — Authority-First | Appeal Mail" },
    { name: "description", content: "Analyze a benefits denial, identify the issuing program and agency, verify the appeal path, map evidence gaps, and prepare a human-reviewed response with transparent packet pricing." },
    { property: "og:title", content: "Appeal a Government Benefits Denial" },
    { property: "og:description", content: "Authority-first benefits-denial analysis with source verification, evidence mapping, Gemini drafting, validation, and mailing proof." },
  ], links: [{ rel: "canonical", href: "/workflows/benefits-denial-appeal" }] }),
  component: BenefitsDenialAppealPage,
});

function BenefitsDenialAppealPage() {
  const [file,setFile]=useState<File|null>(null); const [status,setStatus]=useState(""); const [result,setResult]=useState<any>(null);
  async function analyze(){
    if(!file)return; setStatus("Identifying the benefit program and agency, then checking the denial against authoritative sources…");
    const form=new FormData(); form.set("document",file);
    try{const r=await fetch("/api/workflows/benefits-denial-appeal/analyze",{method:"POST",body:form});const p=await r.json();if(!r.ok)throw new Error(p.error||"Unable to analyze the denial.");setResult(p);setStatus("Analysis complete. Review authority status, evidence gaps, and unresolved procedure before drafting.");}
    catch(e){setStatus(e instanceof Error?e.message:"Unable to analyze the denial.");}
  }
  return <main className="mx-auto max-w-6xl px-6 py-12">
    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Government benefits • Authority-first</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Appeal a Government Benefits Denial</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Start with the actual denial. We identify the program and issuing agency, separate supported facts from uncertainty, verify the applicable appeal path, map evidence gaps, stress-test the response, and show the exact mailing price before you pay.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{[["Authority-first","The workflow does not invent deadlines, hearing rights, filing destinations, eligibility facts, or outcomes."],["Evidence-aware","The denial rationale, supporting records, contradictions, and missing proof are surfaced before drafting."],["Transparent pricing","Preparation, response pages, supporting sheets, mailing service, and packet surcharges are explicit."]].map(([a,c])=><div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{c}</p></div>)}</div>
    </section>
    <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-7"><h2 className="text-2xl font-semibold">What we analyze</h2><ol className="mt-6 space-y-4">{["Identify the benefit program, issuing agency, denial type, decision date, reasons, references, and instructions.","Verify the apparent appeal path and timing from the notice plus current authoritative sources.","Separate agency findings, disputed facts, cited authority, and unresolved questions.","Map supporting evidence, contradictions, and missing documentation without inventing eligibility facts.","Draft, independently validate, and require your explicit approval before payment and mailing."].map((x,i)=><li key={x} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{i+1}</span><span className="leading-7 text-slate-700">{x}</span></li>)}</ol></div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><h2 className="text-2xl font-semibold">Start with your denial</h2><p className="mt-3 text-sm leading-6 text-slate-600">Starting price: <strong>${BENEFITS_DENIAL_APPEAL_PRICING.preparationFee.toFixed(2)}</strong> plus mailing, assuming {BENEFITS_DENIAL_APPEAL_PRICING.includedResponsePages} response pages and no supporting-document sheets. Exact price is calculated from the approved packet.</p><input className="mt-6 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm" type="file" accept="application/pdf,image/png,image/jpeg" onChange={e=>setFile(e.target.files?.[0]||null)}/><button className="mt-4 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-40" disabled={!file} onClick={analyze}>Analyze denial</button>{status&&<p className="mt-4 text-sm text-slate-600">{status}</p>}{result&&<div className="mt-6 rounded-2xl bg-white p-5"><h3 className="font-semibold">Denial snapshot</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="inline font-medium">Program: </dt><dd className="inline">{result.analysis?.program||"Not identified"}</dd></div><div><dt className="inline font-medium">Agency: </dt><dd className="inline">{result.analysis?.issuer||"Not identified"}</dd></div><div><dt className="inline font-medium">Deadline status: </dt><dd className="inline">{result.analysis?.deadlineStatus||"unverified"}</dd></div></dl></div>}</div>
    </section>
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-7"><h2 className="text-2xl font-semibold">Transparent pricing</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[["Preparation",`$${BENEFITS_DENIAL_APPEAL_PRICING.preparationFee.toFixed(2)}`],["Included response",`${BENEFITS_DENIAL_APPEAL_PRICING.includedResponsePages} pages`],["Extra response",`$${BENEFITS_DENIAL_APPEAL_PRICING.responsePagePrice.toFixed(2)}/sheet`],["Supporting evidence",`$${BENEFITS_DENIAL_APPEAL_PRICING.supportingPagePrice.toFixed(2)}/sheet`],["Standard mail",`$${BENEFITS_DENIAL_APPEAL_PRICING.standardMail.toFixed(2)}`],["Certified",`$${BENEFITS_DENIAL_APPEAL_PRICING.certifiedMail.toFixed(2)}`],["Certified + return receipt",`$${BENEFITS_DENIAL_APPEAL_PRICING.certifiedReturnReceipt.toFixed(2)}`],["Flat packet surcharge",`$${BENEFITS_DENIAL_APPEAL_PRICING.flatEnvelopeFee.toFixed(2)} when required`]].map(([a,b])=><div key={a} className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">{a}</div><div className="mt-1 font-semibold">{b}</div></div>)}</div><p className="mt-6 text-sm leading-7 text-slate-600">The final price is based on the approved physical packet. Supporting evidence is never silently bundled into the preparation fee.</p></section>
    <p className="mt-10 text-sm text-slate-500">Appeal Mail is not a law firm and does not provide legal advice. Program and state-specific procedures are presented only when supported by current authoritative sources and the user's notice.</p>
  </main>;
}
