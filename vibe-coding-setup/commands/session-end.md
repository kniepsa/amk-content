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

## 5. BMM Retrospective Trigger

If `docs/sprint-status.yaml` exists:
1. Check if current epic is complete (all stories `completed`)
2. If epic complete → Suggest invoking SM agent for retrospective:
   - `/bmad:bmm:agents:sm` then "Run retrospective"
   - Captures: velocity, coverage, debt metrics
   - Updates: project-context.md with learnings

Display epic status:
```
🔷 BMM Epic Status: [epic-name]
   Completed: [X/Y] stories
   [Epic complete! Consider running retrospective]
```

## 6. Content Ideas (for tech-savvy entrepreneurs)
Was there anything interesting that could become content?
- Strategy sessions or pivots
- Tool discoveries or workflow improvements
- Go-to-market insights
- Architecture decisions with business impact
- Vibe coding tips and productivity hacks

If YES → Append to `~/projects/amk-content/articles/ideas.md`:
```markdown
## [Date] - [One-line title]
**Category**: [Strategy | Tools | Architecture | Vibe Coding | GTM]
**Hook**: [Why would an entrepreneur care?]
**Key points**:
- Point 1
- Point 2
**Presentation potential**: [Yes/No]
```

## 7. Output Checklist
```
Session close checklist:
   [x] Knowledge captured → CLAUDE.md
   [x] Decisions recorded → ADRs
   [x] Debt tracked → DEBT.md
   [x] Tasks updated → NEXT.md
   [x] Epic status checked → sprint-status.yaml
   [x] Content ideas → amk-content/articles/ideas.md

Safe to /clear. Nothing valuable lost.
```

## Quick Mode
If session was short/trivial, just confirm:
- "Nothing significant to capture. Safe to /clear."

## TTS Momentum Marker

After completing the session-end checklist, speak confirmation:
```bash
.claude/hooks/play-tts.sh "Session complete."
```

If epic was completed:
```bash
.claude/hooks/play-tts.sh "Epic complete. Great work."
```

Keep messages minimal for low verbosity mode.
