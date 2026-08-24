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
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero with background image */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url(https://media.base44.com/images/public/6a8bd310dfdf9ad92cf26415/348a016b8_generated_image.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(135deg, rgba(26,29,41,0.94) 0%, rgba(26,29,41,0.80) 50%, rgba(26,29,41,0.85) 100%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <div className="postmark w-fit" style={{ borderColor: "rgba(180,83,9,0.5)", color: "rgba(217,180,120,0.9)" }}>Appeal Mail</div>
            <h1 className="mt-5 font-serif text-4xl leading-tight hero-light sm:text-5xl md:text-6xl">
              Find the workflow that matches your situation.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 hero-muted sm:text-lg">
              {appealWorkflowCount} specialized workflows. Start with the decision, denial, or notice you received.
              Upload it once — the system analyzes the document, builds the response, and keeps you in control before anything is mailed.
            </p>
          </div>
        </div>
      </section>
      <section className="border-b border-rule/60 bg-paper-deep/25">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-rule bg-card p-5">
              <div className="font-serif text-3xl text-stamp">{appealWorkflowCount}</div>
              <div className="mt-1 text-sm font-semibold">problem-specific workflows</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Each workflow owns its own search intent and AI analysis focus.</p>
            </div>
            <div className="rounded-xl border border-rule bg-card p-5">
              <div className="font-serif text-3xl text-stamp">5</div>
              <div className="mt-1 text-sm font-semibold">step journey</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Understand → Build → Verify → Send → Track</p>
            </div>
            <div className="rounded-xl border border-rule bg-card p-5">
              <div className="font-serif text-3xl text-stamp">Gemini</div>
              <div className="mt-1 text-sm font-semibold">AI engine today</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Additional providers can be routed from MailMyPDF admin later.</p>
            </div>
          </div>
        </div>
      </section>
      <AppealWorkflowDirectory />
    </main>
  );
}
