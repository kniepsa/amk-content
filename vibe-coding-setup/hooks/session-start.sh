#!/bin/bash
# Session Start - Auto-inject project context
# Runs on: SessionStart (start, resume, clear, compact)
# Output: stdout text is injected into Claude's context

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

if [ ! -f "$PROJECT_DIR/.claude/CLAUDE.md" ]; then
  echo "[Session Context] New project detected. Run /install to initialize vibe coding setup."
  exit 0
fi

CURRENT_TASK=""
if [ -f "$PROJECT_DIR/.claude/NEXT.md" ]; then
  CURRENT_TASK=$(grep -m1 "^Now:" "$PROJECT_DIR/.claude/NEXT.md" 2>/dev/null | sed 's/^Now:[[:space:]]*//')
fi

BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "unknown")
UNCOMMITTED=$(git -C "$PROJECT_DIR" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
LAST_COMMIT=$(git -C "$PROJECT_DIR" log -1 --format="%s" 2>/dev/null || echo "none")

CRITICAL_COUNT=0
FINDINGS_FILE="$HOME/.claude/quality-state/findings.jsonl"
if [ -f "$FINDINGS_FILE" ]; then
  CRITICAL_COUNT=$(grep -c '"severity":"critical"' "$FINDINGS_FILE" 2>/dev/null || echo 0)
fi

MODE="Solo"
if [ -f "$PROJECT_DIR/docs/sprint-status.yaml" ]; then
  MODE="BMM"
elif [ -d "$PROJECT_DIR/.claude/features" ] && ls "$PROJECT_DIR/.claude/features/"*.md >/dev/null 2>&1; then
  MODE="Features"
fi

# Version staleness check
VERSION_STALE=0
INSTALLED_VERSION=""
SOURCE_VERSION=""
INSTALLED_VERSION_FILE="$HOME/.claude/.vibe-version"
SOURCE_VERSION_FILE="$HOME/Projects/amk-content/vibe-coding-setup/VERSION"
if [ -f "$INSTALLED_VERSION_FILE" ] && [ -f "$SOURCE_VERSION_FILE" ]; then
  INSTALLED_VERSION=$(cat "$INSTALLED_VERSION_FILE" 2>/dev/null | tr -d '[:space:]')
  SOURCE_VERSION=$(cat "$SOURCE_VERSION_FILE" 2>/dev/null | tr -d '[:space:]')
  if [ -n "$INSTALLED_VERSION" ] && [ -n "$SOURCE_VERSION" ] && [ "$INSTALLED_VERSION" != "$SOURCE_VERSION" ]; then
    VERSION_STALE=1
  fi
fi

PROJECT_NAME=$(basename "$PROJECT_DIR")
echo "[Session Context]"
echo "Mode: $MODE | Project: $PROJECT_NAME"
[ -n "$CURRENT_TASK" ] && echo "Task: $CURRENT_TASK"
echo "Branch: $BRANCH | $UNCOMMITTED uncommitted changes"
echo "Last commit: $LAST_COMMIT"
[ "$CRITICAL_COUNT" -gt 0 ] && echo "Quality: $CRITICAL_COUNT critical finding(s)"
[ "$VERSION_STALE" -eq 1 ] && echo "Update: Vibe Coding $INSTALLED_VERSION -> $SOURCE_VERSION available (run /sync-vibe-setup push)"

mkdir -p "$HOME/.claude/quality-state"
touch "$HOME/.claude/quality-state/last-progress-check"

exit 0
