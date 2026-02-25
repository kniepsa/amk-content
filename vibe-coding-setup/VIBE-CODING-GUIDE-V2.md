# Vibe Coding V2 - Unified AI Development

> **Superseded by [V3 - Skill Chain Architecture](./VIBE-CODING-GUIDE-V3.md)**. This document is kept for reference.

Ultra-fast momentum development powered by BMAD agents and AgentVibes TTS.

---

## The Stack

| Layer              | Component                                                         | Purpose                    |
| ------------------ | ----------------------------------------------------------------- | -------------------------- |
| **Micro-Rituals**  | /warmup, /next, /ship, /session-end                               | Fast session flow          |
| **Agent Power**    | 13 specialized BMAD personas                                      | Domain expertise on demand |
| **Voice Feedback** | AgentVibes TTS                                                    | Momentum markers           |
| **Git Automation** | Husky pre-commit, pre-push                                        | Quality gates              |
| **Task Tracking**  | NEXT.md (solo), features/ (Features), or sprint-status.yaml (BMM) | Focus management           |

---

## Quick Start

```bash
resto                    # Jump to project + warmup
/next Add user auth      # Set focus
[describe what you need] # Claude builds it
/ship                    # Deploy (runs all validations)
/session-end             # Capture learnings
/clear                   # Clean slate
```

### Project Shortcuts

| Command    | Project       | What Happens          |
| ---------- | ------------- | --------------------- |
| `resto`    | Restaurant OS | cd + claude + /warmup |
| `salvator` | Salvator Bonn | cd + claude + /warmup |
| `hoettche` | Em Hoettche   | cd + claude + /warmup |
| `resto-q`  | Quick entry   | cd + claude + /quick  |

---

## When to Escalate to BMAD

| Situation             | Vibe-Coding      | BMAD Workflow              |
| --------------------- | ---------------- | -------------------------- |
| Quick fix             | /next + /ship    | -                          |
| Feature (1-5 stories) | /next + /ship    | Optional: /strategy        |
| Feature (5+ stories)  | -                | Full: PRD → Arch → Stories |
| Strategic decision    | /advisory-debate | party-mode                 |
| Visual regression     | /check-design    | code-review                |
| Epic complete         | /session-end     | retrospective              |

---

## Session Flow Commands

### /warmup

Prime the session with context:

- Shows current task (NEXT.md) or story (sprint-status.yaml)
- Git status: branch, last 3 commits, uncommitted changes
- Notion rock progress (if configured)
- TTS: "[task] is your focus"

**Output (BMM Mode):**

```
🔷 BMM Active
🎯 STORY: epic-1-story-3 - Add user authentication
📦 EPIC: epic-1 - Core Features (3/7 stories done)

🌿 Branch: feature/auth | Last: fix: login validation
📝 2 uncommitted changes
```

**Output (Features Mode):**

```
🎯 Features Mode
📋 NOW: F-011 Invoice Parser (3/5 criteria done)
🌿 Branch: feature/F-011-invoice-parser

📋 UP NEXT:
- F-012 Price Checker
- F-013 Recipe Management
```

**Output (Solo Mode):**

```
⚡ Solo Mode
🎯 NOW: Fix menu loading bug

📋 UP NEXT:
- Add reservation form
- Update footer links

🌿 Branch: main | Last: feat: add menu categories
```

### /next [task]

Set or manage focus:

- `/next Fix auth bug` → Set as current focus
- `/next done` → Complete current, promote next
- `/next add Write tests` → Add to "Up Next" queue
- TTS: "Now: [task]"

**BMM Mode:** Syncs with sprint-status.yaml stories.

### /ship

One-command deploy:

1. Stage all changes
2. Generate conventional commit
3. Push (triggers pre-push validation)
4. Update sprint-status.yaml if BMM active
5. TTS: "Shipped."

### /session-end

Extract value before /clear:

1. Capture gotchas → CLAUDE.md
2. Record decisions → /adr
3. Track debt → DEBT.md
4. Update tasks → NEXT.md
5. Trigger retrospective if epic complete (BMM)
6. TTS: "Session complete."

---

## Strategic Commands

### /strategy

4-persona strategic analysis:

- **Visionary**: Long-term potential
- **Skeptic**: What could go wrong?
- **Pragmatist**: What ships fastest?
- **User Advocate**: What do users actually need?

