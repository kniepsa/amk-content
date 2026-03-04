/**
 * File indexer - indexes screenshots, SQL files, configs by path
 */

import Database from "better-sqlite3";
import { readdirSync, statSync } from "fs";
import { join, relative, extname, basename } from "path";

const HOME = process.env.HOME!;
const PROJECTS_ROOT = join(HOME, "Projects");

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "_archived",
]);

const FILE_TYPES: Record<string, string> = {
  ".png": "screenshot",
  ".jpg": "screenshot",
  ".jpeg": "screenshot",
  ".gif": "screenshot",
  ".webp": "screenshot",
  ".sql": "sql",
  ".json": "config",
  ".toml": "config",
  ".yaml": "config",
  ".yml": "config",
  ".env": "config",
  ".md": "markdown",
  ".pdf": "pdf",
};

const INDEXED_EXTENSIONS = new Set(Object.keys(FILE_TYPES));

// Only index specific directories (avoid too many config files)
const SCAN_DIRS = [
  {
    path: join(PROJECTS_ROOT, "printulu"),
    extensions: [".png", ".jpg", ".jpeg", ".sql", ".md"],
  },
  {
    path: join(PROJECTS_ROOT, "amk-content/vibe-coding-setup"),
    extensions: [".md", ".json", ".toml"],
  },
];

interface FileRow {
  type: string;
  path: string;
  name: string;
  project: string;
  size_bytes: number;
}

function detectProject(filePath: string): string {
  const p = filePath.replace(PROJECTS_ROOT + "/", "");
  if (p.startsWith("printulu/vendure/")) return "vendure";
  if (p.startsWith("printulu/ops-hub/")) return "ops-hub";
  if (p.startsWith("printulu/shop/")) return "shop";
  if (p.startsWith("printulu/growth-engine/")) return "growth";
  if (p.startsWith("printulu/")) return "printulu";
  if (p.startsWith("amk-content/vibe-coding-setup/")) return "vibe-coding";
  return "unknown";
}

function* walkDir(dir: string, allowedExtensions: string[]): Generator<string> {
  let entries: ReturnType<typeof readdirSync>;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry)) continue;
    const fullPath = join(dir, entry);
    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        yield* walkDir(fullPath, allowedExtensions);
      } else if (allowedExtensions.includes(extname(entry).toLowerCase())) {
        yield fullPath;
      }
    } catch {
      // skip permission errors
    }
  }
}

export async function ingestFiles(db: Database.Database): Promise<number> {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO files_index (type, path, name, project, size_bytes)
    VALUES (@type, @path, @name, @project, @size_bytes)
  `);

  const insertMany = db.transaction((rows: FileRow[]) => {
    let count = 0;
    for (const row of rows) {
      const result = insert.run(row);
      count += result.changes;
    }
    return count;
  });

  let totalCount = 0;

  for (const scanDir of SCAN_DIRS) {
    const rows: FileRow[] = [];

    for (const filePath of walkDir(scanDir.path, scanDir.extensions)) {
      try {
        const stat = statSync(filePath);
        const ext = extname(filePath).toLowerCase();
        const type = FILE_TYPES[ext] || "other";
        const relPath = relative(PROJECTS_ROOT, filePath);

        rows.push({
          type,
          path: relPath,
          name: basename(filePath),
          project: detectProject(filePath),
          size_bytes: stat.size,
        });
      } catch {
        // skip
      }
    }

    totalCount += insertMany(rows);
  }

  return totalCount;
}

// Allow running standalone
if (
  process.argv[1]?.endsWith("files.ts") ||
  process.argv[1]?.endsWith("files.js")
) {
  const DB_PATH =
    process.env.MEMORY_DB || join(HOME, ".claude/printulu-memory.db");
  const { readFileSync } = await import("fs");
  const { join: j, dirname } = await import("path");
  const { fileURLToPath } = await import("url");
  const __d = dirname(fileURLToPath(import.meta.url));

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(readFileSync(j(__d, "..", "schema.sql"), "utf-8"));
  const count = await ingestFiles(db);
  console.log(`Indexed ${count} files`);
  db.close();
}
