# Vibe Coding V3 - Skill Chain Architecture

Ultra-fast momentum development powered by skill chains, specialized agents, and deterministic hooks.

---

## The Stack

| Layer              | Component                                                        | Purpose                  |
| ------------------ | ---------------------------------------------------------------- | ------------------------ |
| **Skill Chains**   | 11 multi-phase pipelines with validation gates                   | Structured workflows     |
| **Agents**         | builder (opus), reviewer (sonnet), researcher (haiku)            | Specialized execution    |
| **Hooks**          | 6 scripts across 5 event types                                   | Deterministic automation |
| **Micro-Rituals**  | /warmup, /next, /ship, /session-end                              | Fast session flow        |
| **Voice Feedback** | TTS via macOS `say` command                                      | Momentum markers         |
| **Git Automation** | Husky pre-commit, pre-push                                       | Quality gates            |
| **Task Tracking**  | features/ (primary), NEXT.md (solo), or sprint-status.yaml (BMM) | Focus management         |

---

## Quick Start

```bash
# New project:
cd ~/Projects/my-new-project
claude                       # SessionStart hook detects no .claude/
/install                     # Auto-scaffolds .claude/ with full V3 setup

# Existing project:
resto                        # Jump to project + warmup
/next Add user auth          # Set focus
[describe what you need]     # Claude builds it
/ship                        # Deploy (runs all validations)
/session-end                 # Capture learnings
/clear                       # Clean slate
```

### Project Shortcuts

| Command    | Project       | What Happens          |
| ---------- | ------------- | --------------------- |
| `resto`    | Restaurant OS | cd + claude + /warmup |
| `salvator` | Salvator Bonn | cd + claude + /warmup |
| `hoettche` | Em Hoettche   | cd + claude + /warmup |
| `resto-q`  | Quick entry   | cd + claude + /quick  |

---

## Skills vs Commands

| Aspect     | Command                     | Skill Chain                              |
| ---------- | --------------------------- | ---------------------------------------- |
| Structure  | Single action               | Multi-phase pipeline with gates          |
| Trigger    | Manual (`/command`)         | Manual or auto-detected                  |
| Validation | None (fire and forget)      | Gate between each phase                  |
| Recovery   | Start over                  | Resume from last completed phase         |
| Example    | `/ship` (stage+commit+push) | `dev-pipeline` (7 phases: clarify-learn) |

**Commands** are the building blocks. **Skills** orchestrate commands into workflows with quality gates.

---

## Skill Chains (11 chains)

### session-flow (auto, always on)

```
START --> FOCUS --> WORK --> VERIFY --> SHIP --> CLOSE
```

Manages the session lifecycle. Auto-detects where you are and suggests the right next step.

### dev-pipeline (manual: `/dev-pipeline [feature]`)

```
CLARIFY --> DESIGN --> PLAN --> BUILD --> VERIFY --> SHIP --> LEARN
```

Full feature development from requirements to deployment. Each phase has a validation gate. Phases can be skipped for simple features.

### quality-chain (manual: `/quality-chain`)

```
SCAN --> IDENTIFY --> PLAN --> FIX --> VERIFY --> SHIP
```

Systematic code quality improvement. Scans, categorizes, prioritizes, fixes, and verifies.

### debug-chain (auto on bug/error)

```
REPRODUCE --> ISOLATE --> HYPOTHESIZE --> FIX --> VERIFY --> DOCUMENT --> SHIP
```

Taylor Singh's 8-step framework. Guides from symptom to root cause to verified fix.

### decision-chain (auto on "should we...")

```
CLARIFY --> RESEARCH --> ANALYZE --> DECIDE --> PLAN
```

Structured decision-making with web research, multi-persona analysis, and ADR documentation.

### plan (auto before coding)

Quick task-level planning: files to change, approach, risks, scope estimate. Not the heavy `/architect` - just enough to prevent wasted effort.

### deploy-check (manual: `/deploy-check`)

Post-deployment verification: availability, console errors, critical paths, visual regression, performance.

### research (auto on "research...")

Real-time web + docs search. Uses serper and context7 MCPs to get current, verified information.

### onboard (manual: `/onboard`)

One-prompt project understanding: scans codebase, detects stack, reads docs, generates summary with suggested first task.

### architecture (auto on arch changes)

Generates or updates `.claude/ARCHITECTURE.md`. Scans directory structure, dependencies, API surface, database schema, component hierarchy.

---

## Agents

### builder (opus)

- **Purpose**: Implementation workhorse. Writes production-quality code.
- **Tools**: Full access (Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch)
- **Rules**: TDD cycle, TypeScript strict, no `any`, atomic commits
- **Output**: BUILD COMPLETE report with files changed, tests added, check results

