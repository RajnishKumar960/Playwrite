
from playwright.sync_api import sync_playwright
import time

def debug_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        
        print("Navigating to login page...")
        page.goto("https://www.linkedin.com/login")
        time.sleep(5)
        
        print(f"Current URL: {page.url}")
        print(f"Page Title: {page.title()}")
        
        # Save screenshot to artifact directory so I can see it if possible, or just local
        page.screenshot(path="login_debug.png")
        print("Saved screenshot to login_debug.png")
        
        try:
            feed_visible = page.url.find("/feed/") != -1
            print(f"Is feed visible in URL? {feed_visible}")
            
            form_visible = page.locator("input[name='session_key']").is_visible()
            print(f"Is session_key input visible? {form_visible}")
            
            if not form_visible:
                print("Dumping HTML...")
                # print(page.content()[:1000]) # Print first 1000 chars
        except Exception as e:
            print(f"Error checking elements: {e}")

        browser.close()

if __name__ == "__main__":
    debug_login()
