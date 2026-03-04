/**
 * Printulu Memory System - Ingestion Orchestrator
 * Drops and rebuilds the entire knowledge base.
 */

import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ingestMarkdowns } from "./markdowns.js";
import { ingestGitHistory } from "./git-history.js";
import { ingestFiles } from "./files.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH =
  process.env.MEMORY_DB || join(process.env.HOME!, ".claude/amk-memory.db");
const SCHEMA_PATH = join(__dirname, "..", "schema.sql");

export function openDb(): Database.Database {
  return new Database(DB_PATH);
}

function initDb(db: Database.Database): void {
  // Enable WAL mode for better concurrent read performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const schema = readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);
}

function resetDb(db: Database.Database): void {
  console.log("🗑️  Resetting database...");
  // Drop in reverse dependency order
  db.exec(`
    DROP TRIGGER IF EXISTS memory_au;
    DROP TRIGGER IF EXISTS memory_ad;
    DROP TRIGGER IF EXISTS memory_ai;
    DROP TRIGGER IF EXISTS commits_ai;
    DROP TABLE IF EXISTS memory_fts;
    DROP TABLE IF EXISTS commits_fts;
    DROP TABLE IF EXISTS memory;
    DROP TABLE IF EXISTS git_commits;
    DROP TABLE IF EXISTS files_index;
  `);
}

async function main() {
  const args = process.argv.slice(2);
  const reset = !args.includes("--no-reset");

  console.log(`\n🧠 Printulu Memory System - Ingestion`);
  console.log(`📂 DB: ${DB_PATH}\n`);

  const db = openDb();

  if (reset) {
    resetDb(db);
  }

  initDb(db);

  console.log("📄 Ingesting markdown files...");
  const mdCount = await ingestMarkdowns(db);
  console.log(`   ✓ ${mdCount} memories ingested\n`);

  console.log("📜 Ingesting git history...");
  const gitCount = await ingestGitHistory(db);
  console.log(`   ✓ ${gitCount} commits ingested\n`);

  console.log("🗃️  Indexing files...");
  const fileCount = await ingestFiles(db);
  console.log(`   ✓ ${fileCount} files indexed\n`);

  // Print summary stats
  const memCount = db.prepare("SELECT COUNT(*) as c FROM memory").get() as {
    c: number;
  };
  const commitCount = db
    .prepare("SELECT COUNT(*) as c FROM git_commits")
    .get() as { c: number };
  const filesCount = db
    .prepare("SELECT COUNT(*) as c FROM files_index")
    .get() as { c: number };

  const byProject = db
    .prepare(
      `SELECT project, COUNT(*) as c FROM memory GROUP BY project ORDER BY c DESC`,
    )
    .all() as Array<{ project: string; c: number }>;

  const bySeverity = db
    .prepare(
      `SELECT severity, COUNT(*) as c FROM memory GROUP BY severity ORDER BY c DESC`,
    )
    .all() as Array<{ severity: string; c: number }>;

  console.log("✅ Ingestion complete!\n");
  console.log(`   Memories: ${memCount.c}`);
  console.log(`   Commits:  ${commitCount.c}`);
  console.log(`   Files:    ${filesCount.c}`);
  console.log(`\n   By project:`);
  byProject.forEach(({ project, c }) =>
    console.log(`     ${(project || "unknown").padEnd(15)} ${c}`),
  );
  console.log(`\n   By severity:`);
  bySeverity.forEach(({ severity, c }) =>
    console.log(`     ${(severity || "note").padEnd(15)} ${c}`),
  );

  db.close();
}

main().catch(console.error);
