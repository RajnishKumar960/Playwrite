"""Lead Engagement Agent - 15 Day LinkedIn Campaign

This agent reads leads from Google Sheets, visits their LinkedIn profiles,
engages with their recent posts (like + AI comments), and tracks pain points
over a 15-day campaign period.

Usage:
    # Run for today's leads (headful for manual 2FA)
    python lead_engagement_agent.py --sheet YOUR_SHEET_ID --headful
    
    # Preview mode (no actual engagement)
    python lead_engagement_agent.py --sheet YOUR_SHEET_ID --dry-run --headful
    
    # Comment preview only
    python lead_engagement_agent.py --sheet YOUR_SHEET_ID --comment-preview --headful
    
    # Process specific number of leads
    python lead_engagement_agent.py --sheet YOUR_SHEET_ID --max 5 --headful
    
    # Generate pain points report
    python lead_engagement_agent.py --sheet YOUR_SHEET_ID --report

Features:
    - Reads leads from Google Sheets
    - Visits each lead's LinkedIn profile
    - Finds and engages with recent posts
    - Uses AI to generate thoughtful comments
    - Filters controversial/sensitive content
    - Extracts pain points from posts
    - Tracks progress in local database
    - Updates Google Sheet with status
    - Rate-limited to avoid detection
"""

from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import argparse
import os
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from lib.utils import human_sleep, smooth_scroll
from lib.safety import safe_to_like, safe_to_comment
from lib.auth import login
from lib.openai_comments import generate_openai_comment
from lib.sheets_reader import (
    read_leads, 
    get_unprocessed_leads, 
    update_lead_status,
    ensure_columns_exist,
    get_campaign_stats
)
from lib.profile_posts import (
    navigate_to_profile,
    get_recent_posts,
    get_profile_name,
    get_connection_degree,
    is_post_recent
)
from lib.pain_point_analyzer import (
    analyze_pain_points,
    format_pain_points_for_sheet,
    summarize_lead_pain_points
)
from lib.lead_store import (
    get_or_create_lead,
    record_engagement,
    get_lead_engagement_history,
    get_lead_pain_points,
    get_leads_for_today,
    get_campaign_progress,
    get_high_opportunity_leads,
    has_processed_lead_today,
    has_engaged_post,
    get_today_engagement_count,
    update_connection_status
)
from lib.connections import send_connection_request
from state_store import has_processed, mark_processed
from agent_streaming import AgentStreamingRunner

# Load environment variables
load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")


