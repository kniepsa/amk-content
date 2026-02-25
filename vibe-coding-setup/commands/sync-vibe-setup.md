# Sync Vibe Coding Setup

Sync the full vibe coding V3 system between the amk-content repository (source of truth) and `~/.claude/` (active config).

## Direction

This command supports two directions:

- **push** (default): Copy FROM `~/Projects/amk-content/vibe-coding-setup/` TO `~/.claude/` (deploy to active config)
- **pull**: Copy FROM `~/.claude/` TO `~/Projects/amk-content/vibe-coding-setup/` (capture changes for version control)

Ask the user which direction if `$ARGUMENTS` is empty. If `$ARGUMENTS` is "push" or "pull", proceed directly.

---

## Push: Deploy to Active Config

Run these commands to sync everything from the content repo to the active Claude config:

```bash
SOURCE="$HOME/Projects/amk-content/vibe-coding-setup"
TARGET="$HOME/.claude"

# Ensure target directories exist
mkdir -p "$TARGET/commands"
mkdir -p "$TARGET/skills"
mkdir -p "$TARGET/agents"
mkdir -p "$TARGET/hooks"

# Commands - copy all
cp "$SOURCE/commands/"*.md "$TARGET/commands/"

# Skills - copy all skill directories
cp -R "$SOURCE/skills/"* "$TARGET/skills/"

# Agents - copy all
cp "$SOURCE/agents/"*.md "$TARGET/agents/"

# Hooks - copy all
cp "$SOURCE/hooks/"*.sh "$TARGET/hooks/"

# Templates - copy hook templates for project-level install
mkdir -p "$TARGET/templates/.claude/hooks"
cp "$SOURCE/templates/.claude/hooks/"*.sh "$TARGET/templates/.claude/hooks/"
cp "$SOURCE/templates/.claude/settings.json" "$TARGET/templates/.claude/settings.json"

# Make all hook scripts executable
chmod +x "$TARGET/hooks/"*.sh
chmod +x "$TARGET/templates/.claude/hooks/"*.sh

# Copy core docs
cp "$SOURCE/CLAUDE.md" "$TARGET/CLAUDE.md"

# Version tracking
cp "$SOURCE/VERSION" "$TARGET/VERSION"
echo "$(<"$SOURCE/VERSION")" > "$TARGET/.vibe-version"
```

### Propagate to Registered Projects

After syncing to `~/.claude/`, propagate updates to all registered projects:

```bash
SOURCE="$HOME/Projects/amk-content/vibe-coding-setup"
REGISTRY="$SOURCE/.registry"
VERSION=$(cat "$SOURCE/VERSION")

if [ -f "$REGISTRY" ]; then
  while IFS= read -r line; do
    # Skip comments and empty lines
    [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue

    # Expand ~ to $HOME
    project_path="${line/#\~/$HOME}"

    if [ -d "$project_path/.claude" ]; then
      # Update settings.json from template
      cp "$SOURCE/templates/.claude/settings.json" "$project_path/.claude/settings.json"
      # Stamp version
      echo "$VERSION" > "$project_path/.claude/.vibe-version"
      echo "Updated: $line"
    else
      echo "Skipped (no .claude/): $line"
    fi
  done < "$REGISTRY"
else
  echo "No .registry file found — skipping propagation"
fi
```

After push, report:

```
Vibe Coding V3 [VERSION] synced to ~/.claude/

Synced:
- Commands: [N] files
- Skills: [N] directories
- Agents: [N] files
- Hooks: [N] files (made executable)
- Templates: hooks + settings.json
- CLAUDE.md: updated
- VERSION: [VERSION]

Propagation:
- Updated: [list of projects updated]
- Skipped: [list of projects skipped, if any]
```

---

## Pull: Capture for Version Control

Run these commands to sync from active config back to the content repo:

```bash
SOURCE="$HOME/.claude"
TARGET="$HOME/Projects/amk-content/vibe-coding-setup"

# Commands
cp "$SOURCE/commands/"*.md "$TARGET/commands/"

# Skills
cp -R "$SOURCE/skills/"* "$TARGET/skills/"

# Agents
cp "$SOURCE/agents/"*.md "$TARGET/agents/"

# Hooks
cp "$SOURCE/hooks/"*.sh "$TARGET/hooks/"

# Core docs
cp "$SOURCE/CLAUDE.md" "$TARGET/CLAUDE.md"
```

After pull, run:

```bash
cd ~/Projects/amk-content
git status
```

Show the user what changed and suggest:

```
Changes captured. Review the diff, then:
  git add vibe-coding-setup/
  git commit -m "sync: update vibe coding V3 config"
  git push
```

---

## File Inventory

Current files managed by this sync:

### Commands (`commands/*.md`)

adr, advisory-debate, analyst, architect, audit-ecosystem, audit-setup, check-design, debt, debug, focus, gamma-api-setup, init-memory, install, learn, next, pm, quality-check, quick, refactor, session-end, ship, standup, story, story-check, strategy, sync-vibe-setup, test, update-baseline, ux-review, warmup

### Skills (`skills/*/SKILL.md`)

architecture, debug-chain, decision-chain, deploy-check, dev-pipeline, onboard, plan, quality-chain, research, session-flow

### Agents (`agents/*.md`)

builder, researcher, reviewer

### Hooks (`hooks/*.sh`)

damage-control, notion-reminder (progress check), session-start

### Templates (`templates/.claude/`)

hooks/security-scan.sh, hooks/quality-batch.sh, hooks/quality-summary.sh, settings.json

### Distribution

VERSION (semantic version), .registry (installed project paths)
