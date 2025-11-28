# Sync Vibe Coding Setup to Content Repo

Sync the actual config files to the amk-content repository for version control.

## Instructions

Run these commands to sync:

```bash
# Copy core files
cp ~/.claude/CLAUDE.md ~/projects/amk-content/vibe-coding-setup/
cp ~/.claude/VIBE-CODING-GUIDE.md ~/projects/amk-content/vibe-coding-setup/
cp ~/.bash_aliases ~/projects/amk-content/vibe-coding-setup/bash_aliases

# Copy key commands
cp ~/.claude/commands/warmup.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/ship.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/quick.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/next.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/session-end.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/standup.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/check-design.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/update-baseline.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/adr.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/debt.md ~/projects/amk-content/vibe-coding-setup/commands/
cp ~/.claude/commands/init-memory.md ~/projects/amk-content/vibe-coding-setup/commands/

# Commit and push
cd ~/projects/amk-content
git add .
git commit -m "sync: update vibe coding config"
git push
```

After running, confirm: "Vibe coding setup synced to GitHub."
