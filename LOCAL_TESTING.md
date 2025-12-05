# Running Locally - Quick Reference

## API Server (play_api.py)
Currently running on: **http://127.0.0.1:4000**

### Available Endpoints

#### 1. Health Check
```powershell
curl http://127.0.0.1:4000/health
```

#### 2. Scrape Sales (People Search)
Searches LinkedIn for people and saves to Google Sheets.
```powershell
curl -X POST http://127.0.0.1:4000/scrape_sales -H "Content-Type: application/json" -d '{\"department\":\"Sales\",\"industry\":\"Software\",\"company\":\"Google\",\"max\":5}'
```

#### 3. Send Connection Requests
```powershell
curl -X POST http://127.0.0.1:4000/send_request -H "Content-Type: application/json" -d '{\"profiles\":[\"https://www.linkedin.com/in/example\"],\"note\":\"Hi, lets connect!\"}'
```

#### 4. Check Acceptance
```powershell
curl -X POST http://127.0.0.1:4000/check_acceptance -H "Content-Type: application/json" -d '{\"profiles\":[\"https://www.linkedin.com/in/example\"]}'
```

#### 5. Warmup (Like/Comment on posts)
```powershell
curl -X POST http://127.0.0.1:4000/warmup -H "Content-Type: application/json" -d '{\"profiles\":[\"https://www.linkedin.com/in/example\"],\"max\":3,\"comment_preview\":true}'
```

## Standalone Agents

### Feed Engagement (paired_agent.py)
Logs in, scrolls feed, likes and comments on 1st-degree connections.
```powershell
./venv/Scripts/python paired_agent.py --max 5 --headful --comment-preview
```

Add `--post-comments` to actually post comments.

### Scraper (scraper_agent.py)
Searches for people and saves to Google Sheets.
```powershell
./venv/Scripts/python scraper_agent.py --department "Engineering" --max 10
```
