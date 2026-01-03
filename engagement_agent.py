"""
LinkedIn Engagement Agent
=========================
A robust agent to automatically scan your LinkedIn feed, like posts, and leave intelligent comments.
This agent fixes previous state management bugs and provides a reliable way to engage.
"""

from playwright.sync_api import sync_playwright
import argparse
import os
import random
import time
from lib.utils import human_sleep, smooth_scroll
from lib.safety import safe_to_like, safe_to_comment
try:
    from lib.openai_comments import generate_openai_comment
    HAS_OPENAI = True
except:
    HAS_OPENAI = False
    def generate_openai_comment(post): 
        return {"action": "SKIP", "reason": "OpenAI not available"}
from state_store import is_processed, mark_processed
from agent_streaming import AgentStreamingRunner
import asyncio


def find_posts_on_page(page):
    """Scan the current page for LinkedIn posts."""
    posts = []
    if page.is_closed():
        return posts
        
    try:
        # Common containers for LinkedIn feed updates
        post_containers = page.locator("div.occludable-update, div.feed-shared-update-v2")
        count = post_containers.count()
        
        for i in range(count):
            try:
                c = post_containers.nth(i)
                if not c.is_visible():
                    continue
                    
                snippet = c.inner_text()[:300]
                
                # Extract author
                author = ""
                try:
                    # Try multiple selectors for author name
                    author_el = c.locator("span.feed-shared-actor__name, a.feed-shared-actor__name-link").first
                    if author_el.count() > 0:
                        author = author_el.inner_text()
                except Exception:
                    pass
                
                # Generate a stable ID based on snippet
                # (In a real robust system, we'd use the uniform resource name logic, but this hash is okay for now)
                post_id = hash(snippet)
                
                posts.append({
                    "el": c,
                    "text": snippet,
                    "author": author,
                    "id": post_id
                })
            except Exception:
                continue
    except Exception as e:
        print(f"Error scanning posts: {e}")
        
    return posts

