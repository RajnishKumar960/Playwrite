
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

def init_db():
    """Ensure DB exists (noop for JSON file as _load_state handles it)."""
    pass

def is_processed(item_id, context="default") -> bool:
    """Check if an item has been processed in a given context."""
    # Create a unique key for item + context
    key = f"{context}:{item_id}"
    return has_processed(key)

def mark_processed(item_id, context="default", status="done"):
    """Mark an item as processed."""
    # We ignore 'status' in this simple JSON store, just marking presence
    key = f"{context}:{item_id}"
    _mark_key_processed(key)

def _mark_key_processed(key):
    k = str(key)
    with _lock:
        data = _load_state()
        if k not in data:
            data.append(k)
            _save_state(data)

def has_processed(key) -> bool:
    """Check if a raw key has already been processed."""
    k = str(key)
    with _lock:
        data = _load_state()
        return k in data

def get_all():
    """Return all processed IDs."""
    with _lock:
        return _load_state()
