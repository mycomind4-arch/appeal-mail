import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Scale, Mail, ShieldCheck, Sparkles, Clock, PackageCheck, Lock, FileUp, ChevronDown, Send, Eye, Stamp, Gavel, FileText, TrendingUp, Quote, ShieldAlert, CalendarClock, FileSearch } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({ component: HomePage });

const workflows = [
  { title: "Appeal a Denied Claim", description: "Prepare an appeal letter for a denied insurance claim, benefit denial, or workers' compensation decision.", icon: FileText, href: "/workflows/denied-claim" },
  { title: "Appeal a Government Decision", description: "Prepare an appeal for a denied government benefit, licensing decision, or agency ruling.", icon: Scale, href: "/workflows/government-decision" },
  { title: "Appeal a Court Ruling", description: "Prepare an appeal for a small claims, traffic, or municipal court decision.", icon: Gavel, href: "/workflows/court-ruling" },
  { title: "Submit a Reconsideration", description: "Request an internal review or reconsideration before filing a formal appeal.", icon: Mail, href: "/workflows/reconsideration" },
];

const features = [
  { icon: Eye, title: "Appeal X-Ray™ analysis", desc: "Upload your decision and supporting documents. We cross-reference everything to find date conflicts, unaddressed evidence, unsupported conclusions, and contradictions — each finding source-linked and explicitly uncertainty-aware.", featured: true },
  { icon: CalendarClock, title: "Appeal Timeline™", desc: "We reconstruct the entire case history automatically from your documents. Every event gets an integrity status — documented, inferred, conflicting, or unknown — with evidence linked to each one. Timeline conflicts become appeal grounds with one click.", featured: true },
  { icon: ShieldAlert, title: "Appeal Stress Test™", desc: "We attack every ground from the decision-maker's perspective, score each argument 0-100, and find your weakest link. Before mailing, we scan your draft for exaggerated claims and suggest precise revisions.", featured: true },
  { icon: Sparkles, title: "AI-assisted drafting", desc: "Approved findings automatically become appeal grounds with linked evidence. The draft is built from your analysis, not a blank page. Everything is editable." },
  { icon: Scale, title: "Guided appeal workflows", desc: "Each workflow is specialized for your decision type — denied claims, government decisions, court rulings, or reconsiderations." },
  { icon: Send, title: "Physical mail with tracking", desc: "Your appeal is printed, enveloped, and mailed via USPS. Track delivery and keep proof of timely submission." },
  { icon: ShieldCheck, title: "Proof of timely filing", desc: "Certified mail options include signature tracking and return receipt — your record that the appeal was received on time. SHA-256 proof certificates." },
  { icon: Lock, title: "Secure & private", desc: "Your documents are encrypted, never shared, and never used for marketing or AI training. Delete your data anytime." },
];

const steps = [
  { n: "01", title: "Upload", desc: "Upload the decision letter and every supporting document you have — receipts, correspondence, reports." },
  { n: "02", title: "Analyze", desc: "The Appeal X-Ray™ cross-references your documents to find date conflicts, unaddressed evidence, and contradictions — each finding source-linked and uncertainty-aware." },
  { n: "03", title: "Timeline", desc: "The Appeal Timeline™ reconstructs the entire case history automatically. Every event gets an integrity status — documented, inferred, conflicting, or unknown — and evidence is attached to each one." },
  { n: "04", title: "Build", desc: "Approved findings and timeline conflicts automatically become appeal grounds with linked evidence. Review and edit every word." },
  { n: "05", title: "Stress Test", desc: "We attack every ground from the decision-maker's perspective, score each argument 0-100, and find your weakest link — then show you exactly how to fix it." },
  { n: "06", title: "Send", desc: "Before mailing, we scan your draft for exaggerated claims and unsupported assertions. Then choose your mailing — certified with return receipt is recommended." },
  { n: "07", title: "Prove", desc: "Track delivery and keep a permanent, tamper-evident record of your timely filing." },
];

const stats = [
  { value: "3–5", label: "Business day delivery" },
  { value: "$4.99", label: "Starting price per mailing" },
  { value: "100%", label: "You control the facts" },
  { value: "0", label: "Printers needed" },
];

const testimonials = [
  { quote: "My insurance claim was denied and the appeal deadline was 30 days. Appeal Mail helped me organize my response and mail it certified with return receipt. The signed card came back as proof.", author: "Sarah K.", role: "Denied Insurance Claim" },
  { quote: "I needed to appeal a Social Security decision and had no idea where to start. The guided workflow walked me through every step. Nothing was sent until I reviewed and approved it.", author: "Marcus J.", role: "SSA Appeal" },
  { quote: "Having all my appeal mailings tracked in one dashboard is exactly what I needed. I can see exactly when each one was delivered.", author: "Diane F.", role: "Multiple Appeals" },
];

