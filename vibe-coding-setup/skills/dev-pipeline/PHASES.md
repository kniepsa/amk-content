# Dev Pipeline - Phase Details

Companion reference for the dev-pipeline skill. Each phase includes what success looks like, common pitfalls, and tool usage.

---

## Phase 1: CLARIFY

### What Success Looks Like

- One-sentence problem statement that anyone can understand
- Clear scope boundaries (in/out)
- Acceptance criteria that are testable
- No ambiguous requirements remaining

### Common Pitfalls

- Jumping to solution before understanding problem
- Accepting vague requirements ("make it better")
- Scope too large for a single feature cycle
- Missing edge cases that surface during BUILD

### Tools and Commands

| Tool         | Purpose                                     |
| ------------ | ------------------------------------------- |
| `/analyst`   | Structured requirements clarification       |
| serper MCP   | Market research, competitive analysis       |
| context7 MCP | Check framework capabilities before scoping |

### Checklist

- [ ] Problem statement written (one sentence)
- [ ] Target user identified
- [ ] Scope boundaries defined (in/out/later)
- [ ] Acceptance criteria drafted (Given/When/Then)
- [ ] User confirmed understanding
- [ ] No blocking questions remain

---

## Phase 2: DESIGN

### What Success Looks Like

- PM brief captures the "what" and "why"
- Architecture captures the "how"
- Data model is concrete (tables, fields, relations)
- API design follows RESTful conventions
- Component structure follows atomic design
- Edge cases are documented before coding starts

### Common Pitfalls

- Over-engineering for hypothetical scale
- Missing RLS policies in data model
- Forgetting loading/error/empty states
- Not checking existing code for reusable patterns
- Building when a library exists (check shadcn/ui first)

### Tools and Commands

| Tool               | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `/pm`              | Product brief creation                       |
| `/architect`       | System design                                |
| `/strategy`        | Multi-persona strategic analysis (if needed) |
| `/advisory-debate` | 5-expert deliberation (for major decisions)  |
| context7 MCP       | Framework docs, best practices               |

### PM Brief Checklist

- [ ] Problem defined in one sentence
- [ ] Target user identified
- [ ] MVP scope: must-have items listed
- [ ] Out of scope items listed
- [ ] Success metric defined
- [ ] User story in Als/kann ich/damit format

### Architecture Checklist

- [ ] Data model with entities and relations
- [ ] API endpoints listed with methods
- [ ] Component structure outlined
- [ ] Edge cases documented (empty/error/loading)
- [ ] Dependencies identified (existing + new)
- [ ] Files to create/modify listed

---

## Phase 3: PLAN

### What Success Looks Like

- Story file contains everything needed to implement autonomously
- Another developer could pick up this story and build without questions
- Tasks are concrete and ordered
- Acceptance criteria are testable
- Technical approach is specified

### Common Pitfalls

- Story too vague ("implement the feature")
- Missing technical approach (how to implement)
- No files-to-touch list (leads to discovery during BUILD)
- Acceptance criteria not testable
- Dependencies not resolved before starting

### Tools and Commands

| Tool           | Purpose                             |
| -------------- | ----------------------------------- |
| `/story`       | Create story file with full context |
| `/story-check` | Validate story completeness         |

### Story Completeness Criteria

Required sections:

- Context: Why are we building this?
- Problem: What specific problem does it solve?
- Solution: High-level approach
- Scope: In-scope tasks (2+ items) and out-of-scope
- Acceptance Criteria: Given/When/Then (1+ items)

Recommended sections:

- Technical Approach: Data model, API, components
- Files to Touch: Specific paths and what changes
- Edge Cases: What could go wrong and how to handle
- Dependencies: What must exist before we start

---

## Phase 4: BUILD

### What Success Looks Like

- Feature implemented according to story spec
- TypeScript strict mode, no `any` types
- Tests written alongside code (TDD preferred)
- Atomic commits with conventional messages
- Lint and typecheck pass continuously
- Stayed on scope (no gold-plating)

### Common Pitfalls

- Starting without reading the story file
- Not running lint/typecheck until the end
- Writing tests after implementation (harder to catch design issues)
- Scope creep ("while I am here, let me also...")
- Not committing atomically (giant commits are hard to review)
- Forgetting auth checks before mutations
- Missing RLS policies on new tables
- Using `any` instead of `unknown` + type guards

### Build Rhythm

```
1. Read next task from story scope
2. Write test (if applicable)
3. Implement
4. Run: pnpm lint && pnpm typecheck
5. Commit: git commit -m "feat: implement [task]"
6. Repeat for next task
7. Every 15-20 min: update Notion progress
```

