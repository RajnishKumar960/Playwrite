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
        page.wait_for_selector("input[name='session_key']", timeout=60000)
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
