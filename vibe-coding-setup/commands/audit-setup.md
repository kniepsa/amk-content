---
description: Check vibe-coding-setup health and suggest improvements
---

# Audit Setup - Self-Check

## What This Does

Check vibe-coding-setup for duplication, staleness, and MECE violations.

## Execution Steps

### Step 1: Scan for Duplication

```
Compare all .md files in vibe-coding-setup/
Find repeated content (>3 lines identical)
Flag files with >20% overlap
```

### Step 2: Check Command Usage

```
Cross-reference with /learn metrics
Identify unused commands (never/rarely used)
Suggest archiving or deletion
```

### Step 3: Detect Staleness

```
Check file last-modified dates
Flag files not updated in >6 months
Check if content still relevant
```

### Step 4: MECE Validation

```
List all purposes covered
Find gaps (missing coverage)
Find overlaps (same purpose, multiple files)
```

### Step 5: Show Report

```
Duplication: X files, Y lines
Unused: [list of commands]
Stale: [list of old files]
MECE gaps: [list]
Recommendations: [actions]
```

## Example Output

```
/audit-setup

Scanning vibe-coding-setup...

Duplication found:
⚠ skills/vibe-coding.md duplicates README.md (80% overlap)
⚠ skills/notion-workflow.md duplicates CLAUDE.md

Unused commands:
⚠ /standup - used 0 times in last 30 days

Stale files:
⚠ STARTER_KIT.md - last updated 6 months ago

MECE gaps:
✓ No learning loop → Recommend /learn command
✓ No cleaning loop → Recommend /audit-setup command

Recommendations:
1. Delete skills/vibe-coding.md (duplicate)
2. Delete skills/notion-workflow.md (duplicate)
3. Archive or update STARTER_KIT.md
4. Create /learn and /audit-setup commands

Token savings: ~2,100 tokens (15%)
```
