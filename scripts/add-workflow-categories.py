#!/usr/bin/env python3
"""Add category field to workflow definitions and refactor directory component."""
import re

# Category mapping for all 36 workflows
CATEGORIES = {
    "denied-claim": "Insurance",
    "government-decision": "Administrative",
    "court-ruling": "Administrative",
    "reconsideration": "Disability & Social Security",
    "insurance-claim-denial": "Insurance",
    "insurance-denial-letter": "Insurance",
    "insurance-coverage-denial": "Insurance",
    "medical-insurance-denial": "Insurance",
    "medical-necessity-appeal": "Insurance",
    "prior-authorization-denial": "Insurance",
    "out-of-network-denial": "Insurance",
    "dental-insurance-appeal": "Insurance",
    "car-insurance-appeal": "Insurance",
    "life-insurance-denial": "Insurance",
    "claim-denial-letter": "Insurance",
    "ssdi-denial": "Disability & Social Security",
    "ssi-denial": "Disability & Social Security",
    "social-security-denial": "Disability & Social Security",
    "unemployment-denial": "Unemployment",
    "edd-denial": "Unemployment",
    "medicaid-denial": "Government Benefits",
    "drivers-license-suspension": "Administrative",
    "license-suspension-appeal": "Administrative",
    "license-revocation-appeal": "Administrative",
    "registration-suspension-appeal": "Administrative",
    "fafsa-appeal": "Administrative",
    "financial-aid-appeal": "Administrative",
    "financial-aid-reinstatement": "Administrative",
    "financial-aid-special-circumstances": "Administrative",
    "financial-aid-suspension-appeal": "Administrative",
    "sap-appeal": "Administrative",
    "scholarship-appeal": "Administrative",
    "irs-cp2000-response": "Tax & IRS",
    "irs-cp14-response": "Tax & IRS",
    "irs-cp504-response": "Tax & IRS",
    "irs-cp523-response": "Tax & IRS",
}

# 1. Add category to WorkflowDefinition interface
with open("src/domain/workflows.ts") as f:
    content = f.read()

# Add category to interface
old_iface = '  keywordIntent?: "transactional" | "commercial" | "informational"; workflowPrompt: string; acceptsDocuments: boolean;'
new_iface = '  keywordIntent?: "transactional" | "commercial" | "informational"; workflowPrompt: string; acceptsDocuments: boolean; category: string;'
content = content.replace(old_iface, new_iface)

# Add category to BASE
old_base = 'experienceStages: ["understand","build","send"] as const, acceptsDocuments: true,'
new_base = 'experienceStages: ["understand","build","send"] as const, acceptsDocuments: true, category: "Administrative",'
content = content.replace(old_base, new_base)

# Add category parameter to makeWorkflow
old_make_sig = 'function makeWorkflow(id: string,title: string,description: string,primaryKeyword: string|undefined,primaryMsv: number|undefined,primaryCpc: number|undefined,focusAreas: string[],workflowPrompt: string): WorkflowDefinition {'
new_make_sig = 'function makeWorkflow(id: string,title: string,description: string,primaryKeyword: string|undefined,primaryMsv: number|undefined,primaryCpc: number|undefined,focusAreas: string[],workflowPrompt: string,category?: string): WorkflowDefinition {'
content = content.replace(old_make_sig, new_make_sig)

# Add category to return
old_return = '  return {...BASE,id,title,description,primaryKeyword,primaryMsv,primaryCpc,focusAreas,keywordIntent:"transactional",workflowPrompt};'
new_return = '  return {...BASE,id,title,description,primaryKeyword,primaryMsv,primaryCpc,focusAreas,keywordIntent:"transactional",workflowPrompt,category:category||BASE.category};'
content = content.replace(old_return, new_return)

# Now add category argument to each makeWorkflow call
# Pattern: makeWorkflow("id",..., "prompt")  -- add category before closing )
# We need to find each workflow definition and add the category

for wid, cat in CATEGORIES.items():
    # Find the makeWorkflow call for this workflow id
    # Each ends with a long workflowPrompt string followed by )
    # We need to add , "Category" before the closing )
    # The pattern is: makeWorkflow("wid",
    pattern = f'"{wid}"'
    if pattern not in content:
        print(f"WARNING: workflow {wid} not found in workflows.ts")
        continue

# Different approach: find all makeWorkflow calls and add category
# Each makeWorkflow call spans multiple lines and ends with `  ),`
# or `  )`
# Let's find them by the workflow id pattern

lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Check if this line starts a makeWorkflow call
    for wid, cat in CATEGORIES.items():
        # Match pattern like: "workflow-id": makeWorkflow(
        if f'"{wid}": makeWorkflow(' in line:
            # Find the closing parenthesis - it's the last arg of makeWorkflow
            # We need to find the end of this call and add category
            # The call ends with a line like:  ) or  ),
            # But the workflowPrompt is the last arg, ending with a string
            # Let's collect lines until we find the closing
            new_lines.append(line)
            i += 1
            # Collect until we find a line that's just ")" or ")," at the start
            depth = line.count('(') - line.count(')')
            while i < len(lines) and depth > 0:
                l = lines[i]
                depth += l.count('(') - l.count(')')
                if depth <= 0:
                    # This is the closing line - add category before it
                    # The line should be something like "  )," or "  )"
                    # We need to insert the category before the closing paren
                    # Actually, the last argument is the workflowPrompt string
                    # which ends with a quote. We need to add , "Category" 
                    # after the closing quote of the prompt but before the )
                    # Let's just add a new line with the category
                    # Find the last string argument end
                    # Simple approach: add category as the last arg
                    stripped = l.strip()
                    if stripped == ')' or stripped == '),' or stripped.startswith(')'),':
                        # Insert category line before this
                        new_lines.append(f'  ,"{cat}"')
                    new_lines.append(l)
                    i += 1
                    break
                new_lines.append(l)
                i += 1
            break
    else:
        new_lines.append(line)
        i += 1

content = '\n'.join(new_lines)

with open("src/domain/workflows.ts", "w") as f:
    f.write(content)

print("Added category field to workflow definitions")
