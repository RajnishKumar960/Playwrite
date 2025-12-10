
"""OpenAI-powered comment generation for LinkedIn posts."""
import os
from openai import OpenAI

def generate_openai_comment(post_input, author_input=None) -> list[str]:
    """Generate professional, contextual comments using OpenAI.
    
    Args:
        post_input: dict (post_item) or str (post_text)
        author_input: str (author name), optional if post_input is dict
    
    Returns:
        List[str]: A list of candidate comments (usually 3).
    """
    if isinstance(post_input, dict):
        post_text = post_input.get("text", "")
        author_name = post_input.get("author", "")
    else:
        post_text = str(post_input)
        author_name = author_input

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return ["Great insights! Thanks for sharing."]
    
    try:
        client = OpenAI(api_key=api_key)
        
        prompt = f"""You are a professional LinkedIn user. Generate 3 DISTINCT, professional, and short comments (1-2 sentences) for the following LinkedIn post.

Rules:
- Output only the 3 comments, separated by "|||"
- Be professional, positive, and specific
- No emojis
- No questions
- No self-promotion
- If author name ({author_name}) is known, you can occasionally use it.

Post content:
{post_text[:600]}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful professional assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        content = response.choices[0].message.content.strip()
        candidates = [c.strip() for c in content.split("|||") if c.strip()]
        
        # Cleanup quotes
        clean_candidates = []
        for c in candidates:
            if c.startswith('"') and c.endswith('"'):
                c = c[1:-1]
            if len(c) > 5:
                clean_candidates.append(c)
                
        if not clean_candidates:
            return ["Thanks for sharing!"]
            
        return clean_candidates[:3]
        
    except Exception as e:
        print(f"OpenAI generation failed: {e}")
        return ["Great point!"]
