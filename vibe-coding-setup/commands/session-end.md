Before ending this session, extract and preserve valuable insights:

## 1. Knowledge Check
Did you discover any patterns, gotchas, or insights during this session?
- If YES → Add to `.claude/CLAUDE.md` under appropriate section
- Common additions: Gotchas, Stack quirks, Commands

## 2. Architecture Decisions
Did you make any significant technical decisions?
- If YES → Run `/adr` to create a decision record
- Examples: New library choice, API design, data model change

## 3. Technical Debt
Did you find any bugs, TODOs, or shortcuts?
- If YES → Add to `.claude/DEBT.md` in appropriate category
- Or run `/debt` to scan the codebase

## 4. Task Status
Update `.claude/NEXT.md`:
- Mark completed tasks as `[x]`
- Add any new tasks discovered
- Ensure "Now" has the next priority item

## 5. Output Checklist
```
✅ Session close checklist:
   [x] Knowledge captured → CLAUDE.md
   [x] Decisions recorded → ADRs
   [x] Debt tracked → DEBT.md
   [x] Tasks updated → NEXT.md

🧹 Safe to /clear. Nothing valuable lost.
```

## Quick Mode
If session was short/trivial, just confirm:
- "Nothing significant to capture. Safe to /clear."
