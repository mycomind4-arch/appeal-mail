import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Outlet } from "@tanstack/react-router";
import { workflows } from "@/domain/workflows";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org", "@type": "WebSite", name: "Appeal Mail — Workflow Directory", description: "Specialized appeal workflows.", url: "/workflows",
      hasPart: Object.values(workflows).map((workflow) => ({ "@type": "WebPage", name: workflow.title, url: `/workflows/${workflow.id}`, about: workflow.primaryKeyword || workflow.title })),
    }) }],
  }),
  component: WorkflowLayout,
});

function WorkflowLayout() {
  return <div className="min-h-screen bg-paper"><SiteHeader /><main>
    <Outlet />
  </main><SiteFooter /></div>;
}