### reviewer (sonnet)

- **Purpose**: Read-only code review. Validates quality before shipping.
- **Tools**: Read-only (Read, Grep, Glob, Bash)
- **Hard rule**: NEVER writes or edits files
- **Output**: CODE REVIEW with CRITICAL/HIGH/MEDIUM/LOW findings and SHIP/FIX FIRST/BLOCKED verdict

### researcher (haiku)

- **Purpose**: Web and documentation research. Returns actionable findings.
- **Tools**: Search only (Read, WebSearch, WebFetch, Grep, Glob)
- **Hard rule**: NEVER modifies project files
- **Output**: RESEARCH report with key findings, recommendation, sources, and confidence level

---

## Hooks (deterministic automation)

Hooks run automatically on specific events. They are shell scripts, not prompts - deterministic and fast.

| Hook Script          | Event                   | What it does                                                           |
| -------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `session-start.sh`   | SessionStart            | Inject project context, detect mode, show task + branch                |
| `damage-control.sh`  | PreToolUse(Bash)        | Block dangerous commands (rm -rf /, DROP TABLE, force push main, etc.) |
| `notion-reminder.sh` | UserPromptSubmit        | Remind to update Notion every 15 minutes                               |
| `security-scan.sh`   | PostToolUse(Edit/Write) | Detect hardcoded secrets and credentials                               |
| `quality-batch.sh`   | PostToolUse(Edit/Write) | Every 5 edits: check file sizes, `any` types, debug statements         |
| `quality-summary.sh` | Stop                    | Summarize findings + TTS alert for critical issues                     |

### What they block (damage-control.sh)

- Catastrophic deletes (`rm -rf /`, `rm -rf ~`)
- Database destruction (`DROP TABLE`, `DROP DATABASE`)
- Force push to main/master
- `git reset --hard`
- Access to sensitive directories (~/.ssh, ~/.aws, ~/.gnupg)
- `chmod 777`, piping remote content to shell, block device writes

### What they scan (security-scan.sh)

- OpenAI/Anthropic API keys (`sk-*`, `sk-ant-*`)
- AWS credentials (`AKIA*`)
- Supabase JWT tokens, private keys
- Database connection strings with passwords
- Bearer tokens, `.env` file modifications

---

## When to Escalate

| Situation             | Approach       | Tools                                      |
| --------------------- | -------------- | ------------------------------------------ |
| Quick fix             | /next + /ship  | Direct coding                              |
| Feature (1-5 stories) | /next + /ship  | Optional: `/strategy`                      |
| Feature (5+ stories)  | dev-pipeline   | Full: CLARIFY -> DESIGN -> PLAN -> BUILD   |
| Strategic decision    | decision-chain | `/advisory-debate` or `/strategy`          |
| Visual regression     | /check-design  | Playwright MCP                             |
| Epic complete         | /session-end   | Retrospective                              |
| Code quality debt     | quality-chain  | Full: SCAN -> IDENTIFY -> PLAN -> FIX      |
| Bug encountered       | debug-chain    | REPRODUCE -> ISOLATE -> HYPOTHESIZE -> FIX |

---

## Session Flow Commands

### /warmup

Prime the session with context:

- Shows current task (NEXT.md) or story (sprint-status.yaml)
- Git status: branch, last 3 commits, uncommitted changes
- Notion rock progress (if configured)
- TTS: "[task] is your focus"

**Output (Features Mode):**

```
Features Mode
NOW: F-011 Invoice Parser (3/5 criteria done)
Branch: feature/F-011-invoice-parser

UP NEXT:
- F-012 Price Checker
- F-013 Recipe Management
```

**Output (Solo Mode):**

```
Solo Mode
NOW: Fix menu loading bug

UP NEXT:
- Add reservation form
- Update footer links

Branch: main | Last: feat: add menu categories
```

### /next [task]

Set or manage focus:

- `/next Fix auth bug` - Set as current focus
- `/next done` - Complete current, promote next
- `/next add Write tests` - Add to "Up Next" queue
- TTS: "Now: [task]"

### /ship

One-command deploy:

1. Stage all changes
2. Generate conventional commit
3. Push (triggers pre-push validation)
4. Update feature spec if Features mode active
5. TTS: "Shipped."

### /session-end

Extract value before /clear:

1. Capture gotchas - CLAUDE.md
2. Record decisions - /adr
3. Track debt - DEBT.md
4. Update tasks - NEXT.md
5. Update architecture - ARCHITECTURE.md (if changed)
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