const comparison = [
  { feature: "Cross-document analysis (Appeal X-Ray™)", us: true, them: false },
  { feature: "Automatic timeline reconstruction (Appeal Timeline™)", us: true, them: false },
  { feature: "Event integrity status (documented, inferred, conflicting, unknown)", us: true, them: false },
  { feature: "Timeline conflict detection with one-click 'Add to Appeal'", us: true, them: false },
  { feature: "Timeline gap detection with suggested missing records", us: true, them: false },
  { feature: "Deadline engine with conflict detection", us: true, them: false },
  { feature: "Adversarial stress testing (Appeal Stress Test™)", us: true, them: false },
  { feature: "Argument strength scoring (0-100 per ground)", us: true, them: false },
  { feature: "Draft vulnerability detection (exaggeration, unsupported claims)", us: true, them: false },
  { feature: "Weakest link identification with fix suggestions", us: true, them: false },
  { feature: "Source-linked findings with confidence levels", us: true, them: false },
  { feature: "Evidence gap analysis with suggestions", us: true, them: false },
  { feature: "Visual appeal map (decision → grounds)", us: true, them: false },
  { feature: "Guided appeal workflows (not blank-page chat)", us: true, them: false },
  { feature: "AI never invents facts or legal conclusions", us: true, them: "varies" },
  { feature: "Physical mail with tracking", us: true, them: false },
  { feature: "Certified mail with return receipt", us: true, them: false },
  { feature: "Proof of timely filing records", us: true, them: false },
  { feature: "Appeal mailing history dashboard", us: true, them: false },
  { feature: "No printer or post office visit needed", us: true, them: "DIY" },
  { feature: "You review before anything is sent", us: true, them: "varies" },
];

const faqItems = [
  { q: "Is this legal advice?", a: "No. Appeal Mail is a correspondence tool, not a law firm. We help you prepare and send appeal documents — we do not provide legal advice, and AI never invents facts or legal conclusions." },
  { q: "What types of decisions can I appeal?", a: "Denied insurance claims, government benefit decisions, licensing rulings, small claims and traffic court decisions, and internal reconsideration requests." },
  { q: "How does the mailing work?", a: "Your final document is printed, placed in an envelope, and mailed via USPS. You can choose first-class, certified, or certified with return receipt for proof of delivery." },
  { q: "Is my data secure?", a: "All documents are stored with encryption, never shared with third parties, and never used for marketing. You can request full deletion at any time." },
  { q: "What does it cost?", a: "Costs start at $4.99 per mailing, including printing, paper, envelope, and postage. Certified starts at $14.94. No subscription required." },
];

function HomePage() {
  return (
    <main>
      <SiteHeader />

      {/* Hero — paper aesthetic, no dark background */}
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
              <a href="/workflows/denied-claim" className="btn-amber text-base">Start an Appeal <ArrowRight size={18} /></a>
              <a href="#how" className="btn-outline text-base">See how it works</a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Not a law firm. Not legal advice. You remain in control of the facts and final document.</p>
          </div>
        </div>

        {/* Visual flow */}
        <div className="border-t border-rule bg-paper-deep">
          <div className="container py-6">
            <div className="flex items-center gap-3 overflow-x-auto">
              {[
                { label: "Decision", icon: FileText },
                { label: "Appeal X-Ray", icon: Scale },
                { label: "Timeline", icon: CalendarClock },
                { label: "Stress Test", icon: ShieldAlert },
                { label: "Evidence", icon: FileSearch },
                { label: "Appeal", icon: Gavel },
                { label: "Proof", icon: ShieldCheck },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2 rounded-md border border-rule bg-card px-3 py-2">
                    <item.icon size={16} className="text-stamp" />
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  {i < 6 && <ArrowRight size={14} className="text-rule" />}
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

      {/* Workflows */}
      <section id="workflows" className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">What you can appeal</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Start with the decision you received.</h2>
            <p className="mt-4 text-muted-foreground">Each workflow is designed around a distinct appeal job and routes into the working Appeal Mail application.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workflows.map((w) => (
              <Link to={w.href} key={w.title} className="card envelope-card-hover group p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklab, var(--stamp) 8%, transparent)" }}>
                  <w.icon size={24} className="text-stamp" />
                </div>
                <h3 className="mt-5 text-lg text-ink" style={{ fontFamily: "var(--font-serif)" }}>{w.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{w.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stamp">
                  Open workflow
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-rule bg-card">
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

      {/* Testimonials */}
      <section className="border-y border-rule bg-card">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">From users</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>People who got their appeals in on time.</h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="card p-6">
                <Quote size={28} className="text-stamp" />
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{t.quote}</p>
                <div className="mt-5 border-t border-rule pt-4">
                  <p className="text-sm font-semibold text-ink">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Why Appeal Mail</div>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Built for appeals. Not a chatbot.</h2>
            <p className="mt-4 text-muted-foreground">Every feature is designed for the appeal job — from document analysis to proof of filing.</p>
          </div>
          <div className="mx-auto mt-14 max-w-4xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule">
                  <th className="py-4 pr-4 text-left font-semibold text-ink">Feature</th>
                  <th className="px-4 py-4 text-center font-semibold text-ink">Appeal Mail</th>
                  <th className="px-4 py-4 text-center font-semibold text-muted-foreground">Generic AI chat</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-rule">
                    <td className="py-3.5 pr-4 text-muted-foreground">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center">
                      {row.us === true ? <CheckCircle2 size={18} className="mx-auto text-stamp" /> : <span className="text-muted-foreground">{row.us}</span>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {row.them === false ? <span className="text-muted-foreground">—</span> : row.them === true ? <CheckCircle2 size={18} className="mx-auto text-muted-foreground" /> : <span className="text-muted-foreground">{row.them}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <Link to="/workflows/denied-claim" className="btn-amber mt-8 text-base">Start now <ArrowRight size={18} /></Link>
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
