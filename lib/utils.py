import time
import random

def human_sleep(seconds: float):
    """Sleep with slight randomness for human-like behavior."""
    # Add random variation of +/- 15%
    variation = seconds * 0.15
    sleep_time = seconds + random.uniform(-variation, variation)
    if sleep_time < 0:
        sleep_time = 0.1
    time.sleep(sleep_time)

def smooth_scroll(page, distance: int, steps: int = 15, delay: float = 0.05):
    """Scroll smoothly ensuring 'seamless' behavior."""
    for _ in range(steps):
        # Scroll a fraction of the distance
        step_y = distance / steps
        # Add small random jitter to x/y to look human
        page.mouse.wheel(0, step_y)
        human_sleep(delay)

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
