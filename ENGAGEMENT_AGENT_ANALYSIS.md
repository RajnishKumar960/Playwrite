# Engagement Agent - Functionality Analysis

## Overview
The `engagement_agent.py` is a LinkedIn automation tool that automatically engages with posts on your LinkedIn feed by liking and commenting intelligently. It uses Playwright for browser automation and includes safety checks, state management, and AI-powered comment generation.

---

## Core Functionalities

### 1. **Post Discovery & Scanning**
- **Function**: `find_posts_on_page(page)`
- **Capabilities**:
  - Scans LinkedIn feed for posts using multiple selectors (`div.occludable-update`, `div.feed-shared-update-v2`)
  - Extracts post text (first 300 characters)
  - Extracts author name from multiple possible selectors
  - Generates unique post IDs using hash of post snippet
  - Filters out non-visible posts
  - Returns structured post data: `{el, text, author, id}`

### 2. **Post Engagement (Likes & Comments)**
- **Function**: `engage_with_post(page, post_item, should_comment, dry_run, safe_mode, streamer)`
- **Like Functionality**:
  - ✅ Safety checks before liking (filters sensitive/promotional content)
  - ✅ Checks if post is already liked (prevents duplicate engagement)
  - ✅ Human-like mouse movement before clicking
  - ✅ Multiple fallback selectors for like button
  - ✅ Error handling and logging

- **Comment Functionality**:
  - ✅ AI-powered comment generation (via OpenAI or fallback)
  - ✅ Opens comment box automatically
  - ✅ Fills comment text intelligently
  - ✅ Multiple submit strategies (button click or Ctrl+Enter)
  - ✅ Screenshot capture after actions
  - ✅ Respects AI decision to skip commenting on sensitive content

### 3. **Safety & Content Filtering**
- **Integration**: Uses `lib/safety.py` module
- **Safety Checks**:
  - ✅ Filters sponsored/promotional content
  - ✅ Blocks sensitive topics (politics, religion, race, etc.)
  - ✅ Detects link-heavy posts
  - ✅ Safe mode option for stricter filtering
  - ✅ Validates content before engagement

### 4. **State Management**
- **Prevents Duplicate Engagement**:
  - ✅ Tracks processed posts using `state_store.py`
  - ✅ Uses post ID hash to identify unique posts
  - ✅ Marks posts as processed after engagement
  - ✅ Skips already-processed posts automatically

### 5. **AI Comment Generation**
- **Integration**: Uses `lib/openai_comments.py`
- **Features**:
  - ✅ OpenAI GPT-4o-mini for intelligent comments
  - ✅ Personalized comments with author name
  - ✅ Professional, 2-sentence format (max 150 chars)
  - ✅ Fallback comments if OpenAI unavailable
  - ✅ JSON-based decision making (COMMENT/SKIP)
  - ✅ Content-aware comment generation

### 6. **Browser Session Management**
- **Persistent Profile**:
  - ✅ Uses saved browser profile (`browser_profile/` directory)
  - ✅ Maintains LinkedIn login session
  - ✅ No need to re-authenticate each run
  - ✅ Retry logic for session validation (3 attempts)
  - ✅ Detects login/checkpoint pages

### 7. **Feed Navigation & Scrolling**
- **Smart Scrolling**:
  - ✅ Smooth scrolling using `smooth_scroll()` utility
  - ✅ Progressive scrolling (25% increments)
  - ✅ End-of-feed detection (5 consecutive no-post attempts)
  - ✅ Automatic page reload when feed ends
  - ✅ Scroll counter for periodic status updates

### 8. **Human-like Behavior**
- **Timing & Delays**:
  - ✅ Random delays between actions (1-3 seconds)
  - ✅ Random sleep between likes (5-15 seconds)
  - ✅ Batch pause after every 10 likes (2 seconds)
  - ✅ Human-like mouse movements
  - ✅ Slow-mo mode (50ms delay per action)

### 9. **Dashboard Streaming Integration**
- **Function**: Optional real-time monitoring
- **Features**:
  - ✅ Streams logs to dashboard API
  - ✅ Captures and sends screenshots
  - ✅ Real-time action reporting
  - ✅ Agent name: "feedWarmer"
  - ✅ Headless mode when streaming (browser hidden)
  - ✅ Falls back gracefully if dashboard unavailable

### 10. **Error Handling & Resilience**
- **Robust Error Management**:
  - ✅ Try-catch blocks around all operations
  - ✅ Continues processing even if individual posts fail
  - ✅ Logs errors with context
  - ✅ Validates page state before operations
  - ✅ Handles browser closure gracefully

---

## Command-Line Arguments

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `--max` | int | 10 | Maximum number of likes to perform |
| `--headless` | flag | False | Run browser in headless mode |
| `--dry-run` | flag | False | Preview mode (no actual engagement) |
| `--safe-mode` | flag | False | Enable stricter safety checks |
| `--stream` | flag | False | Stream to dashboard API |

---

## Execution Flow

```
1. Initialize streaming (if enabled)
   ↓
2. Launch browser with persistent profile
   ↓
3. Navigate to LinkedIn feed
   ↓
4. Verify login status (with retries)
   ↓
5. Main Loop:
   ├─ Scroll feed
   ├─ Find posts on page
   ├─ For each post:
   │  ├─ Check if already processed
   │  ├─ Safety check
   │  ├─ Check if already liked
   │  ├─ Like post (if safe)
   │  ├─ Generate AI comment
   │  ├─ Post comment (if AI approves)
   │  └─ Mark as processed
   ├─ Handle end-of-feed (reload if needed)
   └─ Continue until max_likes reached
   ↓
6. Cleanup & disconnect
```

---

## Key Dependencies

- **Playwright**: Browser automation
- **OpenAI API**: Intelligent comment generation (optional)
- **state_store.py**: Post tracking
- **lib/safety.py**: Content filtering
- **lib/utils.py**: Human-like delays & scrolling
- **agent_streaming.py**: Dashboard integration

---

## Use Cases

1. **Automated LinkedIn Engagement**: Maintain active presence without manual effort
2. **Content Discovery**: Automatically scan and engage with relevant posts
3. **Network Building**: Increase visibility through consistent engagement
4. **Time Saving**: Automate repetitive social media tasks
5. **Professional Branding**: AI-generated professional comments

---

## Safety Features Summary

✅ **Content Filtering**:
- Blocks promotional/sponsored content
- Filters sensitive topics (politics, religion, etc.)
- Detects link-heavy posts
- Safe mode for extra strictness

✅ **Rate Limiting**:
- Random delays between actions
- Batch pauses every 10 likes
- Human-like timing patterns

✅ **Duplicate Prevention**:
- Tracks processed posts
- Skips already-liked posts
- State persistence across runs

✅ **Error Recovery**:
- Continues on individual failures
- Retry logic for session validation
- Graceful degradation

---

## Limitations & Notes

- Requires pre-configured browser profile (login via Settings page)
- Depends on LinkedIn DOM structure (may break with UI changes)
- OpenAI API key optional (uses fallback if unavailable)
- State stored in JSON file (not database)
- Post ID based on hash (potential collisions)

---

## Example Usage

```bash
# Basic run (10 likes, visible browser)
python engagement_agent.py

# Dry run (preview mode)
python engagement_agent.py --dry-run --max 5

# Headless with streaming
python engagement_agent.py --headless --stream --max 20

# Safe mode with more likes
python engagement_agent.py --safe-mode --max 50
```

