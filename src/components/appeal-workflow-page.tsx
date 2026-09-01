import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, ShieldCheck, Eye, Mail, PackageCheck, FileText, Search, Lightbulb, FolderOpen } from "lucide-react";
import { PRICES } from "@mailmypdf/pricing";
import type { ReactNode } from "react";
import type { AppealWorkflowEntry } from "@/domain/appeal-catalog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface AppealWorkflowPageProps {
  workflow: AppealWorkflowEntry;
  productName?: string;
  productHomePath?: string;
  relatedWorkflows?: { slug: string; title: string; shortDescription: string }[];
}

export function AppealWorkflowPage({ workflow, productName = "Appeal Mail", productHomePath = "/", relatedWorkflows = [] }: AppealWorkflowPageProps) {
  const isExecutable = workflow.executable === true;
  const workflowId = workflow.workflowRoute.replace(/^\/workflows\//, "");
  const faqItems = generateFAQ(workflow, productName);

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-rule/60">
          <div className="absolute inset-0 bg-gradient-to-b from-paper-deep/40 via-paper to-paper" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 md:py-28">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
              <Link to={productHomePath} className="hover:text-stamp transition-colors">{productName}</Link>
              <span className="text-rule">/</span>
              <Link to="/workflows" className="hover:text-stamp transition-colors">Workflows</Link>
              <span className="text-rule">/</span>
              <span className="text-ink-soft">{workflow.title}</span>
            </nav>
            <div className="postmark w-fit mt-6">{workflow.category}</div>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] sm:text-5xl md:text-6xl">{workflow.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">{workflow.shortDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isExecutable ? (
                <Link to="/workflows/$workflowId" params={{ workflowId }} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper shadow-card transition-transform hover:-translate-y-0.5">
                  {workflow.cta || "Start this workflow"}<ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-card px-6 py-3.5 text-sm font-medium text-muted-foreground">Coming soon</span>
              )}
              <Link to="/workflows" className="inline-flex items-center gap-2 rounded-full border border-rule bg-card px-6 py-3.5 text-sm font-medium transition-colors hover:border-ink/30">Browse other workflows</Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule/60 bg-rule/60 sm:grid-cols-4">
              <KeyFact label="Category" value={workflow.category} />
              <KeyFact label="Status" value={isExecutable ? "Available" : "Guide"} />
              <KeyFact label="Recommended mail" value="Certified" />
              <KeyFact label="Preparation from" value={`$${(PRICES.standard / 100).toFixed(2)}`} />
            </div>
          </div>
        </section>

        <section className="border-b border-rule/60"><div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"><div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Understanding the situation</div><h2 className="mt-3 font-serif text-3xl leading-tight">{workflow.problemSolved}</h2><div className="mt-6 space-y-4 text-base leading-7 text-ink-soft"><p>{workflow.longDescription}</p><p className="text-sm text-muted-foreground"><strong className="text-ink">Who this is for:</strong> {workflow.intendedUser}</p></div></div></section>
        <section className="border-b border-rule/60 bg-paper-deep/20"><div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16"><div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">The process</div><h2 className="mt-3 font-serif text-3xl leading-tight">How {productName} works</h2><div className="mt-8 grid gap-6 md:grid-cols-3"><ProcessStep number="01" title="Upload & analyze" text={`Upload your denial or decision letter. ${productName} extracts the key facts, deadlines, stated reasons, and policy or regulatory references — then identifies what needs your attention.`} /><ProcessStep number="02" title="Review & draft" text="See the extracted issues alongside your evidence. Add supporting documents. Generate a structured appeal that addresses each reason. Edit anything before approval." /><ProcessStep number="03" title="Mail with proof" text="Approve the exact draft. Choose Certified mail for proof of timely delivery. MailMyPDF prints, stamps, and ships — you keep the tracking number and delivery confirmation." /></div></div></section>
        <section className="border-b border-rule/60 bg-paper-deep/25"><div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16"><div className="grid gap-6 md:grid-cols-2"><InfoCard icon={<Search className="h-[18px] w-[18px]" />} title="What we analyze" items={workflow.whatWeAnalyze} /><InfoCard icon={<FolderOpen className="h-[18px] w-[18px]" />} title="What you'll need" items={workflow.whatYouNeed} /><InfoCard icon={<Lightbulb className="h-[18px] w-[18px]" />} title={`What ${productName} identifies`} items={workflow.whatWeIdentify} /><InfoCard icon={<FileText className="h-[18px] w-[18px]" />} title="What your appeal can address" items={workflow.whatAppealAddresses} /></div></div></section>
        <section className="border-y border-rule/60 bg-ink text-paper"><div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16"><div className="inline-flex items-center gap-1 border border-stamp/40 px-2.5 py-1 font-mono text-[0.68em] uppercase tracking-[0.15em] text-stamp rounded-full">Trust architecture</div><h2 className="mt-5 font-serif text-3xl text-paper">You stay in control of every step.</h2><p className="mt-4 text-base leading-7 text-paper/70">The decision letter is the source material. Your evidence remains under your control. AI assists — it does not decide. You review the appeal before approval. Approval applies to the exact draft. Mailing creates a documented record.</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><TrustItem title="Your data, your control" text="Documents are processed for analysis. Nothing is shared with third parties." /><TrustItem title="Review before send" text="You approve the exact document. Nothing is mailed without your explicit confirmation." /><TrustItem title="Proof of delivery" text="Certified mail provides tracking and delivery confirmation — your record of timely response." /></div></div></section>
        <section className="border-b border-rule/60"><div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"><div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pricing</div><h2 className="mt-3 font-serif text-3xl">Clear pricing. No subscriptions.</h2><div className="mt-8 grid gap-6 sm:grid-cols-2"><div className="rounded-lg border border-rule/60 bg-card p-6"><div className="font-mono text-xs uppercase tracking-widest text-stamp">Preparation</div><div className="mt-2 font-serif text-3xl text-ink">Included</div><p className="mt-2 text-sm text-muted-foreground">Analysis, issue identification, evidence organization, and appeal drafting.</p></div><div className="rounded-lg border border-rule/60 bg-card p-6"><div className="font-mono text-xs uppercase tracking-widest text-stamp">Mailing</div><div className="mt-2 space-y-2"><PriceRow label="Standard" price={`$${(PRICES.standard / 100).toFixed(2)}`} desc="3–7 business days" /><PriceRow label="Certified" price={`$${(PRICES.certified / 100).toFixed(2)}`} desc="Tracking + confirmation" /><PriceRow label="Registered" price={`$${(PRICES.registered / 100).toFixed(2)}`} desc="Secure handling" /></div></div></div><p className="mt-4 text-xs text-muted-foreground">Preparation and mailing are separate. You review and approve before anything is sent.</p></div></section>
        <section className="border-b border-rule/60"><div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"><div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Questions & answers</div><h2 className="mt-3 font-serif text-3xl">Frequently asked questions</h2><div className="mt-6 space-y-4">{faqItems.map((item, i) => <div key={i} className="rounded-lg border border-rule bg-card p-5"><h3 className="font-medium text-foreground">{item.question}</h3><p className="mt-2 text-sm text-muted-foreground leading-6">{item.answer}</p></div>)}</div></div></section>
        {relatedWorkflows.length > 0 && <section className="border-b border-rule/60"><div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Related workflows</div><h2 className="mt-3 font-serif text-2xl">Other appeal types</h2><div className="mt-6 grid gap-4 sm:grid-cols-3">{relatedWorkflows.slice(0, 3).map((rw) => <Link key={rw.slug} to="/appeal/$slug" params={{ slug: rw.slug }} className="block rounded-lg border border-rule/60 bg-card p-4 transition-colors hover:border-stamp/40"><div className="font-medium text-foreground">{rw.title}</div><div className="mt-1 text-xs text-muted-foreground">{rw.shortDescription}</div></Link>)}</div><div className="mt-6"><Link to="/workflows" className="text-sm text-stamp hover:text-ink transition-colors">Browse all workflows →</Link></div></div></section>}
        <section className="border-t border-rule/60 bg-paper-deep/30"><div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-20"><div className="postmark mx-auto w-fit">AI assistance. Human approval.</div><h2 className="mt-4 font-serif text-3xl sm:text-4xl">The system does the heavy lifting. You approve the result.</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{productName} can analyze the decision, organize evidence, surface gaps, and prepare a draft. You remain responsible for your facts and approve the exact correspondence before mailing.</p><div className="mt-6 flex flex-wrap justify-center gap-3">{isExecutable && <Link to="/workflows/$workflowId" params={{ workflowId }} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper shadow-card transition-transform hover:-translate-y-0.5"><Mail className="h-4 w-4" />{workflow.cta || "Start this workflow"}<ArrowRight className="h-4 w-4" /></Link>}<Link to="/workflows" className="inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm font-medium transition-colors hover:border-ink">Browse workflows</Link></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

