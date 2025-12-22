
"""OpenAI-powered comment generation for LinkedIn posts."""
import os
from openai import OpenAI

import json

def generate_openai_comment(post_input, author_input=None) -> dict:
    """Generate comments or skip based on strict rules.
    
    Returns:
        dict: {"action": "COMMENT"|"SKIP", "comment": "...", "reason": "..."}
    """
    if isinstance(post_input, dict):
        post_text = post_input.get("text", "")
        author_name = post_input.get("author", "")
    else:
        post_text = str(post_input)
        author_name = author_input

    # User requested COMPULSORY comments.
    # If no API key or error, use professional fallbacks instead of skipping.
    
    fallback_comments = [
        "Thanks for sharing this insight.",
        "Great update, wishing you continued success.",
        "Valuable perspective, thanks for posting.",
        "Appreciate you sharing this.",
        "Well said, thanks for the post."
    ]
    import random

    # User requested COMPULSORY comments with USERNAME MENTION.
    # Fallback templates now include placeholders for the author's name.
    
    fallback_templates = [
        "Thanks for sharing this insight, {name}.",
        "Great update, {name}. Wishing you continued success.",
        "Valuable perspective, {name}. Thanks for posting.",
        "Appreciate you sharing this, {name}.",
        "Well said, {name}."
    ]
    import random

    api_key = os.getenv("OPENAI_API_KEY")
    
    def get_fallback(author):
        name = author if author else "there"
        # Ensure we just use the first name to be polite but professional
        if " " in name:
            name = name.split(" ")[0]
        template = random.choice(fallback_templates)
        return template.format(name=name)

    if not api_key:
        print("  [WARN] No OpenAI API Key found. Using personalized fallback.")
        return {"action": "COMMENT", "comment": get_fallback(author_name), "reason": "Fallback (No Key)"}
    
    try:
        client = OpenAI(api_key=api_key)
        
        prompt = f"""You are an Elite LinkedIn Professional Engagement Strategist.

Your mission: Generate thoughtful, insightful comments that position the user as a respected industry thought leader and encourage meaningful dialogue.

CRITICAL DIRECTIVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For ANY post that is NOT sensitive/controversial, YOU MUST GENERATE A HIGH-QUALITY COMMENT.
 Engagement is COMPULSORY for safe, professional content. 
 If the post is safe, DO NOT return SKIP.

STRICT CONTENT SAFETY RULES (SKIP ONLY IF DETECTED):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 ONLY SKIP posts containing:
   • Political opinions, government criticism, or policy debates
   • Religious beliefs, debates, or spiritual topics
   • Race, caste, ethnicity, nationality-based discussions
   • Gender, sexuality, identity politics, or social movements
   • Hate speech, sarcasm, trolling, or personal attacks
   • Controversial opinions or emotionally polarizing content
   • Negative sentiment, complaints, rants, or criticisms
   • Sensitive protests, activism, or cultural debates

If ANY of these are detected → Return: {{ "action": "SKIP", "reason": "Sensitive/controversial content detected" }}

✅ COMPULSORY ENGAGEMENT (DO NOT SKIP) for professional content:
   • Career achievements, promotions, new roles
   • Company milestones, product launches
   • Industry insights, trends, innovation
   • Tech, AI, SaaS, automation, business strategy
   • Learning, certifications, skill development
   • Conferences, events, speaking engagements
   • Hiring, job opportunities, team growth
   • Success stories, case studies
   • General professional thoughts, productivity tips, business advice

COMMENT EXCELLENCE STANDARDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your comments MUST be:

1. HIGHLY PROFESSIONAL & INSIGHTFUL
   ✓ Add genuine value or perspective
   ✓ Show domain knowledge
   ✓ Be conversation-worthy (encourage replies)
   ✓ Sound like a senior professional, not a bot
   
2. PERSONALIZED & ENGAGING
   ✓ Address author by first name: "{author_name}"
   ✓ YOU MUST include the author's name professionally.
   ✓ Reference specific points from their post
   ✓ Ask thoughtful follow-up questions (optional)
   ✓ Share brief relevant experience or perspective
   
3. TONE & STYLE:
   ✓ Warm yet professional
   ✓ Confident yet humble
   ✓ Enthusiastic yet measured
   ✗ NO generic praise ("Great post!", "Nice!")
   ✗ NO excessive emojis or casual slang
   ✗ NO marketing spam or self-promotion
   ✗ NO controversial questions or criticism

4. LENGTH & FORMAT:
   • 2-3 concise, impactful sentences
   • Max 300 characters
   • Natural, conversational flow
   • Professional punctuation

5. REPLY-WORTHY TACTICS:
   ✓ Ask a thoughtful question related to their post
   ✓ Share a complementary insight or perspective  
   ✓ Reference an interesting point they made

OUTPUT FORMAT (MANDATORY JSON):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{
  "action": "COMMENT" | "SKIP",
  "comment": "Your thoughtful, professional comment here",
  "reason": "Brief explanation if SKIP"
}}

Post Author: {author_name}
Post Content:
{post_text[:1000]}

Generate a comment that will make {author_name} want to reply. Engagement is MUST for this post if it is not controversial.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You represent a professional brand. Engagement is compulsory for all non-controversial professional posts. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=250,
            temperature=0.7
        )
        
        content = response.choices[0].message.content.strip()
        result = json.loads(content)
        return result
        
    except Exception as e:
        print(f"OpenAI generation failed: {e}")
        # Compulsory comment fallback with personalization
        fallback = get_fallback(author_name)
        return {"action": "COMMENT", "comment": fallback, "reason": "Fallback (Error)"}
