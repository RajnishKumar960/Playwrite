"""
LinkedIn Session Manager
Manages session cookies for LinkedIn automation
"""
import json
import os
from datetime import datetime
from typing import Optional, Dict, List
from playwright.async_api import BrowserContext

class LinkedInSessionManager:
    """Manages LinkedIn session cookies"""
    
    def __init__(self, session_file: str = 'sessions/linkedin_cookies.json'):
        self.session_file = session_file
        self.cookies: List[Dict] = []
        
    def load_cookies(self) -> bool:
        """Load cookies from file"""
        try:
            if not os.path.exists(self.session_file):
                print(f"No session file found at {self.session_file}")
                return False
                
            with open(self.session_file, 'r') as f:
                self.cookies = json.load(f)
            
            print(f"✓ Loaded {len(self.cookies)} cookies from {self.session_file}")
            return True
            
        except Exception as e:
            print(f"Error loading cookies: {e}")
            return False
    
    def save_cookies(self, cookies: List[Dict]) -> bool:
        """Save cookies to file"""
        try:
            os.makedirs(os.path.dirname(self.session_file), exist_ok=True)
            
            with open(self.session_file, 'w') as f:
                json.dump(cookies, f, indent=2)
            
            self.cookies = cookies
            print(f"✓ Saved {len(cookies)} cookies to {self.session_file}")
            return True
            
        except Exception as e:
            print(f"Error saving cookies: {e}")
            return False
    
    async def apply_cookies(self, context: BrowserContext) -> bool:
        """Apply cookies to browser context"""
        try:
            if not self.cookies:
                print("No cookies to apply")
                return False
            
            await context.add_cookies(self.cookies)
            print(f"✓ Applied {len(self.cookies)} cookies to browser context")
            return True
            
        except Exception as e:
            print(f"Error applying cookies: {e}")
            return False
    
    def get_cookie_status(self) -> Dict:
        """Get status of current cookies"""
        if not self.cookies:
            return {
                'has_cookies': False,
                'cookie_count': 0,
                'has_auth_token': False,
                'expires_at': None
            }
        
        # Find li_at cookie (LinkedIn's auth token)
        li_at = next((c for c in self.cookies if c.get('name') == 'li_at'), None)
        
        expires_at = None
        if li_at and 'expires' in li_at:
            try:
                expires_at = datetime.fromtimestamp(li_at['expires']).isoformat()
            except:
                pass
        
        return {
            'has_cookies': True,
            'cookie_count': len(self.cookies),
            'has_auth_token': li_at is not None,
            'expires_at': expires_at
        }
    
    def is_expired(self) -> bool:
        """Check if cookies are expired"""
        li_at = next((c for c in self.cookies if c.get('name') == 'li_at'), None)
        
        if not li_at or 'expires' not in li_at:
            return True
        
        try:
            expires_timestamp = li_at['expires']
            current_timestamp = datetime.now().timestamp()
            return current_timestamp >= expires_timestamp
        except:
            return True

# Global session manager instance
_session_manager: Optional[LinkedInSessionManager] = None

def get_session_manager() -> LinkedInSessionManager:
    """Get or create global session manager"""
    global _session_manager
    if _session_manager is None:
        _session_manager = LinkedInSessionManager()
    return _session_manager
