import { createFileRoute } from "@tanstack/react-router";
import { LicenseSuspensionAppealWorkspace } from "@/components/workflow/license-suspension-appeal-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route=createFileRoute("/workflows/license-suspension-appeal")({head:()=>({meta:[{title:`${getWorkflow("license-suspension-appeal").title} — Appeal Mail`},{name:"description",content:getWorkflow("license-suspension-appeal").description}]}),component:LicenseSuspensionAppealWorkspace});
