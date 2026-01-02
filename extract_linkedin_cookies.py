"""
LinkedIn Cookie Extractor
Run this script to extract cookies from a logged-in LinkedIn session.
"""
import asyncio
from playwright.async_api import async_playwright
import json
import os

async def extract_cookies():
    """
    Opens LinkedIn in a browser, waits for you to login, then saves cookies.
    """
    print("=" * 60)
    print("LinkedIn Cookie Extractor")
    print("=" * 60)
    print()
    print("Instructions:")
    print("1. A browser window will open")
    print("2. Login to LinkedIn (with email, password, OTP if needed)")
    print("3. Wait until you see your feed")
    print("4. Come back here and press ENTER")
    print()
    print("=" * 60)
    
    async with async_playwright() as p:
        # Launch browser in NON-headless mode
        browser = await p.chromium.launch(
            headless=False,
            args=['--no-sandbox']
        )
        
        context = await browser.new_context()
        page = await context.new_page()
        
        # Go to LinkedIn
        print("\n✓ Opening LinkedIn...")
        await page.goto('https://www.linkedin.com/login')
        
        # Wait for user to login manually
        print("\n⏳ Waiting for you to login...")
        print("   → Enter your email and password")
        print("   → Complete OTP verification if prompted")
        print("   → Wait until you see your LinkedIn feed")
        print()
        
        input("Press ENTER after you've successfully logged in...")
        
        # Extract cookies
        print("\n✓ Extracting cookies...")
        cookies = await context.cookies()
        
        # Save to file
        os.makedirs('sessions', exist_ok=True)
        cookie_file = 'sessions/linkedin_cookies.json'
        
        with open(cookie_file, 'w') as f:
            json.dump(cookies, f, indent=2)
        
        print(f"\n✓ Cookies saved to: {cookie_file}")
        print(f"✓ Total cookies: {len(cookies)}")
        
        # Find the important li_at cookie
        li_at = next((c for c in cookies if c['name'] == 'li_at'), None)
        if li_at:
            print(f"\n✓ LinkedIn auth token (li_at) found!")
            print(f"  Expires: {li_at.get('expires', 'N/A')}")
        else:
            print("\n⚠ Warning: li_at cookie not found. Login may not have succeeded.")
        
        await browser.close()
        
        print("\n" + "=" * 60)
        print("✓ Done! You can now use these cookies in your application.")
        print("=" * 60)
        
        # Also print cookies for manual paste
        print("\n📋 Copy this JSON to paste in Settings UI:")
        print("-" * 60)
        print(json.dumps(cookies, indent=2))
        print("-" * 60)

if __name__ == "__main__":
    asyncio.run(extract_cookies())
