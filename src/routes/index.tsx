import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Scale, Mail, ShieldCheck, Sparkles, Clock, PackageCheck, Lock, FileUp, ChevronDown, Send, Eye, Stamp, Gavel, FileText, TrendingUp, Quote, ShieldAlert, CalendarClock } from "lucide-react";
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
      <SiteHeader variant="transparent" />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 60%, #14122e 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.12'%3E%3Cpath d='M30 34l-4-4h8l-4 4zm0-12l-4 4h8l-4-4zM16 16h28v28H16V16zm4 4v20h20V20H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="badge badge-amber mb-5" style={{ background: "rgba(245,158,11,.15)", color: "#fbbf24" }}>Don't let the deadline pass</div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
                Appeal a denial. Don't let it stand.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                Prepare professional appeal letters for denied claims, government decisions, and court rulings. Send physical mail with tracking and keep proof of timely filing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/workflows/denied-claim" className="btn-amber text-base">
                  Start an Appeal <ArrowRight size={18} />
                </Link>
                <a href="#workflows" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
                  See what you can appeal
                </a>
              </div>
              <p className="mt-5 text-sm text-white/50">Not a law firm. Not legal advice. You remain in control of the facts and final document.</p>
            </div>

            {/* Visual mockup */}
            <div className="relative hidden lg:block">
              <div className="card relative p-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-warm-border pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-700">
                    <Scale size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>Your appeal workflow</p>
                    <p className="text-sm text-slate-400">From denial to filed appeal</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { icon: FileUp, text: "Upload the denial or decision letter", done: true },
                    { icon: FileText, text: "State grounds and organize the facts", done: true },
                    { icon: Sparkles, text: "Draft and edit your appeal letter", done: true },
                    { icon: Send, text: "Mail certified with return receipt", done: false },
                  ].map(({ icon: Icon, text, done }) => (
                    <div key={text} className="flex items-center gap-3 text-sm">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${done ? "bg-amber-50" : "bg-gray-100"}`}>
                        <Icon size={15} className={done ? "text-amber-600" : "text-gray-400"} />
                      </div>
                      <span className={done ? "text-indigo-700" : "text-slate-400"}>{text}</span>
                      {done && <CheckCircle2 size={15} className="ml-auto text-amber-500" />}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-indigo-500">
                    <PackageCheck size={16} className="text-amber-500" />
                    <span>Proof of timely filing</span>
                  </div>
                  <span className="badge badge-green">Ready</span>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                <Stamp size={16} /> Return receipt
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-warm-border bg-white py-8">
        <div className="container grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>{value}</p>
              <p className="mt-1 text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-warm-border bg-cream py-6">
        <div className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-400">
          {[
            { icon: Lock, text: "Bank-grade encryption" },
            { icon: PackageCheck, text: "USPS tracking included" },
            { icon: ShieldCheck, text: "Proof of timely filing" },
            { icon: Eye, text: "You review before anything is sent" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={16} className="text-amber-500" /> {text}
            </div>
          ))}
        </div>
      </section>

      {/* Workflows */}
      <section id="workflows" className="bg-cream py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Start with the denial</div>
            <h2 className="mt-3 text-3xl font-bold text-indigo-700 md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>What are you appealing?</h2>
            <p className="mt-4 text-slate-400">Choose a guided starting point. Appeal Mail is designed around appeal correspondence, not generic AI chat.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map(({ title, description, icon: Icon, href }) => (
              <Link key={title} to={href} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon size={24} className="text-indigo-700" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-600">
                  Start workflow <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="eyebrow">The process</div>
            <h2 className="mt-3 text-3xl font-bold text-indigo-700 md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>How Appeal Mail works</h2>
            <p className="mt-4 text-slate-400">From denial to filed appeal in four clear steps. Nothing is sent until you review and approve it.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-[2.2rem] top-12 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-warm-border to-transparent md:block" />
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-700 text-white">
                  <span className="text-sm font-bold">{n}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-cream py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="eyebrow">Why Appeal Mail</div>
            <h2 className="mt-3 text-3xl font-bold text-indigo-700 md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Built for appeal deadlines</h2>
            <p className="mt-4 text-slate-400">Everything you need to prepare, send, and prove your appeal — in one place.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50">
                  <Icon size={22} className="text-amber-600" />
                </div>
                <h3 className="mt-4 font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="text-center">
            <div className="eyebrow">The difference</div>
            <h2 className="mt-3 text-3xl font-bold text-indigo-700 md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Appeal Mail vs. doing it yourself</h2>
          </div>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-sm border border-warm-border rounded-xl overflow-hidden">
              <thead className="bg-indigo-700 text-white">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">Feature</th>
                  <th className="px-5 py-4 text-center font-semibold" style={{ fontFamily: "var(--font-serif)" }}>Appeal Mail</th>
                  <th className="px-5 py-4 text-center font-semibold">DIY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-border">
                {comparison.map(({ feature, us, them }) => (
                  <tr key={feature} className="hover:bg-cream/50">
                    <td className="px-5 py-3.5 text-slate-500 font-medium">{feature}</td>
                    <td className="px-5 py-3.5 text-center">
                      {us === true ? <CheckCircle2 size={18} className="mx-auto text-amber-600" /> : <span className="text-slate-400">{us}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {them === false ? <span className="text-slate-300">—</span> : <span className="text-slate-400">{them}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">What people say</div>
            <h2 className="mt-3 text-3xl font-bold text-indigo-700 md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Real appeals, real outcomes</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="card p-6">
                <Quote size={24} className="text-amber-200" />
                <p className="mt-3 text-sm leading-7 text-slate-500">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-500" style={{ fontFamily: "var(--font-serif)" }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-700">{t.author}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="eyebrow">Simple pricing</div>
            <h2 className="mt-3 text-3xl font-bold text-indigo-700 md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Pay per mailing. No subscription.</h2>
            <p className="mt-4 text-slate-400">Prices include printing, paper, envelope, and postage.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              { type: "Standard", price: "$4.99", desc: "3–7 business days, tracking included", icon: Mail },
              { type: "Certified", price: "$14.94", desc: "Delivery tracking + confirmation", icon: PackageCheck },
              { type: "Registered", price: "$32.49", desc: "Secure handling + tracking, insured", icon: Stamp, featured: true },
            ].map(({ type, price, desc, icon: Icon, featured }) => (
              <div key={type} className={`card p-6 text-center ${featured ? "ring-2 ring-amber-400" : ""}`}>
                {featured && <div className="badge badge-amber mb-3">Most popular</div>}
                <Icon size={28} className="mx-auto text-indigo-700" />
                <h3 className="mt-4 font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>{type}</h3>
                <p className="mt-2 text-3xl font-bold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>{price}</p>
                <p className="mt-2 text-xs text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/pricing" className="btn-outline">See full pricing <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section id="trust" className="bg-cream py-16 md:py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="card p-6">
              <Lock size={24} className="text-amber-500" />
              <h2 className="mt-4 text-lg font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>Your facts stay yours</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">AI assists with organization and drafting. It will never invent facts, deadlines, or legal conclusions. Your documents are encrypted and never shared.</p>
            </div>
            <div className="card p-6">
              <Clock size={24} className="text-amber-500" />
              <h2 className="mt-4 text-lg font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>Deadlines are everything</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Appeal deadlines can be as short as 10–30 days. Every workflow prompts you to note yours. Certified mail with return receipt proves you filed on time.</p>
            </div>
            <div className="card p-6">
              <Scale size={24} className="text-amber-500" />
              <h2 className="mt-4 text-lg font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>Know what we're not</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Appeal Mail is not a law firm and does not provide legal advice. If your appeal involves complex legal questions, consult a qualified attorney.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section id="faq" className="bg-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="text-center">
            <div className="eyebrow">Questions</div>
            <h2 className="mt-3 text-3xl font-bold text-indigo-700 md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Frequently asked</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqItems.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/faq" className="btn-outline">See all questions <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)" }} className="py-16 md:py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: "var(--font-serif)" }}>Ready to appeal?</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/60">Start a guided workflow, review your draft, and mail it — all in one place.</p>
          <Link to="/workflows/denied-claim" className="btn-amber mt-8 text-base">Start now <ArrowRight size={18} /></Link>
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
        <span className="font-semibold text-indigo-700">{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-6 text-slate-400">{a}</div>}
    </div>
  );
}
