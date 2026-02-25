# PM - Product Thinking

Denke wie ein Product Manager bevor du ein Feature baust.

## Wann nutzen?

- Vor jedem größeren Feature
- Wenn unklar ist "was bauen wir eigentlich?"
- Bevor du in die Architektur gehst

## Instructions

### 1. Problem Definition

```
Was ist das PROBLEM?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Problem: [Ein Satz, der das Problem beschreibt]
Wer hat es: [Zielgruppe]
Wie oft: [Frequenz des Problems]
Impact: [Was passiert wenn nicht gelöst?]
```

### 2. Solution Framing

```
Was ist die LÖSUNG?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lösung: [Ein Satz]
Warum jetzt: [Urgency/Timing]
Warum wir: [Unique advantage]
```

### 3. MVP Scope

```
Was ist der MVP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MUST have:
- [ ] ...
- [ ] ...

NICE to have (später):
- [ ] ...

OUT of scope:
- [ ] ...
```

### 4. Success Metrics

```
Wie messen wir Erfolg?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary: [Eine Hauptmetrik]
Secondary: [1-2 Nebenmetriken]
```

### 5. User Story

```
Als [Nutzertyp]
möchte ich [Aktion]
damit ich [Nutzen]
```

## Output Format

```
📋 PM BRIEF: [Feature Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM: [Ein Satz]
USER: [Zielgruppe]

LÖSUNG: [Ein Satz]

MVP SCOPE:
✅ [Must 1]
✅ [Must 2]
⏳ [Nice to have - später]

SUCCESS: [Hauptmetrik]

USER STORY:
Als [X] möchte ich [Y] damit [Z]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready for /architect? [Y/N]
```

## Next Steps

Nach /pm:

1. → `/architect` für System Design
2. → `/analyst` wenn Requirements noch unklar
3. → Direkt coden wenn MVP klar genug
