"""Google Sheets reader for lead data.

This module provides functions to read leads from Google Sheets and update
their engagement status and pain points.

Prerequisites:
    - Set GOOGLE_SERVICE_ACCOUNT_FILE env var to your service account JSON path
    - Share your Google Sheet with the service account email
    - Set GOOGLE_SHEET_ID env var or pass sheet_id to functions
"""

import os
from typing import List, Dict, Optional
from datetime import datetime

try:
    import gspread
    from google.oauth2.service_account import Credentials
    SHEETS_AVAILABLE = True
except ImportError:
    SHEETS_AVAILABLE = False
    gspread = None
    Credentials = None

from dotenv import load_dotenv

load_dotenv()


def _get_sheets_client():
    """Get authenticated Google Sheets client."""
    if not SHEETS_AVAILABLE:
        raise RuntimeError("gspread/google-auth not installed. Run: pip install gspread google-auth")
    
    sa_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")
    if not sa_path or not os.path.exists(sa_path):
        raise RuntimeError(
            "Set GOOGLE_SERVICE_ACCOUNT_FILE env var to your service account JSON file path."
        )
    
    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.readonly"
    ]
    creds = Credentials.from_service_account_file(sa_path, scopes=scope)
    return gspread.authorize(creds)


def _get_worksheet(sheet_id: str, worksheet_title: str = "Sheet1"):
    """Get a worksheet from a Google Sheet."""
    gc = _get_sheets_client()
    sh = gc.open_by_key(sheet_id)
    
    try:
        return sh.worksheet(worksheet_title)
    except gspread.exceptions.WorksheetNotFound:
        raise RuntimeError(f"Worksheet '{worksheet_title}' not found in sheet {sheet_id}")


def read_leads(
    sheet_id: Optional[str] = None,
    worksheet: str = "Sheet1",
    profile_url_column: str = "profile_url"
) -> List[Dict]:
    """
    Read all leads from a Google Sheet.
    
    Args:
        sheet_id: Google Sheet ID (uses GOOGLE_SHEET_ID env var if not provided)
        worksheet: Name of the worksheet to read from
        profile_url_column: Name of the column containing LinkedIn profile URLs
    
    Returns:
        List of dicts, each representing a lead with all columns as keys
    
    Expected columns (flexible):
        - profile_url (required): LinkedIn profile URL
        - name (optional): Lead's name
        - company (optional): Lead's company
        - status (optional): Engagement status (pending/engaged/skipped)
        - last_engaged (optional): Last engagement date
        - pain_points (optional): Discovered pain points
        - notes (optional): Additional notes
    """
    if not sheet_id:
        sheet_id = os.getenv("GOOGLE_SHEET_ID")
    
    if not sheet_id:
        raise ValueError("No sheet_id provided and GOOGLE_SHEET_ID env var not set")
    
    ws = _get_worksheet(sheet_id, worksheet)
    
    # Get all records as dicts (first row is headers)
    records = ws.get_all_records()
    
    # Filter out rows without profile URLs
    leads = []
    for idx, record in enumerate(records):
        # Try different column name variations
        profile_url = (
            record.get(profile_url_column) or
            record.get("profile-url") or
            record.get("Profile URL") or
            record.get("Profile-URL") or
            record.get("LinkedIn") or
            record.get("linkedin_url") or
            record.get("url") or
            record.get("URL") or
            ""
        )
        
        if profile_url and "linkedin.com" in profile_url.lower():
            lead = {
                "row_number": idx + 2,  # +2 because row 1 is headers, 0-indexed
                "profile_url": profile_url,
                "name": record.get("name") or record.get("Name") or record.get("FullName") or record.get("Full Name") or "",
                "company": record.get("company") or record.get("Company") or record.get("CurrentCompany") or record.get("Current Company") or "",
                "status": record.get("status") or record.get("Status") or "",
                "last_engaged": record.get("last_engaged") or record.get("Last Engaged") or "",
                "pain_points": record.get("pain_points") or record.get("Pain Points") or "",
                "notes": record.get("notes") or record.get("Notes") or "",
                "engagement_count": int(record.get("engagement_count") or record.get("Engagement Count") or 0),
                # Store all original data
                "_raw": record
            }
            leads.append(lead)
    
    return leads


def get_unprocessed_leads(
    sheet_id: Optional[str] = None,
    worksheet: str = "Sheet1",
    limit: int = 10,
    days_between_engagements: int = 1
) -> List[Dict]:
    """
    Get leads that haven't been engaged today or need re-engagement.
    
    Args:
        sheet_id: Google Sheet ID
        worksheet: Worksheet name
        limit: Maximum number of leads to return
        days_between_engagements: Minimum days between engagements for same lead
    
    Returns:
        List of leads ready for engagement
    """
    all_leads = read_leads(sheet_id, worksheet)
    today = datetime.now().strftime("%Y-%m-%d")
    
    unprocessed = []
    for lead in all_leads:
        # Skip completed leads (15 engagements = campaign done)
        if lead.get("engagement_count", 0) >= 15:
            continue
        
        # Check if already engaged today
        last_engaged = lead.get("last_engaged", "")
        if last_engaged == today:
            continue
        
        # Check days between engagements
        if last_engaged:
            try:
                last_date = datetime.strptime(last_engaged, "%Y-%m-%d")
                days_since = (datetime.now() - last_date).days
                if days_since < days_between_engagements:
                    continue
            except ValueError:
                pass  # Invalid date format, proceed
        
        unprocessed.append(lead)
        
        if len(unprocessed) >= limit:
            break
    
    return unprocessed


