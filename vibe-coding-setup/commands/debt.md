Scan and manage technical debt for this project:

## Step 1: Scan Code
Run: `grep -rn "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v node_modules | grep -v ".next"`

## Step 2: Categorize Results
- **FIXME** or **XXX** → Critical (fix this week)
- **HACK** → High (fix this month)
- **TODO** → Medium (backlog)

## Step 3: Update DEBT.md
Read `.claude/DEBT.md` and update with new findings. Remove items that are fixed.

## Step 4: Output Summary
```
📊 Debt Summary for [project]:
   Critical: X items
   High: Y items
   Medium: Z items

   [Show top 3 critical/high items if any]
```

## Rules
- Don't duplicate existing entries
- Mark fixed items as done
- Keep DEBT.md under 50 lines
- Focus on actionable items only
