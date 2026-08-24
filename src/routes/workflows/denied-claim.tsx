import { createFileRoute } from "@tanstack/react-router";
import { AppealWorkflowWorkspace } from "@/components/workflow/appeal-workflow-workspace";
import { InsuranceClaimDenialPricing } from "@/components/workflow/insurance-claim-denial-pricing";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/denied-claim")({
  head: () => ({ meta: [
    { title: "Appeal an Insurance Claim Denial — Authority-First | Appeal Mail" },
    { name: "description", content: "Analyze an insurance claim denial against the actual notice, policy terms, current authoritative guidance, and evidence. Gemini drafts and independently validates the response before human approval and proof-backed mailing." },
    { property: "og:title", content: "Appeal an Insurance Claim Denial" },
    { property: "og:description", content: "Authority-first insurance claim denial appeal with source-grounded analysis, Gemini drafting, independent validation, transparent packet pricing, and proof-backed mailing." },
    { name: "twitter:card", content: "summary" },
  ], links: [{ rel: "canonical", href: "/workflows/denied-claim" }] }),
  component: () => <><section className="mx-auto max-w-6xl px-6 pt-12"><div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-xl"><div className="absolute inset-0 -z-10" style={{backgroundImage:"url(https://media.base44.com/images/public/6a8bd310dfdf9ad92cf26415/f375349cf_generated_image.png)",backgroundSize:"cover",backgroundPosition:"center",opacity:0.08}}/><p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Authority-first insurance appeal</p><h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Appeal an Insurance Claim Denial</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">We analyze the actual denial, distinguish the insurer's stated reasons from disputed facts, map evidence and gaps, verify the applicable review path, and prepare a response you approve before it is mailed.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{[["Notice-grounded","The denial notice, supplied policy material, and current authoritative sources control procedural conclusions."],["Evidence-aware","Claim facts, policy references, contradictions, missing records, and requested relief remain traceable to the record."],["Independently challenged","Gemini drafts; a separate validation pass challenges unsupported claims, deadline assumptions, and missing evidence."]].map(([t,c])=><div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{t}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{c}</p></div>)}</div></div></section><InsuranceClaimDenialPricing/><AppealWorkflowWorkspace workflowId="denied-claim" /></>,
});
