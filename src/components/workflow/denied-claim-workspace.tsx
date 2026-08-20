import { useMemo, useState } from "react";
import { Upload, Sparkles, CheckCircle2, Send, FileText, AlertTriangle } from "lucide-react";

type Stage = "understand" | "build" | "send";

export function DeniedClaimWorkspace() {
  const [stage, setStage] = useState<Stage>("understand");
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => ({ understand: 0, build: 50, send: 100 }[stage]), [stage]);

  async function analyze() {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("document", file);
      body.append("workflowId", "denied-claim");
      const response = await fetch("/api/workflows/denied-claim/analyze", {
        method: "POST",
        body,
        credentials: "include",
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "Analysis failed.");
      setAnalysisReady(true);
      setStage("build");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  }

  function build() {
    setDraftReady(true);
    setStage("send");
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Denied claim</div>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">Understand your denial. Build your response. Send it.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">Upload the denial and supporting documents. The workspace handles the analysis, evidence review, response drafting, and final mailing steps for you.</p>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="mt-2 flex justify-between text-[11px] uppercase tracking-widest text-muted-foreground"><span className={stage === "understand" ? "text-foreground" : ""}>Understand</span><span className={stage === "build" ? "text-foreground" : ""}>Build</span><span className={stage === "send" ? "text-foreground" : ""}>Send</span></div>
        </header>

        {stage === "understand" && (
          <section className="rounded-2xl border border-rule bg-paper-deep p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rule bg-paper"><Upload size={24} /></div>
              <h2 className="mt-5 font-serif text-3xl">Start with your denial</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">PDF, PNG, JPG, or DOCX. We analyze the actual document instead of asking you to retype it.</p>
              <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background hover:opacity-90">
                <Upload size={16} />
                Choose document
                <input type="file" accept="application/pdf,image/png,image/jpeg,.doc,.docx" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
              {file && <div className="mt-5 flex items-center justify-center gap-2 text-sm"><FileText size={16} /><span>{file.name}</span></div>}
              {error && <div className="mx-auto mt-5 flex max-w-xl items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-left text-sm text-red-800"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{error}</div>}
              <button disabled={!file || analyzing} onClick={analyze} className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40">
                <Sparkles size={16} />{analyzing ? "Analyzing your documents…" : "Analyze my denial"}
              </button>
            </div>
          </section>
        )}

        {stage === "build" && (
          <section className="rounded-2xl border border-rule bg-paper-deep p-8">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper"><Sparkles size={18} /></div><div><h2 className="font-serif text-2xl">Here's what we found</h2><p className="text-sm text-muted-foreground">The analysis is complete and ready for your review.</p></div></div>
            <div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-xl border border-rule bg-paper p-5"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Decision</div><div className="mt-2 font-medium">Claim denied</div></div><div className="rounded-xl border border-rule bg-paper p-5"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Deadline</div><div className="mt-2 font-medium">Needs confirmation</div></div><div className="rounded-xl border border-rule bg-paper p-5"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Evidence</div><div className="mt-2 font-medium">Review recommended</div></div></div>
            <div className="mt-8 rounded-xl border border-rule bg-paper p-6"><h3 className="font-serif text-xl">What we'll build</h3><div className="mt-4 space-y-3 text-sm"><div className="flex items-center gap-2"><CheckCircle2 size={16} /> Key facts and dates</div><div className="flex items-center gap-2"><CheckCircle2 size={16} /> Grounds for appeal</div><div className="flex items-center gap-2"><CheckCircle2 size={16} /> Supporting evidence map</div><div className="flex items-center gap-2"><CheckCircle2 size={16} /> Draft response with source references</div></div></div>
            <button onClick={build} className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background"><Sparkles size={16} /> Build my appeal</button>
          </section>
        )}

        {stage === "send" && (
          <section className="rounded-2xl border border-rule bg-paper-deep p-8">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper"><CheckCircle2 size={18} /></div><div><h2 className="font-serif text-2xl">Your appeal is ready for review</h2><p className="text-sm text-muted-foreground">Review the draft before anything is mailed.</p></div></div>
            <div className="mt-8 rounded-xl border border-rule bg-paper p-6"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Draft response</div><p className="mt-3 text-sm leading-7">Your appeal draft will appear here after the multi-model analysis and validation passes complete.</p></div>
            <div className="mt-6 flex flex-wrap gap-3"><button onClick={() => setApproved((v) => !v)} className={`rounded-full border px-5 py-3 text-sm ${approved ? "bg-foreground text-background" : "border-foreground"}`}>{approved ? "Approved" : "Approve this response"}</button><button disabled={!approved || !draftReady} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background disabled:opacity-40"><Send size={16} /> Send with MailMyPDF</button></div>
          </section>
        )}
      </div>
    </main>
  );
}
