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

## MCP Server Usage
- **serper**: Web search for debugging, research, docs lookup
- **github**: Create PRs, issues, review code on GitHub
- **filesystem**: Direct file read/write without prompts
- **puppeteer**: Screenshots, visual testing, browser automation
- **chrome-devtools**: Live browser inspection, console, network
- **notion**: Sync tasks/rocks, create pages, query databases
- **youtube**: Extract video transcripts
- **n8n**: Trigger automation workflows

## Notion Workflow
Update every 15-20 minutes or after completing features:
1. Check project CLAUDE.md for `notion_rock_id` and `teamspace`
2. If rock exists: Update progress % when milestones complete
3. Create tasks linked to Related Rock
4. Mark tasks Done when complete

## Notion Teamspaces
Different companies have different Notion teamspaces. Check project CLAUDE.md for which teamspace applies.

| Teamspace | Projects | Home URL |
|-----------|----------|----------|
| **Bonn Gastro** | restaurant-os, salvator-standalone, em-hoettche-restaurant-standalone | https://www.notion.so/2a9f025a848681829a08d5c40394d781 |
| **Knibo Invest** | invoice-splitter, HG-WE10/* | https://www.notion.so/2a9f025a848681f19407e4fc8e65d0f9 |
| **Printulu** | vendure-*, printulu-* | https://www.notion.so/2a9f025a848681a29292f3a5934d9272 |

Default Database IDs (Knibo Invest):
- Rocks: 07e08527-b3dd-4521-bae6-92aac5b9b183
- Tasks: 7c2fe91e-0c3a-487b-9530-b2a7f24b64dd

If project teamspace is unknown, ASK which teamspace it belongs to.
