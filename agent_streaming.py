"""Agent Streaming Module - Captures screenshots and sends to dashboard via HTTP."""

import json
import base64
import os
import requests
from typing import Optional

class AgentStreamingRunner:
    """Handles streaming browser screenshots to dashboard via HTTP."""
    
    def __init__(self, agent_name: str = 'agent'):
        self.agent_name = agent_name
        self.page = None
        self.api_url = os.getenv('DASHBOARD_API_URL', 'http://localhost:4000')
        self.connected = False
    
    def connect(self) -> bool:
        """Verify dashboard API is reachable."""
        try:
            response = requests.get(f"{self.api_url}/api/health", timeout=2)
            if response.status_code == 200:
                self.connected = True
                self.send_log('Connected to dashboard', 'success')
                return True
            return False
        except Exception as e:
            print(f"Dashboard API connection failed: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from dashboard."""
        self.connected = False
        self.send_log('Agent disconnected', 'info')
    
    def set_page(self, page):
        """Set Playwright page for screenshots."""
        self.page = page
    
    def send_log(self, message: str, log_type: str = 'info'):
        """Send log message to dashboard."""
        if not self.connected:
            return
        try:
            requests.post(
                f"{self.api_url}/api/stream/broadcast",
                json={
                    'type': 'log',
                    'agent': self.agent_name,
                    'message': message,
                    'logType': log_type
                },
                timeout=1
            )
        except:
            pass
    
    def send_action(self, action: str, target: str, details: dict = None):
        """Send action report to dashboard."""
        if not self.connected:
            return
        try:
            requests.post(
                f"{self.api_url}/api/stream/broadcast",
                json={
                    'type': 'action',
                    'agent': self.agent_name,
                    'action': action,
                    'target': target,
                    'details': details or {}
                },
                timeout=1
            )
        except:
            pass
    
    def capture_and_send(self):
        """Capture screenshot and send to dashboard via HTTP."""
        if not self.page or not self.connected:
            return
        
        try:
            screenshot_bytes = self.page.screenshot(type='jpeg', quality=60)
            base64_image = base64.b64encode(screenshot_bytes).decode('utf-8')
            
            requests.post(
                f"{self.api_url}/api/stream/broadcast",
                json={
                    'type': 'screenshot',
                    'agent': self.agent_name,
                    'image': base64_image
                },
                timeout=2
            )
        except Exception as e:
            print(f"Screenshot error: {e}")
