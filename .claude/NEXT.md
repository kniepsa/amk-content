# NEXT - Task Queue

## Current Focus

_No active task. Run /warmup to start._

## Backlog

- [ ] Test /install multi-app flow on a real business (Printulu or Bonn Gastro)
- [ ] Update README.md to reflect current V3 structure
- [ ] Sync new gotchas from vibe-coding-setup/CLAUDE.md → ~/.claude/CLAUDE.md (4 new: context 70%, .claudeignore, two-correction rule, interview pattern)
- [ ] Try /worktree command on a real feature (validate the Boris Cherny parallel worktree pattern — `claude --worktree` is now a native flag in v2.1.49)
- [ ] Explore Docker Sandboxes for Claude Code isolation (Docker Desktop 4.50 feature — container with workspace mounted at same absolute path)
- [ ] Explore LSP tool in Claude Code for go-to-definition, find references, hover docs (new code intelligence)

## Done

- [x] 2026-02-25: Built `/learn` skill + `nextjs-reviewer` agent (compound engineering cherry-picks)
- [x] 2026-02-25: Built statusline.sh (project | model | ctx% | cost | duration | branch)
- [x] 2026-02-25: Fixed statusline bugs (model.display_name, cost.total_cost_usd direct)
- [x] 2026-02-25: Deployed statusline to ~/.claude/hooks/ + all 3 registered projects
- [x] 2026-02-25: Shipped vibe-coding-setup V3 (98 files, commit 6af0427)
- [x] 2026-02-25: Fixed last30days skill (WebSearch instead of context7)
- [x] 2026-02-25: Fixed researcher agent model (haiku-3-5, not opus)
- [x] 2026-02-25: Added 4 gotchas to CLAUDE.md (context 70%, .claudeignore, two-correction rule, interview pattern)
- [x] 2026-02-25: Added power keys to /warmup command
- [x] 2026-02-25: Created /worktree command (Boris Cherny pattern)
- [x] 2026-02-25: Ran /install on amk-content (created .claude/ structure)
- [x] 2026-02-25: Upgraded /install with Step 0: multi-app business context detection
- [x] 2026-02-25: Synced install command to ~/.claude/commands/
