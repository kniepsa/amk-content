---
description: Extract patterns from recent work to improve workflow
---

# Learn - Extract Patterns

## What This Does

Analyze recent sessions to identify patterns and update CLAUDE.md with learnings.

## Execution Steps

### Step 1: Analyze Session Patterns

```
Review last 5-10 sessions (conversation history)
Extract:
- Most used commands (frequency)
- Commands never used (candidates for deletion)
- Recurring gotchas (add to CLAUDE.md)
- Successful workflows (document pattern)
- Failed approaches (what didn't work)
```

### Step 2: Scan Technical Debt

```
Read current project DEBT.md
Identify patterns:
- Same type of issue recurring? (systemic problem)
- Old debt never addressed? (not important, delete)
- Clusters by category? (need better tooling)
```

### Step 3: Update CLAUDE.md

```
Add new gotchas discovered
Update workflow patterns
Remove stale gotchas (if resolved)
```

### Step 4: Summary

```
✓ Patterns found: X
✓ Gotchas added: Y
✓ CLAUDE.md updated
```

## Example Output

```
/learn

Analyzing last 10 sessions...
✓ Commands used: /warmup (10x), /next (8x), /ship (5x)
✓ Never used: /standup (candidate for deletion?)
✓ Recurring gotcha: "Supabase RLS requires .select() after .insert()"

Updated CLAUDE.md:
+ Added gotcha: RLS select pattern
+ Updated workflow: warmup → next → ship

Summary: 3 patterns found, 1 gotcha added
```
