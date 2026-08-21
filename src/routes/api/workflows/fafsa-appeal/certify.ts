import { createAPIFileRoute } from "@tanstack/react-start";
import { getWorkflow } from "@/domain/workflows";
export const APIRoute=createAPIFileRoute("/api/workflows/fafsa-appeal/certify")({GET:async()=>{const workflow=getWorkflow("fafsa-appeal");return Response.json({workflowId:workflow.id,experienceStages:workflow.experienceStages,acceptsDocuments:workflow.acceptsDocuments,primaryKeyword:workflow.primaryKeyword,ai:"Gemini",upload:workflow.acceptsDocuments?["application/pdf","image/png","image/jpeg"]:[]});}});
