# Story - Full Context Story File

Erstelle ein Story File mit allem Context für autonomes Arbeiten.

## Wann nutzen?

- Bei Features die >1 Session dauern
- Wenn Context zwischen Sessions erhalten bleiben soll
- Nach /pm und /architect, vor Implementation
- Wenn du "morgen weitermachen" willst

## Usage

```
/story "Feature Name"
/story "Add user authentication"
```

## Instructions

### 1. Story File erstellen

Speicherort: `.claude/stories/[YYYY-MM-DD]-[feature-name].md`

### 2. Story Template ausfüllen

```markdown
# Story: [Feature Name]

**Created:** [Date]
**Status:** DRAFT | IN_PROGRESS | BLOCKED | DONE
**Priority:** P0 | P1 | P2

---

## Context

[Warum bauen wir das? Business Context. Was kam davor?]

## Problem

[Was ist das konkrete Problem das gelöst wird?]

## Solution

[Wie lösen wir es? High-level approach.]

## Scope

### In Scope

- [ ] [Konkrete Aufgabe 1]
- [ ] [Konkrete Aufgabe 2]
- [ ] [Konkrete Aufgabe 3]

### Out of Scope

- [Was wir NICHT machen]
- [Was später kommt]

## Technical Approach

### Data Model

[Schema changes, neue Entities]

### API

[Endpoints, Request/Response]

### Components

[UI Components, Struktur]

### Files to Touch

- `path/to/file.ts` - [was ändern]
- `path/to/other.ts` - [was ändern]

## Acceptance Criteria

- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]

## Edge Cases

- [ ] [Edge case 1] → [wie behandeln]
- [ ] [Edge case 2] → [wie behandeln]

## Dependencies

- [Was muss vorher fertig sein?]
- [Externe APIs/Services?]

## Notes

[Zusätzliche Infos, Links, Referenzen]

---

## Progress Log

### [Date]

- [Was wurde gemacht]
- [Nächste Schritte]
```

## Output Format

```
📖 STORY CREATED: [Feature Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: .claude/stories/[date]-[name].md
Status: DRAFT

SCOPE:
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

ACCEPTANCE:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Run /story-check to validate, then start coding.
```

## SQLite Sync

After creating the story file, sync to SQLite as a PRD:

```bash
mem prd add "{story title}" --project {project} --desc "{one-line summary}"
```

This makes the story queryable via `list_prds` MCP tool and `mem prd list`.

---

## Integration

- `/warmup` liest aktive Story (Status: IN_PROGRESS)
- `/ship` updated Story Status → DONE
- `/session-end` fügt Progress Log Entry hinzu

## Story Lifecycle

```
/story "Feature"     → Create (DRAFT)
/story-check         → Validate
[start coding]       → Status → IN_PROGRESS
[session end]        → Add Progress Log
[next session]       → /warmup reads Story
/ship                → Status → DONE
```
