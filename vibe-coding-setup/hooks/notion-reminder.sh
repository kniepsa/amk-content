#!/bin/bash
# Progress Check Reminder - UserPromptSubmit hook
# Checks if it's been >15 minutes since last progress check
# Exit 0 with stdout = context injected to Claude

STATE_DIR="$HOME/.claude/quality-state"
TIMESTAMP_FILE="$STATE_DIR/last-progress-check"

mkdir -p "$STATE_DIR"

# If no timestamp file, create it and remind
if [ ! -f "$TIMESTAMP_FILE" ]; then
  echo "[Reminder] 15+ minutes since last progress check. Update .claude/features/ or NEXT.md with current status."
  touch "$TIMESTAMP_FILE"
  exit 0
fi

# Check age of timestamp file (in seconds)
if [ "$(uname)" = "Darwin" ]; then
  LAST_UPDATE=$(stat -f %m "$TIMESTAMP_FILE" 2>/dev/null || echo 0)
else
  LAST_UPDATE=$(stat -c %Y "$TIMESTAMP_FILE" 2>/dev/null || echo 0)
fi

NOW=$(date +%s)
ELAPSED=$(( NOW - LAST_UPDATE ))

# 15 minutes = 900 seconds
if [ "$ELAPSED" -gt 900 ]; then
  echo "[Reminder] 15+ minutes since last progress check. Update .claude/features/ or NEXT.md with current status."
  touch "$TIMESTAMP_FILE"
fi

exit 0
