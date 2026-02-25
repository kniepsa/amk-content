# ADR-001: Multi-App Business Context Layer

**Date**: 2026-02-25
**Status**: Accepted

## Context

Multiple businesses (Printulu, Bonn Gastro, Knibo Invest) each have multiple related apps (frontend, backend, dashboard, blog). The vibe coding setup had no way to share business-level context (domain model, API contracts, shared conventions, Notion teamspace) across related projects.

Three options were evaluated:

1. **Monorepo** — One repo with all apps. Shared types enforced at build time.
2. **Multi-repo with manual linking** — Separate repos, reference brand guides manually.
3. **Multi-repo with parent folder** — Parent directory holds shared `.claude/CLAUDE.md`, Claude Code auto-loads by walking up the tree.

## Decision

**Option 3: Parent folder with shared `.claude/CLAUDE.md`** (three-layer context).

```
~/.claude/CLAUDE.md                          ← Layer 1: Global DNA
~/Projects/[business]/.claude/CLAUDE.md      ← Layer 2: Business domain
~/Projects/[business]/[app]/.claude/CLAUDE.md ← Layer 3: Project specifics
```

The `/install` command was upgraded with "Step 0: Detect Business Context" to auto-detect or create this hierarchy.

## Consequences

- **Positive**: Each repo stays independent, deploys separately. Business context shared automatically. No monorepo complexity. Known businesses (Printulu, Bonn Gastro, Knibo Invest) auto-matched by repo prefix.
- **Negative**: Parent `.claude/` isn't git-tracked with any one repo. Requires folder reorganization if repos aren't already under a business parent folder.
- **Risk**: Untested on real multi-app business yet. First real test needed.
