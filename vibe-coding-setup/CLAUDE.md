# AMK Coding DNA

## The Graph (How I Build)

User Need → TypeScript/Next.js → Service Layer → Supabase RLS → Vercel Deploy

## Invariants (NEVER Break)

- TypeScript strict mode always
- Auth check before any mutation
- RLS policies on all tables
- Server components for data fetching

## Stack Preferences

- Frontend: Next.js 14+, React, Tailwind CSS
- Backend: Supabase (PostgreSQL + RLS)
- Package manager: pnpm (preferred)
- Deploy: Vercel

## Gotchas (Hard-Won)

- Supabase RLS requires .select() after .insert() to return data
- Next.js caches aggressively - use revalidatePath()
- Prices as cents (integer), never float
- Vercel: Use edge runtime for fast cold starts
- Next.js 14: App Router metadata must be in page.tsx, not layout.tsx
- Supabase: Always handle .error before .data
- When planning complex products: Start with user journey, then build backwards to technical requirements
- Market research BEFORE building: $26-37B no-code market (Lovable, Bolt, Bubble dominate non-technical segment)
- For semi-technical entrepreneurs: GUI wrapper > pure CLI (visual feedback reduces terminal fear)
- Compact at 70% context, not 90% — quality degrades noticeably before the hard limit
- `.claudeignore` → add node_modules, .next, dist, build → 40%+ token savings on large repos
- Two-Correction Rule: if you've corrected Claude twice on the same issue, `/clear` and rewrite the prompt
- Interview Pattern: for complex features, have Claude interview you first → FRESH session to implement

## API Error Handling

- ALWAYS return full validation error details in API responses (status 400)
- Validation errors are INPUT feedback, not security-sensitive
- NEVER hide validation errors behind `process.env.NODE_ENV === 'development'`
- DO log validation errors with `console.error()` for server-side debugging

## Workflow

- Atomic design for components
- Conventional commits
- Feature branches, never force push main
- Update Notion rocks/tasks every 15-20 min via MCP

## Commands

dev: `pnpm dev`
build: `pnpm build`
test: `pnpm test`
lint: `pnpm lint`
typecheck: `pnpm typecheck`

## Code Quality (STRICT)

### TypeScript Rules

- `strict: true` always (see templates/tsconfig.strict.json)
- NO `any` - use `unknown` + type guards
- Explicit return types on exported functions
- No unused variables/imports

### Linting

- ESLint with @typescript-eslint strict rules
- Prettier for formatting (auto-runs via Claude hooks)
- Husky + lint-staged for pre-commit validation

### Before /ship

- `pnpm lint` must pass
- `pnpm typecheck` must pass
- `pnpm build` must succeed

### Templates

Copy from `~/Projects/amk-content/vibe-coding-setup/templates/`:

- `eslint.config.mjs` - Strict ESLint rules
- `.prettierrc` - Consistent formatting
- `tsconfig.strict.json` - Maximum TypeScript strictness
- `husky-setup.md` - Pre-commit hook setup guide

## MCP Server Usage

### Core MCP Servers (Always Use)

- **context7**: Documentation lookup for any framework/library — ALWAYS check docs before implementing
- **notion**: Sync tasks/rocks, create pages, query databases (when configured)
- **playwright**: Screenshots, visual testing, browser automation

> MCPs are deferred tools in Claude Code (loaded via ToolSearch) — token overhead is solved natively.
> Prefer WebSearch over serper for web search. Use `gh` CLI over GitHub MCP.

### Research & Debugging

- **puppeteer/playwright**: Screenshots, visual testing, browser automation
- **chrome-devtools**: Live browser inspection, console, network
- **youtube**: Extract video transcripts for tutorials

### Automation & Integration

- **n8n**: Trigger automation workflows
- **supabase**: Direct database operations (when MCP available)

### Tech-Specific MCP Servers (Use When Applicable)

| Stack            | MCP Server             | Use For                                  |
| ---------------- | ---------------------- | ---------------------------------------- |
| Svelte/SvelteKit | svelte-mcp             | Component patterns, stores, transitions  |
| Next.js          | context7 → next.js     | App Router, Server Actions, caching      |
| Vendure          | context7 → vendure     | Plugin patterns, GraphQL, state machines |
| Tailwind         | context7 → tailwindcss | v4 migration, @theme, utilities          |

### MCP Best Practice Workflow

1. **Before coding**: Use `context7` to check official docs for your stack version
2. **During debugging**: Use WebSearch for Stack Overflow, GitHub issues
3. **For patterns**: Use tech-specific MCP to find canonical examples
4. **After shipping**: Use `playwright` for visual regression checks

## Notion Workflow

Update every 15-20 minutes or after completing features:

1. Check project CLAUDE.md for `notion_rock_id` and `teamspace`
2. If rock exists: Update progress % when milestones complete
3. Create tasks linked to Related Rock
4. Mark tasks Done when complete

## Notion Teamspaces

Different companies have different Notion teamspaces. Check project CLAUDE.md for which teamspace applies.

| Teamspace        | Projects                                                              | Home URL                                               |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| **Bonn Gastro**  | restaurant-os, salvator-standalone, em-hoettche-restaurant-standalone | https://www.notion.so/2a9f025a848681829a08d5c40394d781 |
| **Knibo Invest** | invoice-splitter, HG-WE10/\*                                          | https://www.notion.so/2a9f025a848681f19407e4fc8e65d0f9 |
| **Printulu**     | vendure-_, printulu-_                                                 | https://www.notion.so/2a9f025a848681a29292f3a5934d9272 |

Default Database IDs (Knibo Invest):

- Rocks: 07e08527-b3dd-4521-bae6-92aac5b9b183
- Tasks: 7c2fe91e-0c3a-487b-9530-b2a7f24b64dd

If project teamspace is unknown, ASK which teamspace it belongs to.

## Code Quality Principles

### KISS (Keep It Simple, Stupid)

- **Minimum viable code** - Solve the problem with the least amount of code
- **No premature optimization** - Make it work, then make it fast (if needed)
- **No premature abstraction** - Three similar patterns before extracting
- **Delete code freely** - Less code = fewer bugs
- **One thing well** - Each function/component does one thing

### Shared Components (DRY)

Before creating a new component, check:

1. Does `shadcn/ui` have this? → Use it
2. Does the project's shared package have this? → Use it
3. Does another project have this? → Extract to shared package

**Never duplicate:**

- Buttons, Cards, Badges, Inputs (use shadcn/ui)
- Status indicators, progress bars
- Form patterns, validation logic
- API client patterns

### Joe Gebbia's Delight Principles

From Airbnb's design philosophy - small moments that create loyalty:

1. **Reduce friction** - Every click you remove is a gift to the user
2. **Smart defaults** - Guess correctly 90% of the time
3. **Instant feedback** - Never leave users wondering "did it work?"
4. **One-click copy** - Anything users might need to paste elsewhere
5. **Progressive disclosure** - Show what's needed, hide complexity
6. **Celebrate success** - Acknowledge when users complete tasks

**Checklist before shipping:**

- [ ] What friction can I remove?
- [ ] What default can I set that's usually correct?
- [ ] Where can I add instant visual feedback?
- [ ] What "delight moment" makes users smile?

## First Principles Thinking

When planning features, strip away assumptions:

1. **What is the core problem?** (Not the requested solution)
2. **What are the hard constraints?** (Tech, time, resources)
3. **What is the simplest solution?** (Often not the first idea)
4. **What dependencies must exist?** (Are they resolved?)
5. **What could go wrong?** (Pre-mortem before coding)
