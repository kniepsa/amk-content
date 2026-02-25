# Install Vibe Coding Setup

Set up the complete vibe coding environment for this project, including multi-app business context.

## Steps

### 0. Detect Business Context (Multi-App Support)

Check if this project is part of a larger business with multiple apps.

**Auto-detection (walk up the directory tree):**

- Check `../` and `../../` for an existing `.claude/CLAUDE.md`
- If found: Report "Found business context at [path]" and skip to Step 1

**If no parent business context found, ask the user:**

> "Is this project part of a multi-app business? (e.g., frontend + backend + dashboard under one company)"
>
> - **Yes** → Ask: "What's the business name?" Then:
>   1. Check if `~/Projects/[business-name]/` already exists as a parent folder
>   2. If not, create `~/Projects/[business-name]/` and move CWD project inside (or note that user should reorganize)
>   3. Create `~/Projects/[business-name]/.claude/CLAUDE.md` using the **Business Context Template** (see below)
>   4. Check `~/Projects/amk-content/brand-guides/` for a matching brand guide → link it
>   5. Check the Notion teamspace table in global CLAUDE.md → add teamspace info
> - **No** → Continue with single-project install (Step 1)

**Business Context Template** (`[parent]/.claude/CLAUDE.md`):

```markdown
# [Business Name] - Business Context

## Domain

[Ask user: One sentence describing what this business does]

## Apps

| App               | Repo        | Stack            | Purpose    |
| ----------------- | ----------- | ---------------- | ---------- |
| [current project] | [repo name] | [detected stack] | [ask user] |

_Add more rows as you /install additional sub-projects._

## Shared Conventions

- Prices: cents (integer), never float
- Dates: ISO 8601 (UTC storage, local display)
- IDs: UUID v4
- API style: [REST / GraphQL — ask user]

## API Contracts

_Document cross-service API contracts here as apps are added._

## Domain Model

_Core business entities and relationships. Fill in as the domain becomes clear._

## Notion

- Teamspace: [matched from global CLAUDE.md or ask user]
- Rocks DB: [if known]
- Tasks DB: [if known]

## Brand Guide

See: ~/Projects/amk-content/brand-guides/[business].md
```

### 1. Detect Project Type

- Check for package.json, tsconfig.json, pyproject.toml
- Identify framework: Next.js (next.config._), SvelteKit (svelte.config._), Vendure (vendure-config.\*)
- Identify database: Supabase (.env SUPABASE_URL), Railway (.railway.toml), Turso (turso.\*)
- Identify deploy: Vercel (vercel.json, .vercel/)

### 2. Create Project Memory

- Create `.claude/` directory if missing
- Generate `.claude/CLAUDE.md` with:
  - Project name and description (from package.json or README)
  - Detected stack and versions
  - Key file paths and project structure
  - Package manager detection (pnpm > yarn > npm)
  - Build/dev/test/lint commands from package.json scripts
  - **If part of a business:** Add `## Business Context` section pointing to parent:
    ```
    ## Business Context
    Parent: ~/Projects/[business-name]/.claude/CLAUDE.md
    Role: [frontend / backend / dashboard / etc.]
    ```
  - **If part of a business:** Update the parent's Apps table with this project's info
- Create `.claude/NEXT.md` with empty task queue
- Create `.claude/DEBT.md` with empty categories
- Create `.claude/decisions/` directory + README

### 3. Copy Quality Templates

- Copy hooks from `~/Projects/amk-content/vibe-coding-setup/templates/.claude/hooks/`
- Copy `.claude/settings.json` template (with all V3 hooks + status line)
- Ensure `~/.claude/hooks/statusline.sh` is present and executable:
  ```bash
  [ -f ~/.claude/hooks/statusline.sh ] || cp ~/Projects/amk-content/vibe-coding-setup/hooks/statusline.sh ~/.claude/hooks/statusline.sh
  chmod +x ~/.claude/hooks/statusline.sh
  ```
- Set up Husky + lint-staged if not already configured

### 3.5 Register & Version Stamp

Add this project to the registry for future `/sync-vibe-setup push` propagation:

```bash
REGISTRY="$HOME/Projects/amk-content/vibe-coding-setup/.registry"
PROJECT_PATH="~/${PWD#"$HOME/"}"

# Add to registry if not already present (full-line match to avoid substring collisions)
if [ -f "$REGISTRY" ] && ! grep -qxF "$PROJECT_PATH" "$REGISTRY"; then
  echo "$PROJECT_PATH" >> "$REGISTRY"
fi
```

