# Story Check - Validierung vor Implementation

Prüfe ob eine Story komplett genug ist zum Implementieren.

## Wann nutzen?

- Nach `/story` erstellen
- Bevor du mit Implementation startest
- Wenn du unsicher bist ob alles klar ist

## Usage

```
/story-check
/story-check .claude/stories/2024-01-15-user-auth.md
```

## Instructions

### 1. Story File finden

```
Suche aktive Story:
1. .claude/stories/*-*.md mit Status: DRAFT oder IN_PROGRESS
2. Oder explizit angegebene Datei
```

### 2. Completeness Check

```
📋 STORY COMPLETENESS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REQUIRED SECTIONS:
[ ] Context - Warum bauen wir das?
[ ] Problem - Was lösen wir?
[ ] Solution - Wie lösen wir es?
[ ] Scope - Was ist drin/draußen?
[ ] Acceptance Criteria - Wann fertig?

RECOMMENDED SECTIONS:
[ ] Technical Approach - Wie implementieren?
[ ] Files to Touch - Was ändern?
[ ] Edge Cases - Was kann schiefgehen?
```

### 3. Quality Check

```
🔍 QUALITY CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCOPE:
[ ] Mindestens 2 konkrete Tasks?
[ ] Out of Scope definiert?

ACCEPTANCE:
[ ] Mindestens 1 Criterion?
[ ] Given/When/Then Format?

TECHNICAL:
[ ] Files to Touch identifiziert?
[ ] Dependencies geklärt?
```

### 4. Autonomy Check

```
🤖 KANN ICH AUTONOM ARBEITEN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frage: Könnte ein Dev diese Story lesen und
       OHNE weitere Fragen implementieren?

[ ] Ja → Ready to implement
[ ] Nein → Was fehlt?
```

## Output Format

### If Story is Complete:

```
✅ STORY CHECK: PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: [Feature Name]
File: .claude/stories/[file].md

COMPLETENESS: 5/5 required sections
QUALITY: All checks passed

SCOPE: [X] tasks defined
ACCEPTANCE: [Y] criteria defined

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to implement! Start coding.
```

### If Story is Incomplete:

```
⚠️ STORY CHECK: NEEDS WORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: [Feature Name]
File: .claude/stories/[file].md

MISSING:
❌ [Missing section 1]
❌ [Missing section 2]

INCOMPLETE:
⚠️ [Section] - [was fehlt]
⚠️ [Section] - [was fehlt]

QUESTIONS TO ANSWER:
1. [Frage die geklärt werden muss]
2. [Weitere Frage]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fix these issues, then run /story-check again.
```

## Validation Rules

### Required (Story blocked without):

- Context section exists and is not empty
- Problem section exists and is not empty
- At least 1 Acceptance Criterion

### Recommended (Warning if missing):

- Technical Approach
- Files to Touch
- Edge Cases

### Quality (Warning if poor):

- Scope has less than 2 items
- Acceptance Criteria not in Given/When/Then format

## Integration

- Run after `/story`
- Run before starting implementation
- Blocks `/ship` if Story incomplete (optional gate)
