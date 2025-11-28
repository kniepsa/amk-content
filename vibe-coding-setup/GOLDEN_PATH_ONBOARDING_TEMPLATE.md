# Golden Path Project - AI Onboarding Prompt

**Copy-paste this into Claude Code when starting work on `[PROJECT_NAME]`**

---

## 1. WHAT YOU'RE WORKING ON

You're working on **[PROJECT_NAME]**: [PROJECT_DESCRIPTION]

**Tech Stack**: [TECH_STACK]
**Deployment**: [DEPLOYMENT_INFO]
**Notion Teamspace**: [TEAMSPACE_NAME]
**Current Rock**: [ROCK_ID_OR_NONE]

---

## 2. GOLDEN PATH STRUCTURE

This project follows the **Golden Path** framework - a standardized structure for sustainable development speed.

### Core Memory Files

```
.claude/
├── CLAUDE.md          # Project DNA (invariants, stack preferences, gotchas)
├── NEXT.md            # Current work + roadmap (Now / Up Next / Done)
├── DEBT.md            # Technical debt tracker
├── GOLDEN_PATH.md     # Feature development patterns (optional)
├── commands/          # Custom slash commands (optional)
└── decisions/         # Architecture Decision Records (optional)
```

### What Each File Does

| File | Purpose | When to Read |
|------|---------|-------------|
| **CLAUDE.md** | Your source of truth for: invariants (never break these), stack preferences, gotchas (hard-won lessons), common commands | **Always read FIRST** at session start |
| **NEXT.md** | Current task in "Now" section, upcoming work in "Up Next", completed work in "Done (YYYY-MM)" | Read to know what to work on, update when tasks complete |
| **DEBT.md** | Known issues, technical debt, TODOs that didn't fit in current sprint | Read when planning refactors or investigating bugs |
| **GOLDEN_PATH.md** | Proven patterns for adding features correctly (if exists) | Read before implementing new features |
| **decisions/** | ADRs explaining why architectural choices were made | Read when questioning "why was this built this way?" |

---

## 3. HOW TO START

### Step 1: Run Warmup

```bash
/warmup
```

This command:
- Shows your current task from NEXT.md
- Displays git status
- Shows recent commits
- Loads project context

### Step 2: Validate Golden Path Setup

Check these files exist:
- [ ] `.claude/CLAUDE.md` exists
- [ ] `.claude/NEXT.md` exists
- [ ] `.claude/DEBT.md` exists
- [ ] Bash alias for this project is set up

If any are missing, run `/init-memory` to bootstrap the structure.

### Step 3: Read Project DNA

**ALWAYS read `.claude/CLAUDE.md` first**. It contains:
- **Invariants** - Rules you must NEVER break
- **Stack Preferences** - Technologies and patterns to use
- **Gotchas** - Hard-won lessons (bugs to avoid)
- **Commands** - How to run dev server, tests, builds
- **Workflow** - Git practices, commit patterns

**Command**:
```bash
# Read CLAUDE.md to understand the project
cat .claude/CLAUDE.md
```

---

## 4. DEVELOPMENT WORKFLOW

### Daily Flow

```
1. START  → /warmup (or project bash alias)
2. FOCUS  → /next [task description]
3. CODE   → Describe what you need
4. SHIP   → /ship (commit + push)
5. SYNC   → /shipped (update NEXT.md + Notion)
6. END    → /session-end (extract learnings)
```

### Key Commands

| Command | What It Does |
|---------|-------------|
| `/warmup` | Load context: current task, git status, recent commits |
| `/next [task]` | Set new "Now" task in NEXT.md |
| `/next done` | Mark current task done, promote next from queue |
| `/ship` | Stage all changes, commit with conventional message, push |
| `/shipped` | Mark tasks complete in NEXT.md, sync to Notion |
| `/session-end` | Extract insights, update gotchas, create ADRs |
| `/debt` | Scan for TODOs, update DEBT.md |
| `/adr` | Create Architecture Decision Record |

---

## 5. CRITICAL PATTERNS TO FOLLOW

### Pattern 1: Respect Invariants

**ALWAYS check `.claude/CLAUDE.md` for invariants**. These are rules you must NEVER break.

Common invariants across projects:
- TypeScript strict mode always
- Never skip database migrations
- Auth checks before mutations
- Environment variables for config (never hardcode)
- Feature branches, never force push main

**Your project's invariants**: [READ_FROM_CLAUDE_MD]

### Pattern 2: Use Existing Stack

**Don't introduce new technologies** without explicit user approval.

This project uses:
- [FRONTEND_STACK]
- [BACKEND_STACK]
- [DATABASE_STACK]
- [DEPLOYMENT_STACK]

If you need a new library, ask first.

### Pattern 3: Follow Golden Path Patterns

If `.claude/GOLDEN_PATH.md` exists, **read it before adding features**.

It contains:
- Proven patterns for common tasks
- Examples from this codebase
- Anti-patterns to avoid
- Pre-ship checklists

### Pattern 4: Update NEXT.md

When you complete a task:
```
1. Mark it [x] in "Done (YYYY-MM)" section
2. Move next task from "Up Next" → "Now"
3. Keep exactly 1 task in "Now", max 3 in "Up Next"
```

Or use `/shipped` to do this automatically.

### Pattern 5: Track Technical Debt

Don't leave TODOs in code comments. Instead:
```
1. Add to .claude/DEBT.md with context
2. Prioritize by impact (High/Medium/Low)
3. Link to code location (file:line)
```

Or use `/debt` to scan and update automatically.

---

## 6. ANTI-PATTERNS TO AVOID

### ❌ Don't: Ignore Gotchas in CLAUDE.md

Gotchas are **hard-won lessons** - bugs that already bit this project once.

**Example gotcha format**:
```markdown
## Gotchas (Hard-Won)
- Supabase RLS requires .select() after .insert() to return data
- Next.js caches aggressively - use revalidatePath()
- Prices as cents (integer), never float
```

**Do this**: Read gotchas section BEFORE implementing similar features.

### ❌ Don't: Skip Reading CLAUDE.md

Every session should start with:
```bash
cat .claude/CLAUDE.md
```

This is your **source of truth**. If you skip it, you'll:
- Violate invariants
- Repeat past mistakes
- Use wrong technologies
- Miss critical context

### ❌ Don't: Create Files Without Purpose

**Before creating any file**, ask:
- Does this belong in the project, or in `.claude/` docs?
- Is there an existing file I should edit instead?
- Will this file be maintained, or become stale?

**Golden path principle**: Prefer editing over creating.

### ❌ Don't: Leave Debug Code

Before `/ship`:
- [ ] No `console.log` statements
- [ ] No `alert()` calls
- [ ] No commented-out code blocks
- [ ] No `// TODO` comments (move to DEBT.md)

### ❌ Don't: Bypass the Workflow

**Always use the workflow**:
- Don't commit without `/ship` (ensures conventional commits)
- Don't close session without `/session-end` (loses insights)
- Don't start work without `/warmup` (missing context)

---

## 7. VALIDATION CHECKLIST

### Before Starting Work

- [ ] Ran `/warmup` or project bash alias
- [ ] Read `.claude/CLAUDE.md` (invariants, gotchas, stack)
- [ ] Read `.claude/NEXT.md` (know current task)
- [ ] Git status clean or understand uncommitted changes

### Before Shipping

- [ ] Current task actually complete (not partially done)
- [ ] No debug code left (`console.log`, `alert()`)
- [ ] Follows invariants from CLAUDE.md
- [ ] Doesn't repeat gotchas from CLAUDE.md
- [ ] Uses stack preferences (no random new libraries)
- [ ] Tests pass (if project has tests)

### After Shipping

- [ ] Ran `/shipped` to update NEXT.md
- [ ] Notion tasks synced (if teamspace configured)
- [ ] Next task promoted to "Now"
- [ ] Deployment succeeded (check Vercel/Railway/etc)

---

## 8. COMMON TASKS QUICK REFERENCE

### Task: Add a New Feature

```
1. Read .claude/GOLDEN_PATH.md (if exists) for feature patterns
2. Read .claude/CLAUDE.md for invariants and stack preferences
3. Implement following established patterns
4. Update .claude/NEXT.md when complete
5. Consider adding pattern to GOLDEN_PATH.md if novel
```

### Task: Fix a Bug

```
1. Check .claude/DEBT.md - is this a known issue?
2. Check .claude/CLAUDE.md gotchas - related to past bug?
3. Fix the bug
4. Add gotcha to CLAUDE.md if it's a footgun
5. Remove from DEBT.md if it was tracked there
```

### Task: Refactor Code

```
1. Read .claude/DEBT.md to understand known issues
2. Check .claude/decisions/ for architectural context
3. Don't break invariants from CLAUDE.md
4. Update DEBT.md to remove resolved items
5. Create ADR with /adr if architecture changes
```

### Task: Research / Spike

```
1. Set task: /next "Spike: [what you're exploring]"
2. Time-box the exploration (2-4 hours max)
3. Document findings in a decision/ ADR
4. Delete spike code or commit if keeping
5. Set next task: /next "Implement: [the approach]"
```

---

## 9. WHERE TO FIND INFORMATION

### "What's the tech stack?"
→ `.claude/CLAUDE.md` - Stack Preferences section

### "What should I never do?"
→ `.claude/CLAUDE.md` - Invariants section

### "What bugs should I watch out for?"
→ `.claude/CLAUDE.md` - Gotchas section

### "What should I work on?"
→ `.claude/NEXT.md` - Now section

### "What are known issues?"
→ `.claude/DEBT.md` - Full technical debt list

### "How do I add feature X correctly?"
→ `.claude/GOLDEN_PATH.md` - Feature patterns (if exists)

### "Why was this built this way?"
→ `.claude/decisions/` - Architecture Decision Records

### "How do I run dev server / tests / build?"
→ `.claude/CLAUDE.md` - Commands section

### "What's the deployment process?"
→ `.claude/CLAUDE.md` - Workflow section

### "How do I sync with Notion?"
→ `.claude/CLAUDE.md` - Notion section + `/shipped` command

---

## 10. PROJECT-SPECIFIC CONTEXT

### Current Priorities

**Now**: [CURRENT_TASK_FROM_NEXT_MD]

**Up Next**:
[UP_NEXT_TASKS_FROM_NEXT_MD]

### Active Blockers

[BLOCKERS_FROM_NEXT_MD_OR_DEBT_MD]

### Recent Wins

[DONE_SECTION_FROM_NEXT_MD]

### Tech Stack

[DETAILED_STACK_FROM_CLAUDE_MD]

### Invariants (Never Break These)

[INVARIANTS_FROM_CLAUDE_MD]

### Gotchas (Watch Out For These)

[GOTCHAS_FROM_CLAUDE_MD]

### Notion Integration

- **Teamspace**: [TEAMSPACE_NAME]
- **Rock ID**: [ROCK_ID_OR_NONE]
- **Sync Frequency**: Every 15-20 minutes or after completing features
- **Command**: `/shipped` (marks tasks complete, updates rock progress)

---

## 11. QUICK START CHECKLIST

Copy-paste this checklist into your session:

```
Session Start Checklist:
- [ ] Ran /warmup
- [ ] Read .claude/CLAUDE.md (invariants, gotchas, stack)
- [ ] Read .claude/NEXT.md (current task)
- [ ] Understand what I'm building
- [ ] Know what NOT to do (invariants + gotchas)

Development Checklist:
- [ ] Following established patterns
- [ ] Not violating invariants
- [ ] Not repeating gotchas
- [ ] Using correct stack (no random libraries)
- [ ] Writing clean code (no console.log, no TODOs)

Shipping Checklist:
- [ ] Task actually complete
- [ ] Tests pass (if applicable)
- [ ] No debug code
- [ ] Ran /ship (commit + push)
- [ ] Ran /shipped (update NEXT.md + Notion)
- [ ] Deployment succeeded

Session End Checklist:
- [ ] Ran /session-end (extract insights)
- [ ] Updated CLAUDE.md with new gotchas (if any)
- [ ] Created ADR for architectural decisions (if any)
- [ ] NEXT.md reflects actual state
- [ ] Notion synced
```

---

## 12. EMERGENCY REFERENCE

### "I don't know what to work on"
```bash
cat .claude/NEXT.md
# Read the "Now" section
```

### "I don't know the tech stack"
```bash
cat .claude/CLAUDE.md
# Read "Stack Preferences" section
```

### "I'm about to make a mistake"
```bash
cat .claude/CLAUDE.md
# Read "Invariants" and "Gotchas" sections
```

### "I broke something"
```bash
cat .claude/DEBT.md
# Check if it's a known issue with workaround
```

### "I made an architectural decision"
```bash
/adr
# Create Architecture Decision Record
```

### "I finished my task"
```bash
/shipped
# Updates NEXT.md and syncs Notion
```

---

**You're ready to start! Run `/warmup` and begin coding.**
