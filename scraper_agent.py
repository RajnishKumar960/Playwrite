"""LinkedIn scraping agent

scraper_agent.py logs into LinkedIn (using .env credentials) and runs a people search
based on department, industry and/or company keywords. It scrapes visible profiles
from the search results page and returns structured rows (name, headline, location, profile_url).

It can write results to Google Sheets using a service account. To use that feature set
the environment variable `GOOGLE_SERVICE_ACCOUNT_FILE` to the path of your JSON key file
and `GOOGLE_SHEET_ID` (or pass a sheet_id) — see README for detailed setup.

NOTE: Scraping LinkedIn may violate LinkedIn's terms of service; use responsibly and only
for permissible purposes on accounts you control.
"""
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import os
import time
import random
from typing import List, Dict
from lib.auth import login

# Optional Google sheets client
try:
    import gspread
    from google.oauth2.service_account import Credentials
except Exception:
    gspread = None

load_dotenv()

LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")


def _sleep(min_s=0.5, max_s=1.5):
    time.sleep(random.uniform(min_s, max_s))


def _search_query(department: str | None, industry: str | None, company: str | None) -> str:
    pieces = []
    if department:
        pieces.append(department)
    if industry:
        pieces.append(industry)
    if company:
        pieces.append(company)
    return " ".join(pieces)


def _people_search_url(query: str) -> str:
    # Use LinkedIn people search with keywords (best-effort)
    # We're building a simple query that searches 'people' results using keywords
    q = query.replace(" ", "%20")
    return f"https://www.linkedin.com/search/results/people/?keywords={q}&origin=GLOBAL_SEARCH_HEADER"


def scrape_from_search(page, max_results=50) -> List[Dict]:
    """Scrape visible profile results from a LinkedIn people search result page.

    This is a best-effort approach: selectors are based on typical LinkedIn markup and
    may require tuning.
    """
    results = []
    # profile result containers - common LinkedIn selectors
    selectors = [
        "div.search-result__info",  # older layout
        "div.entity-result__content",  # newer layout
        "li.reusable-search__result-container",
    ]

    seen = set()
    for sel in selectors:
        nodes = page.locator(sel)
        count = nodes.count()
        for i in range(count):
            try:
                node = nodes.nth(i)
                text = node.inner_text()[:1000]
                if not text or hash(text) in seen:
                    continue
                seen.add(hash(text))

                name = ""
                headline = ""
                location = ""
                profile_url = ""

                # best-effort extractions
                try:
                    a = node.locator("a").nth(0)
                    profile_url = a.get_attribute("href") or ""
                    # normalize profile url
                    if profile_url and profile_url.startswith("/"):
                        profile_url = "https://www.linkedin.com" + profile_url
                except Exception:
                    profile_url = ""

                try:
                    # name anchors or headers
                    name_el = node.locator("span.entity-result__title-text a span, span.actor-name, h3").nth(0)
                    name = name_el.inner_text().strip()[:200]
                except Exception:
                    name = ""

                try:
                    # headline or subtitle
                    headline_el = node.locator("p.entity-result__primary-subtitle, div.entity-result__secondary-subtitle, span.subline-level-1").nth(0)
                    headline = headline_el.inner_text().strip()[:300]
                except Exception:
                    headline = ""

                try:
                    loc_el = node.locator("span.entity-result__secondary-subtitle, span.subline-level-2, span.t-black--light").nth(0)
                    location = loc_el.inner_text().strip()[:200]
                except Exception:
                    location = ""

                results.append({
                    "name": name,
                    "headline": headline,
                    "location": location,
                    "profile_url": profile_url,
                })

                if len(results) >= max_results:
                    return results
            except Exception:
                continue

    return results


