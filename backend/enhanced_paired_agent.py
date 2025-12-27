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

import argparse
import os
import random
import time
from datetime import datetime, timedelta
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

from lib.utils import human_sleep, smooth_scroll
from lib.safety import safe_to_like, safe_to_comment
from lib.auth import login
from lib.openai_comments import generate_openai_comment
from state_store import has_processed, mark_processed
from agent_streaming import AgentStreamingRunner

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
    """Like and comment on a single post with OpenAI-generated content."""
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
    if should_comment:
        ai_decision = generate_openai_comment(post_item)
        action = ai_decision.get("action", "SKIP")
        reason = ai_decision.get("reason", "Unknown")
        comment_text = ai_decision.get("comment", "")
        
        if action == "SKIP":
            print(f"  ⊘ AI skipped comment: {reason}")
            return True 
        
        author_name = post_item.get("author", "")
        print(f"  💬 Generated comment for {author_name}:")
        print(f"     \"{comment_text}\"")
        
        if not post_comments:
            print(f"  ℹ  [PREVIEW MODE - Not posting]")
            return True
        
        try:
            # Click comment button
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
            editor.first.fill(comment_text)
            human_sleep(0.8)
            
            # Click post button
            post_clicked = False
            btn_selectors = [
                "button.artdeco-button--primary",
                "button[type='submit']",
                "button:has-text('Post')",
                "button.comments-comment-box__submit-button"
            ]
            
            for selector in btn_selectors:
                try:
                    post_btn = el.locator(selector).first
                    if post_btn.is_visible() and post_btn.is_enabled():
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
                print("  ⚠ Post button not found/clickable, trying keyboard submit...")
                editor.first.press("Control+Enter")
                human_sleep(1.0)
                print("  ✓ Keyboard submit attempted")
            
            # Report Pain Points if found
            if ai_decision.get("pain_points") and hasattr(page, 'streamer') and page.streamer:
                page.streamer.send_action("pain_points", author_name, {"points": ai_decision["pain_points"]})

            human_sleep(2.0)
            
        except Exception as e:
            print(f"  ✗ Could not post comment: {e}")
    
    return True


def run_deep_feed_analysis(page, duration_minutes=30, max_likes=50, post_comments=True, safe_mode=True, streamer=None):
    """Run deep analysis of entire LinkedIn feed for specified duration."""
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
    print(f"Duration: {duration_minutes} min | Max Likes: {max_likes}")
    print(f"Comment Mode: {'POSTING' if post_comments else 'PREVIEW ONLY'}")
    print(f"{'='*70}\n")
    
    if streamer:
        streamer.set_page(page)
        streamer.send_log(f"Started analysis mode (Duration: {duration_minutes}m, Max: {max_likes})")
    
    scroll_count = 0
    
    while datetime.now() < end_time and stats["posts_liked"] < max_likes:
        remaining = (end_time - datetime.now()).total_seconds() / 60
        print(f"\n⏱  Time remaining: {remaining:.1f} minutes")
        
        if streamer: streamer.capture_and_send()
        
        # Find posts
        posts = find_posts_on_page(page)
        print(f"📊 Found {len(posts)} posts on current view")
        
        for post in posts:
            if stats["posts_liked"] >= max_likes:
                break
                
            stats["posts_analyzed"] += 1
            
            if has_processed(post["id"]):
                stats["skipped_duplicate"] += 1
                continue
            
            author_text = post.get("author", "")
            post_text = post.get("text", "")
            
            # Prioritize 1st connections but dont strictly filter if feed is sparse
            is_1st = "1st" in author_text or " 1st" in post_text
            
            print(f"\n{'-'*70}")
            print(f"📝 Post by: {author_text}")
            print(f"   Preview: {post_text[:100]}...")
            
            if streamer: streamer.capture_and_send()
            
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
                if streamer: 
                    streamer.send_action("engaged", author_text, {"type": "like_comment"})
            
            mark_processed(post["id"])
            
            if streamer: streamer.capture_and_send()
            
            wait_time = random.uniform(3, 7)
            print(f"  ⏳ Waiting {wait_time:.1f}s before next post...")
            human_sleep(wait_time)
        
        # Scroll logic
        try:
            if page.is_closed():
                break
            
            scroll_count += 1
            print(f"\n📜 Scrolling to load more posts (scroll #{scroll_count})...")
            
            smooth_scroll(page, random.randint(600, 900))
            if streamer: streamer.capture_and_send()
            
            wait_time = random.uniform(2, 4)
            human_sleep(wait_time)
            
        except Exception as e:
            print(f"❌ Error during scroll: {e}")
            break
    
    return stats


def run_enhanced_paired(duration_minutes=30, max_likes=50, headful=True, post_comments=False, safe_mode=True, stream=False):
    """Run the enhanced paired agent with deep feed analysis."""
    
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("❌ Missing LINKEDIN_EMAIL/LINKEDIN_PASSWORD in .env")
    
    streamer = None
    if stream:
        streamer = AgentStreamingRunner('feedWarmer')
        streamer.connect()
    
    with sync_playwright() as p:
        # Launch headless if stream is enabled (user preference usually, but headless is better for server)
        # Dashboard requests --stream, so usually we go headless unless debugging
        # But user passed headful=True usually. Let's respect args.headful
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            storage_state=storage_state
        )
        page = context.new_page()
        
        if streamer: streamer.set_page(page)
        
        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            print("❌ Login failed")
            browser.close()
            return
        
        print("✅ Logged in successfully")
        human_sleep(3)
        if streamer: streamer.capture_and_send()
        
        run_deep_feed_analysis(
            page=page,
            duration_minutes=duration_minutes,
            max_likes=max_likes,
            post_comments=post_comments,
            safe_mode=safe_mode,
            streamer=streamer
        )
        
        print("🔒 Closing browser...")
        browser.close()
        if streamer: streamer.disconnect()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Enhanced Paired Agent')
    
    parser.add_argument('--duration', type=int, default=30, help='Duration in minutes')
    parser.add_argument('--max', type=int, default=50, help='Max posts to engage with')
    parser.add_argument('--headful', action='store_true', help='Run with visible browser')
    parser.add_argument('--post-comments', action='store_true', help='Actually post comments')
    parser.add_argument('--safe-mode', action='store_true', default=True, help='Strict safety checks')
    parser.add_argument('--stream', action='store_true', help='Enable dashboard streaming')
    
    args = parser.parse_args()
    
    print(f"Starting Feed Warmer (Duration: {args.duration}m, Max: {args.max})")
    
    run_enhanced_paired(
        duration_minutes=args.duration,
        max_likes=args.max,
        headful=args.headful,
        post_comments=args.post_comments,
        safe_mode=args.safe_mode,
        stream=args.stream
    )
