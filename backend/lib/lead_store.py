"""Lead tracking store for engagement campaign.

This module provides persistent storage for tracking lead engagements,
pain points, and campaign progress using SQLite.
"""

import sqlite3
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import threading

# Database file
LEAD_DB_FILE = "lead_engagement.db"
_lock = threading.Lock()


def _get_connection():
    """Get a database connection."""
    conn = sqlite3.connect(LEAD_DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_lead_db():
    """Initialize the lead tracking database tables."""
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        # Leads table - tracks each lead
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_url TEXT UNIQUE NOT NULL,
                name TEXT,
                company TEXT,
                sheet_row INTEGER,
                status TEXT DEFAULT 'pending',
                connection_status TEXT DEFAULT 'not_sent',
                last_connection_check TEXT,
                total_engagements INTEGER DEFAULT 0,
                campaign_start_date TEXT,
                last_engagement_date TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Engagements table - tracks each engagement action
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS engagements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_id INTEGER NOT NULL,
                post_url TEXT,
                post_text TEXT,
                action TEXT,
                comment_text TEXT,
                pain_points TEXT,
                opportunity_score REAL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lead_id) REFERENCES leads(id)
            )
        """)
        
        # Pain points table - aggregated pain points
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pain_points (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_id INTEGER NOT NULL,
                pain_point TEXT NOT NULL,
                category TEXT,
                count INTEGER DEFAULT 1,
                first_seen TEXT DEFAULT CURRENT_TIMESTAMP,
                last_seen TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lead_id) REFERENCES leads(id)
            )
        """)
        
        conn.commit()
        
        # Migration: Add connection_status and last_connection_check if missing
        cursor.execute("PRAGMA table_info(leads)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'connection_status' not in columns:
            print("Migrating DB: Adding connection_status column to leads table")
            cursor.execute("ALTER TABLE leads ADD COLUMN connection_status TEXT DEFAULT 'not_sent'")
            
        if 'last_connection_check' not in columns:
            print("Migrating DB: Adding last_connection_check column to leads table")
            cursor.execute("ALTER TABLE leads ADD COLUMN last_connection_check TEXT")
            
        conn.commit()
        conn.close()


def get_or_create_lead(
    profile_url: str,
    name: str = "",
    company: str = "",
    sheet_row: int = None
) -> int:
    """
    Get existing lead ID or create new lead.
    
    Returns:
        Lead ID
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        # Try to find existing lead
        cursor.execute(
            "SELECT id FROM leads WHERE profile_url = ?",
            (profile_url,)
        )
        row = cursor.fetchone()
        
        if row:
            lead_id = row["id"]
            # Update info if provided
            if name or company or sheet_row:
                cursor.execute("""
                    UPDATE leads SET 
                        name = COALESCE(?, name),
                        company = COALESCE(?, company),
                        sheet_row = COALESCE(?, sheet_row)
                    WHERE id = ?
                """, (name or None, company or None, sheet_row, lead_id))
                conn.commit()
        else:
            # Create new lead
            today = datetime.now().strftime("%Y-%m-%d")
            cursor.execute("""
                INSERT INTO leads (profile_url, name, company, sheet_row, campaign_start_date)
                VALUES (?, ?, ?, ?, ?)
            """, (profile_url, name, company, sheet_row, today))
            conn.commit()
            lead_id = cursor.lastrowid
        
        conn.close()
        return lead_id


def record_engagement(
    lead_id: int,
    post_url: str = None,
    post_text: str = None,
    action: str = "engaged",
    comment_text: str = None,
    pain_points: List[str] = None,
    opportunity_score: float = None,
    category: str = None
) -> int:
    """
    Record an engagement action for a lead.
    
    Args:
        lead_id: ID of the lead
        post_url: URL of the engaged post
        post_text: Text of the post (truncated)
        action: Action taken (engaged/skipped/error)
        comment_text: Comment posted (if any)
        pain_points: List of pain points discovered
        opportunity_score: Opportunity score (0-1)
        category: Pain point category
    
    Returns:
        Engagement ID
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        pain_points_json = json.dumps(pain_points or [])
        
        # Insert engagement record
        cursor.execute("""
            INSERT INTO engagements 
                (lead_id, post_url, post_text, action, comment_text, pain_points, opportunity_score)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            lead_id,
            post_url,
            (post_text[:2000] if post_text else None),
            action,
            comment_text,
            pain_points_json,
            opportunity_score
        ))
        engagement_id = cursor.lastrowid
        
        # Update lead stats
        cursor.execute("""
            UPDATE leads SET
                total_engagements = total_engagements + 1,
                last_engagement_date = ?,
                status = ?
            WHERE id = ?
        """, (today, action, lead_id))
        
        # Record pain points
        if pain_points:
            for pp in pain_points:
                _upsert_pain_point(cursor, lead_id, pp, category)
        
        conn.commit()
        conn.close()
        
        return engagement_id


def _upsert_pain_point(cursor, lead_id: int, pain_point: str, category: str = None):
    """Insert or update a pain point record."""
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Check if pain point exists for this lead
    cursor.execute("""
        SELECT id, count FROM pain_points 
        WHERE lead_id = ? AND pain_point = ?
    """, (lead_id, pain_point))
    row = cursor.fetchone()
    
    if row:
        # Update existing
        cursor.execute("""
            UPDATE pain_points SET
                count = count + 1,
                last_seen = ?
            WHERE id = ?
        """, (today, row["id"]))
    else:
        # Insert new
        cursor.execute("""
            INSERT INTO pain_points (lead_id, pain_point, category, first_seen, last_seen)
            VALUES (?, ?, ?, ?, ?)
        """, (lead_id, pain_point, category, today, today))


def get_lead_engagement_history(lead_id: int) -> List[Dict]:
    """
    Get all engagements for a lead.
    
    Returns:
        List of engagement records
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM engagements
            WHERE lead_id = ?
            ORDER BY created_at DESC
        """, (lead_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]


def get_lead_pain_points(lead_id: int) -> List[Dict]:
    """
    Get aggregated pain points for a lead.
    
    Returns:
        List of pain point records with counts
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT * FROM pain_points
            WHERE lead_id = ?
            ORDER BY count DESC, last_seen DESC
        """, (lead_id,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]


def get_leads_for_today(
    all_profile_urls: List[str],
    leads_per_day: int = 10,
    days_between_engagements: int = 1
) -> List[str]:
    """
    Get leads that should be engaged today.
    
    Filters out leads that:
    - Have been engaged today
    - Have completed 15 engagements
    - Were engaged too recently
    
    Returns:
        List of profile URLs to engage today
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        min_date = (datetime.now() - timedelta(days=days_between_engagements)).strftime("%Y-%m-%d")
        
        eligible = []
        
        for url in all_profile_urls:
            cursor.execute("""
                SELECT id, total_engagements, last_engagement_date 
                FROM leads WHERE profile_url = ?
            """, (url,))
            row = cursor.fetchone()
            
            if row:
                # Check if already engaged today
                if row["last_engagement_date"] == today:
                    continue
                
                # Check if campaign complete
                if row["total_engagements"] >= 15:
                    continue
                
                # Check days between engagements
                if row["last_engagement_date"] and row["last_engagement_date"] > min_date:
                    continue
            
            eligible.append(url)
            
            if len(eligible) >= leads_per_day:
                break
        
        conn.close()
        return eligible


def get_campaign_progress() -> Dict:
    """
    Get overall campaign progress statistics.
    
    Returns:
        Dict with campaign stats
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        # Total leads
        cursor.execute("SELECT COUNT(*) as count FROM leads")
        total_leads = cursor.fetchone()["count"]
        
        # Leads with engagements
        cursor.execute("SELECT COUNT(*) as count FROM leads WHERE total_engagements > 0")
        engaged_leads = cursor.fetchone()["count"]
        
        # Completed campaigns (15+ engagements)
        cursor.execute("SELECT COUNT(*) as count FROM leads WHERE total_engagements >= 15")
        completed = cursor.fetchone()["count"]
        
        # Total engagements
        cursor.execute("SELECT COUNT(*) as count FROM engagements")
        total_engagements = cursor.fetchone()["count"]
        
        # Leads with pain points
        cursor.execute("SELECT COUNT(DISTINCT lead_id) as count FROM pain_points")
        leads_with_pain_points = cursor.fetchone()["count"]
        
        # Top pain points
        cursor.execute("""
            SELECT pain_point, SUM(count) as total_count
            FROM pain_points
            GROUP BY pain_point
            ORDER BY total_count DESC
            LIMIT 10
        """)
        top_pain_points = [
            {"pain_point": row["pain_point"], "count": row["total_count"]}
            for row in cursor.fetchall()
        ]
        
        # Category breakdown
        cursor.execute("""
            SELECT category, COUNT(*) as count
            FROM pain_points
            WHERE category IS NOT NULL
            GROUP BY category
            ORDER BY count DESC
        """)
        categories = [
            {"category": row["category"], "count": row["count"]}
            for row in cursor.fetchall()
        ]
        
        conn.close()
        
        return {
            "total_leads": total_leads,
            "engaged_leads": engaged_leads,
            "completed_campaigns": completed,
            "total_engagements": total_engagements,
            "leads_with_pain_points": leads_with_pain_points,
            "top_pain_points": top_pain_points,
            "categories": categories,
            "progress_pct": round((total_engagements / (total_leads * 15) * 100) if total_leads else 0, 1)
        }


def get_high_opportunity_leads(min_score: float = 0.6, limit: int = 10) -> List[Dict]:
    """
    Get leads with high opportunity scores.
    
    Returns:
        List of lead dicts with their opportunity data
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                l.id, l.profile_url, l.name, l.company, l.total_engagements,
                AVG(e.opportunity_score) as avg_score,
                GROUP_CONCAT(DISTINCT pp.pain_point) as pain_points
            FROM leads l
            JOIN engagements e ON l.id = e.lead_id
            LEFT JOIN pain_points pp ON l.id = pp.lead_id
            WHERE e.opportunity_score IS NOT NULL
            GROUP BY l.id
            HAVING avg_score >= ?
            ORDER BY avg_score DESC
            LIMIT ?
        """, (min_score, limit))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]


# Compatibility with existing state_store.py
def has_processed_lead_today(profile_url: str) -> bool:
    """Check if a lead was already engaged today."""
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        cursor.execute("""
            SELECT 1 FROM leads 
            WHERE profile_url = ? AND last_engagement_date = ?
        """, (profile_url, today))
        
        result = cursor.fetchone() is not None
        conn.close()
        
        return result


def has_engaged_post(post_text_hash: str) -> bool:
    """
    Check if a post has already been engaged (liked/commented).
    Uses first 200 chars of post text as identifier.
    """
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        # Check if we have engagement record with similar post text
        cursor.execute("""
            SELECT 1 FROM engagements 
            WHERE post_text LIKE ? AND action = 'engaged'
            LIMIT 1
        """, (f"{post_text_hash[:200]}%",))
        
        result = cursor.fetchone() is not None
        conn.close()
        
        return result


def update_connection_status(lead_id: int, status: str):
    """Update connection status for a lead."""
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        cursor.execute("""
            UPDATE leads SET 
                connection_status = ?,
                last_connection_check = ?
            WHERE id = ?
        """, (status, today, lead_id))
        
        conn.commit()
        conn.close()


def get_leads_to_check_connection(limit: int = 20) -> List[Dict]:
    """Get leads whose connection status needs to be checked (pending)."""
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, profile_url, name, connection_status
            FROM leads
            WHERE connection_status = 'pending'
            ORDER BY last_connection_check ASC
            LIMIT ?
        """, (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]


def get_today_engagement_count() -> int:
    """Get number of leads engaged today."""
    with _lock:
        conn = _get_connection()
        cursor = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        cursor.execute("""
            SELECT COUNT(DISTINCT lead_id) as count 
            FROM engagements 
            WHERE DATE(created_at) = ?
        """, (today,))
        
        count = cursor.fetchone()["count"]
        conn.close()
        
        return count


# Initialize database on module load
init_lead_db()
