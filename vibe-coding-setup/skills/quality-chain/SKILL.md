---
name: quality-chain
description: Systematic code quality improvement pipeline. Scans, identifies, plans, fixes, and verifies quality issues. Use when code quality needs attention, before major releases, or when technical debt is high. Triggers on "improve quality", "fix tech debt", "clean up code", "code quality".
invocation: manual
---

# Quality Improvement Chain

Systematic pipeline for scanning, identifying, prioritizing, fixing, and verifying code quality issues.

Accept `$ARGUMENTS` as an optional scope (file path, component name, or "all" for full project). Default: full project.

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command. This provides audio feedback at phase transitions.

---

## Pipeline Overview

```
SCAN  -->  IDENTIFY  -->  PLAN  -->  FIX  -->  VERIFY  -->  SHIP
  |           |            |         |          |           |
/quality   /debt        prioritize /refactor  /test      /ship
-check     scan         fixes      apply      verify     commit
```

---

## Phase 1: SCAN

**Goal**: Get a clear picture of current code quality.

**Actions**:

1. Run the `/quality-check` command for comprehensive scan
2. Run project build checks:
   ```
   pnpm lint 2>&1 | head -50
   pnpm typecheck 2>&1 | head -50
   ```
3. Check file sizes (files over 400 LOC)
4. Read accumulated findings from `~/.claude/quality-state/findings.jsonl`

**Output**:

```
QUALITY CHAIN: SCAN
================================================
[>] SCAN      - Analyzing codebase...
[ ] IDENTIFY  - Categorize issues
[ ] PLAN      - Prioritize fixes
[ ] FIX       - Apply improvements
[ ] VERIFY    - Confirm nothing broke
[ ] SHIP      - Commit with refactor: prefix
================================================

Scan Results:
- TypeScript errors: [N]
- ESLint violations: [N]
- Files over 400 LOC: [N]
- Critical findings: [N]
- High findings: [N]
- Medium findings: [N]
```

**Validation Gate**:

- [ ] Scan completed without errors
- [ ] Results categorized by severity

**TTS**: `"Quality scan complete. [N] issues found."`

---

## Phase 2: IDENTIFY

**Goal**: Categorize and catalog all quality issues.

**Actions**:

1. Run the `/debt` command to scan for TODO/FIXME/HACK/XXX
2. Cross-reference with existing DEBT.md entries
3. Categorize all findings:

| Category      | Sources                                  | Priority |
| ------------- | ---------------------------------------- | -------- |
| Security      | Secrets in code, missing auth checks     | Critical |
| Type Safety   | `any` usage, missing types               | High     |
| Code Size     | Files over 400 LOC                       | High     |
| Code Smells   | Deep nesting, duplication, magic numbers | Medium   |
| TODOs/FIXMEs  | Code comments indicating incomplete work | Medium   |
| Dead Code     | Unused imports, unreachable code         | Low      |
| Documentation | Missing JSDoc on exports                 | Low      |

**Output**:

```
QUALITY CHAIN: IDENTIFY
================================================
[x] SCAN      - [N] issues found
[>] IDENTIFY  - Categorizing...
[ ] PLAN      - Prioritize fixes
[ ] FIX       - Apply improvements
[ ] VERIFY    - Confirm nothing broke
[ ] SHIP      - Commit with refactor: prefix
================================================

Issue Catalog:
CRITICAL: [list with file:line]
HIGH:     [list with file:line]
MEDIUM:   [list with file:line]
LOW:      [list with file:line]

New debt items: [N]
Already tracked: [N]
```

**Validation Gate**:

- [ ] All issues categorized
- [ ] DEBT.md updated with new findings
- [ ] No duplicate entries

**TTS**: `"Issues categorized. [N] critical, [M] high."`

---

## Phase 3: PLAN

**Goal**: Create a prioritized fix plan.

**Actions**:

1. Sort issues: Critical first, then High, then Medium
2. Group by file (fix multiple issues per file in one pass)
3. Estimate scope per group:
   - Small: rename, type annotation, remove dead code
   - Medium: extract function, split component
   - Large: restructure module, change data flow
4. Create fix order that minimizes risk:
   - Type safety fixes first (safe, improves IDE support)
   - Then dead code removal (reduces surface area)
   - Then refactoring (higher risk, do last)

**Output**:

```
QUALITY CHAIN: PLAN
================================================
[x] SCAN      - [N] issues found
[x] IDENTIFY  - [N] categorized
[>] PLAN      - Creating fix plan...
[ ] FIX       - Apply improvements
[ ] VERIFY    - Confirm nothing broke
[ ] SHIP      - Commit with refactor: prefix
================================================

Fix Plan:
1. [CRITICAL] src/lib/config.ts - Remove hardcoded secret (Small)
2. [HIGH] src/components/Modal.tsx - Split into sub-components (Large)
3. [HIGH] src/lib/utils.ts - Replace 'any' with proper types (Medium)
4. [MEDIUM] src/hooks/useAuth.ts - Extract validation logic (Medium)

Estimated effort: [Small/Medium/Large]
Proceed with fixes? [Y/n]
```

