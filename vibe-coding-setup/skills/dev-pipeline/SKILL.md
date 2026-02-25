---
name: dev-pipeline
description: Full feature development pipeline from requirements to deployment. Use when starting a new feature, building something complex, or when you need a structured approach. Triggers on "build feature", "new feature", "develop", "implement feature".
invocation: manual
---

# Feature Development Pipeline

Accept `$ARGUMENTS` as the feature name/description. If no arguments provided, ask: "What feature are we building?"

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command. This provides audio feedback at phase transitions.

---

## Mode Detection

Detect the active workflow mode before starting:

1. **BMM Mode**: `docs/sprint-status.yaml` exists
2. **Features Mode**: `.claude/features/` folder exists
3. **Solo Mode**: Only `.claude/NEXT.md` exists

Adapt phase outputs to match the detected mode.

---

## Phase Detection (Resume Support)

Before starting Phase 1, check if work already exists:

| Condition                                                | Start From        |
| -------------------------------------------------------- | ----------------- |
| `.claude/stories/*-$FEATURE.md` with Status: IN_PROGRESS | Phase 4 (BUILD)   |
| `.claude/stories/*-$FEATURE.md` with Status: DRAFT       | Phase 3 (PLAN)    |
| PM brief or architect output exists in conversation      | Phase 3 (PLAN)    |
| Feature spec exists in `.claude/features/`               | Phase 4 (BUILD)   |
| Nothing exists                                           | Phase 1 (CLARIFY) |

To skip phases for simple features, the user can say `skip to BUILD` or `skip to SHIP`.

---

## Pipeline Overview

```
Phase 1: CLARIFY  -----> [GATE: requirements clear?]
Phase 2: DESIGN   -----> [GATE: scope defined?]
Phase 3: PLAN     -----> [GATE: story validated?]
Phase 4: BUILD    -----> [GATE: tests pass?]
Phase 5: VERIFY   -----> [GATE: quality approved?]
Phase 6: SHIP     -----> [GATE: deployed?]
Phase 7: LEARN    -----> [complete]
```

---

## Phase 1: CLARIFY

**Goal**: Understand what we are building and why.

**Actions**:

1. Run the `/analyst` command with `$ARGUMENTS`
2. Extract: problem statement, scope boundaries, acceptance criteria
3. Confirm assumptions with user

**Validation Gate**:

- [ ] Problem statement is one sentence
- [ ] Scope has at least 2 "in scope" items
- [ ] At least 1 acceptance criterion exists
- [ ] User confirmed understanding

**TTS**: `"Requirements clarified. Moving to design."`

**On failure**: Ask clarifying questions. Do not proceed until gate passes.

---

## Phase 2: DESIGN

**Goal**: Product brief and system design.

**Actions**:

1. Run the `/pm` command to create product brief
2. Run the `/architect` command for system design
3. These run in sequence: PM first (what), then architect (how)

**Validation Gate**:

- [ ] MVP scope defined (must-have vs nice-to-have)
- [ ] Data model identified
- [ ] API endpoints listed (if applicable)
- [ ] Files to create/modify listed
- [ ] Edge cases documented

**TTS**: `"Design complete. Moving to planning."`

**On failure**: Revisit PM brief or architecture. Ask user which part needs work.

---

## Phase 3: PLAN

**Goal**: Create an implementable story with all context.

**Actions**:

1. Run the `/story` command with feature name to create story file
2. Run the `/story-check` command to validate completeness
3. If story-check fails, fix gaps and re-check

**Validation Gate** (via `/story-check`):

- [ ] Context, Problem, Solution sections filled
- [ ] Scope has 2+ concrete tasks
- [ ] Acceptance criteria in Given/When/Then format
- [ ] Files to touch identified
- [ ] A developer could implement without further questions

**TTS**: `"Story validated. Ready to build."`

**On failure**: Fill missing sections. Run `/story-check` again.

---

## Phase 4: BUILD

**Goal**: Implement the feature with quality built in.

**Actions**:

1. Set story status to IN_PROGRESS
2. Create feature branch (if Features mode): `git checkout -b feature/$FEATURE`
3. Implement according to story file, task by task
4. Write tests alongside implementation (TDD when possible)
5. Run `pnpm lint && pnpm typecheck` after each significant change
6. Commit atomically with conventional commit messages

**Build Checkpoints** (every 15-20 min):

- Update Notion progress via MCP (if `notion_rock_id` configured)
- Check: "Am I still on scope? Or am I gold-plating?"