- Screenshots key pages via Playwright
- Compares to baselines in `~/.claude/baselines/`
- Reports PASS/WARNING/FAIL

### /update-baseline

Capture new design baselines after intentional changes.

### /debug

Taylor Singh's 8-step debugging framework.

### /debt

Scan codebase for TODO/FIXME, update DEBT.md.

### /quality-check

Comprehensive quality scan: TypeScript errors, ESLint violations, file sizes, accumulated findings from hook scripts.

### /refactor

Systematic refactoring with safety checks at each step.

### /test

Run and analyze tests with coverage and failure diagnostics.

---

## TTS Momentum Markers

| Event             | TTS Message                                |
| ----------------- | ------------------------------------------ |
| /warmup           | "[task] is your focus"                     |
| /next [x]         | "Now: [x]"                                 |
| /ship success     | "Shipped."                                 |
| /session-end      | "Session complete."                        |
| Security alert    | "Security alert. Secret detected in code." |
| Quality critical  | "[N] critical quality issues found."       |
| Phase transitions | "[Phase] complete. Moving to [next]."      |

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

1. `shadcn/ui` has it? - Use it
2. Project shared package has it? - Use it
3. Another project has it? - Extract to shared

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

- `context7` - Check official docs BEFORE coding
- `serper` - Stack Overflow, GitHub issues, best practices
- Tech-specific MCPs - Svelte, Next.js, Vendure patterns

---

## Project Memory Files

| File                      | Purpose                          |
| ------------------------- | -------------------------------- |
| `.claude/CLAUDE.md`       | Project DNA, invariants, gotchas |
| `.claude/NEXT.md`         | NOW task + Up Next queue         |
| `.claude/DEBT.md`         | Technical debt tracking          |
| `.claude/ARCHITECTURE.md` | Auto-generated architecture doc  |
| `.claude/features/`       | Feature specs (F-XXX-name.md)    |
| `.claude/features/done/`  | Completed feature specs          |
| `.claude/decisions/*.md`  | Architecture Decision Records    |
| `.claude/settings.json`   | Project-level hook configuration |
| `docs/sprint-status.yaml` | BMM sprint tracking (if active)  |

---

## Installation

### One-Time System Install

```bash
cd ~/Projects/amk-content/vibe-coding-setup
claude
/sync-vibe-setup
# Copies skills/, agents/, commands/, hooks/ to ~/.claude/
```

### Per-Project Setup

```bash
cd ~/Projects/my-new-project
claude
/install
# Auto-detects stack, creates .claude/ files, copies hooks
```

What `/install` does:

1. Detects project type (framework, database, deploy target, package manager)
2. Creates `.claude/CLAUDE.md` with detected stack and conventions
3. Creates `.claude/NEXT.md`, `.claude/DEBT.md`, `.claude/decisions/`
4. Copies hook scripts (security-scan, quality-batch, quality-summary)
5. Copies `.claude/settings.json` with V3 hook configuration
6. Validates setup (dev, build, lint, typecheck commands)

---

## Integration Points

### Features Folder (Primary Tracking)

Feature specs in `.claude/features/` are the primary tracking mechanism:

```
.claude/features/
  F-011-invoice-parser.md    # Active feature
  F-012-price-checker.md     # Queued
  done/
    F-010-user-auth.md       # Completed
```

- `/warmup` shows current feature progress (criteria done/total)
- `/ship` updates feature spec, moves to `done/` when all criteria met
- `/next done` promotes next feature to active

### Session-End Captures

When `/session-end` runs, it captures:

- Gotchas - project CLAUDE.md (non-obvious learnings)
- Decisions - ADR files (architectural choices)
- Debt - DEBT.md (technical debt created)
- Architecture - ARCHITECTURE.md (if structure changed)
- Content ideas - articles/ideas.md (article-worthy moments)

### NEXT.md / Sprint-Status Bridge

When `docs/sprint-status.yaml` exists (BMM mode):

- `/warmup` shows current BMAD story
- `/next done` updates story status
- `/ship` triggers story completion

---

## Ecosystem Health

Run `/audit-ecosystem` to check:

- Vibe-Coding V3 setup (skills, agents, hooks)
- Git hooks status (Husky, lint-staged)
- Quality state (findings, edit count)
- MCP server availability

---

## Quick Reference Card

