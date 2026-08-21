import { createFileRoute } from "@tanstack/react-router";
import { MedicalNecessityAppealWorkspace } from "@/components/workflow/medical-necessity-appeal-workspace";
export const Route=createFileRoute("/workflows/medical-necessity-appeal")({component:MedicalNecessityAppealRoute});
function MedicalNecessityAppealRoute(){return <MedicalNecessityAppealWorkspace/>;}
