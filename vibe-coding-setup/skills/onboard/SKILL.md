---
name: onboard
description: Quick project onboarding that scans the codebase and generates a comprehensive understanding. Use when entering a project for the first time, resuming after a long break, or when context was lost. Triggers on "onboard", "catch me up", "what is this project", "I'm new here".
invocation: manual
---

# Project Onboarding

One-prompt onboarding that scans the codebase and generates a comprehensive project understanding. Designed so you can enter any project and immediately know what it is, how it works, and what to do next.

Accept `$ARGUMENTS` as an optional project path. Default: current working directory.

---

## TTS Notifications

All `**TTS**` markers in this skill should be spoken via `.claude/hooks/play-tts.sh` if available, otherwise fall back to macOS `say` command.

---

## Onboarding Process

### Step 1: Detect Project Type

Scan the root directory for project markers:

| File                                  | Project Type          | Stack                      |
| ------------------------------------- | --------------------- | -------------------------- |
| `package.json`                        | JavaScript/TypeScript | Read for framework details |
| `pyproject.toml` / `requirements.txt` | Python                | Read for framework details |
| `Cargo.toml`                          | Rust                  | Read for crate details     |
| `go.mod`                              | Go                    | Read for module details    |
| `composer.json`                       | PHP                   | Read for framework details |
| `Gemfile`                             | Ruby                  | Read for framework details |

From `package.json`, detect framework:

- `next` -> Next.js
- `svelte` / `@sveltejs/kit` -> SvelteKit
- `react` -> React (CRA, Vite, etc.)
- `vue` -> Vue.js
- `astro` -> Astro
- `vendure` -> Vendure (e-commerce)

### Step 1b: Detect Stack Details

Scan for these specific stack markers (priority order for AMK projects):

| Marker File / Pattern       | Detected Stack          | Notes                                              |
| --------------------------- | ----------------------- | -------------------------------------------------- |
| `package.json` (exists)     | TypeScript project      | Check `devDependencies` for `typescript`           |
| `next.config.*`             | Next.js                 | Check `.mjs`, `.js`, `.ts` variants                |
| `svelte.config.*`           | SvelteKit               | Check `.js`, `.ts` variants                        |
| `vendure-config.*`          | Vendure (e-commerce)    | Check `.ts`, `.js` variants                        |
| `SUPABASE_URL` in `.env*`   | Supabase (Postgres+RLS) | Check `.env`, `.env.local`, `.env.example`         |
| `.railway.toml`             | Railway deployment      | Alternative to Vercel                              |
| `TURSO_*` in `.env*`        | Turso / libSQL          | Check for `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` |
| `vercel.json` or `.vercel/` | Vercel deployment       | Standard deploy target                             |
| `*.graphql` files           | GraphQL API             | Check `src/` and root                              |
| `pnpm-lock.yaml`            | pnpm (preferred)        | AMK preferred package manager                      |
| `yarn.lock`                 | yarn                    | Not preferred                                      |
| `package-lock.json`         | npm                     | Not preferred                                      |

Detection commands:

```bash
# Framework detection
ls next.config.* svelte.config.* vendure-config.* 2>/dev/null

# Database/service detection
grep -l 'SUPABASE_URL' .env* 2>/dev/null
grep -l 'TURSO_' .env* 2>/dev/null
ls .railway.toml 2>/dev/null

# Deployment detection
ls vercel.json 2>/dev/null
ls -d .vercel 2>/dev/null

# API style detection
find . -maxdepth 3 -name '*.graphql' -not -path '*/node_modules/*' 2>/dev/null | head -5

# Package manager detection
ls pnpm-lock.yaml yarn.lock package-lock.json 2>/dev/null
```

### Step 2: Read Core Documentation

Read these files in order (skip if not found):

1. **CLAUDE.md** (`.claude/CLAUDE.md` or root `CLAUDE.md`)
   - Project-specific instructions, gotchas, conventions
   - Notion integration details
   - Mode configuration (BMM/Features/Solo)

2. **NEXT.md** (`.claude/NEXT.md`)
   - Current task focus
   - Upcoming work
   - Recently completed items

3. **DEBT.md** (`.claude/DEBT.md`)
   - Known technical debt
   - Priority and severity

4. **README.md**
   - Project purpose and setup
   - Development instructions

5. **ARCHITECTURE.md** (`.claude/ARCHITECTURE.md`)
   - System overview
   - Service relationships
   - Data flows

### Step 3: Scan Directory Structure

Get a high-level view of the codebase:

