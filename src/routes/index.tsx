import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Scale, Mail, ShieldCheck, Clock, PackageCheck, FileSearch, Send, Eye, CalendarClock, Stamp, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { workflows } from "@/domain/workflows";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Appeal Mail — Understand the Decision. Build the Appeal. Mail It." },
      { name: "description", content: "Understand adverse decisions, organize evidence, build supported appeals, and mail them with proof of delivery. A MailMyPDF product." },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "Appeal Mail — Understand the Decision. Build the Appeal. Mail It." },
      { property: "og:description", content: "Analyze decisions, organize evidence, build supported appeals, and send with proof of delivery. A MailMyPDF product." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const steps = [
  { n: "01", title: "Understand", desc: "Upload the decision letter and supporting documents. We cross-reference everything to find date conflicts, unaddressed evidence, and contradictions — each finding source-linked.", icon: Eye },
  { n: "02", title: "Build", desc: "Approved findings become appeal grounds with linked evidence. The draft is built from your analysis, not a blank page. Review and edit every word.", icon: FileText },
  { n: "03", title: "Verify", desc: "We attack every ground from the decision-maker's perspective, score each argument 0–100, and find your weakest link. Then show you exactly how to fix it.", icon: ShieldCheck },
  { n: "04", title: "Send", desc: "Before mailing, we scan your draft for exaggerated claims. Then MailMyPDF prints, envelops, and sends your document via USPS — certified with return receipt is recommended.", icon: Send },
  { n: "05", title: "Track", desc: "MailMyPDF tracks delivery and gives you a permanent proof certificate with SHA-256 hash — your record that the appeal was filed on time.", icon: PackageCheck },
];

const stats = [
  { value: "3–5", label: "Business day delivery" },
  { value: "$4.99", label: "Starting price per mailing" },
  { value: "100%", label: "You control the facts" },
  { value: "0", label: "Printers needed" },
];

const trustItems = [
  { icon: ShieldCheck, title: "User review before sending", desc: "Nothing is mailed until you review and approve it." },
  { icon: Eye, title: "Source-aware reasoning", desc: "Findings cite the exact document and passage they come from." },
  { icon: ShieldCheck, title: "No fabricated facts", desc: "The AI never invents facts, legal conclusions, or evidence." },
  { icon: Mail, title: "No automatic mailing", desc: "Physical mail is never sent without your explicit authorization." },
];

const faqItems = [
  { q: "Is this legal advice?", a: "No. Appeal Mail is a correspondence tool, not a law firm. We help you prepare and send appeal documents — we do not provide legal advice." },
  { q: "What types of decisions can I appeal?", a: "Insurance claim denials, health insurance decisions, SSI and SSDI denials, unemployment determinations, Medicaid denials, licensing and DMV decisions, and more. Browse the full directory on the Workflows page." },
  { q: "How does the mailing work?", a: "Your final document is printed, placed in an envelope, and mailed via USPS by MailMyPDF. You can choose first-class, certified, or certified with return receipt for proof of delivery." },
  { q: "Is my data secure?", a: "All documents are stored with encryption, never shared with third parties, and never used for marketing. You can request full deletion at any time." },
  { q: "What does it cost?", a: "Mailing costs start at $4.99 per mailing, including printing, paper, envelope, and postage. Certified starts at $14.94. No subscription required." },
  { q: "Do I need a MailMyPDF account?", a: "Yes. A free MailMyPDF Account lets you save your work, track mailings, and keep proof of delivery. One account works across all MailMyPDF products." },
];

function HomePage() {
  const workflowCount = Object.keys(workflows).length;

  return (
    <main>
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule">
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="postmark mb-6">Don't let the deadline pass</span>
            <h1 className="mt-6 text-4xl leading-tight text-ink md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
              Understand the decision.<br />
              Build the response.<br />
              <span className="text-stamp">Send it with proof.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink-soft sm:text-lg">
              Got a denial, suspension, or government decision you need to challenge?
              Upload the document, let the analysis find the issues, build a supported response,
              and mail it with proof of timely filing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/workflows" className="btn-amber">Find your appeal type <ArrowRight size={16} /></Link>
              <Link to="/workflows/denied-claim" className="btn-outline">Start with a denied claim</Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <Mail size={12} strokeWidth={2.5} />
              <span className="font-mono uppercase tracking-widest">A MailMyPDF product</span>
              <span className="mx-2 text-rule">·</span>
              <span>{workflowCount} specialized workflows</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Journey */}
      <section id="how" className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">How it works</span>
            <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>
              Understand → Build → Verify → Send → Track
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-soft">
              Every appeal follows the same disciplined progression. You stay in control at every step.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <div key={step.n} className="group relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-rule bg-card transition-colors group-hover:border-stamp/40">
                  <step.icon size={20} className="text-ink-soft transition-colors group-hover:text-stamp" />
                </div>
                <span className="mt-4 block font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">{step.n}</span>
                <h3 className="mt-1 text-xl font-bold text-ink" style={{ fontFamily: "var(--font-serif)" }}>{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-rule bg-card py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-ink" style={{ fontFamily: "var(--font-serif)" }}>{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Types */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Appeal Types</span>
            <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>
              {workflowCount} specialized workflows
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-soft">
              Each workflow is tailored to a specific type of decision. Insurance denials, government benefits,
              DMV suspensions, financial aid appeals, and more.
            </p>
          </div>
          <div className="mt-8">
            <Link to="/workflows" className="btn-amber">Browse all {workflowCount} workflows <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-rule bg-card py-16 md:py-20">
        <div className="container">
          <h2 className="text-2xl font-bold text-ink md:text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
            You stay in control
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.title}>
                <item.icon size={24} className="text-stamp" />
                <h3 className="mt-3 text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold text-ink" style={{ fontFamily: "var(--font-serif)" }}>
            Common questions
          </h2>
          <div className="mt-8 space-y-6">
            {faqItems.map((item) => (
              <div key={item.q} className="border-b border-rule pb-6">
                <h3 className="text-base font-semibold text-ink">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-rule bg-card py-16 md:py-24">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>
            Ready to start?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Find the workflow that matches your situation and upload your document.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/workflows" className="btn-amber">Browse appeal types <ArrowRight size={16} /></Link>
            <Link to="/auth" className="btn-outline">Create a MailMyPDF Account</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