**Validation Gate**:

- [ ] Plan reviewed by user
- [ ] User approved proceeding

**TTS**: `"Fix plan ready. [N] items to address."`

---

## Phase 4: FIX

**Goal**: Apply fixes systematically.

**Actions**:

1. For each fix in the plan:
   a. Run the `/refactor` command for the target file/module
   b. Apply the fix
   c. Run `pnpm lint && pnpm typecheck` after each fix
   d. Commit atomically: `git commit -m "refactor: [description]"`
2. Fix one category at a time (all type fixes, then all splits, etc.)
3. If a fix is risky, create a backup commit first

**Fix Patterns**:

| Issue                  | Fix Pattern                               |
| ---------------------- | ----------------------------------------- |
| `any` type             | Replace with `unknown` + type guard       |
| File over 400 LOC      | Extract sub-components or utility modules |
| Deep nesting           | Early returns, extract helper functions   |
| Duplicate code         | Extract shared function or component      |
| Magic numbers          | Extract to named constants                |
| Missing error handling | Add try/catch with user-friendly messages |
| Dead imports           | Remove unused imports                     |
| TODO/FIXME             | Either fix it or log to DEBT.md           |

**Progress Display**:

```
QUALITY CHAIN: FIX
================================================
[x] SCAN      - [N] issues found
[x] IDENTIFY  - [N] categorized
[x] PLAN      - [N] fixes planned
[>] FIX       - Applying... (3/7 done)
[ ] VERIFY    - Confirm nothing broke
[ ] SHIP      - Commit with refactor: prefix
================================================

Progress:
[x] src/lib/config.ts - Secret removed
[x] src/lib/utils.ts - Types fixed
[>] src/components/Modal.tsx - Splitting...
[ ] src/hooks/useAuth.ts - Pending
```

**Validation Gate**:

- [ ] Each fix committed atomically
- [ ] Lint passes after each fix
- [ ] Typecheck passes after each fix

**TTS**: `"Fix [N] of [M] applied."`

---

## Phase 5: VERIFY

**Goal**: Confirm fixes did not break anything.

**Actions**:

1. Run the `/test` command (full test suite)
2. Run `pnpm build` to verify production build
3. Run the `/quality-check` command again to confirm improvements
4. Compare before/after metrics

**Output**:

```
QUALITY CHAIN: VERIFY
================================================
[x] SCAN      - [N] issues found
[x] IDENTIFY  - [N] categorized
[x] PLAN      - [N] fixes planned
[x] FIX       - [N] fixes applied
[>] VERIFY    - Checking...
[ ] SHIP      - Commit with refactor: prefix
================================================

Before -> After:
- Critical issues: [N] -> [N]
- High issues: [N] -> [N]
- TypeScript errors: [N] -> [N]
- ESLint violations: [N] -> [N]
- Files over 400 LOC: [N] -> [N]

Tests: [passed/failed]
Build: [success/fail]
```

**Validation Gate**:

- [ ] All tests pass
- [ ] Build succeeds
- [ ] Issue count decreased (not increased)
- [ ] No regressions introduced

**TTS**: `"Verification passed. Quality improved."`

**On failure**: Identify which fix caused the regression. Revert that specific commit and re-verify.

---

## Phase 6: SHIP

**Goal**: Commit and deploy the quality improvements.

**Actions**:

1. If not already committed atomically, create a squash commit:
   ```
   refactor: improve code quality ([N] issues resolved)
   ```
2. Run the `/ship` command
3. Update DEBT.md: mark fixed items as resolved
4. Clear quality findings: `rm ~/.claude/quality-state/findings.jsonl`

**Output**:

```
QUALITY CHAIN: COMPLETE
================================================
[x] SCAN      - [N] issues found
[x] IDENTIFY  - [N] categorized
[x] PLAN      - [N] fixes planned
[x] FIX       - [N] fixes applied
[x] VERIFY    - All checks pass
[x] SHIP      - Deployed
================================================

Summary:
- Issues resolved: [N]
- Remaining: [N] (logged in DEBT.md)
- Quality score: [improved metric]
```

**TTS**: `"Quality improvements shipped. [N] issues resolved."`

---

## Mode Awareness

Adapt behavior to the active workflow mode:

- **BMM Mode**: Update sprint-status.yaml with quality metrics after SHIP
- **Features Mode**: Quality improvements can be tracked as a feature spec
- **Solo Mode**: Update DEBT.md only, lightweight tracking

---

## MCP Server Usage

| Phase    | MCP Servers                                   |
| -------- | --------------------------------------------- |
| SCAN     | context7 (check lint rule docs if unfamiliar) |
| IDENTIFY | none (internal analysis)                      |
| FIX      | context7 (refactoring patterns)               |
| VERIFY   | playwright (visual regression if UI changes)  |
| SHIP     | github (PR creation), notion (progress sync)  |

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md
  - .claude/DEBT.md
  - ~/.claude/quality-state/findings.jsonl
```
