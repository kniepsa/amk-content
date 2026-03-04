/**
 * Printulu Memory CLI
 * Usage: npx tsx cli.ts "search query" [--type gotcha] [--project vendure] [--severity critical] [--commits] [--limit 10] [--stats]
 */

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

interface MemoryResult {
  id: number;
  type: string;
  project: string;
  title: string;
  content: string;
  tags: string;
  severity: string;
  source: string;
  rank?: number;
}

interface CommitResult {
  id: number;
  repo: string;
  short_hash: string;
  date: string;
  author: string;
  message: string;
  body: string;
  rank?: number;
}

interface StatsRow {
  c: number;
}

function openDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  // Initialize schema if DB is new
  const schema = readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);
  return db;
}

function searchMemory(
  db: Database.Database,
  query: string,
  opts: { type?: string; project?: string; severity?: string; limit: number },
): MemoryResult[] {
  const conditions: string[] = [];
  const params: Record<string, string | number> = { limit: opts.limit };

  if (opts.type) {
    conditions.push("m.type = @type");
    params.type = opts.type;
  }
  if (opts.project) {
    conditions.push("m.project = @project");
    params.project = opts.project;
  }
  if (opts.severity) {
    conditions.push("m.severity = @severity");
    params.severity = opts.severity;
  }

  const whereClause =
    conditions.length > 0 ? "AND " + conditions.join(" AND ") : "";

  const sql = `
    SELECT m.id, m.type, m.project, m.title, m.content, m.tags, m.severity, m.source,
           memory_fts.rank
    FROM memory_fts
    JOIN memory m ON m.id = memory_fts.rowid
    WHERE memory_fts MATCH @query
    ${whereClause}
    ORDER BY memory_fts.rank
    LIMIT @limit
  `;

  params.query = query;
  return db.prepare(sql).all(params) as MemoryResult[];
}

function searchCommits(
  db: Database.Database,
  query: string,
  opts: { repo?: string; limit: number },
): CommitResult[] {
  const conditions: string[] = [];
  const params: Record<string, string | number> = { limit: opts.limit, query };

  if (opts.repo) {
    conditions.push("gc.repo = @repo");
    params.repo = opts.repo;
  }

  const whereClause =
    conditions.length > 0 ? "AND " + conditions.join(" AND ") : "";

  const sql = `
    SELECT gc.id, gc.repo, gc.short_hash, gc.date, gc.author, gc.message, gc.body,
           commits_fts.rank
    FROM commits_fts
    JOIN git_commits gc ON gc.id = commits_fts.rowid
    WHERE commits_fts MATCH @query
    ${whereClause}
    ORDER BY commits_fts.rank
    LIMIT @limit
  `;

  return db.prepare(sql).all(params) as CommitResult[];
}

function printStats(db: Database.Database): void {
  const memCount = (
    db.prepare("SELECT COUNT(*) as c FROM memory").get() as StatsRow
  ).c;
  const commitCount = (
    db.prepare("SELECT COUNT(*) as c FROM git_commits").get() as StatsRow
  ).c;
  const filesCount = (
    db.prepare("SELECT COUNT(*) as c FROM files_index").get() as StatsRow
  ).c;

  const byProject = db
    .prepare(
      `SELECT project, COUNT(*) as c FROM memory GROUP BY project ORDER BY c DESC`,
    )
    .all() as Array<{ project: string; c: number }>;

  const byType = db
    .prepare(
      `SELECT type, COUNT(*) as c FROM memory GROUP BY type ORDER BY c DESC`,
    )
    .all() as Array<{ type: string; c: number }>;

  const bySeverity = db
    .prepare(
      `SELECT severity, COUNT(*) as c FROM memory GROUP BY severity ORDER BY c DESC`,
    )
    .all() as Array<{ severity: string; c: number }>;

  console.log("\n🧠 Printulu Memory Stats\n");
  console.log(`  Memories: ${memCount}`);
  console.log(`  Commits:  ${commitCount}`);
  console.log(`  Files:    ${filesCount}`);

  console.log("\n  By project:");
  byProject.forEach(({ project, c }) =>
    console.log(`    ${(project || "unknown").padEnd(15)} ${c}`),
  );

  console.log("\n  By type:");
  byType.forEach(({ type, c }) =>
    console.log(`    ${(type || "unknown").padEnd(15)} ${c}`),
  );

  console.log("\n  By severity:");
  bySeverity.forEach(({ severity, c }) =>
    console.log(`    ${(severity || "note").padEnd(15)} ${c}`),
  );
}

