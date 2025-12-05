# LinkedIn feed agent (Playwright)

This repository contains a single, focused agent `agent.py` that logs into LinkedIn with credentials from a local `.env`, scrolls your feed and engages with posts authored by *first-degree (1st) connections* only.

Important safety & privacy notes
- Never commit `.env` to source control. Use `.env.example` and keep your real credentials local and private.
- The agent applies conservative safety filters: it will skip sponsored/promotional, link-heavy, or otherwise sensitive/controversial posts (politics, religion, personal identity, etc.).
- Use `--headful` (visible browser) when posting comments or handling 2FA/captcha manually.

Setup (Windows / PowerShell)
1. Create a Python virtual environment and activate it:

```powershell
python -m venv venv; .\venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
python -m playwright install
```

3. Create a `.env` in this folder (copy from `.env.example`) and add:

```
LINKEDIN_EMAIL=you@example.com
LINKEDIN_PASSWORD=yourpassword
```

How the agent behaves
- Only acts on posts by your *1st-degree connections* (default behavior).
- Uses the precise humanized timing you requested: waits 2s before the first like, then 3s before the 2nd, 4s before the 3rd, and so on (up to the configured limit).
- Moves the cursor to each like button before clicking so you can watch it act in a headed run.
- Skips promotional/sensitive/controversial posts to avoid risky engagements.
- Can generate concise, professional one- or two-sentence comments; you can preview them with `--comment-preview` and post them with `--post-comments` (use `--headful` when posting).

Usage examples

```powershell
# Like up to 10 posts (first-degree connections only, visible browser)
python agent.py --max 10 --headful

# Preview suggested comments for up to 8 posts
python agent.py --max 8 --headful --comment-preview

# Post comments (review with --comment-preview before enabling)
python agent.py --max 5 --headful --post-comments
```

Notes
- The agent is conservative and best-effort: LinkedIn's page layout changes frequently — if the agent can't find expected elements it may skip a post and continue.
- Posting comments is permanent. Use `--comment-preview` first and run in `--headful` to manually resolve any verification steps.

If you want further optimizations I can add:
- keyring-based credential storage so you don't keep a `.env` file,
- --dry-run to log the exact posts that would be liked/commented without taking actions,
- configuration file for safety keywords.

---
Small summary of what I did for you
- Consolidated code into `agent.py` and removed legacy/unused test artifacts.
- Implemented connections-only, humanized behavior, cursor movement, safe filters, and comment preview/posting.
# Playwright LinkedIn test (pytest)

This small test project uses Playwright + pytest to automate a simple LinkedIn login flow.

⚠️ Important safety notes
- DO NOT commit real credentials to source control. Use a `.env` file (example provided in `.env.example`).
- Automating login may trigger LinkedIn's anti-bot measures or require 2FA — this test may fail if LinkedIn blocks automated logins.

Setup (Windows / PowerShell)

1. Create a Python virtual environment and activate it:

```powershell
python -m venv venv; .\venv\Scripts\Activate.ps1
```

2. Install Python dependencies:

```powershell
pip install -r requirements.txt
```

3. Install Playwright browsers:

```powershell
python -m playwright install
```

4. Copy `.env.example` to `.env` and add your LinkedIn credentials:

```text
LINKEDIN_EMAIL=you@example.com
LINKEDIN_PASSWORD=yourpassword
```

Agent-first workflow

This repository has been simplified: the main entry is `agent.py`. The previous pytest tests and `Test.py` interactive runner were removed to focus on a single agent workflow.

Examples — use a headed browser when interacting or posting comments so you can resolve 2FA/captcha if required:

```powershell
# like up to 10 posts (first-degree connections only)
python agent.py --max 10 --headful

# preview comments before posting
python agent.py --max 8 --headful --comment-preview

# actually post comments (review with --comment-preview before using)
python agent.py --max 6 --headful --post-comments
```

Troubleshooting
- If the test fails because LinkedIn requests 2FA or shows a CAPTCHA, you must handle those manually — automated login is then not possible without addressing extra steps.

Debugging failures and saved artifacts
- When the test fails, the test now saves a screenshot and an HTML snapshot into `tests/artifacts` (file names include a Unix timestamp). Inspect these files to see the page state and any errors LinkedIn shows (2FA prompt, CAPTCHA, error messages).
- Example of where you'll find artifacts: `tests/artifacts/failure-1618881010.png` and `tests/artifacts/failure-1618881010.html`.

Tips for debugging interactive failures
- Run the test in headed (visible) mode so you can watch the browser in real time:

```powershell
$env:PYTEST_ADDOPTS="--headed"; pytest -q tests/test_linkedin.py::test_linkedin_login -s
```

- If the page requires 2FA or a CAPTCHA, the test will fail. The `Test.py` script in the repo can be useful to run an interactive login while you manually resolve 2FA and confirm what LinkedIn shows.

