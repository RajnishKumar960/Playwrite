'''Paired agent: scanner + worker coordinating in a single browser session.

This script uses the same safety filters and comment generator logic as agent.py
but separates scanning the feed (finding eligible posts) from acting on posts
(liking/commenting). They operate in a linked loop so the scanner and worker stay
in the same Playwright session and behave coherently.

Run headed when posting comments to allow manual 2FA/captcha handling.
Usage (PowerShell):
  python paired_agent.py --max 12 --headful --comment-preview

Note: This is conservative software intended for personal automation. Use responsibly.
''' 

from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import argparse
import os
import random
from lib.utils import human_sleep, smooth_scroll
from lib.safety import safe_to_like, safe_to_comment
from lib.auth import login
from lib.openai_comments import generate_openai_comment
from state_store import has_processed, mark_processed, get_all

# Load .env
load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")

def find_posts_on_page(page):
    """Return list of post ElementHandles (best‑effort) and small data snippets.

    Each item is a dict: {"el": locator, "text": str, "author": str, "id": hash}
    """
    posts = []
    # Defensive check: ensure page is still open
    try:
        if page.is_closed():
            print("Warning: Page is closed, returning empty posts")
            return posts
    except Exception:
        return posts
    # common post containers — LinkedIn uses several structures; this is best‑effort
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

def process_post(page, post_item, should_comment=False, comment_preview=False, safe_mode=False):
    """Like and optionally comment on a single post_item.

    Returns True if a like (or preview) was performed, False otherwise.
    """
    el = post_item["el"]
    # Safety check for liking
    like_ok, like_reason = safe_to_like(post_item, safe_mode=safe_mode)
    if not like_ok:
        print(f"Skipping like: {like_reason}")
        return False
    # Find like button inside this post
    candidates = el.locator("button[aria-label*='Like']")
    like_btn = None
    if candidates.count() > 0:
        like_btn = candidates.nth(0)
    else:
        like_btn = page.locator("button[aria-label*='Like']").nth(0)
    # Confirm not already liked
    aria = None
    try:
        aria = like_btn.get_attribute("aria-pressed")
    except Exception:
        aria = None
    if aria == "true":
        return False
    # Human‑like mouse movement and click
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
    # Comment handling
    if should_comment:
        ai_decision = generate_openai_comment(post_item)
        
        action = ai_decision.get("action", "SKIP")
        reason = ai_decision.get("reason", "Unknown")
        comment_text = ai_decision.get("comment", "")
        
        if action == "SKIP":
            print(f"AI decided to SKIP comment: {reason}")
            return True
            
        if comment_preview:
            print(f"[Comment preview] {comment_text}")
            return True
        # Post the comment
        try:
            cbtn = el.locator("button[aria-label*='Comment']")
            if cbtn.count() > 0:
                cbtn.nth(0).click()
                human_sleep(0.5)
            editor = el.locator("div.ql-editor, div[role='textbox']")
            try:
                editor.first.wait_for(state="visible", timeout=5000)
            except Exception:
                editor = page.locator("div.ql-editor, div[role='textbox']")
                if editor.count() > 0:
                    editor = editor.first
                else:
                    print("No comment box found.")
                    return True
            editor.first.click()
            human_sleep(0.3)
            editor.first.fill(comment_text)
            human_sleep(0.8)
            # Click post button (multiple strategies)
            post_clicked = False
            btn_selectors = [
                "button.artdeco-button--primary",
                "button[type='submit']",
                "button:has-text('Post')",
                "button:has-text('Comment')",
                "form button.artdeco-button",
            ]
            for selector in btn_selectors:
                try:
                    post_btn = el.locator(selector)
                    if post_btn.count() > 0 and post_btn.first.is_visible():
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
            if not post_clicked:
                try:
                    page_post_btn = page.locator("button.comments-comment-box__submit-button, button.artdeco-button--primary:visible").first
                    if page_post_btn.is_visible():
                        page_post_btn.click()
                        post_clicked = True
                        print("✓ Clicked Post button (page‑wide fallback)")
                except Exception:
                    pass
            if not post_clicked:
                print("Post button not found, trying Ctrl+Enter...")
                editor.first.press("Control+Enter")
                human_sleep(0.3)
                editor.first.press("Enter")
                print("Sent keyboard shortcuts to submit")
            human_sleep(2.0)
            print("✓ Comment posted successfully!")
        except Exception as e:
            print(f"Could not post comment: {e}")
    return True