function severityBadge(severity: string): string {
  if (severity === "critical") return "[CRITICAL]";
  if (severity === "important") return "[IMPORTANT]";
  return "[NOTE]    ";
}

function truncate(str: string, max: number): string {
  if (!str) return "";
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

function renderResults(results: MemoryResult[]): void {
  if (results.length === 0) {
    console.log("\n  No results found.\n");
    return;
  }

  console.log(`\n  Found ${results.length} result(s):\n`);
  const LINE = "─".repeat(65);

  for (const r of results) {
    const badge = severityBadge(r.severity);
    const project = (r.project || "unknown").padEnd(10);
    const type = (r.type || "").padEnd(8);

    console.log(`  ┌ ${LINE}`);
    console.log(
      `  │ ${badge} ${truncate(r.title, 40).padEnd(40)} ${project} [${type}]`,
    );
    console.log(`  │ Source: ${r.source || "unknown"}`);

    // Print content lines (first 5 non-empty lines)
    const lines = r.content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .slice(0, 5);
    for (const line of lines) {
      console.log(`  │   ${truncate(line, 62)}`);
    }

    if (r.tags) {
      console.log(`  │ Tags: ${r.tags}`);
    }
  }

  console.log(`  └ ${LINE}\n`);
}

function renderCommits(results: CommitResult[]): void {
  if (results.length === 0) {
    console.log("\n  No commits found.\n");
    return;
  }

  console.log(`\n  Found ${results.length} commit(s):\n`);
  const LINE = "─".repeat(65);

  for (const r of results) {
    const date = r.date ? r.date.slice(0, 10) : "unknown";
    console.log(`  ┌ ${LINE}`);
    console.log(`  │ [${r.repo.padEnd(12)}] ${r.short_hash} ${date}`);
    console.log(`  │ ${truncate(r.message, 60)}`);
    if (r.body && r.body.trim().length > 0) {
      const bodyLines = r.body
        .split("\n")
        .filter((l) => l.trim())
        .slice(0, 2);
      for (const line of bodyLines) {
        console.log(`  │   ${truncate(line, 60)}`);
      }
    }
  }

  console.log(`  └ ${LINE}\n`);
}

// ---------------------------------------------------------------------------
// Write helpers (task / prd subcommands)
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
  if (!existsSync(nextMdPath)) {
    console.log(`  NEXT.md not found at ${nextMdPath}`);
    return 0;
  }
  const content = readFileSync(nextMdPath, "utf-8");
  const relPath = `${project}/.claude/NEXT.md`;

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
  const featuresDir = join(projectPath, ".claude", "features");
  for (const subDir of [featuresDir, join(featuresDir, "done")]) {
    if (existsSync(subDir)) {
      for (const f of readdirSync(subDir)) {
        const m = f.match(/^F-(?:[A-Z]+-)?(\d+)/);
        if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
      }
    }
  }
  const dbRows = db
    .prepare(`SELECT title FROM memory WHERE type = 'feature' AND project = ?`)
    .all(project) as Array<{ title: string }>;
  for (const { title } of dbRows) {
    const m = title.match(/^F-(?:[A-Z]+-)?(\d+)/);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  }
  return `F-${String(maxNum + 1).padStart(3, "0")}`;
}

