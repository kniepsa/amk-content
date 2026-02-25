# Refactor - Code Quality

Verbessere bestehenden Code systematisch.

## Wann nutzen?

- Nach dem Shippen, wenn "es funktioniert aber..."
- Bei Code Smells die dich stören
- Vor größeren Feature Additions
- Wenn DEBT.md Items abarbeiten

## Instructions

### 1. Scope definieren

```
🎯 REFACTOR SCOPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: [File/Component/Module]
Reason: [Warum refactoren?]
Risk: [Low/Medium/High]
```

### 2. Code Smells identifizieren

```
👃 CODE SMELLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Long functions (>50 lines)
[ ] Deep nesting (>3 levels)
[ ] Duplicate code
[ ] Magic numbers/strings
[ ] God objects/components
[ ] Poor naming
[ ] Missing types
[ ] No error handling
[ ] Tight coupling
[ ] Dead code
```

### 3. Refactor Plan

```
📋 REFACTOR PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: [Kleine, sichere Änderung]
Step 2: [Nächste Änderung]
Step 3: [...]

Pro Step:
- Was ändern
- Tests die es abdecken
- Wie verifizieren
```

### 4. Safety Checks

```
🛡️ SAFETY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before:
[ ] Tests vorhanden?
[ ] Tests grün?
[ ] Git clean?

After each step:
[ ] Tests noch grün?
[ ] Behavior unchanged?
[ ] Commit machen?
```

### 5. Patterns anwenden

```
🔧 PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Extract:
- Function → Wiederverwendbare Logik
- Component → Wiederverwendbare UI
- Hook → Wiederverwendbarer State
- Constant → Magic values

Rename:
- [oldName] → [newName] (warum?)

Restructure:
- [alte Struktur] → [neue Struktur]
```

## Output Format

```
🔄 REFACTOR: [Target]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SMELLS FOUND:
1. [Smell] in [location]
2. [Smell] in [location]

PLAN:
1. [Step 1]
2. [Step 2]
3. [Step 3]

SAFETY:
- Tests: ✅ Vorhanden / ❌ Fehlen
- Risk: Low/Medium/High

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Start refactoring? [Y/N]
```

## Refactor Rules

1. **One thing at a time** - Nie mehrere Refactors mischen
2. **Tests first** - Ohne Tests kein Refactor
3. **Small commits** - Nach jedem Step committen
4. **No feature creep** - Refactor ≠ Feature hinzufügen
5. **Know when to stop** - Perfekt ist der Feind von gut

## Integration

- Update DEBT.md nach Refactor (Items abhaken)
- Update CLAUDE.md mit neuen Patterns
- `/ship` wenn fertig (mit `refactor:` prefix)
