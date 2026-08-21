#!/usr/bin/env python3
"""Migrate checkout.ts files from createAPIFileRoute to createFileRoute + server.handlers"""
import os
import re
import sys

def migrate_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # 1. Replace import: createAPIFileRoute from @tanstack/react-start → createFileRoute from @tanstack/react-router
    # Handle both spaced and minified import styles
    content = content.replace(
        'import { createAPIFileRoute } from "@tanstack/react-start"',
        'import { createFileRoute } from "@tanstack/react-router"'
    )
    content = content.replace(
        'import{createAPIFileRoute}from"@tanstack/react-start"',
        'import{createFileRoute}from"@tanstack/react-router"'
    )
    # Handle cases with spaces inside braces
    content = re.sub(
        r'import\s*\{\s*createAPIFileRoute\s*\}\s*from\s*"@tanstack/react-start"',
        'import { createFileRoute } from "@tanstack/react-router"',
        content
    )
    # Handle combined import lines: import { createAPIFileRoute } from "...";import { ... } from "..."
    content = re.sub(
        r'import\s*\{\s*createAPIFileRoute\s*\}\s*from\s*"@tanstack/react-start"\s*;\s*import',
        'import { createFileRoute } from "@tanstack/react-router";import',
        content
    )
    
    # 2. Replace export const APIRoute=createAPIFileRoute → export const Route=createFileRoute
    content = content.replace(
        'export const APIRoute = createAPIFileRoute(',
        'export const Route = createFileRoute('
    )
    content = content.replace(
        'export const APIRoute=createAPIFileRoute(',
        'export const Route=createFileRoute('
    )
    
    # 3. Wrap handler in server: { handlers: { ... } }
    # Pattern: createFileRoute("...")({POST: → createFileRoute("...")({server:{handlers:{POST:
    # Handle minified: )({POST:
    content = re.sub(
        r'\)\(\{POST:',
        ')({server:{handlers:{POST:',
        content
    )
    # Handle formatted: )({\n  POST: or )({\n    POST:
    content = re.sub(
        r'\)\(\{\s*\n\s*POST:',
        lambda m: ')({\n  server: {\n    handlers: {\n      POST:',
        content
    )
    
    # 4. Close the server.handlers wrapper
    # For minified files: the closing is }})} at the end
    # We need to add }} before the final ) 
    # Pattern: the route definition ends with }}} or }}); or similar
    # We need to find the closing of the createFileRoute call and add 2 more closing braces
    
    # For minified files: replace the final }}}) with }}}}})  (add 2 } for handlers and server)
    # But we need to be careful to only match the RIGHT closing braces
    
    # Strategy: find the last occurrence of the route closing pattern
    # In minified: ...}}}); or ...}})}
    # In formatted: ...  },\n}); or ...  }\n});
    
    # Let's use a different approach: count the opening braces after createFileRoute("...")({
    # and ensure we add 2 closing braces
    
    # Actually, the simplest approach: the file ends with the route definition
    # The closing pattern is: }}); or }})  (possibly with whitespace)
    # We need to add 2 } before the last ) 
    
    # For formatted files ending with:
    #   },
    # });
    # We need:
    #   },
    #     },
    #   },
    # });
    
    # For minified files ending with:
    # }}});
    # We need:
    # }}}}});
    
    # Let's detect the file style and handle accordingly
    
    # Check if minified (single or very few lines)
    lines = content.split('\n')
    if len(lines) <= 3:  # Minified or nearly so
        # For minified, the closing is }}}); or }})} 
        # Add two } before the final );
        # Pattern: }}(or more) followed by ); at end
        content = re.sub(
            r'\}\}\}\);?\s*$',
            lambda m: '}}' + m.group(0),
            content
        )
    else:
        # For formatted files, we need to find the end of the POST handler
        # and add closing braces for handlers and server
        # The typical ending is:
        #   },
        # });
        # We need to change to:
        #   },
        #     },
        #   },
        # });
        
        # Find the pattern at the end:  },\n}); or  }\n});
        # Add two closing brace lines before the final });
        content = re.sub(
            r'(  \},\n\}\);)\s*$',
            '  },\n    },\n  },\n});\n',
            content
        )
        # Also handle:  }\n});
        content = re.sub(
            r'(  \}\n\}\);)\s*$',
            '  }\n    },\n  },\n});\n',
            content
        )
    
    # Verify no createAPIFileRoute remains
    if 'createAPIFileRoute' in content:
        print(f"WARNING: createAPIFileRoute still present in {filepath}")
        return False
    
    # Verify createFileRoute is present
    if 'createFileRoute' not in content:
        print(f"ERROR: createFileRoute not found in {filepath}")
        return False
    
    # Verify Route export is present
    if 'export const Route' not in content:
        print(f"ERROR: export const Route not found in {filepath}")
        return False
    
    # Verify server.handlers pattern
    if 'server:' not in content or 'handlers:' not in content:
        print(f"ERROR: server.handlers not found in {filepath}")
        return False
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    else:
        print(f"WARNING: No changes made to {filepath}")
        return False

# Find all checkout.ts files
base = os.path.dirname(os.path.abspath(__file__))
checkout_dir = os.path.join(base, 'src/routes/api/workflows')
count = 0
errors = 0

for workflow_dir in sorted(os.listdir(checkout_dir)):
    checkout_file = os.path.join(checkout_dir, workflow_dir, 'checkout.ts')
    if os.path.isfile(checkout_file):
        try:
            if migrate_file(checkout_file):
                count += 1
                print(f"  ✓ {workflow_dir}/checkout.ts")
            else:
                errors += 1
        except Exception as e:
            print(f"  ✗ {workflow_dir}/checkout.ts: {e}")
            errors += 1

print(f"\nMigrated: {count}, Errors: {errors}")
