"""
LinkedIn Persistent Browser Session
Uses Playwright's persistent context to maintain logged-in state
"""
import asyncio
from playwright.async_api import async_playwright, BrowserContext, Page
from typing import Optional
import os

class LinkedInSession:
    """Manages persistent LinkedIn browser session"""
    
    def __init__(self, user_data_dir: str = 'browser_profile'):
        self.user_data_dir = os.path.abspath(user_data_dir)
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self._playwright = None
        self._browser = None
        
    async def init(self, headless: bool = False) -> bool:
        """
        Initialize browser with persistent context
        
        Args:
            headless: Run in headless mode (default: False for first-time login)
        
        Returns:
            True if initialized successfully
        """
        try:
            if self.context:
                return True
            
            self._playwright = await async_playwright().start()
            
            # Create persistent context with saved profile
            self.context = await self._playwright.chromium.launch_persistent_context(
                user_data_dir=self.user_data_dir,
                headless=headless,
                args=[
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ],
                viewport={'width': 1280, 'height': 720},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            )
            
            # Get or create page
            if len(self.context.pages) > 0:
                self.page = self.context.pages[0]
            else:
                self.page = await self.context.new_page()
            
            print(f"✓ Browser initialized with profile: {self.user_data_dir}")
            return True
            
        except Exception as e:
            print(f"Error initializing browser: {e}")
            return False
    
    async def ensure_logged_in(self, manual_login: bool = False, quick_check: bool = False) -> dict:
        """
        Check if logged into LinkedIn, prompt login if needed
        
        Args:
            manual_login: Force manual login window to open
            quick_check: Skip browser initialization, just check if profile exists
        
        Returns:
            dict with status and message
        """
        try:
            # For quick status check, just verify profile exists
            if quick_check:
                if self.profile_exists():
                    return {
                        'status': 'success',
                        'logged_in': True,
                        'message': 'Browser profile exists (session likely active)',
                        'user_name': 'LinkedIn User'
                    }
                else:
                    return {
                        'status': 'login_required',
                        'logged_in': False,
                        'message': 'No browser profile found. Please login.'
                    }
            
            # Full check with browser initialization
            if not self.context:
                await self.init(headless=True if not manual_login else False)
            
            # Go to LinkedIn with timeout
            try:
                await self.page.goto('https://www.linkedin.com/feed', wait_until='networkidle', timeout=15000)
            except:
                # Timeout or error - assume not logged in
                return {
                    'status': 'login_required',
                    'logged_in': False,
                    'message': 'Could not connect to LinkedIn. Please login.'
                }
            
            current_url = self.page.url
            
            # Check if we're logged in
            if '/feed' in current_url or 'linkedin.com/feed' in current_url:
                try:
                    # Try to get user name
                    name_elem = await self.page.query_selector('.feed-identity-module__actor-meta a')
                    if name_elem:
                        user_name = await name_elem.inner_text()
                    else:
                        user_name = "LinkedIn User"
                    
                    return {
                        'status': 'success',
                        'logged_in': True,
                        'message': 'Already logged in',
                        'user_name': user_name.strip()
                    }
                except:
                    return {
                        'status': 'success',
                        'logged_in': True,
                        'message': 'Already logged in',
                        'user_name': 'LinkedIn User'
                    }
            
            # Not logged in - need manual login
            if '/login' in current_url or 'checkpoint' in current_url:
                if manual_login:
                    # Keep browser open for manual login
                    return {
                        'status': 'login_required',
                        'logged_in': False,
                        'message': 'Please login in the browser window. Session will be saved automatically.'
                    }
                else:
                    return {
                        'status': 'login_required',
                        'logged_in': False,
                        'message': 'Not logged in. Please trigger manual login from Settings.'
                    }
            
            return {
                'status': 'unknown',
                'logged_in': False,
                'message': f'Unknown state: {current_url}'
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'logged_in': False,
                'message': f'Error checking login: {str(e)}'
            }
    
    async def wait_for_login(self, timeout: int = 300) -> dict:
        """
        Open browser and wait for user to login manually
        
        Args:
            timeout: Max seconds to wait (default: 5 minutes)
        
        Returns:
            dict with status
        """
        try:
            # Init in non-headless mode
            await self.init(headless=False)
            
            # Go to LinkedIn login
            await self.page.goto('https://www.linkedin.com/login')
            
            print("\n" + "="*60)
            print("   LinkedIn Manual Login")
            print("="*60)
            print("\nBrowser window opened. Please:")
            print("1. Enter your LinkedIn email and password")
            print("2. Complete OTP verification if prompted")
            print("3. Wait until you see your LinkedIn feed")
            print("\nSession will be saved automatically.")
            print("="*60 + "\n")
            
            # Wait for login to complete - check multiple possible URLs
            login_successful = False
            start_time = self.page.context.clock.time() if hasattr(self.page.context, 'clock') else None
            
            for i in range(timeout):
                await asyncio.sleep(1)
                current_url = self.page.url
                
                # Check if we're on any LinkedIn authenticated page
                if any(path in current_url for path in ['/feed', '/mynetwork', '/messaging', '/notifications', '/jobs']):
                    login_successful = True
                    break
            
            if not login_successful:
                return {
                    'status': 'timeout',
                    'message': 'Login timeout. Please try again.'
                }
            
            # Login successful - get user info
            result = await self.ensure_logged_in()
            
            print("\n✓ Login successful! Session saved.")
            print(f"✓ Logged in as: {result.get('user_name', 'LinkedIn User')}")
            print("✓ Browser will close in 2 seconds...\n")
            
            # Wait 2 seconds then close browser
            await asyncio.sleep(2)
            await self.close()
            
            return {
                'status': 'success',
                'message': 'Login successful. Session saved.',
                'user_name': result.get('user_name', 'LinkedIn User')
            }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Error during login: {str(e)}'
            }
    
    async def close(self):
        """Close browser and cleanup"""
        try:
            if self.context:
                await self.context.close()
                self.context = None
                self.page = None
            
            if self._playwright:
                await self._playwright.stop()
                self._playwright = None
                
        except Exception as e:
            print(f"Error closing browser: {e}")
    
    def profile_exists(self) -> bool:
        """Check if browser profile folder exists"""
        return os.path.exists(self.user_data_dir) and os.path.isdir(self.user_data_dir)


# Global session instance
_linkedin_session: Optional[LinkedInSession] = None

def get_linkedin_session() -> LinkedInSession:
    """Get or create global LinkedIn session"""
    global _linkedin_session
    if _linkedin_session is None:
        _linkedin_session = LinkedInSession()
    return _linkedin_session
