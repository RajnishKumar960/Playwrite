"""Pain Point Analyzer using OpenAI.

This module analyzes LinkedIn posts to extract business pain points,
categorize them, and score engagement opportunities.
"""

import os
import json
from typing import Dict, List, Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


def analyze_pain_points(
    post_text: str,
    author_name: str = "",
    company: str = ""
) -> Dict:
    """
    Analyze a post for business/professional pain points using OpenAI.
    
    Args:
        post_text: The text content of the post
        author_name: Name of the post author
        company: Company of the author (if known)
    
    Returns:
        Dict with:
            - has_pain_point: bool
            - pain_points: List[str] - identified pain points
            - category: str - category (hiring, sales, tech, etc.)
            - sentiment: str - positive/negative/neutral
            - opportunity_score: float - 0.0-1.0 opportunity rating
            - summary: str - brief summary
    """
    default_result = {
        "has_pain_point": False,
        "pain_points": [],
        "category": "general",
        "sentiment": "neutral",
        "opportunity_score": 0.0,
        "summary": ""
    }
    
    if not post_text or len(post_text.strip()) < 20:
        return default_result
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("  [WARN] No OpenAI API Key - cannot analyze pain points")
        return default_result
    
    try:
        client = OpenAI(api_key=api_key)
        
        prompt = f"""You are a Business Intelligence Analyst specializing in identifying sales opportunities from LinkedIn content.

Analyze this LinkedIn post for business pain points, challenges, or opportunities.

PAIN POINT CATEGORIES:
- sales: Revenue challenges, pipeline issues, customer acquisition, sales process inefficiencies
- marketing: Brand awareness, content strategy, social media presence, lead generation challenges
- paid_promotion: Ad spend inefficiency, low ROI on ads, scaling ad campaigns
- ai_agents: Manual workflow bottlenecks, repetitive tasks, need for AI automation/agents
- web_development: Outdated website, poor conversion, mobile responsiveness issues, technical debt
- outreach: Low response rates, booking meetings, finding quality leads, prospecting challenges
- general: Other professional challenges or growth opportunities

ANALYSIS RULES:
1. Identify specific pain points mentioned or implied
2. A pain point is a CHALLENGE, PROBLEM, or NEED the person expresses
3. Celebrations WITHOUT challenges are NOT pain points
4. Questions or requests for advice often indicate pain points
5. Complaints or frustrations are pain points
6. Hiring announcements suggest growth (potential opportunity)
7. Be specific - extract the actual issue, not generic categories

OPPORTUNITY SCORING (0.0 - 1.0):
- 0.0-0.2: No clear opportunity (celebration, general update)
- 0.3-0.5: Mild opportunity (general challenge mentioned)
- 0.6-0.8: Good opportunity (specific problem seeking solutions)
- 0.9-1.0: High opportunity (urgent need, actively seeking help)

Author: {author_name}
Company: {company}

Post Content:
{post_text[:1500]}

Respond ONLY with valid JSON in this exact format:
{{
    "has_pain_point": true/false,
    "pain_points": ["specific pain point 1", "specific pain point 2"],
    "category": "category_name",
    "sentiment": "positive/negative/neutral",
    "opportunity_score": 0.0-1.0,
    "summary": "One sentence summary of key insight"
}}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise business analyst. Output valid JSON only."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=300,
            temperature=0.3  # Lower temp for more consistent analysis
        )
        
        content = response.choices[0].message.content.strip()
        result = json.loads(content)
        
        # Validate and normalize result
        return {
            "has_pain_point": bool(result.get("has_pain_point", False)),
            "pain_points": result.get("pain_points", [])[:5],  # Limit to 5
            "category": result.get("category", "general"),
            "sentiment": result.get("sentiment", "neutral"),
            "opportunity_score": min(1.0, max(0.0, float(result.get("opportunity_score", 0.0)))),
            "summary": result.get("summary", "")[:200]
        }
        
    except Exception as e:
        print(f"Pain point analysis error: {e}")
        return default_result


def analyze_batch_pain_points(
    posts: List[Dict],
    author_name: str = "",
    company: str = ""
) -> List[Dict]:
    """
    Analyze multiple posts for pain points.
    
    Args:
        posts: List of post dicts (must have 'text' key)
        author_name: Name of the post author
        company: Company of the author
    
    Returns:
        List of analysis results (same order as input)
    """
    results = []
    
    for post in posts:
        text = post.get("text", "")
        analysis = analyze_pain_points(text, author_name, company)
        
        # Attach to original post data
        result = {**post, "pain_analysis": analysis}
        results.append(result)
    
    return results


def summarize_lead_pain_points(
    pain_points_data: List[Dict],
    lead_name: str = ""
) -> Dict:
    """
    Create a comprehensive summary of all pain points for a lead.
    
    Args:
        pain_points_data: List of pain analysis results over time
        lead_name: Name of the lead
    
    Returns:
        Dict with summary, top pain points, categories, avg opportunity score
    """
    if not pain_points_data:
        return {
            "lead_name": lead_name,
            "total_posts_analyzed": 0,
            "posts_with_pain_points": 0,
            "top_pain_points": [],
            "categories": [],
            "avg_opportunity_score": 0.0,
            "recommendation": "Not enough data"
        }
    
    all_pain_points = []
    categories = {}
    opportunity_scores = []
    posts_with_pain = 0
    
    for item in pain_points_data:
        analysis = item.get("pain_analysis", {})
        
        if analysis.get("has_pain_point"):
            posts_with_pain += 1
            
            for pp in analysis.get("pain_points", []):
                all_pain_points.append(pp)
            
            cat = analysis.get("category", "general")
            categories[cat] = categories.get(cat, 0) + 1
            
            opportunity_scores.append(analysis.get("opportunity_score", 0))
    
    # Get top pain points (most frequent or most important)
    pain_point_counts = {}
    for pp in all_pain_points:
        pp_lower = pp.lower()
        pain_point_counts[pp] = pain_point_counts.get(pp, 0) + 1
    
    top_pain_points = sorted(
        pain_point_counts.keys(),
        key=lambda x: pain_point_counts[x],
        reverse=True
    )[:5]
    
    # Sort categories by frequency
    sorted_categories = sorted(categories.keys(), key=lambda x: categories[x], reverse=True)
    
    avg_score = sum(opportunity_scores) / len(opportunity_scores) if opportunity_scores else 0
    
    # Generate recommendation
    if avg_score >= 0.7:
        recommendation = "HIGH PRIORITY: Strong opportunity signals detected. Consider direct outreach."
    elif avg_score >= 0.4:
        recommendation = "MODERATE: Potential opportunity. Continue nurturing with engagement."
    elif posts_with_pain > 0:
        recommendation = "LOW PRIORITY: Some challenges noted. Monitor for stronger signals."
    else:
        recommendation = "NURTURE: No clear pain points yet. Continue relationship building."
    
    return {
        "lead_name": lead_name,
        "total_posts_analyzed": len(pain_points_data),
        "posts_with_pain_points": posts_with_pain,
        "top_pain_points": top_pain_points,
        "categories": sorted_categories,
        "avg_opportunity_score": round(avg_score, 2),
        "recommendation": recommendation,
        "all_pain_points": all_pain_points
    }


def format_pain_points_for_sheet(analysis: Dict) -> str:
    """
    Format pain points analysis for writing to Google Sheets.
    
    Args:
        analysis: Pain point analysis dict
    
    Returns:
        Formatted string for sheet cell
    """
    if not analysis.get("has_pain_point"):
        return ""
    
    pain_points = analysis.get("pain_points", [])
    category = analysis.get("category", "")
    score = analysis.get("opportunity_score", 0)
    
    parts = []
    
    if pain_points:
        parts.append(", ".join(pain_points[:3]))
    
    if category and category != "general":
        parts.append(f"[{category}]")
    
    if score >= 0.5:
        parts.append(f"(Score: {score:.1f})")
    
    return " | ".join(parts)


def get_outreach_insights(summary: Dict) -> str:
    """
    Generate outreach insights based on pain point summary.
    
    Args:
        summary: Output from summarize_lead_pain_points
    
    Returns:
        String with outreach talking points
    """
    insights = []
    
    lead_name = summary.get("lead_name", "This lead")
    top_pains = summary.get("top_pain_points", [])
    categories = summary.get("categories", [])
    score = summary.get("avg_opportunity_score", 0)
    
    if not top_pains:
        return f"Continue engaging with {lead_name} to discover pain points."
    
    insights.append(f"Key challenges for {lead_name}:")
    for i, pain in enumerate(top_pains[:3], 1):
        insights.append(f"  {i}. {pain}")
    
    if categories:
        insights.append(f"\nPrimary focus areas: {', '.join(categories[:3])}")
    
    if score >= 0.6:
        insights.append("\n✓ HIGH OPPORTUNITY - Consider reaching out with solutions.")
    
    return "\n".join(insights)
