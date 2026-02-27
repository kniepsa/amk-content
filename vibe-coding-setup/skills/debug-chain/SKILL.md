---
name: debug-chain
description: Systematic debugging pipeline using Taylor Singh's 8-step framework. Guides through reproduce, isolate, hypothesize, fix, verify, document. Use when encountering bugs, unexpected behavior, or test failures. Triggers on "debug", "fix bug", "something is broken", "not working".
invocation: auto
---

# Debug Pipeline Chain

Systematic debugging pipeline based on Taylor Singh's 8-step framework. Guides you from symptom to root cause to verified fix.

Accept `$ARGUMENTS` as a description of the bug or unexpected behavior. If no arguments, ask: "What is broken? Describe the symptom."

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command. This provides audio feedback at phase transitions.

---

## Pipeline Overview

```
REPRODUCE --> ISOLATE --> HYPOTHESIZE --> FIX --> VERIFY --> DOCUMENT --> SHIP
     |           |            |           |        |           |          |
  confirm    narrow       rank by      minimal   tests     CLAUDE.md   /ship
  the bug    scope        likelihood   change    pass      DEBT.md     fix:
```

---

## Memory

If `execution/memory_ops.py` and `db/memory.db` exist in this project:

- **Before REPRODUCE**: `python3 execution/memory_ops.py search "<error-keywords>"` — check if this bug or root cause has been seen before.
- **After DOCUMENT**: `python3 execution/memory_ops.py log-run "debug-chain" "success" --notes "<root cause, fix applied>"`
- **Also log the learning**: `python3 execution/memory_ops.py add-learning "debug-chain" "<YYYY-MM-DD: what caused it, how fixed>"`

---

## Phase 1: REPRODUCE

**Goal**: Confirm the bug exists and can be triggered reliably.

**Actions**:

1. Document the reported symptom:
   ```
   SYMPTOM: [what the user described]
   EXPECTED: [what should happen]
   ACTUAL: [what actually happens]
   ```
2. Attempt to reproduce:
   - Run the failing test/command
   - Navigate to the failing page
   - Trigger the failing action
3. Record exact reproduction steps

**Output**:

```
DEBUG CHAIN: REPRODUCE
================================================
[>] REPRODUCE    - Confirming bug...
[ ] ISOLATE      - Narrow scope
[ ] HYPOTHESIZE  - Form theories
[ ] FIX          - Apply correction
[ ] VERIFY       - Confirm fix
[ ] DOCUMENT     - Record findings
[ ] SHIP         - Deploy fix
================================================

Bug: [symptom description]
Reproducible: [Yes/No/Intermittent]
Steps to reproduce:
1. [step]
2. [step]
3. [step]
Error: [exact error message if any]
```

**Validation Gate**:

- [ ] Bug reproduced at least once
- [ ] Steps documented clearly

**TTS**: `"Bug reproduced. Isolating."`

**If not reproducible**: Check environment differences, data state, race conditions. Document what was tried.

---

## Phase 2: ISOLATE

**Goal**: Narrow down to the specific file, function, or line causing the issue.

**Actions**:

1. **Check recent changes**: `git log --oneline -10` and `git diff HEAD~5`
2. **Binary search**: "When did this last work?" Consider `git bisect`.
3. **Narrow by layer**:

| Layer    | Check                           | Tool               |
| -------- | ------------------------------- | ------------------ |
| Frontend | Browser console, React DevTools | playwright MCP     |
| API      | Network tab, request/response   | playwright MCP     |
| Backend  | Server logs, error output       | Terminal           |
| Database | Query results, RLS policies     | Supabase dashboard |
| Config   | Environment variables, settings | `.env` files       |

4. **Create minimal reproduction**: Can you trigger it in isolation?

**Output**:

```
DEBUG CHAIN: ISOLATE
================================================
[x] REPRODUCE    - Bug confirmed
[>] ISOLATE      - Narrowing scope...
[ ] HYPOTHESIZE  - Form theories
[ ] FIX          - Apply correction
[ ] VERIFY       - Confirm fix
[ ] DOCUMENT     - Record findings
[ ] SHIP         - Deploy fix
================================================

Location: [file:line or component]
Layer: [Frontend/API/Backend/Database/Config]
Scope: [Single file / Cross-cutting / Infrastructure]
Last working: [commit hash or "unknown"]
```

