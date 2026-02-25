# Ship to Production

Quick ship to production with one command. Handles feature branches with PR flow.

## Branch Detection

1. **Check current branch**: `git branch --show-current`
2. **Detect branch type**:
   - `main` or `master` → Direct ship flow
   - Any other branch → PR flow (feature branch)

---

## Feature Branch Flow (PR)

If NOT on main/master:

### 1. Pre-Flight Checks

```
🔀 Feature Branch: [branch-name]

Checking PR readiness...
[x] Changes committed
[x] Branch up to date with main
[x] No merge conflicts
```

### 1b. Quality Guardian Check

Read `~/.claude/quality-state/findings.jsonl`:

```
🛡️ Quality Guardian
━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] Security scan: ✅ Clean
[x] Code size: ✅ All files under limit
[x] TypeScript: ✅ No 'any' usage
[ ] Proceed to PR?
```

- **CRITICAL findings** → BLOCK, must fix before PR
- **HIGH findings** → WARN, allow with acknowledgment
- **MEDIUM/LOW** → Display but don't block

### 2. Sync with Main

```bash
git fetch origin main
git merge origin/main --no-edit
```

- If conflicts → STOP and show conflicts
- If clean → Continue

### 3. Push Branch

```bash
git push -u origin [branch-name]
```

### 4. Create/Update PR

Check if PR already exists:

```bash
gh pr list --head [branch-name]
```

- If NO PR exists → Create one:

  ```bash
  gh pr create --title "[conventional commit title]" --body "[auto-generated from commits]"
  ```

- If PR exists → Show PR status

### 5. Wait for CI (if configured)

```bash
gh pr checks [pr-number]
```

- If checks passing → Ready to merge
- If checks failing → Show failures, STOP

### 6. Merge to Main

```bash
gh pr merge [pr-number] --squash --delete-branch
```

### 7. Switch to Main and Pull

```bash
git checkout main
git pull origin main
```

### Output (Feature Branch):

```
🔀 Shipping feature branch: feature/price-checker

[x] Synced with main (no conflicts)
[x] Pushed to origin/feature/price-checker
[x] PR #42 created: "feat: add price checker dashboard"
[x] CI checks passed
[x] Merged to main (squash)
[x] Branch deleted

Deployed! Vercel will build at: https://vercel.com/[project]

🎯 Features: F-012 Price Checker (5/5 criteria done)
🎯 F-012 complete! Moved to done/
📋 Now: F-013 Recipe Management
```

---

## Main Branch Flow (Direct Ship)

If on main/master:

### 1. Pre-Flight: Quality Guardian Check

Read `~/.claude/quality-state/findings.jsonl`:

```
🛡️ Quality Guardian
━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] Security scan: ✅ Clean
[x] Code size: ✅ All files under limit
[x] TypeScript: ✅ No 'any' usage
```

- **CRITICAL findings** → BLOCK ship, show issues
- **HIGH findings** → WARN but allow to proceed
- **MEDIUM/LOW** → Display but don't block

### 2. Pre-Flight: UX Guardian Check (Joe Gebbia)

**BEFORE any git operations**, perform UX Guardian review:

1. **Scan changed files** for UI/UX changes:
   - Look for `.svelte`, `.tsx`, `.jsx`, `.css`, `.scss` files in the changeset
   - Check for component changes, style changes, new UI elements

2. **If UI/UX changes detected**, invoke Joe Gebbia's review:

   ```
   🎨 UX Guardian Review (Joe Gebbia)

   Scanning changes for UX impact...

   ### Technical UX Checklist
   - [ ] Touch targets ≥44px on interactive elements
   - [ ] Loading states for async operations
   - [ ] Error messages guide user recovery
   - [ ] Form labels and validation present
   - [ ] No layout shift during load
   ```

3. **BLOCK if UX blockers found**:

   ```
   🛑 BLOCKED: Cannot ship with UX issues

   Blocker: [specific issue with fix recommendation]

   Fix the issue, then run /ship again.
   ```

4. **Proceed if passing**:
   ```
   ✅ UX Guardian: Passed
   ```

### 3. Stage, Commit, Push

1. Stage all changes: `git add .`
2. Create conventional commit message:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code refactoring
   - `style:` for formatting changes
   - `docs:` for documentation
   - `chore:` for maintenance tasks
3. Commit with the generated message
4. Push to remote (triggers pre-push validation)

### Output (Main Branch):

```
Shipping to production...
[x] Changes staged
[x] Committed: "feat: [description]"
[x] Pushed to main
[x] Pre-push validation passed

Deployed! Vercel will build at: https://vercel.com/[project]
```

---

## Post-Ship: Mode Integrations

### BMM Mode (sprint-status.yaml)

If `docs/sprint-status.yaml` exists:

1. After successful push, update current story status to `completed`
2. Show progress: "[X/Y] stories done in epic"
3. If epic complete: Suggest `/session-end` for retrospective

### Features Mode (.claude/features/)

If `.claude/features/` exists:

1. **Log shipped feature** (for session-end verification):

   ```bash
   mkdir -p ~/.claude/quality-state
   echo '{"timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","feature":"F-XXX","name":"Feature Name","spec":".claude/features/F-XXX-name.md"}' >> ~/.claude/quality-state/shipped-this-session.jsonl
   ```

2. **Read current feature** from NEXT.md "Now" section
3. **Check success criteria** in feature spec:
   - Count `[x]` (checked) vs `[ ]` (unchecked) items
   - If ALL checked → Feature is complete!

4. **If feature complete**:

   ```
   🎯 F-011 Invoice Parser: All success criteria met!
   [Moving to features/done/]
   [Promoting F-012 to Now]
   ```

   - Update spec status to "Done"
   - Add completion date
   - Move to `.claude/features/done/`
   - Update NEXT.md: promote next Up Next to Now

5. **If feature in progress**:
   ```
   🎯 F-011 Invoice Parser: 3/5 criteria done
   ```

**Note**: Playwright verification runs on `/session-end`, not here. Ship fast, verify later.

### Notion Auto-Sync

If `.claude/CLAUDE.md` contains `notion_features_db`:

1. **Silently sync** all features to Notion after successful push
2. For each feature in `.claude/features/`:
   - Parse: Feature ID, Status, Priority, Description
   - If exists in Notion → Update status
   - If new → Create page
3. No output unless error

---

## Error Handling

### Merge Conflicts

```
🛑 BLOCKED: Merge conflicts with main

Conflicts in:
- src/lib/components/PriceChecker.svelte
- src/routes/api/prices/+server.ts

Resolve conflicts, then run /ship again.
```

### CI Failures

```
🛑 BLOCKED: CI checks failing

Failed checks:
- lint: 2 errors in src/lib/utils.ts
- typecheck: Type error in PriceChecker.svelte

Fix issues, push, then run /ship again.
```

### Nothing to Ship

```
Nothing to ship. Working tree clean.
```

---

## TTS Momentum Marker

After successful ship:

```bash
.claude/hooks/play-tts.sh "Shipped."
```

If feature completed:

```bash
.claude/hooks/play-tts.sh "Feature complete. Shipped."
```

If PR created (not yet merged):

```bash
.claude/hooks/play-tts.sh "PR created. Waiting for review."
```

On failure:

```bash
.claude/hooks/play-tts.sh "Ship failed. Check the errors."
```
