import { createFileRoute, redirect } from "@tanstack/react-router";
import { getWorkflowBySlug } from "@/domain/appeal-catalog";
import { AppealWorkflowPage } from "@/components/appeal-workflow-page";

export const Route = createFileRoute("/appeal/$slug")({
  head: ({ params }) => {
    const workflow = getWorkflowBySlug(params.slug);
    if (!workflow) {
      return {
        meta: [
          { title: "Appeal type not found — Appeal Mail" },
          { name: "description", content: "This appeal type does not exist." },
        ],
      };
    }
    return {
      meta: [
        { title: workflow.seoTitle },
        { name: "description", content: workflow.seoDescription },
        { property: "og:title", content: workflow.seoTitle },
        { property: "og:description", content: workflow.seoDescription },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: workflow.route }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: workflow.title,
            description: workflow.seoDescription,
            about: workflow.primaryKeyword,
            isPartOf: {
              "@type": "WebSite",
              name: "Appeal Mail",
              url: "/",
            },
          }),
        },
      ],
    };
  },
  component: AppealSlugPage,
  notFoundComponent: () => null,
});

function AppealSlugPage() {
  const { slug } = Route.useParams();
  const workflow = getWorkflowBySlug(slug);

  if (!workflow) {
    throw redirect({ to: "/workflows" });
  }

  return <AppealWorkflowPage workflow={workflow} />;
}
