# Vibe Coding Guide

## Quick Start - Project Shortcuts

Open terminal and type one of these commands to jump into a project with auto-warmup:

| Command | Project | What Happens |
|---------|---------|--------------|
| `resto` | Restaurant OS | cd + claude + /warmup |
| `salvator` | Salvator Bonn | cd + claude + /warmup |
| `hoettche` | Em Höttche | cd + claude + /warmup |
| `sdk` | Restaurant OS SDK | cd + claude + /warmup |
| `invoices` | Invoice Splitter | cd + claude + /warmup |

### Quick Variants (Skip Warmup)

For fast re-entry when you know your task:

| Command | What It Does |
|---------|--------------|
| `resto-q` | Jump in with /quick (task only) |
| `salvator-q` | Jump in with /quick |
| `hoettche-q` | Jump in with /quick |
| `sdk-q` | Jump in with /quick |
| `invoices-q` | Jump in with /quick |

### Dev Server Shortcuts

| Command | What It Does |
|---------|--------------|
| `resto-dev` | cd + pnpm dev |
| `salvator-dev` | cd + pnpm dev |
| `hoettche-dev` | cd + pnpm dev |

### How It Works

These are shell functions in `~/.bashrc`. When you type `resto`:
1. Terminal `cd`s to `~/projects/restaurant-os`
2. Runs `claude --continue -p "/warmup"`
3. Claude loads project context and shows your current task

### Other Claude Shortcuts

| Alias | Command | Use When |
|-------|---------|----------|
| `cn` | `claude` | Start fresh session |
| `cc` | `claude --continue` | Resume last session |
| `cr` | `claude --resume` | Pick a session to resume |

---

## Session Flow

### 1. START - One Command Entry

```bash
resto                    # Jump + warmup in one command
```

Output shows:
- Current "Now" task from NEXT.md
- Git status (branch, uncommitted changes)
- Last 3 commits

### 2. SET TASK - Tell Claude What You're Building

```
/next Add user authentication
```

This sets your "Now" task in `.claude/NEXT.md`.

### 3. CODE - Build With Claude

Just describe what you need:
- "Create a login form component"
- "Fix the menu loading bug"
- "Refactor this to use the new SDK"

Claude reads your project's CLAUDE.md and understands your stack.

### 4. SHIP - One-Command Deploy

```
/ship
```

**What happens:**
1. Stages all changes
2. Creates conventional commit message
3. Pushes to remote (triggers validation)
4. Reports deployment status

Or manually:
```bash
git add . && git commit -m "feat: add user authentication"
git push
```

### 5. CHECK - Visual Regression

```
/check-design
```

**What happens:**
1. Screenshots key pages via chrome-devtools
2. Compares to baselines in `~/.claude/baselines/`
3. Reports PASS/WARNING/FAIL per page

### 6. END SESSION - Extract Value

Before `/clear`:
```
/session-end
```

This extracts:
- Insights → adds to CLAUDE.md
- Decisions → creates ADR if needed
- Bugs found → adds to DEBT.md
- Updates → NEXT.md task status

Then safe to:
```
/clear
```

---

## Slash Commands Reference

### Core Flow
| Command | What It Does |
|---------|-------------|
| `/warmup` | Full context: task, git status, commits |
| `/quick` | Minimal: just the current task |
| `/next [task]` | Set new "Now" task |
| `/next done` | Mark current task done, promote next |
| `/ship` | Stage + commit + push in one command |

### Visual Testing
| Command | What It Does |
|---------|-------------|
| `/check-design` | Screenshot pages, compare to baselines |
| `/update-baseline` | Capture new baseline screenshots |

### Daily Operations
| Command | What It Does |
|---------|-------------|
| `/standup` | Yesterday + today + blockers summary |
| `/session-end` | Extract insights before /clear |

### Memory & Knowledge
| Command | What It Does |
|---------|-------------|
| `/adr` | Record architecture decision |
| `/debt` | Scan TODOs, update DEBT.md |
| `/init-memory` | Bootstrap memory for new project |

### Code Quality
| Command | What It Does |
|---------|-------------|
| `/review` | Code review current changes |
| `/test` | Run tests |
| `/format` | Format code |

---

## MCP Server Stack

Connected tools available in Claude sessions:

