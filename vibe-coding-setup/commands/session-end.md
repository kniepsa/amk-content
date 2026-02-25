# Session End (Smart Mode)

Automatically analyze this session and update memory files. Zero questions - all action.

---

## 1. Conversation Analysis

Scan the FULL conversation since session start. Extract insights automatically.

### 1.1 Extract Gotchas

**Patterns to detect:**

- "turns out...", "actually...", "the fix was..."
- "doesn't work because...", "must use X instead of Y"
- Error messages followed by solutions
- "gotcha:", "important:", "note:", "remember:"
- "the problem was...", "solved by..."

**For each found:**

1. Condense to one-line format: `- **Topic**: Description`
2. Read existing CLAUDE.md Gotchas section
3. Check for duplicates (semantic similarity):
   - If already covered → Skip (note in summary)
   - If similar but new info → Merge into existing entry
   - If new → Add to Gotchas section
4. Use condensed wording (max 150 chars per gotcha)

### 1.2 Extract Decisions

**Patterns to detect:**

- "decided to...", "going with...", "chose X over Y"
- "will use X because...", "better to...", "makes more sense to..."
- Trade-off discussions with clear outcome
- "the approach is...", "the pattern will be..."

**For significant decisions** (architectural, cross-cutting):

1. Create ADR in `.claude/decisions/`
2. Find next number: scan existing files, increment
3. Use format: `NNN-kebab-title.md`
4. Include: Context, Decision, Consequences

**For minor decisions:** Skip (not worth documenting)

### 1.3 Extract Debt

**Patterns to detect:**

- "TODO:", "FIXME:", "later:", "skip for now"
- "need to...", "should add...", "missing..."
- Acknowledged shortcuts or workarounds
- "not handling...", "ignoring for now..."

**For each found:**

1. Read existing DEBT.md
2. If already listed → Skip
3. If new → Add with priority estimate:
   - High: Blocks functionality or security issue
   - Medium: Should fix before shipping
   - Low: Nice to have, no urgency

### 1.4 Check Fixed Debt

**Scan conversation for fixes:**

- Look for resolved issues that match DEBT.md entries
- Check if debt items were addressed

**For each fixed item:**

1. Remove from DEBT.md (or move to "Resolved" section)
2. Note in summary: "✓ Resolved: [item]"

### 1.5 Extract Content Ideas

**Patterns to detect:**

- Workflow improvements or discoveries
- Tool configurations that worked well
- Architectural patterns with business value
- "interesting...", "could be an article..."
- Strategic pivots or insights

**For each found:**

1. Add to `~/projects/amk-content/articles/ideas.md`
2. Use standard format:

   ```markdown
   ## [Date] - [Title]

   **Category**: [Strategy | Tools | Architecture | Vibe Coding | GTM]
   **Hook**: [Why would an entrepreneur care?]
   **Key points**:

   - Point 1
   - Point 2
     **Presentation potential**: [Yes/No]
   ```

### 1.6 Update Architecture Diagram

**Check for `.claude/ARCHITECTURE.md`:**

1. **If doesn't exist** → Create with initial structure:

   ```markdown
   # Architecture Overview

   ## The Graph
   ```

   [User] → [Frontend] → [API Routes] → [Database]

   ```

   ## Key Services
   - **Service Name**: Brief description

   ## External Integrations
   - **Integration**: Purpose

   ## Data Flow
   Brief description of how data moves.

   *Last updated: [date]*
   ```

2. **If exists** → Scan conversation for:
   - New services added ("created parser service", "added auth")
   - New integrations ("connected to Stripe", "added Supabase")
   - Architecture changes ("moved X to Y", "split into microservices")
   - New data flows ("PDF → Parser → DB → Dashboard")

3. **Update rules**:
   - Add new components to existing sections
   - Don't remove existing components (they may still be valid)
   - Update "Last updated" timestamp
   - Keep diagrams simple (max 5 boxes per diagram)

4. **DO update for**:
   - New services/modules created
   - New external integrations added
   - Major data flow changes
   - New API routes with different purposes

5. **DON'T update for**:
   - Bug fixes
   - UI tweaks
   - Minor refactors
   - New components (unless architectural)

### 1.7 Verify Shipped Features (Playwright MCP)

**Check for shipped features this session:**