def engage_with_post(page, post_item, should_comment=False, dry_run=False, safe_mode=False, streamer=None):
    """Like and optionally comment on a post."""
    el = post_item["el"]
    post_text = post_item["text"]
    
    msg = f"Analyzing post by {post_item['author']}..."
    print(f"\n{msg}")
    if streamer: streamer.send_log(msg)
    
    # 1. Check Safety for Liking
    safe_like, reason = safe_to_like(post_item, safe_mode=safe_mode)
    if not safe_like:
        msg = f"  [SKIP] Unsafe to like: {reason}"
        print(msg)
        if streamer: streamer.send_log(msg, "warning")
        return False

    # 2. Check if already liked
    try:
        like_btn = el.locator("button[aria-label*='Like']").first
        if not like_btn.is_visible():
            # Fallback for different DOM structures
            like_btn = el.locator("button.react-button__trigger").first
        
        if not like_btn.count():
            print("  [SKIP] Like button not found")
            return False
            
        aria_pressed = like_btn.get_attribute("aria-pressed")
        if aria_pressed == "true":
            print("  [SKIP] Already liked")
            return False
            
    except Exception as e:
        print(f"  [SKIP] Error checking like status: {e}")
        return False

    # 3. Perform Like
    if dry_run:
        msg = "  [DRY-RUN] Would have liked this post"
        print(msg)
        if streamer: streamer.send_log(msg)
    else:
        try:
            # Human-like movement
            bb = like_btn.bounding_box()
            if bb:
                page.mouse.move(bb["x"] + bb["width"]/2, bb["y"] + bb["height"]/2)
                human_sleep(0.3)
            like_btn.click()
            msg = "  [ACTION] Liked post"
            print(msg)
            if streamer: streamer.send_log(msg, "success")
            if streamer: streamer.capture_and_send()
        except Exception as e:
            msg = f"  [ERROR] Failed to like: {e}"
            print(msg)
            if streamer: streamer.send_log(msg, "error")
            return False

    # 4. Handle Commenting
    if should_comment:
        # Generate comment using new strict JSON-based logic
        ai_decision = generate_openai_comment(post_item)
        
        action = ai_decision.get("action", "SKIP")
        reason = ai_decision.get("reason", "Unknown")
        comment_text = ai_decision.get("comment", "")
        
        if action == "SKIP":
            msg = f"  [AI-SKIP] Reason: {reason}"
            print(msg)
            if streamer: streamer.send_log(msg, "info")
            return True # We still liked it
            
        print(f"  [PLAN] Comment: \"{comment_text}\"")
        if streamer: streamer.send_log(f"Planning comment: {comment_text}")
        
        if dry_run:
            print("  [DRY-RUN] Would have commented")
        else:
            try:
                # Open comment box
                comment_btn = el.locator("button[aria-label*='Comment'], button.comment-button").first
                if comment_btn.is_visible():
                    comment_btn.click()
                    human_sleep(0.5)
                
                # Find editor
                editor = el.locator("div.ql-editor, div[role='textbox']").first
                if not editor.is_visible():
                    print("  [ERROR] Comment box not found/visible")
                    return True
                
                editor.click()
                human_sleep(0.5)
                editor.fill(comment_text)
                human_sleep(1.0)
                if streamer: streamer.capture_and_send()
                
                # Submit
                # Try specific post buttons first
                submit_btn = el.locator("button.comments-comment-box__submit-button--enabled, button.artdeco-button--primary").first
                if submit_btn.is_visible():
                    submit_btn.click()
                else:
                    # Fallback or Ctrl+Enter
                    editor.press("Control+Enter")
                
                msg = "  [ACTION] Comment posted"
                print(msg)
                if streamer: streamer.send_log(msg, "success")
                human_sleep(2.0)
                if streamer: streamer.capture_and_send()
                
            except Exception as e:
                msg = f"  [ERROR] Failed to comment: {e}"
                print(msg)
                if streamer: streamer.send_log(msg, "error")

    return True

