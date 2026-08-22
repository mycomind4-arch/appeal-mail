import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";
import { uploadDocument } from "@/platform/mailmypdf";

export const Route = createFileRoute("/api/workflows/workers-comp-appeal/analyze")({ server: { handlers: { POST: async ({ request }) => {
  try {
    const user=await requireAuthenticatedUser(request); const form=await request.formData(); const file=form.get("document");
    if(!(file instanceof File)) return Response.json({error:"A workers' compensation notice is required."},{status:400});
    if(file.size===0) return Response.json({error:"The source document is empty."},{status:400});
    if(file.size>20*1024*1024) return Response.json({error:"Source documents must be 20 MB or smaller."},{status:413});
    if(!["application/pdf","image/png","image/jpeg"].includes(file.type)) return Response.json({error:"Accepted source types are PDF, PNG, and JPEG."},{status:415});
    const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN; const base=process.env.MAILMYPDF_CONTROL_PLANE_URL||"https://mailmypdf.com"; if(!token) throw new Error("MailMyPDF control-plane token is not configured.");
    const cfgRes=await fetch(`${base.replace(/\/$/,"")}/api/control-plane/ai`,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${token}`},body:JSON.stringify({verticalSlug:"appeal-mail",workflowSlug:"workers-comp-appeal",task:"analysis"})});
    const cfg=await cfgRes.json().catch(()=>null) as any; if(!cfgRes.ok) throw new Error(cfg?.error||`Control plane error (${cfgRes.status}).`); if(cfg.provider!=="gemini") throw new Error("Workers' Compensation Appeal is currently configured for Gemini.");
    const prompt=cfg.promptOverride||[
      "You are the authority-first analyst for a workers' compensation appeal workflow.",
      "Return strict JSON only. Extract only information supported by the source notice.",
      "Never invent medical facts, injury facts, wage facts, employer facts, deadlines, forms, filing destinations, hearing forums, eligibility, compensability, impairment, or outcomes.",
      "Separate document facts from procedural conclusions and unresolved questions.",
      '{"summary":"","issuer":"","jurisdiction":"","claimNumber":"","decisionDate":"","deadline":"","deadlineStatus":"extracted|verified|unverified","appealInstructions":"","matterType":"","findings":[],"medicalFactsMentioned":[],"wageFactsMentioned":[],"injuryFactsMentioned":[],"disputedFacts":[],"evidenceGaps":[],"contradictions":[],"citedAuthority":[],"authoritySources":[],"timeline":[],"uncertainties":[],"confidence":"high|medium|low"}',
      "Use empty strings and arrays for unknown values."
    ].join("\n");
    const bytes=Buffer.from(await file.arrayBuffer()).toString("base64");
    const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{inlineData:{mimeType:file.type,data:bytes}},{text:prompt}]}],generationConfig:{responseMimeType:"application/json",temperature:0.1}})});
    const body=await response.json().catch(()=>null) as any; if(!response.ok) throw new Error(body?.error?.message||`Gemini analysis failed (${response.status}).`); const text=body?.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text||"").join("").trim(); if(!text) throw new Error("Gemini returned no analysis."); const analysis=JSON.parse(text) as Record<string,unknown>;
    const sourceDocument=await uploadDocument(file); const appealId=crypto.randomUUID(); const now=new Date().toISOString();
    const decision={id:crypto.randomUUID(),type:"workers_comp_decision",documentId:sourceDocument.id,documentFilename:file.name,issuer:analysis.issuer||"",jurisdiction:analysis.jurisdiction||"",claimNumber:analysis.claimNumber||"",decisionDate:analysis.decisionDate||"",deadline:analysis.deadline?{date:analysis.deadline,status:analysis.deadlineStatus||"unverified",source:"extracted"}:undefined,appealInstructions:analysis.appealInstructions||"",matterType:analysis.matterType||"",findings:Array.isArray(analysis.findings)?analysis.findings:[],medicalFactsMentioned:Array.isArray(analysis.medicalFactsMentioned)?analysis.medicalFactsMentioned:[],wageFactsMentioned:Array.isArray(analysis.wageFactsMentioned)?analysis.wageFactsMentioned:[],injuryFactsMentioned:Array.isArray(analysis.injuryFactsMentioned)?analysis.injuryFactsMentioned:[],disputedFacts:Array.isArray(analysis.disputedFacts)?analysis.disputedFacts:[],evidenceGaps:Array.isArray(analysis.evidenceGaps)?analysis.evidenceGaps:[],contradictions:Array.isArray(analysis.contradictions)?analysis.contradictions:[],citedAuthority:Array.isArray(analysis.citedAuthority)?analysis.citedAuthority:[],authoritySources:Array.isArray(analysis.authoritySources)?analysis.authoritySources:[],timeline:Array.isArray(analysis.timeline)?analysis.timeline:[],uncertainties:Array.isArray(analysis.uncertainties)?analysis.uncertainties:[],extractedAt:now};
    const supabase=await getSupabaseServer(); const {error}=await supabase.from("appeals").insert({id:appealId,user_id:user.id,workflow_id:"workers-comp-appeal",status:"in_progress",decision,grounds:[],evidence:[{id:crypto.randomUUID(),type:"document",label:file.name,documentId:sourceDocument.id,uploadedAt:now}],arguments:[],draft:"",review:null,packet:null,proof:null,timeline:decision.timeline||[],version:1,created_at:now,updated_at:now}); if(error) throw new Error(`Unable to save appeal: ${error.message}`);
    return Response.json({ok:true,appealId,documentId:sourceDocument.id,analysis});
  } catch(error) { const message=error instanceof Error?error.message:"Unable to analyze workers' compensation notice."; return Response.json({error:message},{status:/authentication|required|token/i.test(message)?401:502}); }
} } } });
