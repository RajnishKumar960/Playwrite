"""LinkedIn connections scraper for tagging in comments."""
import random
from typing import List

def get_random_connections(page, count: int = 4) -> List[str]:
    """Scrape user's LinkedIn connections and return random sample.
    
    Args:
        page: Playwright page object
        count: Number of random connections to return
    
    Returns:
        List of connection names
    """
    connections = []
    
    try:
        # Navigate to connections page
        page.goto("https://www.linkedin.com/mynetwork/invite-connect/connections/", wait_until="domcontentloaded")
        page.wait_for_timeout(2000)
        
        # Scroll to load more connections
        for _ in range(3):
            page.evaluate("window.scrollBy(0, window.innerHeight * 0.8)")
            page.wait_for_timeout(1000)
        
        # Extract connection names
        # LinkedIn uses various selectors for connection names
        name_selectors = [
            "span.mn-connection-card__name",
            "span.discover-person-card__name",
            "a.app-aware-link span[aria-hidden='true']",
            "div.mn-connection-card__details span.mn-connection-card__name"
        ]
        
        for selector in name_selectors:
            try:
                elements = page.locator(selector)
                element_count = elements.count()
                
                for i in range(min(element_count, 50)):  # Limit to first 50
                    try:
                        name = elements.nth(i).inner_text().strip()
                        if name and len(name) > 2 and name not in connections:
                            connections.append(name)
                    except Exception:
                        continue
                        
                if len(connections) >= count * 3:  # Get more than needed for variety
                    break
            except Exception:
                continue
        
        # Return random sample
        if len(connections) >= count:
            return random.sample(connections, count)
        else:
            # If we don't have enough, return what we have
            return connections
            
    except Exception as e:
        print(f"Failed to scrape connections: {e}")
        return []
