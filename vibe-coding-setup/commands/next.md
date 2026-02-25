Manage task focus with NEXT.md, features/, or BMM sprint-status integration:

## Mode Detection (Priority Order)

1. **BMM Mode**: `docs/sprint-status.yaml` exists
2. **Features Mode**: `.claude/features/` folder exists
3. **Solo Mode**: Only `.claude/NEXT.md` exists

---

## BMM Mode (sprint-status.yaml)

**No argument**: Show current story status

- Display current `in_progress` story from sprint-status.yaml
- Show story tasks/subtasks with completion status
- Show remaining stories in current epic

**With argument**:

- `done` → Mark current story as `completed`, show next pending story
- `[story-id]` → Set specific story as `in_progress`

**Output:**

```
🔷 BMM Active | Epic: [epic-N]

🎯 STORY: [story-id] - [title]
   [ ] Task 1
   [x] Task 2 (done)
   [ ] Task 3

📋 UP NEXT in this epic:
- [story-id-2] - [title]
- [story-id-3] - [title]
```

---

## Features Mode (.claude/features/)

**No argument**: Show current feature status

- Read `.claude/NEXT.md` for current "Now" feature
- Parse feature spec for success criteria progress
- Show Up Next features

**Output:**

```
🎯 Features Mode

📋 NOW: F-011 Invoice Parser (3/5 criteria done)
🌿 Branch: feature/F-011-invoice-parser

📋 UP NEXT:
- F-012 Price Checker
- F-013 Recipe Management
```

**With argument**:

- `done` → Mark current feature as done:
  1. Feature should be shipped via `/ship` (which handles PR + merge)
  2. If on feature branch: Warn "Use /ship to complete feature with PR"
  3. If already on main (post-merge):
     - Update spec status to "Done"
     - Move to `.claude/features/done/`
     - Promote first Up Next to Now
  4. TTS: "Done. Now: [next feature]"

- `F-XXX` → Set specific feature as Now (creates branch!):
  1. Save any uncommitted changes: `git stash`
  2. Switch to main and pull latest: `git checkout main && git pull`
  3. Create feature branch: `git checkout -b feature/F-XXX-kebab-name`
  4. Restore stash if any: `git stash pop`
  5. Move current Now to Up Next in NEXT.md
  6. Set F-XXX as new Now in NEXT.md
  7. Update feature spec status to "In Progress"
  8. TTS: "Now: [feature name]. Branch created."

- `start` (no feature specified) → Start next Up Next feature:
  1. Get first item from Up Next section
  2. Run same flow as `F-XXX` above

- `create "Feature Name"` → Create new feature (Claude fills from context):
  1. Find next available F-XXX number
  2. Generate kebab-case filename
  3. Auto-fill spec from conversation context:
     - Description from what was discussed
     - Schema from mentioned tables
     - Dependencies from mentioned features
     - Priority defaults to P1
  4. Add to NEXT.md as Up Next
  5. Output: "Created F-XXX: [Name]. Added to Up Next."

---

## Solo Mode (NEXT.md only)

**No argument**: Show current NEXT.md status

**With argument**:

- `done` or `complete` → Check off current "Now" item, promote first "Up Next"
- `add [task]` → Add to "Up Next" list (max 2 items)
- `[task description]` → Set as new "Now" (move old Now to Up Next)

**Rules:**

- Max 1 item in "Now"
- Max 2 items in "Up Next"
- If adding would exceed, ask which to remove
- Auto-prune completed items

**Output:**

```
⚡ Solo Mode

🎯 NOW: [current task]

📋 UP NEXT:
- [task 1]
- [task 2]
```

---

## Feature Creation (Features Mode Only)

When `/next create "Feature Name"` is called:

1. **Find next F-XXX**:
   - Scan BOTH `.claude/features/` AND `.claude/features/done/` for all F-XXX files
   - Find highest number across both folders
   - Increment by 1 (ensures unique numbers, never reuse done feature IDs)
2. **Generate filename**: `F-XXX-kebab-name.md`
3. **Auto-fill from conversation** (no questions!):

```markdown
# F-XXX: [Feature Name]

**Status:** Planned
**Priority:** P1
**Dependencies:** [detected from conversation or "None"]

## Description

[Summarized from conversation context]

## User Story

Als [detected role] kann ich [detected action], damit [detected benefit].

## Core Features

[Bullet points from conversation]

## Database Schema

[Tables mentioned or "No schema changes"]

## Success Criteria

- [ ] [Extracted from conversation]
- [ ] Tests pass
- [ ] Deployed to production
```

4. **Add to NEXT.md**: Insert in Up Next section
5. **Output**: "Created F-XXX: [Name]. Added to Up Next."

---

## TTS Momentum Marker

After updating task/feature/story:

```bash
.claude/hooks/play-tts.sh "Now: [title]"
```

Examples:

- Setting new task: "Now: Fix login bug"
- Completing task: "Done. Now: Write tests"
- Features: "Now: Invoice Parser"
- BMM story: "Now: Story 3 Add user auth"
