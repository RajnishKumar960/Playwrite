"""LinkedIn Feed Agent - Like and Comment Automation

This agent scrolls the LinkedIn feed, likes posts from 1st-degree connections,
and adds OpenAI-generated comments to each liked post.

Usage:
    python agent.py --max 10 --headful
"""
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import argparse
import os
import random
import time

from lib.auth import login
from lib.safety import safe_to_like
from lib.openai_comments import generate_openai_comment

# Load environment variables
load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")


def human_sleep(seconds):
    """Sleep with slight randomness for human-like behavior."""
    time.sleep(seconds + random.uniform(0, 0.5))


def find_posts(page):
    """Find all visible posts on the current feed page."""
    posts = []
    containers = page.locator("div.feed-shared-update-v2")
    count = containers.count()
    
    for i in range(count):
        try:
            el = containers.nth(i)
            text = el.inner_text()[:400] if el.inner_text() else ""
            
            # Get author name
            author = ""
            author_el = el.locator("span.feed-shared-actor__name")
            if author_el.count() > 0:
                author = author_el.first.inner_text() or ""
            
            posts.append({
                "el": el,
                "text": text,
                "author": author,
                "id": hash(text[:100])
            })
        except Exception:
            continue
    
    return posts


def like_and_comment(page, post):
    """Like a post and add a comment. Returns True if successful."""
    el = post["el"]
    text = post["text"]
    author = post["author"]
    
    # Safety check
    if not safe_to_like(text, author):
        return False
    
    # Find like button - use force to avoid opening post
    like_btn = el.locator("button[aria-label*='Like']").first
    
    # Check if already liked
    try:
        if like_btn.get_attribute("aria-pressed") == "true":
            return False
    except Exception:
        pass
    
    # Click like (force=True prevents navigation)
    try:
        like_btn.click(force=True)
        print(f"✓ Liked post by: {author[:30]}...")
        human_sleep(1)
    except Exception as e:
        print(f"Could not like: {e}")
        return False
    
    # Generate and post comment
    try:
        comment = generate_openai_comment(text, author)
        print(f"  Comment: {comment[:60]}...")
        
        # Click comment button (force=True to stay in feed)
        comment_btn = el.locator("button[aria-label*='Comment']").first
        comment_btn.click(force=True)
        human_sleep(1.5)
        
        # Find editor within the post element first, then page
        editor = el.locator("div[role='textbox']").first
        if not editor.is_visible():
            editor = page.locator("div[role='textbox']").first
        
        editor.click()
        human_sleep(0.3)
        editor.fill(comment)
        human_sleep(0.5)
        
        # Find and click Post button - try multiple methods
        post_btn = None
        
        # Method 1: Button within post element
        try:
            post_btn = el.locator("button.comments-comment-box__submit-button").first
            if not post_btn.is_visible():
                post_btn = None
        except Exception:
            pass
        
        # Method 2: Any visible Post button on page
        if not post_btn:
            try:
                post_btn = page.locator("button.comments-comment-box__submit-button").first
                if not post_btn.is_visible():
                    post_btn = None
            except Exception:
                pass
        
        # Method 3: Button with text "Post"
        if not post_btn:
            try:
                post_btn = page.locator("button:has-text('Post')").first
            except Exception:
                pass
        
        # Click the post button
        if post_btn and post_btn.is_visible():
            post_btn.click(force=True)
            print("  ✓ Comment submitted!")
            human_sleep(2)
        else:
            # Fallback: Ctrl+Enter to submit
            editor.press("Control+Enter")
            print("  ✓ Comment submitted via Ctrl+Enter!")
            human_sleep(1.5)
            
    except Exception as e:
        print(f"  Could not comment: {e}")
    
    return True
    
    return True


def run_agent(max_actions: int, headful: bool):
    """Main agent loop - like and comment on posts."""
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("Missing LINKEDIN_EMAIL/LINKEDIN_PASSWORD in .env")
    
    print(f"\n🚀 LinkedIn Agent - Target: {max_actions} likes with comments\n")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()
        
        # Login
        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            print("❌ Login failed. Please check credentials or complete 2FA manually.")
            if headful:
                input("Press Enter after completing login...")
                try:
                    page.wait_for_url("**/feed/**", timeout=30000)
                except Exception:
                    print("Could not reach feed. Aborting.")
                    browser.close()
                    return
            else:
                browser.close()
                return
        
        print("✓ Logged in successfully!\n")
        human_sleep(2)
        
        # Main loop
        completed = 0
        seen = set()
        scroll_count = 0
        max_scrolls = max_actions * 5
        
        while completed < max_actions and scroll_count < max_scrolls:
            posts = find_posts(page)
            
            for post in posts:
                if completed >= max_actions:
                    break
                    
                if post["id"] in seen:
                    continue
                seen.add(post["id"])
                
                # Only engage with 1st-degree connections
                if "1st" not in post["author"] and "1st" not in post["text"]:
                    continue
                
                # Like and comment
                if like_and_comment(page, post):
                    completed += 1
                    print(f"  [{completed}/{max_actions}] Done\n")
                    human_sleep(3)
            
            # Scroll for more posts
            if completed < max_actions:
                page.evaluate("window.scrollBy(0, window.innerHeight)")
                human_sleep(2)
                scroll_count += 1
        
        print(f"\n✅ Finished! Liked and commented on {completed} posts.\n")
        browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="LinkedIn Feed Agent - Like and Comment")
    parser.add_argument("--max", type=int, default=10, help="Number of posts to like and comment on")
    parser.add_argument("--headful", action="store_true", help="Show browser window")
    
    args = parser.parse_args()
    run_agent(max_actions=args.max, headful=args.headful)
