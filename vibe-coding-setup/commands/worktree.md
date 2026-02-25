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

## Cleanup

```bash
git worktree remove [path]
```

Run when done. All worktrees share one `.git` — no disk bloat from full clones.
