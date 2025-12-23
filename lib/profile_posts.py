"""Profile posts scraper for LinkedIn.

This module provides functions to navigate to a LinkedIn profile and
scrape their recent posts from the Activity section.
"""

from playwright.sync_api import Page
from typing import List, Dict, Optional
import re
from lib.utils import human_sleep


def navigate_to_profile(page: Page, profile_url: str, timeout: int = 15000) -> bool:
    """
    Navigate to a LinkedIn profile page.
    
    Args:
        page: Playwright page object
        profile_url: LinkedIn profile URL
        timeout: Navigation timeout in milliseconds
    
    Returns:
        True if navigation successful and profile loaded
    """
    try:
        if page.is_closed():
            print("Error: Targeted page is already closed.")
            return False
            
        # Normalize URL
        if not profile_url.startswith("http"):
            profile_url = f"https://{profile_url}"
        
        # Ensure it's a LinkedIn profile URL
        if "linkedin.com/in/" not in profile_url.lower():
            print(f"Invalid LinkedIn profile URL: {profile_url}")
            return False
        
        page.goto(profile_url, wait_until="domcontentloaded", timeout=timeout)
        human_sleep(2, 3)
        
        # Wait for profile content to load
        try:
            page.wait_for_selector(
                "section.artdeco-card, div.pv-top-card, main.scaffold-layout__main",
                timeout=10000
            )
        except Exception:
            # Profile might have different structure
            pass
        
        # Check if we're on a valid profile page
        current_url = page.url.lower()
        if "/in/" in current_url or "/pub/" in current_url:
            print(f"✓ Navigated to profile: {profile_url}")
            return True
        
        # Check for login wall or error
        if "/login" in current_url or "/authwall" in current_url:
            print("Hit login wall - session may have expired")
            return False
        
        return True
        
    except Exception as e:
        print(f"Error navigating to profile: {e}")
        return False


def find_activity_section(page: Page) -> bool:
    """
    Find and scroll to the Activity section on a profile.
    
    Returns:
        True if activity section found
    """
    try:
        # Try to find Activity section link or header
        activity_selectors = [
            "a[href*='/recent-activity/']",
            "a[href*='/detail/recent-activity/']",
            "section#recent-activity",
            "div[data-test-id='recent-activity']",
            "button:has-text('Show all activity')",
            "a:has-text('Show all activity')",
            "span:has-text('Activity')",
        ]
        
        for selector in activity_selectors:
            try:
                locator = page.locator(selector)
                if locator.count() > 0:
                    # Scroll to element
                    locator.first.scroll_into_view_if_needed()
                    human_sleep(0.5)
                    return True
            except Exception:
                continue
        
        # If no activity section, scroll down to look for posts
        page.evaluate("window.scrollBy(0, 500)")
        human_sleep(1)
        
        return False
        
    except Exception as e:
        print(f"Error finding activity section: {e}")
        return False


def navigate_to_activity_page(page: Page) -> bool:
    """
    Navigate to the full Activity page for a profile.
    
    Returns:
        True if successfully navigated to activity page
    """
    try:
        current_url = page.url
        
        # Build activity URL from profile URL
        # e.g., linkedin.com/in/johndoe -> linkedin.com/in/johndoe/recent-activity/all/
        if "/in/" in current_url:
            base_url = current_url.split("?")[0].rstrip("/")
            activity_url = f"{base_url}/recent-activity/all/"
            
            page.goto(activity_url, wait_until="domcontentloaded", timeout=15000)
            human_sleep(2, 3)
            
            # Check if we're on activity page
            if "recent-activity" in page.url:
                print("✓ Navigated to activity page")
                return True
        
        # Try clicking "Show all activity" button
        show_all_selectors = [
            "a:has-text('Show all activity')",
            "button:has-text('Show all activity')",
            "a:has-text('See all activity')",
            "a[href*='recent-activity']",
        ]
        
        for selector in show_all_selectors:
            try:
                locator = page.locator(selector)
                if locator.count() > 0 and locator.first.is_visible():
                    locator.first.click()
                    human_sleep(2)
                    return True
            except Exception:
                continue
        
        return False
        
    except Exception as e:
        print(f"Error navigating to activity page: {e}")
        return False


