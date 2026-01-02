"""
LinkedIn Authentication Module
Handles Playwright-based login with OTP/2FA support
"""
import asyncio
import json
import os
from datetime import datetime, timedelta
from playwright.async_api import async_playwright, Page, Browser
from typing import Optional, Dict


class LinkedInAuth:
    """Manages LinkedIn authentication with OTP support"""
    
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.context = None
        self.page: Optional[Page] = None
        self.session_data: Dict = {}
        self.otp_pending = False
        
    async def init_browser(self):
        """Initialize Playwright browser"""
        if self.browser:
            return
        
        # Get or create event loop explicitly
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        from playwright.async_api import async_playwright
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        self.context = await self.browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        self.page = await self.context.new_page()
        
    async def start_login(self, email: str, password: str) -> Dict:
        """
        Start LinkedIn login process
        Returns: {
            "status": "success" | "otp_required" | "error",
            "message": str,
            "session_id": str (if OTP required)
        }
        """
        try:
            await self.init_browser()
            
            # Navigate to LinkedIn login
            await self.page.goto('https://www.linkedin.com/login', wait_until='networkidle')
            
            # Enter credentials
            await self.page.fill('input[id="username"]', email)
            await self.page.fill('input[id="password"]', password)
            await self.page.click('button[type="submit"]')
            
            # Wait for navigation
            await asyncio.sleep(3)
            
            # Check for OTP prompt
            current_url = self.page.url
            
            # Check for email verification
            if 'checkpoint' in current_url or await self._is_otp_required():
                self.otp_pending = True
                self.session_data = {
                    'email': email,
                    'status': 'otp_pending',
                    'timestamp': datetime.now().isoformat()
                }
                
                return {
                    'status': 'otp_required',
                    'message': 'Please enter the OTP code sent to your email or approve on mobile',
                    'session_id': email  # Use email as session ID for now
                }
            
            # Check if login succeeded
            if 'feed' in current_url or 'mynetwork' in current_url:
                # Login successful
                await self._save_session(email)
                user_name = await self._get_user_name()
                
                return {
                    'status': 'success',
                    'message': 'Login successful',
                    'user': {
                        'email': email,
                        'name': user_name
                    }
                }
            
            # Check for error
            error_msg = await self._get_error_message()
            return {
                'status': 'error',
                'message': error_msg or 'Login failed. Please check your credentials.'
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Login error: {str(e)}'
            }
    
    async def verify_otp(self, session_id: str, otp_code: Optional[str] = None) -> Dict:
        """
        Verify OTP code or wait for mobile approval
        Returns: {
            "status": "success" | "pending" | "error",
            "user": {...} (if success)
        }
        """
        try:
            if not self.page or not self.otp_pending:
                return {'status': 'error', 'message': 'No OTP session active'}
            
            # If OTP code provided, enter it
            if otp_code:
                otp_input = self.page.locator('input[id="input__email_verification_pin"]')
                if await otp_input.is_visible():
                    await otp_input.fill(otp_code)
                    await self.page.click('button[type="submit"]')
                    await asyncio.sleep(2)
            
            # Wait for login completion (either OTP or mobile approval)
            for _ in range(30):  # Wait up to 30 seconds
                current_url = self.page.url
                if 'feed' in current_url or 'mynetwork' in current_url:
                    # Login successful
                    self.otp_pending = False
                    await self._save_session(session_id)
                    user_name = await self._get_user_name()
                    
                    return {
                        'status': 'success',
                        'message': 'Login verified',
                        'user': {
                            'email': session_id,
                            'name': user_name
                        }
                    }
                await asyncio.sleep(1)
            
            return {
                'status': 'pending',
                'message': 'Waiting for verification...'
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Verification error: {str(e)}'
            }
    
    async def _is_otp_required(self) -> bool:
        """Check if OTP verification is required"""
        # Check for email verification input
        email_verify = self.page.locator('input[id="input__email_verification_pin"]')
        if await email_verify.is_visible():
            return True
        
        # Check for mobile tap prompt
        mobile_prompt = self.page.locator('text=Tap Yes')
        if await mobile_prompt.is_visible():
            return True
            
        return False
    
    async def _get_error_message(self) -> Optional[str]:
        """Extract error message from page"""
        try:
            error_elem = self.page.locator('.form__label--error')
            if await error_elem.is_visible():
                return await error_elem.inner_text()
        except:
            pass
        return None
    
    async def _get_user_name(self) -> str:
        """Extract logged-in user's name"""
        try:
            # Wait for profile to load
            await self.page.wait_for_selector('button[id^="ember"]', timeout=5000)
            
            # Try to get name from profile dropdown
            name_elem = self.page.locator('.global-nav__me-photo')
            if await name_elem.is_visible():
                title = await name_elem.get_attribute('title')
                if title:
                    return title
                    
            # Fallback: try nav profile text
            profile_text = self.page.locator('.t-16.t-black.t-bold')
            if await profile_text.is_visible():
                return await profile_text.inner_text()
                
        except Exception as e:
            print(f"Error getting user name: {e}")
            
        return "LinkedIn User"
    
    async def _save_session(self, email: str):
        """Save authenticated session cookies"""
        try:
            cookies = await self.context.cookies()
            
            # Save to file
            os.makedirs('sessions', exist_ok=True)
            session_file = f'sessions/{email.replace("@", "_")}.json'
            
            with open(session_file, 'w') as f:
                json.dump({
                    'email': email,
                    'cookies': cookies,
                    'created_at': datetime.now().isoformat(),
                    'expires_at': (datetime.now() + timedelta(days=30)).isoformat()
                }, f)
                
            print(f"Session saved: {session_file}")
            
        except Exception as e:
            print(f"Error saving session: {e}")
    
    async def load_session(self, email: str) -> bool:
        """Load saved session cookies"""
        try:
            session_file = f'sessions/{email.replace("@", "_")}.json'
            
            if not os.path.exists(session_file):
                return False
                
            with open(session_file, 'r') as f:
                data = json.load(f)
                
            # Check if expired
            expires_at = datetime.fromisoformat(data['expires_at'])
            if datetime.now() > expires_at:
                os.remove(session_file)
                return False
            
            # Load cookies
            await self.init_browser()
            await self.context.add_cookies(data['cookies'])
            
            return True
            
        except Exception as e:
            print(f"Error loading session: {e}")
            return False
    
    async def close(self):
        """Close browser"""
        if self.browser:
            await self.browser.close()
            self.browser = None
            self.context = None
            self.page = None


# Global auth instance
_auth_instance: Optional[LinkedInAuth] = None

def get_auth_instance() -> LinkedInAuth:
    """Get or create global auth instance"""
    global _auth_instance
    if _auth_instance is None:
        _auth_instance = LinkedInAuth()
    return _auth_instance
