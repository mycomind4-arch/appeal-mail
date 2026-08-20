import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Scale, Mail, ShieldCheck, Sparkles, Clock, PackageCheck, Lock, FileUp, ChevronDown, Send, Eye, Stamp, Gavel, FileText, TrendingUp, Quote, ShieldAlert, CalendarClock, FileSearch, Search } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { APPEAL_CATALOG, CATEGORY_ORDER, CATEGORY_DESCRIPTIONS, getCatalogStats, getWorkflowsByCategory, type AppealCategory } from "@/domain/appeal-catalog";

export const Route = createFileRoute("/")({ component: HomePage });

const features = [
  { icon: Eye, title: "Appeal X-Ray™ analysis", desc: "Upload your decision and supporting documents. We cross-reference everything to find date conflicts, unaddressed evidence, unsupported conclusions, and contradictions — each finding source-linked and explicitly uncertainty-aware.", featured: true },
  { icon: CalendarClock, title: "Appeal Timeline™", desc: "We reconstruct the entire case history automatically from your documents. Every event gets an integrity status — documented, inferred, conflicting, or unknown — with evidence linked to each one. Timeline conflicts become appeal grounds with one click.", featured: true },
  { icon: ShieldAlert, title: "Appeal Stress Test™", desc: "We attack every ground from the decision-maker's perspective, score each argument 0-100, and find your weakest link. Before mailing, we scan your draft for exaggerated claims and suggest precise revisions.", featured: true },
  { icon: Sparkles, title: "AI-assisted drafting", desc: "Approved findings automatically become appeal grounds with linked evidence. The draft is built from your analysis, not a blank page. Everything is editable." },
  { icon: Scale, title: "Guided appeal workflows", desc: "Each workflow is specialized for your decision type — insurance, disability, unemployment, benefits, workers' comp, VA, and more." },
  { icon: Send, title: "Physical mail with tracking", desc: "Your appeal is printed, enveloped, and mailed via USPS. Track delivery and keep proof of timely submission." },
  { icon: ShieldCheck, title: "Proof of timely filing", desc: "Certified mail options include signature tracking and return receipt — your record that the appeal was received on time. SHA-256 proof certificates." },
  { icon: Lock, title: "Secure & private", desc: "Your documents are encrypted, never shared, and never used for marketing or AI training. Delete your data anytime." },
];

const steps = [
  { n: "01", title: "Upload Decision", desc: "Upload the decision letter and every supporting document you have — receipts, correspondence, reports." },
  { n: "02", title: "Understand What Happened", desc: "The Appeal X-Ray™ cross-references your documents to find date conflicts, unaddressed evidence, and contradictions — each finding source-linked and uncertainty-aware." },
  { n: "03", title: "Identify Problems", desc: "Pinpoint factual errors, procedural mistakes, missing evidence, and contradictions in the decision." },
  { n: "04", title: "Organize Evidence", desc: "Connect documents and facts to each issue. Every piece of evidence is linked to the ground it supports." },
  { n: "05", title: "Build Appeal", desc: "Approved findings and timeline conflicts automatically become appeal grounds with linked evidence. Review and edit every word." },
  { n: "06", title: "Review", desc: "We attack every ground from the decision-maker's perspective, score each argument 0-100, and find your weakest link — then show you exactly how to fix it." },
  { n: "07", title: "Send", desc: "Before mailing, we scan your draft for exaggerated claims and unsupported assertions. Then choose your mailing — certified with return receipt is recommended." },
  { n: "08", title: "Track / Prove", desc: "Track delivery and keep a permanent, tamper-evident record of your timely filing." },
];

const stats = [
  { value: "3–5", label: "Business day delivery" },
  { value: "$4.99", label: "Starting price per mailing" },
  { value: "100%", label: "You control the facts" },
  { value: "0", label: "Printers needed" },
];

const trustItems = [
  { icon: Sparkles, title: "AI-assisted analysis", desc: "Cross-document analysis identifies issues you might miss." },
  { icon: FileSearch, title: "Evidence-supported drafting", desc: "Every claim in your appeal links back to a source document." },
  { icon: Eye, title: "Source-aware reasoning", desc: "Findings cite the exact document and passage they come from." },
  { icon: ShieldCheck, title: "User review before sending", desc: "Nothing is mailed until you review and approve it." },
  { icon: Lock, title: "No fabricated facts", desc: "The AI never invents facts, legal conclusions, or evidence." },
  { icon: Mail, title: "No automatic mailing", desc: "Physical mail is never sent without your explicit authorization." },
];

const faqItems = [
  { q: "Is this legal advice?", a: "No. Appeal Mail is a correspondence tool, not a law firm. We help you prepare and send appeal documents — we do not provide legal advice, and AI never invents facts or legal conclusions." },
  { q: "What types of decisions can I appeal?", a: "Insurance claim denials, health insurance decisions, SSI and SSDI denials, unemployment determinations, Medicaid and SNAP denials, workers' compensation denials, VA claim denials, and administrative or licensing decisions. Browse the full directory on the Workflows page." },
  { q: "Which appeal workflows are available now?", a: "The Insurance Appeal workflow is available now. Other appeal types — SSI, SSDI, unemployment, Medicaid, SNAP, workers' comp, VA, and more — are on the roadmap and clearly marked as Coming Soon." },
  { q: "How does the mailing work?", a: "Your final document is printed, placed in an envelope, and mailed via USPS. You can choose first-class, certified, or certified with return receipt for proof of delivery." },
  { q: "Is my data secure?", a: "All documents are stored with encryption, never shared with third parties, and never used for marketing. You can request full deletion at any time." },
  { q: "What does it cost?", a: "Costs start at $4.99 per mailing, including printing, paper, envelope, and postage. Certified starts at $14.94. No subscription required." },
];

