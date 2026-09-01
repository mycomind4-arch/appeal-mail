import { useEffect, useState } from "react";
import { Bot, FileText, Loader2, Package, RefreshCw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { getSupabaseClient } from "@/platform/supabase";
import { loadAuthenticatedCase } from "@/platform/authenticated-case";
import { runCaseAnalysis, runCaseDraft, reviseCaseDraft } from "@/platform/case-ai";
import type { Appeal } from "@/domain/appeal";

export function SecureCaseWorkspace({ caseId }: { caseId: string }) {
  const { user, loading: authLoading } = useAuth();
  const [appeal, setAppeal] = useState<(Appeal & { version?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [tab, setTab] = useState<"overview"|"documents"|"analysis"|"response"|"packet"|"mail">("overview");
  const [busy, setBusy] = useState(false);
  const [userFacts, setUserFacts] = useState("");
  const [objective, setObjective] = useState("Request reversal of the decision and a full review of the supporting facts.");
  const [revision, setRevision] = useState("");

  async function token() {
    const supabase = await getSupabaseClient();
    if (!supabase) throw new Error("Authentication is not configured.");
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data.session?.access_token) throw new Error("Your session has expired. Please sign in again.");
    return data.session.access_token;
  }

  useEffect(() => {
    if (!user) return;
    setLoading(true); setError(null);
    token().then((accessToken) => loadAuthenticatedCase({ data: { caseId, accessToken } }))
      .then(setAppeal)
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load case."))
      .finally(() => setLoading(false));
  }, [caseId, user]);

  if (authLoading || loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><Loader2 className="animate-spin" size={22} /></div>;
  if (!user) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-center"><h1 className="heading-lg">Sign in required</h1><Link to="/auth" className="btn-amber mt-5 inline-flex">Sign in</Link></div></div>;
  if (error || !appeal) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="max-w-md text-center"><h1 className="heading-lg">Case unavailable</h1><p className="mt-3 text-sm text-muted-foreground">{error || "We could not load this case."}</p></div></div>;

  const documentText = sourceText || appeal.decision.rawText || appeal.decision.facts.map((f) => `${f.label}: ${f.value}`).join("\n");
  const run = async (action: () => Promise<{ appeal: Appeal }>, next: typeof tab = tab) => {
    setBusy(true); setError(null);
    try { setAppeal((await action()).appeal); setTab(next); }
    catch (e) { setError(e instanceof Error ? e.message : "Operation failed."); }
    finally { setBusy(false); }
  };

  return <div className="min-h-screen bg-cream"><header className="border-b border-warm-border bg-white/80 px-5 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between"><div><p className="section-label">Appeal Mail</p><h1 className="heading-lg">{appeal.decision.decisionTypeLabel || appeal.workflowId}</h1></div><Link to="/dashboard" className="btn-outline">All cases</Link></div></header><main className="mx-auto max-w-7xl px-5 py-6"><div className="mb-5 flex gap-1 overflow-x-auto border-b border-warm-border">{(["overview","documents","analysis","response","packet","mail"] as const).map((key) => <button key={key} onClick={() => setTab(key)} className={`border-b-2 px-3 py-2.5 text-sm font-medium ${tab===key?"border-stamp text-indigo-700":"border-transparent text-slate-500"}`}>{key === "analysis" ? "AI Analysis" : key[0].toUpperCase()+key.slice(1)}</button>)}</div>{error&&<div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
{tab==="overview"&&<section className="space-y-5"><div className="card p-6"><div className="flex items-start gap-4"><Sparkles className="text-indigo-700"/><div><p className="section-label">Case workspace</p><h2 className="heading-xl mt-1">Build the appeal from the record.</h2><p className="mt-2 text-sm text-slate-600">Documents, analysis, response, packet integrity, and mailing stay together in this owner-scoped case.</p></div></div></div><div className="grid gap-4 md:grid-cols-2"><Fact label="Agency" value={appeal.decision.agency||"Not identified"}/><Fact label="Reference" value={appeal.decision.referenceNumber||"Not provided"}/><Fact label="Deadline" value={appeal.decision.deadline?.date||"Not established"}/><Fact label="Status" value={appeal.status}/></div></section>}
{tab==="documents"&&<section className="card p-6"><div className="flex items-start gap-3"><FileText className="text-indigo-700"/><div><p className="section-label">Document room</p><h2 className="heading-lg">Source record</h2></div></div><textarea value={sourceText} onChange={(e)=>setSourceText(e.target.value)} placeholder="Paste extracted decision text while persistent file intake is being wired…" className="mt-5 min-h-[320px] w-full rounded-xl border border-warm-border bg-white p-4"/><p className="mt-2 text-xs text-muted-foreground">{documentText.length.toLocaleString()} characters available.</p></section>}
{tab==="analysis"&&<section className="card p-6"><Bot className="text-indigo-700"/><h2 className="heading-lg mt-2">AI analysis</h2><p className="mt-2 text-sm text-slate-600">Analysis runs server-side after the bearer token is verified.</p><button className="btn-amber mt-5" disabled={busy} onClick={()=>run(async()=>{const accessToken=await token(); return runCaseAnalysis({data:{caseId,accessToken,documentText}})},"analysis")}>{busy?<><Loader2 className="animate-spin" size={16}/> Working…</>:<><RefreshCw size={16}/> Run analysis</>}</button>{appeal.decision.facts.length>0&&<div className="mt-6 grid gap-3 md:grid-cols-2">{appeal.decision.facts.map(f=><div key={f.id} className="rounded-xl border border-warm-border bg-white p-4"><p className="section-label">{f.label}</p><p className="mt-1 text-sm">{f.value}</p><p className="mt-2 text-xs text-muted-foreground">{f.source} · {Math.round(f.confidence*100)}%</p></div>)}</div>}</section>}
{tab==="response"&&<section className="space-y-5"><div className="card p-6"><p className="section-label">Response writer</p><h2 className="heading-lg">Draft and revise</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Your facts<textarea value={userFacts} onChange={e=>setUserFacts(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-warm-border p-4"/></label><label className="text-sm font-medium">Objective<textarea value={objective} onChange={e=>setObjective(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-warm-border p-4"/></label></div><button className="btn-amber mt-4" disabled={busy} onClick={()=>run(async()=>{const accessToken=await token(); return runCaseDraft({data:{caseId,accessToken,userFacts,userObjective:objective}})},"response")}>{busy?<><Loader2 className="animate-spin" size={16}/> Writing…</>:"Generate response"}</button></div>{appeal.draft&&<div className="card p-6"><textarea readOnly value={appeal.draft} className="min-h-[420px] w-full rounded-xl border border-warm-border p-5 text-sm leading-7"/><label className="mt-5 block text-sm font-medium">Revision request<textarea value={revision} onChange={e=>setRevision(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-warm-border p-4"/></label><button className="btn-outline mt-3" disabled={busy||!revision.trim()} onClick={()=>run(async()=>{const accessToken=await token(); return reviseCaseDraft({data:{caseId,accessToken,draft:appeal.draft,instruction:revision}})},"response")}>Revise with AI</button></div>}</section>}
{tab==="packet"&&<section className="card p-6"><Package className="text-indigo-700"/><h2 className="heading-lg mt-2">Final packet</h2><p className="mt-2 text-sm text-slate-600">The existing production packet editor remains the authoritative assembly surface.</p><div className="mt-5 grid gap-3 md:grid-cols-3"><Fact label="Draft" value={appeal.draft.length>50?"Ready":"Not ready"}/><Fact label="Packet" value={appeal.packet?"Assembled":"Not assembled"}/><Fact label="Mail" value={appeal.proof?"Proof present":"Pending"}/></div></section>}
{tab==="mail"&&<section className="card p-6"><Send className="text-indigo-700"/><h2 className="heading-lg mt-2">Mail</h2><p className="mt-2 text-sm text-slate-600">Only the approved locked packet may proceed to payment and fulfillment.</p><div className="mt-5 flex gap-3"><ShieldCheck className="text-emerald-600"/><span className="text-sm">Stored-artifact fulfillment protection remains active.</span></div></section>}
</main></div>;
}
function Fact({label,value}:{label:string;value:string}){return <div className="rounded-xl border border-warm-border bg-white p-4"><p className="section-label">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>}
