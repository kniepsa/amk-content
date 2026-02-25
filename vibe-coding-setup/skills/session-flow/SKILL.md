---
name: session-flow
description: Manages the complete session lifecycle from warmup to close. Auto-suggests next steps based on current state. Use at session start or when unsure what to do next. Triggers on "start session", "what should I do", "what's next in the workflow".
invocation: auto
---

# Session Flow

Lightweight session lifecycle guidance. Auto-detects where you are and suggests the right next step.

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command. This provides audio feedback at phase transitions.

---

## State Detection

On invocation, detect the current session state by checking these signals:

| Signal                                     | State          | Suggested Action                   |
| ------------------------------------------ | -------------- | ---------------------------------- |
| No recent git activity, fresh conversation | FRESH START    | Run `/warmup` or `/quick`          |
| Warmup done, no task set                   | NEEDS FOCUS    | Run `/next` to set task            |
| Task set in NEXT.md, no code changes       | READY TO WORK  | Start coding or run `/plan`        |
| Active code changes, uncommitted           | MID-WORK       | Continue building                  |
| Tests passing, changes staged              | READY TO SHIP  | Run `/ship`                        |
| Just shipped, session winding down         | READY TO CLOSE | Run `/session-end`                 |
| Long session (>2 hours estimated)          | NEEDS BREAK    | Suggest break, then `/session-end` |

Detection logic:

1. Check `git log --oneline -1 --format=%ci` for last commit time
2. Check `git status --porcelain` for uncommitted changes
3. Check `.claude/NEXT.md` for current task
4. Check conversation length as session duration proxy

---

## Session Lifecycle

```
START  -->  FOCUS  -->  WORK  -->  VERIFY  -->  SHIP  -->  CLOSE
  |           |          |           |           |          |
/warmup    /next      [code]     /test       /ship    /session-end
/quick     /focus                /quality              /clear
```

---

## START Phase

**Goal**: Load context and get oriented.

Two options based on available time:

| Command   | When to Use                      | Duration |
| --------- | -------------------------------- | -------- |
| `/warmup` | Full session (30+ min available) | ~2 min   |
| `/quick`  | Quick fix or short session       | ~10 sec  |

**Validation Gate**:

- [ ] Context loaded (CLAUDE.md, NEXT.md read)
- [ ] Current branch and status known

**TTS**: `"Session started. Context loaded."`

After START, show:

```
SESSION FLOW
============================================
[x] START    - Context loaded
[ ] FOCUS    - Set your task
[ ] WORK     - Build it
[ ] VERIFY   - Test it
[ ] SHIP     - Deploy it
[ ] CLOSE    - Capture learnings
============================================
Suggested: Run /next to set your focus.
```

---

## FOCUS Phase

**Goal**: Set a clear task and enter deep work mode.

**Actions**:

1. Run `/next` to see or set current task
2. Optionally run `/focus` to start a timed deep work block
3. Optionally run the `plan` skill to create a lightweight implementation plan

**Validation Gate**:

- [ ] Task identified and named
- [ ] Implementation approach clear (or plan created)

**TTS**: `"Task set. Ready to build."`

After FOCUS, show:

```
SESSION FLOW
============================================
[x] START    - Context loaded
[x] FOCUS    - Task: [task name]
[>] WORK     - Building...
[ ] VERIFY   - Test it
[ ] SHIP     - Deploy it
[ ] CLOSE    - Capture learnings
============================================
Go build. I will remind you about Notion in 15 min.
```

---

## WORK Phase

**Goal**: Build the feature or fix.

During WORK:

- Code with Claude assistance
- If bugs encountered, suggest the `/debug` command
- If scope unclear, suggest the `/analyst` command
- If design unclear, suggest the `/architect` command
- If something non-trivial was just solved, suggest the `learn` skill to capture the pattern now while it's fresh

**Notion Reminder**: Every 15-20 minutes of active work, gently remind:

```
[Notion] 20 min since last update. Update progress?
```

Only show this if the project has `notion_rock_id` configured in `.claude/CLAUDE.md`.

---

## VERIFY Phase

**Goal**: Confirm quality before shipping.

Trigger VERIFY when:

- User says "done" or "ready to ship"
- Significant code changes are complete
- User asks "what next" after building

**Actions** (based on change scope):

| Change Scope                    | Actions                                   |
| ------------------------------- | ----------------------------------------- |
| Small fix (1-2 files)           | `pnpm lint && pnpm typecheck`             |
| Medium feature (3-10 files)     | `/test` + `/quality-check`                |
| Large feature (10+ files or UI) | `/test` + `/quality-check` + `/ux-review` |

**Validation Gate**:

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] Tests pass (if applicable)
- [ ] `pnpm build` succeeds

**TTS**: `"Verification passed. Ready to ship."`

After VERIFY, show:

```
SESSION FLOW
============================================
[x] START    - Context loaded
[x] FOCUS    - Task: [task name]
[x] WORK     - Built
[x] VERIFY   - Tests pass, quality clean
[>] SHIP     - Ready to deploy
[ ] CLOSE    - Capture learnings
============================================
Suggested: Run /ship to deploy.
```

---

## SHIP Phase

**Goal**: Deploy to production.

**Action**: Run the `/ship` command.

This handles staging, commit, push, PR (if feature branch), and deployment.

**Validation Gate**:

- [ ] Commit created with conventional message
- [ ] Push succeeded
- [ ] CI checks passed (if configured)

**TTS**: `"Shipped to production."`

---

## CLOSE Phase

**Goal**: Capture learnings and clean up.

**Action**: Run the `/session-end` command.

**Validation Gate**:

- [ ] Session-end completed successfully
- [ ] Gotchas captured (if any)
- [ ] NEXT.md updated

**TTS**: `"Session complete. Insights captured. Safe to clear."`

After session-end completes:

```
SESSION FLOW
============================================
[x] START    - Context loaded
[x] FOCUS    - Task: [task name]
[x] WORK     - Built
[x] VERIFY   - Quality verified
[x] SHIP     - Deployed
[x] CLOSE    - Learnings captured
============================================
Session complete. Safe to /clear.
```

---

## Auto-Suggestion Rules

When the user asks "what should I do?" or "what next?", determine the answer by session state:

1. **No context loaded** -> "Run `/warmup` to start your session."
2. **Context loaded, no task** -> "Run `/next` to set your focus."
3. **Task set, no changes** -> "Start coding! Or run the `plan` skill for a quick implementation plan."
4. **Changes made, not tested** -> "Run `/test` to verify your changes."
5. **Tests passing** -> "Run `/ship` to deploy."
6. **Just shipped** -> "Run `/session-end` to capture learnings, then `/clear`."
7. **Multiple ships done** -> "Consider running `/session-end` - productive session! Time to capture insights."

---

## Interruption Handling

If the user switches tasks mid-session:

1. Note the context switch (for session-end analysis)
2. Suggest committing current work: "Commit current progress before switching?"
3. Update NEXT.md with the new focus
4. Reset session flow to FOCUS phase for the new task

---

## Mode Awareness

Detect and respect the active mode:

- **BMM Mode**: Reference sprint stories, show epic progress
- **Features Mode**: Reference feature specs, show criteria progress
- **Solo Mode**: Reference NEXT.md tasks only

---

## MCP Server Usage

| Phase  | MCP Servers                               |
| ------ | ----------------------------------------- |
| START  | notion (check current rock/task progress) |
| WORK   | context7, serper (during development)     |
| VERIFY | playwright (visual testing if UI changes) |
| CLOSE  | notion (final progress sync)              |

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md
  - .claude/NEXT.md
  - .claude/DEBT.md
```
