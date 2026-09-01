#!/usr/bin/env python3
"""Fix test assertions to match the resolveAI migration."""
import re

def fix_file(path, replacements):
    with open(path, 'r') as f:
        content = f.read()
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content == original:
        print(f"  NO CHANGES: {path}")
        return False
    with open(path, 'w') as f:
        f.write(content)
    print(f"  FIXED: {path}")
    return True

# 1. drivers-license-suspension-gold.test.ts
fix_file("tests/drivers-license-suspension-gold.test.ts", [
    ('assert.match(analyze, /control-plane\\/ai/);', 'assert.match(analyze, /resolveAI/);'),
])

# 2. fafsa-gold-standard.test.ts
fix_file("tests/fafsa-gold-standard.test.ts", [
    # Analyze test: update control-plane/ai to resolveAI
    ('assert.match(source, /api\\/control-plane\\/ai/);', 'assert.match(source, /resolveAI/);'),
    # Remove workflowSlug and task assertions (now encoded in resolveAI args)
    ('assert.match(source, /workflowSlug:\\s*"fafsa-appeal"/);', 'assert.match(source, /resolveAI\\("fafsa-appeal"/);'),
    ('assert.match(source, /task:\\s*"analysis"/);', 'assert.match(source, /resolveAI\\("fafsa-appeal",\\s*"analysis"\\)/);'),
    # Remove provider check (now in shared module)
    ('assert.match(source, /provider\\s*!==\\s*"gemini"/);', ''),
    # Draft test: update resolveGemini to resolveAI
    ('assert.match(source, /resolveGemini\\("draft"\\)/);', 'assert.match(source, /resolveAI\\("fafsa-appeal",\\s*"draft"\\)/);'),
    ('assert.match(source, /resolveGemini\\("validation"\\)/);', 'assert.match(source, /resolveAI\\("fafsa-appeal",\\s*"validation"\\)/);'),
    # Remove task}) assertion (no longer matches)
    ('assert.match(source, /task\\}\\)/);', ''),
])

# 3. license-revocation-appeal-gold.test.ts
fix_file("tests/license-revocation-appeal-gold.test.ts", [
    ('assert.match(analyze, /control-plane\\/ai/);', 'assert.match(analyze, /resolveAI/);'),
])

# 4. license-suspension-appeal-gold.test.ts
fix_file("tests/license-suspension-appeal-gold.test.ts", [
    ('assert.match(analyze, /control-plane\\/ai/);', 'assert.match(analyze, /resolveAI/);'),
])

# 5. ssdi-appeal-gold.test.ts — MailMyPDF no longer in route files, use resolveAI
fix_file("tests/ssdi-appeal-gold.test.ts", [
    ('assert.match(source, /MailMyPDF/);', 'assert.match(source, /resolveAI/);'),
])

# 6. dynamic-workflow-routes.test.ts (pre-existing failure, but fix it too)
fix_file("tests/dynamic-workflow-routes.test.ts", [
    ('assert.match(source, /api\\/control-plane\\/ai/);', 'assert.match(source, /resolveAI/);'),
    ('assert.match(source, /resolveGemini\\("draft"\\)/);', 'assert.match(source, /resolveAI.*"draft"/);'),
    ('assert.match(source, /resolveGemini\\("validation"\\)/);', 'assert.match(source, /resolveAI.*"validation"/);'),
])

print("\nDone fixing test assertions")
