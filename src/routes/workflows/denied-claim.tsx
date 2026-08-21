import { createFileRoute } from "@tanstack/react-router";
import { AppealWorkflowWorkspace } from "@/components/workflow/appeal-workflow-workspace";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/denied-claim")({
  head: () => ({ meta: [{ title: `${getWorkflow("denied-claim").title} — Appeal Mail` }, { name: "description", content: getWorkflow("denied-claim").description }] }),
  component: () => <AppealWorkflowWorkspace workflowId="denied-claim" />,
});