def get_posts_from_activity_page(page: Page, max_posts: int = 5) -> List[Dict]:
    """
    Scrape posts from the activity/posts page.
    
    Args:
        page: Playwright page object (should be on activity page)
        max_posts: Maximum number of posts to scrape
    
    Returns:
        List of post dicts with text, date, reactions, etc.
    """
    posts = []
    
    # Post container selectors for activity page
    post_selectors = [
        "div.feed-shared-update-v2",
        "div.occludable-update",
        "article.feed-shared-update-v2",
        "div[data-urn*='activity']",
    ]
    
    try:
        # Wait for posts to load
        page.wait_for_timeout(2000)
        
        seen_texts = set()
        
        for selector in post_selectors:
            try:
                containers = page.locator(selector)
                count = containers.count()
                
                for i in range(min(count, max_posts * 2)):  # Check more to filter duplicates
                    if len(posts) >= max_posts:
                        break
                    
                    try:
                        container = containers.nth(i)
                        
                        # Get post text
                        text = ""
                        text_selectors = [
                            "div.feed-shared-update-v2__description",
                            "span.break-words",
                            "div.update-components-text",
                            "div.feed-shared-text",
                        ]
                        
                        for ts in text_selectors:
                            try:
                                text_el = container.locator(ts)
                                if text_el.count() > 0:
                                    text = text_el.first.inner_text()[:1000]
                                    if text:
                                        break
                            except Exception:
                                continue
                        
                        if not text:
                            # Get any visible text
                            text = container.inner_text()[:500]
                        
                        # Skip if we've seen similar text
                        text_hash = hash(text[:100])
                        if text_hash in seen_texts:
                            continue
                        seen_texts.add(text_hash)
                        
                        # Skip if too short (probably not a real post)
                        if len(text.strip()) < 20:
                            continue
                        
                        # Get reactions count
                        reactions = 0
                        try:
                            reaction_el = container.locator(
                                "span.social-details-social-counts__reactions-count, "
                                "button[aria-label*='reaction']"
                            )
                            if reaction_el.count() > 0:
                                reaction_text = reaction_el.first.inner_text()
                                reactions = _parse_count(reaction_text)
                        except Exception:
                            pass
                        
                        # Get comments count
                        comments = 0
                        try:
                            comments_el = container.locator(
                                "button[aria-label*='comment'], "
                                "span:has-text('comment')"
                            )
                            if comments_el.count() > 0:
                                comments_text = comments_el.first.inner_text()
                                comments = _parse_count(comments_text)
                        except Exception:
                            pass
                        
                        # Get post date
                        date = ""
                        try:
                            time_el = container.locator(
                                "time, span.feed-shared-actor__sub-description, "
                                "span.update-components-actor__sub-description"
                            )
                            if time_el.count() > 0:
                                date = time_el.first.inner_text()
                        except Exception:
                            pass
                        
                        # Get post URL
                        post_url = ""
                        try:
                            link_el = container.locator("a[href*='activity'], a[href*='posts']")
                            if link_el.count() > 0:
                                post_url = link_el.first.get_attribute("href") or ""
                                if post_url.startswith("/"):
                                    post_url = f"https://www.linkedin.com{post_url}"
                        except Exception:
                            pass
                        
                        post = {
                            "text": text.strip(),
                            "date": date,
                            "reactions_count": reactions,
                            "comments_count": comments,
                            "post_url": post_url,
                            "index": i,
                            "el": container,  # Keep reference for engagement
                        }
                        
                        posts.append(post)
                        
                    except Exception as e:
                        continue
                
                if posts:
                    break  # Found posts with this selector
                    
            except Exception:
                continue
        
    except Exception as e:
        print(f"Error scraping posts: {e}")
    
    return posts[:max_posts]


def is_post_recent(date_str: str, max_days: int = 2) -> bool:
    """
    Check if a post is recent (within max_days).
    
    LinkedIn shows dates like: "1d", "2d", "1w", "1mo", "Just now", "1h", etc.
    
    Args:
        date_str: The date string from LinkedIn
        max_days: Maximum age in days to consider "recent"
    
    Returns:
        True if post is within max_days
    """
    if not date_str:
        return True  # If no date, assume it might be recent
    
    date_lower = date_str.lower().strip()
    
    # Very recent indicators
    if any(x in date_lower for x in ["just now", "now", "second", "minute", "hour", "1h", "2h", "3h", "4h", "5h", "6h"]):
        return True
    
    # Check for hours (up to 23h is same day)
    if "h" in date_lower and "mo" not in date_lower:
        try:
            hours = int(re.search(r'(\d+)', date_lower).group(1))
            return hours <= 48  # Within 2 days in hours
        except:
            return True
    
    # Check for days
    if "d" in date_lower and "edited" not in date_lower:
        try:
            days = int(re.search(r'(\d+)', date_lower).group(1))
            return days <= max_days
        except:
            return False
    
    # Weeks, months, years are too old
    if any(x in date_lower for x in ["w", "week", "mo", "month", "yr", "year"]):
        return False
    
    # Default: if uncertain, include it
    return True