### Quality Gates During Build

| Check            | Frequency                     | Command     |
| ---------------- | ----------------------------- | ----------- |
| `pnpm lint`      | After each significant change | Terminal    |
| `pnpm typecheck` | After each significant change | Terminal    |
| `pnpm test`      | After completing each task    | Terminal    |
| Scope check      | Every 15-20 minutes           | Self-review |
| Notion update    | Every 15-20 minutes           | Notion MCP  |

### Tools and Commands

| Tool         | Purpose                           |
| ------------ | --------------------------------- |
| context7 MCP | Look up framework APIs, patterns  |
| serper MCP   | Debug issues, find solutions      |
| `/debug`     | If bugs encountered during build  |
| `/focus`     | Deep work timer for concentration |

---

## Phase 5: VERIFY

### What Success Looks Like

- All unit tests pass
- TypeScript compiles without errors
- ESLint reports no issues
- No critical quality findings
- UX review passes (if UI changes)
- `pnpm build` succeeds (production build)

### Common Pitfalls

- Skipping visual testing for "small" UI changes
- Not running full build before shipping
- Ignoring warning-level findings (they accumulate)
- Testing happy path only, missing edge cases
- Not checking mobile responsiveness

### Verification Steps

1. **Unit Tests**: `pnpm test` - all must pass
2. **Type Safety**: `pnpm typecheck` - zero errors
3. **Linting**: `pnpm lint` - zero errors
4. **Production Build**: `pnpm build` - must succeed
5. **Quality Scan**: `/quality-check` - no critical findings
6. **Visual Test**: `/test visual` (if UI changes detected)
7. **UX Review**: `/ux-review` (if UI changes detected)

### Tools and Commands

| Tool             | Purpose                        |
| ---------------- | ------------------------------ |
| `/test`          | Run unit and visual tests      |
| `/quality-check` | Comprehensive quality scan     |
| `/ux-review`     | Joe Gebbia's design principles |
| playwright MCP   | Visual regression testing      |

---

## Phase 6: SHIP

### What Success Looks Like

- Clean commit with conventional message
- Push succeeded
- CI checks passed
- PR created and merged (feature branch)
- Vercel deployment triggered
- Feature status updated (if Features mode)

### Common Pitfalls

- Merge conflicts with main (fetch and merge first)
- CI failures from environment differences
- Forgetting to update feature status
- Not waiting for deployment to complete

### Ship Flow

For feature branches:

```
1. Sync with main: git fetch origin main && git merge origin/main
2. Push: git push -u origin [branch]
3. Create PR: gh pr create
4. Wait for CI: gh pr checks
5. Merge: gh pr merge --squash --delete-branch
6. Switch to main: git checkout main && git pull
```

For main branch (direct ship):

```
1. Stage: git add .
2. Commit: conventional message
3. Push: git push
```

### Tools and Commands

| Tool       | Purpose                        |
| ---------- | ------------------------------ |
| `/ship`    | Handles the complete ship flow |
| github MCP | PR creation and management     |

---

## Phase 7: LEARN

### What Success Looks Like

- All session gotchas captured in CLAUDE.md
- Significant decisions recorded as ADRs
- New technical debt logged in DEBT.md
- Fixed debt items removed from DEBT.md
- NEXT.md updated with task status
- Feature progress tracked
- Content ideas captured (if any)
- Architecture diagram updated (if applicable)

### Common Pitfalls

- Skipping session-end when tired
- Not capturing gotchas (same bug will hit again)
- Documenting too much (CLAUDE.md bloat)
- Not pruning old items from NEXT.md

### Tools and Commands

| Tool           | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `/session-end` | Complete session analysis and knowledge capture |
| `/learn`       | Quick learning capture (mid-session)            |
| notion MCP     | Final progress sync                             |
| playwright MCP | Feature verification (shipped features)         |

---

## Mode-Specific Behavior

### BMM Mode

- Phase 3 uses sprint-status.yaml stories instead of creating new story files
- Phase 4 updates story status in sprint-status.yaml
- Phase 6 updates epic progress after ship
- Phase 7 checks for epic completion

### Features Mode

- Phase 3 creates/uses feature spec in `.claude/features/`
- Phase 4 creates feature branch: `feature/F-XXX-name`
- Phase 6 updates feature spec status, moves to `done/` if complete
- Phase 7 verifies shipped features via Playwright

### Solo Mode

- Phase 3 uses NEXT.md tasks (lighter weight)
- Phase 4 works on main branch (no feature branch)
- Phase 6 direct push to main
- Phase 7 updates NEXT.md only
