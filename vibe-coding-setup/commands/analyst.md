# Analyst - Requirements Klärung

Kläre Requirements bevor du planst oder baust.

## Wann nutzen?

- Wenn Anforderungen unklar sind
- Bei vagen User Requests
- Bevor du /pm oder /architect machst
- Wenn du merkst "ich verstehe nicht ganz was gewollt ist"

## Instructions

### 1. Verstehen was gesagt wurde

```
📝 WAS WURDE GESAGT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Original Request:
"[Exakte Anfrage des Users]"

Keywords/Begriffe:
- [Begriff 1] → Was bedeutet das?
- [Begriff 2] → Was bedeutet das?
```

### 2. Annahmen explizit machen

```
🤔 MEINE ANNAHMEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ich nehme an:
1. [Annahme 1] - Stimmt das?
2. [Annahme 2] - Stimmt das?
3. [Annahme 3] - Stimmt das?
```

### 3. Fragen formulieren

```
❓ OFFENE FRAGEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Must-Know (blockiert Arbeit):
1. [Frage]
2. [Frage]

Nice-to-Know (kann später klären):
1. [Frage]
```

### 4. Scope Boundaries

```
📐 SCOPE CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gehört DEFINITIV dazu:
- [X]

Gehört WAHRSCHEINLICH dazu:
- [Y] ← Klären!

Gehört NICHT dazu (oder später):
- [Z]
```

### 5. Acceptance Criteria

```
✅ WANN IST ES FERTIG?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Given: [Ausgangssituation]
When: [User Aktion]
Then: [Erwartetes Ergebnis]
```

## Output Format

```
🔍 ANALYSIS: [Topic]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VERSTANDEN:
[1-2 Sätze was klar ist]

ANNAHMEN:
1. [Annahme] ← zu klären
2. [Annahme] ← zu klären

FRAGEN AN USER:
1. [Wichtigste Frage]
2. [Zweite Frage]

SCOPE:
✅ Dabei: [X]
❓ Unklar: [Y]
❌ Nicht dabei: [Z]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bitte kläre die Fragen, dann → /pm
```

## Next Steps

Nach Klärung:

1. → `/pm` für Product Brief
2. → `/architect` wenn technisch komplex
3. → `/story` für Implementation
