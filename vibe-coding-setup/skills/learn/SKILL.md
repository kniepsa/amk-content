---
name: learn
description: Extract patterns from recent work to improve workflow. Captures problem-solution pairs into .claude/learnings.md for future reference. Use after solving something non-trivial. Triggers on "capture this", "remember how we solved", "document this pattern", "add to learnings".
invocation: auto
---

# Learn — Pattern Capture

Intentionally document a solved problem as a reusable pattern. Faster than session-end, more structured than memory — designed for mid-session capture when a solution is still fresh.

Accept `$ARGUMENTS` as a description of what was solved. If no arguments, infer from recent conversation.

---

## TTS Notifications

All `**TTS**` markers should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say`.

---

## When to Use

- Just solved something non-trivial and want to capture it now (not at session-end)
- Found a pattern worth reusing across projects
- Hit a gotcha that took more than 10 minutes to debug
- Discovered the "right way" to do something in the stack

## When NOT to Use

- Trivial fixes (use session-end auto-extraction instead)
- Pure context notes (use NEXT.md instead)
- Cross-session workflow insights (use MEMORY.md instead)

---

## Capture Steps

### Step 1: Identify the Problem

From `$ARGUMENTS` or recent conversation, identify:

```
PROBLEM: [What broke or wasn't working?]
CONTEXT: [Where in the stack? Next.js / Supabase / TypeScript / Vercel / etc.]
```

If the problem isn't clear from arguments, ask one question:

> "What problem did we just solve?"

### Step 2: Extract the Solution

From the conversation, extract the actual fix:

```
SOLUTION: [What was the fix?]
WHY IT WORKS: [Why does this solve the problem? What was the root cause?]
```

### Step 3: Derive the Reusable Pattern

This is the key step compound engineering teaches — generalize the specific fix into a reusable rule:

```
PATTERN: [Complete this: "When X happens, always Y because Z"]
APPLIES TO: [This project only / All Next.js projects / All Supabase projects / Universal]
```

### Step 4: Tag and Domain-Label

Assign tags for future searchability:

```
DOMAIN: [Next.js | Supabase | TypeScript | React | Tailwind | Vercel | Auth | Payments | General]
TAGS: [#tag1 #tag2 #tag3]
```

Common tags: `#rls #auth #server-components #server-actions #caching #types #migration #edge-runtime #shadcn`

### Step 5: Write to learnings.md

Append the entry to `.claude/learnings.md` in the current project:

```markdown
## [YYYY-MM-DD] - [Short title]

**Domain**: [domain]
**Tags**: [#tag1 #tag2]

**Problem**: [What broke or wasn't working]

**Solution**: [The actual fix]

**Why it works**: [Root cause explanation]

**Pattern**: [Reusable rule: "When X, always Y because Z"]

**Scope**: [This project / All Next.js projects / Universal]
```

If `.claude/learnings.md` doesn't exist, create it with this header first:

```markdown
# Project Learnings

Problem-solution pairs captured during development. Searchable by domain and tag.
Each entry generalizes a specific fix into a reusable pattern.

---
```

### Step 6: Offer Gotcha Promotion

If the pattern is universal (applies beyond this project):

```
Promote to CLAUDE.md Gotchas? This pattern applies to all [domain] projects.
[Y/n]
```

If yes: append to the Gotchas section of the nearest `.claude/CLAUDE.md` in condensed format:
`- **[Topic]**: [Pattern in ≤120 chars]`

**Validation Gate**:

- [ ] Problem clearly stated
- [ ] Solution captured
- [ ] Reusable pattern derived (not just "the fix was X")
- [ ] Entry written to `.claude/learnings.md`

**TTS**: `"Pattern captured. Learnings updated."`

---

## Output Format

```
LEARN: [title]
================================================

PROBLEM: [what was broken]

SOLUTION: [the fix]

PATTERN: [reusable rule]

DOMAIN: [domain] | TAGS: [#tags]
SCOPE: [This project / All Next.js / Universal]

Written to: .claude/learnings.md
[Promoted to CLAUDE.md Gotchas: yes/no]
================================================
```

---

## Integration

| From        | When                                              |
| ----------- | ------------------------------------------------- |
| Mid-session | Right after solving something hard                |
| session-end | Auto-extracts gotchas, /learn captures patterns   |
| MEMORY.md   | Cross-project workflow insights (different scope) |
| CLAUDE.md   | Promoted patterns become permanent gotchas        |

The difference:

- **CLAUDE.md Gotchas**: one-liner quick reference ("Supabase: use .select() after .insert()")
- **learnings.md**: full context with why it works and the reusable pattern
- **MEMORY.md**: meta-insights about workflow and architecture (cross-project)

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md
  - .claude/learnings.md
```