def get_recent_posts(page: Page, max_posts: int = 5, max_days: int = 2) -> List[Dict]:
    """
    Get recent posts from a profile. Tries activity page first,
    then falls back to profile page posts.
    
    Only returns posts within max_days (default: 2 days).
    
    Args:
        page: Playwright page object (should be on profile page)
        max_posts: Maximum number of posts to retrieve
        max_days: Only include posts within this many days
    
    Returns:
        List of post dicts with text, date, reactions, etc.
    """
    posts = []
    
    try:
        # First, try to navigate to activity page
        if navigate_to_activity_page(page):
            all_posts = get_posts_from_activity_page(page, max_posts * 2)  # Get more to filter
        else:
            # Fall back to scraping posts from profile page
            find_activity_section(page)
            all_posts = get_posts_from_activity_page(page, max_posts * 2)
        
        # Filter for recent posts only
        for post in all_posts:
            date_str = post.get("date", "")
            if is_post_recent(date_str, max_days):
                posts.append(post)
                if len(posts) >= max_posts:
                    break
            else:
                print(f"  ○ Skipping old post ({date_str})")
        
        print(f"Found {len(posts)} recent posts (within {max_days} days)")
        return posts
        
    except Exception as e:
        print(f"Error getting recent posts: {e}")
        return []


def get_profile_name(page: Page) -> str:
    """Extract the profile name from the current page."""
    name_selectors = [
        "h1.text-heading-xlarge",
        "h1.pv-top-card-profile-picture__name",
        "div.pv-text-details__left-panel h1",
        "h1",
    ]
    
    for selector in name_selectors:
        try:
            el = page.locator(selector)
            if el.count() > 0:
                name = el.first.inner_text().strip()
                if name and len(name) < 100:  # Sanity check
                    return name
        except Exception:
            continue
    
    return ""


def get_connection_degree(page: Page) -> str:
    """
    Detect the connection degree (1st, 2nd, 3rd) of the profile.
    
    Returns:
        "1st", "2nd", "3rd", or "unknown"
    """
    try:
        # Looking for indicators like "1st", "2nd", "3rd" near name or in top card
        # LinkedIn often uses a span with class "dist-value" or similar
        degree_selectors = [
            "span.dist-value",
            "span.distance-badge span.visually-hidden",
            "span.p-connection-degree",
            "span.pv-top-card-section__distance-badge",
            "span.t-black--light.insider-badge",
        ]
        
        for selector in degree_selectors:
            try:
                el = page.locator(selector)
                if el.count() > 0:
                    text = el.first.inner_text().lower()
                    if "1st" in text: return "1st"
                    if "2nd" in text: return "2nd"
                    if "3rd" in text: return "3rd"
            except Exception:
                continue
        
        # Fallback: check page content for degree indicators near name
        content = page.content()[:5000] # First 5k chars usually contain top card
        if "1st degree connection" in content or "• 1st" in content:
            return "1st"
        if "2nd degree connection" in content or "• 2nd" in content:
            return "2nd"
        if "3rd degree connection" in content or "• 3rd" in content:
            return "3rd"
            
        # Another indicator: Presence of "Message" button usually means 1st
        message_btn = page.locator("button:has-text('Message'), a:has-text('Message')").nth(0)
        if message_btn.count() > 0:
            return "1st"
            
    except Exception:
        pass
        
    return "unknown"


def _parse_count(text: str) -> int:
    """Parse a count string like '1.2K' or '500' to an integer."""
    if not text:
        return 0
    
    text = text.strip().lower()
    
    # Extract just the number part
    match = re.search(r'([\d,.]+)\s*([km])?', text)
    if not match:
        return 0
    
    num_str = match.group(1).replace(",", "")
    multiplier = 1
    
    if match.group(2) == "k":
        multiplier = 1000
    elif match.group(2) == "m":
        multiplier = 1000000
    
    try:
        return int(float(num_str) * multiplier)
    except ValueError:
        return 0