def engage_with_post(
    page,
    post: Dict,
    lead_name: str = "",
    dry_run: bool = False,
    comment_preview: bool = False,
    safe_mode: bool = False
) -> Dict:
    """
    Engage with a single post (like + comment).
    
    Args:
        page: Playwright page object
        post: Post dict with text, el, etc.
        lead_name: Name of the lead for personalization
        dry_run: If True, don't perform actual actions
        comment_preview: If True, show comments but don't post
        safe_mode: If True, use stricter safety checks
    
    Returns:
        Dict with engagement results and pain point analysis
    """
    result = {
        "success": False,
        "liked": False,
        "commented": False,
        "comment_text": "",
        "skipped_reason": "",
        "pain_analysis": None
    }
    
    post_text = post.get("text", "")
    post_el = post.get("el")
    post_date = post.get("date", "")
    
    # CRITICAL: Verify post is within 7 days before any engagement
    if not is_post_recent(post_date, max_days=7):
        result["skipped_reason"] = f"Post too old ({post_date})"
        print(f"  ○ Skipping: Post is older than 7 days ({post_date})")
        return result
    
    # Check if we already engaged with this post (no duplicate engagement)
    if has_engaged_post(post_text):
        result["skipped_reason"] = "Already engaged with this post"
        print(f"  ○ Skipping: Already liked/commented on this post")
        return result
    
    # Safety check  
    safe, reason = safe_to_like({"text": post_text, "author": lead_name}, safe_mode=safe_mode)
    if not safe:
        result["skipped_reason"] = reason
        print(f"  ⚠ Skipping post: {reason}")
        return result
    
    # Analyze for pain points (always do this, even in dry run)
    pain_analysis = analyze_pain_points(post_text, lead_name)
    result["pain_analysis"] = pain_analysis
    
    if pain_analysis.get("has_pain_point"):
        pain_points = pain_analysis.get("pain_points", [])
        print(f"  📊 Pain points found: {', '.join(pain_points[:3])}")
        print(f"  📈 Opportunity score: {pain_analysis.get('opportunity_score', 0):.2f}")
    
    if dry_run:
        print(f"  [DRY RUN] Would like and comment on post")
        result["success"] = True
        return result
    
    try:
        # Find and click like button
        if post_el:
            like_btn = post_el.locator("button[aria-label*='Like'], button[aria-label*='like']")
            
            if like_btn.count() > 0:
                btn = like_btn.first
                
                # Check if already liked
                aria_pressed = btn.get_attribute("aria-pressed")
                if aria_pressed != "true":
                    # Human-like mouse movement
                    bb = btn.bounding_box()
                    if bb:
                        page.mouse.move(
                            bb["x"] + bb["width"] / 2 + random.randint(-5, 5),
                            bb["y"] + bb["height"] / 2 + random.randint(-3, 3)
                        )
                        human_sleep(0.2, 0.4)
                    
                    btn.click()
                    result["liked"] = True
                    print(f"  ✓ Liked post")
                    human_sleep(0.5, 1.0)
                else:
                    print(f"  ○ Post already liked")
        
        # Generate and post comment
        ai_decision = generate_openai_comment({"text": post_text, "author": lead_name})
        action = ai_decision.get("action", "SKIP")
        comment_text = ai_decision.get("comment", "")
        
        if action == "SKIP":
            print(f"  ⚠ AI skipped comment: {ai_decision.get('reason', 'Unknown')}")
        elif comment_text:
            result["comment_text"] = comment_text
            
            if comment_preview:
                print(f"  💬 [PREVIEW] {comment_text}")
            else:
                # Post the comment
                if _post_comment(page, post_el, comment_text):
                    result["commented"] = True
                    print(f"  ✓ Commented: {comment_text[:50]}...")
        
        result["success"] = True
        
    except Exception as e:
        print(f"  ✗ Engagement error: {e}")
        result["skipped_reason"] = str(e)
    
    return result


def _post_comment(page, post_el, comment_text: str) -> bool:
    """Post a comment on a post with reliable button clicking."""
    try:
        # Step 1: Click comment button to open comment box
        comment_btn = post_el.locator("button[aria-label*='Comment'], button[aria-label*='comment']")
        if comment_btn.count() > 0:
            comment_btn.first.click()
            human_sleep(1.0, 1.5)
        
        # Step 2: Find and focus comment editor
        editor_selectors = [
            "div.ql-editor[contenteditable='true']",
            "div.comments-comment-box__form div[role='textbox']",
            "div[role='textbox'][contenteditable='true']",
            "div.ql-editor",
            "div[contenteditable='true']",
        ]
        
        editor = None
        for sel in editor_selectors:
            try:
                editor_loc = page.locator(sel)
                if editor_loc.count() > 0 and editor_loc.first.is_visible():
                    editor = editor_loc.first
                    break
            except Exception:
                continue
        
        if not editor:
            print("  ✗ Comment box not found")
            return False
        
        # Step 3: Click editor, clear, and type comment
        editor.click()
        human_sleep(0.3, 0.5)
        editor.fill(comment_text)
        human_sleep(0.8, 1.2)
        
        # Step 4: Find and click the Post/Submit button (CRITICAL)
        post_btn_selectors = [
            # Most specific selectors first
            "button.comments-comment-box__submit-button",
            "form.comments-comment-box__form button.artdeco-button--primary",
            "div.comments-comment-box button.artdeco-button--primary",
            # General selectors
            "button.artdeco-button--primary:visible",
            "button[type='submit']:visible",
            "button:has-text('Post'):visible",
        ]
        
        post_clicked = False
        for sel in post_btn_selectors:
            try:
                btn = page.locator(sel)
                if btn.count() > 0:
                    for i in range(btn.count()):
                        b = btn.nth(i)
                        if b.is_visible() and b.is_enabled():
                            # Move mouse to button for human-like behavior
                            bb = b.bounding_box()
                            if bb:
                                page.mouse.move(bb["x"] + bb["width"]/2, bb["y"] + bb["height"]/2)
                                human_sleep(0.2, 0.3)
                            
                            b.click()
                            post_clicked = True
                            print("  ✓ Clicked Post button")
                            human_sleep(2.0, 3.0)  # Wait for comment to post
                            break
                if post_clicked:
                    break
            except Exception:
                continue
        
        if not post_clicked:
            # Last resort: try keyboard shortcut
            print("  ⚠ Using keyboard shortcut to post")
            editor.press("Control+Enter")
            human_sleep(1.5, 2.0)
        
        return True
        
    except Exception as e:
        print(f"  ✗ Comment posting error: {e}")
        return False


