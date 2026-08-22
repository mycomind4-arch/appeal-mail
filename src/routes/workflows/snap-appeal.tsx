import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SNAP_APPEAL_PRICING } from "@/domain/snap-appeal-gold";

export const Route = createFileRoute("/workflows/snap-appeal")({
  head: () => ({ meta: [
    { title: "Appeal a SNAP Decision — Authority-First | Appeal Mail" },
    { name: "description", content: "Analyze a SNAP adverse-action notice, distinguish federal rules from state procedure, map evidence gaps, and prepare a human-reviewed appeal with transparent pricing." },
    { property: "og:title", content: "Appeal a SNAP Decision" },
    { property: "og:description", content: "Authority-first SNAP appeal analysis with evidence mapping, deadline discipline, Gemini drafting, validation, and mailing proof." },
  ], links: [{ rel: "canonical", href: "/workflows/snap-appeal" }] }),
  component: SnapAppealPage,
});

function SnapAppealPage() {
  const [file,setFile]=useState<File|null>(null); const [status,setStatus]=useState(""); const [result,setResult]=useState<any>(null);
  async function analyze(){
    if(!file)return;
    setStatus("Analyzing the SNAP notice and separating verified procedure from unresolved state-specific questions…");
    const form=new FormData();form.set("document",file);
    try{const r=await fetch("/api/workflows/snap-appeal/analyze",{method:"POST",body:form});const p=await r.json();if(!r.ok)throw new Error(p.error||"Unable to analyze the notice.");setResult(p);setStatus("Analysis complete. Review authority, evidence gaps, contradictions, and price basis.");}
    catch(e){setStatus(e instanceof Error?e.message:"Unable to analyze the notice.");}
  }
  return <main className="mx-auto max-w-6xl px-6 py-12">
    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">SNAP • Authority-first appeal</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Appeal a SNAP Decision</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Understand an adverse SNAP decision, verify what the notice actually requires, separate federal rules from state procedure, identify missing evidence, and prepare a human-reviewed appeal before mailing.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{[["Authority raised","USDA/FNS rules and your notice are separated from state-agency procedures that must be independently verified."],["Evidence discipline","Income, household, resource, verification, and eligibility facts come from your records rather than invention."],["Transparent pricing","Preparation, response sheets, supporting sheets, mailing service, and packet surcharges are shown before payment."]].map(([a,c])=><div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{c}</p></div>)}</div>
    </section>
    <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-7"><h2 className="text-2xl font-semibold">What the workflow checks</h2><ol className="mt-6 space-y-4">{["Extract the notice date, agency, action, stated reason, benefit impact, appeal/hearing instructions, and cited authority.","Verify the apparent hearing path and timing from the notice and current authoritative sources.","Separate supported facts from disputed household, income, resource, verification, and eligibility assertions.","Map evidence gaps, contradictions, and the requested remedy without inventing eligibility facts.","Draft, independently validate, and require your approval before payment and mailing."].map((x,i)=><li key={x} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{i+1}</span><span className="leading-7 text-slate-700">{x}</span></li>)}</ol></div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><h2 className="text-2xl font-semibold">Start with your SNAP notice</h2><p className="mt-3 text-sm leading-6 text-slate-600">Starting price: <strong>${SNAP_APPEAL_PRICING.preparationFee.toFixed(2)}</strong> plus mailing, assuming {SNAP_APPEAL_PRICING.includedResponsePages} response pages and no supporting-document sheets. Exact pricing is calculated from the approved packet.</p><input className="mt-6 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm" type="file" accept="application/pdf,image/png,image/jpeg" onChange={e=>setFile(e.target.files?.[0]||null)}/><button className="mt-4 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-40" disabled={!file} onClick={analyze}>Analyze SNAP notice</button>{status&&<p className="mt-4 text-sm text-slate-600">{status}</p>}{result&&<div className="mt-6 rounded-2xl bg-white p-5"><h3 className="font-semibold">Decision snapshot</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="inline font-medium">Agency: </dt><dd className="inline">{result.analysis?.issuer||"Not identified"}</dd></div><div><dt className="inline font-medium">Decision date: </dt><dd className="inline">{result.analysis?.decisionDate||"Not identified"}</dd></div><div><dt className="inline font-medium">Deadline status: </dt><dd className="inline">{result.analysis?.deadlineStatus||"unverified"}</dd></div></dl></div>}</div>
    </section>
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-7"><h2 className="text-2xl font-semibold">Transparent pricing</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[["Preparation",`$${SNAP_APPEAL_PRICING.preparationFee.toFixed(2)}`],["Included response",`${SNAP_APPEAL_PRICING.includedResponsePages} pages`],["Extra response",`$${SNAP_APPEAL_PRICING.responsePagePrice.toFixed(2)}/sheet`],["Supporting evidence",`$${SNAP_APPEAL_PRICING.supportingPagePrice.toFixed(2)}/sheet`],["Standard mail",`$${SNAP_APPEAL_PRICING.standardMail.toFixed(2)}`],["Certified",`$${SNAP_APPEAL_PRICING.certifiedMail.toFixed(2)}`],["Certified + return receipt",`$${SNAP_APPEAL_PRICING.certifiedReturnReceipt.toFixed(2)}`],["Flat packet surcharge",`$${SNAP_APPEAL_PRICING.flatEnvelopeFee.toFixed(2)} when required`]].map(([a,b])=><div key={a} className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">{a}</div><div className="mt-1 font-semibold">{b}</div></div>)}</div><p className="mt-6 text-sm leading-7 text-slate-600">The final price is based on the approved physical packet. Supporting evidence is charged only when it increases the printed packet.</p></section>
    <p className="mt-10 text-sm text-slate-500">Appeal Mail is not a law firm and does not provide legal advice. SNAP procedure is verified against current authoritative sources and the notice before procedural conclusions are presented.</p>
  </main>;
}
