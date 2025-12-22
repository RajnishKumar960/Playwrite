
import os

with open(".env", "rb") as f:
    content = f.read()
    print("Raw content repr:", repr(content))
    try:
        print("Decoded content:", content.decode('utf-8'))
    except Exception as e:
        print("Decode error:", e)
