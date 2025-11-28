# Golden Path Implementation - Sustainable Speed

**Date**: 2025-11-28
**Status**: ✅ Complete

## What We Built

The "Sustainable Speed Golden Path" - a minimal, pragmatic structure for vibe coding projects that balances speed with sustainability.

### Philosophy

**Not**: Heavy process, documentation theater, over-engineering
**Yes**: AI-readable memory, strategic decisions, enforcement over docs

**Goal**: Ship fast TODAY and still shipping fast in 6 months

## Implementation Summary

### 1. Template Files Created

**Location**: `~/projects/amk-content/vibe-coding-setup/`

- ✅ `CLAUDE.md` - Core project memory (invariants, gotchas, stack)
- ✅ `NEXT.md` - Task management (now/next/later/done)
- ✅ `DEBT.md` - Technical debt tracker
- ✅ `README-template.md` - Standard README structure
- ✅ `.env.example` - Environment variables template
- ✅ `decisions/000-template.md` - ADR template
- ✅ `decisions/README.md` - ADR guidelines

### 2. Slash Commands

**Location**: `~/.claude/commands/`

#### `/init-project`
**Updated**: Scaffolds full golden path structure
- Creates `.claude/` folder with CLAUDE.md, NEXT.md, DEBT.md
- Adds `.claude/decisions/` for strategic ADRs
- Verifies README.md has Quick Start section
- Creates `.env.example` from detected env vars
- Detects project info automatically

#### `/audit-structure` ✨ NEW
**Purpose**: Audits projects against golden path standards
- Checks .claude/ structure completeness
- Validates 2-3 strategic ADRs (not too many!)
- Checks README.md quality (Quick Start, Deploy sections)
- Verifies .env.example exists
- Flags anti-patterns (docs/ folder, scattered files)
- Suggests consolidation

### 3. Bash Aliases

**Location**: `~/.bashrc`

Already exists:
- `init-project` - Scaffolds .claude/ folder from templates
- Project quick-jumps: `resto()`, `salvator()`, `hoettche()`, `sdk()`

## Project Migrations Completed

All 4 projects migrated to golden path structure:

### ✅ restaurant-os
- Created `.env.example`
- Replaced boilerplate README.md with proper Quick Start
- Added Security section to .claude/CLAUDE.md
- Archived scattered docs (7 files → .archive/)
- Has 3 strategic ADRs (perfect!)

### ✅ salvator-standalone
- Updated `.env.example` with all current env vars
- Replaced boilerplate README with restaurant-specific content
- Archived scattered docs (18 files → .archive/)
- Has 1 strategic ADR (migration from Sanity)

### ✅ em-hoettche-restaurant-standalone
- Updated `.env.example` with all env vars
- Replaced boilerplate README with proper Quick Start
- Archived scattered docs (7 files → .archive/)
- Has 1 strategic ADR (migration from Sanity)

### ✅ restaurant-os-sdk
- Created `.env.example` (explains SDK needs no env vars)
- README already excellent (comprehensive API docs)
- Kept MIGRATION.md (useful for SDK consumers)
- Has 2 strategic ADRs (TypeScript choice, GitHub distribution)

## Golden Path Structure

```
[project-name]/
├── .claude/                    # 🧠 AI Memory
│   ├── CLAUDE.md              # Invariants, gotchas, stack
│   ├── NEXT.md                # Current work
│   ├── DEBT.md                # Technical debt
│   └── decisions/             # 2-3 BIG decisions only
│       ├── README.md
│       ├── 000-template.md
│       ├── 001-why-database.md
│       └── 002-why-framework.md
│
├── README.md                  # 📖 Quick Start + Deploy
├── .env.example               # 🔐 Required env vars
├── .gitignore                 # Includes .env*
│
├── src/ or app/               # 📁 All code
│   └── [features]/
│       ├── *.ts
│       └── *.test.ts         # Tests colocated
│
└── package.json               # Scripts here (not scripts/ folder)
```

## What We DIDN'T Do (Anti-Patterns Avoided)

❌ Separate `docs/` folder (goes stale)
❌ Separate `scripts/` folder (use package.json)
❌ Separate `tests/` folder (colocate with code)
❌ More than 5 ADRs (documentation overload)
❌ ARCHITECTURE.md, DEPLOYMENT.md as separate files
❌ Over-engineering with unnecessary abstractions

## Sustainable Speed Principles

### 1. AI-Readable Memory (.claude/ folder)
- Stays current because Claude reads/updates it
- Small, focused files (not 500-line READMEs)
- Invariants and gotchas (hard-won knowledge)

### 2. Strategic ADRs (2-3 per project)
- Only BIG decisions (database, framework, major migrations)
- Not tactical decisions (component structure, linting)
- Template shows: Context → Decision → Consequences → Alternatives

### 3. README.md Single Entry Point
- Quick Start (install → run)
- What This Does (2-3 sentences)
- Stack (list)
- Deploy (commands)
- Links to .claude/ for details

### 4. Enforcement Over Documentation
- Pre-commit hooks (actual enforcement)
- TypeScript strict mode (compiler enforcement)
- ESLint complexity limits (automated checks)
- Not: "Please follow these guidelines" docs

### 5. Delete Aggressively
- Archive scattered docs (don't delete yet, safety)
- Consolidate SECURITY_AUDIT.md → .claude/CLAUDE.md
- Consolidate DEPLOYMENT.md → README.md
- One source of truth per topic

## Usage

### For New Projects
```bash
cd new-project
init-project
# Or use slash command: /init-project
```

### For Existing Projects
```bash
cd existing-project
/audit-structure  # Check compliance
/init-project     # Add missing pieces
```

### After Major Changes
```bash
/audit-structure  # Verify still compliant
```

## Next Steps (Optional)

Future enhancements could include:
- [ ] Pre-commit hook template for quality enforcement
- [ ] Script to sync vibe-coding-setup templates to all projects
- [ ] /consolidate-docs command to automate doc cleanup
- [ ] Metrics tracking (how often we break our own rules?)

## Success Metrics

**Code Reduction**: ~1000 lines eliminated via SDK migration
**Doc Consolidation**: ~30+ scattered .md files archived
**ADR Count**: Average 1.75 per project (not overloaded!)
**Compliance**: All 4 projects now follow golden path

## Key Insight

The answer was already in "vibe coding" - the user invented it:
- .claude/ for AI memory
- Minimal docs that stay current
- Strategic decisions only
- Enforcement over process

We just formalized it and made it repeatable.

---

**Last Updated**: 2025-11-28
**By**: Claude Code implementing sustainable speed architecture
