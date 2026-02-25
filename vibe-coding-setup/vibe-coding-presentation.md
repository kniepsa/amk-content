# Vibe Coding V2

## Ultra-Fast Momentum Development with AI Agents

**Author:** AMK
**Date:** January 2026

---

# What is Vibe Coding?

## The Philosophy

🚀 **Start Fast**
One command to jump into any project with full context

🎯 **Stay Focused**
Always know your current task

📦 **Ship Daily**
Commit, push, deploy in one command

✅ **Auto-Verify**
Visual regression testing catches UI breaks

---

# The Stack

## Technology Layers

| Layer              | Component                              | Purpose                    |
| ------------------ | -------------------------------------- | -------------------------- |
| **Micro-Rituals**  | /warmup, /next, /ship                  | Fast session flow          |
| **Agent Power**    | 13 specialized BMAD personas           | Domain expertise on demand |
| **Voice Feedback** | AgentVibes TTS                         | Momentum markers           |
| **Git Automation** | Husky pre-commit/push                  | Quality gates              |
| **Task Tracking**  | NEXT.md, features/, sprint-status.yaml | Focus management           |

---

# Quick Start

## Getting Started in 30 Seconds

```bash
resto                    # Jump to project + warmup
/next Add user auth      # Set focus
[describe what you need] # Claude builds it
/ship                    # Deploy (runs all validations)
/session-end             # Capture learnings
/clear                   # Clean slate
```

---

# Session Flow Commands

## Core Workflow Commands

### /warmup

Prime session with context

- Shows current task (NEXT.md)
- Git status (branch, commits, changes)
- Notion rock progress
- **TTS:** "[task] is your focus"

### /next [task]

Set or manage focus

- `/next Fix auth bug` → Set as current
- `/next done` → Complete current, promote next
- `/next add Write tests` → Add to queue
- **TTS:** "Now: [task]"

### /ship

One-command deploy

1. Stage all changes
2. Generate conventional commit
3. Push (triggers pre-push validation)
4. Update sprint-status.yaml if BMM active
5. **TTS:** "Shipped."

### /session-end

Extract value before /clear

1. Capture gotchas → CLAUDE.md
2. Record decisions → /adr
3. Track debt → DEBT.md
4. Update tasks → NEXT.md
5. **TTS:** "Session complete."

---

# Strategic Commands

## Planning & Decision Making

### /strategy

**4-persona strategic analysis**

- Visionary: Long-term potential
- Skeptic: What could go wrong?
- Pragmatist: What ships fastest?
- User Advocate: What do users need?

### /advisory-debate

**5-expert deliberation framework**

- CTO: Technical feasibility
- GTM Lead: Go-to-market strategy
- Product Lead: Feature prioritization
- UX Lead: User experience impact
- Entrepreneur: Business viability

### /adr

**Record Architecture Decision Records**

- Context, decision, consequences
- Stored in `.claude/decisions/`
- Searchable team knowledge

---

# Quality Commands

## Code Quality & Testing

### /check-design

Visual regression testing

- Screenshots key pages via chrome-devtools
- Compares to baselines in `~/.claude/baselines/`
- Reports PASS/WARNING/FAIL

### /update-baseline

Capture new design baselines after intentional changes

### /debug

Taylor Singh's 8-step debugging framework

- Systematic problem solving
- Root cause analysis

### /debt

Scan codebase for TODO/FIXME

- Update DEBT.md
- Prioritize technical debt

---

# BMAD Agent Access

## Specialized AI Experts

When you need domain expertise:

| Agent                   | Invoke                             | Specialty                       |
| ----------------------- | ---------------------------------- | ------------------------------- |
| **PM (John)**           | `/bmad:bmm:agents:pm`              | PRD, requirements, stories      |
| **Architect (Winston)** | `/bmad:bmm:agents:architect`       | System design, architecture     |
| **Dev (Amelia)**        | `/bmad:bmm:agents:dev`             | Code execution, dev-story       |
| **UX (Sally)**          | `/bmad:bmm:agents:ux-designer`     | User experience, wireframes     |
| **SM (Bob)**            | `/bmad:bmm:agents:sm`              | Sprint planning, retrospectives |
| **TEA (Murat)**         | `/bmad:bmm:agents:tea`             | Test architecture, quality      |
| **Supabase (Supa)**     | `/bmad:bmm:agents:supabase-expert` | RLS, migrations, auth           |
| **Restaurant (Rico)**   | `/bmad:bmm:agents:resto-expert`    | Menu, reservations, compliance  |
| **Content (Maya)**      | `/bmad:bmm:agents:content-expert`  | Blog, LinkedIn, SEO             |

---

# TTS Momentum Markers

## Voice Feedback for Flow State

Audio feedback keeps you in the zone:

| Event             | TTS Message                  |
| ----------------- | ---------------------------- |
| **Warmup**        | "[task] is your focus"       |
| **Next**          | "Now: [new task]"            |
| **Ship Success**  | "Shipped."                   |
| **Session End**   | "Session complete."          |
| **Epic Complete** | "Epic complete. Great work." |