function KeyFact({ label, value }: { label: string; value: string }) { return <div className="bg-paper p-3 text-center"><div className="font-serif text-lg text-ink">{value}</div><div className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">{label}</div></div>; }
function ProcessStep({ number, title, text }: { number: string; title: string; text: string }) { return <div><div className="font-mono text-xs font-semibold text-stamp">{number}</div><h3 className="mt-2 font-serif text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>; }
function InfoCard({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) { return <div className="rounded-xl border border-rule bg-card p-5"><div className="flex items-center gap-2 text-sm font-semibold"><span className="text-stamp">{icon}</span>{title}</div><ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>; }
function TrustItem({ title, text }: { title: string; text: string }) { return <div className="rounded-xl border border-paper/10 p-4"><div className="flex items-center gap-2 font-semibold text-paper"><ShieldCheck className="h-4 w-4 text-stamp" />{title}</div><p className="mt-2 text-sm leading-6 text-paper/65">{text}</p></div>; }
function PriceRow({ label, price, desc }: { label: string; price: string; desc: string }) { return <div className="flex items-center justify-between gap-3 border-b border-rule/40 py-2 last:border-b-0"><div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{desc}</div></div><div className="font-mono text-sm text-ink">{price}</div></div>; }

function generateFAQ(workflow: AppealWorkflowEntry, productName: string) {
  return [
    { question: "What does this workflow do?", answer: `${productName} analyzes the supplied ${workflow.category.toLowerCase()} decision materials, organizes the relevant facts and evidence, and helps prepare a structured response for your review.` },
    { question: "What documents should I provide?", answer: workflow.whatYouNeed.join("; ") },
    { question: "Can I change the draft?", answer: "Yes. You review and edit the draft before approval. Nothing is mailed until you explicitly approve it." },
    { question: "Do I have to mail it?", answer: "No. Mailing is optional. You can download the prepared response or choose MailMyPDF fulfillment." },
    { question: "Is this legal advice?", answer: "No. Appeal Mail is a document preparation and correspondence tool, not a law firm." },
  ];
}
