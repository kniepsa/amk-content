Prime this vibe coding session:

1. **Show NEXT.md** (if exists):
   - Read `.claude/NEXT.md`
   - Display current "Now" task prominently
   - List "Up Next" items

2. **Git Status** (brief):
   - Current branch
   - Last 3 commits (one line each): `git log --oneline -3`
   - Uncommitted changes count

3. **Notion Check** (non-blocking):
   - Read `.claude/CLAUDE.md` for `notion_rock_id`
   - If rock ID exists: Query rock via Notion MCP, show progress %
   - If NO rock configured: Show warning (don't block)

4. **Output Format**:
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