def process_lead(
    page,
    lead: Dict,
    sheet_id: str = None,
    dry_run: bool = False,
    comment_preview: bool = False,
    safe_mode: bool = False,
    max_posts: int = 3,
    streamer: AgentStreamingRunner = None
) -> Dict:
    """
    Process a single lead: visit profile, engage with posts.
    
    Returns:
        Dict with processing results
    """
    result = {
        "success": False,
        "lead_name": lead.get("name", ""),
        "profile_url": lead.get("profile_url", ""),
        "posts_found": 0,
        "posts_engaged": 0,
        "pain_points": [],
        "opportunity_score": 0.0,
        "error": None
    }
    
    profile_url = lead.get("profile_url", "")
    lead_name = lead.get("name", "")
    company = lead.get("company", "")
    row_number = lead.get("row_number")
    
    print(f"\n{'='*60}")
    print(f"Processing: {lead_name or profile_url}")
    print(f"Company: {company}")
    print(f"{'='*60}")
    
    if streamer:
        streamer.send_action("visiting", lead_name or profile_url)
        streamer.send_log(f"Processing lead: {lead_name}")
    
    try:
        # Navigate to profile
        if not navigate_to_profile(page, profile_url):
            result["error"] = "Failed to navigate to profile"
            print(f"  ✗ {result['error']}")
            return result
        
        if streamer: streamer.capture_and_send()
        
        # Get actual name from profile if missing
        if not lead_name:
            lead_name = get_profile_name(page)
            result["lead_name"] = lead_name
            print(f"  Found name: {lead_name}")
        
        human_sleep(1.5, 2.5)
        
        # Get recent posts (within 7 days - skip lead entirely if none)
        posts = get_recent_posts(page, max_posts=max_posts, max_days=7)
        result["posts_found"] = len(posts)
        
        if streamer: streamer.capture_and_send()
        
        if not posts:
            print("  ○ No posts within 7 days - skipping this lead")
            result["success"] = True  # Not an error, just no recent content
            result["error"] = "No recent posts (7 days)"
            return result
        
        print(f"  Found {len(posts)} posts to analyze")
        
        # Get or create lead in database
        lead_id = get_or_create_lead(
            profile_url,
            name=lead_name,
            company=company,
            sheet_row=row_number
        )
        
        # --- NEW: Connection Handling ---
        degree = get_connection_degree(page)
        print(f"  Connection Degree: {degree}")
        
        is_connected = degree == "1st"
        
        # Update connection status in DB and Sheet
        conn_status_val = "accepted" if is_connected else "pending" if "pending" in degree else "not_sent"
        update_connection_status(lead_id, conn_status_val)
        
        if not is_connected and not dry_run:
            # Send connection request if not sent yet
            # Check if we should send (limit connections per day?)
            # For now, let's just send if not 1st
            if degree in ["2nd", "3rd", "unknown"]:
                print(f"  → Sending connection request...")
                req_result = send_connection_request(page, profile_url)
                if req_result["status"] == "pending":
                    update_connection_status(lead_id, "pending")
                    if sheet_id and row_number:
                        update_lead_status(sheet_id, row_number, connection_status="pending")
                    if streamer: streamer.send_action("connected", lead_name)
        elif is_connected:
            update_connection_status(lead_id, "accepted")
            if sheet_id and row_number:
                update_lead_status(sheet_id, row_number, connection_status="accepted")

        # --- NEW: Adaptive Scraping (Deep Analysis) ---
        # If connected, scrape more posts for deep analysis
        scrape_max = 10 if is_connected else max_posts
        if is_connected:
            print(f"  🔍 Lead is connected! Performing deep analysis (max {scrape_max} posts)")
        
        # Get recent posts
        posts = get_recent_posts(page, max_posts=scrape_max, max_days=7 if is_connected else 7)
        result["posts_found"] = len(posts)
        
        if not posts:
            print(f"  ○ No posts within 7 days - {'skipping engagement' if not is_connected else 'performing summary only'}")
            if not is_connected:
                result["success"] = True
                result["error"] = "No recent posts (7 days)"
                return result
        
        print(f"  Found {len(posts)} posts to analyze")
        if streamer: streamer.capture_and_send()
        
        all_pain_points = []
        opportunity_scores = []
        engaged_one_post = False
        
        # RULE: Only engage with 1 post per lead (the first valid recent one)
        # Deep analysis analyzes all, but only engages one.
        for i, post in enumerate(posts):
            # Only engage if we haven't yet and it's a "normal" run
            should_engage = not engaged_one_post 
            
            if i > 0 and not is_connected:
                break # Non-connected: only check first few
            
            print(f"\n  Analyzing post {i+1}/{len(posts)}...")
            if streamer: streamer.capture_and_send()
            
            # If we don't engage, we still analyze for pain points
            if not should_engage or (is_connected and i > 0):
                # Just analyze
                pain_analysis = analyze_pain_points(post.get("text", ""), lead_name)
            else:
                engagement = engage_with_post(
                    page,
                    post,
                    lead_name=lead_name,
                    dry_run=dry_run,
                    comment_preview=comment_preview,
                    safe_mode=safe_mode
                )
                pain_analysis = engagement.get("pain_analysis") or {}
                
                if engagement["success"] and not engagement.get("skipped_reason"):
                    result["posts_engaged"] += 1
                    engaged_one_post = True
                    if not is_connected:
                        print(f"  ✓ Engaged with 1 post - moving to next lead")
                    if streamer: 
                        streamer.send_action("engaged", lead_name, {"type": "like/comment"})
                        streamer.capture_and_send()
                
            # Aggregate pain points from all analyzed posts
            pain_points = pain_analysis.get("pain_points", []) if pain_analysis else []
            opp_score = pain_analysis.get("opportunity_score", 0) if pain_analysis else 0
            
            all_pain_points.extend(pain_points)
            if opp_score > 0:
                opportunity_scores.append(opp_score)
            
            # Record in DB (only if we actually engaged or if it's a deep analysis)
            # Actually, record all analyzed posts in engagements table for history
            if not dry_run:
                action_name = "analyzed"
                comment_val = None
                if should_engage and i == 0:
                    if engagement["success"] and not engagement.get("skipped_reason"):
                        action_name = "engaged"
                        comment_val = engagement.get("comment_text")
                    elif engagement.get("skipped_reason"):
                        action_name = "skipped"
                
                record_engagement(
                    lead_id=lead_id,
                    post_url=post.get("post_url"),
                    post_text=post.get("text"),
                    action=action_name,
                    comment_text=comment_val,
                    pain_points=pain_points,
                    opportunity_score=opp_score,
                    category=pain_analysis.get("category")
                )
            
            # Delay between analysis
            if is_connected and i < len(posts) - 1:
                human_sleep(0.5, 1.2)
        
        # Compile results
        result["pain_points"] = list(set(all_pain_points))
        result["opportunity_score"] = (
            sum(opportunity_scores) / len(opportunity_scores)
            if opportunity_scores else 0
        )
        result["success"] = True
        
        # Update Google Sheet
        if sheet_id and row_number and not dry_run:
            pain_points_str = "; ".join(result["pain_points"][:10]) # More for deep analysis
            update_lead_status(
                sheet_id=sheet_id,
                row_number=row_number,
                status="engaged",
                pain_points=pain_points_str,
                notes=f"Score: {result['opportunity_score']:.2f} | Degree: {degree}",
                increment_engagement=True
            )
        
        print(f"\n  ✓ Lead processed: {result['posts_engaged']} posts engaged, {len(posts)} analyzed")
        if result["pain_points"]:
            print(f"  📊 Total Pain points discovered: {', '.join(result['pain_points'][:5])}")
        
    except Exception as e:
        result["error"] = str(e)
        print(f"  ✗ Error processing lead: {e}")
    
    return result


