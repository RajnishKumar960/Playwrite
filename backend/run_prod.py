"""Start the Playwright API in a production-like way (waitress) and optionally open an ngrok tunnel.

Usage:
  python run_prod.py

Environment variables supported:
- PLAY_API_KEY=your_api_key (recommended)
- PLAY_API_PORT (defaults to 4000)
- NGROK_AUTHTOKEN (optional) — if set, will start a public ngrok tunnel automatically
"""
import os
import sys
import time

try:
    from waitress import serve
except Exception:
    print("waitress not installed — please run: pip install waitress")
    sys.exit(1)

NGROK_ENABLED = bool(os.getenv('NGROK_AUTHTOKEN'))

if NGROK_ENABLED:
    try:
        from pyngrok import ngrok
    except Exception:
        print("pyngrok not installed — please run: pip install pyngrok")
        NGROK_ENABLED = False

from play_api import app

PORT = int(os.getenv('PLAY_API_PORT', 4000))

if __name__ == '__main__':
    public_url = None
    if NGROK_ENABLED:
        ngrok.set_auth_token(os.getenv('NGROK_AUTHTOKEN'))
        http_tunnel = ngrok.connect(PORT)
        public_url = http_tunnel.public_url
        print(f"ngrok tunnel started at: {public_url}")

    print(f"Starting Playwright API on port {PORT} — serving via waitress...")
    # serve(app, host='0.0.0.0', port=PORT)  # blocking call
    # Run serve in the main thread
    serve(app, host='0.0.0.0', port=PORT)
