#!/usr/bin/env python3
"""Migrate workflow AI routes from inline resolveGemini to shared resolveAI."""
import re, os, sys

ROUTES_DIR = "src/routes/api/workflows"
CONTROL_PLANE_IMPORT = 'import { resolveAI } from "@/platform/control-plane-ai";'

def get_slug(filepath):
    """Extract workflow slug from path like src/routes/api/workflows/insurance-claim-denial/analyze.ts"""
    parts = filepath.split("/")
    # workflows/<slug>/<file>.ts
    idx = parts.index("workflows")
    return parts[idx + 1]

def remove_resolve_gemini(content):
    """Remove the async function resolveGemini(...) { ... } block."""
    # Match: async function resolveGemini(...) { ... }
    # The function body ends with a closing brace at column 0
    pattern = r'\nasync function resolveGemini\([^)]*\)\s*\{[^}]*\{[^}]*\}[^}]*\}\n'
    # More robust: match from "async function resolveGemini" to the closing "}\n" at column 0
    pattern = r'\nasync function resolveGemini\b.*?\n\}\n'
    content = re.sub(pattern, '\n', content, flags=re.DOTALL)
    return content

def add_import(content):
    """Add the resolveAI import after the last existing import."""
    if CONTROL_PLANE_IMPORT in content:
        return content
    # Find all import lines and add after the last one
    lines = content.split('\n')
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i
    if last_import_idx >= 0:
        lines.insert(last_import_idx + 1, CONTROL_PLANE_IMPORT)
        content = '\n'.join(lines)
    else:
        content = CONTROL_PLANE_IMPORT + '\n' + content
    return content

def replace_calls(content, slug):
    """Replace resolveGemini(...) calls with resolveAI(slug, ...)."""
    if slug == "$workflowId":
        # For generic route, use params.workflowId or a dynamic slug
        # Check how it's used in the file
        content = re.sub(
            r'await resolveGemini\("(analysis|draft|validation)"\)',
            r'await resolveAI(params.workflowId, "\1")',
            content
        )
    else:
        content = re.sub(
            r'await resolveGemini\("(analysis|draft|validation)"\)',
            f'await resolveAI("{slug}", "\\1")',
            content
        )
    # Also handle non-await calls (assigned to const/let)
    if slug == "$workflowId":
        content = re.sub(
            r'(?<!await )resolveGemini\("(analysis|draft|validation)"\)',
            r'await resolveAI(params.workflowId, "\1")',
            content
        )
    else:
        content = re.sub(
            r'(?<!await )resolveGemini\("(analysis|draft|validation)"\)',
            f'await resolveAI("{slug}", "\\1")',
            content
        )
    return content

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'async function resolveGemini' not in content:
        return False, "no resolveGemini function"
    
    slug = get_slug(filepath)
    original = content
    
    content = remove_resolve_gemini(content)
    content = add_import(content)
    content = replace_calls(content, slug)
    
    if content == original:
        return False, "no changes made"
    
    with open(filepath, 'w') as f:
        f.write(content)
    return True, f"migrated (slug={slug})"

def main():
    files = []
    for root, dirs, filenames in os.walk(ROUTES_DIR):
        for fn in filenames:
            if fn.endswith('.ts'):
                fp = os.path.join(root, fn)
                with open(fp) as f:
                    if 'async function resolveGemini' in f.read():
                        files.append(fp)
    
    files.sort()
    migrated = 0
    failed = 0
    for fp in files:
        ok, msg = process_file(fp)
        status = "OK" if ok else "SKIP"
        if ok:
            migrated += 1
        else:
            failed += 1
        print(f"  {status}: {fp} — {msg}")
    
    print(f"\nMigrated: {migrated}, Skipped: {failed}")

if __name__ == "__main__":
    main()
