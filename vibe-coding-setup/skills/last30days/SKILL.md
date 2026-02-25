---
name: last30days
description: Search the web for what changed in your tech stack in the last 30 days. Finds breaking changes, deprecations, new best practices, and security advisories. Use when starting work after a break, before a major update, or when something "suddenly stopped working".
---

# Last 30 Days Research

Stay current on your stack by surfacing breaking changes, deprecations, and new patterns from the last 30 days.

## Step 1: Detect Stack

Read `.claude/CLAUDE.md` and `~/.claude/CLAUDE.md` to identify:

- Frameworks (Next.js, SvelteKit, Vendure, Astro...)
- Libraries (Supabase, Tailwind, TypeORM, Prisma...)
- Tools (Vercel, pnpm, TypeScript, ESLint...)
- Any explicit version numbers mentioned

If `$ARGUMENTS` provided, add those topics to the search list and prioritize them.

## Step 2: Search for Recent Changes

First, load search tools:

1. `ToolSearch("select:WebSearch")` — primary web search
2. `ToolSearch("select:mcp__serper__google_search")` — if available, use both

For each major framework/library, run targeted searches using these query patterns:

```
"[framework] changelog [current year]"
"[framework] breaking changes [current year]"
"[framework] deprecation [current year]"
"[framework] migration guide latest"
"[framework] security advisory [current year]"
```

Source targets (add to queries when relevant):

- `site:reddit.com` — community reactions to breaking changes
- GitHub releases pages — official release notes
- Official blogs and changelogs

Note: Use `site:reddit.com` as a query string (not a domain filter) since direct domain filtering may be blocked.

## Step 3: Filter for Impact

From search results, identify only items that affect YOUR code:

**Keep:**

- Breaking changes to APIs you use
- Deprecations with a migration deadline
- Security advisories for packages in your stack
- New defaults that change behavior silently
- New patterns that replace documented gotchas

**Ignore:**

- Minor patch releases with no behavior change
- Performance improvements
- New features you don't need
- Ecosystem/community news

## Step 4: Report

Output a focused summary:

```
Last 30 Days: [Stack Name]
Checked: [date range]
Searches run: [list every query string used]
URLs fetched: [list every URL read with status: ok/404/blocked]

ACTION REQUIRED
---------------
- [Framework vX.Y]: [what changed] → [what to do]
- [Library]: [deprecation] → [migration path]

WORTH KNOWING
-------------
- [Framework]: [new pattern] → [benefit]

CHECKED (no changes)
--------------------
- [Framework], [Library], [Tool] — no breaking changes
```

Keep each item to 1-2 lines. Link to the source for anything in "Action Required".

## Step 5: Offer CLAUDE.md Update

If any "Action Required" items affect the global coding patterns, offer:

> "Found [N] items that should be added to your CLAUDE.md gotchas. Update now?"

If yes: add them to the "Universal Patterns" or "Gotchas (Hard-Won)" section of `~/.claude/CLAUDE.md`, with the date found.
