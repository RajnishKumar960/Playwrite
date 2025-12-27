
import os

content = """LINKEDIN_EMAIL=your_email@example.com
LINKEDIN_PASSWORD=your_password
OPENAI_API_KEY=your_openai_api_key
PLAY_API_KEY=your_play_api_key
"""

with open(".env", "w", encoding="utf-8") as f:
    f.write(content)

print(".env file updated successfully")
