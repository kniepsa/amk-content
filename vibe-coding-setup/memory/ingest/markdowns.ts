/**
 * Markdown ingestion - parses all *.md files across Printulu repos
 * and splits them by ### headings into individual memory rows.
 */

import Database from "better-sqlite3";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, extname } from "path";

const HOME = process.env.HOME!;
const PROJECTS_ROOT = join(HOME, "Projects");

// Source directories to scan
const SOURCES = [
  { base: join(PROJECTS_ROOT, "printulu"), glob: "**/*.md" },
  {
    base: join(PROJECTS_ROOT, "amk-content/vibe-coding-setup"),
    glob: "**/*.md",
  },
  { base: join(PROJECTS_ROOT, "printagent"), glob: "**/*.md" },
  { base: join(PROJECTS_ROOT, "BWA-Tool"), glob: "**/*.md" },
];

// Excluded directories
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "_archived",
  "Content",
]);

type MemoryType =
  | "gotcha"
  | "adr"
  | "feature"
  | "bug"
  | "pattern"
  | "decision"
  | "doc"
  | "note"
  | "task"
  | "prd";

type Severity = "critical" | "important" | "note";

interface MemoryRow {
  type: MemoryType;
  project: string;
  title: string;
  content: string;
  tags: string;
  severity: Severity;
  source: string;
  heading: string;
}

function detectType(filePath: string): MemoryType {
  const p = filePath.toLowerCase();
  if (p.includes("/.claude/bugs") || p.includes("/bugs/")) return "bug";
  if (p.includes("/adr/") || p.includes("/decisions/")) return "adr";
  if (p.includes("features/") || p.includes("feature-")) return "feature";
  if (p.includes("decisions.md") || p.includes("market-")) return "decision";
  if (p.includes("architecture.md") || p.includes("/docs/")) return "doc";
  if (p.includes("vibe-coding-setup/skills/") || p.includes("patterns.md"))
    return "pattern";
  // NEXT.md must be checked before the generic .claude/ catch-all
  if (p.endsWith("next.md")) return "task";
  if (p.includes("claude.md") || p.includes(".claude/")) return "gotcha";
  return "note";
}

function detectProject(filePath: string): string {
  const p = filePath.replace(PROJECTS_ROOT + "/", "");
  if (p.startsWith("printulu/vendure/")) return "vendure";
  if (p.startsWith("printulu/ops-hub/")) return "ops-hub";
  if (p.startsWith("printulu/shop/")) return "shop";
  if (p.startsWith("printulu/growth-engine/")) return "growth";
  if (p.startsWith("printulu/")) return "printulu";
  if (p.startsWith("amk-content/vibe-coding-setup/")) return "vibe-coding";
  if (p.startsWith("printagent/")) return "printagent";
  if (p.startsWith("BWA-Tool/")) return "backoffice-os";
  return "unknown";
}

function detectSeverity(content: string): Severity {
  if (/CRITICAL|🚨|NEVER |ALWAYS |MUST /.test(content)) return "critical";
  if (/IMPORTANT|⚠️|WARNING|BREAKING/.test(content)) return "important";
  return "note";
}

function extractTags(title: string, content: string): string {
  const STOPWORDS = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "not",
    "no",
    "if",
    "this",
    "that",
    "it",
    "its",
  ]);

  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  // Also extract code-looking terms from content
  const codeTerms: string[] = [];
  const codeMatches = content.match(/`([^`]{2,30})`/g) || [];
  codeMatches.slice(0, 5).forEach((m) => {
    const term = m
      .replace(/`/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    if (term.length > 2) codeTerms.push(term);
  });

  return [...new Set([...words.slice(0, 5), ...codeTerms.slice(0, 3)])].join(
    ",",
  );
}

