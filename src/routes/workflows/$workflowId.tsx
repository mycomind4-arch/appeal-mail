import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppealWorkflowWorkspace } from "@/components/workflow/appeal-workflow-workspace";
import { SsdiDenialWorkspace } from "@/components/workflow/ssdi-denial-workspace";
import { getWorkflow, isWorkflowId } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/$workflowId")({
  head: ({ params }) => {
    const workflow = isWorkflowId(params.workflowId) ? getWorkflow(params.workflowId) : undefined;
    return workflow ? { meta: [{ title: `${workflow.title} — Appeal Mail` }, { name: "description", content: workflow.description }] } : {};
  },
  component: WorkflowRoute,
});

function WorkflowRoute() {
  const { workflowId } = Route.useParams();
  if (!isWorkflowId(workflowId)) return <Navigate to="/workflows/denied-claim" />;
  if (workflowId === "ssdi-denial") return <SsdiDenialWorkspace />;
  return <AppealWorkflowWorkspace workflowId={workflowId} />;
}
