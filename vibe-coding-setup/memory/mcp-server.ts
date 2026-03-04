/**
 * Printulu Memory MCP Server
 * Provides search_memory and search_commits tools to Claude.
 *
 * Register in ~/.claude/settings.json:
 * {
 *   "mcpServers": {
 *     "amk-memory": {
 *       "command": "npx",
 *       "args": ["tsx", "/Users/amk/Projects/amk-content/vibe-coding-setup/memory/mcp-server.ts"],
 *       "env": { "MEMORY_DB": "/Users/amk/.claude/amk-memory.db" }
 *     }
 *   }
 * }
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import Database from "better-sqlite3";
import {
  readFileSync,
  existsSync,
  appendFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH =
  process.env.MEMORY_DB || join(process.env.HOME!, ".claude/amk-memory.db");
const SCHEMA_PATH = join(__dirname, "schema.sql");

// Open and init DB
function openDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(readFileSync(SCHEMA_PATH, "utf-8"));
  return db;
}

const db = openDb();

interface MemoryResult {
  id: number;
  type: string;
  project: string;
  title: string;
  content: string;
  tags: string;
  severity: string;
  source: string;
}

interface CommitResult {
  id: number;
  repo: string;
  short_hash: string;
  date: string;
  author: string;
  message: string;
  body: string;
}

function searchMemory(
  query: string,
  project?: string,
  type?: string,
  limit: number = 5,
): MemoryResult[] {
  const conditions: string[] = [];
  const params: Record<string, string | number> = { limit, query };

  if (type) {
    conditions.push("m.type = @type");
    params.type = type;
  }
  if (project) {
    conditions.push("m.project = @project");
    params.project = project;
  }

  const whereClause =
    conditions.length > 0 ? "AND " + conditions.join(" AND ") : "";

  const sql = `
    SELECT m.id, m.type, m.project, m.title, m.content, m.tags, m.severity, m.source
    FROM memory_fts
    JOIN memory m ON m.id = memory_fts.rowid
    WHERE memory_fts MATCH @query
    ${whereClause}
    ORDER BY memory_fts.rank
    LIMIT @limit
  `;

  return db.prepare(sql).all(params) as MemoryResult[];
}

function searchCommits(
  query: string,
  repo?: string,
  limit: number = 10,
): CommitResult[] {
  const conditions: string[] = [];
  const params: Record<string, string | number> = { limit, query };

  if (repo) {
    conditions.push("gc.repo = @repo");
    params.repo = repo;
  }

  const whereClause =
    conditions.length > 0 ? "AND " + conditions.join(" AND ") : "";

  const sql = `
    SELECT gc.id, gc.repo, gc.short_hash, gc.date, gc.author, gc.message, gc.body
    FROM commits_fts
    JOIN git_commits gc ON gc.id = commits_fts.rowid
    WHERE commits_fts MATCH @query
    ${whereClause}
    ORDER BY commits_fts.rank
    LIMIT @limit
  `;

  return db.prepare(sql).all(params) as CommitResult[];
}

function formatMemoryResult(r: MemoryResult): string {
  const badge =
    r.severity === "critical"
      ? "🚨 CRITICAL"
      : r.severity === "important"
        ? "⚠️ IMPORTANT"
        : "ℹ️ NOTE";
  return [
    `**${badge}: ${r.title}**`,
    `Project: ${r.project || "unknown"} | Type: ${r.type} | Source: ${r.source}`,
    "",
    r.content.slice(0, 800),
    r.tags ? `\nTags: ${r.tags}` : "",
  ]
    .join("\n")
    .trim();
}

function formatCommitResult(r: CommitResult): string {
  return [
    `**[${r.repo}] ${r.short_hash}** (${r.date?.slice(0, 10) || "unknown"})`,
    `Author: ${r.author}`,
    `${r.message}`,
    r.body ? `\n${r.body.slice(0, 300)}` : "",
  ]
    .join("\n")
    .trim();
}

// ---------------------------------------------------------------------------
// Write helpers
// ---------------------------------------------------------------------------

function resolveProjectPath(project: string): string | null {
  if (process.env.CLAUDE_PROJECT_DIR) return process.env.CLAUDE_PROJECT_DIR;
  const HOME = process.env.HOME!;
  if (project === "vibe-coding")
    return join(HOME, "Projects/amk-content/vibe-coding-setup");
  const candidates = [
    join(HOME, "Projects/printulu", project),
    join(HOME, "Projects", project),
  ];
  return candidates.find((p) => existsSync(join(p, ".claude"))) ?? null;
}

function appendToNextMd(projectPath: string, title: string): void {
  const nextMdPath = join(projectPath, ".claude", "NEXT.md");
  if (!existsSync(nextMdPath)) return;
  const content = readFileSync(nextMdPath, "utf-8");
  // Append under "Up Next" section if found, else append to end
  const upNextMatch = content.match(/(## Up Next[^\n]*\n)/);
  if (upNextMatch) {
    const idx = content.indexOf(upNextMatch[0]) + upNextMatch[0].length;
    const updated =
      content.slice(0, idx) + `\n- [ ] ${title}\n` + content.slice(idx);
    writeFileSync(nextMdPath, updated);
  } else {
    appendFileSync(nextMdPath, `\n- [ ] ${title}\n`);
  }
}

function syncTasksFromNextMd(
  db: Database.Database,
  project: string,
  projectPath: string,
): number {
  const nextMdPath = join(projectPath, ".claude", "NEXT.md");
  if (!existsSync(nextMdPath)) return 0;
  const content = readFileSync(nextMdPath, "utf-8");
  const relPath = `${project}/.claude/NEXT.md`;

  // Remove existing NEXT.md-sourced tasks for this project
  db.prepare(
    `DELETE FROM memory WHERE type = 'task' AND project = ? AND source = ?`,
  ).run(project, relPath);

  const insert = db.prepare(`
    INSERT INTO memory (type, project, title, content, tags, severity, source, heading)
    VALUES ('task', @project, @title, @title, @tags, @severity, @source, @title)
  `);

  let count = 0;
  for (const line of content.split("\n")) {
    const openMatch = line.match(/^[-*]\s+\[ \]\s+(.+)/);
    const doneMatch = line.match(/^[-*]\s+\[x\]\s+(.+)/i);
    if (!openMatch && !doneMatch) continue;

    const title = (openMatch ?? doneMatch)![1].trim();
    const status = doneMatch ? "done" : "open";
    const priorityMatch = title.match(/\b(P0|P1|P2)\b/);
    const priority = priorityMatch ? priorityMatch[1] : "";
    const tags = [status, priority, project].filter(Boolean).join(",");
    const severity =
      priority === "P0" ? "critical" : priority === "P1" ? "important" : "note";

    insert.run({ project, title, tags, severity, source: relPath });
    count++;
  }
  return count;
}

function getNextFeatureId(
  db: Database.Database,
  project: string,
  projectPath: string,
): string {
  let maxNum = 0;
  // Check filesystem
  const featuresDir = join(projectPath, ".claude", "features");
  for (const subDir of [featuresDir, join(featuresDir, "done")]) {
    if (existsSync(subDir)) {
      for (const f of readdirSync(subDir)) {
        const m = f.match(/^F-(?:[A-Z]+-)?(\d+)/);
        if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
      }
    }
  }
  // Check DB
  const dbRows = db
    .prepare(`SELECT title FROM memory WHERE type = 'feature' AND project = ?`)
    .all(project) as Array<{ title: string }>;
  for (const { title } of dbRows) {
    const m = title.match(/^F-(?:[A-Z]+-)?(\d+)/);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  }
  return `F-${String(maxNum + 1).padStart(3, "0")}`;
}

function createFeatureMd(
  projectPath: string,
  featureId: string,
  title: string,
  description: string,
  priority: string,
): string {
  const kebab = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const filename = `${featureId}-${kebab}.md`;
  const featuresDir = join(projectPath, ".claude", "features");
  mkdirSync(featuresDir, { recursive: true });
  const filePath = join(featuresDir, filename);
  const content = `# ${featureId}: ${title}

**Status:** Planned
**Priority:** ${priority}
**Dependencies:** None

## Description

${description}

## Success Criteria

- [ ] [Define criteria]
- [ ] Tests pass
- [ ] Deployed to production
`;
  writeFileSync(filePath, content);
  return filename;
}

// Types for write operations
interface TaskRow {
  id: number;
  type: string;
  project: string;
  title: string;
  content: string;
  tags: string;
  severity: string;
  source: string;
}

// Create MCP server
const server = new Server(
  { name: "amk-memory", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_memory",
      description:
        "Search the AMK developer knowledge base for gotchas, patterns, decisions, and architectural notes across all projects. Use this before coding to check for known issues.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query (full-text search with BM25 ranking)",
          },
          project: {
            type: "string",
            description:
              "Filter by project: vendure | ops-hub | shop | growth | printulu | vibe-coding",
          },
          type: {
            type: "string",
            description:
              "Filter by type: gotcha | adr | feature | bug | pattern | decision | doc | note | task | prd",
          },
          limit: {
            type: "number",
            description: "Max results to return (default: 5)",
          },
        },
        required: ["query"],
      },
    },
    {
      name: "add_task",
      description:
        "Add a task to the SQLite memory DB and append it to the project's NEXT.md. Use after plan approval or when capturing a new action item.",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Task title" },
          project: {
            type: "string",
            description:
              "Project name: vendure | ops-hub | shop | printulu | vibe-coding",
          },
          priority: {
            type: "string",
            description: "Optional priority: P0 | P1 | P2",
          },
          description: {
            type: "string",
            description: "Optional longer description",
          },
          status: {
            type: "string",
            description: "Task status: open (default) | done",
          },
        },
        required: ["title", "project"],
      },
    },
    {
      name: "list_tasks",
      description:
        "List tasks from the SQLite memory DB, optionally filtered by project and status.",
      inputSchema: {
        type: "object",
        properties: {
          project: { type: "string", description: "Filter by project" },
          status: {
            type: "string",
            description: "Filter by status: open | done",
          },
        },
      },
    },
    {
      name: "add_prd",
      description:
        "Add a PRD/feature to the SQLite memory DB and create a feature spec markdown file. Use after plan approval.",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Feature/PRD title" },
          project: {
            type: "string",
            description:
              "Project name: vendure | ops-hub | shop | printulu | vibe-coding",
          },
          feature_id: {
            type: "string",
            description:
              "Optional feature ID (e.g. F-022). Auto-incremented if omitted.",
          },
          description: {
            type: "string",
            description: "Feature description / summary",
          },
          priority: {
            type: "string",
            description: "Priority: P0 | P1 | P2 (default P1)",
          },
        },
        required: ["title", "project"],
      },
    },
    {
      name: "list_prds",
      description:
        "List PRDs/features from the SQLite memory DB, optionally filtered by project.",
      inputSchema: {
        type: "object",
        properties: {
          project: { type: "string", description: "Filter by project" },
        },
      },
    },
    {
      name: "sync_tasks",
      description:
        "Sync all tasks from a project's NEXT.md into the SQLite DB (idempotent). Run after session-end or plan approval to keep DB in sync.",
      inputSchema: {
        type: "object",
        properties: {
          project: { type: "string", description: "Project to sync" },
        },
        required: ["project"],
      },
    },
    {
      name: "search_commits",
      description:
        "Search git commit history across all Printulu repos to find when changes were made.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for commit messages",
          },
          repo: {
            type: "string",
            description:
              "Filter by repo: vendure | ops-hub | shop | growth-engine | printulu",
          },
          limit: {
            type: "number",
            description: "Max results to return (default: 10)",
          },
        },
        required: ["query"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "search_memory") {
    const query = args?.query as string;
    const project = args?.project as string | undefined;
    const type = args?.type as string | undefined;
    const limit = (args?.limit as number | undefined) ?? 5;

    if (!query) {
      return {
        content: [{ type: "text", text: "Error: query is required" }],
        isError: true,
      };
    }

    try {
      const results = searchMemory(query, project, type, limit);

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No results found for "${query}". Try running \`npm run ingest\` to rebuild the knowledge base.`,
            },
          ],
        };
      }

      const formatted = results.map(formatMemoryResult).join("\n\n---\n\n");
      return {
        content: [
          {
            type: "text",
            text: `Found ${results.length} result(s) for "${query}":\n\n${formatted}`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }

  if (name === "search_commits") {
    const query = args?.query as string;
    const repo = args?.repo as string | undefined;
    const limit = (args?.limit as number | undefined) ?? 10;

    if (!query) {
      return {
        content: [{ type: "text", text: "Error: query is required" }],
        isError: true,
      };
    }

    try {
      const results = searchCommits(query, repo, limit);

      if (results.length === 0) {
        return {
          content: [{ type: "text", text: `No commits found for "${query}".` }],
        };
      }

      const formatted = results.map(formatCommitResult).join("\n\n---\n\n");
      return {
        content: [
          {
            type: "text",
            text: `Found ${results.length} commit(s) for "${query}":\n\n${formatted}`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }

  if (name === "add_task") {
    const title = args?.title as string;
    const project = args?.project as string;
    const priority = (args?.priority as string | undefined) ?? "";
    const description = (args?.description as string | undefined) ?? title;
    const status = (args?.status as string | undefined) ?? "open";

    if (!title || !project) {
      return {
        content: [
          { type: "text", text: "Error: title and project are required" },
        ],
        isError: true,
      };
    }

    try {
      const tags = [status, priority, project].filter(Boolean).join(",");
      const severity =
        priority === "P0"
          ? "critical"
          : priority === "P1"
            ? "important"
            : "note";
      const result = db
        .prepare(
          `INSERT INTO memory (type, project, title, content, tags, severity, source, heading)
           VALUES ('task', @project, @title, @content, @tags, @severity, 'mcp-write', @title)`,
        )
        .run({ project, title, content: description, tags, severity });

      // Append to NEXT.md if project path is resolvable
      const projectPath = resolveProjectPath(project);
      if (projectPath) appendToNextMd(projectPath, title);

      return {
        content: [
          {
            type: "text",
            text: `Task added (id=${result.lastInsertRowid}): "${title}" [${project}] [${status}${priority ? " " + priority : ""}]${projectPath ? "\nAppended to NEXT.md" : ""}`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }

  if (name === "list_tasks") {
    const project = args?.project as string | undefined;
    const status = args?.status as string | undefined;

    try {
      const conditions: string[] = ["m.type = 'task'"];
      const params: Record<string, string> = {};
      if (project) {
        conditions.push("m.project = @project");
        params.project = project;
      }
      const rows = db
        .prepare(
          `SELECT m.id, m.type, m.project, m.title, m.content, m.tags, m.severity, m.source
           FROM memory m WHERE ${conditions.join(" AND ")} ORDER BY m.id DESC`,
        )
        .all(params) as TaskRow[];

      const filtered = status
        ? rows.filter((r) => r.tags && r.tags.split(",").includes(status))
        : rows;

      if (filtered.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No tasks found${project ? ` for project "${project}"` : ""}${status ? ` with status "${status}"` : ""}.`,
            },
          ],
        };
      }

      const lines = filtered.map((r) => {
        const isDone = r.tags?.includes("done");
        const checkbox = isDone ? "[x]" : "[ ]";
        return `${checkbox} [${r.id}] [${r.project}] ${r.title}${r.tags ? ` (${r.tags})` : ""}`;
      });
      return {
        content: [
          {
            type: "text",
            text: `Tasks (${filtered.length}):\n\n${lines.join("\n")}`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }

  if (name === "add_prd") {
    const title = args?.title as string;
    const project = args?.project as string;
    const description = (args?.description as string | undefined) ?? title;
    const priority = (args?.priority as string | undefined) ?? "P1";

    if (!title || !project) {
      return {
        content: [
          { type: "text", text: "Error: title and project are required" },
        ],
        isError: true,
      };
    }

    try {
      const projectPath = resolveProjectPath(project);
      const featureId =
        (args?.feature_id as string | undefined) ??
        (projectPath ? getNextFeatureId(db, project, projectPath) : "F-auto");

      const tags = [project, priority].join(",");
      const result = db
        .prepare(
          `INSERT INTO memory (type, project, title, content, tags, severity, source, heading)
           VALUES ('feature', @project, @title, @content, @tags, 'note', 'mcp-write', @title)`,
        )
        .run({
          project,
          title: `${featureId}: ${title}`,
          content: description,
          tags,
        });

      let fileMsg = "";
      if (projectPath) {
        const filename = createFeatureMd(
          projectPath,
          featureId,
          title,
          description,
          priority,
        );
        fileMsg = `\nCreated: .claude/features/${filename}`;
      }

      return {
        content: [
          {
            type: "text",
            text: `PRD added (id=${result.lastInsertRowid}): "${featureId}: ${title}" [${project}] [${priority}]${fileMsg}`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }

  if (name === "list_prds") {
    const project = args?.project as string | undefined;

    try {
      const conditions: string[] = ["m.type = 'feature'"];
      const params: Record<string, string> = {};
      if (project) {
        conditions.push("m.project = @project");
        params.project = project;
      }
      const rows = db
        .prepare(
          `SELECT m.id, m.type, m.project, m.title, m.tags, m.source
           FROM memory m WHERE ${conditions.join(" AND ")} ORDER BY m.id DESC`,
        )
        .all(params) as TaskRow[];

      if (rows.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No PRDs found${project ? ` for project "${project}"` : ""}.`,
            },
          ],
        };
      }

      const lines = rows.map(
        (r) =>
          `[${r.id}] [${r.project}] ${r.title}${r.tags ? ` (${r.tags})` : ""}`,
      );
      return {
        content: [
          {
            type: "text",
            text: `PRDs (${rows.length}):\n\n${lines.join("\n")}`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }

  if (name === "sync_tasks") {
    const project = args?.project as string;
    if (!project) {
      return {
        content: [{ type: "text", text: "Error: project is required" }],
        isError: true,
      };
    }

    try {
      const projectPath = resolveProjectPath(project);
      if (!projectPath) {
        return {
          content: [
            {
              type: "text",
              text: `Could not resolve path for project "${project}". Set CLAUDE_PROJECT_DIR env var.`,
            },
          ],
          isError: true,
        };
      }
      const count = syncTasksFromNextMd(db, project, projectPath);
      return {
        content: [
          {
            type: "text",
            text: `Synced ${count} tasks from ${project}/.claude/NEXT.md into SQLite.`,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Error: ${msg}` }],
        isError: true,
      };
    }
  }

  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
