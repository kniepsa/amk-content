# Vibe Coding V3 - Skill Chain Architecture

Ultra-fast AI-assisted development with skill chains, validation gates, and auto-setup.

## What's New in V3

- **11 Skill Chains** with validation gates between phases
- **3 Specialized Agents** (builder, reviewer, researcher)
- **6 Hook Scripts** across multiple events (SessionStart, PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- **Auto-Setup** for new projects (`/install`)
- **Auto-Architecture** documentation that stays current
- **Zero-Friction Entry** - just `cd` to project and Claude auto-detects everything

## Quick Start

```bash
# New project:
cd ~/Projects/my-new-project
claude
# SessionStart hook detects new project -> suggests /install
/install                    # Auto-scaffolds .claude/ with full setup

# Existing project:
cd ~/Projects/restaurant-os
claude                      # SessionStart injects context automatically
```

## Skill Chains (the core innovation)

Skills are multi-phase pipelines with validation gates. They differ from commands: a command is a single action, a skill is a chain of phases with gates between each.

| Chain            | Purpose                             | Trigger                   |
| ---------------- | ----------------------------------- | ------------------------- |
| `session-flow`   | Session lifecycle management        | Auto (always on)          |
| `dev-pipeline`   | Full feature development (7 phases) | `/dev-pipeline [feature]` |
| `quality-chain`  | Code quality improvement (6 phases) | `/quality-chain`          |
| `debug-chain`    | Systematic debugging (7 phases)     | Auto on bug/error         |
| `decision-chain` | Strategic decisions (5 phases)      | Auto on "should we..."    |
| `plan`           | Task-level planning before coding   | Auto before coding        |
| `deploy-check`   | Post-deploy verification            | `/deploy-check`           |
| `research`       | Real-time web + docs search         | Auto on "research..."     |
| `onboard`        | Project auto-setup + codebase scan  | `/onboard`                |
| `architecture`   | Generate/update ARCHITECTURE.md     | Auto on arch changes      |

Each chain follows the pattern:

```
Phase 1 --> [GATE: criteria met?] --> Phase 2 --> [GATE] --> ... --> Complete
```

If a gate fails, the chain stops and tells you what to fix before proceeding.

## Commands (30 manual triggers)

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `/warmup`          | Load project context, show task, git status |
| `/quick`           | Minimal - just current task                 |
| `/next [task]`     | Set new task                                |
| `/next done`       | Mark done, promote next                     |
| `/ship`            | Stage + commit + push                       |
| `/session-end`     | Extract insights before /clear              |
| `/check-design`    | Visual regression test                      |
| `/update-baseline` | Capture new design baselines                |
| `/debug`           | 8-step debugging framework                  |
| `/debt`            | Scan TODOs, update DEBT.md                  |
| `/strategy`        | 4-persona strategic analysis                |
| `/advisory-debate` | 5-expert deliberation                       |
| `/adr`             | Record Architecture Decision                |
| `/install`         | Auto-scaffold .claude/ for new projects     |
| `/init-memory`     | Initialize project memory files             |
| `/sync-vibe-setup` | Copy setup to ~/.claude/                    |
| `/audit-ecosystem` | Check installation health                   |
| `/audit-setup`     | Verify project setup                        |
| `/learn`           | Extract and save learnings                  |
| `/standup`         | Quick daily standup summary                 |
| `/ux-review`       | UX quality review                           |
| `/focus`           | Start timed deep work block                 |
| `/analyst`         | Requirements analysis                       |
| `/architect`       | System design                               |
| `/pm`              | Product brief creation                      |
| `/story`           | Create implementable story                  |
| `/story-check`     | Validate story completeness                 |
| `/quality-check`   | Run quality scan                            |
| `/refactor`        | Systematic refactoring                      |
| `/test`            | Run and analyze tests                       |

## Agents

| Agent      | Model  | Purpose                     | Tools                                                                  |
| ---------- | ------ | --------------------------- | ---------------------------------------------------------------------- |
| builder    | opus   | Implementation, writes code | Full access (Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch) |
| reviewer   | sonnet | Read-only code review       | Read-only (Read, Grep, Glob, Bash)                                     |
| researcher | haiku  | Web + docs research         | Search only (Read, WebSearch, WebFetch, Grep, Glob)                    |

## Hooks (automatic, deterministic)

| Hook Script          | Event                   | What it does                                                           |
| -------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `session-start.sh`   | SessionStart            | Inject project context, detect mode, show task + branch                |
| `damage-control.sh`  | PreToolUse(Bash)        | Block dangerous commands (rm -rf /, DROP TABLE, force push main, etc.) |
| `notion-reminder.sh` | UserPromptSubmit        | Remind to update Notion every 15 minutes                               |
| `security-scan.sh`   | PostToolUse(Edit/Write) | Detect hardcoded secrets and credentials                               |
| `quality-batch.sh`   | PostToolUse(Edit/Write) | Every 5 edits: check file sizes, `any` types, debug statements         |
| `quality-summary.sh` | Stop                    | Summarize findings + TTS alert for critical issues                     |

## File Structure

```
~/.claude/
├── CLAUDE.md              # Coding DNA (global rules)
├── settings.json          # Hooks + permissions
├── skills/                # Auto-triggered skill chains
│   ├── session-flow/      # Session lifecycle
│   ├── dev-pipeline/      # Feature development (7 phases)
│   ├── quality-chain/     # Code quality (6 phases)
│   ├── debug-chain/       # Debugging (7 phases)
│   ├── decision-chain/    # Strategic decisions (5 phases)
│   ├── plan/              # Task-level planning
│   ├── deploy-check/      # Post-deploy verification
│   ├── research/          # Web + docs research
│   ├── onboard/           # Project onboarding
│   └── architecture/      # Auto-generate ARCHITECTURE.md
├── agents/                # Specialized subagents
│   ├── builder.md         # Opus - full tool access
│   ├── reviewer.md        # Sonnet - read-only review
│   └── researcher.md      # Haiku - search only
├── commands/              # Manual slash commands (30 total)
│   ├── warmup.md
│   ├── ship.md
│   ├── install.md
│   └── ...
├── hooks/                 # Deterministic automation
│   ├── session-start.sh
│   ├── damage-control.sh
│   └── notion-reminder.sh
├── quality-state/         # Runtime state (auto-created)
│   ├── findings.jsonl
│   ├── edit-count
│   └── session-files
└── baselines/             # Visual regression screenshots

Per-project:
.claude/
├── CLAUDE.md              # Project DNA
├── NEXT.md                # Current task + queue
├── DEBT.md                # Technical debt
├── ARCHITECTURE.md        # Auto-generated architecture
├── settings.json          # Project hooks (security-scan, quality-batch, quality-summary)
├── features/              # Feature specs (primary tracking)
│   ├── F-001-feature.md
│   └── done/
├── decisions/             # Architecture Decision Records
│   ├── README.md
│   └── NNN-decision.md
└── hooks/                 # Project-level hooks
    ├── security-scan.sh
    ├── quality-batch.sh
    └── quality-summary.sh
```

## Installation

```bash
# One-time: Install the complete system
cd ~/Projects/amk-content/vibe-coding-setup
claude
/sync-vibe-setup           # Copies skills, agents, commands, hooks to ~/.claude/

# Per-project: Set up a new project
cd ~/Projects/my-project
claude
/install                   # Auto-detects stack, creates .claude/ files
```

## The Flow

```
cd my-project && claude     # Enter + auto-context (SessionStart hook)
/install                    # First time only
[describe what you need]    # Claude builds it
/ship                       # Commit + push + deploy
/session-end                # Extract learnings
/clear                      # Clean slate
```

## Workflow Modes (auto-detected)

| Mode     | Detection                             | Tracking               |
| -------- | ------------------------------------- | ---------------------- |
| BMM      | `docs/sprint-status.yaml` exists      | Sprint stories + epics |
| Features | `.claude/features/` exists with specs | Feature specs (F-XXX)  |
| Solo     | `.claude/NEXT.md` only                | Task queue             |

## Supported Stacks

| Layer           | Options                                  |
| --------------- | ---------------------------------------- |
| Frontend        | Next.js, SvelteKit, Astro                |
| Backend         | Supabase, Railway Postgres, Turso/libSQL |
| API             | GraphQL, REST                            |
| Deploy          | Vercel                                   |
| Package Manager | pnpm (preferred), yarn, npm              |

## Credits

Architecture inspired by:

- [IndyDevDan](https://youtube.com/@indydevdan) - Setup hooks, skill chains, multi-agent orchestration
- [Boris Cherny](https://howborisusesclaudecode.com) - Git worktrees, Plan mode, CLAUDE.md patterns
- [Matt Van Horn](https://github.com/mvanhorn/last30days-skill) - Real-time research skills
- [CodeBuff](https://codebuff.com) - Zero-friction setup, tree-based discovery
- [Official Claude Docs](https://code.claude.com/docs/en/skills) - SKILL.md format, hooks system

---

_Version: 3.0.0_
_Last updated: February 2026_
