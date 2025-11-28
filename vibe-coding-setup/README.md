# Vibe Coding Setup

My personal Claude Code configuration for ultra-fast AI-assisted development.

## What is Vibe Coding?

Vibe coding is a workflow where you:
1. **Start fast** - One command to jump into any project with full context
2. **Stay focused** - Always know your current task
3. **Ship daily** - Commit, push, deploy in one command
4. **Auto-verify** - Visual regression testing catches UI breaks

## Quick Start

```bash
# Jump into a project (runs /warmup automatically)
resto          # Restaurant OS
salvator       # Salvator website
hoettche       # Em Höttche website
printulu       # Printulu Vendure
invoices       # Invoice Splitter

# Or quick variants (skip warmup)
resto-q        # Just show current task
```

## Core Commands

| Command | What it does |
|---------|--------------|
| `/warmup` | Load project context, show task, git status |
| `/quick` | Minimal - just current task |
| `/next [task]` | Set new task |
| `/next done` | Mark done, promote next |
| `/ship` | Stage + commit + push |
| `/check-design` | Visual regression test |
| `/session-end` | Extract insights before /clear |

## File Structure

```
~/.claude/
├── CLAUDE.md           # Your coding DNA (global rules)
├── commands/           # Slash commands
│   ├── warmup.md
│   ├── ship.md
│   ├── quick.md
│   └── ...
└── baselines/          # Visual regression screenshots

~/.bash_aliases         # Terminal shortcuts
```

## Project Memory Structure

Each project has `.claude/` folder with:
- `CLAUDE.md` - Project-specific context
- `NEXT.md` - Current task + queue
- `DEBT.md` - Technical debt tracking
- `decisions/` - Architecture Decision Records

## Installation

```bash
# Copy to your ~/.claude/
cp -r commands/* ~/.claude/commands/
cp CLAUDE.md ~/.claude/CLAUDE.md
cat bash_aliases >> ~/.bash_aliases
source ~/.bash_aliases
```

## MCP Servers Used

- **notion** - Project management sync
- **chrome-devtools** - Browser automation, screenshots
- **serper** - Web search for debugging
- **github** - PR/issue management
- **youtube** - Video transcript extraction

## The Flow

```
resto                     # Jump in + warmup
/next [task]              # Set focus
[code with Claude]        # Build
/ship                     # Commit + push + deploy
/check-design             # Visual verification
/session-end              # Extract learnings
```

## Learn More

See [VIBE-CODING-GUIDE.md](./VIBE-CODING-GUIDE.md) for the complete guide.

---

*Last updated: November 2025*
