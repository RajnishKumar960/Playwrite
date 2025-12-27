#!/usr/bin/env python3
"""Pain Points Report Generator.

Generate comprehensive pain points reports from the lead engagement campaign.

Usage:
    python scripts/generate_pain_points_report.py --sheet YOUR_SHEET_ID
    python scripts/generate_pain_points_report.py --sheet YOUR_SHEET_ID --format html
    python scripts/generate_pain_points_report.py --sheet YOUR_SHEET_ID --output report.md
"""

import sys
import os
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.lead_store import (
    get_campaign_progress,
    get_high_opportunity_leads,
    get_lead_pain_points,
    _get_connection
)
from lib.sheets_reader import read_leads, get_campaign_stats


def generate_markdown_report(sheet_id: str = None) -> str:
    """Generate a Markdown report of campaign pain points."""
    
    progress = get_campaign_progress()
    high_opp = get_high_opportunity_leads(min_score=0.5, limit=15)
    
    # Get all leads with their pain points
    conn = _get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            l.id, l.profile_url, l.name, l.company, l.total_engagements,
            l.campaign_start_date, l.last_engagement_date
        FROM leads l
        WHERE l.total_engagements > 0
        ORDER BY l.total_engagements DESC
    """)
    engaged_leads = cursor.fetchall()
    
    lines = []
    
    # Header
    lines.append("# Lead Engagement Campaign - Pain Points Report")
    lines.append("")
    lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("")
    
    # Executive Summary
    lines.append("## Executive Summary")
    lines.append("")
    lines.append(f"| Metric | Value |")
    lines.append(f"|--------|-------|")
    lines.append(f"| Total Leads | {progress['total_leads']} |")
    lines.append(f"| Engaged Leads | {progress['engaged_leads']} |")
    lines.append(f"| Total Engagements | {progress['total_engagements']} |")
    lines.append(f"| Completed Campaigns | {progress['completed_campaigns']} |")
    lines.append(f"| Leads with Pain Points | {progress['leads_with_pain_points']} |")
    lines.append(f"| Campaign Progress | {progress['progress_pct']}% |")
    lines.append("")
    
    # Top Pain Points
    lines.append("## Top Pain Points Discovered")
    lines.append("")
    if progress.get("top_pain_points"):
        lines.append("| Pain Point | Frequency |")
        lines.append("|------------|-----------|")
        for pp in progress["top_pain_points"][:15]:
            lines.append(f"| {pp['pain_point']} | {pp['count']} |")
    else:
        lines.append("*No pain points discovered yet.*")
    lines.append("")
    
    # Categories
    lines.append("## Pain Points by Category")
    lines.append("")
    if progress.get("categories"):
        lines.append("| Category | Count |")
        lines.append("|----------|-------|")
        for cat in progress["categories"]:
            lines.append(f"| {cat['category'].title()} | {cat['count']} |")
    else:
        lines.append("*No categories identified yet.*")
    lines.append("")
    
    # High Opportunity Leads
    lines.append("## High Opportunity Leads")
    lines.append("")
    lines.append("> These leads show strong opportunity signals based on their posts.")
    lines.append("")
    
    if high_opp:
        for lead in high_opp:
            name = lead.get('name') or 'Unknown'
            company = lead.get('company') or 'N/A'
            score = lead.get('avg_score', 0)
            
            lines.append(f"### {name} ({company})")
            lines.append(f"- **Opportunity Score:** {score:.2f}")
            lines.append(f"- **Engagements:** {lead.get('total_engagements', 0)}")
            
            pain_str = lead.get('pain_points', '')
            if pain_str:
                lines.append(f"- **Pain Points:** {pain_str}")
            
            lines.append(f"- **Profile:** {lead.get('profile_url', 'N/A')}")
            lines.append("")
    else:
        lines.append("*No high-opportunity leads identified yet. Continue the campaign.*")
    lines.append("")
    
    # Lead Details
    lines.append("## Detailed Lead Analysis")
    lines.append("")
    
    for lead_row in engaged_leads[:20]:  # Limit to 20 leads
        lead_id = lead_row["id"]
        name = lead_row["name"] or "Unknown"
        company = lead_row["company"] or "N/A"
        
        pain_points = get_lead_pain_points(lead_id)
        
        lines.append(f"### {name}")
        lines.append(f"- **Company:** {company}")
        lines.append(f"- **Engagements:** {lead_row['total_engagements']}")
        lines.append(f"- **Campaign Started:** {lead_row['campaign_start_date'] or 'N/A'}")
        lines.append(f"- **Last Engaged:** {lead_row['last_engagement_date'] or 'N/A'}")
        
        if pain_points:
            lines.append(f"\n**Identified Pain Points:**")
            for pp in pain_points[:5]:
                category = f" [{pp['category']}]" if pp.get('category') else ""
                lines.append(f"  - {pp['pain_point']}{category} (mentioned {pp['count']}x)")
        else:
            lines.append(f"\n*No specific pain points identified yet.*")
        
        lines.append("")
    
    conn.close()
    
    # Recommendations
    lines.append("## Recommendations")
    lines.append("")
    lines.append("Based on the pain points discovered:")
    lines.append("")
    
    if progress.get("categories"):
        top_cat = progress["categories"][0]["category"]
        lines.append(f"1. **Focus on {top_cat.title()} challenges** - This is the most common category of pain points.")
    
    if high_opp:
        lines.append(f"2. **Prioritize high-scoring leads** - {len(high_opp)} leads show strong opportunity signals.")
    
    lines.append("3. **Continue daily engagement** - Consistent engagement builds relationships and reveals more pain points.")
    lines.append("4. **Personalize outreach** - Use discovered pain points to craft targeted messages.")
    lines.append("")
    
    # Footer
    lines.append("---")
    lines.append(f"*Report generated by Lead Engagement Agent*")
    
    return "\n".join(lines)


def generate_html_report(sheet_id: str = None) -> str:
    """Generate an HTML report."""
    md_report = generate_markdown_report(sheet_id)
    
    # Simple HTML wrapper
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Pain Points Report</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
               max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; }}
        h1 {{ color: #1a1a1a; border-bottom: 2px solid #0077b5; padding-bottom: 10px; }}
        h2 {{ color: #333; margin-top: 30px; }}
        h3 {{ color: #0077b5; }}
        table {{ border-collapse: collapse; width: 100%; margin: 15px 0; }}
        th, td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
        th {{ background-color: #f5f5f5; }}
        blockquote {{ background: #f9f9f9; border-left: 4px solid #0077b5; 
                     margin: 15px 0; padding: 10px 20px; color: #555; }}
        code {{ background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }}
        .score-high {{ color: #22c55e; font-weight: bold; }}
        .score-med {{ color: #eab308; }}
        .score-low {{ color: #ef4444; }}
    </style>
</head>
<body>
<pre style="white-space: pre-wrap;">{md_report}</pre>
</body>
</html>"""
    
    return html


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate Pain Points Report")
    parser.add_argument("--sheet", type=str, help="Google Sheet ID")
    parser.add_argument("--format", type=str, choices=["md", "html", "txt"], default="md",
                        help="Output format (md, html, txt)")
    parser.add_argument("--output", type=str, help="Output file path")
    
    args = parser.parse_args()
    
    sheet_id = args.sheet or os.getenv("GOOGLE_SHEET_ID")
    
    # Generate report
    if args.format == "html":
        report = generate_html_report(sheet_id)
        ext = "html"
    else:
        report = generate_markdown_report(sheet_id)
        ext = "md"
    
    # Determine output file
    if args.output:
        output_file = args.output
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        output_file = f"pain_points_report_{timestamp}.{ext}"
    
    # Write report
    with open(output_file, "w") as f:
        f.write(report)
    
    print(f"\n✓ Report generated: {output_file}")
    print(f"  Format: {args.format.upper()}")
    
    # Also print summary to console
    progress = get_campaign_progress()
    print(f"\n  Quick Stats:")
    print(f"    - Leads: {progress['total_leads']}")
    print(f"    - Engagements: {progress['total_engagements']}")
    print(f"    - Pain points found: {progress['leads_with_pain_points']} leads")
    print("")


if __name__ == "__main__":
    main()
