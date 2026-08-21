import { createFileRoute } from "@tanstack/react-router";
import { AppealWorkflowDirectory } from "@/components/appeal-workflow-directory";
import { appealWorkflowCount } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/")({
  head: () => ({
    meta: [
      { title: "Appeal Workflows — Appeal Mail" },
      { name: "description", content: "Browse 33 problem-specific Appeal Mail workflows. Upload the decision or denial, let Gemini analyze it, build the response, review it, and prepare it for mailing." },
      { property: "og:title", content: "Appeal Workflows — Appeal Mail" },
      { property: "og:description", content: "Problem-specific appeal workflows with document upload, Gemini analysis, response drafting, review, and MailMyPDF fulfillment." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/workflows" }],
  }),
  component: WorkflowDirectoryPage,
});

function WorkflowDirectoryPage() {
  return <>
    <section className="border-b border-rule/60"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20"><div className="max-w-3xl"><div className="postmark w-fit">Appeal Mail</div><h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">Find the workflow that matches your situation.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">{appealWorkflowCount} specialized workflows. Start with the decision, denial, or notice you received. Upload it once; the system analyzes the document, builds the response, and keeps you in control before anything is mailed.</p></div></div></section>
    <section className="border-b border-rule/60 bg-paper-deep/25"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="grid gap-4 md:grid-cols-3"><div className="rounded-xl border border-rule bg-card p-5"><div className="font-serif text-3xl text-stamp">{appealWorkflowCount}</div><div className="mt-1 text-sm font-semibold">problem-specific workflows</div><p className="mt-1 text-xs leading-5 text-muted-foreground">Each workflow owns its own search intent and AI analysis focus.</p></div><div className="rounded-xl border border-rule bg-card p-5"><div className="font-serif text-3xl text-stamp">1</div><div className="mt-1 text-sm font-semibold">customer experience</div><p className="mt-1 text-xs leading-5 text-muted-foreground">Understand → Build → Send.</p></div><div className="rounded-xl border border-rule bg-card p-5"><div className="font-serif text-3xl text-stamp">Gemini</div><div className="mt-1 text-sm font-semibold">AI engine today</div><p className="mt-1 text-xs leading-5 text-muted-foreground">Additional providers can be routed from MailMyPDF admin later.</p></div></div></div></section>
    <AppealWorkflowDirectory />
  </>;
}
