# Architecture Decision Records (ADRs)

This folder contains **strategic** architecture decisions - only the BIG ones that affect the whole project.

## What Goes Here?

✅ **YES - Strategic Decisions:**

- Database choice (Supabase vs Firebase vs custom)
- Framework choice (Next.js vs Remix)
- Major architecture changes (monolith → microservices)
- Authentication strategy
- Deployment platform

❌ **NO - Tactical Decisions:**

- Component structure
- File naming conventions
- Linting rules
- Minor library choices

## Guideline: 2-3 ADRs Per Project

If you have more than 5 ADRs, you're documenting too much.

## Naming Convention

```
001-why-supabase.md
002-why-nextjs-app-router.md
003-sdk-migration.md
```

## Template

See `000-template.md` for the ADR format.