Agent: scroll and like posts
- A new script `agent.py` was added. It logs in with your `.env` credentials, scrolls the feed and likes posts automatically.
- Usage examples (PowerShell):

```powershell
# like up to 15 posts (default behavior: likes everything)
python agent.py --max 15 --headful

# like up to 30 posts but only those whose author name contains "John"
python agent.py --max 30 --author "John" --headful
```

The agent follows the increasing delay schedule per your request (2s before first like, 3s before second, 4s ... 7s).

Paired agent (scanner + worker)
- `paired_agent.py` implements a linked scanner/worker model: the scanner collects posts on the current viewport and the worker acts (likes/comments) on those candidates. Both operate in the same browser context so they remain coordinated and don't act on the same post twice.

Sample usage:

```powershell
# paired agent performs scanning and acting together
python paired_agent.py --max 10 --headful --comment-preview

# actually post comments (review before using --comment-preview)
python paired_agent.py --max 6 --headful --post-comments

LinkedIn scraping demo & Google Sheets export
- `scraper_agent.py` — a demo scraper that logs in to LinkedIn and searches people using department/industry/company keywords. It scrapes visible profiles and returns rows of (name, headline, location, profile_url).
- `web_trigger.py` — a tiny Flask demo that accepts POST requests containing department/industry/company parameters and triggers the scraper. This is a local demo only and not production-ready.

Google Sheets export (optional)
If you set `GOOGLE_SHEET_ID` in your `.env` the project will use that sheet by default when writing scraped rows. For example you can add the spreadsheet link or ID to `.env`:

```
GOOGLE_SHEET_ID=1e1_GUIEQo_S9x_uA5Pb9E0dSIg82QhgJBSXcf9HyWuY
```

This value will be picked up by:
- `scraper_agent.py` when you pass `--sheet` (explicit) or by `run_and_save_scrape.py` if `--sheet` is not passed.
- `web_trigger.py` POSTs (when `sheet` field is omitted it will use `GOOGLE_SHEET_ID`).
- `play_api.py` `/scrape_sales` endpoint (accepts `sheet` field; defaults to `GOOGLE_SHEET_ID` if missing).

Verify Google Sheets access locally
----------------------------------
If you'd like to confirm your service account + sheet access from this project, there's a helper script:

```powershell
python tools/verify_sheets.py
```

This script reads `GOOGLE_SERVICE_ACCOUNT_FILE` and `GOOGLE_SHEET_ID` from your `.env` and attempts to open the sheet and print the first rows. Install requirements first with `pip install gspread google-auth`.
- To write scraped results to Google Sheets, create a Google Cloud service account with Drive/Sheets access, download the JSON key file, and set the environment variable `GOOGLE_SERVICE_ACCOUNT_FILE` to that path. You can pass a `--sheet` ID to `scraper_agent.py` or provide the `sheet` field in `web_trigger.py` POST JSON.

Example scraping command:

```powershell
# scrape profiles for 'engineering' in 'software' at 'Acme Corp' and write to sheet
python scraper_agent.py --department engineering --industry software --company "Acme Corp" --max 50 --sheet <GOOGLE_SHEET_ID>
```

Example POST to web trigger (PowerShell):

```powershell
curl -X POST http://127.0.0.1:5000/scrape -H "Content-Type: application/json" -d '{"department":"engineering","industry":"software","company":"Acme Corp","max":50,"sheet":"<GOOGLE_SHEET_ID>"}'
```

Security reminder
- Don't commit your Google service account JSON or `.env` to source control. These files contain sensitive credentials and should remain private.

Running the Playwright API server (for n8n)
- We added a Playwright HTTP API `play_api.py` that exposes endpoints n8n will call. This server listens on port 4000 by default.

Start the server in a virtual environment (headed recommended for manual verification):

```powershell
.\venv\Scripts\Activate.ps1
python play_api.py
```

Importing the n8n workflow
API authentication for play_api
- Set a strong API key and export it before starting the server so n8n calls are authenticated:

```powershell
$env:PLAY_API_KEY="my-very-secret-key"
python play_api.py
```

In the n8n HTTP request nodes (Scrape / Send / Warmup), add header `X-API-KEY` with the same key so the Playwright API accepts requests.
- The file `n8n_linkedin_automation.json` is a ready-to-import n8n workflow. In n8n:
	1. Settings -> Workflows -> Import
	2. Choose this file and import
	3. Configure Google Sheets credential and update HTTP node URLs as needed (they are set to http://127.0.0.1:4000 by default)

Final safety notes
- These tools perform real actions on your LinkedIn account. Use `--comment-preview` and `--post-comments` carefully and prefer running in `--headful` mode for easier manual verification.
- Start with a small `--max` value (e.g., 5) and review results regularly.

Deploying the Playwright API for n8n (production recommendations)

1) Run as a dedicated service (Linux example using systemd)

Create a systemd unit file /etc/systemd/system/play_api.service:

```
[Unit]
Description=Playwright API for LinkedIn automation
After=network.target

