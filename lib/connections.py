"""LinkedIn connections scraper for tagging in comments."""
import random
from typing import List, Dict

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


def send_connection_request(page, profile_url: str, note: str = "") -> Dict:
    """
    Send a connection request to a LinkedIn profile.
    
    Args:
        page: Playwright page object
        profile_url: LinkedIn profile URL
        note: Optional personal note
        
    Returns:
        Dict with status (sent, failed, pending) and reason
    """
    import time
    from lib.utils import human_sleep
    
    result = {"status": "failed", "reason": ""}
    
    try:
        # 1. Strictly scope to the profile top card area
        top_card_selector = "div.pv-top-card, section.pv-top-card-section, main.scaffold-layout__main"
        top_card = page.locator(top_card_selector).first
        
        # 2. Check for 'Connect' button directly on the face of the profile
        connect_btn = top_card.locator("button:has-text('Connect'), button[aria-label*='Connect']").first
        
        if connect_btn.count() == 0 or not connect_btn.is_visible():
            # 'Connect' not in front. As per user instruction & screenshot, try 'More' button
            print("  ○ 'Connect' button not in front. Checking 'More' menu...")
            more_btn_selectors = [
                "button:has-text('More')",
                "button[aria-label*='More actions']",
                "button.artdeco-dropdown__trigger[aria-label*='More']"
            ]
            
            more_btn = None
            for sel in more_btn_selectors:
                try:
                    mbtn = top_card.locator(sel).first
                    if mbtn.count() > 0 and mbtn.is_visible():
                        more_btn = mbtn
                        break
                except Exception:
                    continue
            
            if more_btn:
                more_btn.click()
                human_sleep(0.8, 1.2)
                
                # 3. Look for 'Connect' inside the newly opened dropdown
                # Use very robust selectors for the dropdown content
                dropdown_connect_selectors = [
                    "div.artdeco-dropdown__content--visible [role='button']:has-text('Connect')",
                    "div.artdeco-dropdown__content--visible li:has-text('Connect')",
                    "div.artdeco-dropdown__content--visible span:has-text('Connect')",
                    "div.artdeco-dropdown__content [role='button']:has-text('Connect')",
                    "li:has-text('Connect') [role='button']"
                ]
                
                for dsel in dropdown_connect_selectors:
                    try:
                        dbtn = page.locator(dsel).first
                        if dbtn.count() > 0 and dbtn.is_visible():
                            connect_btn = dbtn
                            print("  ✓ Found 'Connect' in 'More' menu.")
                            break
                    except Exception:
                        continue
        
        # 4. If still no 'Connect', check for 'Follow' as a last resort front-facing action
        if connect_btn.count() == 0 or not connect_btn.is_visible():
            follow_btn = top_card.locator("button:has-text('Follow'), button[aria-label*='Follow']").first
            if follow_btn.count() > 0 and follow_btn.is_visible():
                print("  ○ Only 'Follow' found in front. Clicking 'Follow'...")
                follow_btn.click()
                human_sleep(1, 2)
                # After following, sometimes Connect appears in front or More. Recurse once.
                return send_connection_request(page, profile_url, note)
            
        # 5. Execute Connect if found
        if connect_btn and connect_btn.count() > 0 and connect_btn.is_visible():
            connect_btn.click()
            human_sleep(1.0, 1.5)
            
            # Check for "How do you know" dialog (Global)
            try:
                know_selectors = ["button[aria-label='Other']", "label:has-text('Other')", "span:has-text('Other')"]
                for ksel in know_selectors:
                    option = page.locator(ksel).first
                    if option.count() > 0 and option.is_visible():
                        option.click()
                        human_sleep(0.5)
                        page.locator("button:has-text('Connect')").click()
                        human_sleep(0.5)
                        break
            except Exception:
                pass
            
            # Look for "Add a note" button - this is a global modal
            try:
                add_note = page.locator("button:has-text('Add a note')").first
                if add_note.count() > 0 and note:
                    add_note.click()
                    human_sleep(0.5, 1.0)
                    page.locator("textarea[name='message']").fill(note)
                    human_sleep(0.5, 1.0)
                    page.locator("button:has-text('Send')").click()
                    result["status"] = "pending"
                    print(f"  ✓ Connection request sent with note to {profile_url}")
                else:
                    # Send without note
                    send_btn = page.locator("button:has-text('Send without a note'), button:has-text('Send')").first
                    if send_btn.count() > 0:
                        send_btn.click()
                        result["status"] = "pending"
                        print(f"  ✓ Connection request sent (no note) to {profile_url}")
                    else:
                        result["reason"] = "Could not find Send button"
            except Exception as e:
                result["reason"] = f"Error sending: {str(e)}"
        else:
            # Check if already pending within top card
            pending_selectors = [
                "button:has-text('Pending')",
                "button:has-text('Requested')",
                "button[aria-label*='Pending']",
            ]
            if top_card.count() > 0:
                for sel in pending_selectors:
                    if top_card.locator(sel).count() > 0:
                        result["status"] = "pending"
                        result["reason"] = "Already pending"
                        return result
            
            result["reason"] = "Connect button not found"
            
    except Exception as e:
        result["reason"] = str(e)
        
    return result


def generate_connection_note(profile_name: str, bio_text: str = "") -> str:
    """
    Generate a personalized LinkedIn connection note using OpenAI.
    
    Args:
        profile_name: Name of the person
        bio_text: Bio/About text or headline
        
    Returns:
        Personalized note (max 300 chars)
    """
    from openai import OpenAI
    import os
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return ""
        
    client = OpenAI(api_key=api_key)
    
    # Extract first name
    first_name = profile_name.split(" ")[0] if profile_name else ""
    
    prompt = f"""Generate a warm, professional LinkedIn connection request note.
    
    Recipient Name: {profile_name}
    Headline/Bio Content: {bio_text[:1000]}
    
    Rules:
    1. Maximum 250 characters (LinkedIn limit is 300).
    2. Be professional, personalized, and genuine.
    3. Reference their work/headline if provided.
    4. NO generic sales pitch.
    5. Start with "Hi {first_name}," if name is provided.
    6. End with "Best, [My Name]" placeholder.
    
    Output ONLY the note text.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional outreach expert."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200
        )
        note = response.choices[0].message.content.strip()
        # Remove any quotes the AI might have added
        if note.startswith('"') and note.endswith('"'):
            note = note[1:-1]
        return note
    except Exception as e:
        print(f"Error generating note: {e}")
        return ""