```
+-----------------------------------------------------------------+
|  VIBE CODING V3 - SKILL CHAIN ARCHITECTURE                     |
+-----------------------------------------------------------------+
|  SESSION FLOW                                                   |
|  resto          -> Jump + warmup (or resto-q for quick)         |
|  /next [task]   -> Set focus                                    |
|  /ship          -> Commit + push + deploy                       |
|  /session-end   -> Extract learnings                            |
|  /clear         -> Clean slate                                  |
+-----------------------------------------------------------------+
|  SKILL CHAINS (auto or manual)                                  |
|  session-flow    -> Auto session lifecycle                      |
|  dev-pipeline    -> CLARIFY>DESIGN>PLAN>BUILD>VERIFY>SHIP>LEARN |
|  quality-chain   -> SCAN>IDENTIFY>PLAN>FIX>VERIFY>SHIP         |
|  debug-chain     -> REPRODUCE>ISOLATE>HYPOTHESIZE>FIX>...      |
|  decision-chain  -> CLARIFY>RESEARCH>ANALYZE>DECIDE>PLAN       |
|  plan            -> Quick task-level planning                   |
|  deploy-check    -> Post-deploy verification                    |
|  research        -> Web + docs real-time search                 |
|  onboard         -> Project scan + understanding                |
|  architecture    -> Auto-generate ARCHITECTURE.md               |
+-----------------------------------------------------------------+
|  STRATEGIC                                                      |
|  /strategy       -> 4-persona analysis                          |
|  /advisory-debate -> 5-expert deliberation                      |
|  /adr            -> Record architecture decision                |
+-----------------------------------------------------------------+
|  QUALITY                                                        |
|  /check-design   -> Visual regression                           |
|  /quality-check  -> Full quality scan                           |
|  /debug          -> 8-step debugging                            |
|  /debt           -> Scan TODOs                                  |
|  /refactor       -> Systematic refactoring                      |
|  /test           -> Run and analyze tests                       |
+-----------------------------------------------------------------+
|  AGENTS                                                         |
|  builder         -> Opus, full tool access, writes code         |
|  reviewer        -> Sonnet, read-only code review               |
|  researcher      -> Haiku, web + docs search                    |
+-----------------------------------------------------------------+
|  HOOKS (automatic)                                              |
|  SessionStart    -> Inject context, detect mode                 |
|  PreToolUse      -> Block dangerous commands                    |
|  UserPromptSubmit -> Notion reminder (15 min)                   |
|  PostToolUse     -> Security scan + quality checks              |
|  Stop            -> Quality summary + TTS                       |
+-----------------------------------------------------------------+
|  MODES (auto-detected, priority order)                          |
|  BMM Active      -> sprint-status.yaml story tracking           |
|  Features        -> .claude/features/ with F-XXX specs          |
|  Solo Mode       -> NEXT.md task tracking                       |
+-----------------------------------------------------------------+
```

---

## Example Session (Features Mode)

```bash
$ bwa                                # Jump + warmup
Features Mode
NOW: F-011 Invoice Parser (2/5 criteria done)
Branch: feature/F-011-invoice-parser

UP NEXT:
- F-012 Price Checker
- F-013 Recipe Management

> Build the line item extraction from invoices

Claude: [builds extraction using existing parser patterns]

> /ship                              # PR + merge + deploy
Shipping feature branch: feature/F-011-invoice-parser

[x] Synced with main (no conflicts)
[x] Pushed to origin
[x] PR #15 created: "feat: invoice line item extraction"
[x] CI checks passed
[x] Merged to main (squash)

Deployed! Vercel will build...

F-011: 4/5 criteria done

> /session-end
Session close checklist:
[x] Knowledge captured -> CLAUDE.md
[x] Feature progress -> F-011 (4/5 done)

TTS: "Session complete."

> /clear
```

**When feature completes:**

```bash
> /ship
F-011 Invoice Parser: All success criteria met!
[Moving to features/done/]
[Promoting F-012 to Now]

TTS: "Feature complete. Shipped."
```

---

## Example Session (dev-pipeline)

```bash
> /dev-pipeline Add multi-language menu support

PIPELINE: Multi-Language Menu Support
================================================
[>] CLARIFY   - Understanding requirements...
[ ] DESIGN    - PM brief + architecture
[ ] PLAN      - Creating story
[ ] BUILD     - Implementation
[ ] VERIFY    - Tests + quality + UX
[ ] SHIP      - Deploy to production
[ ] LEARN     - Extract insights
================================================
Phase 1 of 7 | Mode: Features

# Claude runs /analyst, asks clarifying questions
# Gate passes -> moves to DESIGN
# Claude runs /pm then /architect
# Gate passes -> moves to PLAN
# ... each phase with validation gates
```

---

_Guide location: `~/Projects/amk-content/vibe-coding-setup/VIBE-CODING-GUIDE-V3.md`_
_Version: 3.0.0_
_Last updated: February 2026_
