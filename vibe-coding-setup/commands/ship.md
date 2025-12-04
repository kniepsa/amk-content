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

## BMM Integration

If `docs/sprint-status.yaml` exists:
1. After successful push, update current story status to `completed`
2. Show progress: "[X/Y] stories done in epic"
3. If epic complete: Suggest `/session-end` for retrospective

## Output Format

```
Shipping to production...
[x] Changes staged
[x] Committed: "feat: [description]"
[x] Pushed to [branch]
[x] Pre-push validation passed

Deployed! Vercel will build at: https://vercel.com/[project]

🔷 BMM: Updated story [id] to completed (4/7 in epic)
```

If there are no changes, report: "Nothing to ship. Working tree clean."

## TTS Momentum Marker

After successful ship, speak confirmation:
```bash
.claude/hooks/play-tts.sh "Shipped."
```

On failure:
```bash
.claude/hooks/play-tts.sh "Ship failed. Check the errors."
```

Keep messages minimal for low verbosity mode.