function runTaskSubcommand(db: Database.Database, subArgs: string[]): void {
  const sub = subArgs[0];
  const getFlag = (flag: string): string | undefined => {
    const idx = subArgs.indexOf(flag);
    return idx !== -1 ? subArgs[idx + 1] : undefined;
  };

  if (sub === "add") {
    const title = subArgs[1];
    const project = getFlag("--project");
    const priority = getFlag("--priority") ?? "";
    const desc = getFlag("--desc") ?? title;

    if (!title || !project) {
      console.error(
        "  Usage: mem task add <title> --project <project> [--priority P0|P1|P2] [--desc <desc>]",
      );
      process.exit(1);
    }

    const status = "open";
    const tags = [status, priority, project].filter(Boolean).join(",");
    const severity =
      priority === "P0" ? "critical" : priority === "P1" ? "important" : "note";
    const result = db
      .prepare(
        `INSERT INTO memory (type, project, title, content, tags, severity, source, heading)
         VALUES ('task', @project, @title, @content, @tags, @severity, 'cli-write', @title)`,
      )
      .run({ project, title, content: desc, tags, severity });

    const projectPath = resolveProjectPath(project);
    if (projectPath) appendToNextMd(projectPath, title);

    console.log(
      `\n  ✓ Task added (id=${result.lastInsertRowid}): "${title}" [${project}] [${status}${priority ? " " + priority : ""}]`,
    );
    if (projectPath) console.log(`  ✓ Appended to NEXT.md`);
    console.log("");
    return;
  }

  if (sub === "list") {
    const project = getFlag("--project");
    const status = getFlag("--status");
    const conditions: string[] = ["type = 'task'"];
    const params: Record<string, string> = {};
    if (project) {
      conditions.push("project = @project");
      params.project = project;
    }
    const rows = db
      .prepare(
        `SELECT id, project, title, tags FROM memory WHERE ${conditions.join(" AND ")} ORDER BY id DESC`,
      )
      .all(params) as Array<{
      id: number;
      project: string;
      title: string;
      tags: string;
    }>;
    const filtered = status
      ? rows.filter((r) => r.tags?.split(",").includes(status))
      : rows;

    if (filtered.length === 0) {
      console.log(`\n  No tasks found.\n`);
      return;
    }
    console.log(`\n  Tasks (${filtered.length}):\n`);
    for (const r of filtered) {
      const done = r.tags?.includes("done");
      console.log(
        `  ${done ? "[x]" : "[ ]"} [${r.id}] [${r.project}] ${r.title}`,
      );
    }
    console.log("");
    return;
  }

  if (sub === "done") {
    const id = parseInt(subArgs[1], 10);
    if (!id) {
      console.error("  Usage: mem task done <id>");
      process.exit(1);
    }
    const row = db.prepare("SELECT tags FROM memory WHERE id = ?").get(id) as
      | { tags: string }
      | undefined;
    if (!row) {
      console.error(`  Task id=${id} not found`);
      process.exit(1);
    }
    const newTags = (row.tags ?? "")
      .split(",")
      .map((t) => (t === "open" ? "done" : t))
      .filter((t, i, a) => a.indexOf(t) === i)
      .join(",");
    db.prepare("UPDATE memory SET tags = ? WHERE id = ?").run(newTags, id);
    console.log(`\n  ✓ Task id=${id} marked as done\n`);
    return;
  }

  if (sub === "sync") {
    const project = getFlag("--project");
    if (!project) {
      console.error("  Usage: mem task sync --project <project>");
      process.exit(1);
    }
    const projectPath = resolveProjectPath(project);
    if (!projectPath) {
      console.error(
        `  Could not resolve path for project "${project}". Set CLAUDE_PROJECT_DIR.`,
      );
      process.exit(1);
    }
    const count = syncTasksFromNextMd(db, project, projectPath);
    console.log(
      `\n  ✓ Synced ${count} tasks from ${project}/.claude/NEXT.md\n`,
    );
    return;
  }

  console.error(
    `  Unknown task subcommand: ${sub}. Use: add | list | done | sync`,
  );
  process.exit(1);
}