function splitByHeadings(
  content: string,
  filePath: string,
): Array<{ heading: string; body: string }> {
  // Split by h2 (##) and h3 (###) headings
  const lines = content.split("\n");
  const sections: Array<{ heading: string; body: string[] }> = [];
  let current: { heading: string; body: string[] } | null = null;

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);
    const match = h3Match || h2Match;

    if (match) {
      if (current && current.body.join("\n").trim().length > 20) {
        sections.push(current);
      }
      current = { heading: match[1].trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }

  if (current && current.body.join("\n").trim().length > 20) {
    sections.push(current);
  }

  // If no headings, treat whole file as one section
  if (sections.length === 0) {
    const trimmed = content.trim();
    if (trimmed.length > 20) {
      const h1Match = content.match(/^#\s+(.+)/m);
      sections.push({
        heading: h1Match
          ? h1Match[1].trim()
          : filePath.split("/").pop()?.replace(".md", "") || "Document",
        body: content.split("\n"),
      });
    }
  }

  return sections.map((s) => ({
    heading: s.heading,
    body: s.body.join("\n").trim(),
  }));
}

function* walkDir(dir: string): Generator<string> {
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
        yield* walkDir(fullPath);
      } else if (extname(entry) === ".md") {
        yield fullPath;
      }
    } catch {
      // skip permission errors
    }
  }
}

export async function ingestMarkdowns(db: Database.Database): Promise<number> {
  const insert = db.prepare(`
    INSERT INTO memory (type, project, title, content, tags, severity, source, heading)
    VALUES (@type, @project, @title, @content, @tags, @severity, @source, @heading)
  `);

  const insertMany = db.transaction((rows: MemoryRow[]) => {
    let count = 0;
    for (const row of rows) {
      insert.run(row);
      count++;
    }
    return count;
  });

  let totalCount = 0;

  for (const source of SOURCES) {
    const rows: MemoryRow[] = [];

    for (const filePath of walkDir(source.base)) {
      let content: string;
      try {
        content = readFileSync(filePath, "utf-8");
      } catch {
        continue;
      }

      const relPath = relative(PROJECTS_ROOT, filePath);
      const type = detectType(filePath);
      const project = detectProject(filePath);

      // Special handling: parse NEXT.md checkboxes as individual task records
      if (type === "task") {
        for (const line of content.split("\n")) {
          const openMatch = line.match(/^[-*]\s+\[ \]\s+(.+)/);
          const doneMatch = line.match(/^[-*]\s+\[x\]\s+(.+)/i);
          if (!openMatch && !doneMatch) continue;

          const title = (openMatch || doneMatch)![1].trim();
          const status = doneMatch ? "done" : "open";
          const priorityMatch = title.match(/\b(P0|P1|P2)\b/);
          const priority = priorityMatch ? priorityMatch[1] : "";
          const tags = [status, priority, project].filter(Boolean).join(",");

          rows.push({
            type: "task",
            project,
            title,
            content: title,
            tags,
            severity:
              priority === "P0"
                ? "critical"
                : priority === "P1"
                  ? "important"
                  : "note",
            source: relPath,
            heading: title,
          });
        }
        continue; // skip section-based ingestion for NEXT.md
      }

      const sections = splitByHeadings(content, filePath);

      for (const section of sections) {
        if (section.body.length < 10) continue;

        const severity = detectSeverity(section.heading + "\n" + section.body);
        const tags = extractTags(section.heading, section.body);

        rows.push({
          type,
          project,
          title: section.heading,
          content: section.body.slice(0, 2000), // cap at 2000 chars per section
          tags,
          severity,
          source: relPath,
          heading: section.heading,
        });
      }
    }

    totalCount += insertMany(rows);
  }

  return totalCount;
}

// Allow running standalone
if (
  process.argv[1]?.endsWith("markdowns.ts") ||
  process.argv[1]?.endsWith("markdowns.js")
) {
  const DB_PATH =
    process.env.MEMORY_DB ||
    join(process.env.HOME!, ".claude/printulu-memory.db");
  const { readFileSync: rf } = await import("fs");
  const { join: j, dirname: dn } = await import("path");
  const { fileURLToPath: ftu } = await import("url");
  const __d = dn(ftu(import.meta.url));

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(rf(j(__d, "..", "schema.sql"), "utf-8"));
  const count = await ingestMarkdowns(db);
  console.log(`Ingested ${count} markdown memories`);
  db.close();
}