def write_to_sheet(rows: List[Dict], sheet_id: str, worksheet_title: str = "Sheet1") -> None:
    if not gspread:
        raise RuntimeError("gspread/google-auth not installed — cannot write to Google Sheets. Install requirements.")

    sa_path = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")
    if not sa_path or not os.path.exists(sa_path):
        raise RuntimeError("Set GOOGLE_SERVICE_ACCOUNT_FILE env var to your service account JSON file path.")

    scope = ["https://www.googleapis.com/auth/spreadsheets"]
    creds = Credentials.from_service_account_file(sa_path, scopes=scope)
    gc = gspread.authorize(creds)

    sh = gc.open_by_key(sheet_id)
    try:
        ws = sh.worksheet(worksheet_title)
    except Exception:
        ws = sh.add_worksheet(title=worksheet_title, rows=1000, cols=10)

    headers = ["name", "headline", "location", "profile_url"]
    # ensure headers
    try:
        ws.update('A1', [headers])
    except Exception:
        pass

    # append rows
    values = [[r.get(k, "") for k in headers] for r in rows]
    if values:
        ws.append_rows(values, value_input_option='RAW')


def run_scraper(department=None, industry=None, company=None, max_results=50, sheet_id=None, sales_nav: bool = False):
    if not LINKEDIN_EMAIL or not LINKEDIN_PASSWORD:
        raise SystemExit("Missing LINKEDIN_EMAIL/LINKEDIN_PASSWORD in .env — set them and try again.")

    query = _search_query(department, industry, company)
    url = _people_search_url(query)

    with sync_playwright() as p:
        # HEADLESS=True and DISABLE SHM for container support
        browser = p.chromium.launch(headless=True, slow_mo=50, args=['--disable-dev-shm-usage', '--no-sandbox'])
        
        # Try to load storage state if it exists
        storage_state = "auth.json" if os.path.exists("auth.json") else None
        context = browser.new_context(viewport={"width": 1280, "height": 900}, storage_state=storage_state)
        
        page = context.new_page()

        if not login(page, LINKEDIN_EMAIL, LINKEDIN_PASSWORD):
            print("Login did not go to feed — check 2FA/captcha. Aborting.")
            browser.close()
            return []

        # navigate to search URL (Sales Navigator if requested)
        if sales_nav:
            # Best-effort Sales Navigator search URL using keywords
            sn_q = query.replace(' ', '%20')
            sn_url = f"https://www.linkedin.com/sales/search/people?keywords={sn_q}"
            try:
                page.goto(sn_url, wait_until="networkidle")
            except Exception:
                # fallback to regular people search
                page.goto(url, wait_until="networkidle")
        else:
            page.goto(url, wait_until="networkidle")
        _sleep(2, 4)

        # collect visible results across a few scrolls until we have enough
        results = []
        tries = 0
        while len(results) < max_results and tries < 8:
            tries += 1
            page.wait_for_timeout(1200)
            partial = scrape_from_search(page, max_results=max_results - len(results))
            for r in partial:
                if r not in results:
                    results.append(r)
            if len(results) >= max_results:
                break
            # scroll to load more
            page.evaluate("window.scrollBy(0, window.innerHeight * 0.9)")
            _sleep(1.0, 2.0)

        print(f"Scraped {len(results)} results for query='{query}'")

        if sheet_id:
            try:
                write_to_sheet(results, sheet_id)
                print(f"Wrote {len(results)} rows to Google Sheet {sheet_id}")
            except Exception as e:
                print("Google Sheets write failed:", e)

        try:
            browser.close()
        except Exception:
            try:
                context.close()
            except Exception:
                pass

        return results


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='LinkedIn scraper demo — search and scrape people results')
    parser.add_argument('--department', type=str, help='Department keyword', default=None)
    parser.add_argument('--industry', type=str, help='Industry keyword', default=None)
    parser.add_argument('--company', type=str, help='Company keyword', default=None)
    parser.add_argument('--max', type=int, default=30, help='Maximum rows to scrape')
    parser.add_argument('--sheet', type=str, help='Google Sheet ID to write results (optional)', default=None)

    args = parser.parse_args()
    run_scraper(department=args.department, industry=args.industry, company=args.company, max_results=args.max, sheet_id=args.sheet)
