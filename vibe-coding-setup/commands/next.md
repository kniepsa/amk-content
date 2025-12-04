Manage task focus with NEXT.md or BMM sprint-status integration:

## Mode Detection

1. **Check for BMM Sprint Context** (priority):
   - Look for `docs/sprint-status.yaml`
   - If found: Use BMM mode (sync with stories)
   - If not found: Use Solo mode (NEXT.md only)

---

## BMM Mode (when sprint-status.yaml exists)

**If no argument provided**: Show current story status
- Display current `in_progress` story from sprint-status.yaml
- Show story tasks/subtasks with completion status
- Show remaining stories in current epic

**If argument provided**:
- `done` → Mark current story as `completed` in sprint-status.yaml
  - Updates story status to "completed"
  - Shows next pending story in epic
  - If epic complete: Suggest `/session-end` for retrospective
- `[story-id]` → Set specific story as `in_progress`
  - Only allows setting stories within current epic
  - Validates story exists in sprint-status.yaml

**Output format (BMM)**:
```
🔷 BMM Active | Epic: [epic-N]

🎯 STORY: [story-id] - [title]
   ☐ Task 1
   ☑ Task 2 (done)
   ☐ Task 3

📋 UP NEXT in this epic:
- [story-id-2] - [title]
- [story-id-3] - [title]
```

---

## Solo Mode (when no sprint-status.yaml)

**If no argument provided**, show current NEXT.md status.

**If argument provided**, update NEXT.md:

1. Read current `.claude/NEXT.md`

2. Parse the action:
   - "done" or "complete" → Check off current "Now" item, promote first "Up Next" to "Now"
   - "add [task]" → Add to "Up Next" list (max 2 items in Up Next)
   - "[task description]" → Set as new "Now" (move old Now to Up Next)

3. Rules:
   - Max 1 item in "Now"
   - Max 2 items in "Up Next"
   - If adding would exceed, ask which to remove
   - Auto-prune completed items

4. Write updated NEXT.md

5. Confirm: "✓ Now: [task]"

**Output format (Solo)**:
```
⚡ Solo Mode

🎯 NOW: [current task]

📋 UP NEXT:
- [task 1]
- [task 2]
```

---

## Example Usage

**BMM Mode:**
- `/next` - Show current story and tasks
- `/next done` - Complete current story, show next
- `/next epic-1-story-3` - Jump to specific story

**Solo Mode:**
- `/next` - Show current status
- `/next done` - Complete current task
- `/next Fix auth bug` - Set as current focus
- `/next add Write tests` - Add to up next

---

## TTS Momentum Marker

After updating task/story, speak the new focus:
```bash
.claude/hooks/play-tts.sh "Now: [task/story title]"
```

Keep the message short (under 100 characters). Examples:
- Setting new task: "Now: Fix login bug"
- Completing task: "Done. Now: Write tests"
- BMM story: "Now: Story 3 Add user auth"
