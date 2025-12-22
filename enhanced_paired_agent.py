"""Enhanced Paired Agent - 30 Minute Deep Feed Analysis

This agent runs for 30 minutes, scrolling through your entire LinkedIn feed,
analyzing every post with OpenAI, and engaging with professional, personalized comments.

Features:
- Runs for 30 minutes minimum
- Scrolls entire feed continuously
- Analyzes every post with OpenAI
- Includes connection's name in all comments
- Professional comments designed to encourage replies
- Safety filters for brand protection
"""

from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import argparse
import os
import random
import time
from datetime import datetime, timedelta
from lib.utils import human_sleep, smooth_scroll
from lib.safety import safe_to_like, safe_to_comment
from lib.auth import login
from lib.openai_comments import generate_openai_comment
from state_store import has_processed, mark_processed

# Load .env
load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")

def find_posts_on_page(page):
    """Return list of post ElementHandles and data snippets."""
    posts = []
    try:
        if page.is_closed():
            print("Warning: Page is closed, returning empty posts")
            return posts
    except Exception:
        return posts
    
    try:
        post_containers = page.locator("div.occludable-update, div.feed-shared-update-v2")
        total = post_containers.count()
    except Exception as e:
        print(f"Warning: Could not find post containers: {e}")
        return posts
    
    for i in range(total):
        try:
            c = post_containers.nth(i)
            snippet = ""
            try:
                snippet = c.inner_text()[:300]
            except Exception:
                snippet = ""
            
            author = ""
            try:
                author_l = c.locator("span.feed-shared-actor__name, a.feed-shared-actor__name-link")
                if author_l.count() > 0:
                    author = author_l.nth(0).inner_text() or ""
            except Exception:
                author = ""
            
            post_id = hash(snippet)
            posts.append({"el": c, "text": snippet, "author": author, "id": post_id})
        except Exception:
            continue
    
    return posts

def process_post(page, post_item, should_comment=True, post_comments=True, safe_mode=True):
    """Like and comment on a single post with OpenAI-generated content.
    
    Args:
        page: Playwright page object
        post_item: Dict with post data
        should_comment: Whether to generate a comment
        post_comments: Whether to actually post (False = preview only)
        safe_mode: Enable stricter safety checks
    
    Returns:
        True if engagement was successful, False otherwise
    """
    el = post_item["el"]
    
    # Safety check for liking
    like_ok, like_reason = safe_to_like(post_item, safe_mode=safe_mode)
    if not like_ok:
        print(f"  ⊘ Skipping: {like_reason}")
        return False
    
    # Find like button
    candidates = el.locator("button[aria-label*='Like']")
    like_btn = None
    if candidates.count() > 0:
        like_btn = candidates.nth(0)
    else:
        like_btn = page.locator("button[aria-label*='Like']").nth(0)
    
    # Check if already liked
    aria = None
    try:
        aria = like_btn.get_attribute("aria-pressed")
    except Exception:
        aria = None
    
    if aria == "true":
        print(f"  ⊘ Already liked")
        return False
    
    # Human-like mouse movement and click
    bb = like_btn.bounding_box()
    if bb:
        cx = bb["x"] + bb["width"] / 2
        cy = bb["y"] + bb["height"] / 2
        page.mouse.move(cx, cy)
        human_sleep(0.25)
    
    try:
        like_btn.click()
        print(f"  ✓ Liked post")
    except Exception as e:
        print(f"  ✗ Failed to like: {e}")
        return False
    
    # ─── COMPULSORY COMMENTING ───
    # For every post we like, we MUST attempt a comment as per user requirement.
    if should_comment:
        # Generate OpenAI comment
        ai_decision = generate_openai_comment(post_item)
        
        action = ai_decision.get("action", "SKIP")
        reason = ai_decision.get("reason", "Unknown")
        comment_text = ai_decision.get("comment", "")
        
        # We only skip if the AI is 100% sure it's sensitive content.
        if action == "SKIP":
            print(f"  ⊘ AI skipped comment: {reason}")
            # Even if AI skips, if it's meant to be compulsory, we might need a neutral fallback
            # but usually SKIP means a safety violation.
            return True 
        
        # Display comment preview or post it
        author_name = post_item.get("author", "")
        print(f"  💬 Generated comment for {author_name}:")
        print(f"     \"{comment_text}\"")
        
        if not post_comments:
            print(f"  ℹ  [PREVIEW MODE - Not posting]")
            return True
        
        # ─── ACTUALLY POST THE COMMENT ───
        try:
            # Click comment button to open editor
            cbtn = el.locator("button[aria-label*='Comment']")
            if cbtn.count() > 0:
                cbtn.nth(0).click()
                human_sleep(0.5)
            
            # Find editor box
            editor = el.locator("div.ql-editor, div[role='textbox']")
            try:
                editor.first.wait_for(state="visible", timeout=5000)
            except Exception:
                editor = page.locator("div.ql-editor, div[role='textbox']")
                if editor.count() > 0:
                    editor = editor.first
                else:
                    print("  ✗ No comment box found")
                    return True
            
            # Type comment
            editor.first.click()
            human_sleep(0.3)
            # Use 'fill' for speed/reliability or 'type' for more human feel. fill is safer for long comments.
            editor.first.fill(comment_text)
            human_sleep(0.8)
            
            # Click post button
            post_clicked = False
            btn_selectors = [
                "button.artdeco-button--primary",
                "button[type='submit']",
                "button:has-text('Post')",
                "button:has-text('Comment')",
                "form button.artdeco-button",
                "button.comments-comment-box__submit-button"
            ]
            
            for selector in btn_selectors:
                try:
                    post_btn = el.locator(selector).first
                    if post_btn.is_visible() and post_btn.is_enabled():
                        # Hover and click for realism
                        bb = post_btn.bounding_box()
                        if bb:
                            page.mouse.move(bb["x"] + bb["width"]/2, bb["y"] + bb["height"]/2)
                            human_sleep(0.2)
                        post_btn.click()
                        post_clicked = True
                        print(f"  ✓ Comment posted successfully!")
                        break
                except Exception:
                    continue
            
            if not post_clicked:
                # Last resort: keyboard submit
                print("  ⚠ Post button not found/clickable, trying keyboard submit...")
                editor.first.press("Control+Enter")
                human_sleep(1.0)
                print("  ✓ Keyboard submit attempted")
            
            human_sleep(2.0)
            
        except Exception as e:
            print(f"  ✗ Could not post comment: {e}")
    
    return True