[Service]
User=youruser
WorkingDirectory=/path/to/Playwrite
Environment=PYTHONUNBUFFERED=1
Environment=PLAY_API_KEY=your_strong_key_here
ExecStart=/path/to/venv/bin/python play_api.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then enable & start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now play_api.service
```

2) Use a reverse-proxy (nginx) with TLS in front of the API server and restrict access (IP/rate-limit) if required.

3) If you need a quick dev tunnel instead of hosting, use `ngrok http 4000` and point the n8n HTTP nodes to the ngrok URL (remember to use the X-API-KEY header).

Docker / container deployment
---------------------------
We include a Dockerfile and docker-compose.yml to make it easy to run the API in a container (Playwright has an official Python image that includes browsers). Example:

```powershell
# build & run
docker compose up --build -d

# or in CI / server
docker build -t play-api .
docker run -e PLAY_API_KEY=xxxx -e GOOGLE_SERVICE_ACCOUNT_FILE=/run/secrets/service-account.json -p 4000:4000 play-api
```

CI / CD (GitHub Actions -> GHCR -> optional Render deploy)
-----------------------------------------------------
This repo includes a GitHub Actions workflow at `.github/workflows/ci-cd.yml`. It will run unit tests, build a multi-arch Docker image and push it to GitHub Container Registry (GHCR). Optionally it will trigger a Render deployment if you configure repository secrets.

How to enable the workflow
1. Push this repository to GitHub (create a repo and push main branch).
2. In GitHub repo settings -> Secrets -> Actions add the following secrets if you plan to deploy to Render:
	- RENDER_API_KEY: your Render API key
	- RENDER_SERVICE_ID: the Render service id to trigger a deploy
3. The workflow runs automatically on any push to main and can be triggered manually from the Actions tab.

What it publishes
- Image tags: `ghcr.io/<owner>/<repo>:latest` and `ghcr.io/<owner>/<repo>:<commit-sha>`.

If you'd like, I can extend the workflow to publish to Docker Hub instead, or add a deploy step for Railway/Fly/Heroku — tell me which provider you'd prefer and I will add another workflow variant.

Systemd + nginx (example)
-------------------------
See `deploy/systemd.play_api.service` and `deploy/nginx-play_api.conf` for example systemd and nginx config snippets you can adapt when installing on a Linux server. Keep `PLAY_API_KEY` in environment or a secrets manager and never commit credentials.

4) In n8n, configure the HTTP Request nodes to use the full external URL (e.g., https://your-host.example.com/scrape_sales) and add the header:

Key: X-API-KEY   Value: your_strong_key_here

```

Content-safety, comments and options
- The agent now applies conservative safety filters and will skip posts that appear to be sponsored, overtly promotional, link-heavy or that contain sensitive/polarizing topics (politics, religion, race, gender-based slurs, explicit violence, etc.). This reduces the chance of engagement on controversial posts.
- The agent can also generate and optionally post short, professional comments that follow these rules you requested: concise (1-2 sentences), positive, professional, non-controversial, non-promotional. The agent will NOT comment on posts that fail the safety checks.
 - The agent can also generate and optionally post short, professional comments that follow these rules you requested: concise (1-2 sentences), positive, professional, non-controversial, non-promotional. The comment generator reads the post content and produces focused, human-style comments (no numeric placeholders or robotic messages). The agent will NOT comment on posts that fail the safety checks.
- CLI additions:

```powershell
# preview suggested comments but do not post them
python agent.py --max 8 --headful --comment-preview

# actually post comments (use with --headful so you can resolve 2FA/captcha if needed)
python agent.py --max 8 --headful --post-comments
```

Important: Posting comments interacts with your real account and is permanent. Use `--comment-preview` first to review generated comments before posting.

Persisting an authenticated session (recommended to avoid repeated logins)
- The repo can save a local Playwright `storageState` file that stores cookies and auth tokens so tests can reuse a logged-in session without re-entering credentials. The test will attempt to save `tests/auth.json` automatically on successful login (the file is added to `.gitignore` so it isn't committed).
- To save an authenticated session using the interactive `Test.py` runner, run:

```powershell
python Test.py --wait --save-storage tests/auth.json
```

This opens the browser, performs login, waits for you to confirm any 2FA or captchas manually, and then writes `tests/auth.json`.

When `tests/auth.json` exists, `pytest` will reuse that login state and skip entering credentials — fast and less likely to hit LinkedIn's bot detection. If you lose the session you can re-create it by running the command above.

Security guidance
- Do NOT check-in `.env` or `tests/auth.json`. The project `.gitignore` is configured to avoid committing them, but note that your `OneDrive` folder can also sync these files to cloud storage; consider using system environment variables or a secret manager instead of storing passwords locally.
- If you work on shared machines, prefer system-level protected keyrings or CI secrets.
