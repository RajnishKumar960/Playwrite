"""Campaign Scheduler for 15-Day Lead Engagement.

This module manages the distribution of leads across a 15-day campaign,
tracks daily schedules, and provides progress monitoring.
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from lib.sheets_reader import read_leads, get_campaign_stats
from lib.lead_store import get_campaign_progress, get_leads_for_today

SCHEDULE_FILE = "campaign_schedule.json"


def create_campaign_schedule(
    sheet_id: str,
    campaign_days: int = 15,
    leads_per_day: int = 10,
    start_date: str = None
) -> Dict:
    """
    Create a 15-day campaign schedule distributing leads evenly.
    
    Args:
        sheet_id: Google Sheet ID with leads
        campaign_days: Number of days for the campaign (default: 15)
        leads_per_day: Max leads to process per day
        start_date: Campaign start date (YYYY-MM-DD), defaults to today
    
    Returns:
        Dict with schedule and metadata
    """
    if not start_date:
        start_date = datetime.now().strftime("%Y-%m-%d")
    
    # Read all leads
    leads = read_leads(sheet_id)
    total_leads = len(leads)
    
    if total_leads == 0:
        return {"error": "No leads found in sheet", "schedule": {}}
    
    # Calculate distribution
    # Each lead should be engaged once per day during the campaign
    # But we limit daily processing to leads_per_day
    
    # Simple round-robin distribution
    schedule = {}
    lead_cycle = list(range(total_leads))
    
    for day in range(campaign_days):
        campaign_date = (
            datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=day)
        ).strftime("%Y-%m-%d")
        
        # Get leads for this day (rotate through all leads)
        day_leads = []
        start_idx = (day * leads_per_day) % total_leads
        
        for i in range(leads_per_day):
            lead_idx = (start_idx + i) % total_leads
            day_leads.append({
                "index": lead_idx,
                "profile_url": leads[lead_idx].get("profile_url"),
                "name": leads[lead_idx].get("name", "")
            })
        
        schedule[campaign_date] = {
            "day_number": day + 1,
            "leads": day_leads,
            "target_count": len(day_leads),
            "completed_count": 0
        }
    
    campaign_data = {
        "sheet_id": sheet_id,
        "start_date": start_date,
        "end_date": (
            datetime.strptime(start_date, "%Y-%m-%d") + timedelta(days=campaign_days - 1)
        ).strftime("%Y-%m-%d"),
        "campaign_days": campaign_days,
        "leads_per_day": leads_per_day,
        "total_leads": total_leads,
        "schedule": schedule,
        "created_at": datetime.now().isoformat()
    }
    
    # Save schedule
    save_schedule(campaign_data)
    
    return campaign_data


def save_schedule(schedule_data: Dict):
    """Save schedule to file."""
    with open(SCHEDULE_FILE, "w") as f:
        json.dump(schedule_data, f, indent=2)


def load_schedule() -> Optional[Dict]:
    """Load existing schedule from file."""
    if not os.path.exists(SCHEDULE_FILE):
        return None
    
    try:
        with open(SCHEDULE_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return None


def get_today_schedule(sheet_id: str = None) -> Dict:
    """
    Get today's scheduled leads.
    
    Returns:
        Dict with today's leads and schedule info
    """
    schedule = load_schedule()
    today = datetime.now().strftime("%Y-%m-%d")
    
    if schedule and today in schedule.get("schedule", {}):
        day_data = schedule["schedule"][today]
        return {
            "date": today,
            "day_number": day_data.get("day_number", 0),
            "leads": day_data.get("leads", []),
            "target_count": day_data.get("target_count", 0),
            "completed_count": day_data.get("completed_count", 0)
        }
    
    # If no schedule exists or today not in schedule, create dynamic schedule
    if sheet_id:
        leads = read_leads(sheet_id)
        lead_urls = [l.get("profile_url") for l in leads if l.get("profile_url")]
        
        today_leads = get_leads_for_today(lead_urls, leads_per_day=10)
        
        return {
            "date": today,
            "day_number": 0,  # Ad-hoc
            "leads": [{"profile_url": url} for url in today_leads],
            "target_count": len(today_leads),
            "completed_count": 0,
            "dynamic": True
        }
    
    return {"date": today, "leads": [], "target_count": 0}


def mark_day_completed(date: str, completed_count: int):
    """Mark a day's engagement as completed in the schedule."""
    schedule = load_schedule()
    if not schedule:
        return
    
    if date in schedule.get("schedule", {}):
        schedule["schedule"][date]["completed_count"] = completed_count
        save_schedule(schedule)


