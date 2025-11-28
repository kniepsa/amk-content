# Daily Standup

Quick standup summary: yesterday, today, blockers.

## Instructions

1. **What I did yesterday** - Get from git log:
   ```bash
   git log --since="yesterday" --until="today" --oneline --author="$(git config user.name)" 2>/dev/null || git log -5 --oneline
   ```

2. **What I'm doing today** - Read from `.claude/NEXT.md`:
   - NOW task = today's focus
   - UP NEXT = upcoming work

3. **Blockers** - Check `.claude/DEBT.md` for critical items:
   - Look for items marked [critical] or [blocking]
   - If none, report "No blockers"

## Output Format

```
STANDUP - [project name] - [date]

YESTERDAY:
- [commit message 1]
- [commit message 2]
- [commit message 3]

TODAY:
NOW: [current task from NEXT.md]

BLOCKERS:
- [critical debt items, or "None"]
```

Keep it brief. This is a quick status check, not a detailed report.
