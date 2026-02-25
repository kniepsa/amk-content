# Focus Mode

Deep work session starten. Minimale Ablenkung, maximaler Output.

## Usage

- `/focus` - Start 45 min focus block (default)
- `/focus 25` - Start 25 min (pomodoro)
- `/focus off` - End focus mode early

## Instructions

1. **Read current task** from `.claude/NEXT.md` (Now section)

2. **Clear output** - Fresh start

3. **Display focus view:**

   ```
   🎯 FOCUS MODE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Task: [current NEXT.md "Now" task]
   Timer: [X] minutes
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   No distractions. Ship it.
   ```

4. **TTS announcement:**

   ```bash
   say "Focus mode. [X] minutes on [task summary]."
   ```

5. **Set reminder** (optional - if system supports):
   - After timer: TTS "Focus block complete. Take a break."

## Focus Rules

During focus mode:

- Only work on the stated task
- No context switching
- No "quick fixes" on other things
- Ship something before the timer ends

## Exit Conditions

Focus ends when:

- Timer expires
- User runs `/focus off`
- Task is shipped (`/ship`)

## Integration

- Works with `/warmup` task detection
- Respects BMM sprint context if active
- Pairs well with `/ship` at end of block