def update_lead_status(
    sheet_id: Optional[str] = None,
    worksheet: str = "Sheet1",
    row_number: int = None,
    status: str = None,
    pain_points: str = None,
    notes: str = None,
    connection_status: str = None,
    increment_engagement: bool = True
) -> bool:
    """
    Update a lead's status and pain points in the Google Sheet.
    
    Args:
        sheet_id: Google Sheet ID
        worksheet: Worksheet name
        row_number: Row number to update (1-indexed)
        status: New status (engaged/skipped/error)
        pain_points: Discovered pain points (appends to existing)
        notes: Additional notes
        increment_engagement: Whether to increment engagement count
    
    Returns:
        True if update successful
    """
    if not sheet_id:
        sheet_id = os.getenv("GOOGLE_SHEET_ID")
    
    if not sheet_id or not row_number:
        return False
    
    ws = _get_worksheet(sheet_id, worksheet)
    
    # Get headers to find column indices
    headers = ws.row_values(1)
    headers_lower = [h.lower().replace(" ", "_") for h in headers]
    
    today = datetime.now().strftime("%Y-%m-%d")
    
    try:
        # Update status column
        if status and "status" in headers_lower:
            col_idx = headers_lower.index("status") + 1
            ws.update_cell(row_number, col_idx, status)
        
        # Update last_engaged column
        if "last_engaged" in headers_lower:
            col_idx = headers_lower.index("last_engaged") + 1
            ws.update_cell(row_number, col_idx, today)
        
        # Update pain_points column (append to existing)
        if pain_points and "pain_points" in headers_lower:
            col_idx = headers_lower.index("pain_points") + 1
            existing = ws.cell(row_number, col_idx).value or ""
            if existing:
                new_value = f"{existing}; {pain_points}"
            else:
                new_value = pain_points
            ws.update_cell(row_number, col_idx, new_value)
        
        # Update notes column
        if notes and "notes" in headers_lower:
            col_idx = headers_lower.index("notes") + 1
            existing = ws.cell(row_number, col_idx).value or ""
            if existing:
                new_value = f"{existing} | {notes}"
            else:
                new_value = notes
            ws.update_cell(row_number, col_idx, new_value)
        
        # Update connection_status column
        if connection_status and "connection_status" in headers_lower:
            col_idx = headers_lower.index("connection_status") + 1
            ws.update_cell(row_number, col_idx, connection_status)
        
        # Increment engagement count
        if increment_engagement and "engagement_count" in headers_lower:
            col_idx = headers_lower.index("engagement_count") + 1
            current = ws.cell(row_number, col_idx).value
            try:
                count = int(current) if current else 0
            except ValueError:
                count = 0
            ws.update_cell(row_number, col_idx, count + 1)
        
        return True
        
    except Exception as e:
        print(f"Error updating sheet: {e}")
        return False


def ensure_columns_exist(
    sheet_id: Optional[str] = None,
    worksheet: str = "Sheet1"
) -> bool:
    """
    Ensure required columns exist in the sheet. Adds missing columns.
    
    Required columns: status, last_engaged, pain_points, engagement_count, notes
    """
    if not sheet_id:
        sheet_id = os.getenv("GOOGLE_SHEET_ID")
    
    ws = _get_worksheet(sheet_id, worksheet)
    headers = ws.row_values(1)
    headers_lower = [h.lower().replace(" ", "_") for h in headers]
    
    required_columns = ["status", "connection_status", "last_engaged", "pain_points", "engagement_count", "notes"]
    
    for col in required_columns:
        if col not in headers_lower:
            # Add column at the end
            next_col = len(headers) + 1
            ws.update_cell(1, next_col, col)
            headers.append(col)
            headers_lower.append(col)
            print(f"Added column: {col}")
    
    return True


def get_campaign_stats(
    sheet_id: Optional[str] = None,
    worksheet: str = "Sheet1"
) -> Dict:
    """
    Get campaign statistics from the sheet.
    
    Returns:
        Dict with stats: total_leads, engaged, pending, pain_points_found, etc.
    """
    leads = read_leads(sheet_id, worksheet)
    
    stats = {
        "total_leads": len(leads),
        "engaged": 0,
        "pending": 0,
        "skipped": 0,
        "completed_campaign": 0,  # 15+ engagements
        "leads_with_pain_points": 0,
        "total_engagements": 0,
        "pain_points_by_category": {}
    }
    
    for lead in leads:
        status = lead.get("status", "pending").lower()
        if status == "engaged":
            stats["engaged"] += 1
        elif status == "skipped":
            stats["skipped"] += 1
        else:
            stats["pending"] += 1
        
        eng_count = lead.get("engagement_count", 0)
        stats["total_engagements"] += eng_count
        
        if eng_count >= 15:
            stats["completed_campaign"] += 1
        
        if lead.get("pain_points"):
            stats["leads_with_pain_points"] += 1
    
    return stats
