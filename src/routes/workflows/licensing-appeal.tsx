import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LicensingAppealPricing } from "@/components/workflow/licensing-appeal-pricing";

export const Route = createFileRoute("/workflows/licensing-appeal")({
  head: () => ({
    meta: [
      { title: "Appeal a Licensing Decision — Authority-First | Appeal Mail" },
      { name: "description", content: "Analyze a license suspension, revocation, denial, or disciplinary decision, verify the governing appeal path and deadline, identify evidence gaps, and prepare a human-reviewed response." },
      { property: "og:title", content: "Appeal a Licensing Decision" },
      { property: "og:description", content: "Authority-first licensing appeal analysis with source verification, evidence mapping, adversarial validation, and documented mailing proof." },
    ],
    links: [{ rel: "canonical", href: "/workflows/licensing-appeal" }],
  }),
  component: LicensingAppealPage,
});

function LicensingAppealPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);
  async function analyze() {
    if (!file) return;
    setStatus("Analyzing the licensing decision and separating document facts from authority-backed procedure…");
    const form = new FormData(); form.set("document", file);
    try {
      const response = await fetch("/api/workflows/licensing-appeal/analyze", { method: "POST", body: form });
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "Unable to analyze the licensing decision.");
      setResult(payload); setStatus("Analysis complete. Review verified and unresolved items before drafting.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Unable to analyze the licensing decision."); }
  }
  return <main className="mx-auto max-w-6xl px-6 py-12">
    <section className="rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Authority-first licensing appeal</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Appeal a Licensing Decision</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Analyze a license denial, suspension, revocation, disciplinary action, or other licensing decision without guessing the governing procedure. Appeal Mail separates the notice from verified authority, exposes evidence gaps and contradictions, and requires your approval before the final response is mailed.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{[["Authority raised","License-specific procedural conclusions are tied to official board, agency, court, statute, regulation, or rule sources."],["Deadline discipline","A notice date or effective date is never promoted to a filing deadline without source support."],["Proof-backed fulfillment","The approved final response becomes a deterministic PDF, is mailed through MailMyPDF, and retains provider status and tracking/proof."]].map(([title,copy])=><div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p></div>)}</div>
    </section>
    <section className="mt-8"><LicensingAppealPricing /></section>
    <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><h2 className="text-2xl font-semibold">The Gold pipeline</h2><ol className="mt-6 space-y-4 text-slate-700">{["Classify the licensing action and extract the issuing authority, license, findings, dates, instructions, and cited authority.","Verify the actual appeal path, filing destination, deadline, hearing/stay rules, and exhaustion requirements from authoritative sources—or surface them as unresolved.","Map evidence, contradictions, disputed facts, and timeline issues before drafting.","Draft from supported facts and authority, then independently validate the response and stress-test its weakest assumptions.","Require explicit human approval before payment and final-response mailing."].map((x,i)=><li key={x} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{i+1}</span><span>{x}</span></li>)}</ol></div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><h2 className="text-2xl font-semibold">Start with the licensing decision</h2><p className="mt-3 text-sm leading-6 text-slate-600">Upload the actual notice. Missing license, board, agency, or jurisdiction information is surfaced rather than guessed.</p><input className="mt-6 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm" type="file" accept="application/pdf,image/png,image/jpeg" onChange={(e)=>setFile(e.target.files?.[0]||null)}/><button className="mt-4 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-40" disabled={!file} onClick={analyze}>Analyze licensing decision</button>{status&&<p className="mt-4 text-sm text-slate-600">{status}</p>}{result&&<div className="mt-6 rounded-2xl bg-white p-5"><h3 className="font-semibold">Authority snapshot</h3><dl className="mt-3 space-y-2 text-sm"><div><dt className="inline font-medium">Board / agency: </dt><dd className="inline">{result.analysis?.issuer||"Not identified"}</dd></div><div><dt className="inline font-medium">License: </dt><dd className="inline">{result.analysis?.license||"Not identified"}</dd></div><div><dt className="inline font-medium">Decision type: </dt><dd className="inline">{result.analysis?.decisionType||"Not identified"}</dd></div><div><dt className="inline font-medium">Deadline status: </dt><dd className="inline">{result.analysis?.deadlineStatus||"unverified"}</dd></div></dl></div>}</div>
    </section>
    <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-7"><h2 className="text-2xl font-semibold">What we refuse to guess</h2><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{["Appeal deadline","Board or tribunal","Filing portal","Required form","Hearing right","Stay rule","Exhaustion","Judicial-review path"].map(item=><div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm font-medium">{item}</div>)}</div><p className="mt-6 text-sm leading-7 text-slate-600">Licensing procedures vary by profession, license type, agency, and jurisdiction. The governing notice and authoritative sources control; unsupported procedural items stay visible as unresolved.</p></section>
    <footer className="mt-10 flex flex-wrap gap-4 text-sm text-slate-600"><Link to="/workflows/administrative-decision" className="underline">Administrative decision workflow</Link><span>•</span><span>Appeal Mail is not a law firm and does not provide legal advice.</span></footer>
  </main>;
}
