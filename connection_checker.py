"""Connection Checker Agent - Checks status of connections and grows network.

Adapted from Growth Manager for Dashboard Integration.
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
from lib.sheets_reader import read_leads, update_lead_status
from lib.profile_posts import navigate_to_profile, get_connection_degree
from lib.connections import send_connection_request
from lib.lead_store import get_or_create_lead, update_connection_status
from agent_streaming import AgentStreamingRunner

# Load environment variables
load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

class ConnectionChecker:
    def __init__(self, sheet_id=None, headful=True, dry_run=False, streamer=None):
        self.sheet_id = sheet_id or GOOGLE_SHEET_ID
        self.headful = headful
        self.dry_run = dry_run
        self.streamer = streamer
        self.stats = {
            "connections_sent": 0,
            "connections_checked": 0,
            "newly_connected": 0,
            "session_start": datetime.now(),
            "session_end": None
        }

    def run_check_cycle(self, page, limit=25, duration_minutes=15):
        """Check connection statuses and send new requests."""
        print(f"\n{'='*60}")
        print(f"CONNECTION CHECKER (Limit: {limit}, Duration: {duration_minutes}m)")
        print(f"{'='*60}")

        if self.streamer:
            self.streamer.send_log(f"Starting Connection Checker (Limit: {limit})")

        leads = read_leads(self.sheet_id)
        # Filter for leads that are 'Connection Sent' to check if accepted, 
        # OR leads with empty status to send new ones.
        # For a "Checker", we prioritize checking 'Connection Sent'.
        
        pending_leads = [l for l in leads if l.get("status") == "Connection Sent"]
        new_leads = [l for l in leads if not l.get("status") or l.get("status").strip() == ""]
        
        target_leads = pending_leads + new_leads
        print(f"Found {len(pending_leads)} pending and {len(new_leads)} new leads.")
        
        count = 0
        end_time = datetime.now() + timedelta(minutes=duration_minutes)
        
        for lead in target_leads:
            if count >= limit:
                print("Limit reached.")
                break
            
            if datetime.now() > end_time:
                print("Time limit reached.")
                break
            
            profile_url = lead.get("profile_url")
            row_number = lead.get("row_number")
            name = lead.get("name", "Unknown")
            
            print(f"\nChecking: {name} ({profile_url})")
            if self.streamer:
                self.streamer.send_log(f"Checking {name}")
                self.streamer.send_action("visiting", name)
            
            if navigate_to_profile(page, profile_url):
                if self.streamer: self.streamer.capture_and_send()
                
                degree = get_connection_degree(page)
                print(f"  Degree: {degree}")
                
                # Update DB/Sheet based on degree
                is_1st = degree == "1st"
                status_val = "accepted" if is_1st else "pending" if "pending" in degree else "not_connected"
                
                # If it was pending and now is 1st
                if lead.get("status") == "Connection Sent" and is_1st:
                    print("  ★ Connection Accepted!")
                    update_lead_status(self.sheet_id, row_number, status="Connected", notes=f"Accepted on {datetime.now().strftime('%Y-%m-%d')}")
                    self.stats["newly_connected"] += 1
                    if self.streamer: self.streamer.send_action("connected", name)
                
                # If new lead and not connected
                elif not lead.get("status") and not is_1st and "pending" not in degree:
                    # Send request
                    if not self.dry_run:
                        print("  → Sending connection request...")
                        from lib.connections import generate_connection_note
                        
                        note = generate_connection_note(name, "")
                        req_result = send_connection_request(page, profile_url, note=note)
                        
                        if req_result["status"] == "pending":
                            update_lead_status(self.sheet_id, row_number, status="Connection Sent", notes=datetime.now().strftime('%Y-%m-%d'))
                            self.stats["connections_sent"] += 1
                            if self.streamer: self.streamer.send_action("sent_request", name)
                
                if self.streamer: self.streamer.capture_and_send()
                
                self.stats["connections_checked"] += 1
                count += 1
                
                human_sleep(3, 8)
                
        print("\nCheck Clean Up...")

def run_connection_checker(limit=25, duration=15, headful=True, dry_run=False, stream=False):
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("Missing credentials")

    streamer = None
    if stream:
        streamer = AgentStreamingRunner("connectionChecker")
        streamer.connect()

    checker = ConnectionChecker(headful=headful, dry_run=dry_run, streamer=streamer)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(viewport={"width": 1280, "height": 900}, storage_state=storage_state)
        page = context.new_page()
        
        if streamer: streamer.set_page(page)

        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            print("Login failed")
            browser.close()
            if streamer: streamer.disconnect()
            return

        print("Logged in")
        if streamer: streamer.capture_and_send()
        human_sleep(2)
        
        try:
            checker.run_check_cycle(page, limit=limit, duration_minutes=duration)
        finally:
            context.storage_state(path="auth.json")
            browser.close()
            if streamer: streamer.disconnect()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=25, help="Max profiles to check")
    parser.add_argument("--duration", type=int, default=15, help="Duration in minutes")
    parser.add_argument("--headful", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--stream", action="store_true")
    
    args = parser.parse_args()
    
    run_connection_checker(
        limit=args.limit,
        duration=args.duration,
        headful=args.headful,
        dry_run=args.dry_run,
        stream=args.stream
    )
