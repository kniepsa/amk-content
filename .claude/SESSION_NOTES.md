# Session: 2025-01-28 - Vibe Coding Dashboard Business Planning

## What We Accomplished

### 1. Created Business Plan for Vibe Coding Dashboard
**File:** `~/projects/amk-content/business-ideas/vibe-coding-dashboard.md` (49KB)

A comprehensive business plan for a GUI dashboard that makes Claude Code accessible to semi-technical entrepreneurs.

**Key Components:**
- Target: Entrepreneurs willing to install dev tools but scared of terminal
- Product: Visual dashboard (Next.js + Supabase + Vercel)
- Features: Task board, error monitor, git visualizer, session monitor, Notion integration
- Timeline: 8-10 weeks MVP, 16-18 weeks launch-ready
- Pricing: Free tier + Pro ($29/mo) + Enterprise ($199/mo)
- Revenue Target: $5K MRR by Month 12

**Market Research Conducted:**
- $26-37B no-code/low-code market (32% CAGR)
- Competitors: Lovable, Bolt, Bubble (dominate non-technical market)
- Positioning: Specialist (Next.js + Supabase only) vs generalist
- Competitive advantage: Workflow-focused + Notion integration

### 2. Created Onboarding Template
**File:** `~/projects/amk-content/vibe-coding-setup/GOLDEN_PATH_ONBOARDING_TEMPLATE.md`

Universal onboarding template with placeholders for project-specific data:
- Used by `/onboard` slash command
- Fills: [PROJECT_NAME], [TECH_STACK], [INVARIANTS_FROM_CLAUDE_MD], etc.
- 450+ lines of comprehensive project context

### 3. Enhanced Shell Aliases (Committed)
**File:** `~/projects/amk-content/vibe-coding-setup/bash_aliases`
**Commit:** fd43516 "Add shell alias auto-setup for golden path structure"

Added `ensure-golden-path()` function:
- Auto-creates `.claude/` structure if missing
- Runs BEFORE Claude Code starts (zero friction)
- Updated all project aliases (resto, salvator, hoettche, printulu, invoices, sdk)
- Pure bash = bulletproof (no AI interpretation needed)

## Decisions Made

### 1. Business Model Decision: Hybrid Recommended (Initially)
**Context:** User asked about SaaS vs Educational content

**Analysis:**
- Pure SaaS: $60K Year 1 (slow to revenue, high competition)
- Pure Education: $130K Year 1 (fast revenue, smaller market)
- Hybrid: $160K Year 1 (best risk/reward)

**Final Pivot:** User clarified = GUI dashboard for entrepreneurs (not educational business)

### 2. Target Customer Pivot
**Initial:** Non-technical entrepreneurs
**Market Reality:** Dominated by Lovable ($100M+ funding), Bolt, Bubble
**Final:** Semi-technical entrepreneurs (willing to install dev tools, scared of terminal)

**Rationale:**
- Less competition in "technical but want GUI" segment
- Higher willingness to pay ($79/mo vs $29/mo)
- Lower support burden (understand git, VS Code)
- Natural bridge between CLI and full no-code

### 3. Tech Stack Decision
**Chosen:** Next.js 14 + Supabase + Vercel (ultra-opinionated)

