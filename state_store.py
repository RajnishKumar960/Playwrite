
import json
import os
import threading

STATE_FILE = "state_store.json"
_lock = threading.Lock()

def _load_state():
    if not os.path.exists(STATE_FILE):
        return []
    try:
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
            return []
    except Exception:
        return []

def _save_state(data):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def has_processed(post_id) -> bool:
    """Check if a post ID has already been processed."""
    pid = str(post_id)
    with _lock:
        data = _load_state()
        return pid in data

def mark_processed(post_id):
    """Mark a post ID as processed."""
    pid = str(post_id)
    with _lock:
        data = _load_state()
        if pid not in data:
            data.append(pid)
            _save_state(data)

def get_all():
    """Return all processed IDs."""
    with _lock:
        return _load_state()
