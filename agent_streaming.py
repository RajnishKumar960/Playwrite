"""Agent Streaming Module - Captures screenshots and sends to dashboard WebSocket."""

import json
import base64
import os
from typing import Optional

class AgentStreamingRunner:
    """Handles streaming browser screenshots to dashboard."""
    
    def __init__(self, agent_name: str = 'agent'):
        self.agent_name = agent_name
        self.ws = None
        self.page = None
        self.ws_url = os.getenv('DASHBOARD_WS_URL', 'ws://localhost:5000/ws/stream')
    
    def connect(self) -> bool:
        """Connect to dashboard WebSocket."""
        try:
            from websocket import create_connection
            self.ws = create_connection(self.ws_url, timeout=5)
            self.send_log('Connected to dashboard', 'success')
            return True
        except Exception as e:
            print(f"WebSocket connection failed: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from WebSocket."""
        if self.ws:
            try:
                self.ws.close()
            except:
                pass
            self.ws = None
    
    def set_page(self, page):
        """Set Playwright page for screenshots."""
        self.page = page
    
    def send_log(self, message: str, log_type: str = 'info'):
        """Send log message to dashboard."""
        if self.ws:
            try:
                self.ws.send(json.dumps({
                    'type': 'log',
                    'agent': self.agent_name,
                    'message': message,
                    'logType': log_type
                }))
            except:
                pass
    
    def send_action(self, action: str, target: str, details: dict = None):
        """Send action report to dashboard."""
        if self.ws:
            try:
                self.ws.send(json.dumps({
                    'type': 'action',
                    'agent': self.agent_name,
                    'action': action,
                    'target': target,
                    'details': details or {}
                }))
            except:
                pass
    
    def capture_and_send(self):
        """Capture screenshot and send to dashboard (call from main thread)."""
        if not self.page or not self.ws:
            return
        
        try:
            screenshot_bytes = self.page.screenshot(type='jpeg', quality=60)
            base64_image = base64.b64encode(screenshot_bytes).decode('utf-8')
            
            self.ws.send(json.dumps({
                'type': 'screenshot',
                'agent': self.agent_name,
                'image': base64_image
            }))
        except Exception as e:
            print(f"Screenshot error: {e}")
