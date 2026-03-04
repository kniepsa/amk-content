Open an isolated git worktree for parallel Claude sessions.

## Usage

```bash
claude --worktree [branch-name]
```

Native feature shipped Feb 20, 2026. Each worktree is a separate working directory sharing the same `.git` — lightweight, no clone needed.

## Naming Conventions

| Prefix       | Use For                        |
| ------------ | ------------------------------ |
| `feature/x`  | New feature development        |
| `review/x`   | Code review session            |
| `fix/x`      | Bug fix isolation              |
| `refactor/x` | Refactoring (keeps main clean) |

## Writer / Reviewer Pattern

Run 2 parallel sessions max:

- **Session A (Writer)**: Builds the feature
- **Session B (Reviewer)**: Reviews with fresh context — unbiased, no anchoring to the writer's choices

Fresh context = better reviews. The reviewer hasn't seen the commits being made live.

## In-Session Worktree (Native EnterWorktree)

For isolated work within an existing Claude session, use the native `EnterWorktree` tool instead of the CLI flag:

- Creates a temporary git worktree in `.claude/worktrees/` tied to the current session
- Automatically cleaned up when the session ends (if no changes were made)
- Use the `/worktree` slash command or say "work in a worktree" to trigger it
- Accepts an optional name: `"start a worktree named feature/auth"`

Best for single-session isolation where you want a clean slate without starting a new terminal session. The CLI `--worktree` flag is better for multi-session parallel work.

## Cleanup

```bash
git worktree remove [path]
```

Run when done. All worktrees share one `.git` — no disk bloat from full clones.
