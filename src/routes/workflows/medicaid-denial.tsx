import { createFileRoute } from "@tanstack/react-router";
import { MedicaidDenialWorkspace } from "@/components/workflow/medicaid-denial-workspace";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/medicaid-denial")({
  head: () => ({ meta: [
    { title: `${getWorkflow("medicaid-denial").title} — Appeal Mail` },
    { name: "description", content: getWorkflow("medicaid-denial").description },
  ] }),
  component: () => <MedicaidDenialWorkspace />,
});
