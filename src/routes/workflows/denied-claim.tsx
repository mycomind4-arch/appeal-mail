import { createFileRoute } from "@tanstack/react-router";
import { AppealWorkflowWorkspace } from "@/components/workflow/appeal-workflow-workspace";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/denied-claim")({
  head: () => ({ meta: [{ title: `${getWorkflow("denied-claim").title} — Appeal Mail` }, { name: "description", content: getWorkflow("denied-claim").description }, { property: "og:title", content: `${getWorkflow("denied-claim").title} — Appeal Mail` }, { property: "og:description", content: getWorkflow("denied-claim").description }, { name: "twitter:card", content: "summary" }, { name: "twitter:title", content: `${getWorkflow("denied-claim").title} — Appeal Mail` }, { name: "twitter:description", content: getWorkflow("denied-claim").description }], links: [{ rel: "canonical", href: "/workflows/denied-claim" }] }),
  component: () => <AppealWorkflowWorkspace workflowId="denied-claim" />,
});