### /advisory-debate

5-expert deliberation framework:

- CTO: Technical feasibility
- GTM Lead: Go-to-market strategy
- Product Lead: Feature prioritization
- UX Lead: User experience impact
- Entrepreneur: Business viability

### /adr

Record Architecture Decision:

- Context, decision, consequences
- Stored in `.claude/decisions/`

---

## Quality Commands

### /check-design

Visual regression testing:

- Screenshots key pages via chrome-devtools
- Compares to baselines in `~/.claude/baselines/`
- Reports PASS/WARNING/FAIL

### /update-baseline

Capture new design baselines after intentional changes.

### /debug

Taylor Singh's 8-step debugging framework.

### /debt

Scan codebase for TODO/FIXME, update DEBT.md.

---

## BMAD Agent Access

When you need specialized expertise:

| Agent               | Invoke                             | Specialty                             |
| ------------------- | ---------------------------------- | ------------------------------------- |
| PM (John)           | `/bmad:bmm:agents:pm`              | PRD, requirements, stories            |
| Architect (Winston) | `/bmad:bmm:agents:architect`       | System design, architecture           |
| Dev (Amelia)        | `/bmad:bmm:agents:dev`             | Code execution, dev-story             |
| UX (Sally)          | `/bmad:bmm:agents:ux-designer`     | User experience, wireframes           |
| SM (Bob)            | `/bmad:bmm:agents:sm`              | Sprint planning, retrospectives       |
| TEA (Murat)         | `/bmad:bmm:agents:tea`             | Test architecture, quality            |
| Supabase (Supa)     | `/bmad:bmm:agents:supabase-expert` | RLS, migrations, auth                 |
| Restaurant (Rico)   | `/bmad:bmm:agents:resto-expert`    | Menu, reservations, German compliance |
| Content (Maya)      | `/bmad:bmm:agents:content-expert`  | Blog, LinkedIn, SEO                   |

---

## TTS Momentum Markers

| Event         | TTS Message                  |
| ------------- | ---------------------------- |
| /warmup       | "[task] is your focus"       |
| /next [x]     | "Now: [x]"                   |
| /ship success | "Shipped."                   |
| /session-end  | "Session complete."          |
| Epic complete | "Epic complete. Great work." |

Configure verbosity: `/agent-vibes:verbosity [low|medium|high]`

---

## Git Hooks (Automatic)

### Pre-commit (lint-staged)

- ESLint --fix on .ts/.tsx/.js/.jsx
- Prettier --write on all files

### Pre-push (validate:all)

- TypeScript type checking
- ESLint validation
- Prettier check
- Production build test
- Security audit

---

## Code Quality Principles

### KISS (Keep It Simple, Stupid)

- **Minimum viable code** - Solve the problem with the least code
- **No premature abstraction** - Three similar patterns before extracting
- **Delete freely** - Less code = fewer bugs

### Shared Components (DRY)

Before creating anything new, check:

1. `shadcn/ui` has it? → Use it
2. Project shared package has it? → Use it
3. Another project has it? → Extract to shared

### Joe Gebbia's Delight Moments

Small touches that create loyalty:

- **Reduce friction** - Every click removed is a gift
- **Smart defaults** - Guess correctly 90% of time
- **Instant feedback** - Never leave users wondering
- **One-click copy** - Anything users might paste elsewhere

### First Principles (Before Any Feature)

1. What is the **core problem**? (Strip assumptions)
2. What are the **hard constraints**?
3. What is the **simplest solution**?
4. What **dependencies** must exist?
5. What could **go wrong**? (Pre-mortem)

### MCP Server Usage

Always use MCP servers for research:

- `context7` → Check official docs BEFORE coding
- `serper` → Stack Overflow, GitHub issues, best practices
- Tech-specific MCPs → Svelte, Next.js, Vendure patterns

---

## Project Memory Files

| File                      | Purpose                          |
| ------------------------- | -------------------------------- |
| `.claude/CLAUDE.md`       | Project DNA, invariants, gotchas |
| `.claude/NEXT.md`         | NOW task + Up Next queue         |
| `.claude/DEBT.md`         | Technical debt tracking          |
| `.claude/features/`       | Feature specs (F-XXX-name.md)    |
| `.claude/features/done/`  | Completed feature specs          |
| `.claude/decisions/*.md`  | Architecture Decision Records    |
| `docs/sprint-status.yaml` | BMAD sprint tracking (if active) |