**Validation Gate**:

- [ ] All scope items implemented
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] Tests written and passing
- [ ] No `any` types introduced

**TTS**: `"Build complete. Moving to verification."`

**On failure**: Fix lint/type errors. Add missing tests. Stay on scope.

---

## Phase 5: VERIFY

**Goal**: Comprehensive quality and UX verification.

**Actions**:

1. Run the `/test` command (unit + visual tests)
2. Run the `/quality-check` command (TypeScript, ESLint, file sizes)
3. Run the `/ux-review` command (if UI changes detected)

**Verification Matrix**:

| Check                 | Command          | Blocks Ship?        |
| --------------------- | ---------------- | ------------------- |
| Unit tests pass       | `/test`          | Yes                 |
| TypeScript strict     | `/quality-check` | Yes                 |
| ESLint clean          | `/quality-check` | Yes                 |
| No critical findings  | `/quality-check` | Yes                 |
| UX review pass        | `/ux-review`     | Yes (if UI changes) |
| `pnpm build` succeeds | manual           | Yes                 |

**Validation Gate**:

- [ ] All tests pass
- [ ] No critical quality findings
- [ ] UX review passed (or no UI changes)
- [ ] `pnpm build` succeeds

**TTS**: `"Verification passed. Ready to ship."`

**On failure**: Show specific failures. Fix and re-verify. Do not skip.

---

## Phase 6: SHIP

**Goal**: Commit, push, deploy.

**Actions**:

1. Run the `/ship` command
2. This handles: staging, conventional commit, push, PR creation (if feature branch), CI checks, merge

**Validation Gate**:

- [ ] Commit created
- [ ] Push succeeded
- [ ] CI checks passed (if configured)
- [ ] PR merged (if feature branch)

**TTS**: `"Shipped to production."`

**On failure**: Follow `/ship` error handling (merge conflicts, CI failures).

---

## Phase 7: LEARN

**Goal**: Extract and preserve session insights.

**Actions**:

1. Run the `/session-end` command
2. This handles: gotcha extraction, decision documentation, debt tracking, content ideas, feature verification

**Output**: Session end summary with all captured insights.

**TTS**: `"Session complete. Insights captured. Safe to clear."`

---

## Progress Display

Show this at each phase transition:

```
PIPELINE: $FEATURE_NAME
================================================
[x] CLARIFY   - Requirements understood
[x] DESIGN    - PM brief + architecture done
[>] PLAN      - Creating story...
[ ] BUILD     - Implementation
[ ] VERIFY    - Tests + quality + UX
[ ] SHIP      - Deploy to production
[ ] LEARN     - Extract insights
================================================
Phase 3 of 7 | Mode: Features
```

Legend: `[x]` = complete, `[>]` = active, `[ ]` = pending

---

## Quick Mode (Simple Features)

For small changes that do not need the full pipeline:

```
User: "build feature: add dark mode toggle"
Skip: CLARIFY, DESIGN, PLAN (too simple)
Start: BUILD -> VERIFY -> SHIP
```

Trigger quick mode when:

- Feature is a single-file change
- No database changes needed
- No API changes needed
- User says "quick" or "simple"

---

## Context Files

Read these for dynamic context:

```
context_files:
  - .claude/CLAUDE.md
  - .claude/NEXT.md
  - .claude/DEBT.md
  - .claude/stories/*.md (active story)
  - .claude/features/*.md (current feature spec)
  - docs/sprint-status.yaml (if BMM mode)
```

---

## Error Recovery

| Situation                 | Recovery                                             |
| ------------------------- | ---------------------------------------------------- |
| Phase fails validation    | Fix issues, re-run phase                             |
| User wants to skip phase  | Allow with warning, log skip reason                  |
| Context lost mid-pipeline | Re-read story file, resume from last completed phase |
| Build breaks              | Run `/debug` command, then resume BUILD phase        |
| Merge conflicts on ship   | Resolve conflicts, re-run SHIP phase                 |

---

## MCP Server Usage

| Phase   | MCP Servers                   |
| ------- | ----------------------------- |
| CLARIFY | context7 (docs lookup)        |
| DESIGN  | context7 (framework patterns) |
| BUILD   | context7, serper (debugging)  |
| VERIFY  | playwright (visual testing)   |
| SHIP    | github (PR creation)          |
| LEARN   | notion (progress sync)        |

See `skills/dev-pipeline/PHASES.md` for detailed phase descriptions.
