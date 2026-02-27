# Session: 2026-02-27 - SQLite Memory Layer for Vibe Coding Setup

## What We Accomplished

### 1. Implemented Nick Saraev's SQLite Memory Layer

Added full execution memory to vibe-coding-setup V3 so every project can accumulate real knowledge about itself across sessions.

**New files:**

- `templates/execution/memory_ops.py` — 9-command CLI (init, log-run, get-runs, search, add-entity, add-observation, read-graph, add-learning, get-learnings)
- `templates/.claude/db/.gitkeep` — placeholder for `db/` directory
- `templates/.gitignore` — `db/memory.db` + `.tmp/` entries

**Modified files:**

- `commands/init-memory.md` — steps 8-9: copy memory_ops.py + python init + gitignore
- `hooks/session-start.sh` — injects last 3 runs at session start if memory exists
- `commands/sync-vibe-setup.md` — push now includes `templates/execution/` → `~/.claude/templates/execution/`
- `skills/dev-pipeline/SKILL.md` — search before CLARIFY, log-run after LEARN
- `skills/debug-chain/SKILL.md` — search before REPRODUCE, log-run + add-learning after DOCUMENT
- `skills/learn/SKILL.md` — Step 5: write to SQLite before learnings.md
- `skills/session-flow/SKILL.md` — log-run "session" at CLOSE

### 2. Key Architectural Decisions

- Memory layer is **opt-in** — `/install` doesn't auto-add it; use `/init-memory` per project
- DB lives at `db/memory.db` relative to CWD (where Claude Code sessions are opened from)
- **Hub-level for multi-app businesses** — one shared memory > N per-project DBs
- `sync-vibe-setup push` gap fixed — execution templates now included

## Committed

Nothing committed this session (file edits only — no push)

## Context for Future Sessions

- Run `/sync-vibe-setup push` to deploy memory layer to `~/.claude/templates/`
- Then `/init-memory` in each project (or hub) where you want execution memory
- Printulu: run at hub level, not individual sub-repos

## Session Metrics

- Files created: 3
- Files modified: 7 (6 vibe-coding-setup + sync command)
- Gotchas: sync-vibe-setup gap (fixed in same session)
- Article ideas: 1 (self-annealing AI / SQLite memory)

---

# Session: 2026-02-26 - OpenClaw Deep-Dive + Stack Updates

## What We Accomplished

### 1. OpenClaw / Clawbot Research

- Watched + summarized Greg Eisenberg × Nick podcast on making money with OpenClaw
- Researched 25+ real use cases people are running (business automation, freelance/Upwork, content, sub-agents)
- Key finding: 5,705 community skills on ClawHub; 386 malicious ones found Feb 2026 — vet before installing
- Creator: Peter Steinberger joined OpenAI Feb 14; project moved to open-source foundation

### 2. Automation Stack Decision Framework

- Clawbot vs Trigger.dev vs N8N decision framework developed
- Clawbot: computer-use/UI, messaging interface, best-effort
- Trigger.dev: code-first, durable, AI agent loops with Claude Agent SDK
- N8N: non-technical operators, 400+ pre-auth'd OAuth connectors, visual debugging
- Key rule: "who maintains it after you build it?" → non-dev = N8N, dev = Trigger.dev

### 3. Trigger.dev AI Agents

- Confirmed: yes, you can build Clawbot-style decision loops on Trigger.dev
- Two approaches: Claude Agent SDK (`query()` loop) or Vercel AI SDK (`generateText` + `maxSteps`)
- Trigger.dev adds: durable execution, retries, queues, human-in-the-loop gates

### 4. Stack Updates (/last30days)

- Next.js 16: 6 breaking changes documented (middleware→proxy, revalidateTag signature, serverRuntimeConfig removed, next lint removed, parallel routes default.js required, Node 18 dropped)
- Vercel: now.json removed March 31 2026
- Supabase: pg_graphql disabled by default on new projects

## Committed

- `553ae4e` — docs: add Trigger.dev v4 npm package name trap article idea

## Context for Future Sessions