def get_campaign_calendar() -> List[Dict]:
    """
    Get a calendar view of the campaign with daily progress.
    
    Returns:
        List of day records with date, status, completed count
    """
    schedule = load_schedule()
    if not schedule:
        return []
    
    calendar = []
    today = datetime.now().strftime("%Y-%m-%d")
    
    for date, day_data in sorted(schedule.get("schedule", {}).items()):
        status = "pending"
        if date < today:
            status = "completed" if day_data.get("completed_count", 0) > 0 else "missed"
        elif date == today:
            status = "today"
        
        calendar.append({
            "date": date,
            "day_number": day_data.get("day_number", 0),
            "target": day_data.get("target_count", 0),
            "completed": day_data.get("completed_count", 0),
            "status": status
        })
    
    return calendar


def print_campaign_status():
    """Print a formatted campaign status report."""
    schedule = load_schedule()
    progress = get_campaign_progress()
    
    print("\n" + "="*60)
    print("   Campaign Status")
    print("="*60)
    
    if schedule:
        print(f"  Campaign: {schedule.get('start_date')} to {schedule.get('end_date')}")
        print(f"  Total Leads: {schedule.get('total_leads', 0)}")
        print(f"  Leads/Day: {schedule.get('leads_per_day', 0)}")
    
    print(f"\n  Database Stats:")
    print(f"    Leads tracked: {progress.get('total_leads', 0)}")
    print(f"    Total engagements: {progress.get('total_engagements', 0)}")
    print(f"    Campaign progress: {progress.get('progress_pct', 0)}%")
    print(f"    Leads with pain points: {progress.get('leads_with_pain_points', 0)}")
    
    # Show calendar
    calendar = get_campaign_calendar()
    if calendar:
        print("\n  Daily Schedule:")
        for day in calendar[:7]:  # Show next 7 days
            emoji = {
                "completed": "✓",
                "missed": "✗",
                "today": "→",
                "pending": "○"
            }.get(day["status"], "?")
            
            print(f"    {emoji} Day {day['day_number']:2d} ({day['date']}): {day['completed']}/{day['target']}")
    
    print("="*60 + "\n")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Campaign Scheduler")
    parser.add_argument("--sheet", type=str, help="Google Sheet ID")
    parser.add_argument("--create", action="store_true", help="Create new campaign schedule")
    parser.add_argument("--days", type=int, default=15, help="Campaign duration in days")
    parser.add_argument("--daily", type=int, default=10, help="Leads per day")
    parser.add_argument("--status", action="store_true", help="Show campaign status")
    
    args = parser.parse_args()
    
    if args.create:
        if not args.sheet:
            sheet_id = os.getenv("GOOGLE_SHEET_ID")
        else:
            sheet_id = args.sheet
        
        if not sheet_id:
            print("Error: No sheet ID provided. Use --sheet or set GOOGLE_SHEET_ID env var.")
        else:
            result = create_campaign_schedule(
                sheet_id, 
                campaign_days=args.days,
                leads_per_day=args.daily
            )
            print(f"Campaign schedule created!")
            print(f"  Start: {result.get('start_date')}")
            print(f"  End: {result.get('end_date')}")
            print(f"  Total leads: {result.get('total_leads')}")
    
    if args.status or not (args.create):
        print_campaign_status()
