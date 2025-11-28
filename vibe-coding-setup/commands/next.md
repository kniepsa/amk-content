Manage NEXT.md actions:

**If no argument provided**, show current NEXT.md status.

**If argument provided**, update NEXT.md:

1. Read current `.claude/NEXT.md`

2. Parse the action:
   - "done" or "complete" → Check off current "Now" item, promote first "Up Next" to "Now"
   - "add [task]" → Add to "Up Next" list (max 2 items in Up Next)
   - "[task description]" → Set as new "Now" (move old Now to Up Next)

3. Rules:
   - Max 1 item in "Now"
   - Max 2 items in "Up Next"
   - If adding would exceed, ask which to remove
   - Auto-prune completed items

4. Write updated NEXT.md

5. Confirm: "✓ Now: [task]"

Example usage:
- `/next` - Show current status
- `/next done` - Complete current task
- `/next Fix auth bug` - Set as current focus
- `/next add Write tests` - Add to up next
