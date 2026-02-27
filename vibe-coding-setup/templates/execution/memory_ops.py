#!/usr/bin/env python3
"""Project execution memory layer using SQLite.

Usage:
  python3 execution/memory_ops.py init
  python3 execution/memory_ops.py log-run "<skill>" "<status>" [--notes "..."]
  python3 execution/memory_ops.py get-runs [<skill>] [--limit N]
  python3 execution/memory_ops.py search "<keywords>"
  python3 execution/memory_ops.py add-entity "<name>" "<type>" [--obs "..."]
  python3 execution/memory_ops.py add-observation "<entity>" "<fact>"
  python3 execution/memory_ops.py read-graph
  python3 execution/memory_ops.py add-learning [<skill>] "<content>"
  python3 execution/memory_ops.py get-learnings [<skill>]
"""

import argparse
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path("db/memory.db")


def get_conn() -> sqlite3.Connection:
    if not DB_PATH.exists():
        print(
            f"Error: {DB_PATH} not found. Run: python3 execution/memory_ops.py init",
            file=sys.stderr,
        )
        sys.exit(1)
    return sqlite3.connect(DB_PATH)


def cmd_init(args: argparse.Namespace) -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS entities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS observations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          entity_id INTEGER REFERENCES entities(id),
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS relations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          from_entity INTEGER REFERENCES entities(id),
          relation TEXT NOT NULL,
          to_entity INTEGER REFERENCES entities(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS directive_runs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          directive TEXT NOT NULL,
          status TEXT NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS learnings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          skill TEXT,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()
    print(f"Initialized {DB_PATH}")


def cmd_log_run(args: argparse.Namespace) -> None:
    conn = get_conn()
    conn.execute(
        "INSERT INTO directive_runs (directive, status, notes) VALUES (?, ?, ?)",
        (args.skill, args.status, args.notes),
    )
    conn.commit()
    conn.close()
    print(f"Logged: [{args.status}] {args.skill}")


def cmd_get_runs(args: argparse.Namespace) -> None:
    conn = get_conn()
    if args.skill:
        rows = conn.execute(
            "SELECT directive, status, notes, created_at FROM directive_runs"
            " WHERE directive = ? ORDER BY created_at DESC LIMIT ?",
            (args.skill, args.limit),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT directive, status, notes, created_at FROM directive_runs"
            " ORDER BY created_at DESC LIMIT ?",
            (args.limit,),
        ).fetchall()
    conn.close()
    if not rows:
        print("No runs found.")
        return
    for directive, status, notes, created_at in rows:
        ts = created_at[:16] if created_at else "?"
        print(f"[{ts}] {directive} — {status}")
        if notes:
            print(f"  {notes}")


def cmd_search(args: argparse.Namespace) -> None:
    kw = args.keywords
    like = f"%{kw}%"
    conn = get_conn()

    runs = conn.execute(
        "SELECT 'run', directive, status, notes, created_at FROM directive_runs"
        " WHERE directive LIKE ? OR notes LIKE ? ORDER BY created_at DESC LIMIT 10",
        (like, like),
    ).fetchall()

    learnings = conn.execute(
        "SELECT 'learning', skill, '', content, created_at FROM learnings"
        " WHERE skill LIKE ? OR content LIKE ? ORDER BY created_at DESC LIMIT 10",
        (like, like),
    ).fetchall()

    obs = conn.execute(
        "SELECT 'observation', e.name, e.type, o.content, o.created_at"
        " FROM observations o JOIN entities e ON o.entity_id = e.id"
        " WHERE o.content LIKE ? OR e.name LIKE ? ORDER BY o.created_at DESC LIMIT 10",
        (like, like),
    ).fetchall()

    conn.close()
    results = runs + learnings + obs

    if not results:
        print(f"No results for '{kw}'.")
        return

    print(f"Search: '{kw}' — {len(results)} result(s)\n")
    for kind, name, extra, content, created_at in results:
        ts = created_at[:16] if created_at else "?"
        if kind == "run":
            print(f"[{ts}] RUN: {name} — {extra}")
            if content:
                print(f"  {content}")
        elif kind == "learning":
            label = f" ({name})" if name else ""
            print(f"[{ts}] LEARNING{label}: {content[:120]}")
        elif kind == "observation":
            print(f"[{ts}] ENTITY {name} ({extra}): {content[:120]}")
        print()


def cmd_add_entity(args: argparse.Namespace) -> None:
    conn = get_conn()
    cur = conn.execute(
        "INSERT INTO entities (name, type) VALUES (?, ?)",
        (args.name, args.type),
    )
    entity_id = cur.lastrowid
    if args.obs:
        conn.execute(
            "INSERT INTO observations (entity_id, content) VALUES (?, ?)",
            (entity_id, args.obs),
        )
    conn.commit()
    conn.close()
    print(f"Added entity: {args.name} ({args.type})")
    if args.obs:
        print(f"  Observation: {args.obs}")


def cmd_add_observation(args: argparse.Namespace) -> None:
    conn = get_conn()
    row = conn.execute(
        "SELECT id FROM entities WHERE name = ?", (args.entity,)
    ).fetchone()
    if not row:
        print(f"Error: entity '{args.entity}' not found.", file=sys.stderr)
        sys.exit(1)
    conn.execute(
        "INSERT INTO observations (entity_id, content) VALUES (?, ?)",
        (row[0], args.fact),
    )
    conn.commit()
    conn.close()
    print(f"Observation added to '{args.entity}': {args.fact}")


def cmd_read_graph(args: argparse.Namespace) -> None:
    conn = get_conn()
    entities = conn.execute(
        "SELECT id, name, type FROM entities ORDER BY type, name"
    ).fetchall()
    if not entities:
        print("Knowledge graph is empty.")
        conn.close()
        return

    print(f"Knowledge Graph — {len(entities)} entity/entities\n")
    for eid, name, etype in entities:
        print(f"[{etype}] {name}")
        obs = conn.execute(
            "SELECT content FROM observations WHERE entity_id = ? ORDER BY created_at",
            (eid,),
        ).fetchall()
        for (o,) in obs:
            print(f"  • {o}")
        rels = conn.execute(
            "SELECT r.relation, e.name FROM relations r"
            " JOIN entities e ON r.to_entity = e.id WHERE r.from_entity = ?",
            (eid,),
        ).fetchall()
        for rel, target in rels:
            print(f"  → {rel} → {target}")
        print()
    conn.close()


def cmd_add_learning(args: argparse.Namespace) -> None:
    conn = get_conn()
    conn.execute(
        "INSERT INTO learnings (skill, content) VALUES (?, ?)",
        (args.skill, args.content),
    )
    conn.commit()
    conn.close()
    label = args.skill or "general"
    print(f"Learning added [{label}]: {args.content[:80]}")


def cmd_get_learnings(args: argparse.Namespace) -> None:
    conn = get_conn()
    if args.skill:
        rows = conn.execute(
            "SELECT skill, content, created_at FROM learnings"
            " WHERE skill = ? ORDER BY created_at DESC",
            (args.skill,),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT skill, content, created_at FROM learnings ORDER BY created_at DESC"
        ).fetchall()
    conn.close()
    if not rows:
        print("No learnings found.")
        return
    for skill, content, created_at in rows:
        ts = created_at[:16] if created_at else "?"
        label = skill or "general"
        print(f"[{ts}] [{label}] {content}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Project execution memory ops")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("init", help="Create db/memory.db with schema")

    p = sub.add_parser("log-run", help="Log a skill/directive run")
    p.add_argument("skill", help="Skill or directive name")
    p.add_argument("status", choices=["success", "failed", "partial"], help="Outcome")
    p.add_argument("--notes", default=None, help="Notes about the run")

    p = sub.add_parser("get-runs", help="Get recent runs for a skill")
    p.add_argument("skill", nargs="?", default=None, help="Filter by skill name")
    p.add_argument("--limit", type=int, default=5, help="Max results (default: 5)")

    p = sub.add_parser("search", help="Full-text search across all memory")
    p.add_argument("keywords", help="Search query")

    p = sub.add_parser("add-entity", help="Add a knowledge graph entity")
    p.add_argument("name", help="Entity name")
    p.add_argument("type", help="Entity type (e.g. api, service, pattern)")
    p.add_argument("--obs", default=None, help="Initial observation")

    p = sub.add_parser("add-observation", help="Add observation to existing entity")
    p.add_argument("entity", help="Entity name")
    p.add_argument("fact", help="Observation text")

    sub.add_parser("read-graph", help="Display the full knowledge graph")

    p = sub.add_parser("add-learning", help="Add a learning entry")
    p.add_argument("skill", nargs="?", default=None, help="Associated skill (optional)")
    p.add_argument("content", help="Learning content")

    p = sub.add_parser("get-learnings", help="Get learnings, optionally filtered by skill")
    p.add_argument("skill", nargs="?", default=None, help="Filter by skill name")

    args = parser.parse_args()

    dispatch = {
        "init": cmd_init,
        "log-run": cmd_log_run,
        "get-runs": cmd_get_runs,
        "search": cmd_search,
        "add-entity": cmd_add_entity,
        "add-observation": cmd_add_observation,
        "read-graph": cmd_read_graph,
        "add-learning": cmd_add_learning,
        "get-learnings": cmd_get_learnings,
    }
    dispatch[args.cmd](args)


if __name__ == "__main__":
    main()