**Validation Gate**:

- [ ] Problem narrowed to specific file or module
- [ ] Layer identified

**TTS**: `"Isolated to [file/component]. Forming hypotheses."`

---

## Phase 3: HYPOTHESIZE

**Goal**: Form ranked theories about the root cause.

**Actions**:

1. Based on the isolation, list possible causes:
   ```
   HYPOTHESES (ranked by likelihood):
   1. [Most likely] - Evidence: [why you think this]
   2. [Second]      - Evidence: [why you think this]
   3. [Edge case]   - Evidence: [why you think this]
   ```
2. For each hypothesis, define a quick test:
   ```
   H1 TEST: [what to check to confirm/eliminate]
   H2 TEST: [what to check to confirm/eliminate]
   H3 TEST: [what to check to confirm/eliminate]
   ```
3. Test hypotheses in order, starting with most likely

**Common Root Causes** (check these first):

| Category   | Common Issues                                           |
| ---------- | ------------------------------------------------------- |
| Next.js    | Caching (use `revalidatePath()`), hydration mismatch    |
| Supabase   | Missing RLS policy, `.error` not checked before `.data` |
| TypeScript | Type mismatch, implicit `any`, missing null check       |
| State      | Race condition, stale closure, missing dependency       |
| Config     | Wrong env variable, wrong port, missing API key         |
| Data       | Null/undefined field, wrong data format, empty result   |

**Output**:

```
DEBUG CHAIN: HYPOTHESIZE
================================================
[x] REPRODUCE    - Bug confirmed
[x] ISOLATE      - [file/component]
[>] HYPOTHESIZE  - Testing theories...
[ ] FIX          - Apply correction
[ ] VERIFY       - Confirm fix
[ ] DOCUMENT     - Record findings
[ ] SHIP         - Deploy fix
================================================

Testing H1: [hypothesis]
Result: [Confirmed / Eliminated]

Root cause: [identified cause]
```

**Validation Gate**:

- [ ] Root cause identified (not just symptoms)
- [ ] Evidence confirms the hypothesis

**TTS**: `"Root cause found. Applying fix."`

---

## Phase 4: FIX

**Goal**: Apply the minimal correct fix.

**Actions**:

1. Apply the smallest change that fixes the root cause
2. Avoid fixing symptoms (address the actual cause)
3. Add a guard or check to prevent recurrence where possible
4. If the fix introduces complexity, note it for future refactoring

**Fix Principles**:

- Minimal change: fix the bug, do not refactor while debugging
- One commit: the fix should be a single, reviewable change
- Guard against recurrence: add validation, null check, or test
- No side effects: the fix should not change unrelated behavior

**Output**:

```
DEBUG CHAIN: FIX
================================================
[x] REPRODUCE    - Bug confirmed
[x] ISOLATE      - [file/component]
[x] HYPOTHESIZE  - Root cause: [cause]
[>] FIX          - Applying...
[ ] VERIFY       - Confirm fix
[ ] DOCUMENT     - Record findings
[ ] SHIP         - Deploy fix
================================================

Fix applied in: [file:line]
Change: [brief description of what changed]
Guard: [what prevents recurrence]
```

**Validation Gate**:

- [ ] Fix is minimal (not a refactor)
- [ ] Fix addresses root cause (not symptoms)

**TTS**: `"Fix applied. Verifying."`

---

## Phase 5: VERIFY

**Goal**: Confirm the fix works and nothing else broke.

**Actions**:

1. Re-run the reproduction steps from Phase 1
2. Confirm the bug no longer occurs
3. Run related tests: `pnpm test`
4. Run full checks: `pnpm lint && pnpm typecheck`
5. Test edge cases near the fix
6. If UI fix: use playwright MCP for visual verification

**Verification Checklist**:

- [ ] Original bug no longer reproduces
- [ ] Related tests pass
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] No new console errors
- [ ] Edge cases near the fix work correctly

**Output**:

```
DEBUG CHAIN: VERIFY
================================================
[x] REPRODUCE    - Bug confirmed
[x] ISOLATE      - [file/component]
[x] HYPOTHESIZE  - Root cause: [cause]
[x] FIX          - Applied in [file]
[>] VERIFY       - Checking...
[ ] DOCUMENT     - Record findings
[ ] SHIP         - Deploy fix
================================================

Original bug: FIXED
Tests: [N] passed, [M] failed
Lint: [pass/fail]
Typecheck: [pass/fail]
Edge cases: [checked/found issues]
```

**Validation Gate**:

- [ ] Bug no longer reproduces
- [ ] All tests pass
- [ ] Lint and typecheck clean

**TTS**: `"Fix verified. Documenting."`

**On failure**: The fix is wrong or incomplete. Return to HYPOTHESIZE.

---

## Phase 6: DOCUMENT

**Goal**: Capture the learning so this bug never wastes time again.

**Actions**:

1. **CLAUDE.md gotcha** (if non-obvious root cause):
   ```
   - **[Topic]**: [One-line description of the gotcha]
   ```
2. **DEBT.md** (if technical debt was created by the fix):
   ```
   - [Medium] [description] - workaround from [date] debug session
   ```
3. **ADR** (if architectural insight gained):
   Run the `/adr` command with the decision
4. **Test** (if no test existed for this case):
   Write a regression test that fails without the fix

**Output**:

```
DEBUG CHAIN: DOCUMENT
================================================
[x] REPRODUCE    - Bug confirmed
[x] ISOLATE      - [file/component]
[x] HYPOTHESIZE  - Root cause: [cause]
[x] FIX          - Applied in [file]
[x] VERIFY       - All checks pass
[>] DOCUMENT     - Recording...
[ ] SHIP         - Deploy fix
================================================

Actions taken:
+ CLAUDE.md: Added "[gotcha description]"
+ Test: Added regression test in [test file]
~ DEBT.md: No new debt (or: Added [item])
```

**Validation Gate**:

- [ ] Gotcha recorded (if applicable)
- [ ] Regression test written (if applicable)

**TTS**: `"Documented. Ready to ship the fix."`

---

## Phase 7: SHIP

**Goal**: Deploy the fix.

**Actions**:

1. Stage the fix: `git add [changed files]`
2. Commit with fix prefix: `git commit -m "fix: [description of what was fixed]"`
3. Run the `/ship` command for push and deployment

**Output**:

```
DEBUG CHAIN: COMPLETE
================================================
[x] REPRODUCE    - Bug confirmed
[x] ISOLATE      - [file/component]
[x] HYPOTHESIZE  - Root cause: [cause]
[x] FIX          - Applied in [file]
[x] VERIFY       - All checks pass
[x] DOCUMENT     - Gotcha captured
[x] SHIP         - Fix deployed
================================================

Bug: [original symptom]
Root cause: [identified cause]
Fix: [what was changed]
Prevention: [guard or test added]
```

**TTS**: `"Bug fix shipped."`

---

## Anti-Patterns (Avoid These)

- Random changes hoping something works
- Fixing symptoms instead of root cause
- Not reproducing before attempting fix
- Skipping verification after fix
- Not documenting the gotcha for next time
- Refactoring during debugging (separate concerns)
- Changing multiple things at once (hard to isolate which fixed it)

---

## Quick Debug (Simple Issues)

For obvious bugs (typos, missing imports, wrong variable name):

```
Skip to: FIX -> VERIFY -> SHIP
No need for full REPRODUCE/ISOLATE/HYPOTHESIZE.
```

---

## MCP Server Usage

| Phase       | MCP Servers                                          |
| ----------- | ---------------------------------------------------- |
| REPRODUCE   | playwright (trigger bug in browser, capture console) |
| ISOLATE     | playwright (network tab, DOM inspection)             |
| HYPOTHESIZE | context7 (check framework docs for known issues)     |
| FIX         | serper (search for solutions if stuck)               |
| VERIFY      | playwright (visual verification for UI fixes)        |

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md (check existing gotchas first)
  - .claude/DEBT.md (check if this is known debt)
```

See `skills/debug-chain/FRAMEWORK.md` for the complete 8-step framework reference.
