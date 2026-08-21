import { createFileRoute } from "@tanstack/react-router";
import { DriversLicenseSuspensionWorkspace } from "@/components/workflow/drivers-license-suspension-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route=createFileRoute("/workflows/drivers-license-suspension")({head:()=>({meta:[{title:`${getWorkflow("drivers-license-suspension").title} — Appeal Mail`},{name:"description",content:getWorkflow("drivers-license-suspension").description}]}),component:DriversLicenseSuspensionWorkspace});
