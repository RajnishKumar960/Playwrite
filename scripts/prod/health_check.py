"""Health check script for production monitoring.

This script verifies that all critical components are working:
- Environment variables loaded
- Database initialized  
- LinkedIn credentials present
- Google Sheets access (if configured)
"""

import os
import sys
from dotenv import load_dotenv

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from state_store import init_db


def check_environment():
    """Check environment variables."""
    print("🔍 Checking environment variables...")
    
    load_dotenv()
    
    required_vars = ['LINKEDIN_EMAIL', 'LINKEDIN_PASSWORD']
    optional_vars = ['OPENAI_API_KEY', 'GOOGLE_SHEET_ID', 'GOOGLE_SERVICE_ACCOUNT_FILE', 'PLAY_API_KEY']
    
    all_good = True
    
    for var in required_vars:
        if os.getenv(var):
            print(f"   ✅ {var}: Set")
        else:
            print(f"   ❌ {var}: Missing")
            all_good = False
    
    for var in optional_vars:
        if os.getenv(var):
            print(f"   ✅ {var}: Set")
        else:
            print(f"   ⚠️  {var}: Not set (optional)")
    
    return all_good


def check_database():
    """Check database initialization."""
    print("\n🔍 Checking database...")
    
    try:
        init_db()
        print("   ✅ Database initialized successfully")
        return True
    except Exception as e:
        print(f"   ❌ Database error: {e}")
        return False


def check_google_sheets():
    """Check Google Sheets access."""
    print("\n🔍 Checking Google Sheets integration...")
    
    sa_file = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
    sheet_id = os.getenv('GOOGLE_SHEET_ID')
    
    if not sa_file:
        print("   ⚠️  GOOGLE_SERVICE_ACCOUNT_FILE not set (optional)")
        return True
    
    if not os.path.exists(sa_file):
        print(f"   ❌ Service account file not found: {sa_file}")
        return False
    
    try:
        import gspread
        from google.oauth2.service_account import Credentials
        
        scope = ["https://www.googleapis.com/auth/spreadsheets"]
        creds = Credentials.from_service_account_file(sa_file, scopes=scope)
        gc = gspread.authorize(creds)
        
        print(f"   ✅ Service account authenticated")
        
        if sheet_id:
            sh = gc.open_by_key(sheet_id)
            print(f"   ✅ Google Sheet accessible: {sh.title}")
        else:
            print(f"   ⚠️  GOOGLE_SHEET_ID not set")
        
        return True
        
    except ImportError:
        print("   ⚠️  gspread not installed (optional)")
        return True
    except Exception as e:
        print(f"   ❌ Google Sheets error: {e}")
        return False


def main():
    """Run all health checks."""
    print("=" * 60)
    print("LinkedIn Automation - Health Check")
    print("=" * 60)
    
    results = []
    
    results.append(check_environment())
    results.append(check_database())
    results.append(check_google_sheets())
    
    print("\n" + "=" * 60)
    if all(results):
        print("✅ All health checks passed!")
        print("=" * 60)
        return 0
    else:
        print("❌ Some health checks failed. Please review the output above.")
        print("=" * 60)
        return 1


if __name__ == '__main__':
    sys.exit(main())