| Server | Purpose |
|--------|---------|
| youtube | Video transcript extraction |
| notion | Project management sync |
| chrome-devtools | Browser automation, screenshots |
| filesystem | Direct file operations |
| github | PR/issue management |
| brave-search | Web search for debugging |
| puppeteer | Visual testing screenshots |
| n8n | Workflow automation |

---

## What's Automated

### On Every Commit
- ESLint auto-fix on staged files
- Prettier auto-format
- NEXT.md task auto-check-off (if commit matches)

### On Every Push
- TypeScript type checking
- Full ESLint validation
- Production build
- Security audit (npm audit)

### Hydration Safety (Next.js projects)
- ESLint blocks `useState(new Date())`
- ESLint blocks `useState(Date.now())`
- Run `bash scripts/check-hydration.sh` for full scan

---

## Visual Regression Testing

### Setup
Baselines stored in `~/.claude/baselines/`:
```
~/.claude/baselines/
├── salvator/
│   ├── home-desktop.png
│   ├── home-mobile.png
│   ├── menu-desktop.png
│   └── contact-desktop.png
├── em-hoettche/
│   └── ...
└── restaurant-os/
    └── ...
```

### Workflow
1. After intentional design changes: `/update-baseline`
2. After any deploy: `/check-design`
3. If FAIL: investigate or update baseline

### Pages Monitored
| Project | Pages |
|---------|-------|
| Salvator | /, /speisekarte, /kontakt |
| Em Höttche | /, /speisekarte, /kontakt |
| Restaurant OS | /admin |

---

## Project Memory Files

Each project has these in `.claude/`:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project context, stack, gotchas |
| `NEXT.md` | Current task + up next queue |
| `DEBT.md` | Technical debt tracking |
| `GOLDEN_PATH.md` | How to add features correctly |
| `decisions/` | Architecture Decision Records |

---

## Strategy Patterns

### Spike First
For unknowns:
1. `/next Spike: [feature]` - Time-boxed exploration
2. Code quick prototype
3. Delete or keep
4. `/next Implement: [feature]` - Now you know the path

### Ship Daily
End each day with something deployed:
- Even if incomplete, ship to staging
- `/session-end` captures what's missing
- Tomorrow you start with momentum

### Parallel Agents
For complex features, tell Claude:
> "Explore 3 approaches in parallel: [A, B, C]. Compare trade-offs."

Claude uses Task tool to run multiple explorations simultaneously.

---

## Best Practices

### Start Fast
```bash
resto              # One command. You're in context.
```

### Stay Focused
Keep exactly 1 task in "Now". Max 2 in "Up Next".

### Commit Often
Small commits = better NEXT.md tracking.

### Ship Daily
Always have something deployed, even if incomplete.

### End Clean
Always `/session-end` before `/clear`.

### Trust the Automation
- Don't manually lint - commit triggers it
- Don't manually check types - push triggers it

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  VIBE CODING FLOW                                   │
├─────────────────────────────────────────────────────┤
│  START    → resto (auto-warmup)                     │
│  TASK     → /next [description]                     │
│  CODE     → describe what you need                  │
│  SHIP     → /ship (commit + push + deploy)          │
│  CHECK    → /check-design (visual regression)       │
│  END      → /session-end → /clear                   │
├─────────────────────────────────────────────────────┤
│  QUICK VARIANTS                                     │
│  resto-q  → fast re-entry (task only)               │
│  resto-dev → start dev server                       │
├─────────────────────────────────────────────────────┤
│  EXTRAS                                             │
│  /standup → daily status                            │
│  /debt    → scan TODOs                              │
│  /adr     → record decision                         │
│  /review  → code review                             │
└─────────────────────────────────────────────────────┘
```

---

## Example Session

```bash
$ resto                              # Jump + warmup
NOW: Fix menu loading bug
UP NEXT: Add reservation form
Branch: main | 2 uncommitted files

> Fix the menu loading race condition
Claude: [fixes the bug]

> /ship                              # One-command deploy
[x] Changes staged
[x] Committed: "fix: menu loading race condition"
[x] Pushed to main
Deployed! Live at: https://restaurant-os-three.vercel.app

> /check-design                      # Visual verification
VISUAL REGRESSION CHECK - restaurant-os
admin-desktop: PASS

> /session-end                       # Extract insights
Session close checklist:
[x] Knowledge captured
[x] Tasks updated

> /clear                             # Clean slate
```

---

*Guide location: `~/.claude/VIBE-CODING-GUIDE.md`*
*Last updated: November 2025*
