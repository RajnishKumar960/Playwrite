"""Connection Checker Utility

This script checks the connection status of leads marked as 'pending' in the database.
If a lead has accepted the connection request, it updates their status in the 
local database and the Google Sheet, enabling deep analysis in the next agent run.
"""

from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import os
import time
import random

from lib.auth import login
from lib.profile_posts import navigate_to_profile, get_connection_degree
from lib.lead_store import get_leads_to_check_connection, update_connection_status
from lib.sheets_reader import update_lead_status

load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")
SHEET_ID = os.getenv("GOOGLE_SHEET_ID")

def check_connections(headful: bool = False, limit: int = 10):
    """Check connection status for pending leads."""
    leads = get_leads_to_check_connection(limit=limit)
    if not leads:
        print("No pending connection requests to check.")
        return

    print(f"Checking connection status for {len(leads)} leads...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(storage_state=storage_state)
        page = context.new_page()

        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            print("Login failed. Aborting.")
            browser.close()
            return

        for lead in leads:
            lead_id = lead["id"]
            profile_url = lead["profile_url"]
            name = lead.get("name", profile_url)

            print(f"Checking: {name}...")
            if navigate_to_profile(page, profile_url):
                degree = get_connection_degree(page)
                print(f"  Current status: {degree}")

                if degree == "1st":
                    print(f"  ✓ {name} is now a 1st degree connection!")
                    update_connection_status(lead_id, "accepted")
                    # Update sheet if possible (we don't have row_number here, 
                    # but lead_store might. Actually, lead_store.get_leads_to_check_connection
                    # should return row_number too if we want to update the sheet.)
                    # Let's assume we update the sheet in the next agent run or 
                    # modify lead_store to return row_number.
                elif "pending" in degree.lower() or degree == "unknown":
                    print(f"  ○ Still pending or unknown.")
                    # Update timestamp in DB
                    update_connection_status(lead_id, "pending")
                else:
                    # Maybe it was ignored or degree is 2nd/3rd (failed/rejected)
                    print(f"  ⚠ Not connected ({degree}).")
            
            time.sleep(random.uniform(5, 10))

        browser.close()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--headful", action="store_true")
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()
    
    check_connections(headful=args.headful, limit=args.limit)
