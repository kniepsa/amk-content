#!/bin/bash
# Damage Control - PreToolUse hook
# Blocks dangerous bash commands and file operations
# Exit 2 = block (stderr sent to Claude)
# Exit 0 = allow

# Read tool input from stdin
INPUT=$(cat)

# Extract tool name
TOOL_NAME=$(echo "$INPUT" | grep -o '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"tool_name"[[:space:]]*:[[:space:]]*"//' | sed 's/"//')

# Only check Bash tool calls
[ "$TOOL_NAME" != "Bash" ] && exit 0

# Extract the command from tool input
COMMAND=$(echo "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"command"[[:space:]]*:[[:space:]]*"//' | sed 's/"//')

# Also try to get command from the full input for multiline
[ -z "$COMMAND" ] && COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)

[ -z "$COMMAND" ] && exit 0

# Catastrophic deletes
if echo "$COMMAND" | grep -qE 'rm\s+-rf\s+(/|~|/home|/Users)\b'; then
  echo "BLOCKED: Catastrophic delete detected. This would destroy critical system files." >&2
  exit 2
fi

# Database destruction
if echo "$COMMAND" | grep -qiE 'DROP\s+(TABLE|DATABASE)'; then
  echo "BLOCKED: DROP TABLE/DATABASE detected. Use migrations for schema changes." >&2
  exit 2
fi

# Force push to main/master (--force or -f)
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*(--force|-f)\s+.*\s*(main|master)\b'; then
  echo "BLOCKED: Force push to main/master. This rewrites shared history." >&2
  exit 2
fi

# git reset --hard
if echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard'; then
  echo "BLOCKED: git reset --hard discards uncommitted work. Use git stash instead, or ask the user to confirm." >&2
  exit 2
fi

# Sensitive directories
if echo "$COMMAND" | grep -qE '~/?\.(ssh|aws|gnupg)/|~/?\.env\b'; then
  echo "BLOCKED: Access to sensitive credentials directory detected (~/.ssh, ~/.aws, ~/.gnupg, ~/.env)." >&2
  exit 2
fi

# Insecure permissions
if echo "$COMMAND" | grep -qE 'chmod\s+777'; then
  echo "BLOCKED: chmod 777 sets insecure permissions. Use more restrictive permissions (755, 644)." >&2
  exit 2
fi

# Pipe to shell
if echo "$COMMAND" | grep -qE 'curl\s+.*\|\s*(sh|bash)|wget\s+.*\|\s*(sh|bash)'; then
  echo "BLOCKED: Piping remote content to shell is dangerous. Download first, review, then execute." >&2
  exit 2
fi

# Block device writes
if echo "$COMMAND" | grep -qE '>\s*/dev/sd[a-z]|>\s*/dev/nvme|>\s*/dev/disk'; then
  echo "BLOCKED: Writing to block devices can destroy disk data." >&2
  exit 2
fi

# Kill system processes
if echo "$COMMAND" | grep -qE 'pkill\s+-9\s+(init|systemd|launchd|kernel|WindowServer|loginwindow)'; then
  echo "BLOCKED: Killing system processes can crash the operating system." >&2
  exit 2
fi

# All checks passed
exit 0
