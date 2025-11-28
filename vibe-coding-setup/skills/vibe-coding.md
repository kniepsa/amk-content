---
description: Vibe coding workflow patterns - memory system, commands, session management
globs:
  - "**/.claude/CLAUDE.md"
  - "**/.claude/NEXT.md"
  - "**/.claude/DEBT.md"
alwaysApply: false
---

# Vibe Coding Patterns

## Memory System
Every project has a `.claude/` folder with:
- `CLAUDE.md` - Project context, stack, invariants, gotchas
- `NEXT.md` - Task list (Now/Next/Later/Done)
- `DEBT.md` - Technical debt tracker

## Session Flow
1. `/warmup` - Load context, show current task
2. Work on tasks from NEXT.md
3. `/session-end` - Capture learnings, update memory files

## Key Commands
- `/warmup` - Start session with full context
- `/quick` - Skip warmup, show current task only
- `/ship` - Commit and deploy
- `/next` - Update current task focus
- `/debug` - Systematic debugging protocol
- `/strategy` - Multi-persona strategic analysis
- `/session-end` - Capture insights before ending

## Notion Integration
- Check project CLAUDE.md for `notion_rock_id`
- Update rocks every 15-20 minutes
- Create tasks linked to rocks

## Best Practices
- Always read CLAUDE.md before making changes
- Update NEXT.md as tasks complete
- Capture gotchas in CLAUDE.md
- Use conventional commits
