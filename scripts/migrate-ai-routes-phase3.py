#!/usr/bin/env python3
"""Phase 3: Migrate inline (minified) control-plane fetches to resolveAI."""
import re, os

CONTROL_PLANE_IMPORT = 'import { resolveAI } from "@/platform/control-plane-ai";'

FILES = [
    "src/routes/api/workflows/administrative-decision-appeal/analyze.ts",
    "src/routes/api/workflows/administrative-decision-appeal/draft.ts",
    "src/routes/api/workflows/administrative-decision-appeal/validate.ts",
    "src/routes/api/workflows/denied-claim/analyze.ts",
    "src/routes/api/workflows/denied-claim/draft.ts",
    "src/routes/api/workflows/ssdi-appeal/analyze.ts",
    "src/routes/api/workflows/ssdi-appeal/draft.ts",
    "src/routes/api/workflows/ssdi-appeal/validate.ts",
]

# Pattern: inline control-plane fetch + config parsing
# Matches: const token=...MAILMYPDF_CONTROL_PLANE_TOKEN...const cfg=await ...json()...;if(!...ok||cfg.provider!=="gemini")throw...
# We want to replace this entire block with: const cfg=await resolveAI("<slug>","<task>");
# The block varies slightly per file but the core pattern is:
# - token/base env var setup
# - fetch to control-plane/ai
# - json parse to cfg
# - provider check

def ensure_import(content):
    if CONTROL_PLANE_IMPORT in content:
        return content
    # For minified files, add import at the very beginning
    if content.startswith('import '):
        # Find end of last import (imports are at the start, semicolon-separated)
        # In minified: import {...}from "...";import {...}from "...";...export const Route
        # Add after the last import before "export const Route"
        idx = content.find('export const Route')
        if idx > 0:
            content = content[:idx] + CONTROL_PLANE_IMPORT + ';' + content[idx:]
        else:
            content = CONTROL_PLANE_IMPORT + ';' + content
    else:
        content = CONTROL_PLANE_IMPORT + ';' + content
    return content

def get_slug(filepath):
    parts = filepath.split("/")
    idx = parts.index("workflows")
    return parts[idx + 1]

def replace_inline_control_plane(content, slug):
    """Replace inline control-plane fetch blocks with resolveAI calls."""
    
    # Pattern varies but always contains:
    # 1. MAILMYPDF_CONTROL_PLANE_TOKEN env var check
    # 2. fetch to control-plane/ai with workflowSlug and task
    # 3. json() parse
    # 4. provider === "gemini" check
    
    # Extract the task from the body: task:"analysis" or task:"draft" or task:"validation"
    # and the slug from workflowSlug:"<slug>"
    
    # General approach: find blocks containing "control-plane/ai" and replace them
    
    # Pattern 1: Multi-statement inline (draft/validate routes)
    # const token=...;const base=...;if(!token)...;const c=await fetch(...control-plane/ai...);const cfg=await c.json()...;if(!c.ok||cfg.provider!=="gemini")...;
    # OR: const token=...;const cfgRes=await fetch(...);const cfg=await cfgRes.json()...;if(!cfgRes.ok)...;
    
    # We'll use a flexible regex that matches from "const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN" 
    # or "const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN"
    # through the provider check
    
    # Different patterns:
    # Pattern A: const token=...;...const c=await fetch(...);const cfg=await c.json()...;if(!c.ok||cfg.provider!=="gemini")...;
    # Pattern B: const token=...;...const cfgRes=await fetch(...);const cfg=await cfgRes.json()...;if(!cfgRes.ok)...;
    
    results = []
    
    # Try Pattern A: token/base/fetch/json/provider check
    pattern_a = (
        r'const token=process\.env\.MAILMYPDF_CONTROL_PLANE_TOKEN[^;]*;'
        r'[^}]*'  # anything (but not closing brace)
        r'fetch\([^)]*control-plane/ai[^)]*\)'
        r'[^;]*;'
        r'const \w+=await \w+\.json\(\)[^;]*;'
        r'if\(!\w+\.ok\|\|\w+\.provider!=="gemini"\)[^;]*;'
    )
    
    # Try Pattern B: token/cfgRes
    pattern_b = (
        r'const token=process\.env\.MAILMYPDF_CONTROL_PLANE_TOKEN[^;]*;'
        r'[^}]*'
        r'const cfgRes=await fetch\([^)]*control-plane/ai[^)]*\)'
        r'[^;]*;'
        r'const cfg=await cfgRes\.json\(\)[^;]*;'
        r'if\(!cfgRes\.ok\)[^;]*;'
    )
    
    # Also handle the simpler analyze pattern:
    # const token=...;...fetch(...control-plane/ai...);...const cr=await...json()...;if(!cr.ok||...)...;
    pattern_c = (
        r'const token=process\.env\.MAILMYPDF_CONTROL_PLANE_TOKEN[^;]*;'
        r'[^}]*?'
        r'const cr=await fetch\([^)]*control-plane/ai[^)]*\)[^;]*;'
        r'const cfg=await cr\.json\(\)\.catch\(\(\)=>null\) as any;'
        r'[^;]*;'
    )
    
    # Find what task is being used by looking at the body
    task_match = re.search(r'task:"(analysis|draft|validation)"', content)
    task = task_match.group(1) if task_match else "analysis"
    
    replacement = f'const cfg=await resolveAI("{slug}","{task}");'
    
    for pattern in [pattern_a, pattern_b, pattern_c]:
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        if new_content != content:
            content = new_content
            return content, True
    
    return content, False

def process_file(filepath):
    slug = get_slug(filepath)
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'control-plane/ai' not in content:
        return False, "no control-plane fetch"
    if 'resolveAI' in content:
        return False, "already uses resolveAI"
    
    original = content
    content = ensure_import(content)
    content, replaced = replace_inline_control_plane(content, slug)
    
    if not replaced:
        return False, "pattern not matched"
    
    with open(filepath, 'w') as f:
        f.write(content)
    return True, f"migrated (slug={slug})"

def main():
    migrated = 0
    failed = 0
    for fp in FILES:
        if not os.path.exists(fp):
            print(f"  SKIP: {fp} — not found")
            failed += 1
            continue
        ok, msg = process_file(fp)
        status = "OK" if ok else "SKIP"
        if ok:
            migrated += 1
        else:
            failed += 1
        print(f"  {status}: {fp} — {msg}")
    
    print(f"\nMigrated: {migrated}, Failed: {failed}")
    
    # Check remaining
    remaining = []
    for fp in FILES:
        if os.path.exists(fp):
            with open(fp) as f:
                if 'control-plane/ai' in f.read() and 'resolveAI' not in open(fp).read():
                    remaining.append(fp)
    if remaining:
        print(f"\nSTILL INLINE: {len(remaining)}")
        for fp in remaining:
            print(f"  {fp}")

if __name__ == "__main__":
    main()
