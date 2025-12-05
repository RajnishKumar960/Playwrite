"""Playwright HTTP API server for n8n integration.

Endpoints provided (POST JSON):
- /scrape_sales -> runs a people search scrape (filters: department, industry, company, max). Returns rows.
- /send_request -> send connection requests to a list of profile URLs (with optional note). Returns action results.
- /check_acceptance -> check whether listed profile URLs are now 1st-degree connections.
- /warmup -> for a list of accepted profile URLs run warmup automation (visit, like, comment according to safe rules).

This server is a lightweight orchestrator for n8n. It uses .env LinkedIn credentials.

Security: this is a local dev server. Do NOT expose it to the public without proper auth and TLS.
"""
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import time
import random
from typing import List
from scraper_agent import run_scraper
from state_store import init_db, is_processed, mark_processed

load_dotenv()

app = Flask(__name__)

# Minimal safety / rate limit settings — tune these in production
DAILY_MAX_REQUESTS = int(os.getenv("DAILY_MAX_REQUESTS", "30"))


from lib.safety import safe_to_like
from lib.comments import make_comment_text
from lib.auth import login


def _resp_ok(data):
    return jsonify({"status": "ok", "data": data})


def _check_api_key():
    # If PLAY_API_KEY is configured, require it in header X-API-KEY. If not configured allow local use.
    expected = os.getenv('PLAY_API_KEY')
    if not expected:
        return True, None
    provided = request.headers.get('X-API-KEY')
    if provided == expected:
        return True, None
    return False, (jsonify({'status': 'error', 'message': 'Unauthorized (missing/invalid X-API-KEY)'}), 401)


@app.route('/health', methods=['GET'])
def health():
    """Lightweight health check — doesn't require login."""
    ok, err = _check_api_key()
    if not ok:
        return err
    # ensure DB exists
    try:
        init_db()
    except Exception:
        pass
    return jsonify({"status": "ok", "message": "play_api up", "db": os.getenv('PLAY_DB_PATH', 'play_state.db')})


@app.route('/scrape_sales', methods=['POST'])
def scrape_sales():
    ok, err = _check_api_key()
    if not ok:
        return err
    body = request.get_json(force=True)
    department = body.get('department')
    industry = body.get('industry')
    company = body.get('company')
    max_count = int(body.get('max', 30))
    sheet = body.get('sheet') or os.getenv('GOOGLE_SHEET_ID')
    sales_nav = bool(body.get('sales_nav', False))

    rows = run_scraper(department=department, industry=industry, company=company, max_results=max_count, sheet_id=sheet, sales_nav=sales_nav)
    return _resp_ok({"rows": len(rows), "results": rows})


@app.route('/send_request', methods=['POST'])
def send_request():
    ok, err = _check_api_key()
    if not ok:
        return err
    """Send connection requests to a list of profile URLs.

    Request body: { profiles: ["https://www.linkedin.com/in/.."], note: "optional note" }
    """
    body = request.get_json(force=True)
    profiles: List[str] = body.get('profiles', [])
    note: str = body.get('note', '')
    headful = bool(body.get('headful', True))
    dry_run = bool(body.get('dry_run', False))
    force = bool(body.get('force', False))

    results = []
    from playwright.sync_api import sync_playwright

    # ensure DB is initialized and apply basic throttling and randomness
    init_db()
    random.shuffle(profiles)

    # dry_run short-circuit: avoid opening browser/login when dry_run=true
    if dry_run:
        for profile in profiles:
            if not force and is_processed(profile, 'send_request'):
                results.append({"profile": profile, "status": "skipped", "reason": "already_processed"})
                continue
            results.append({"profile": profile, "status": "would_send", "note": bool(note)})
        return _resp_ok({"results": results})
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=40)
        context = browser.new_context(viewport={"width": 1200, "height": 900})
        page = context.new_page()
        # login
        if not login(page, os.getenv('LINKEDIN_EMAIL'), os.getenv('LINKEDIN_PASSWORD')):
            if headful:
                print("Please complete any verification in the opened browser and press Enter in the terminal to continue.")
                input()
            else:
                browser.close()
                return jsonify({"status": "error", "message": "Login failed, cannot send connection requests."}), 400

        for profile in profiles:
            try:
                # skip profiles already processed unless force=true
                if not force and is_processed(profile, 'send_request'):
                    results.append({"profile": profile, "status": "skipped", "reason": "already_processed"})
                    continue

                # if dry_run: don't open a browser/do not actually send requests; simulate
                if dry_run:
                    results.append({"profile": profile, "status": "would_send", "note": bool(note)})
                    continue
                # visit profile
                page.goto(profile, wait_until='domcontentloaded')
                time.sleep(random.uniform(1.0, 2.5))

                # try to find connect button
                connect = None
                try:
                    connect = page.locator("button:has-text('Connect'), button[aria-label*='Connect']").nth(0)
                except Exception:
                    connect = None

                if connect and connect.count() > 0:
                    try:
                        # click connect and add note if provided
                        connect.click()
                        time.sleep(0.5)
                        # look for add note
                        try:
                            add_note = page.locator("button:has-text('Add a note')").nth(0)
                            if add_note.count() > 0 and note:
                                add_note.click()
                                time.sleep(0.5)
                                page.locator("textarea[name='message']").fill(note)
                                page.locator("button:has-text('Send')").click()
                                results.append({"profile": profile, "status": "sent", "note": True})
                                mark_processed(profile, 'send_request', 'sent_with_note')
                            else:
                                # send without note
                                page.locator("button:has-text('Send')").click()
                                results.append({"profile": profile, "status": "sent", "note": False})
                                mark_processed(profile, 'send_request', 'sent_no_note')
                        except Exception:
                            # fallback: click send if available
                            try:
                                page.locator("button:has-text('Send')").click()
                                results.append({"profile": profile, "status": "sent", "note": False})
                            except Exception:
                                results.append({"profile": profile, "status": "failed", "reason": "no send button"})
                                mark_processed(profile, 'send_request', 'failed_no_send_button')
                    except Exception as e:
                        results.append({"profile": profile, "status": "failed", "reason": str(e)})
                        mark_processed(profile, 'send_request', f'failed:{str(e)[:200]}')
                else:
                    results.append({"profile": profile, "status": "skipped", "reason": "no connect button"})
                    mark_processed(profile, 'send_request', 'skipped_no_connect')

                # humanized delay
                time.sleep(random.uniform(1.0, 3.0))
            except Exception as e:
                results.append({"profile": profile, "status": "error", "reason": str(e)})

        try:
            browser.close()
        except Exception:
            pass

    return _resp_ok({"results": results})


