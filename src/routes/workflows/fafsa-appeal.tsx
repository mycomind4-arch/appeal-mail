import { createFileRoute } from "@tanstack/react-router";
import { FafsaAppealWorkspace } from "@/components/workflow/fafsa-appeal-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route=createFileRoute("/workflows/fafsa-appeal")({head:()=>({meta:[{title:`${getWorkflow("fafsa-appeal").title} — Appeal Mail`},{name:"description",content:getWorkflow("fafsa-appeal").description}]}),component:FafsaAppealWorkspace});
