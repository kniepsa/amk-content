#!/usr/bin/env bash
# update.sh - Deploy Vibe Coding Setup to global config and registered projects
# Usage: ./update.sh
# Reads VERSION and .registry from the same directory as this script.

set -euo pipefail

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION=$(cat "$SCRIPT_DIR/VERSION")
GLOBAL_DIR="$HOME/.claude"
REGISTRY="$SCRIPT_DIR/.registry"

echo "Vibe Coding Setup v${VERSION} - Deploying..."
echo ""

# ---------------------------------------------------------------------------
# Step 1: Push global files to ~/.claude/
# ---------------------------------------------------------------------------

echo "--- Global (~/.claude/) ---"

# Ensure target directories exist
mkdir -p "$GLOBAL_DIR/commands"
mkdir -p "$GLOBAL_DIR/skills"
mkdir -p "$GLOBAL_DIR/agents"
mkdir -p "$GLOBAL_DIR/hooks"
mkdir -p "$GLOBAL_DIR/templates/.claude"

# Commands
if [ -d "$SCRIPT_DIR/commands" ]; then
  cp "$SCRIPT_DIR"/commands/*.md "$GLOBAL_DIR/commands/" 2>/dev/null && \
    echo "  commands/*.md copied" || echo "  commands/*.md - nothing to copy"
fi

# Skills
if [ -d "$SCRIPT_DIR/skills" ]; then
  cp -R "$SCRIPT_DIR"/skills/* "$GLOBAL_DIR/skills/" 2>/dev/null && \
    echo "  skills/* copied" || echo "  skills/* - nothing to copy"
fi

# Agents
if [ -d "$SCRIPT_DIR/agents" ]; then
  cp "$SCRIPT_DIR"/agents/*.md "$GLOBAL_DIR/agents/" 2>/dev/null && \
    echo "  agents/*.md copied" || echo "  agents/*.md - nothing to copy"
fi

# Hooks (shell scripts)
if [ -d "$SCRIPT_DIR/hooks" ]; then
  cp "$SCRIPT_DIR"/hooks/*.sh "$GLOBAL_DIR/hooks/" 2>/dev/null && \
    echo "  hooks/*.sh copied" || echo "  hooks/*.sh - nothing to copy"
  # Make all hook scripts executable
  chmod +x "$GLOBAL_DIR"/hooks/*.sh 2>/dev/null || true
fi

# Templates
if [ -d "$SCRIPT_DIR/templates/.claude" ]; then
  cp -R "$SCRIPT_DIR/templates/.claude/" "$GLOBAL_DIR/templates/.claude/"
  echo "  templates/.claude/ copied"
fi

# CLAUDE.md
if [ -f "$SCRIPT_DIR/CLAUDE.md" ]; then
  cp "$SCRIPT_DIR/CLAUDE.md" "$GLOBAL_DIR/CLAUDE.md"
  echo "  CLAUDE.md copied"
fi

# VERSION
cp "$SCRIPT_DIR/VERSION" "$GLOBAL_DIR/VERSION"
echo "  VERSION copied"

# Stamp global version
echo "$VERSION" > "$GLOBAL_DIR/.vibe-version"
echo "  .vibe-version stamped"

echo ""

# ---------------------------------------------------------------------------
# Step 2: Update registered projects
# ---------------------------------------------------------------------------

echo "--- Projects (.registry) ---"

if [ ! -f "$REGISTRY" ]; then
  echo "  No .registry file found. Skipping project updates."
  echo ""
  echo "Vibe Coding v${VERSION} deployed. Global only (no registry)."
  exit 0
fi

UPDATED=0
SKIPPED=0

while IFS= read -r line; do
  # Skip empty lines and comments
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue

  # Expand ~ to $HOME
  project_path="${line/#\~/$HOME}"

  # Extract project name for display
  project_name=$(basename "$project_path")

  # Check if .claude/ directory exists in the project
  if [ -d "$project_path/.claude" ]; then
    # Copy settings.json from template
    if [ -f "$SCRIPT_DIR/templates/.claude/settings.json" ]; then
      cp "$SCRIPT_DIR/templates/.claude/settings.json" "$project_path/.claude/settings.json"
    fi

    # Stamp version
    echo "$VERSION" > "$project_path/.claude/.vibe-version"

    echo "  ✓ $project_name (updated)"
    UPDATED=$((UPDATED + 1))
  else
    echo "  ✗ $project_name (not found: $project_path/.claude/)"
    SKIPPED=$((SKIPPED + 1))
  fi
done < "$REGISTRY"

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo ""
echo "Vibe Coding v${VERSION} deployed. Global + ${UPDATED} projects updated."
if [ "$SKIPPED" -gt 0 ]; then
  echo "  ($SKIPPED projects skipped - missing .claude/ directory)"
fi