@app.route('/check_acceptance', methods=['POST'])
def check_acceptance():
    ok, err = _check_api_key()
    if not ok:
        return err
    body = request.get_json(force=True)
    profiles = body.get('profiles', [])
    headful = bool(body.get('headful', True))
    results = []

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=40)
        context = browser.new_context(viewport={"width": 1200, "height": 900})
        page = context.new_page()
        if not login(page, os.getenv('LINKEDIN_EMAIL'), os.getenv('LINKEDIN_PASSWORD')):
            if headful:
                print("Please resolve verification and press Enter in the terminal to continue.")
                input()
            else:
                return jsonify({"status": "error", "message": "Login failed"}), 400

        for profile in profiles:
            try:
                page.goto(profile, wait_until='domcontentloaded')
                # search for '1st' indicator or 'Message' button which generally indicates connection
                is_first = False
                try:
                    txt = page.content()[:1000]
                    if '1st' in txt or 'Message' in txt:
                        is_first = True
                except Exception:
                    is_first = False
                results.append({"profile": profile, "accepted": is_first})
                time.sleep(random.uniform(0.8, 2.2))
            except Exception as e:
                results.append({"profile": profile, "accepted": False, "error": str(e)})

    try:
        browser.close()
    except Exception:
        pass

    return _resp_ok({"results": results})


@app.route('/warmup', methods=['POST'])
def warmup():
    ok, err = _check_api_key()
    if not ok:
        return err
    body = request.get_json(force=True)
    profiles = body.get('profiles', [])
    max_actions = int(body.get('max', 5))
    headful = bool(body.get('headful', True))
    comment_preview = bool(body.get('comment_preview', True))
    post_comments = bool(body.get('post_comments', False))
    dry_run = bool(body.get('dry_run', False))
    force = bool(body.get('force', False))

    # Use paired_agent's process_post logic by visiting profile pages and interacting with posts.
    results = []
    # If dry_run requested, don't launch the browser or login — just simulate results
    if dry_run:
        init_db()
        for profile in profiles:
            if not force and is_processed(profile, 'warmup'):
                results.append({"profile": profile, "actions": 0, "skipped": True, "reason": "already_processed"})
                continue
            results.append({"profile": profile, "actions": 0, "dry_run": True})
        return _resp_ok({"results": results})

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not headful, slow_mo=50)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        # login
        if not login(page, os.getenv('LINKEDIN_EMAIL'), os.getenv('LINKEDIN_PASSWORD')):
            if headful:
                print("Please resolve 2FA/captcha manually and press Enter to continue.")
                input()
            else:
                return jsonify({"status": "error", "message": "Login failed"}), 400

        # visit each profile and interact
        for profile in profiles:
            try:
                page.goto(profile, wait_until='domcontentloaded')
                time.sleep(random.uniform(1.0, 2.0))
                # Scroll to load posts
                page.evaluate("window.scrollBy(0, window.innerHeight * 0.6)")
                time.sleep(random.uniform(0.8, 1.8))

                # Find post containers in profile feed (best-effort)
                posts = page.locator("div.occludable-update, div.feed-shared-update-v2")
                total = posts.count()
                acted = 0
                for i in range(total):
                    if acted >= max_actions:
                        break
                    post = posts.nth(i)
                    snippet = ""
                    try:
                        snippet = post.inner_text()[:800]
                    except Exception:
                        snippet = ""
                    # skip unsafe posts
                    if not safe_to_like(snippet, ""):
                        continue
                    # find like button
                    try:
                        like_btn = post.locator("button[aria-label*='Like']").nth(0)
                        # hover and click
                        bb = like_btn.bounding_box()
                        if bb:
                            page.mouse.move(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2)
                        like_btn.click()
                        acted += 1
                        # optionally comment
                        if comment_preview or post_comments:
                            comment_text = make_comment_text(snippet, None)
                            if comment_preview:
                                print(f"Preview comment for {profile} post {i}: {comment_text}")
                            if post_comments:
                                try:
                                    cbtn = post.locator("button[aria-label*='Comment']").nth(0)
                                    if cbtn.count() > 0:
                                        cbtn.click()
                                        time.sleep(0.4)
                                        editor = post.locator("div[role='textbox']").nth(0)
                                        editor.fill(comment_text)
                                        # post
                                        pbtn = post.locator("button:has-text('Post')").nth(0)
                                        if pbtn.count() > 0:
                                            pbtn.click()
                                except Exception:
                                    pass
                        # wait humanized delay (1-10s)
                        time.sleep(random.uniform(1.0, 10.0))
                    except Exception:
                        continue

                results.append({"profile": profile, "actions": acted})
            except Exception as e:
                results.append({"profile": profile, "error": str(e)})

        try:
            browser.close()
        except Exception:
            pass

    return _resp_ok({"results": results})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=int(os.getenv('PLAY_API_PORT', 4000)), debug=False)