def run_deep_feed_analysis(page, duration_minutes=30, post_comments=True, safe_mode=True):
    """Run deep analysis of entire LinkedIn feed for specified duration.
    
    Args:
        page: Playwright page object
        duration_minutes: How long to run (default 30 minutes)
        post_comments: Whether to actually post comments (False = preview only)
        safe_mode: Enable stricter safety checks
    
    Returns:
        dict: Statistics about the session
    """
    start_time = datetime.now()
    end_time = start_time + timedelta(minutes=duration_minutes)
    
    stats = {
        "posts_analyzed": 0,
        "posts_liked": 0,
        "comments_generated": 0,
        "comments_posted": 0,
        "skipped_duplicate": 0,
        "skipped_safety": 0,
        "start_time": start_time.strftime("%H:%M:%S"),
        "end_time": end_time.strftime("%H:%M:%S")
    }
    
    print(f"\n{'='*70}")
    print(f"🚀 DEEP FEED ANALYSIS MODE")
    print(f"{'='*70}")
    print(f"Duration: {duration_minutes} minutes")
    print(f"Start: {stats['start_time']}")
    print(f"End: {stats['end_time']}")
    print(f"Comment Mode: {'POSTING' if post_comments else 'PREVIEW ONLY'}")
    print(f"{'='*70}\n")
    
    scroll_count = 0
    
    while datetime.now() < end_time:
        remaining = (end_time - datetime.now()).total_seconds() / 60
        print(f"\n⏱  Time remaining: {remaining:.1f} minutes")
        
        # Find posts on current viewport
        posts = find_posts_on_page(page)
        print(f"📊 Found {len(posts)} posts on current view")
        
        # Process each post
        for post in posts:
            stats["posts_analyzed"] += 1
            
            # Check if already processed
            if has_processed(post["id"]):
                stats["skipped_duplicate"] += 1
                continue
            
            # Check if from 1st-degree connection
            author_text = post.get("author", "")
            post_text = post.get("text", "")
            
            if "1st" not in author_text and " 1st" not in post_text:
                mark_processed(post["id"])
                continue
            
            # Display post info
            print(f"\n{'-'*70}")
            print(f"📝 Post by: {author_text}")
            print(f"   Preview: {post_text[:100]}...")
            
            # Process the post (like + comment)
            result = process_post(
                page=page,
                post_item=post,
                should_comment=True,
                post_comments=post_comments,
                safe_mode=safe_mode
            )
            
            if result:
                stats["posts_liked"] += 1
                stats["comments_generated"] += 1
                if post_comments:
                    stats["comments_posted"] += 1
            
            # Mark as processed
            mark_processed(post["id"])
            
            # Human-like wait between engagements
            wait_time = random.uniform(3, 7)
            print(f"  ⏳ Waiting {wait_time:.1f}s before next post...")
            human_sleep(wait_time)
        
        # Scroll to load more posts
        try:
            if page.is_closed():
                print("❌ Page was closed, ending session")
                break
            
            scroll_count += 1
            print(f"\n📜 Scrolling to load more posts (scroll #{scroll_count})...")
            
            # Random mouse movement for human-like behavior
            x = random.randint(100, 1200)
            y = random.randint(100, 800)
            page.mouse.move(x, y)
            human_sleep(0.5)
            
            # Hover over random profile for human-like behavior
            try:
                profile_el = page.locator("span.feed-shared-actor__name, a.feed-shared-actor__name-link").first
                if profile_el.count() > 0:
                    profile_el.hover()
                    human_sleep(0.3)
            except Exception:
                pass
            
            # Smooth scroll
            scroll_factor = random.uniform(0.8, 1.0)
            scroll_distance = int(page.viewport_size['height'] * scroll_factor)
            smooth_scroll(page, scroll_distance)
            
            # Wait for new content to load
            wait_time = random.uniform(2, 4)
            print(f"  ⏳ Waiting {wait_time:.1f}s for content to load...")
            human_sleep(wait_time)
            
        except Exception as e:
            print(f"❌ Error during scroll: {e}")
            break
    
    # Print final statistics
    print(f"\n{'='*70}")
    print(f"✅ SESSION COMPLETE")
    print(f"{'='*70}")
    print(f"Duration: {duration_minutes} minutes")
    print(f"Posts analyzed: {stats['posts_analyzed']}")
    print(f"Posts liked: {stats['posts_liked']}")
    print(f"Comments generated: {stats['comments_generated']}")
    print(f"Comments posted: {stats['comments_posted']}")
    print(f"Skipped (duplicates): {stats['skipped_duplicate']}")
    print(f"{'='*70}\n")
    
    return stats


