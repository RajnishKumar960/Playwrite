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
from lib.openai_comments import generate_openai_comment
from state_store import has_processed, mark_processed

load_dotenv()

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
        # Use persistent browser profile (already logged in from Settings)
        user_data_dir = os.path.abspath('browser_profile')
        
        if not os.path.exists(user_data_dir):
            msg = "Error: No browser profile found. Please login via Settings page first."
            stream_log(msg, "error")
            return
        
        # Launch with persistent context
        use_headless = stream or not headful  # Headless when streaming
        
        context = p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=use_headless,
            slow_mo=50,
            args=['--no-sandbox', '--disable-setuid-sandbox'],
            viewport={"width": 1280, "height": 900}
        )
        
        page = context.pages[0] if context.pages else context.new_page()
        
        if stream and _streaming_enabled:
            set_streaming_page(page)
        
        # Go directly to feed (already logged in via persistent profile)
        stream_log("Using saved LinkedIn session. Navigating to feed...", "info")
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
                    
                    # Get Author Name
                    author_el = post.locator(".update-components-actor__name, .feed-shared-actor__name, span.update-components-actor__title").first
                    author_name = author_el.inner_text().split("\n")[0].strip() if author_el.count() > 0 else "there"
                    
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
                    
                    # Check if already liked (Avoid double engagement)
                    like_btn = post.locator("button[aria-label*='Like'], button[aria-label*='like']")
                    already_liked = False
                    if like_btn.count() > 0:
                        if like_btn.first.get_attribute("aria-pressed") == "true":
                            already_liked = True
                            
                    if already_liked:
                        stream_log("Skipping (Already liked)", "info")
                        mark_processed(post_id) # Mark as seen so we don't re-check
                        continue

                    # Like the post
                    if like_btn.count() > 0:
                        btn = like_btn.first
                        if not dry_run:
                            btn.click()
                            liked += 1
                            stream_log(f"Liked {author_name}'s post", "success")
                            mark_processed(post_id)
                            capture_screenshot()
                        else:
                            stream_log(f"[DRY RUN] Would like {author_name}'s post", "info")
                        
                        human_sleep(2, 4)
                    
                    # Comment (first 2 posts always, then 50% chance)
                    should_comment = (commented < 2) or (random.random() < 0.5)
                    
                    if should_comment and not dry_run:
                        # Personalize comment with author name
                        ai_result = generate_openai_comment({"text": post_text, "author": author_name})
                        
                        if ai_result.get("action") == "COMMENT":
                            comment_text = ai_result.get("comment", "")
                            if comment_text:
                                # Click comment button
                                comment_btn = post.locator("button[aria-label*='Comment'], button[aria-label*='comment']")
                                if comment_btn.count() > 0:
                                    comment_btn.first.click()
                                    human_sleep(1, 2)
                                    
                                    # Type comment - Robust Selector Strategy
                                    editor = page.locator("div.ql-editor, div.comments-comment-box__editor, div[contenteditable='true'][role='textbox']").first
                                    if editor.is_visible():
                                        editor.click()
                                        human_sleep(0.5, 1)
                                        editor.fill(comment_text)
                                        human_sleep(1, 2)
                                        
                                        # Click Post Button - Robust Selector Strategy
                                        submit_btn = page.locator("button.comments-comment-box__submit-button--primary, button.artdeco-button--primary").first
                                        
                                        if submit_btn.is_visible() and submit_btn.is_enabled():
                                            submit_btn.click()
                                            commented += 1
                                            stream_log(f"Commented on {author_name}: {comment_text[:30]}...", "success")
                                            capture_screenshot()
                                            human_sleep(3, 5)
                                        else:
                                             stream_log("Could not find/click Submit button", "error")
                                    else:
                                        stream_log("Could not find Comment Editor", "error")
                
                except Exception as e:
                    stream_log(f"Error: {str(e)[:50]}", "error")
                    continue
            
            # Scroll more
            page.evaluate("window.scrollBy(0, 800)")
            human_sleep(2, 4)
        
        # Close context (session is automatically saved in persistent profile)
        context.close()
    
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
