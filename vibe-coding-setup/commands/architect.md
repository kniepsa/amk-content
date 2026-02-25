# Architect - System Design

Denke wie ein Software Architect bevor du implementierst.

## Wann nutzen?

- Nach /pm, vor dem Coden
- Bei neuen Features mit DB/API Changes
- Bei größeren Refactorings
- Wenn du unsicher bist "wie baue ich das?"

## Instructions

### 1. Context Check

```
Lies zuerst:
- /pm Brief (falls vorhanden)
- Relevante CLAUDE.md Sections
- Existing code structure
```

### 2. Data Model

```
📊 DATA MODEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Neue/Geänderte Entities:
┌─────────────────────────────────┐
│ EntityName                      │
├─────────────────────────────────┤
│ id: uuid (PK)                   │
│ field1: string                  │
│ field2: number                  │
│ created_at: timestamp           │
└─────────────────────────────────┘

Relations:
- EntityA → EntityB (1:n)
- EntityA → EntityC (n:m via junction)
```

### 3. API Design

```
🔌 API ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GET  /api/resource          → List
GET  /api/resource/:id      → Get one
POST /api/resource          → Create
PUT  /api/resource/:id      → Update
DEL  /api/resource/:id      → Delete

Request/Response:
{
  "field1": "value",
  "field2": 123
}
```

### 4. Component Structure

```
🧩 COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

src/
├── components/
│   └── FeatureName/
│       ├── index.tsx        # Main component
│       ├── hooks.ts         # Custom hooks
│       └── types.ts         # TypeScript types
├── lib/
│   └── feature-name.ts      # Business logic
└── app/
    └── api/
        └── resource/
            └── route.ts     # API handler
```

### 5. Edge Cases

```
⚠️ EDGE CASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- [ ] Empty state: Was zeigen wenn keine Daten?
- [ ] Error state: Was bei API Fehler?
- [ ] Loading state: Was während Laden?
- [ ] Permissions: Wer darf was?
- [ ] Validation: Welche Inputs validieren?
```

### 6. Dependencies

```
📦 DEPENDENCIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Existing (nutzen):
- [lib/existing-util.ts]

New (installieren):
- [package-name] für [Zweck]

External:
- [API/Service] für [Zweck]
```

## Output Format

```
🏗️ ARCHITECTURE: [Feature Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATA:
[Entity] with fields: [key fields]
Relations: [key relations]

API:
[METHOD] /api/[path] → [purpose]

COMPONENTS:
[ComponentName] → [purpose]

EDGE CASES:
- [Most important edge case]

FILES TO CREATE/MODIFY:
1. [path] - [what]
2. [path] - [what]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to implement? → /story oder direkt coden
```

## Integration

- Speichere große Decisions in `/adr`
- Update CLAUDE.md mit neuen Patterns
- Nutze Output für `/story` Creation
