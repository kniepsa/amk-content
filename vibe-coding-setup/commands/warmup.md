Prime this vibe coding session:

## Mode Detection (Priority Order)

1. **BMM Mode**: `docs/sprint-status.yaml` exists
2. **Features Mode**: `.claude/features/` folder exists
3. **Solo Mode**: Only `.claude/NEXT.md` exists

---

## 1. BMM Mode (sprint-status.yaml)

- Parse YAML, find current `in_progress` story
- Display: "STORY: [story-id] - [title]"
- Show epic context: "[X/Y] stories done"

**Output:**

```
🔷 BMM Active
🎯 STORY: [epic-N-story-M] - [story title]
📦 EPIC: [epic-N] - [epic title] ([X/Y] stories done)

🌿 Branch: [branch] | Last: [last commit message]
📝 [X] uncommitted changes

What are we building?
```

---

## 2. Features Mode (.claude/features/)

- Read `.claude/NEXT.md` for current feature (Now section)
- Parse feature link to get F-XXX and read the spec
- Show feature description from spec
- List Up Next features

**Output:**

```
🎯 Features Mode
📋 NOW: F-XXX [Feature Name] (In Progress)
   [Description from feature spec]

📋 UP NEXT:
- F-YYY [Feature Name]
- F-ZZZ [Feature Name]

🌿 Branch: [branch] | Last: [last commit message]
📝 [X] uncommitted changes

What are we building?
```

**Feature Status Detection:**

- Read the feature spec's Success Criteria section
- Count checked `[x]` vs total `[ ]` items
- If some checked: "(3/5 criteria done)"
- If all checked: "(Ready to ship!)"

---

## 3. Solo Mode (NEXT.md only)

- Read `.claude/NEXT.md`
- Display current "Now" task
- List "Up Next" items

**Output:**

```
⚡ Solo Mode
🎯 NOW: [current task from NEXT.md]

📋 UP NEXT:
- [task 1]
- [task 2]

🌿 Branch: [branch] | Last: [last commit message]
📝 [X] uncommitted changes

What are we building?
```

---

## Git Status (all modes)

- Current branch
- Last 3 commits (one line each): `git log --oneline -3`
- Uncommitted changes count

---

## Quality Status

Check `~/.claude/quality-state/findings.jsonl` for accumulated quality issues:

1. Count findings by severity (critical, high, medium)
2. Display summary if issues exist

**If critical/high issues found:**

```
⚠️ QUALITY: [N] critical, [M] high issues
   Run /quality-check for details
```

**If clean:**

```
✅ Quality: Clean
```

**Skip silently if:** No findings file exists (fresh session)

---

## Notion Check (optional, non-blocking)

- Read `.claude/CLAUDE.md` for `notion_rock_id`
- If rock ID exists: Query rock via Notion MCP, show progress %
- If NO rock configured: Skip silently (don't clutter output)

---

## TTS Momentum Marker

After displaying the warmup summary, speak the focus:

```bash
.claude/hooks/play-tts.sh "[task/feature/story title] is your focus"
```

Keep the message short (under 100 characters). Examples:

- BMM: "Story 3: Add user auth is your focus"
- Features: "Invoice Parser is your focus"
- Solo: "Fix login bug is your focus"

---

## Power Keys (Quick Ref)

| Key          | Action                                           |
| ------------ | ------------------------------------------------ |
| Shift+Tab x2 | Auto-accept mode (Claude runs without asking)    |
| Ctrl+B       | Launch subagent in background                    |
| Ctrl+O       | Expand to see full agent output                  |
| /permissions | Pre-allow build/lint/test so Claude stops asking |
