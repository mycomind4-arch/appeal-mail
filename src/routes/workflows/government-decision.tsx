import { createFileRoute } from "@tanstack/react-router";
import { GovernmentDecisionWorkspace } from "@/components/workflow/government-decision-workspace";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/government-decision")({
  head: () => ({ meta: [{ title: `${getWorkflow("government-decision").title} — Appeal Mail` }, { name: "description", content: getWorkflow("government-decision").description }] }),
  component: GovernmentDecisionWorkspace,
});
