"""
Google Service Account Authentication Helper
Handles both file-based and environment variable-based service account credentials.
"""
import os
import json
import tempfile
from pathlib import Path

def get_service_account_path():
    """
    Get the path to the Google Service Account JSON file.
    Supports both:
    1. Direct file path via GOOGLE_SERVICE_ACCOUNT_FILE env var
    2. JSON string via GOOGLE_SERVICE_ACCOUNT_JSON env var (converted to temp file)
    
    Returns:
        str: Path to the service account JSON file, or None if not configured
    """
    # Option 1: Direct file path
    sa_file = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
    if sa_file and Path(sa_file).exists():
        return sa_file
    
    # Option 2: JSON string from environment variable (for Render deployment)
    sa_json_str = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
    if sa_json_str:
        try:
            # Parse to validate it's proper JSON
            sa_data = json.loads(sa_json_str)
            
            # Write to temporary file
            temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False)
            json.dump(sa_data, temp_file)
            temp_file.close()
            
            return temp_file.name
        except json.JSONDecodeError as e:
            print(f"⚠️  Invalid JSON in GOOGLE_SERVICE_ACCOUNT_JSON: {e}")
            return None
    
    # Option 3: Default file in project root
    default_path = 'service_account.json'
    if Path(default_path).exists():
        return default_path
    
    return None
