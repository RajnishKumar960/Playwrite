"""Autonomous LinkedIn Growth Manager

Phase 1: Outreach Loop - Send up to 25 connection requests to leads with empty status.
Phase 2: Engagement Loop - 30 minutes of AI-driven feed engagement.
Phase 3: Reporting - Summary of actions taken.
"""

import os
import time
import random
import argparse
from datetime import datetime, timedelta
from typing import List, Dict

from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

from lib.auth import login
from lib.utils import human_sleep, smooth_scroll
from lib.safety import safe_to_like, safe_to_comment
from lib.openai_comments import generate_openai_comment
from lib.sheets_reader import read_leads, update_lead_status, ensure_columns_exist
from lib.profile_posts import navigate_to_profile, get_connection_degree, get_recent_posts
from lib.connections import send_connection_request
from lib.pain_point_analyzer import analyze_pain_points
from lib.lead_store import (
    get_or_create_lead, 
    record_engagement, 
    update_connection_status
)
from state_store import has_processed, mark_processed

# Load environment variables
load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

class GrowthManager:
    def __init__(self, sheet_id=None, headful=True, dry_run=False):
        self.sheet_id = sheet_id or GOOGLE_SHEET_ID
        self.headful = headful
        self.dry_run = dry_run
        self.stats = {
            "connections_sent": 0,
            "connections_skipped": 0,
            "comments_posted": 0,
            "lights_clicked": 0,
            "session_start": datetime.now(),
            "session_end": None
        }

    def run_outreach_phase(self, page, max_requests=25):
        """PHASE 1: The Outreach Loop"""
        print(f"\n{'='*60}")
        print(f"PHASE 1: OUTREACH LOOP (Target: {max_requests} requests)")
        print(f"{'='*60}")

        leads = read_leads(self.sheet_id)
        # Filter for rows where status is EMPTY
        target_leads = [l for l in leads if not l.get("status") or l.get("status").strip() == ""]
        
        print(f"Found {len(target_leads)} leads with empty status.")
        
        count = 0
        for lead in target_leads:
            if count >= max_requests:
                break
            
            profile_url = lead.get("profile_url")
            row_number = lead.get("row_number")
            
            print(f"\nProcessing Row {row_number}: {profile_url}")
            
            if page.is_closed():
                print("❌ Browser page was closed unexpectedly. Stopping outreach.")
                break
                
            if navigate_to_profile(page, profile_url):
                degree = get_connection_degree(page)
                print(f"  Connection Degree: {degree}")
                
                if degree == "1st":
                    print("  ○ Already connected. Skipping.")
                    update_lead_status(self.sheet_id, row_number, status="Skipped", notes="Already 1st degree")
                    self.stats["connections_skipped"] += 1
                    continue
                
                if "pending" in degree.lower():
                    print("  ○ Connection already pending. Skipping.")
                    update_lead_status(self.sheet_id, row_number, status="Skipped", notes="Already pending")
                    self.stats["connections_skipped"] += 1
                    continue

                if self.dry_run:
                    print(f"  [DRY RUN] Would send connection request to {profile_url}")
                    update_lead_status(self.sheet_id, row_number, status="Connection Sent", notes=f"DRY RUN - {datetime.now().strftime('%Y-%m-%d')}")
                    count += 1
                    self.stats["connections_sent"] += 1
                    # Skip actual sending but proceed to analysis trigger if desired
                    # For dry run, we still want to test the analysis trigger
                else:
                    # Execute: Send connection request
                    print(f"  → Generating personalized note...")
                    from lib.profile_posts import get_profile_name
                    from lib.connections import generate_connection_note
                    
                    name = get_profile_name(page)
                    # Try to get headline/about snippet if possible
                    bio = ""
                    try:
                        bio_el = page.locator("div.text-body-medium.break-words").first # Headline
                        if bio_el.count() > 0:
                            bio = bio_el.inner_text()
                    except Exception:
                        pass
                    
                    note = generate_connection_note(name or lead.get("name"), bio)
                    if note:
                        print(f"  📝 Generated Note: {note[:60]}...")
                    
                    print(f"  → Sending connection request...")
                    req_result = send_connection_request(page, profile_url, note=note)
                
                # Check status (either real or dry-run)
                if self.dry_run or (req_result and req_result["status"] == "pending"):
                    if not self.dry_run:
                        # Immediate Update: Status and Current Date
                        today_str = datetime.now().strftime("%Y-%m-%d")
                        update_lead_status(
                            self.sheet_id, 
                            row_number, 
                            status="Connection Sent", 
                            notes=f"{today_str}"
                        )
                        count += 1
                        self.stats["connections_sent"] += 1
                        print(f"  ✓ Logged: Connection Sent ({count}/{max_requests})")
                    
                    # --- NEW: Immediate Top-to-Bottom Analysis (Day 1) ---
                    print(f"  🔍 Performing Day 1 Top-to-Bottom Analysis...")
                    self.analyze_lead_day_1(page, lead, row_number)
                elif not self.dry_run:
                    print(f"  ✗ Failed: {req_result.get('reason')}")
                    update_lead_status(self.sheet_id, row_number, status="Error", notes=req_result.get("reason"))
                
                human_sleep(3, 7)
        
        print(f"\nOutreach Phase Complete. Sent: {self.stats['connections_sent']}")

    def analyze_lead_day_1(self, page, lead, row_number):
        """Analyze profile and posts immediately after connection."""
        profile_url = lead.get("profile_url")
        lead_name = lead.get("name")
        
        # 1. Scroll profile top to bottom
        print("  📜 Scrolling profile top to bottom...")
        for _ in range(3):
            smooth_scroll(page, random.randint(800, 1200))
            human_sleep(1, 2)
            
        # 2. Extract bio/about for pain points
        bio_text = ""
        try:
            about_section = page.locator("section:has-id('about'), div#about").first
            if about_section.count() > 0:
                bio_text = about_section.inner_text()
        except Exception:
            pass
            
        # 3. Read posts (navigate to activity)
        print("  📝 Reading recent posts...")
        posts = get_recent_posts(page, max_posts=5, max_days=14)
        
        # 4. Analyze pain points
        all_pain_points = []
        if bio_text:
            bio_analysis = analyze_pain_points(bio_text, lead_name or "Lead")
            if bio_analysis.get("has_pain_point"):
                all_pain_points.extend(bio_analysis.get("pain_points", []))
                
        for i, post in enumerate(posts):
            p_text = post.get("text", "")
            if p_text:
                p_analysis = analyze_pain_points(p_text, lead_name or "Lead")
                if p_analysis.get("has_pain_point"):
                    all_pain_points.extend(p_analysis.get("pain_points", []))
                    
        # 5. Record in DB as Day 1
        pain_points_unique = list(set(all_pain_points))
        print(f"  📊 Day 1 Pain Points: {', '.join(pain_points_unique[:5]) or 'None found'}")
        
        # Sync with lead_store
        lead_id = get_or_create_lead(profile_url, name=lead_name, sheet_row=row_number)
        if pain_points_unique:
            record_engagement(
                lead_id=lead_id,
                action="analyzed_day_1",
                pain_points=pain_points_unique,
                notes="Initial top-to-bottom analysis"
            )
            
            # Update sheet
            pain_str = "; ".join(pain_points_unique[:5])
            update_lead_status(
                self.sheet_id, 
                row_number, 
                pain_points=pain_str, 
                notes=f"Day 1 Analysis Complete"
            )

    def run_engagement_phase(self, page, duration_minutes=30):
        """PHASE 2: The Engagement Loop"""
        print(f"\n{'='*60}")
        print(f"PHASE 2: ENGAGEMENT LOOP (Duration: {duration_minutes} min)")
        print(f"{'='*60}")

        if self.dry_run:
            print("[DRY RUN] Skipping engagement loop timer.")
            return

        from enhanced_paired_agent import find_posts_on_page, process_post
        
        # Navigate to Home Feed
        page.goto("https://www.linkedin.com/feed/", wait_until="networkidle")
        human_sleep(3, 5)

        end_time = datetime.now() + timedelta(minutes=duration_minutes)
        
        while datetime.now() < end_time:
            remaining = (end_time - datetime.now()).total_seconds() / 60
            print(f"\n⏱  Engagement time remaining: {remaining:.1f} minutes")
            
            posts = find_posts_on_page(page)
            for post in posts:
                if has_processed(post["id"]):
                    continue
                
                # Check for 1st-degree connection posts primarily as per network focus
                author_text = post.get("author", "")
                post_text = post.get("text", "")
                
                # We process the post
                print(f"\nProcessing post from: {author_text}")
                
                success = process_post(
                    page, 
                    post, 
                    should_comment=True, 
                    post_comments=True, 
                    safe_mode=True
                )
                
                if success:
                    self.stats["lights_clicked"] += 1
                    self.stats["comments_posted"] += 1
                
                mark_processed(post["id"])
                human_sleep(5, 12)
            
            # Scroll naturally
            smooth_scroll(page, random.randint(400, 800))
            human_sleep(2, 4)

    def print_report(self):
        """PHASE 3: Reporting"""
        self.stats["session_end"] = datetime.now()
        duration = self.stats["session_end"] - self.stats["session_start"]
        
        print(f"\n" + "="*60)
        print("   AUTONOMOUS GROWTH MANAGER REPORT")
        print("="*60)
        print(f"  Session Duration:    {str(duration).split('.')[0]}")
        print(f"  Connections Sent:    {self.stats['connections_sent']}")
        print(f"  Connections Skipped: {self.stats['connections_skipped']}")
        print(f"  Comments Posted:     {self.stats['comments_posted']}")
        print(f"  Likes Given:         {self.stats['lights_clicked']}")
        print("="*60 + "\n")

