#!/usr/bin/env python3
"""Phase 3b: Targeted migration of inline control-plane fetches."""
import re, os

CONTROL_PLANE_IMPORT = 'import { resolveAI } from "@/platform/control-plane-ai";'

def ensure_import(content):
    if CONTROL_PLANE_IMPORT in content:
        return content
    # For minified files starting with import, insert before "export const Route"
    idx = content.find('export const Route')
    if idx > 0:
        content = content[:idx] + CONTROL_PLANE_IMPORT + ';' + content[idx:]
    else:
        # Try to add after last import line
        lines = content.split('\n')
        last_import = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                last_import = i
        if last_import >= 0:
            lines.insert(last_import + 1, CONTROL_PLANE_IMPORT)
            content = '\n'.join(lines)
        else:
            content = CONTROL_PLANE_IMPORT + '\n' + content
    return content

def get_slug(filepath):
    parts = filepath.split("/")
    return parts[parts.index("workflows") + 1]

def extract_task(content):
    m = re.search(r'task:"(analysis|draft|validation)"', content)
    if m:
        return m.group(1)
    m = re.search(r'task:\s*"(analysis|draft|validation)"', content)
    return m.group(1) if m else "analysis"

def migrate_minified(content, slug):
    """Handle administrative-decision-appeal style (single-line minified)."""
    task = extract_task(content)
    replacement = f'const cfg=await resolveAI("{slug}","{task}");'
    
    # Pattern: const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN,base=...;if(!token)...;const [cr|c]=await fetch(...control-plane/ai...);const cfg=await [cr|c].json()...;if(![cr|c].ok||cfg.provider!=="gemini")...;
    # This spans a portion of a single line
    
    # Find the start: const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN
    # Find the end: after the provider check semicolon
    
    start_marker = 'const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN'
    start = content.find(start_marker)
    if start == -1:
        return content, False
    
    # Find the end: the first semicolon after 'gemini' that comes after the control-plane fetch
    cp_idx = content.find('control-plane/ai', start)
    if cp_idx == -1:
        return content, False
    
    # Find 'gemini' after the control-plane fetch
    gemini_idx = content.find('gemini', cp_idx)
    if gemini_idx == -1:
        return content, False
    
    # Find the next semicolon after gemini
    end = content.find(';', gemini_idx) + 1
    if end == 0:
        return content, False
    
    old_block = content[start:end]
    content = content[:start] + replacement + content[end:]
    return content, True

def migrate_ssdi(content, slug):
    """Handle ssdi-appeal style (mixed, uses cfgRes variable)."""
    task = extract_task(content)
    replacement = f'const cfg=await resolveAI("{slug}","{task}");'
    
    # Pattern: const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;...const base=...;if(!token)...;const cfgRes=await fetch(...);const cfg=await cfgRes.json()...;if(!cfgRes.ok)...;if(cfg.provider!=="gemini")...;
    
    start_marker = 'const token=process.env.MAILMYPDF_CONTROL_PLANE_TOKEN'
    start = content.find(start_marker)
    if start == -1:
        # Try with space: const token = process.env...
        start_marker = 'const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN'
        start = content.find(start_marker)
    if start == -1:
        return content, False
    
    cp_idx = content.find('control-plane/ai', start)
    if cp_idx == -1:
        return content, False
    
    gemini_idx = content.find('gemini', cp_idx)
    if gemini_idx == -1:
        return content, False
    
    end = content.find(';', gemini_idx) + 1
    if end == 0:
        return content, False
    
    old_block = content[start:end]
    content = content[:start] + replacement + content[end:]
    return content, True

def migrate_denied_claim(content, slug):
    """Handle denied-claim style (multi-line with resolveProvider function)."""
    
    # First, remove the resolveProvider function (if it exists)
    # Pattern: async function resolveProvider(...)\n{ ... }\n
    resolve_provider_pattern = r'\nasync function resolveProvider\b.*?\n\}\n'
    content = re.sub(resolve_provider_pattern, '\n', content, flags=re.DOTALL)
    
    # Also remove any ProviderConfig type/interface if only used by resolveProvider
    # (skip for now — it's just an unused type, not a build blocker)
    
    # Replace resolveProvider("analysis") -> resolveAI("denied-claim", "analysis")
    content = re.sub(
        r'await resolveProvider\("analysis"\)',
        f'await resolveAI("{slug}", "analysis")',
        content
    )
    content = re.sub(
        r'await resolveProvider\("draft"\)',
        f'await resolveAI("{slug}", "draft")',
        content
    )
    content = re.sub(
        r'await resolveProvider\("validation"\)',
        f'await resolveAI("{slug}", "validation")',
        content
    )
    # Also handle non-await calls
    content = re.sub(
        r'resolveProvider\("analysis"\)',
        f'await resolveAI("{slug}", "analysis")',
        content
    )
    content = re.sub(
        r'resolveProvider\("draft"\)',
        f'await resolveAI("{slug}", "draft")',
        content
    )
    
    return content, True

def process_file(filepath):
    slug = get_slug(filepath)
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'control-plane/ai' not in content and 'resolveProvider' not in content:
        return False, "no inline control-plane"
    if 'resolveAI' in content and 'control-plane/ai' not in content:
        return False, "already migrated"
    
    original = content
    content = ensure_import(content)
    
    if slug == 'denied-claim':
        content, _ = migrate_denied_claim(content, slug)
    elif slug == 'ssdi-appeal':
        content, ok = migrate_ssdi(content, slug)
        if not ok:
            content, ok = migrate_minified(content, slug)
    else:
        content, ok = migrate_minified(content, slug)
    
    if content == original:
        return False, "no changes"
    
    with open(filepath, 'w') as f:
        f.write(content)
    return True, f"migrated (slug={slug})"

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

def main():
    migrated = 0
    for fp in FILES:
        if not os.path.exists(fp):
            print(f"  SKIP: {fp} — not found")
            continue
        ok, msg = process_file(fp)
        print(f"  {'OK' if ok else 'SKIP'}: {fp} — {msg}")
        if ok:
            migrated += 1
    
    print(f"\nMigrated: {migrated}")
    
    # Verify
    remaining = []
    for fp in FILES:
        if os.path.exists(fp):
            with open(fp) as f:
                c = f.read()
                if 'control-plane/ai' in c:
                    remaining.append(fp)
    if remaining:
        print(f"\nSTILL HAS inline control-plane: {len(remaining)}")
        for fp in remaining:
            print(f"  {fp}")
    else:
        print("\nAll inline control-plane fetches removed!")

if __name__ == "__main__":
    main()