1. **Read shipped features** from `~/.claude/quality-state/shipped-this-session.jsonl`
   - If empty or doesn't exist → Skip (nothing shipped this session)

2. **For EACH shipped feature**:
   a. Read feature spec for success criteria
   b. Start dev server if not running: `npm run dev`
   c. **Verify each success criterion** via Playwright:
   - `browser_navigate` to relevant page
   - `browser_snapshot` to verify elements
   - `browser_click`, `browser_type` to test flows
   - `browser_console_messages` for errors

   d. **Run Logic Tests**:
   - Empty states: What happens with no data?
   - Error states: What if API fails?
   - Edge cases: Special characters, max length
   - Form validation: Required fields

   e. **Run Best Practices Check**:
   - Loading indicators present
   - Error messages user-friendly
   - Success feedback after actions
   - No console errors

3. **Output per feature**:

   ```
   🧪 FEATURE VERIFICATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   F-011 Invoice Parser:
   ✅ Criteria 1: Upload PDF → parsed correctly
   ✅ Criteria 2: Show preview before save
   ⚠️ Criteria 3: Validation errors
      → Missing: No error for negative amounts

   🔍 LOGIC TESTS:
   ✅ Empty states handled
   ⚠️ Error handling: Generic messages (improve)

   📋 BEST PRACTICES:
   ✅ Loading states present
   ⚠️ Missing keyboard shortcuts
   ```

4. **Actions for issues found**:
   - Add to NEXT.md "Up Next" for next session
   - Don't block session-end (already shipped)

5. **Clear shipped log**:
   ```bash
   rm ~/.claude/quality-state/shipped-this-session.jsonl
   ```

---

## 2. Feature Progress (auto-detect)

If `.claude/features/` exists:

1. **Get current feature** from NEXT.md "Now" section
2. **Read feature spec** for success criteria
3. **Analyze conversation** for completed work:
   - Match work done to success criteria
   - Auto-check `[x]` for completed items
4. **Update feature spec** with checked criteria
5. **If all criteria done**:
   - Update status to "Done"
   - Add completion date
   - Move to `features/done/`
   - Promote next feature to Now

---

## 3. Task Status (auto-update)

1. **Analyze accomplishments** in conversation
2. **Update NEXT.md**:
   - Mark completed items as `[x]`
   - Add discovered tasks to Up Next
3. **Prune Done section**:
   - Keep only last 10 items
   - Remove items older than 7 days (if dated)

---

## 4. Cleanup

### 4.1 Prune NEXT.md

- Maximum 10 items in Done section
- Keep recent, remove old

### 4.2 Check DEBT.md

- Remove items that were fixed this session
- Update priorities if context changed

### 4.3 Flag Outdated CLAUDE.md (optional)

If a gotcha references:

- Old library version that was updated
- Pattern that was superseded
  → Flag for manual review (don't auto-delete)

---

## 5. Output Summary

**Show actions taken, not questions to answer:**

```
Session End Summary
===================

📚 Knowledge:
  + Added: "[new gotcha description]"
  ~ Merged: "[updated existing gotcha]"
  - Skipped: "[already documented]"

🏗️ Decisions:
  + Created ADR-XXX: [title]

💳 Debt:
  + Added: [new debt item]
  ✓ Resolved: [fixed item] (removed from DEBT.md)

📋 Tasks:
  ✓ Completed: [task name]
  + Discovered: [new task]
  → Now: [current focus]

🎯 Feature:
  F-XXX: [name] (X/Y criteria done)

📝 Content:
  + Added idea: "[title]"

🏛️ Architecture:
  + Added: [new component]
  ~ Updated: [modified section]

🧪 Verification:
  F-XXX: ✅ 3/3 criteria passed
  F-YYY: ⚠️ 2/3 criteria (1 issue added to NEXT.md)

Safe to /clear. All insights preserved.
```

**If nothing significant:**

```
Session End Summary
===================

Light session - no significant changes detected.

Safe to /clear.
```

---

## 6. BMM Check (if active)

If `docs/sprint-status.yaml` exists:

1. Check epic completion status
2. If epic complete → Suggest retrospective
3. Update story status if needed

---

## 7. TTS Momentum Marker

```bash
.claude/hooks/play-tts.sh "Session complete. [N] insights captured."
```

Or if nothing captured:

```bash
.claude/hooks/play-tts.sh "Session complete."
```