Stamp the installed version:

```bash
VERSION_FILE="$HOME/Projects/amk-content/vibe-coding-setup/VERSION"
[ -f "$VERSION_FILE" ] && cp "$VERSION_FILE" .claude/.vibe-version
```

### 3.7 Install Compound Engineering Plugin

Install the compound-engineering plugin for advanced workflow commands (`/workflows:plan`, `/workflows:review`, `/workflows:work`, `/workflows:compound`):

```
/plugin marketplace add https://github.com/EveryInc/compound-engineering-plugin
/plugin install compound-engineering
```

This adds 4 workflow commands, 19+ skills (git-worktree, orchestrating-swarms, resolve-pr-parallel), and 29 agents for code review, research, and design.

Skip if already installed or if this is a minimal setup.

### 4. Validate Setup

- Verify pnpm/npm/yarn works
- Verify `pnpm dev` starts (or equivalent)
- Verify `pnpm build` succeeds
- Verify `pnpm lint` runs
- Verify `pnpm typecheck` runs
- Check git is initialized with remote

### 5. Report

**Single project:**

```
Vibe Coding v[VERSION] Installed

Project: [name]
Stack: [framework] + [database] + [deploy]
Mode: Solo (NEXT.md)
Registered: yes (in .registry)

Files created:
- .claude/CLAUDE.md
- .claude/NEXT.md
- .claude/DEBT.md
- .claude/decisions/README.md
- .claude/settings.json

Ready. Run /warmup to start.
```

**Multi-app business (first project):**

```
Vibe Coding V3 Installed (Multi-App)

Business: [name]
Project: [name] ([role])
Stack: [framework] + [database] + [deploy]
Mode: Solo (NEXT.md)

Business layer created:
- ~/Projects/[business]/.claude/CLAUDE.md
- Brand guide linked: [yes/no]
- Notion teamspace: [name]

Project layer created:
- .claude/CLAUDE.md (references business context)
- .claude/NEXT.md
- .claude/DEBT.md
- .claude/decisions/README.md
- .claude/settings.json

Context layers: Global → Business → Project
Ready. Run /warmup to start.
```

**Multi-app business (additional project):**

```
Vibe Coding V3 Installed (Added to Business)

Business: [name] (existing)
Project: [name] ([role])
Stack: [framework] + [database] + [deploy]

Updated business context:
- Added [project] to Apps table in [business]/.claude/CLAUDE.md

Project layer created:
- .claude/CLAUDE.md (references business context)
- .claude/NEXT.md
- .claude/DEBT.md
- .claude/decisions/README.md
- .claude/settings.json

Context layers: Global → Business → Project
Ready. Run /warmup to start.
```

## Known Businesses (Auto-Match)

These businesses are already documented. Auto-detect by repo name prefix or ask to confirm:

| Business     | Repo Prefixes                            | Brand Guide                 | Notion Teamspace |
| ------------ | ---------------------------------------- | --------------------------- | ---------------- |
| Printulu     | printulu-\*                              | printulu.md                 | Printulu         |
| Bonn Gastro  | restaurant-os, salvator-_, em-hoettche-_ | salvator.md, em-hoettche.md | Bonn Gastro      |
| Knibo Invest | invoice-splitter, HG-WE10\*              | knibo-invest.md             | Knibo Invest     |

## Important

- NEVER overwrite existing .claude/CLAUDE.md - only create if missing
- NEVER overwrite existing .claude/NEXT.md - only create if missing
- NEVER overwrite existing parent business .claude/CLAUDE.md - only update the Apps table
- DO update .claude/settings.json with latest hook configuration
- If project already has vibe coding setup, report what's already there and offer to upgrade
- When adding to an existing business, ONLY append to the Apps table — never modify other sections

## Upgrade Existing Projects

If the project already has vibe coding setup and the user asks to upgrade:

1. Read current version from `.claude/.vibe-version` (if exists)
2. Read latest version from `~/Projects/amk-content/vibe-coding-setup/VERSION`
3. Compare versions. If different:
   - Update `.claude/settings.json` from template
   - Update `.claude/hooks/` with new scripts (DO NOT overwrite custom hooks)
   - Update `.claude/.vibe-version`
   - Report what changed
4. NEVER touch `.claude/CLAUDE.md`, `.claude/NEXT.md`, `.claude/DEBT.md`, or `.claude/decisions/`
