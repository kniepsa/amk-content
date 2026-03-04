-- Printulu SQLite Memory System Schema
-- Primary knowledge store
CREATE TABLE IF NOT EXISTS memory (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT NOT NULL,   -- gotcha|decision|adr|feature|bug|pattern|doc|note|task|prd
  project    TEXT,            -- vendure|ops-hub|shop|growth|printulu|vibe-coding
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  tags       TEXT,            -- comma-separated: "railway,migration,typescript"
  severity   TEXT,            -- critical|important|note
  source     TEXT,            -- relative path from ~/Projects/
  heading    TEXT,            -- original markdown heading
  created_at TEXT DEFAULT (datetime('now'))
);

-- FTS5 full-text search with BM25 ranking
CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5 (
  title,
  content,
  tags,
  content = memory,
  content_rowid = id
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS memory_ai
AFTER INSERT ON memory BEGIN
  INSERT INTO memory_fts (rowid, title, content, tags)
  VALUES (new.id, new.title, new.content, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS memory_ad
AFTER DELETE ON memory BEGIN
  INSERT INTO memory_fts (memory_fts, rowid, title, content, tags)
  VALUES ('delete', old.id, old.title, old.content, old.tags);
END;

CREATE TRIGGER IF NOT EXISTS memory_au
AFTER UPDATE ON memory BEGIN
  INSERT INTO memory_fts (memory_fts, rowid, title, content, tags)
  VALUES ('delete', old.id, old.title, old.content, old.tags);
  INSERT INTO memory_fts (rowid, title, content, tags)
  VALUES (new.id, new.title, new.content, new.tags);
END;

-- Git commit history
CREATE TABLE IF NOT EXISTS git_commits (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  repo       TEXT NOT NULL,
  hash       TEXT NOT NULL,
  short_hash TEXT,
  date       TEXT,
  author     TEXT,
  message    TEXT,
  body       TEXT,
  UNIQUE (repo, hash)
);

CREATE VIRTUAL TABLE IF NOT EXISTS commits_fts USING fts5 (
  message,
  body,
  content = git_commits,
  content_rowid = id
);

CREATE TRIGGER IF NOT EXISTS commits_ai
AFTER INSERT ON git_commits BEGIN
  INSERT INTO commits_fts (rowid, message, body)
  VALUES (new.id, new.message, new.body);
END;

-- File index for screenshots, SQL files, configs
CREATE TABLE IF NOT EXISTS files_index (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT,            -- screenshot|sql|config|markdown
  path       TEXT NOT NULL UNIQUE,
  name       TEXT,
  project    TEXT,
  size_bytes INTEGER,
  indexed_at TEXT DEFAULT (datetime('now'))
);
