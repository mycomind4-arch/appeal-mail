import { createFileRoute } from "@tanstack/react-router";
import { SapAppealWorkspace } from "@/components/workflow/sap-appeal-workspace";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/sap-appeal")({
  head: () => ({ meta: [{ title: `${getWorkflow("sap-appeal").title} — Appeal Mail` }, { name: "description", content: getWorkflow("sap-appeal").description }] }),
  component: SapAppealWorkspace,
});