def run_engagement_loop(max_likes=10, headful=True, dry_run=False, safe_mode=False, stream=False):
    streamer = None
    if stream:
        streamer = AgentStreamingRunner("feedWarmer")  # Changed from "engagementAgent" to match dashboard
        if streamer.connect():
            streamer.send_log("Starting Engagement Agent...", "info")
        else:
            print("Warning: Failed to connect to dashboard stream")
            streamer = None

    with sync_playwright() as p:
        # Use persistent browser profile (already logged in from Settings)
        user_data_dir = os.path.abspath('browser_profile')
        
        if not os.path.exists(user_data_dir):
            msg = "Error: No browser profile found. Please login via Settings page first."
            print(msg)
            if streamer:
                streamer.send_log(msg, "error")
                streamer.disconnect()
            return
        
        # Launch with persistent context
        # When streaming to dashboard, run headless so activity only shows in the dashboard
        # When not streaming, show visible browser window
        use_headless = stream  # Headless when streaming to dashboard
        
        context = p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=use_headless,  # Headless when streaming, visible otherwise
            slow_mo=50,
            args=['--no-sandbox', '--disable-setuid-sandbox'],
            viewport={"width": 1280, "height": 900}
        )
        
        page = context.pages[0] if context.pages else context.new_page()
        
        if streamer:
            streamer.set_page(page)

        # Go directly to feed (already logged in via persistent profile)
        msg = "Using saved LinkedIn session. Navigating to feed..."
        print(msg)
        if streamer: streamer.send_log(msg)
        
        page.goto("https://www.linkedin.com/feed/")
        human_sleep(3)
        if streamer: streamer.capture_and_send()
        
        # Check if actually logged in (with retry)
        max_retries = 3
        for retry in range(max_retries):
            current_url = page.url
            
            if "/login" not in current_url and "/checkpoint" not in current_url:
                # Successfully on feed
                break
            
            if retry < max_retries - 1:
                msg = f"Detected login/checkpoint URL (attempt {retry + 1}/{max_retries}), retrying..."
                print(msg)
                if streamer: streamer.send_log(msg, "warning")
                human_sleep(3)
                page.goto("https://www.linkedin.com/feed/", wait_until='networkidle')
                human_sleep(2)
            else:
                # Final attempt failed
                msg = "Error: Not logged in after retries. Session may have expired. Please login via Settings page."
                print(msg)
                if streamer:
                    streamer.send_log(msg, "error")
                    streamer.disconnect()
                context.close()
                return
        
        likes_performed = 0
        scrolls = 0
        
        consecutive_no_posts = 0
        
        while likes_performed < max_likes:
            # Scroll down periodically to load more
            if scrolls > 0:
                print("Scrolling down (25%)...")
                smooth_scroll(page, 250)
                human_sleep(2.0)
                if streamer: streamer.capture_and_send()
            
            posts = find_posts_on_page(page)
            if scrolls % 5 == 0:
                print(f"Found {len(posts)} potential posts on current view.")
            
            new_posts_found_in_loop = False
            
            for post in posts:
                if likes_performed >= max_likes:
                    break
                
                # STATE CHECK
                if is_processed(post["id"]):
                    continue
                
                new_posts_found_in_loop = True
                consecutive_no_posts = 0 # Reset end-of-feed counter
                
                should_comment = True 
                
                # Add random delay before engaging
                human_sleep(random.uniform(1.0, 3.0))
                
                success = engage_with_post(page, post, should_comment, dry_run, safe_mode, streamer)
                
                mark_processed(post["id"])
                
                if success:
                    likes_performed += 1
                    
                    # Batch Logic: "Two seconds of pose will be there after 10 likings"
                    if likes_performed % 10 == 0:
                        msg = f"Batch of 10 reached ({likes_performed} total). Pausing for 2 seconds..."
                        print(msg)
                        if streamer: streamer.send_log(msg)
                        human_sleep(2.0)
                    else:
                        # Regular delay
                        sleep_time = random.uniform(5, 15)
                        msg = f"Waiting {sleep_time:.1f}s..."
                        print(msg)
                        human_sleep(sleep_time)
                else:
                    human_sleep(random.uniform(1, 3))

            if not new_posts_found_in_loop:
                consecutive_no_posts += 1
                msg = f"No new posts (attempt {consecutive_no_posts}/5)..."
                print(msg)
                if streamer: streamer.send_log(msg)
                smooth_scroll(page, 250)
                human_sleep(2)
                if streamer: streamer.capture_and_send()
                
                if consecutive_no_posts >= 5:
                    msg = "End of feed reached. Reloading page..."
                    print(msg)
                    if streamer: streamer.send_log(msg)
                    page.reload()
                    human_sleep(5)
                    consecutive_no_posts = 0
                    scrolls = 0
                    print("Page reloaded. Resuming...")
                    continue
            
            scrolls += 1
            
        msg = f"Engagement session finished. Total likes: {likes_performed}"
        print(msg)
        if streamer: streamer.send_log(msg, "success")
        if streamer: streamer.disconnect()
        context.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max", type=int, default=10, help="Max likes to perform")
    parser.add_argument("--headless", action="store_true", help="Run headless")
    parser.add_argument("--dry-run", action="store_true", help="Don't actually like/comment")
    parser.add_argument("--safe-mode", action="store_true", help="Stricter safety checks")
    parser.add_argument("--stream", action="store_true", help="Enable streaming to dashboard")
    
    args = parser.parse_args()
    
    run_engagement_loop(
        max_likes=args.max,
        headful=not args.headless,
        dry_run=args.dry_run,
        safe_mode=args.safe_mode,
        stream=args.stream
    )
