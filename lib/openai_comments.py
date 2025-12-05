"""OpenAI-powered comment generation for LinkedIn posts."""
import os
from openai import OpenAI

def generate_openai_comment(post_text: str, author_name: str | None = None) -> str:
    """Generate a professional, contextual comment using OpenAI.
    
    Args:
        post_text: The content of the LinkedIn post
        author_name: The name of the post author (optional)
    
    Returns:
        A professional, contextual comment (1-2 sentences)
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Fallback to simple comment if no API key
        return "Great insights! Thanks for sharing this."
    
    try:
        client = OpenAI(api_key=api_key)
        
        # Create a prompt for generating a professional LinkedIn comment
        prompt = f"""You are a professional LinkedIn user. Generate a short, professional comment (1-2 sentences, max 150 characters) for the following LinkedIn post.

Rules:
- Be professional and positive
- Be specific to the post content (not generic)
- Do NOT use emojis
- Do NOT ask questions
- Do NOT promote yourself
- Keep it concise and genuine
- If the author name is provided, you may optionally personalize it

Post content:
{post_text[:500]}

{f'Author: {author_name}' if author_name else ''}

Generate only the comment text, nothing else:"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional LinkedIn commenter. Generate concise, professional, and contextual comments."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        comment = response.choices[0].message.content.strip()
        
        # Remove quotes if OpenAI wrapped it
        if comment.startswith('"') and comment.endswith('"'):
            comment = comment[1:-1]
        if comment.startswith("'") and comment.endswith("'"):
            comment = comment[1:-1]
        
        # Ensure it's not too long
        if len(comment) > 200:
            comment = comment[:197] + "..."
        
        return comment
        
    except Exception as e:
        print(f"OpenAI comment generation failed: {e}")
        # Fallback to simple comment
        return "Great insights! Thanks for sharing this."