**Why:**
- Dogfooding (same stack as user's projects)
- Deeper integration possible (specialist > generalist)
- Electron wrapper available (can ship as desktop app)
- Real-time subscriptions (Supabase) = live dashboard updates

### 4. Implementation Approach
**Chosen:** Web app first, Electron wrapper later

**Rationale:**
- Easier deployment (Vercel)
- Cross-platform without extra work
- Lower barrier to entry (no download required)
- Can add desktop app later if needed

## User Journey Created

**"Sarah's Story"** - Detailed day-by-day journey showing:
- Day 1: Discovery → Setup → First deploy (15 minutes)
- Day 3: Second feature with custom request
- Day 7: First error handling experience

**Key Insight:** Non-technical users need:
- Visual progress indicators (no "is it stuck?" uncertainty)
- Plain English error messages (not "TS2322")
- One-click fixes ("Ask Claude to Fix" button)
- Real-time activity log (watch Claude work)

## Files Created/Modified

### Created:
1. `business-ideas/vibe-coding-dashboard.md` - Complete business plan (49KB)
2. `vibe-coding-setup/GOLDEN_PATH_ONBOARDING_TEMPLATE.md` - Universal template (452 lines)

### Modified:
1. `vibe-coding-setup/bash_aliases` - Added auto-setup function
2. `vibe-coding-setup/CLAUDE.md` - Added session gotchas (this file)

### Committed:
- fd43516 "Add shell alias auto-setup for golden path structure"

### Pending Commit:
- New business plan document
- Onboarding template

## Technical Insights Captured

### 1. What GUI Adds to Claude Code
- Removes terminal fear (buttons > commands)
- Visualizes hidden state (progress, git status, errors)
- Makes errors actionable (plain English + "Fix" button)
- Replaces memorization (buttons > slash commands)
- Bridges Notion ↔ Code (single dashboard view)
- Enables learning (watch code being written)

### 2. Architecture Pattern
```
Next.js Dashboard
    ↓ (WebSocket/SSE)
Node.js API Server
    ↓ (File watching)
.claude/ folder (NEXT.md, CLAUDE.md, DEBT.md)
    ↓ (Spawned subprocess)
Claude Code CLI
```

**Key Components:**
- chokidar (file watching)
- simple-git (git commands)
- child_process.spawn (Claude Code subprocess)
- WebSocket (real-time updates)
- @notionhq/client (Notion sync)

## Next Steps (If Building This)

### Immediate (This Week):
1. Validate with 3 entrepreneur friends (show mockups)
2. Set up Next.js repo
3. Build NEXT.md parser (core backend)
4. Design UI in Figma
5. Spike: Prove subprocess spawning works

### Phase 1 (Week 1-2): Backend Foundation
- File system watcher
- NEXT.md parser
- Git command executor
- API routes (tasks, git status)

### Phase 2 (Week 3-4): Frontend UI
- Task board (React DnD)
- Error monitor
- Git visualizer
- Real-time updates

### Phase 3 (Week 5-6): Claude Integration
- Process spawning
- stdout/stderr streaming
- WebSocket for logs

## Pending Items

### From Previous Session:
1. Test /onboard on existing project (printulu-vendure)
2. Test /onboard on project without .claude/
3. Update documentation to reference single /onboard command

### New:
1. Commit business plan files
2. Update ~/projects/amk-content/README.md to reference business-ideas folder

## Context for Future Sessions

### Business Direction
User is exploring productizing vibe coding methodology. Two possible paths:
1. **GUI Dashboard** (current plan) - Make Claude Code accessible via visual interface
2. **Educational/SaaS Hybrid** (considered but pivoted) - Teach workflow + cloud tools

Current focus: GUI Dashboard for semi-technical entrepreneurs.

### Key Files to Know
- `business-ideas/vibe-coding-dashboard.md` - Complete product spec
- `vibe-coding-setup/bash_aliases` - Project shortcuts with auto-setup
- `vibe-coding-setup/GOLDEN_PATH_ONBOARDING_TEMPLATE.md` - Universal template

### Market Positioning
- Don't compete with Lovable/Bolt on "no-code for everyone"
- DO compete on "Next.js + Supabase specialist workflow tool"
- Target technical founders who want speed without terminal friction

## Session Metrics

- Duration: ~2 hours
- Files created: 2 major documents (50KB+ content)
- Files modified: 2 (bash_aliases, CLAUDE.md)
- Commits: 1 (shell alias auto-setup)
- Market research: 5 web searches conducted
- Business plan sections: 12 major sections
- User journey: 3 days detailed
- Feature mockups: 6 core features designed