function HomePage() {
  const stats_catalog = getCatalogStats();

  return (
    <main>
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule">
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="postmark mb-6">Don't let the deadline pass</span>
            <h1 className="mt-6 text-4xl leading-tight text-ink md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
              Build your appeal.<br />
              Back it with evidence.<br />
              <span className="text-stamp">Send it with proof.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Appeal Mail helps you analyze an adverse decision, organize the record, identify potential issues, build a supported appeal, and send it with a permanent mailing record.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/workflows/denied-claim" className="btn-amber text-base">Start an Appeal <ArrowRight size={18} /></Link>
              <Link to="/workflows" className="btn-outline text-base">Explore Appeal Types</Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Not a law firm. Not legal advice. You remain in control of the facts and final document.</p>
          </div>
        </div>

        {/* Visual flow */}
        <div className="border-t border-rule bg-paper-deep">
          <div className="container py-6">
            <div className="flex items-center gap-3 overflow-x-auto">
              {[
                { label: "Upload", icon: FileUp },
                { label: "Understand", icon: Eye },
                { label: "Analyze", icon: Scale },
                { label: "Evidence", icon: FileSearch },
                { label: "Build", icon: Gavel },
                { label: "Review", icon: ShieldAlert },
                { label: "Send", icon: Send },
                { label: "Prove", icon: ShieldCheck },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2 rounded-md border border-rule bg-card px-3 py-2">
                    <item.icon size={16} className="text-stamp" />
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  {i < 7 && <ArrowRight size={14} className="text-rule" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-rule bg-card">
        <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow catalog preview */}
      <section id="workflows" className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">What you can appeal</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Find your appeal type.</h2>
            <p className="mt-4 text-muted-foreground">From insurance denials to disability benefits to workers' comp — each workflow is built around a specific appeal situation.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_ORDER.map((cat: AppealCategory) => {
              const workflows = getWorkflowsByCategory(cat);
              return (
                <Link
                  key={cat}
                  to="/workflows"
                  className="card envelope-card-hover group p-6"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg text-ink" style={{ fontFamily: "var(--font-serif)" }}>{cat}</h3>
                    <span className="font-mono text-xs text-muted-foreground">{workflows.length}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{CATEGORY_DESCRIPTIONS[cat]}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {workflows.slice(0, 3).map((w) => (
                      <span key={w.slug} className="rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs text-muted-foreground">
                        {w.title}
                      </span>
                    ))}
                    {workflows.length > 3 && (
                      <span className="rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs text-muted-foreground">
                        +{workflows.length - 3} more
                      </span>
                    )}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-stamp">
                    Browse {cat.toLowerCase()} appeals
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/workflows" className="btn-outline">View all {stats_catalog.total} appeal workflows <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Trust / Safety */}
      <section className="border-y border-rule bg-paper-deep/30">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Trust & safety</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>You stay in control.</h2>
            <p className="mt-4 text-muted-foreground">Appeal Mail assists with analysis and drafting. You make the decisions.</p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((t) => (
              <div key={t.title} className="rounded-xl border border-rule bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "color-mix(in oklab, var(--stamp) 8%, transparent)" }}>
                  <t.icon size={20} className="text-stamp" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-rule bg-card">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">How it works</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Tools that do the hard part for you.</h2>
            <p className="mt-4 text-muted-foreground">Analysis, timeline, stress testing, and drafting — built specifically for appeals, not a generic chat.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className={`card p-6 ${f.featured ? "ring-1 ring-stamp/30" : ""}`}>
                {f.featured && <span className="postmark mb-4">Signature</span>}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklab, var(--stamp) 8%, transparent)" }}>
                  <f.icon size={24} className="text-stamp" />
                </div>
                <h3 className="mt-5 text-lg text-ink" style={{ fontFamily: "var(--font-serif)" }}>{f.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="how" className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Step by step</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>From decision to proof of filing.</h2>
            <p className="mt-4 text-muted-foreground">A guided workflow that moves you from the decision letter to a mailed, tracked appeal — no printer needed.</p>
          </div>
          <div className="mx-auto mt-14 max-w-3xl space-y-6">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-rule bg-card text-sm font-semibold text-stamp" style={{ fontFamily: "var(--font-mono)" }}>
                    {s.n}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl text-ink" style={{ fontFamily: "var(--font-serif)" }}>{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-rule bg-card py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Questions</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Before you start.</h2>
          </div>
          <div className="mx-auto mt-12 max-w-2xl space-y-3">
            {faqItems.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/faq" className="btn-outline">See all questions <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "color-mix(in oklab, var(--stamp) 10%, transparent)" }}>
              <Scale size={32} className="text-stamp" />
            </div>
            <h2 className="text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Start your appeal today.</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Start a guided workflow, review your draft, and mail it — all in one place.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/workflows/denied-claim" className="btn-amber text-base">Start now <ArrowRight size={18} /></Link>
              <Link to="/workflows" className="btn-outline text-base">Explore appeal types</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-ink" style={{ fontFamily: "var(--font-sans)" }}>{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{a}</div>}
    </div>
  );
}
