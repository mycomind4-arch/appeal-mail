import { createFileRoute } from "@tanstack/react-router";
import { AppealWorkflowWorkspace } from "@/components/workflow/appeal-workflow-workspace";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/government-decision")({
  head: () => ({ meta: [{ title: `${getWorkflow("government-decision").title} — Appeal Mail` }, { name: "description", content: getWorkflow("government-decision").description }] }),
  component: () => <AppealWorkflowWorkspace workflowId="government-decision" />,
});
