import { useMemo, useState } from "react";
import { Upload, Sparkles, CheckCircle2, Send, FileText, AlertTriangle, ArrowRight } from "lucide-react";
import { workflows, type WorkflowId } from "@/domain/workflows";

type Stage = "understand" | "build" | "send";

type AnalysisResult = {
  ok: boolean;
  workflowId: string;
  workflow: { title: string; primaryKeyword?: string };
  document?: { id?: string; filename?: string; sha256?: string; size_bytes?: number };
  analysis: {
    summary?: string; decision?: string; decisionType?: string; issuer?: string; referenceNumber?: string;
    decisionDate?: string; deadline?: string; reasons?: string[]; denialReasons?: string[]; keyFacts?: string[];
    issues?: Array<{ issue?: string; whyItMatters?: string; evidenceNeeded?: string[] }>;
    evidenceMentioned?: string[]; uncertainties?: string[]; confidence?: string;
  };
  provider: string; model: string;
};

export function AppealWorkflowWorkspace({ workflowId }: { workflowId: WorkflowId }) {
  const workflow = workflows[workflowId];
  const [stage, setStage] = useState<Stage>("understand");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [draft, setDraft] = useState("");
  const [validation, setValidation] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [building, setBuilding] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => ({ understand: 0, build: 50, send: 100 }[stage]), [stage]);

  async function analyze() {
    if (!file) return;
    setAnalyzing(true); setError(null);
    try {
      const form = new FormData(); form.append("document", file);
      const response = await fetch(`/api/workflows/${workflowId}/analyze`, { method: "POST", body: form, credentials: "include" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Analysis failed.");
      setAnalysis(payload as AnalysisResult); setStage("build");
    } catch (e) { setError(e instanceof Error ? e.message : "Analysis failed."); }
    finally { setAnalyzing(false); }
  }

  async function build() {
    if (!analysis) return;
    setBuilding(true); setError(null);
    try {
      const response = await fetch(`/api/workflows/${workflowId}/draft`, { method: "POST", headers: { "content-type": "application/json" }, credentials: "include", body: JSON.stringify({ analysis: analysis.analysis }) });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Drafting failed.");
      setDraft(payload.draft || "");
      setValidation(payload.validation || "");
      setStage("send");
    } catch (e) { setError(e instanceof Error ? e.message : "Drafting failed."); }
    finally { setBuilding(false); }
  }

  if (!workflow) return <main className="min-h-screen px-6 py-20"><div className="mx-auto max-w-2xl">Workflow not found.</div></main>;

  return (
    <main className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{workflow.title}</div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">Understand it. Build it. Send it.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{workflow.description} Upload the source document and let the system do the hard work while you stay in control.</p>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="mt-2 flex justify-between text-[11px] uppercase tracking-widest text-muted-foreground"><span className={stage === "understand" ? "text-foreground" : ""}>Understand</span><span className={stage === "build" ? "text-foreground" : ""}>Build</span><span className={stage === "send" ? "text-foreground" : ""}>Send</span></div>
        </header>

        {error && <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{error}</div>}

        {stage === "understand" && <section className="rounded-2xl border border-rule bg-paper-deep p-8"><div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rule bg-paper"><Upload size={24} /></div>
          <h2 className="mt-5 font-serif text-3xl">Start with the document</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">PDF, PNG, or JPG. We analyze the actual document—no retyping required.</p>
          <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background hover:opacity-90"><Upload size={16} /> Choose document<input type="file" accept="application/pdf,image/png,image/jpeg" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
          {file && <div className="mt-5 flex items-center justify-center gap-2 text-sm"><FileText size={16} /><span>{file.name}</span></div>}
          <button disabled={!file || analyzing} onClick={analyze} className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"><Sparkles size={16} />{analyzing ? "Analyzing your document…" : "Analyze my document"}</button>
        </div></section>}

        {stage === "build" && analysis && <section className="rounded-2xl border border-rule bg-paper-deep p-8">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper"><Sparkles size={18} /></div><div><h2 className="font-serif text-2xl">Here's what we found</h2><p className="text-sm text-muted-foreground">Gemini analyzed the source document for this specific workflow.</p></div></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-rule bg-paper p-5"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Decision</div><div className="mt-2 font-medium">{analysis.analysis.decision || "Needs review"}</div></div>
            <div className="rounded-xl border border-rule bg-paper p-5"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Deadline</div><div className="mt-2 font-medium">{analysis.analysis.deadline || "Needs confirmation"}</div></div>
            <div className="rounded-xl border border-rule bg-paper p-5"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Confidence</div><div className="mt-2 font-medium capitalize">{analysis.analysis.confidence || "Review required"}</div></div>
          </div>
          <div className="mt-6 rounded-xl border border-rule bg-paper p-6"><h3 className="font-serif text-xl">What matters</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-7">{analysis.analysis.summary || "No summary returned."}</p></div>
          {analysis.analysis.reasons?.length ? <div className="mt-6 rounded-xl border border-rule bg-paper p-6"><h3 className="font-serif text-xl">Reasons / issues</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{analysis.analysis.reasons.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
          {analysis.analysis.issues?.length ? <div className="mt-6 grid gap-3">{analysis.analysis.issues.map((issue, index) => <div key={`${issue.issue}-${index}`} className="rounded-xl border border-rule bg-paper p-5"><div className="font-medium">{issue.issue}</div><div className="mt-2 text-sm text-muted-foreground">{issue.whyItMatters}</div></div>)}</div> : null}
          <button disabled={building} onClick={build} className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background disabled:opacity-40"><Sparkles size={16} />{building ? "Building your response…" : "Build my response"}<ArrowRight size={16} /></button>
        </section>}

        {stage === "send" && <section className="rounded-2xl border border-rule bg-paper-deep p-8">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper"><CheckCircle2 size={18} /></div><div><h2 className="font-serif text-2xl">Your response is ready for review</h2><p className="text-sm text-muted-foreground">Review the AI-generated response before anything is mailed.</p></div></div>
          <div className="mt-8 rounded-xl border border-rule bg-paper p-6"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Draft response</div><textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="mt-4 min-h-[320px] w-full resize-y rounded-lg border border-rule bg-paper-deep p-4 text-sm leading-7 outline-none" /></div>
          <div className="mt-6 rounded-xl border border-rule bg-paper p-6"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Independent validation</div><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{validation || "No validation result returned."}</p></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm"><span className="mb-2 block font-medium">Recipient</span><input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full rounded-lg border border-rule bg-paper px-3 py-2" placeholder="Recipient name" /></label><label className="text-sm"><span className="mb-2 block font-medium">Address</span><input value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} className="w-full rounded-lg border border-rule bg-paper px-3 py-2" placeholder="Street, city, state, ZIP" /></label></div>
          <div className="mt-6 flex flex-wrap gap-3"><button onClick={() => setApproved((v) => !v)} disabled={!recipientName.trim() || !recipientAddress.trim()} className={`rounded-full border px-5 py-3 text-sm disabled:opacity-40 ${approved ? "bg-foreground text-background" : "border-foreground"}`}>{approved ? "Approved for review" : "Approve response"}</button><button disabled={!approved} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background disabled:opacity-40"><Send size={16} /> Continue to send</button></div>
          <p className="mt-4 text-xs text-muted-foreground">Mailing remains server-gated by the workflow readiness and fulfillment controls.</p>
        </section>}
      </div>
    </main>
  );
}
