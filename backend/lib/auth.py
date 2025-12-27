import os

def login(page, email, password, storage_state_path="auth.json"):
    """Login to LinkedIn with session persistence.
    
    Args:
        page: Playwright page object
        email: LinkedIn email
        password: LinkedIn password
        storage_state_path: Path to save/load session state (default: auth.json)
        
    Returns:
        bool: True if logged in (or session valid), False otherwise
    """
    if not email or not password:
        raise ValueError("Missing LINKEDIN_EMAIL or LINKEDIN_PASSWORD")

    # 1. Try to restore session if exists
    if os.path.exists(storage_state_path):
        print(f"Found saved session: {storage_state_path}. Verifying...")
        try:
            # We can't "load" storage state into an existing page directly in sync API easily 
            # without context creation, but the context should have been created with storageState.
            # So we just check if we are logged in.
            page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded")
            try:
                page.wait_for_url("**/feed/**", timeout=5000)
                print("Session is valid!")
                return True
            except Exception:
                print("Session invalid or expired.")
        except Exception:
            pass

    # 2. Fresh login
    print("Logging in with credentials...")
    try:
        page.goto("https://www.linkedin.com/login", wait_until="domcontentloaded", timeout=60000)
        
        # Check if we got redirected to feed immediately (already logged in)
        # We wait a bit longer because sometimes redirect takes time
        try:
            page.wait_for_url("**/feed/**", timeout=15000)
            print("Redirected to feed directly. Already logged in.")
            
            # Save session for next time
            try:
                context = page.context
                context.storage_state(path=storage_state_path)
            except: 
                pass
            return True
        except Exception:
            # Double check URL manually
            if "/feed/" in page.url:
                 print("Redirected to feed (manual check). Already logged in.")
                 return True
            pass # Not on feed, proceed to login form

        # Check for username field
        try:
            # First check if we are on the "Welcome Back" screen
            # Look for "Sign in using another account"
            another_account_btn = page.locator("text='Sign in using another account'")
            if another_account_btn.is_visible():
                print("Found 'Welcome Back' screen. Clicking 'Sign in using another account'...")
                another_account_btn.click()
                # Wait for form to appear
                page.wait_for_selector("input[name='session_key']", timeout=10000)

            page.wait_for_selector("input[name='session_key']", timeout=30000)
        except Exception:
            print(f"Login form not found. Current URL: {page.url}")
            return False

        page.fill("input[name='session_key']", email)
        page.fill("input[name='session_password']", password)
        page.click("button[type='submit']")
    except Exception as e:
        print(f"Login page interaction failed: {e}")
        return False

    try:
        # Wait for feed (longer timeout for manual 2FA)
        page.wait_for_url("**/feed/**", timeout=60000)
        
        # 3. Save session state
        try:
            context = page.context
            context.storage_state(path=storage_state_path)
            print(f"Saved session to {storage_state_path}")
        except Exception as e:
            print(f"Warning: Could not save session state: {e}")
            
        return True
    except Exception:
        return False