def run_lead_campaign(
    sheet_id: str = None,
    max_leads: int = 10,
    max_posts_per_lead: int = 3,
    headful: bool = True,
    dry_run: bool = False,
    comment_preview: bool = False,
    safe_mode: bool = False,
    duration_minutes: int = None,
    stream: bool = False
) -> Dict:
    """
    Main function to run the lead engagement campaign.
    """
    if not sheet_id:
        sheet_id = os.getenv("GOOGLE_SHEET_ID")
    
    if not sheet_id:
        raise SystemExit("No sheet_id provided. Set GOOGLE_SHEET_ID env var or pass --sheet")
    
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("Missing LINKEDIN_EMAIL/LINKEDIN_PASSWORD in .env")
    
    streamer = None
    if stream:
        streamer = AgentStreamingRunner("leadCampaign")
        streamer.connect()
        streamer.send_log(f"Starting Lead Campaign (Max leads: {max_leads})")

    print("\n" + "="*60)
    print("   Lead Engagement Agent - 15 Day Campaign")
    print("="*60)
    print(f"  Sheet ID: {sheet_id}")
    print(f"  Max leads: {max_leads}")
    print(f"  Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print(f"  Comments: {'Preview' if comment_preview else 'Post'}")
    if duration_minutes:
        print(f"  Duration: {duration_minutes}m")
    print("="*60 + "\n")
    
    # STRICT: Check daily limit (10 leads per day max)
    DAILY_LIMIT = 10
    today_count = get_today_engagement_count()
    if today_count >= DAILY_LIMIT:
        print(f"⚠ Daily limit reached: {today_count}/{DAILY_LIMIT} leads engaged today.")
        print("Please run again tomorrow.")
        if streamer:
            streamer.send_log(f"Daily limit reached ({today_count}/{DAILY_LIMIT})", "warning")
            streamer.disconnect()
        return {"leads_processed": 0, "success": True, "message": "Daily limit reached"}
    
    remaining_today = DAILY_LIMIT - today_count
    if max_leads > remaining_today:
        print(f"ℹ Adjusting max leads: {remaining_today} remaining today (limit: {DAILY_LIMIT})")
        max_leads = remaining_today
    
    # Ensure sheet has required columns
    try:
        ensure_columns_exist(sheet_id)
    except Exception as e:
        print(f"Warning: Could not verify sheet columns: {e}")
    
    # Get leads to process
    leads = get_unprocessed_leads(sheet_id, limit=max_leads)
    
    if not leads:
        print("No unprocessed leads found for today.")
        if streamer:
            streamer.send_log("No leads found", "info")
            streamer.disconnect()
        return {"leads_processed": 0, "success": True}
    
    print(f"Found {len(leads)} leads to process\n")
    if streamer: streamer.send_log(f"Processing {len(leads)} leads")
    
    results = {
        "leads_processed": 0,
        "leads_successful": 0,
        "total_posts_engaged": 0,
        "total_pain_points": [],
        "errors": [],
        "success": True
    }
    
    # Launch browser
    with sync_playwright() as p:
        # When streaming to dashboard, run headless so activity only shows in the dashboard
        # When not streaming, respect the headful parameter
        use_headless = stream or not headful  # Force headless when streaming
        
        browser = p.chromium.launch(headless=use_headless, slow_mo=50)
        
        # Try to load existing session
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            storage_state=storage_state
        )
        page = context.new_page()
        
        if streamer: streamer.set_page(page)

        # Login
        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            if headful:
                print("\nLogin requires manual verification. Complete 2FA/captcha in the browser.")
                print("Press Enter when ready...")
                try:
                    input()
                except Exception:
                    pass
                
                try:
                    page.wait_for_url("**/feed/**", timeout=30000)
                except Exception:
                    print("Could not reach feed. Aborting.")
                    browser.close()
                    if streamer: streamer.disconnect()
                    return {"leads_processed": 0, "success": False, "error": "Login failed"}
            else:
                print("Login failed. Run with --headful to handle verification.")
                browser.close()
                if streamer: streamer.disconnect()
                return {"leads_processed": 0, "success": False, "error": "Login failed"}
        
        print("\n✓ Logged in successfully\n")
        if streamer: streamer.capture_and_send()
        human_sleep(2, 3)
        
        # Set up duration tracking
        start_time = datetime.now()
        end_time = start_time + timedelta(minutes=duration_minutes) if duration_minutes else None
        
        # Process each lead
        for i, lead in enumerate(leads):
            # Check duration limit
            if end_time and datetime.now() >= end_time:
                print(f"\n⏱ Duration limit ({duration_minutes} min) reached. Stopping...")
                if streamer: streamer.send_log("Duration limit reached")
                break
            
            print(f"\n[{i+1}/{len(leads)}] ", end="")
            
            lead_result = process_lead(
                page,
                lead,
                sheet_id=sheet_id,
                dry_run=dry_run,
                comment_preview=comment_preview,
                safe_mode=safe_mode,
                max_posts=max_posts_per_lead,
                streamer=streamer
            )
            
            results["leads_processed"] += 1
            
            if lead_result["success"]:
                results["leads_successful"] += 1
                results["total_posts_engaged"] += lead_result["posts_engaged"]
                results["total_pain_points"].extend(lead_result["pain_points"])
            else:
                results["errors"].append({
                    "lead": lead.get("name") or lead.get("profile_url"),
                    "error": lead_result.get("error")
                })
            
            if streamer: streamer.capture_and_send()

            # Wait between leads
            if i < len(leads) - 1:
                wait_time = random.uniform(8, 15)
                print(f"\n⏳ Waiting {wait_time:.0f}s before next lead...")
                human_sleep(wait_time)
        
        # Close browser
        try:
            # Save session for next time
            context.storage_state(path="auth.json")
            browser.close()
        except Exception:
            pass
        
        if streamer: streamer.disconnect()
    
    # Print summary
    print("\n" + "="*60)
    print("   Campaign Run Summary")
    print("="*60)
    print(f"  Leads processed: {results['leads_processed']}")
    print(f"  Leads successful: {results['leads_successful']}")
    print(f"  Total posts engaged: {results['total_posts_engaged']}")
    print(f"  Unique pain points: {len(set(results['total_pain_points']))}")
    
    if results["errors"]:
        print(f"\n  Errors ({len(results['errors'])}):")
        for err in results["errors"][:5]:
            print(f"    - {err['lead']}: {err['error']}")
    
    print("="*60 + "\n")
    
    return results


