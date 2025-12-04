Prime this vibe coding session:

1. **Check for BMM Sprint Context** (priority):
   - Look for `docs/sprint-status.yaml` (BMAD Method active)
   - If found: Parse YAML, find current `in_progress` story
   - Display: "STORY: [story-id] - [title]" instead of NEXT.md Now task
   - Also show epic context if available

2. **Show NEXT.md** (fallback if no sprint-status):
   - Read `.claude/NEXT.md`
   - Display current "Now" task prominently
   - List "Up Next" items

3. **Git Status** (brief):
   - Current branch
   - Last 3 commits (one line each): `git log --oneline -3`
   - Uncommitted changes count

4. **Notion Check** (non-blocking):
   - Read `.claude/CLAUDE.md` for `notion_rock_id`
   - If rock ID exists: Query rock via Notion MCP, show progress %
   - If NO rock configured: Show warning (don't block)

5. **Output Format** (with BMM context):
   ```
   🎯 STORY: [epic-N-story-M] - [story title]
   📦 EPIC: [epic-N] - [epic title] ([X/Y] stories done)

   🌿 Branch: [branch] | Last: [last commit message]
   📝 [X] uncommitted changes
   🎯 Rock: [rock name] ([progress]%) OR ⚠️ No Notion rock linked

   What are we building?
   ```

   **OR** (without BMM - solo mode):
   ```
   🎯 NOW: [current task from NEXT.md]

   📋 UP NEXT:
   - [task 1]
   - [task 2]

   🌿 Branch: [branch] | Last: [last commit message]
   📝 [X] uncommitted changes
   🎯 Rock: [rock name] ([progress]%) OR ⚠️ No Notion rock linked

   What are we building?
   ```

Keep it short. Get to work fast.

**If no Notion rock**: Don't block, just show:
`⚠️ No Notion rock linked. Consider creating one for tracking.`

**BMM Mode Indicator**:
- Show "🔷 BMM Active" when sprint-status.yaml exists
- Show "⚡ Solo Mode" when using NEXT.md only

## TTS Momentum Marker

After displaying the warmup summary, speak the focus:
```bash
.claude/hooks/play-tts.sh "[task/story title] is your focus"
```

Keep the message short (under 100 characters). Examples:
- BMM: "Story 3: Add user auth is your focus"
- Solo: "Fix login bug is your focus"