def run_growth_cycle(max_connections=25, engagement_duration=30, headful=True, dry_run=False):
    manager = GrowthManager(headful=headful, dry_run=dry_run)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(viewport={"width": 1280, "height": 900}, storage_state=storage_state)
        page = context.new_page()

        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            print("Login failed. Check session or credentials.")
            if headful:
                print("Press Enter once logged in...")
                input()
            else:
                browser.close()
                return

        try:
            # Phase 1: Outreach
            manager.run_outreach_phase(page, max_requests=max_connections)
            
            # Phase 2: Engagement
            manager.run_engagement_phase(page, duration_minutes=engagement_duration)
            
            # Phase 3: Reporting
            manager.print_report()
            
        finally:
            context.storage_state(path="auth.json")
            browser.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Autonomous LinkedIn Growth Manager")
    parser.add_argument("--max-connections", type=int, default=25, help="Max connections to send (default: 25)")
    parser.add_argument("--duration", type=int, default=30, help="Engagement duration in minutes (default: 30)")
    parser.add_argument("--headful", action="store_true", help="Run with visible browser")
    parser.add_argument("--dry-run", action="store_true", help="Perform actions without actually sending/posting")
    
    args = parser.parse_args()
    
    run_growth_cycle(
        max_connections=args.max_connections,
        engagement_duration=args.duration,
        headful=args.headful,
        dry_run=args.dry_run
    )