def generate_report(sheet_id: str = None) -> str:
    """Generate a pain points report for the campaign."""
    if not sheet_id:
        sheet_id = os.getenv("GOOGLE_SHEET_ID")
    
    progress = get_campaign_progress()
    high_opp = get_high_opportunity_leads(min_score=0.5, limit=10)
    
    report = []
    report.append("=" * 60)
    report.append("   Lead Engagement Campaign - Pain Points Report")
    report.append(f"   Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    report.append("=" * 60)
    
    report.append("\n📊 CAMPAIGN PROGRESS")
    report.append("-" * 40)
    report.append(f"  Total Leads: {progress['total_leads']}")
    report.append(f"  Engaged: {progress['engaged_leads']}")
    report.append(f"  Completed (15 days): {progress['completed_campaigns']}")
    report.append(f"  Total Engagements: {progress['total_engagements']}")
    report.append(f"  Progress: {progress['progress_pct']}%")
    
    report.append("\n📌 TOP PAIN POINTS DISCOVERED")
    report.append("-" * 40)
    for pp in progress.get("top_pain_points", [])[:10]:
        report.append(f"  • {pp['pain_point']} (mentioned {pp['count']}x)")
    
    report.append("\n📁 PAIN POINT CATEGORIES")
    report.append("-" * 40)
    for cat in progress.get("categories", [])[:8]:
        report.append(f"  • {cat['category']}: {cat['count']} instances")
    
    report.append("\n🎯 HIGH OPPORTUNITY LEADS")
    report.append("-" * 40)
    if high_opp:
        for lead in high_opp:
            report.append(f"  ★ {lead.get('name', 'Unknown')} ({lead.get('company', 'N/A')})")
            report.append(f"    Score: {lead.get('avg_score', 0):.2f} | Pain: {lead.get('pain_points', 'N/A')[:50]}")
    else:
        report.append("  No high-opportunity leads identified yet.")
    
    report.append("\n" + "=" * 60)
    
    report_text = "\n".join(report)
    print(report_text)
    
    # Also save to file
    report_file = f"pain_points_report_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
    with open(report_file, "w") as f:
        f.write(report_text)
    print(f"\nReport saved to: {report_file}")
    
    return report_text


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Lead Engagement Agent - 15 Day LinkedIn Campaign"
    )
    parser.add_argument(
        "--sheet", 
        type=str, 
        help="Google Sheet ID with leads"
    )
    parser.add_argument(
        "--max", 
        type=int, 
        default=10, 
        help="Maximum leads to process (default: 10)"
    )
    parser.add_argument(
        "--posts", 
        type=int, 
        default=3, 
        help="Max posts per lead to engage (default: 3)"
    )
    parser.add_argument(
        "--headful", 
        action="store_true", 
        help="Run with visible browser (recommended)"
    )
    parser.add_argument(
        "--dry-run", 
        action="store_true", 
        help="Preview mode - no actual engagements"
    )
    parser.add_argument(
        "--comment-preview", 
        action="store_true", 
        help="Preview comments without posting"
    )
    parser.add_argument(
        "--safe-mode", 
        action="store_true", 
        help="Use stricter content filtering"
    )
    parser.add_argument(
        "--report", 
        action="store_true", 
        help="Generate pain points report only"
    )
    parser.add_argument(
        "--duration", 
        type=int, 
        help="Maximum duration in minutes"
    )
    parser.add_argument(
        "--stream",
        action="store_true",
        help="Enable streaming to dashboard"
    )

    args = parser.parse_args()

    if args.report:
        generate_report(args.sheet)
    else:
        run_lead_campaign(
            sheet_id=args.sheet,
            max_leads=args.max,
            max_posts_per_lead=args.posts,
            headful=args.headful,
            dry_run=args.dry_run,
            comment_preview=args.comment_preview,
            safe_mode=args.safe_mode,
            duration_minutes=args.duration,
            stream=args.stream
        )
