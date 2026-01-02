
from .utils import contains_any

def is_sponsored_or_promotional(text: str) -> bool:
    """Check if text is sponsored or promotional."""
    promo_kw = [
        "sponsored", "promoted", "paid partnership", "promo", "#ad", "ad:", "ad -",
        "buy now", "shop", "discount", "free trial", "subscribe", "book now",
        "schedule a call", "work with me", "hire", "apply now", "open position",
        "visit", "click here", "sign up", "limited time", "sale",
    ]
    return contains_any(text, promo_kw)

def contains_sensitive_topics(text: str) -> bool:
    """Check if text contains sensitive topics."""
    sensitive = [
        "race", "religion", "caste", "politic", "politics", "abortion", "sexual",
        "gender", "transgender", "sexual orientation", "lgbt", "homophobia",
        "racist", "sexist", "kill", "violence", "war", "protest", "terror",
        "slur", "hate speech", "racism", "sexism",
    ]
    return contains_any(text, sensitive)

def is_promotional_or_link_heavy(text: str) -> bool:
    """Check if text is promotional or link-heavy."""
    if contains_any(text, ["http://", "https://", "#ad", "link in bio"]):
        return True
    return is_sponsored_or_promotional(text)

def safe_to_like(post_input, author_input=None, safe_mode=False):
    """
    Check if it is safe to like the post.
    Args:
        post_input: dict (post_item) or str (text)
        author_input: str (author name), optional if post_input is dict
        safe_mode: bool, enforce stricter checks
    Returns:
        (bool, str): (is_safe, reason)
    """
    if isinstance(post_input, dict):
        text = post_input.get("text", "")
        author = post_input.get("author", "")
    else:
        text = str(post_input)
        author = author_input or ""
    
    # Basic checks
    if is_sponsored_or_promotional(text) or is_sponsored_or_promotional(author):
        return False, "Promotional/Sponsored content"
    
    if contains_sensitive_topics(text) or contains_sensitive_topics(author):
        return False, "Sensitive topic"
    
    if is_promotional_or_link_heavy(text):
        return False, "Link heavy or promotional"

    # In safe_mode, could add more strict checks here
    if safe_mode:
        # Placeholder for language detection or stricter filtering
        if len(text) < 20: 
            return False, "Text too short in safe mode"

    return True, "OK"

def safe_to_comment(post_item, comment_candidate, safe_mode=False):
    """
    Check if a candidate comment is safe to post.
    Args:
        post_item: dict
        comment_candidate: str
        safe_mode: bool
    Returns:
        (bool, float, str): (is_safe, score, reason)
    """
    text = post_item.get("text", "")
    
    # Check comment for bad words
    if contains_sensitive_topics(comment_candidate):
        return False, 0.0, "Comment contains sensitive words"
    
    # Helper to check if comment seems generic
    generic_phrases = ["great post", "thanks for sharing", "good job", "nice", "interesting"]
    lower_cand = comment_candidate.lower()
    if len(comment_candidate.split()) < 3 and any(g in lower_cand for g in generic_phrases):
         return False, 0.1, "Comment too generic"
         
    # Safety checks on the original post again to be sure
    safe_post, reason = safe_to_like(post_item, safe_mode=safe_mode)
    if not safe_post:
        return False, 0.0, f"Post unsafe: {reason}"

    return True, 0.9, "OK"
