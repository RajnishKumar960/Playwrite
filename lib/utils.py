import time
import random

def human_sleep(seconds: float):
    """Sleep for a given number of seconds."""
    time.sleep(seconds)

def normalize_text(s: str) -> str:
    """Normalize text to lowercase."""
    return (s or "").lower()

def contains_any(text: str, keywords: list[str]) -> bool:
    """Check if text contains any of the keywords."""
    t = normalize_text(text)
    for k in keywords:
        if k in t:
            return True
    return False
