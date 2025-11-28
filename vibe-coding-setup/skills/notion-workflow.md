---
description: Notion MCP integration - rocks, tasks, database queries
globs:
  - "**/.claude/CLAUDE.md"
alwaysApply: false
---

# Notion Workflow

## Teamspaces
| Teamspace | Projects |
|-----------|----------|
| **Bonn Gastro** | restaurant-os, salvator-standalone, em-hoettche-restaurant-standalone |
| **Knibo Invest** | invoice-splitter, HG-WE10/* |
| **Printulu** | vendure-*, printulu-* |

## Database IDs (Knibo Invest)
- Rocks: `07e08527-b3dd-4521-bae6-92aac5b9b183`
- Tasks: `7c2fe91e-0c3a-487b-9530-b2a7f24b64dd`

## Update Frequency
Update Notion every 15-20 minutes or after completing features.

## Rock Updates
1. Check project CLAUDE.md for `notion_rock_id`
2. Query rock to get current status
3. Update progress % when milestones complete

## Task Management
1. Create tasks linked to Related Rock
2. Mark tasks Done when complete
3. Add new tasks as discovered

## MCP Commands
```
mcp__notion__API-post-search - Find pages/databases
mcp__notion__API-post-database-query - Query database
mcp__notion__API-patch-page - Update page properties
mcp__notion__API-create-a-comment - Add comments
```

## If No Rock Exists
Warn user: "No Notion rock linked. Consider creating one for tracking."