---

## Integration Points

### NEXT.md ↔ Sprint-Status Bridge

When `docs/sprint-status.yaml` exists:

- `/warmup` shows current BMAD story
- `/next done` updates story status
- `/ship` triggers story completion

### Session-End ↔ Retrospective

When epic completes:

- `/session-end` auto-suggests SM retrospective
- Metrics captured: velocity, coverage, debt
- Learnings added to project-context.md

---

## Ecosystem Health

Run `/audit-ecosystem` to check:

- BMAD Method installation
- Vibe-Coding setup
- AgentVibes TTS configuration
- Git hooks status
- Integration health (MECE validation)

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│  VIBE CODING V2 - UNIFIED AI DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────────┤
│  SESSION FLOW                                                    │
│  resto          → Jump + warmup (or resto-q for quick)           │
│  /next [task]   → Set focus (syncs with BMM if active)           │
│  /ship          → Commit + push + deploy                         │
│  /session-end   → Extract learnings + retrospective              │
│  /clear         → Clean slate                                    │
├─────────────────────────────────────────────────────────────────┤
│  STRATEGIC                                                       │
│  /strategy      → 4-persona analysis                             │
│  /advisory-debate → 5-expert deliberation                        │
│  /adr           → Record architecture decision                   │
├─────────────────────────────────────────────────────────────────┤
│  QUALITY                                                         │
│  /check-design  → Visual regression                              │
│  /debug         → 8-step debugging                               │
│  /debt          → Scan TODOs                                     │
├─────────────────────────────────────────────────────────────────┤
│  BMAD AGENTS                                                     │
│  /bmad:bmm:agents:pm         → Requirements & stories            │
│  /bmad:bmm:agents:architect  → System design                     │
│  /bmad:bmm:agents:dev        → Code execution                    │
│  /bmad:bmm:agents:supabase-expert → RLS & migrations             │
│  /bmad:bmm:agents:resto-expert → Restaurant domain               │
├─────────────────────────────────────────────────────────────────┤
│  TTS                                                             │
│  /agent-vibes:verbosity [low|medium|high]                        │
│  /agent-vibes:switch [voice]                                     │
│  /agent-vibes:whoami                                             │
├─────────────────────────────────────────────────────────────────┤
│  MODES (auto-detected, priority order)                           │
│  🔷 BMM Active  → sprint-status.yaml story tracking              │
│  🎯 Features    → .claude/features/ with F-XXX specs             │
│  ⚡ Solo Mode   → NEXT.md task tracking                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Example Session (BMM Mode)

```bash
$ resto                              # Jump + warmup
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

> /clear                             # Clean slate
```

---

## Example Session (Features Mode)

```bash
$ bwa                                # Jump + warmup
🎯 Features Mode
📋 NOW: F-011 Invoice Parser (2/5 criteria done)
🌿 Branch: feature/F-011-invoice-parser

📋 UP NEXT:
- F-012 Price Checker
- F-013 Recipe Management

> Build the line item extraction from invoices

Claude: [builds extraction using existing parser patterns]

> /ship                              # PR + merge + deploy
🔀 Shipping feature branch: feature/F-011-invoice-parser

[x] Synced with main (no conflicts)
[x] Pushed to origin
[x] PR #15 created: "feat: invoice line item extraction"
[x] CI checks passed
[x] Merged to main (squash)

Deployed! Vercel will build...

🎯 F-011: 4/5 criteria done

> /session-end
Session close checklist:
[x] Knowledge captured → CLAUDE.md
[x] Feature progress → F-011 (4/5 done)

TTS: "Session complete."

> /clear
```

**When feature completes:**

```bash
> /ship
🎯 F-011 Invoice Parser: All success criteria met!
[Moving to features/done/]
[Promoting F-012 to Now]

TTS: "Feature complete. Shipped."
```

---

_Guide location: `~/Projects/amk-content/vibe-coding-setup/VIBE-CODING-GUIDE-V2.md`_
_Version: 2.1.0_
_Last updated: January 2026_
