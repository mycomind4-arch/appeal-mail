import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  FileText,
  FolderOpen,
  Mail,
  Package,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { AppShell, DeadlineCard, IssueCard, ProgressRail, StatusBadge } from "@/components/workspace/app-shell";
import type { WorkflowStep } from "@/domain/workflows";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/case/$caseId")({
  head: () => ({ meta: [
    { title: "Case Workspace — Appeal Mail" },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  component: CaseWorkspacePage,
});

type CaseRow = {
  id: string;
  workflowId: string;
  status: string;
  title: string;
  referenceNumber: string | null;
  decisionDate: string | null;
  documentId: string | null;
  pageCount: number;
  locked: boolean;
  updatedAt: string;
};

type WorkspaceTab = "overview" | "documents" | "analysis" | "response" | "packet" | "mail";

const steps: Array<{ step: WorkflowStep; label: string; icon: typeof FileText }> = [
  { step: "intro", label: "Overview", icon: FolderOpen },
  { step: "document", label: "Documents", icon: FileText },
  { step: "xray", label: "AI Analysis", icon: FileSearch },
  { step: "draft", label: "Response", icon: FileText },
  { step: "packet", label: "Packet", icon: Package },
  { step: "mailing", label: "Mail", icon: Send },
  { step: "proof", label: "Proof", icon: ShieldCheck },
];

async function getAccessToken() {
  const { getSupabaseClient } = await import("@/platform/supabase");
  const supabase = await getSupabaseClient();
  if (!supabase) throw new Error("Authentication is not configured.");
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error("Your session has expired. Please sign in again.");
  return data.session.access_token;
}

function CaseWorkspacePage() {
  const { user, loading: authLoading } = useAuth();
  const { caseId } = Route.useParams();
  const [caseData, setCaseData] = useState<CaseRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<WorkspaceTab>("overview");
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("intro");
  const [sourceFile, setSourceFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch("/api/dashboard/cases", { headers: { authorization: `Bearer ${token}` } });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || "Unable to load this case.");
        const match = (payload.cases || []).find((row: CaseRow) => row.id === caseId);
        if (!match) throw new Error("This case does not exist or does not belong to your account.");
        if (active) setCaseData(match);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load this case.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [caseId, user]);

  if (authLoading || loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><RefreshCw className="animate-spin text-stamp" size={22} /></div>;
  if (!user) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-center"><h1 className="heading-lg">Sign in required</h1><Link to="/auth" className="btn-amber mt-5">Sign in</Link></div></div>;
  if (error || !caseData) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="max-w-md text-center"><h1 className="heading-lg">Case unavailable</h1><p className="mt-3 text-sm text-muted-foreground">{error || "We could not load this case."}</p><Link to="/dashboard" className="btn-outline mt-5">Back to cases</Link></div></div>;

  const caseItem = caseData;
  const navItems = steps.map((item) => ({
    ...item,
    completed: item.step === "intro" ? true : false,
    attention: item.step === "document" && !caseItem.documentId,
  }));

  const navigate = (step: WorkflowStep) => {
    setCurrentStep(step);
    const target = step === "intro" ? "overview" : step === "document" ? "documents" : step === "xray" ? "analysis" : step === "draft" ? "response" : step === "packet" ? "packet" : step === "mailing" || step === "proof" ? "mail" : "overview";
    setTab(target);
  };

  return (
    <AppShell
      navItems={navItems}
      currentStep={currentStep}
      onNavigate={navigate}
      appealNumber={caseItem.referenceNumber || `CASE-${caseItem.id.slice(0, 8).toUpperCase()}`}
      appealTitle={caseItem.title}
      statusLabel={caseItem.status}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="section-label">{caseItem.workflowId}</div>
          <h1 className="heading-xl truncate">{caseItem.title}</h1>
        </div>
        <Link to="/dashboard" className="btn-outline hidden sm:inline-flex">All cases</Link>
      </div>
      <WorkspaceTabs active={tab} onChange={(next) => { setTab(next); setCurrentStep(tabToStep(next)); }} />
      {tab === "overview" && <Overview caseData={caseItem} onNavigate={navigate} />}
      {tab === "documents" && <Documents caseData={caseItem} sourceFile={sourceFile} onSourceFile={setSourceFile} />}
      {tab === "analysis" && <Analysis />}
      {tab === "response" && <ResponseDraft caseData={caseItem} />}
      {tab === "packet" && <PacketStage caseData={caseItem} sourceFile={sourceFile} />}
      {tab === "mail" && <MailStage caseData={caseItem} />}
    </AppShell>
  );
}

function tabToStep(tab: WorkspaceTab): WorkflowStep {
  return ({ overview: "intro", documents: "document", analysis: "xray", response: "draft", packet: "packet", mail: "mailing" })[tab];
}

function WorkspaceTabs({ active, onChange }: { active: WorkspaceTab; onChange: (tab: WorkspaceTab) => void }) {
  const tabs: Array<[WorkspaceTab, string]> = [["overview", "Overview"], ["documents", "Documents"], ["analysis", "AI Analysis"], ["response", "Response"], ["packet", "Packet"], ["mail", "Mail"]];
  return <div className="mb-6 flex gap-1 overflow-x-auto border-b border-warm-border">{tabs.map(([key, label]) => <button key={key} onClick={() => onChange(key)} className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium ${active === key ? "border-stamp text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div>;
}

function Overview({ caseData, onNavigate }: { caseData: CaseRow; onNavigate: (step: WorkflowStep) => void }) {
  return <div className="space-y-6">
    <ProgressRail steps={steps.map((item, index) => ({ label: item.label, step: item.step, status: index === 0 ? "current" : index < 2 ? "done" : "todo" }))} currentStep="intro" />
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-5">
        <div className="card p-6"><div className="flex items-start gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50"><Sparkles size={20} className="text-indigo-700" /></div><div><p className="section-label">Case workspace</p><h2 className="heading-lg mt-1">Let's build the strongest documented response.</h2><p className="mt-2 text-sm leading-6 text-slate-600">Appeal Mail keeps the source documents, extracted facts, AI analysis, response drafts, final packet, and mailing record together so nothing important gets lost between drafting and fulfillment.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><QuickAction label="Review documents" icon={FileText} onClick={() => onNavigate("document")} /><QuickAction label="Run AI analysis" icon={Bot} onClick={() => onNavigate("xray")} /><QuickAction label="Prepare packet" icon={Package} onClick={() => onNavigate("packet")} /></div></div>
        <div className="card p-6"><div className="flex items-center justify-between"><div><p className="section-label">Case facts</p><h3 className="heading-md mt-1">What we know</h3></div><StatusBadge status={caseData.locked ? "complete" : "in-progress"}>{caseData.locked ? "Packet locked" : caseData.status}</StatusBadge></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Fact label="Workflow" value={caseData.workflowId} /><Fact label="Reference" value={caseData.referenceNumber || "Not provided"} /><Fact label="Decision date" value={caseData.decisionDate || "Not provided"} /><Fact label="Packet pages" value={String(caseData.pageCount)} /></div></div>
      </div>
      <div className="space-y-5"><IssueCard title={caseData.documentId ? "Source document is on file" : "Source document still needed"} description={caseData.documentId ? "The case has a source document. Review it before drafting." : "Upload the decision or notice before relying on AI analysis."} actionLabel={caseData.documentId ? "Review documents" : "Upload document"} onAction={() => onNavigate("document")} />{caseData.locked ? <div className="card p-5"><div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-600" size={20} /><div><p className="font-semibold">Final packet locked</p><p className="text-xs text-muted-foreground mt-1">The approved artifact is immutable until rebuilt.</p></div></div></div> : <div className="card p-5"><p className="section-label">Next best action</p><p className="mt-2 font-serif text-xl text-indigo-700">Review the source and establish the facts.</p><button className="btn-amber mt-4" onClick={() => onNavigate("document")}>Continue <ChevronRight size={16} /></button></div>}</div>
    </div>
  </div>;
}

function Documents({ caseData, sourceFile, onSourceFile }: { caseData: CaseRow; sourceFile: File | null; onSourceFile: (file: File | null) => void }) {
  return <div className="space-y-5"><div className="card p-6"><div className="flex items-start justify-between gap-4"><div><p className="section-label">Document room</p><h2 className="heading-lg mt-1">Everything the appeal is built from.</h2><p className="mt-2 text-sm text-slate-600">Keep the original decision, supporting records, and the source file used by the AI pipeline together.</p></div><label className="btn-amber cursor-pointer"><Upload size={16} /> Upload<input type="file" accept="application/pdf,image/png,image/jpeg" className="sr-only" onChange={(event) => onSourceFile(event.target.files?.[0] || null)} /></label></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><DocumentCard title="Case source" meta={caseData.documentId ? "Stored in case" : "Not uploaded"} active={Boolean(caseData.documentId || sourceFile)} /><DocumentCard title="New workspace source" meta={sourceFile?.name || "Upload a PDF or image to preview it here"} active={Boolean(sourceFile)} /></div></div><div className="card p-6"><p className="section-label">Integrity rule</p><p className="mt-2 text-sm leading-6 text-slate-600">The AI can analyze source material, but it cannot silently change the source document. Final mailing is based on the user-approved locked packet, not on a regenerated webhook artifact.</p></div></div>;
}

function Analysis() {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  return <div className="space-y-5"><div className="card p-6"><div className="flex items-start justify-between gap-4"><div><p className="section-label">AI analyst</p><h2 className="heading-lg mt-1">Understand the record before writing.</h2><p className="mt-2 text-sm text-slate-600">This workspace separates analysis from drafting so extracted facts, evidence gaps, deadlines, and disputed points remain reviewable.</p></div><Bot className="text-indigo-700" size={26} /></div><button className="btn-amber mt-6" disabled={running} onClick={() => { setRunning(true); setTimeout(() => { setRunning(false); setRan(true); }, 900); }}>{running ? "Analyzing…" : ran ? "Run analysis again" : "Run AI analysis"}</button></div>{ran && <div className="grid gap-4 md:grid-cols-2"><AnalysisCard title="Facts extracted" value="Source facts are ready for review." /><AnalysisCard title="Evidence gaps" value="Review unsupported or missing records before drafting." /><AnalysisCard title="Deadline" value="Confirm the deadline against the original notice." /><AnalysisCard title="Issues" value="Potential grounds are separated from established facts." /></div>}<div className="card p-5"><div className="flex gap-3"><ShieldCheck className="mt-0.5 text-emerald-600" size={19} /><p className="text-sm text-slate-600">AI output is advisory. User-confirmed facts remain authoritative and are never silently overwritten by the model.</p></div></div></div>;
}

function ResponseDraft({ caseData }: { caseData: CaseRow }) {
  const [draft, setDraft] = useState("");
  return <div className="space-y-5"><div className="card p-6"><div className="flex items-start justify-between gap-4"><div><p className="section-label">Response writer</p><h2 className="heading-lg mt-1">Draft, edit, then validate.</h2><p className="mt-2 text-sm text-slate-600">Manual edits are visible and remain part of the case history. The next production step is to route revisions through the shared AI revision contract.</p></div><Sparkles className="text-indigo-700" size={25} /></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Draft response for ${caseData.title}…`} className="mt-6 min-h-[360px] w-full rounded-xl border border-warm-border bg-white p-5 text-sm leading-7 outline-none focus:border-indigo-500" /><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{draft.length} characters · unsaved workspace draft</span><div className="flex gap-2"><button className="btn-outline">Validate draft</button><button className="btn-amber" disabled={!draft.trim()}>Continue to packet <ChevronRight size={16} /></button></div></div></div></div>;
}

function PacketStage({ caseData, sourceFile }: { caseData: CaseRow; sourceFile: File | null }) {
  return <div className="space-y-5"><div className="card p-6"><div className="flex items-center gap-3"><Package className="text-indigo-700" size={24} /><div><p className="section-label">Final packet</p><h2 className="heading-lg mt-1">Assemble the artifact that will actually be mailed.</h2></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Fact label="Current pages" value={String(caseData.pageCount)} /><Fact label="Packet state" value={caseData.locked ? "Locked" : "Editable"} /><Fact label="Source preview" value={sourceFile ? sourceFile.name : "Upload in Documents"} /></div></div><div className="card p-6"><div className="flex items-center gap-3"><ShieldCheck className="text-emerald-600" size={20} /><p className="text-sm text-slate-600">The existing PDF.js packet editor remains the authoritative visual assembly surface. This case workspace is its surrounding application shell.</p></div><div className="mt-5 rounded-xl border border-dashed border-warm-border p-8 text-center"><Package className="mx-auto text-slate-400" size={28} /><p className="mt-3 text-sm font-medium">Open the packet editor from the workflow when a source document is available.</p><p className="mt-1 text-xs text-muted-foreground">The editor supports page-level ordering, rotation, removal, supporting files, and final locking.</p></div></div></div>;
}

function MailStage({ caseData }: { caseData: CaseRow }) {
  return <div className="space-y-5"><div className="card p-6"><div className="flex items-start justify-between gap-4"><div><p className="section-label">Mailing</p><h2 className="heading-lg mt-1">Review the exact artifact before fulfillment.</h2><p className="mt-2 text-sm text-slate-600">Payment should only unlock fulfillment of the stored, user-approved packet.</p></div><Mail className="text-indigo-700" size={25} /></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Fact label="Packet" value={caseData.locked ? "Locked and ready" : "Not locked"} /><Fact label="Pages" value={String(caseData.pageCount)} /></div><div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4"><ShieldCheck className="text-emerald-600" size={20} /><p className="text-sm text-emerald-800">Fulfillment uses the stored packet rather than rebuilding a different document after payment.</p></div><button className="btn-amber mt-6" disabled={!caseData.locked}>Review mailing details <ChevronRight size={16} /></button></div></div>;
}

function QuickAction({ label, icon: Icon, onClick }: { label: string; icon: typeof FileText; onClick: () => void }) {
  return <button onClick={onClick} className="group flex items-center gap-3 rounded-xl border border-warm-border bg-white p-4 text-left hover:border-indigo-300 hover:shadow-sm"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50"><Icon size={17} className="text-indigo-700" /></span><span className="flex-1 text-sm font-medium">{label}</span><ChevronRight size={15} className="text-slate-400 group-hover:text-indigo-700" /></button>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div><p className="section-label">{label}</p><p className="mt-1 text-sm font-medium text-slate-700 break-words">{value}</p></div>; }
function DocumentCard({ title, meta, active }: { title: string; meta: string; active: boolean }) { return <div className={`rounded-xl border p-4 ${active ? "border-emerald-200 bg-emerald-50/40" : "border-dashed border-warm-border"}`}><div className="flex items-center gap-3"><FileText size={18} className={active ? "text-emerald-600" : "text-slate-400"} /><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">{meta}</p></div></div></div>; }
function AnalysisCard({ title, value }: { title: string; value: string }) { return <div className="card p-5"><p className="section-label">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{value}</p></div>; }
