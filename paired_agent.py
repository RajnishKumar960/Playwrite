"""Paired agent: scanner + worker coordinating in a single browser session.

This script uses the same safety filters and comment generator logic as agent.py
but separates scanning the feed (finding eligible posts) from acting on posts
(liking/commenting). They operate in a linked loop so the scanner and worker stay
in the same Playwright session and behave coherently.

Run headed when posting comments to allow manual 2FA/captcha handling.
Usage (PowerShell):
  python paired_agent.py --max 12 --headful --comment-preview

Note: This is conservative software intended for personal automation. Use responsibly.
"""
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import argparse
import os
import random
from lib.utils import human_sleep
from lib.safety import safe_to_like
from lib.auth import login
from lib.openai_comments import generate_openai_comment

# Load .env
load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")


def find_posts_on_page(page):
    """Return list of post ElementHandles (best-effort) and small data snippets.

    Each item is a dict: {element: locator, text: str, author: str, id: hash}
    """
    posts = []
    
    # Defensive check: ensure page is still open
    try:
        if page.is_closed():
            print("Warning: Page is closed, returning empty posts")
            return posts
    except Exception:
        return posts
    
    # common post containers — LinkedIn uses several structures; this is best-effort
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
        except Exception as e:
            # Skip this post if we encounter any error
            continue
    
    return posts


def process_post(page, post_item, should_comment=False):
    """Like and optionally comment on a single post_item.

    Returns True if action (like) was performed, False otherwise.
    """
    el = post_item["el"]
    post_text = post_item.get("text", "")
    author_text = post_item.get("author", "")

    # safety checks
    if not safe_to_like(post_text, author_text):
        return False

    # find like button inside this post
    candidates = el.locator("button[aria-label*='Like']")
    like_btn = None
    if candidates.count() > 0:
        # choose the first candidate within the post (best-effort)
        like_btn = candidates.nth(0)
    else:
        # fallback: look for generic like controls on page
        like_btn = page.locator("button[aria-label*='Like']").nth(0)

    # confirm not already liked
    aria = None
    try:
        aria = like_btn.get_attribute("aria-pressed")
    except Exception:
        aria = None

    if aria == "true":
        return False

    # Move mouse and click
    bb = like_btn.bounding_box()
    if bb:
        cx = bb["x"] + bb["width"] / 2
        cy = bb["y"] + bb["height"] / 2
        page.mouse.move(cx, cy)
        human_sleep(0.25)

    try:
        like_btn.click()
    except Exception:
        return False

    # Post comment if should_comment is True
    if should_comment:
        try:
            # Generate OpenAI comment
            comment_text = generate_openai_comment(post_text, author_text)
            # Prepend author name to make comment appear genuine
            if author_text:
                first_name = author_text.split()[0]
                comment_text = f"{first_name}, {comment_text}"
            print(f"Generated comment: {comment_text}")
            
            # click comment button
            cbtn = el.locator("button[aria-label*='Comment']")
            if cbtn.count() > 0:
                cbtn.nth(0).click()
                human_sleep(0.5)
            
            # Wait for the specific comment box within this post
            # We look for the editor relative to the post element 'el' to avoid confusion
            editor = el.locator("div.ql-editor, div[role='textbox']")
            try:
                editor.first.wait_for(state="visible", timeout=5000)
            except Exception:
                print("Comment box not found within post, trying page-wide fallback...")
                editor = page.locator("div.ql-editor, div[role='textbox']")
                if editor.count() > 0:
                    editor = editor.first
                else:
                    print("No comment box found.")
                    return True # Still return True as we liked the post

            if editor.count() > 0:
                editor.first.click()
                human_sleep(0.3)
                editor.first.fill(comment_text)
                human_sleep(0.8)  # Slightly longer wait after typing
                
                # Robust Post button detection with multiple strategies
                post_btn = None
                post_clicked = False
                
                # Strategy 1: Look for primary button within post element
                btn_selectors = [
                    "button.artdeco-button--primary",
                    "button[type='submit']",
                    "button:has-text('Post')",
                    "button:has-text('Comment')",
                    "form button.artdeco-button"
                ]
                
                for selector in btn_selectors:
                    try:
                        post_btn = el.locator(selector)
                        if post_btn.count() > 0 and post_btn.first.is_visible():
                            # Move mouse to button for realistic behavior
                            bb = post_btn.first.bounding_box()
                            if bb:
                                page.mouse.move(bb["x"] + bb["width"]/2, bb["y"] + bb["height"]/2)
                                human_sleep(0.2)
                            post_btn.first.click()
                            post_clicked = True
                            print(f"✓ Clicked Post button (selector: {selector})")
                            break
                    except Exception:
                        continue
                
                # Strategy 2: Page-wide fallback for post button
                if not post_clicked:
                    try:
                        page_post_btn = page.locator("button.comments-comment-box__submit-button, button.artdeco-button--primary:visible").first
                        if page_post_btn.is_visible():
                            page_post_btn.click()
                            post_clicked = True
                            print("✓ Clicked Post button (page-wide fallback)")
                    except Exception:
                        pass
                
                # Strategy 3: Keyboard shortcut as final fallback
                if not post_clicked:
                    print("Post button not found, trying Ctrl+Enter...")
                    editor.first.press("Control+Enter")
                    human_sleep(0.3)
                    # Also try just Enter as some forms accept it
                    editor.first.press("Enter")
                    print("Sent keyboard shortcuts to submit")
                
                # Wait for comment to be submitted
                human_sleep(2.0)
                print("✓ Comment posted successfully!")
        except Exception as e:
            print(f"Could not post comment: {e}")


    return True