```bash
# Show top 2 levels of directory structure (excluding node_modules, .next, etc.)
find . -maxdepth 2 -type d \
  -not -path '*/node_modules/*' \
  -not -path '*/.next/*' \
  -not -path '*/.git/*' \
  -not -path '*/dist/*' \
  -not -path '*/.svelte-kit/*' \
  | sort
```

Note key directories:

- `src/` or `app/` - Main source code
- `lib/` or `utils/` - Shared utilities
- `components/` - UI components
- `api/` or `routes/` - API endpoints
- `tests/` or `__tests__/` - Test files
- `docs/` - Documentation
- `.claude/` - Claude configuration

### Step 4: Identify Stack and Patterns

From the files discovered, identify:

```
STACK:
- Framework: [Next.js 14 / SvelteKit / etc.]
- Language: [TypeScript / JavaScript]
- Styling: [Tailwind CSS / CSS Modules / styled-components]
- Database: [Supabase / Prisma / Drizzle / etc.]
- Auth: [Supabase Auth / Clerk / NextAuth / etc.]
- Deployment: [Vercel / Netlify / Docker / etc.]
- Package manager: [pnpm / npm / yarn]

PATTERNS:
- Component style: [Atomic design / Feature folders / Flat]
- State management: [Server components / Zustand / Redux / etc.]
- API style: [REST / GraphQL / tRPC]
- Testing: [Vitest / Jest / Playwright / None]
```

### Step 5: Check Existing Infrastructure

```
CI/CD:
- [ ] .github/workflows/ (GitHub Actions)
- [ ] vercel.json (Vercel config)
- [ ] Dockerfile (Container deployment)

Testing:
- [ ] Test files exist
- [ ] Test configuration present
- [ ] CI runs tests

Quality:
- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Husky/lint-staged configured
- [ ] TypeScript strict mode
```

### Step 6: Detect Workflow Mode

Check which workflow mode is active:

| Check                            | Mode          |
| -------------------------------- | ------------- |
| `docs/sprint-status.yaml` exists | BMM Mode      |
| `.claude/features/` exists       | Features Mode |
| `.claude/NEXT.md` exists only    | Solo Mode     |
| Nothing exists                   | Unconfigured  |

### Step 7: Generate Onboarding Summary

---

## Output Format

```
PROJECT ONBOARDING: [project name]
================================================

WHAT IS THIS?
[1-2 sentence description of the project purpose]

STACK
- Framework: [X]
- Database: [X]
- Deploy: [X]
- Package manager: [X]

PROJECT STRUCTURE
[Key directories and their purposes]

WORKFLOW MODE: [BMM / Features / Solo / Unconfigured]

CURRENT STATE
- Branch: [current branch]
- Last commit: [last commit message and date]
- Uncommitted changes: [Y/N, count]
- Current task: [from NEXT.md or "none set"]

KNOWN DEBT
[Top 3 items from DEBT.md or "None tracked"]

KEY CONVENTIONS
[Important patterns from CLAUDE.md]
- [Convention 1]
- [Convention 2]
- [Convention 3]

GETTING STARTED
1. [First thing to do]
2. [Second thing to do]

SUGGESTED FIRST TASK
[Based on NEXT.md "Now" section or most urgent debt item]
================================================

Commands: dev | build | test | lint
Run /warmup to start a full session.
```

**Validation Gate**:

- [ ] Project type detected
- [ ] Stack identified (framework, database, deployment, package manager)
- [ ] Workflow mode detected
- [ ] Current state assessed (branch, changes, task)
- [ ] First task suggested

**TTS**: `"Onboarding complete. Project understood."`

---

## For Unconfigured Projects

If no `.claude/` directory exists, suggest setup:

```
PROJECT ONBOARDING: [project name]
================================================

This project has no Claude configuration yet.

Recommended setup:
1. Create .claude/CLAUDE.md with project-specific instructions
2. Create .claude/NEXT.md with current task focus
3. Consider running the init-memory command: /init-memory

Want me to set up the basics? [Y/n]
================================================
```

If user says yes, create minimal configuration:

- `.claude/CLAUDE.md` with detected stack and conventions
- `.claude/NEXT.md` with empty template

---

## MCP Server Usage

| Action               | MCP Server                 |
| -------------------- | -------------------------- |
| Read project files   | filesystem (built-in)      |
| Check Notion context | notion MCP (if configured) |

---

## Context Files

```
context_files:
  - .claude/CLAUDE.md
  - .claude/NEXT.md
  - .claude/DEBT.md
  - .claude/ARCHITECTURE.md
  - README.md
  - package.json
```
