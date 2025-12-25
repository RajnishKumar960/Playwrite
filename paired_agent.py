"""Paired Agent - OpenAI-Powered LinkedIn Engagement
Likes posts and generates AI comments with dashboard streaming support.
"""

from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import argparse
import os
import random
from datetime import datetime, timedelta

from lib.utils import human_sleep
from lib.safety import safe_to_like, safe_to_comment
from lib.auth import login
from lib.openai_comments import generate_openai_comment
from state_store import has_processed, mark_processed

load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")

# Dashboard streaming
_streamer = None
_streaming_enabled = False


def init_streaming(agent_name: str = 'feedWarmer'):
    """Initialize dashboard streaming."""
    global _streamer, _streaming_enabled
    try:
        from agent_streaming import AgentStreamingRunner
        _streamer = AgentStreamingRunner(agent_name)
        if _streamer.connect():
            _streaming_enabled = True
            print(f"✓ Dashboard streaming enabled")
            return True
    except Exception as e:
        print(f"Streaming not available: {e}")
    return False


def stream_log(message: str, log_type: str = 'info'):
    """Send log to dashboard."""
    if _streaming_enabled and _streamer:
        _streamer.send_log(message, log_type)
    print(message)


def set_streaming_page(page):
    """Set page for screenshots."""
    if _streaming_enabled and _streamer:
        _streamer.set_page(page)


def capture_screenshot():
    """Capture screenshot from main thread."""
    if _streaming_enabled and _streamer:
        _streamer.capture_and_send()


def stop_streaming():
    """Stop streaming."""
    global _streamer, _streaming_enabled
    if _streamer:
        _streamer.disconnect()
    _streaming_enabled = False


def run_paired_agent(max_likes=50, headful=True, dry_run=False, duration_minutes=None, stream=False):
    """Run the paired agent for LinkedIn engagement."""
    
    print("\n" + "=" * 50)
    print("   Paired Agent - LinkedIn Engagement")
    print("=" * 50)
    
    if stream:
        if init_streaming('feedWarmer'):
            headful = False
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            storage_state=storage_state
        )
        page = context.new_page()
        
        if stream and _streaming_enabled:
            set_streaming_page(page)
        
        # Login
        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            if headful:
                stream_log("Login requires verification. Complete in browser.", "warning")
                input("Press Enter when ready...")
                try:
                    page.wait_for_url("**/feed/**", timeout=30000)
                except:
                    stream_log("Could not reach feed", "error")
                    browser.close()
                    return
            else:
                stream_log("Login failed", "error")
                browser.close()
                return
        
        stream_log("Logged in successfully", "success")
        capture_screenshot()
        
        # Navigate to feed
        page.goto("https://www.linkedin.com/feed/", timeout=30000)
        human_sleep(2, 3)
        capture_screenshot()
        
        start_time = datetime.now()
        end_time = start_time + timedelta(minutes=duration_minutes) if duration_minutes else None
        
        liked = 0
        commented = 0
        
        while liked < max_likes:
            if end_time and datetime.now() >= end_time:
                stream_log(f"Duration limit reached. Stopping...", "warning")
                break
            
            # Scroll to load posts
            page.evaluate("window.scrollBy(0, 600)")
            human_sleep(1, 2)
            capture_screenshot()
            
            # Find posts
            posts = page.locator("div.feed-shared-update-v2").all()
            
            for post in posts:
                if liked >= max_likes:
                    break
                
                try:
                    # Get post text
                    text_el = post.locator(".feed-shared-update-v2__description, .feed-shared-text")
                    post_text = text_el.first.inner_text() if text_el.count() > 0 else ""
                    
                    if not post_text or len(post_text) < 20:
                        continue
                    
                    # Skip if processed
                    post_id = post_text[:50]
                    if has_processed(post_id):
                        continue
                    
                    # Safety check
                    safe, reason = safe_to_like({"text": post_text})
                    if not safe:
                        stream_log(f"Skipping: {reason}", "warning")
                        continue
                    
                    # Like the post
                    like_btn = post.locator("button[aria-label*='Like'], button[aria-label*='like']")
                    if like_btn.count() > 0:
                        btn = like_btn.first
                        if btn.get_attribute("aria-pressed") != "true":
                            if not dry_run:
                                btn.click()
                                liked += 1
                                stream_log(f"Liked post ({liked}/{max_likes})", "success")
                                mark_processed(post_id)
                                capture_screenshot()
                            else:
                                stream_log(f"[DRY RUN] Would like post", "info")
                            
                            human_sleep(2, 4)
                    
                    # Comment (first 2 posts always, then 50% chance)
                    should_comment = (commented < 2) or (random.random() < 0.5)
                    
                    if should_comment and not dry_run:
                        ai_result = generate_openai_comment({"text": post_text})
                        if ai_result.get("action") == "COMMENT":
                            comment_text = ai_result.get("comment", "")
                            if comment_text:
                                # Click comment button
                                comment_btn = post.locator("button[aria-label*='Comment']")
                                if comment_btn.count() > 0:
                                    comment_btn.first.click()
                                    human_sleep(1, 2)
                                    
                                    # Type comment
                                    editor = page.locator("div.ql-editor, div[contenteditable='true']").first
                                    if editor.is_visible():
                                        editor.fill(comment_text)
                                        human_sleep(0.5, 1)
                                        
                                        # Post
                                        submit_btn = page.locator("button.artdeco-button--primary").first
                                        if submit_btn.is_visible():
                                            submit_btn.click()
                                            commented += 1
                                            stream_log(f"Commented: {comment_text[:30]}...", "success")
                                            capture_screenshot()
                                            human_sleep(2, 4)
                
                except Exception as e:
                    stream_log(f"Error: {str(e)[:50]}", "error")
                    continue
            
            # Scroll more
            page.evaluate("window.scrollBy(0, 800)")
            human_sleep(2, 4)
        
        # Save session
        try:
            context.storage_state(path="auth.json")
        except:
            pass
        
        browser.close()
    
    stop_streaming()
    
    stream_log(f"Done! Liked: {liked}, Commented: {commented}", "success")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Paired Agent - LinkedIn Engagement")
    parser.add_argument("--max", type=int, default=50, help="Maximum likes")
    parser.add_argument("--headful", action="store_true", help="Visible browser")
    parser.add_argument("--dry-run", action="store_true", help="Preview mode")
    parser.add_argument("--duration", type=int, default=None, help="Duration in minutes")
    parser.add_argument("--stream", action="store_true", help="Stream to dashboard")
    
    args = parser.parse_args()
    
    run_paired_agent(
        max_likes=args.max,
        headful=args.headful,
        dry_run=args.dry_run,
        duration_minutes=args.duration,
        stream=args.stream
    )
