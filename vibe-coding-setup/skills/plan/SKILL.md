---
name: plan
description: Quick task-level planning before coding. Creates a lightweight implementation plan with files to change, approach, and risks. Use before starting any coding task to prevent wasted effort. Triggers on "plan this", "how should I approach", "before I start coding".
invocation: auto
---

# Task-Level Planning

Lightweight planning step before coding. Not the heavy `/architect` command, but a quick "here is what I am about to change" to prevent wasted effort and get alignment.

Accept `$ARGUMENTS` as the task description. If no arguments, read the current task from `.claude/NEXT.md`.

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command.

---

## When to Use

- Before starting any coding task
- When the approach is not immediately obvious
- When multiple files might need changes
- When you want alignment before investing time
- After `/warmup` or `/next`, before writing code

## When NOT to Use

- Single-line fixes (just do it)
- Typo corrections
- Obvious changes where the plan is clear
- Use `/architect` instead for complex multi-component features

---

## Planning Steps

### Step 1: Read the Task

Read the current task from one of these sources (in priority order):

1. `$ARGUMENTS` (if provided)
2. `.claude/NEXT.md` "Now" section
3. Active story in `.claude/stories/`
4. Active feature spec in `.claude/features/`

```
TASK: [task description from source]
SOURCE: [NEXT.md / story / feature spec / argument]
```

### Step 2: Identify Files to Change

Scan the codebase to find files that will need modification:

```
FILES TO CHANGE:
1. [path/to/file.ts] - [what needs to change and why]
2. [path/to/other.ts] - [what needs to change and why]
3. [path/to/new-file.ts] - [NEW: what this file will contain]
```

Also note files to read for context:

```
CONTEXT FILES (read but not modify):
- [path/to/related.ts] - [why it provides useful context]
```

### Step 3: Outline the Approach

3-5 bullet points describing HOW to implement:

```
APPROACH:
1. [First step - what to do and why]
2. [Second step]
3. [Third step]
4. [Fourth step (if needed)]
5. [Fifth step (if needed)]
```

### Step 4: List Risks and Edge Cases

```
RISKS:
- [Risk 1] -> Mitigation: [how to handle]
- [Risk 2] -> Mitigation: [how to handle]

EDGE CASES:
- [Edge case 1] -> Handle by: [approach]
- [Edge case 2] -> Handle by: [approach]
```

### Step 5: Estimate Scope

```
SCOPE: [Small / Medium / Large]

Small:  1-2 files, <30 min, low risk
Medium: 3-5 files, 30-90 min, some risk
Large:  6+ files, 90+ min, significant risk
        -> Consider using /architect instead
```

### Step 6: Ask for Approval

Present the plan and ask:

```
Proceed with this plan? [Y/n]
Or adjust: [describe what to change]
```

**Validation Gate**:

- [ ] Files to change identified
- [ ] Approach outlined (3-5 steps)
- [ ] Risks assessed
- [ ] Scope estimated
- [ ] User approved

**TTS**: `"Plan ready. Awaiting approval."`

---

## Output Format

```
PLAN: [task name]
================================================

TASK: [description]

FILES TO CHANGE:
1. [path] - [change description]
2. [path] - [change description]

APPROACH:
1. [step 1]
2. [step 2]
3. [step 3]

RISKS:
- [risk] -> [mitigation]

EDGE CASES:
- [case] -> [handling]

SCOPE: [Small/Medium/Large] (~[time] estimate)
================================================
Proceed? [Y/n]
```

---

## After Approval

Once the user approves:

1. Start implementing according to the plan
2. Follow the approach steps in order
3. If the plan changes during implementation, note the deviation
4. After completing, suggest running `/test` to verify

---

## Integration with Other Skills

| Transition                   | When                                        |
| ---------------------------- | ------------------------------------------- |
| Plan -> Build (dev-pipeline) | When plan is part of a larger feature       |
| Plan -> Code directly        | For standalone tasks                        |
| Plan -> `/architect`         | If scope turns out to be Large              |
| Plan -> `/analyst`           | If requirements are unclear during planning |

---

## MCP Server Usage

| Step     | MCP Servers                                       |
| -------- | ------------------------------------------------- |
| Read     | none (local file reads)                           |
| Identify | context7 (check framework APIs before estimating) |
| Risks    | serper (search for known issues with approach)    |

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md
  - .claude/NEXT.md
  - .claude/stories/*.md (active story)
  - .claude/features/*.md (current feature spec)
```