**Configure:** `/agent-vibes:verbosity [low|medium|high]`

---

# Git Automation

## Quality Gates (Zero Config)

### Pre-commit (lint-staged)

✅ ESLint --fix on TypeScript/JavaScript
✅ Prettier --write on all files

### Pre-push (validate:all)

✅ TypeScript type checking
✅ ESLint validation
✅ Prettier check
✅ Production build test
✅ Security audit

**Result:** Ship with confidence - hooks catch issues before push

---

# Project Memory Files

## Context Persistence

| File                      | Purpose                          |
| ------------------------- | -------------------------------- |
| `.claude/CLAUDE.md`       | Project DNA, invariants, gotchas |
| `.claude/NEXT.md`         | NOW task + Up Next queue         |
| `.claude/DEBT.md`         | Technical debt tracking          |
| `.claude/features/`       | Feature specs (F-XXX-name.md)    |
| `.claude/decisions/`      | Architecture Decision Records    |
| `docs/sprint-status.yaml` | BMAD sprint tracking (if active) |

**Benefit:** Zero context loss across sessions

---

# The Live Flow

## Real-World Example (BMM Mode)

```bash
$ resto                    # Jump + warmup
🔷 BMM Active
🎯 STORY: epic-1-story-3 - Add user authentication
📦 EPIC: epic-1 - Core Features (2/7 stories done)
🌿 Branch: feature/auth | Last: chore: setup auth hooks

> Create the login form with email/password fields

Claude: [builds login form using existing patterns]

> /ship                              # One-command deploy
[x] Changes staged
[x] Committed: "feat: add login form with validation"
[x] Pushed to feature/auth
[x] Story epic-1-story-3 marked complete (3/7)
TTS: "Shipped."

> /session-end                       # Extract insights
Session close checklist:
[x] Knowledge captured → CLAUDE.md
[x] Tasks updated → sprint-status.yaml
[x] 3 stories remaining in epic

TTS: "Session complete."
```

---

# Code Quality Principles

## KISS + DRY + Joe Gebbia

### KISS (Keep It Simple, Stupid)

- Minimum viable code - solve with least code
- No premature optimization or abstraction
- Delete freely - less code = fewer bugs

### DRY (Don't Repeat Yourself)

Before creating anything new:

1. Does `shadcn/ui` have this? → Use it
2. Does project shared package have it? → Use it
3. Does another project have it? → Extract to shared

### Joe Gebbia's Delight Moments

Small touches that create loyalty:

- **Reduce friction** - Every click removed = gift
- **Smart defaults** - Guess correctly 90% of time
- **Instant feedback** - Never leave users wondering
- **One-click copy** - Anything users might paste

---

# MCP Server Usage

## Research-First Development

Always use MCP servers for research BEFORE coding:

### Core Pattern

1. **context7** → Check official docs (Next.js, React, Vendure)
2. **serper** → Stack Overflow, GitHub issues, best practices
3. **Tech-specific MCPs** → Svelte, Tailwind v4 patterns

### Example Workflow

```
Research → Plan → Build → Ship
   ↓        ↓       ↓       ↓
context7  /adr   Write   /ship
serper           Edit
```

**Result:** No hallucinated APIs, always use current best practices

---

# The Results

## What You Get

✅ **10x faster setup**
One command vs 15-minute context gathering

✅ **Zero context loss**
CLAUDE.md, NEXT.md persist across sessions

✅ **Quality built-in**
Pre-commit/push hooks catch issues before ship

✅ **Momentum preserved**
TTS feedback + visual progress tracking

✅ **Team scalable**
Shared `.claude/` folder in git = instant team onboarding

---

# Get Started

## Installation (5 Minutes)

```bash
# 1. Copy global config
cp -r commands/* ~/.claude/commands/
cp CLAUDE.md ~/.claude/CLAUDE.md

# 2. Add bash aliases
cat bash_aliases >> ~/.bash_aliases
source ~/.bash_aliases

# 3. Init project memory
cd your-project
/init-memory

# 4. Start coding
resto   # or your project shortcut
```

**Documentation:**
`~/Projects/amk-content/vibe-coding-setup/`

---

# Learn More

## Resources

📚 **Full Guide**
`~/Projects/amk-content/vibe-coding-setup/VIBE-CODING-GUIDE-V2.md`

🎯 **Commands Reference**
`~/.claude/commands/`

🏗️ **Templates**
`~/Projects/amk-content/vibe-coding-setup/templates/`

💬 **Questions?**
Check CLAUDE.md for project-specific gotchas

---

# Thank You!

## Start Building at 10x Speed

**Next Steps:**

1. Install vibe-coding-setup (5 min)
2. Run `/warmup` in your project
3. Experience the flow

**Remember:**
Fast setup → Stay focused → Ship daily → Auto-verify

🚀 **Happy Coding!**
