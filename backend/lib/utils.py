import time
import random

def human_sleep(seconds: float, max_seconds: float = None):
    """Sleep with slight randomness for human-like behavior.
    
    Args:
        seconds: Minimum sleep time (or exact time if max_seconds not provided)
        max_seconds: Optional maximum sleep time for range-based sleeping
    """
    if max_seconds is not None:
        # Range-based sleeping
        sleep_time = random.uniform(seconds, max_seconds)
    else:
        # Add random variation of +/- 15%
        variation = seconds * 0.15
        sleep_time = seconds + random.uniform(-variation, variation)
    
    if sleep_time < 0:
        sleep_time = 0.1
    time.sleep(sleep_time)

def smooth_scroll(page, distance: int, steps: int = 30, delay: float = 0.02):
    """Scroll smoothly ensuring 'seamless' behavior with natural variation."""
    step_y = distance / steps
    for _ in range(steps):
        # Add slight randomness to scrolling speed and distance per step
        variance = random.uniform(0.8, 1.2)
        current_step = step_y * variance
        
        page.mouse.wheel(0, current_step)
        
        # Micro-sleeps with variation
        time.sleep(max(0.005, delay * random.uniform(0.8, 1.5)))

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
