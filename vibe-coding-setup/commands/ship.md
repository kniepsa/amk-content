# Ship to Production

Quick ship to production with one command.

## Instructions

1. Check git status for changes
2. Stage all changes: `git add .`
3. Create a conventional commit message based on the changes:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code refactoring
   - `style:` for formatting changes
   - `docs:` for documentation
   - `chore:` for maintenance tasks
4. Commit with the generated message
5. Push to remote (triggers pre-push validation: types, lint, build)
6. Report deployment status

## Output Format

```
Shipping to production...
[x] Changes staged
[x] Committed: "feat: [description]"
[x] Pushed to [branch]
[x] Pre-push validation passed

Deployed! Vercel will build at: https://vercel.com/[project]
```

If there are no changes, report: "Nothing to ship. Working tree clean."
