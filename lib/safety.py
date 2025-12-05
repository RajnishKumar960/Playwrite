from .utils import contains_any

def is_sponsored_or_promotional(text: str) -> bool:
    """Check if text is sponsored or promotional."""
    # Basic heuristics for sponsored/promotional content; conservative checks
    promo_kw = [
        "sponsored", "promoted", "paid partnership", "promo", "#ad", "ad:", "ad -",
        "buy now", "shop", "discount", "free trial", "subscribe", "book now",
        "schedule a call", "work with me", "hire", "apply now", "open position",
        "visit", "click here", "sign up", "limited time", "sale",
    ]
    return contains_any(text, promo_kw)

def contains_sensitive_topics(text: str) -> bool:
    """Check if text contains sensitive topics."""
    # Topics to avoid: identity/political/sexual content or inflammatory language
    sensitive = [
        "race", "religion", "caste", "politic", "politics", "abortion", "sexual",
        "gender", "transgender", "sexual orientation", "lgbt", "homophobia",
        "racist", "sexist", "kill", "violence", "war", "protest", "terror",
        "slur", "hate speech", "racism", "sexism",
    ]
    return contains_any(text, sensitive)

def is_promotional_or_link_heavy(text: str) -> bool:
    """Check if text is promotional or link-heavy."""
    # If the post contains lots of explicit marketing phrases or many URLs, consider it promotional
    if contains_any(text, ["http://", "https://", "#ad", "link in bio"]):
        return True
    return is_sponsored_or_promotional(text)

def safe_to_like(post_text: str, author_text: str | None) -> bool:
    """Check if it is safe to like the post."""
    # Skip sponsored/promotional or sensitive topics
    if is_sponsored_or_promotional(post_text) or is_sponsored_or_promotional(author_text or ""):
        return False
    if contains_sensitive_topics(post_text) or contains_sensitive_topics(author_text or ""):
        return False
    if is_promotional_or_link_heavy(post_text):
        return False
    # otherwise allow
    return True
