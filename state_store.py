"""Simple SQLite-backed processed-state store used by Play API and agents.

Provides helper functions to initialize DB, check whether a profile+action was
already processed and mark profiles as processed. The DB path is controlled by
PLAY_DB_PATH environment variable (defaults to ./play_state.db).

This is intentionally small and dependency free (stdlib only).
"""
from __future__ import annotations

import os
import sqlite3
import time
from typing import Optional, List, Dict, Any

DEFAULT_DB = os.getenv('PLAY_DB_PATH', 'play_state.db')


def _conn(db_path: Optional[str] = None) -> sqlite3.Connection:
    return sqlite3.connect(db_path or DEFAULT_DB, check_same_thread=False)


def init_db(db_path: Optional[str] = None) -> None:
    """Create the processed_actions table if it doesn't exist."""
    db = db_path or DEFAULT_DB
    with _conn(db) as conn:
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS processed_actions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile TEXT NOT NULL,
                action TEXT NOT NULL,
                result TEXT,
                ts INTEGER NOT NULL
            )
            """
        )
        conn.commit()


def is_processed(profile: str, action: Optional[str] = None, db_path: Optional[str] = None) -> bool:
    """Return True if a profile (optionally for a specific action) was already processed."""
    db = db_path or DEFAULT_DB
    with _conn(db) as conn:
        cur = conn.cursor()
        if action:
            cur.execute("SELECT 1 FROM processed_actions WHERE profile=? AND action=? LIMIT 1", (profile, action))
        else:
            cur.execute("SELECT 1 FROM processed_actions WHERE profile=? LIMIT 1", (profile,))
        row = cur.fetchone()
        return bool(row)


def mark_processed(profile: str, action: str, result: Optional[str] = None, db_path: Optional[str] = None) -> None:
    """Insert a processed record for profile/action with an optional result string."""
    db = db_path or DEFAULT_DB
    ts = int(time.time())
    with _conn(db) as conn:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO processed_actions (profile, action, result, ts) VALUES (?, ?, ?, ?)",
            (profile, action, result or '', ts),
        )
        conn.commit()


def list_processed(action: Optional[str] = None, limit: int = 200, db_path: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return up to `limit` processed records (optionally filtered by action)."""
    db = db_path or DEFAULT_DB
    with _conn(db) as conn:
        cur = conn.cursor()
        if action:
            cur.execute("SELECT id, profile, action, result, ts FROM processed_actions WHERE action=? ORDER BY ts DESC LIMIT ?", (action, limit))
        else:
            cur.execute("SELECT id, profile, action, result, ts FROM processed_actions ORDER BY ts DESC LIMIT ?", (limit,))
        rows = cur.fetchall()
    return [dict(id=r[0], profile=r[1], action=r[2], result=r[3], ts=r[4]) for r in rows]


if __name__ == '__main__':
    print('Initializing store at', DEFAULT_DB)
    init_db()
    print('OK')
