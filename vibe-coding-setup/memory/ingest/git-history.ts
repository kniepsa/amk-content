/**
 * Git history ingestion - parses git log from all Printulu repos
 */

import Database from "better-sqlite3";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const HOME = process.env.HOME!;
const PROJECTS_ROOT = join(HOME, "Projects");

// Repos to index
const REPOS: Array<{ name: string; path: string }> = [
  { name: "vendure", path: join(PROJECTS_ROOT, "printulu/vendure") },
  { name: "ops-hub", path: join(PROJECTS_ROOT, "printulu/ops-hub") },
  { name: "shop", path: join(PROJECTS_ROOT, "printulu/shop") },
  {
    name: "growth-engine",
    path: join(PROJECTS_ROOT, "printulu/growth-engine"),
  },
  { name: "printulu", path: join(PROJECTS_ROOT, "printulu") },
  {
    name: "vibe-coding-setup",
    path: join(PROJECTS_ROOT, "amk-content/vibe-coding-setup"),
  },
  { name: "backoffice-os", path: join(PROJECTS_ROOT, "BWA-Tool") },
];

interface CommitRow {
  repo: string;
  hash: string;
  short_hash: string;
  date: string;
  author: string;
  message: string;
  body: string;
}

function parseGitLog(repoPath: string, repoName: string): CommitRow[] {
  const SEP = "|||COMMIT|||";
  const FIELD_SEP = "|||FIELD|||";

  try {
    const output = execSync(
      `git -C "${repoPath}" log --pretty=format:"%H${FIELD_SEP}%h${FIELD_SEP}%aI${FIELD_SEP}%aN${FIELD_SEP}%s${FIELD_SEP}%b${SEP}" --max-count=500 2>/dev/null`,
      { encoding: "utf-8", timeout: 15000, maxBuffer: 10 * 1024 * 1024 },
    );

    const commits: CommitRow[] = [];
    const rawCommits = output.split(SEP).filter((c) => c.trim().length > 0);

    for (const raw of rawCommits) {
      const parts = raw.trim().split(FIELD_SEP);
      if (parts.length < 5) continue;

      const [hash, short_hash, date, author, message, ...bodyParts] = parts;
      const body = bodyParts.join("").trim().slice(0, 1000);

      if (!hash || !message) continue;

      commits.push({
        repo: repoName,
        hash: hash.trim(),
        short_hash: short_hash.trim(),
        date: date.trim(),
        author: author.trim(),
        message: message.trim(),
        body,
      });
    }

    return commits;
  } catch {
    // Repo might not exist or have no commits
    return [];
  }
}

export async function ingestGitHistory(db: Database.Database): Promise<number> {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO git_commits (repo, hash, short_hash, date, author, message, body)
    VALUES (@repo, @hash, @short_hash, @date, @author, @message, @body)
  `);

  const insertMany = db.transaction((rows: CommitRow[]) => {
    let count = 0;
    for (const row of rows) {
      const result = insert.run(row);
      count += result.changes;
    }
    return count;
  });

  let totalCount = 0;

  for (const repo of REPOS) {
    if (!existsSync(repo.path)) {
      console.log(`   ⚠️  Skipping ${repo.name} (not found at ${repo.path})`);
      continue;
    }

    // Check if it's a git repo
    if (!existsSync(join(repo.path, ".git"))) {
      console.log(`   ⚠️  Skipping ${repo.name} (not a git repo)`);
      continue;
    }

    const commits = parseGitLog(repo.path, repo.name);
    const count = insertMany(commits);
    console.log(`   📦 ${repo.name}: ${count} commits`);
    totalCount += count;
  }

  return totalCount;
}

// Allow running standalone
if (
  process.argv[1]?.endsWith("git-history.ts") ||
  process.argv[1]?.endsWith("git-history.js")
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
  const count = await ingestGitHistory(db);
  console.log(`Ingested ${count} git commits`);
  db.close();
}
