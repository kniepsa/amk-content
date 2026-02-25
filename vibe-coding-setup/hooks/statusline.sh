#!/usr/bin/env bash
# ~/.claude/hooks/statusline.sh
# Claude Code status line: project | model | context % | cost | duration | branch

# ANSI colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
WHITE='\033[0;37m'
BLUE='\033[0;34m'
DIM='\033[2m'
RESET='\033[0m'

# Read JSON from stdin
input=$(cat)

# --- Project name (folder from workspace.current_dir) ---
cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // empty')
project="${cwd##*/}"
[[ -z "$project" ]] && project="$(basename "$PWD")"

# --- Model display name (official field, e.g. "Sonnet", "Opus", "Haiku") ---
model=$(echo "$input" | jq -r '.model.display_name // "claude"')

# --- Context usage % ---
used_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty')

if [[ -n "$used_pct" && "$used_pct" != "null" ]]; then
  used_int=$(printf "%.0f" "$used_pct")
  ctx_label="${used_int}%"
  if (( used_int < 50 )); then
    ctx_color="$GREEN"
  elif (( used_int <= 80 )); then
    ctx_color="$YELLOW"
  else
    ctx_color="$RED"
  fi
else
  ctx_label="--"
  ctx_color="$DIM"
fi

# --- Actual session cost (provided directly, no estimation needed) ---
cost=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
cost_fmt=$(printf '$%.2f' "$cost")

# --- Session duration ---
duration_ms=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')
duration_sec=$(( duration_ms / 1000 ))
if (( duration_sec >= 60 )); then
  mins=$(( duration_sec / 60 ))
  secs=$(( duration_sec % 60 ))
  duration_label="${mins}m${secs}s"
else
  duration_label="${duration_sec}s"
fi

# --- Git branch ---
git_branch=""
if [[ -n "$cwd" && -d "$cwd" ]]; then
  git_branch=$(git -C "$cwd" symbolic-ref --short HEAD 2>/dev/null)
fi
[[ -z "$git_branch" ]] && git_branch=$(git symbolic-ref --short HEAD 2>/dev/null)
[[ -z "$git_branch" ]] && git_branch="no-git"

# --- Assemble status line ---
printf "${WHITE}%s${RESET}" "$project"
printf " ${DIM}|${RESET} "
printf "${CYAN}⬡ %s${RESET}" "$model"
printf " ${DIM}|${RESET} "
printf "${ctx_color}ctx %s${RESET}" "$ctx_label"
printf " ${DIM}|${RESET} "
printf "${WHITE}%s${RESET}" "$cost_fmt"
printf " ${DIM}|${RESET} "
printf "${DIM}%s${RESET}" "$duration_label"
printf " ${DIM}|${RESET} "
printf "${BLUE}%s${RESET}" "$git_branch"