def run_campaign_logic(page, max_likes, comment_preview=False, dry_run=False, safe_mode=False):
    """Core logic to run the engagement campaign on a provided page object."""
    liked = 0
    attempts = 0
    while liked < max_likes and attempts < max_likes * 12:
        attempts += 1
        posts = find_posts_on_page(page)
        queue = []
        for pitem in posts:
            if has_processed(pitem["id"]):
                continue
            author_text = pitem.get("author", "")
            if "1st" not in author_text and " 1st" not in pitem.get("text", ""):
                mark_processed(pitem["id"])  # mark as seen/skipped
                continue
            queue.append(pitem)
        for pitem in queue:
            if liked >= max_likes:
                break
            should_comment = (liked < 2) or (random.random() < 0.8)
            if dry_run:
                print(f"[DRY RUN] Would like post {pitem['id']}, comment={should_comment}")
                liked += 1
                mark_processed(pitem["id"])
                continue
            did = process_post(page, pitem, should_comment=should_comment, comment_preview=comment_preview, safe_mode=safe_mode)
            if did:
                liked += 1
                mark_processed(pitem["id"])
                wait_sec = liked + 2
                print(f"Liked {liked} — waiting {wait_sec}s")
                human_sleep(wait_sec)
        if liked < max_likes:
            try:
                if page.is_closed():
                    print("Page was closed, ending run.")
                    break
                x = random.randint(100, 1200)
                y = random.randint(100, 800)
                page.mouse.move(x, y)
                human_sleep(0.5)
                try:
                    profile_el = page.locator("span.feed-shared-actor__name, a.feed-shared-actor__name-link").first
                    if profile_el.count() > 0:
                        profile_el.hover()
                        human_sleep(0.3)
                except Exception:
                    pass
                scroll_factor = random.uniform(0.8, 0.9)
                # Use smooth scroll instead of jump
                scroll_distance = int(page.viewport_size['height'] * scroll_factor)
                smooth_scroll(page, scroll_distance)
                human_sleep(random.uniform(1.2, 2.8))
            except Exception as e:
                print(f"Error during scroll: {e}")
                break
    return liked

def run_paired(max_likes: int, headful: bool, comment_preview: bool = False, dry_run: bool = False, safe_mode: bool = False):
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("Missing LINKEDIN_EMAIL/LINKEDIN_PASSWORD in .env — set them and try again.")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        # Try to load storage state if it exists
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(viewport={"width": 1280, "height": 900}, storage_state=storage_state)
        page = context.new_page()
        
        # If we loaded state, we might be logged in. Login function handles verification.
        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            if headful:
                print("Login did not automatically reach the feed. If LinkedIn asked for 2FA/captcha, please complete the verification in the opened browser. Press Enter here once you've completed it to continue.")
                try:
                    input()
                except Exception:
                    print("No input available; aborting.")
                    browser.close()
                    return
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
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        human_sleep(3)
        print("Starting paired scanning/acting on feed (1st-degree connections only).")
        
        liked = run_campaign_logic(page, max_likes, comment_preview, dry_run, safe_mode)
        
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
    parser.add_argument('--comment-preview', action='store_true', help='Generate comments and preview them without posting')
    parser.add_argument('--dry-run', action='store_true', help='Do not perform any network actions (likes/comments)')
    parser.add_argument('--safe-mode', action='store_true', help='Enforce stricter safety (e.g., language detection)')
    parser.add_argument('--log-level', default='INFO', help='Logging level')
    args = parser.parse_args()
    print("Paired Agent - OpenAI-Powered LinkedIn Engagement")
    print("=" * 50)
    print("Comment strategy: First 2 posts -> Always comment")
    print("                  Remaining posts -> 50% chance to comment")
    print("=" * 50)
    run_paired(max_likes=args.max, headful=args.headful, comment_preview=args.comment_preview, dry_run=args.dry_run, safe_mode=args.safe_mode)
