# ADR-001: Feature Management Automation (Joe Gebbia Style)

**Date:** 2026-01-08
**Status:** Accepted

## Context

We needed a standardized way to track features across projects with:

- Local `.claude/features/` as source of truth
- Notion integration for OKR planning
- Cross-project consistency

Initial design had a separate `/feature` command with 3 questions per feature creation.

## Decision

Apply Joe Gebbia's "Don't make the customer think" principle:

1. **No new commands** - Integrate into existing `/warmup`, `/next`, `/ship`, `/session-end`
2. **Zero questions** - Auto-detect feature creation, auto-fill specs from conversation
3. **Auto-branch creation** - `/next F-XXX` creates `feature/F-XXX-name` branch
4. **Auto-PR flow** - `/ship` on feature branch handles PR, merge, cleanup
5. **Auto-complete** - Detect when success criteria are met, auto-move to done/
6. **Auto-sync** - Notion sync happens silently on every `/ship`

## Consequences

**Positive:**

- Zero friction for feature lifecycle
- Branches always match features (traceability)
- Success criteria drive completion (not arbitrary decisions)
- Notion stays in sync without manual effort

**Negative:**

- Relies on Claude's conversation context for spec generation
- Success criteria must be well-defined for auto-complete to work

## Implementation

Modified commands:

- `warmup.md` - Features Mode detection
- `next.md` - Branch creation + `/next start` + `/next create`
- `ship.md` - PR flow + auto-complete + Notion sync
- `session-end.md` - Feature progress tracking
