import { createFileRoute } from "@tanstack/react-router";
import { CarInsuranceAppealWorkspace } from "@/components/workflow/car-insurance-appeal-workspace";

export const Route = createFileRoute("/workflows/car-insurance-appeal")({ component: CarInsuranceAppealWorkspace });