function runPrdSubcommand(db: Database.Database, subArgs: string[]): void {
  const sub = subArgs[0];
  const getFlag = (flag: string): string | undefined => {
    const idx = subArgs.indexOf(flag);
    return idx !== -1 ? subArgs[idx + 1] : undefined;
  };

  if (sub === "add") {
    const title = subArgs[1];
    const project = getFlag("--project");
    const desc = getFlag("--desc") ?? title;
    const priority = getFlag("--priority") ?? "P1";

    if (!title || !project) {
      console.error(
        "  Usage: mem prd add <title> --project <project> [--feature F-022] [--desc <desc>] [--priority P0|P1|P2]",
      );
      process.exit(1);
    }

    const projectPath = resolveProjectPath(project);
    const featureId =
      getFlag("--feature") ??
      (projectPath ? getNextFeatureId(db, project, projectPath) : "F-auto");

    const tags = [project, priority].join(",");
    const fullTitle = `${featureId}: ${title}`;
    const result = db
      .prepare(
        `INSERT INTO memory (type, project, title, content, tags, severity, source, heading)
         VALUES ('feature', @project, @title, @content, @tags, 'note', 'cli-write', @title)`,
      )
      .run({ project, title: fullTitle, content: desc, tags });

    let fileMsg = "";
    if (projectPath) {
      const featuresDir = join(projectPath, ".claude", "features");
      mkdirSync(featuresDir, { recursive: true });
      const kebab = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = `${featureId}-${kebab}.md`;
      const content = `# ${featureId}: ${title}\n\n**Status:** Planned\n**Priority:** ${priority}\n**Dependencies:** None\n\n## Description\n\n${desc}\n\n## Success Criteria\n\n- [ ] [Define criteria]\n- [ ] Tests pass\n- [ ] Deployed to production\n`;
      writeFileSync(join(featuresDir, filename), content);
      fileMsg = `\n  ✓ Created: .claude/features/${filename}`;
    }

    console.log(
      `\n  ✓ PRD added (id=${result.lastInsertRowid}): "${fullTitle}" [${project}] [${priority}]${fileMsg}\n`,
    );
    return;
  }

  if (sub === "list") {
    const project = getFlag("--project");
    const conditions: string[] = ["type = 'feature'"];
    const params: Record<string, string> = {};
    if (project) {
      conditions.push("project = @project");
      params.project = project;
    }
    const rows = db
      .prepare(
        `SELECT id, project, title, tags FROM memory WHERE ${conditions.join(" AND ")} ORDER BY id DESC`,
      )
      .all(params) as Array<{
      id: number;
      project: string;
      title: string;
      tags: string;
    }>;

    if (rows.length === 0) {
      console.log(`\n  No PRDs found.\n`);
      return;
    }
    console.log(`\n  PRDs (${rows.length}):\n`);
    for (const r of rows) {
      console.log(
        `  [${r.id}] [${r.project}] ${r.title}${r.tags ? ` (${r.tags})` : ""}`,
      );
    }
    console.log("");
    return;
  }

  console.error(`  Unknown prd subcommand: ${sub}. Use: add | list`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Parse CLI args
// ---------------------------------------------------------------------------

// Parse CLI args
const args = process.argv.slice(2);
const statsMode = args.includes("--stats");
const includeCommits = args.includes("--commits");

const getFlag = (flag: string): string | undefined => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
};

const type = getFlag("--type");
const project = getFlag("--project");
const severity = getFlag("--severity");
const limitStr = getFlag("--limit");
const limit = limitStr ? parseInt(limitStr, 10) : 10;

// Query is first positional arg (not a flag)
const query = args.find(
  (a) =>
    !a.startsWith("--") &&
    !Object.values({ type, project, severity, limitStr }).includes(a),
);

const db = openDb();

// Dispatch write subcommands before FTS search
if (args[0] === "task") {
  runTaskSubcommand(db, args.slice(1));
  db.close();
  process.exit(0);
}

if (args[0] === "prd") {
  runPrdSubcommand(db, args.slice(1));
  db.close();
  process.exit(0);
}

if (statsMode) {
  printStats(db);
} else if (query) {
  try {
    const memResults = searchMemory(db, query, {
      type,
      project,
      severity,
      limit,
    });
    renderResults(memResults);

    if (includeCommits) {
      const commitResults = searchCommits(db, query, {
        limit: Math.min(limit, 10),
      });
      if (commitResults.length > 0) {
        console.log("\n  Commits:\n");
        renderCommits(commitResults);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // FTS5 syntax errors are common — give friendly feedback
    if (msg.includes("fts5")) {
      console.error(`\n  ⚠️  FTS5 query error: ${msg}`);
      console.error(
        `  Tip: Avoid special chars. Try: mem "railway deployment"\n`,
      );
    } else {
      console.error(`\n  Error: ${msg}\n`);
    }
    process.exit(1);
  }
} else {
  console.log(`
  🧠 Printulu Memory CLI

  Search:
    mem "<query>"                                  Search memories
    mem "<query>" --type gotcha                    Filter by type
    mem "<query>" --project vendure                Filter by project
    mem "<query>" --severity critical              Filter by severity
    mem "<query>" --commits                        Include git commits
    mem "<query>" --limit 20                       More results (default: 10)
    mem --stats                                    Show database stats

  Tasks:
    mem task add "title" --project vendure         Add task (also writes to NEXT.md)
      [--priority P0|P1|P2] [--desc "..."]
    mem task list [--project vendure] [--status open|done]
    mem task done <id>                             Mark task as done
    mem task sync --project vendure                Sync NEXT.md → SQLite (idempotent)

  PRDs:
    mem prd add "title" --project vendure          Add PRD (creates features/*.md)
      [--feature F-022] [--desc "..."] [--priority P0|P1|P2]
    mem prd list [--project vendure]

  Types:     gotcha | adr | feature | bug | pattern | decision | doc | note | task | prd
  Projects:  vendure | ops-hub | shop | growth | printulu | vibe-coding
  Severity:  critical | important | note

  Alias: Add to ~/.zshrc:
    alias mem='npx tsx ~/Projects/amk-content/vibe-coding-setup/memory/cli.ts'
  `);
}

db.close();
