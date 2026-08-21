#!/usr/bin/env python3
"""Fix closing braces for all checkout files that got the opening wrapper but not the closing."""
import os
import re

def fix_closing(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Only fix if server:{handlers:{ is present but the closing is wrong
    if 'server:{handlers:{' not in content:
        print(f"  SKIP (no wrapper): {filepath}")
        return False
    
    # The file should end with: }}}}});  (6 closing braces + );)
    # If it ends with }}});  (3 closing braces + );), we need to add 2 more }
    
    stripped = content.rstrip()
    if stripped.endswith('}}}}});'):
        print(f"  OK (already fixed): {filepath}")
        return False
    elif stripped.endswith('}}});'):
        # Need to add 2 more } before the final });
        content = stripped[:-4] + '}}}' + '});'
        # Wait, that's wrong. Let me think again.
        # Current: }}}...); 
        # We need: }}}}}}...);
        # Current ending: }}}...);  -> 3 } + )
        # Need: }}}}}}...); -> 5 } + )  
        # Actually: the ending is }}}...);  -> } (catch) + } (handler) + } (options) + ) (call) + ;
        # We need: } (catch) + } (handler) + } (handlers) + } (server) + } (options) + ) (call) + ;
        # So: }}}}}...);  -> 5 } + ) + ;
        # Current: }}}...); -> 3 } + ) + ;
        # Add 2 more }
        content = stripped[:-3] + '}}}' + '});'
        # Hmm, that's: stripped[:-3] removes "});", then adds "}}}" + "});" = "}}}}});"
        # Wait no. stripped[:-3] removes the last 3 chars which are "});"... no.
        # "}}});" has 5 chars. stripped[:-3] removes last 3 chars ("});"), leaving "}}" 
        # Then we add "}}}" + "});" = "}}}" + "});" 
        # Total: "}}" + "}}}" + "});" = "}}}}}});"
        # That's 6 } which is wrong.
        
        # Let me be more careful.
        # "}}});" = } } } ) ;
        # We need: } } } } } ) ; = "}}}}});"  (5 } + );)
        # Current has 3 }. Need 5 }. Add 2 more.
        # Replace "}}});" with "}}}}});"
        content = stripped[:-5] + '}}}}});'
        # stripped[:-5] removes "}}});" (5 chars), leaving the content before it
        # Then we add "}}}}});" (5 } + );)
        
        with open(filepath, 'w') as f:
            f.write(content + '\n')
        print(f"  FIXED: {filepath}")
        return True
    elif stripped.endswith('} } });'):
        # Formatted variant with spaces
        content = stripped[:-5] + '} } } } });'
        with open(filepath, 'w') as f:
            f.write(content + '\n')
        print(f"  FIXED (spaced): {filepath}")
        return True
    else:
        # Try to find the ending pattern more flexibly
        # Match: } followed by } followed by } followed by ); at end
        match = re.search(r'(\}+\s*\}+\s*\}+\s*\)\s*;?\s*)$', content)
        if match:
            ending = match.group(1)
            # Count the } in the ending
            brace_count = ending.count('}')
            if brace_count == 3:
                # Need 5, add 2 more
                new_ending = ending.replace('}', '}}' + '}', 1)  # Replace first } with }}}
                # Actually this is getting too complex. Let me just do it directly.
                pass
            print(f"  MANUAL CHECK NEEDED: {filepath} (ends with: {ending[-20:]})")
            return False
        else:
            print(f"  UNKNOWN ENDING: {filepath} (last 30 chars: {content[-30:]})")
            return False

base = os.path.dirname(os.path.abspath(__file__))
checkout_dir = os.path.join(base, 'src/routes/api/workflows')

count = 0
for workflow_dir in sorted(os.listdir(checkout_dir)):
    checkout_file = os.path.join(checkout_dir, workflow_dir, 'checkout.ts')
    if os.path.isfile(checkout_file):
        if fix_closing(checkout_file):
            count += 1

print(f"\nFixed: {count}")
