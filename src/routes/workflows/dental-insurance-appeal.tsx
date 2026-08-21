import { createFileRoute } from "@tanstack/react-router";
import { DentalInsuranceAppealWorkspace } from "@/components/workflow/dental-insurance-appeal-workspace";

export const Route = createFileRoute("/workflows/dental-insurance-appeal")({ component: DentalInsuranceAppealWorkspace });
