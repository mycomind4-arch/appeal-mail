#!/usr/bin/env python3
"""Fix the two checkout files that the bulk script missed."""
import os

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace import
    content = content.replace(
        'import { createAPIFileRoute } from "@tanstack/react-start"',
        'import { createFileRoute } from "@tanstack/react-router"'
    )
    
    # Replace export
    content = content.replace(
        'export const APIRoute = createAPIFileRoute(',
        'export const Route = createFileRoute('
    )
    
    # Wrap handler — handle space after {
    content = content.replace(')({ POST:', ')({server:{handlers:{POST:')
    content = content.replace(')({POST:', ')({server:{handlers:{POST:')
    
    # Close the wrapper — need to add 2 closing braces before the final });
    # The file ends with: ...} }); or ...} } });
    # We need to add 2 more } before the final });
    content = content.rstrip()
    if content.endswith('} });'):
        content = content[:-4] + '} } } });'
    elif content.endswith('} } });'):
        content = content[:-5] + '} } } } });'
    
    # Verify
    assert 'createAPIFileRoute' not in content, f"createAPIFileRoute still in {filepath}"
    assert 'createFileRoute' in content, f"createFileRoute not in {filepath}"
    assert 'server:' in content, f"server: not in {filepath}"
    assert 'handlers:' in content, f"handlers: not in {filepath}"
    assert 'export const Route' in content, f"export Route not in {filepath}"
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"  Fixed: {filepath}")

base = os.path.dirname(os.path.abspath(__file__))
fix_file(os.path.join(base, 'src/routes/api/workflows/license-revocation-appeal/checkout.ts'))
fix_file(os.path.join(base, 'src/routes/api/workflows/ssi-denial/checkout.ts'))