def run_enhanced_paired(duration_minutes=30, headful=True, post_comments=False, safe_mode=True):
    """Run the enhanced paired agent with deep feed analysis."""
    
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("❌ Missing LINKEDIN_EMAIL/LINKEDIN_PASSWORD in .env")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        
        # Load storage state if available
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            storage_state=storage_state
        )
        page = context.new_page()
        
        # Login
        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            if headful:
                print("⚠️  Login verification needed. Please complete 2FA/captcha in browser.")
                print("Press Enter once you're on the LinkedIn feed...")
                try:
                    input()
                except Exception:
                    print("❌ No input available; aborting.")
                    browser.close()
                    return
                try:
                    page.wait_for_url("**/feed/**", timeout=20000)
                except Exception:
                    print("❌ Still not on feed - aborting")
                    browser.close()
                    return
            else:
                print("❌ Login failed - check credentials/2FA")
                browser.close()
                return
        
        print("✅ Logged in successfully")
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        
        human_sleep(3)
        
        # Run deep feed analysis
        stats = run_deep_feed_analysis(
            page=page,
            duration_minutes=duration_minutes,
            post_comments=post_comments,
            safe_mode=safe_mode
        )
        
        print("🔒 Closing browser...")
        try:
            browser.close()
        except Exception:
            try:
                context.close()
            except Exception:
                pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Enhanced Paired Agent - 30 Minute Deep Feed Analysis with OpenAI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run for 30 minutes with comment preview only
  python enhanced_paired_agent.py --duration 30 --headful

  # Run for 30 minutes and actually post comments
  python enhanced_paired_agent.py --duration 30 --headful --post-comments

  # Run for 60 minutes with comment posting
  python enhanced_paired_agent.py --duration 60 --headful --post-comments
        """
    )
    
    parser.add_argument('--duration', type=int, default=30, 
                       help='Duration in minutes (default: 30)')
    parser.add_argument('--headful', action='store_true', 
                       help='Run with visible browser (recommended)')
    parser.add_argument('--post-comments', action='store_true', 
                       help='Actually post comments (default: preview only)')
    parser.add_argument('--safe-mode', action='store_true', default=True,
                       help='Enable stricter safety checks (default: True)')
    
    args = parser.parse_args()
    
    print("\n" + "="*70)
    print("ENHANCED PAIRED AGENT - Deep Feed Analysis")
    print("="*70)
    print(f"Duration: {args.duration} minutes")
    print(f"Comment Mode: {'POSTING' if args.post_comments else 'PREVIEW ONLY'}")
    print(f"Browser: {'Visible' if args.headful else 'Headless'}")
    print("="*70 + "\n")
    
    if args.post_comments:
        print("⚠️  WARNING: Comments will be POSTED to LinkedIn!")
        print("Press Ctrl+C within 5 seconds to cancel...")
        try:
            time.sleep(5)
        except KeyboardInterrupt:
            print("\n❌ Cancelled by user")
            exit(0)
    
    run_enhanced_paired(
        duration_minutes=args.duration,
        headful=args.headful,
        post_comments=args.post_comments,
        safe_mode=args.safe_mode
    )
