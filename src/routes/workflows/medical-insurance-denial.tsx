import { createFileRoute } from "@tanstack/react-router";
import { MedicalInsuranceDenialWorkspace } from "@/components/workflow/medical-insurance-denial-workspace";
export const Route=createFileRoute("/workflows/medical-insurance-denial")({component:()=> <MedicalInsuranceDenialWorkspace/>});