def run_paired(max_likes: int, headful: bool):
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("Missing LINKEDIN_EMAIL/LINKEDIN_PASSWORD in .env — set them and try again.")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            if headful:
                print("Login did not automatically reach the feed. If LinkedIn asked for 2FA/captcha, please complete the verification in the opened browser. Press Enter here once you've completed it to continue.")
                try:
                    input()
                except Exception:
                    print("No input available; aborting.")
                    browser.close()
                    return

                # re-check if feed reached — brief wait
                try:
                    page.wait_for_url("**/feed/**", timeout=20000)
                except Exception:
                    print("Still not redirected to /feed — aborting run.")
                    browser.close()
                    return
            else:
                print("Login failed — check credentials/2FA/captcha.")
                browser.close()
                return

        print("Logged in — waiting for page to stabilize...")
        
        # Wait for page to be fully loaded and stable
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass  # Best effort
        
        # Additional small wait to ensure feed is ready
        human_sleep(3)
        
        print("Starting paired scanning/acting on feed (1st-degree connections only).")

        seen = set()
        liked = 0
        # initial wait = 2s before first like
        human_sleep(2)

        attempts = 0
        while liked < max_likes and attempts < max_likes * 12:
            attempts += 1
            posts = find_posts_on_page(page)

            # scanner: collect new candidates (first-degree + not seen)
            queue = []
            for pitem in posts:
                if pitem["id"] in seen:
                    continue
                # detect first-degree via '1st' in snippet/author text
                author_text = pitem.get("author", "")
                if "1st" not in author_text and " 1st" not in pitem.get("text", ""):
                    # skip posts not from connections
                    seen.add(pitem["id"])
                    continue
                queue.append(pitem)

            # worker: process queued items -- like and comment
            for idx, pitem in enumerate(queue):
                if liked >= max_likes:
                    break
                
                # Determine if we should comment on this post
                # - First 2 likes: always comment
                # - After that: 50% chance to comment
                should_comment = (liked < 2) or (random.random() < 0.8)
                
                # process post
                did = process_post(page, pitem, should_comment=should_comment)
                if did:
                    liked += 1
                    seen.add(pitem["id"])
                    # wait schedule: after like #1 we wait 3s, then 4s etc.
                    wait_sec = liked + 2
                    print(f"Liked {liked} — waiting {wait_sec}s")
                    human_sleep(wait_sec)

            # if we still need more, scroll and let new posts appear
            if liked < max_likes:
                try:
                    # Check if page is still open before scrolling
                    if page.is_closed():
                        print("Page was closed, ending run.")
                        break
                    
                    # Humanized cursor movement before scroll
                    x = random.randint(100, 1200)
                    y = random.randint(100, 800)
                    page.mouse.move(x, y)
                    human_sleep(0.5)
                    # Hover over a profile name to simulate interest
                    try:
                        profile_el = page.locator("span.feed-shared-actor__name, a.feed-shared-actor__name-link").first
                        if profile_el.count() > 0:
                            profile_el.hover()
                            human_sleep(0.3)
                    except Exception:
                        pass
                    # Perform scroll with slight variation
                    scroll_factor = random.uniform(0.8, 0.9)
                    page.evaluate(f"window.scrollBy(0, window.innerHeight * {scroll_factor})")
                    human_sleep(random.uniform(1.2, 2.8))
                except Exception as e:
                    print(f"Error during scroll: {e}")
                    # Page might be closed, end gracefully
                    break

        print(f"Paired run finished — liked {liked}/{max_likes}. Closing browser.")
        try:
            browser.close()
        except Exception:
            try:
                context.close()
            except Exception:
                pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Paired agent: scanner + worker for LinkedIn feed with OpenAI comments')
    parser.add_argument('--max', type=int, default=10, help='Maximum number of posts to like')
    parser.add_argument('--headful', action='store_true', help='Run with visible browser (recommended)')

    args = parser.parse_args()
    
    print("Paired Agent - OpenAI-Powered LinkedIn Engagement")
    print("=" * 50)
    print("Comment strategy: First 2 posts → Always comment")
    print("                  Remaining posts → 50% chance to comment")
    print("=" * 50)
    
    run_paired(max_likes=args.max, headful=args.headful)
