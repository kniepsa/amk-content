# F-XXX: Feature Title

**Status:** Planned | In Progress | Done
**Priority:** P0 (Now) | P1 (Up Next) | P2 (Later) | P3 (Backlog)
**Dependencies:** F-YYY, F-ZZZ (or "None")

## Requirements

**Stack Versions:**

- Framework: Next.js 16+ / Vendure 3.5+ / SvelteKit 2+
- Database: Supabase / PostgreSQL
- Auth: Better Auth / Supabase Auth

**MCP Servers to Use:**

- `context7` - Documentation lookup for framework/library patterns
- `serper` - Web research for best practices and solutions
- [Tech-specific MCPs as needed: svelte, etc.]

---

## First Principles (Before Writing Any Code)

Answer these questions to validate the approach:

1. **Core Problem:** What is the fundamental problem we're solving? (Strip away all assumptions)
2. **Constraints:** What are the hard truths/limitations we must work within?
3. **Simplest Solution:** What is the minimum viable implementation that solves this?
4. **Dependencies:** What must exist before this can work? Are they resolved?
5. **Pre-mortem:** What could go wrong? What are the failure modes?

---

## The User (Empathy First)

**Who uses this?**

- Role: [Job title/persona]
- Context: [When/where they encounter this]
- Pain: [Current frustration]
- Goal: [What they want to achieve]

**Day in their life:**
[1-2 sentence story of how they currently struggle and how this feature helps]

---

## The Problem

**Current State (1-Star):**

- [Pain point 1]
- [Pain point 2]
- [Pain point 3]

**Why it matters:**

- [Business impact 1]
- [User impact 2]

---

## The 11-Star Experience

| Star Level | Experience                               |
| ---------- | ---------------------------------------- |
| 1-Star     | [Current broken state]                   |
| 5-Star     | [Basic solution]                         |
| 10-Star    | [Great solution]                         |
| 11-Star    | [Magical, impossible-seeming experience] |

**We're building for:** [X]-Star

- [Key feature 1]
- [Key feature 2]

---

## The Solution (80/20)

**The 20% that delivers 80%:**

1. [Core feature 1]
2. [Core feature 2]
3. [Core feature 3]

**Explicitly NOT doing:**

- [Out of scope 1]
- [Out of scope 2]

---

## User Flow

```
[ASCII diagram or Mermaid flowchart]
```

---

## Technical Spec

### Database Schema (if applicable)

```sql
-- Tables to create/modify
CREATE TABLE example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policy (ALWAYS include for Supabase)
ALTER TABLE example ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access own company data" ON example
  FOR ALL USING (company_id = auth.jwt() ->> 'company_id');
```

### Routes

| Route               | Purpose           |
| ------------------- | ----------------- |
| `/app/feature/`     | Main feature page |
| `/app/feature/[id]` | Detail view       |

### Components

| Component         | Purpose                  | Shared?            |
| ----------------- | ------------------------ | ------------------ |
| `FeatureList.tsx` | List view with filtering | No                 |
| `Badge.tsx`       | Status indicator         | Yes (@printulu/ui) |

### API Routes

| Route               | Method | Purpose         |
| ------------------- | ------ | --------------- |
| `/api/feature`      | GET    | List all items  |
| `/api/feature`      | POST   | Create new item |
| `/api/feature/[id]` | PUT    | Update item     |

### Code Examples

```typescript
// Use proper patterns for your framework version
// Next.js 16+: Server Components with Server Actions
// Vendure 3.5+: Split Admin/Shop resolvers
// Supabase: getAll/setAll cookie handlers
```

---

## Delight Moments (Joe Gebbia's Magic)

What makes users smile? Small touches that show care:

1. **[Moment 1]** - e.g., One-click copy for frequently needed data
2. **[Moment 2]** - e.g., Smart defaults that guess correctly 90% of time
3. **[Moment 3]** - e.g., Instant visual feedback on actions

---

## Logical Validation Checklist

Before implementation, verify:

- [ ] **No circular dependencies** - All dependencies exist or are in scope
- [ ] **Data exists** - Required data sources are accessible
- [ ] **Auth covered** - User permissions checked at every mutation
- [ ] **Error states handled** - What happens when things fail?
- [ ] **Edge cases identified** - Empty states, max limits, concurrent access
- [ ] **Rollback plan** - How to undo if something goes wrong?

---

## Success Criteria

- [ ] [Functional requirement 1]
- [ ] [Functional requirement 2]
- [ ] [Performance requirement - e.g., <500ms response]
- [ ] [Security requirement - e.g., RLS policies active]

---

## Test Criteria

**Unit Tests:**

- [ ] [Service/function test 1]
- [ ] [Service/function test 2]

**Integration Tests:**

- [ ] [API endpoint test 1]
- [ ] [Database operation test 2]

**E2E Tests:**

- [ ] [User flow test 1]
- [ ] [Edge case test 2]

---

## Implementation Steps

1. [ ] Create database migration
2. [ ] Build API routes/Server Actions
3. [ ] Create UI components (use shared components where possible)
4. [ ] Add to navigation
5. [ ] Write tests
6. [ ] Test and deploy

---

## Shared Components (DRY)

Reference existing shared components before creating new ones:

| Need           | Use This          | Package                   |
| -------------- | ----------------- | ------------------------- |
| Status badge   | `Badge`           | @printulu/ui or shadcn/ui |
| Card container | `Card`            | @printulu/ui or shadcn/ui |
| Form inputs    | `Input`, `Select` | shadcn/ui                 |

---

## Location

- `/src/routes/app/feature/` or `/src/app/feature/`
- `/src/lib/components/feature/`
- `/src/lib/stores/featureStore.ts` (if state needed)

---

## Priority & Status

- **Priority:** P[0-3]
- **Status:** Planned | In Progress | Done
- **Milestone:** M[X] (if applicable)

---

_Last updated: YYYY-MM-DD_