- Next.js 16 gotchas added to ~/.claude/CLAUDE.md
- Article idea added: "Clawbot vs Trigger.dev vs N8N: The 2026 Automation Stack Decision Framework"
- OpenClaw ban wave on Upwork — ToS risk for the "Upwork automation" angle

## Session Metrics

- Commits: 2 (session-end from previous + new article idea)
- Gotchas added: 9 (6 Next.js 16, 1 automation tools, 1 Vercel, 1 Supabase)
- Article ideas added: 2 (Clawbot framework + Trigger.dev npm trap — was already committed)

---

# Session: 2026-02-25 - Vibe Coding Setup V3 Targeted Improvements + Ship

## What We Accomplished

### 1. Five Targeted Improvements to Vibe Coding Setup

Applied best-in-class fixes to the V3 system before the big ship commit:

**Fix 1: last30days Skill — Real Web Search**

- File: `vibe-coding-setup/skills/research.md`
- Problem: last30days pattern was using context7 (docs lookup) instead of actual web search
- Fix: Updated to use `WebSearch` + `serper` for real-time results, not documentation lookup

**Fix 2: Researcher Agent — Model Correction**

- File: `vibe-coding-setup/agents/researcher.md`
- Problem: Researcher was using claude-opus-4-6 (expensive, overkill for search tasks)
- Fix: Corrected to claude-haiku-3-5 — right tool, right cost, faster responses

**Fix 3: CLAUDE.md Gotchas — 4 New Production Insights**

- File: `vibe-coding-setup/CLAUDE.md`
- Added: Compact at 70% context (not 90%) — quality degrades before hard limit
- Added: `.claudeignore` node_modules / .next / dist → 40%+ token savings
- Added: Two-Correction Rule — if Claude misses twice on same issue, /clear and rewrite
- Added: Interview Pattern — for complex features, have Claude interview you first in dedicated session

**Fix 4: /warmup Command — Power User Keys**

- File: `vibe-coding-setup/commands/warmup.md`
- Added keyboard shortcut reference block at top of every warmup output
- Shortcuts included: Shift+Tab (auto-accept), Ctrl+R (interrupt), # (memory), / (commands), @ (files), Plan mode

**Fix 5: New /worktree Command**

- File: `vibe-coding-setup/commands/worktree.md` (new)
- Pattern from Boris Cherny (Claude Code creator): parallel branches in separate worktrees
- Lets you build feature A in one window while Claude tests in another — no stash/switch friction

### 2. Shipped V3 System

- Commit: `6af0427 chore: ship vibe-coding-setup V3 with best-in-class fixes`
- 98 files committed across skills/, agents/, commands/, hooks/, templates/, decisions/
- Pushed to origin (kniepsa/amk-content)

## Decisions Made

### Minimal — No architectural decisions this session

Session was execution-focused (5 targeted improvements + ship). No major decisions to ADR.

## Files Created/Modified

### Modified:

1. `vibe-coding-setup/skills/research.md` — WebSearch fix
2. `vibe-coding-setup/agents/researcher.md` — Model fix
3. `vibe-coding-setup/CLAUDE.md` — 4 new gotchas
4. `vibe-coding-setup/commands/warmup.md` — power keys block

### Created:

1. `vibe-coding-setup/commands/worktree.md` — new parallel worktree command

### Committed:

- `6af0427` — chore: ship vibe-coding-setup V3 with best-in-class fixes (98 files)

## Context for Future Sessions

### V3 Status: SHIPPED

- Full system committed and pushed
- Next: Test /install multi-app flow on real business (Printulu or Bonn Gastro)

### Key Files

- `vibe-coding-setup/VIBE-CODING-GUIDE-V3.md` — methodology overview
- `vibe-coding-setup/skills/` — 10 auto-triggered skill chains
- `vibe-coding-setup/agents/` — builder (opus), reviewer (sonnet), researcher (haiku)
- `vibe-coding-setup/commands/` — 30+ manual slash commands including new /worktree

## Session Metrics

- Duration: ~1 hour
- Files modified: 4 (targeted fixes)
- Files created: 1 (/worktree command)
- Commits: 1 (98 files — V3 ship)
- Insights captured: 4 new gotchas (context window, claudeignore, two-correction rule, interview pattern)
