#!/usr/bin/env python3
"""Phase 2: Fix remaining resolveGemini references (single-line functions + no-arg calls)."""
import re, os

ROUTES_DIR = "src/routes/api/workflows"
CONTROL_PLANE_IMPORT = 'import { resolveAI } from "@/platform/control-plane-ai";'

def get_slug(filepath):
    parts = filepath.split("/")
    idx = parts.index("workflows")
    return parts[idx + 1]

def get_route_type(filepath):
    if filepath.endswith("analyze.ts"):
        return "analyze"
    elif filepath.endswith("draft.ts"):
        return "draft"
    elif filepath.endswith("validate.ts"):
        return "validate"
    return "unknown"

def remove_single_line_resolve_gemini(content):
    """Remove single-line: async function resolveGemini(...){...everything on one line...}"""
    # Match entire line that starts with "async function resolveGemini"
    lines = content.split('\n')
    result = []
    for line in lines:
        if line.lstrip().startswith('async function resolveGemini'):
            # Skip this entire line (the whole function is on one line)
            continue
        result.append(line)
    return '\n'.join(result)

def remove_multi_line_resolve_gemini(content):
    """Remove multi-line function blocks that weren't caught by phase 1."""
    # Pattern: line starting with "async function resolveGemini" through a line that is just "}"
    pattern = r'\nasync function resolveGemini\b[^\n]*\n(.*?\n)*?\}\n'
    content = re.sub(pattern, '\n', content, flags=re.DOTALL)
    # Also handle case where it ends with "} " followed by newline (not just "}")
    pattern2 = r'\nasync function resolveGemini\b[^\n]*\n(.*?\n)*?\}\s*\n'
    content = re.sub(pattern2, '\n', content, flags=re.DOTALL)
    return content

def ensure_import(content):
    if CONTROL_PLANE_IMPORT in content:
        return content
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

def replace_calls(content, slug, route_type):
    # Replace resolveGemini("analysis") -> resolveAI(slug, "analysis")
    content = re.sub(
        r'resolveGemini\("analysis"\)',
        f'resolveAI("{slug}", "analysis")',
        content
    )
    # Replace resolveGemini("draft") -> resolveAI(slug, "draft")
    content = re.sub(
        r'resolveGemini\("draft"\)',
        f'resolveAI("{slug}", "draft")',
        content
    )
    # Replace resolveGemini("validation") -> resolveAI(slug, "validation")
    content = re.sub(
        r'resolveGemini\("validation"\)',
        f'resolveAI("{slug}", "validation")',
        content
    )
    # Replace resolveGemini() (no args) — infer task from route type
    if route_type == "analyze":
        content = re.sub(
            r'resolveGemini\(\)',
            f'resolveAI("{slug}", "analysis")',
            content
        )
    elif route_type == "draft":
        # For draft routes, resolveGemini() with no args usually means "draft"
        # But there might be separate calls for draft and validation
        # Check the variable name for context
        content = re.sub(
            r'resolveGemini\(\)',
            f'resolveAI("{slug}", "draft")',
            content
        )
    
    # Handle $workflowId dynamic slug
    if slug == "$workflowId":
        content = re.sub(
            r'resolveGemini\("analysis"\)',
            'resolveAI(params.workflowId, "analysis")',
            content
        )
        content = re.sub(
            r'resolveGemini\("draft"\)',
            'resolveAI(params.workflowId, "draft")',
            content
        )
        content = re.sub(
            r'resolveGemini\("validation"\)',
            'resolveAI(params.workflowId, "validation")',
            content
        )
        content = re.sub(
            r'resolveGemini\(\)',
            'resolveAI(params.workflowId, "analysis")',
            content
        )
    
    return content

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'resolveGemini' not in content:
        return False, "no resolveGemini"
    
    slug = get_slug(filepath)
    route_type = get_route_type(filepath)
    original = content
    
    content = remove_single_line_resolve_gemini(content)
    content = remove_multi_line_resolve_gemini(content)
    content = ensure_import(content)
    content = replace_calls(content, slug, route_type)
    
    if content == original:
        return False, "no changes"
    
    with open(filepath, 'w') as f:
        f.write(content)
    return True, f"fixed (slug={slug}, type={route_type})"

def main():
    files = []
    for root, dirs, filenames in os.walk(ROUTES_DIR):
        for fn in filenames:
            if fn.endswith('.ts'):
                fp = os.path.join(root, fn)
                with open(fp) as f:
                    if 'resolveGemini' in f.read():
                        files.append(fp)
    
    files.sort()
    migrated = 0
    for fp in files:
        ok, msg = process_file(fp)
        status = "OK" if ok else "SKIP"
        if ok:
            migrated += 1
        print(f"  {status}: {fp} — {msg}")
    
    print(f"\nFixed: {migrated}")
    
    # Verify no remaining references
    remaining = []
    for root, dirs, filenames in os.walk(ROUTES_DIR):
        for fn in filenames:
            if fn.endswith('.ts'):
                fp = os.path.join(root, fn)
                with open(fp) as f:
                    if 'resolveGemini' in f.read():
                        remaining.append(fp)
    if remaining:
        print(f"\nSTILL HAS resolveGemini ({len(remaining)}):")
        for fp in remaining:
            print(f"  {fp}")
    else:
        print("\nAll resolveGemini references removed!")

if __name__ == "__main__":
    main()
