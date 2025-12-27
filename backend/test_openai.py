"""Test OpenAI API key and generate a sample comment."""
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

if not api_key:
    print("❌ OPENAI_API_KEY not found in .env file")
    print("\nPlease add your OpenAI API key to .env file:")
    print('OPENAI_API_KEY="sk-proj-..."')
    exit(1)

print(f"✅ API Key found: {api_key[:20]}...{api_key[-4:]}")
print("\nTesting OpenAI API...")

try:
    client = OpenAI(api_key=api_key)
    
    # Test with a sample LinkedIn post
    test_post = "Excited to share that our team just launched a new AI-powered feature!"
    author_name = "John Doe"
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a professional LinkedIn commenter. Generate concise, insightful comments."
            },
            {
                "role": "user",
                "content": f"Write a professional 1-2 sentence comment for this LinkedIn post by {author_name}:\n\n{test_post}\n\nInclude the author's first name in the comment naturally."
            }
        ],
        max_tokens=100,
        temperature=0.7
    )
    
    comment = response.choices[0].message.content.strip()
    
    print(f"\n✅ OpenAI API is working!")
    print(f"\nSample comment generated:")
    print(f"  Post: {test_post}")
    print(f"  Comment: {comment}")
    print(f"\n✅ Your OpenAI key is valid and working correctly!")
    
except Exception as e:
    print(f"\n❌ Error testing OpenAI API: {e}")
    print("\nPossible issues:")
    print("1. Invalid API key")
    print("2. No credits/quota available")
    print("3. Network connection issue")
    print("\nPlease check your OpenAI account at: https://platform.openai.com/account/api-keys")
