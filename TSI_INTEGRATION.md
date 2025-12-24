# TSI Automation - LinkedIn Agent Integration Guide

## 🚀 Render Deployment Steps

### 1. Deploy from GitHub

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repo: `RajnishKumar960/Playwrite`
4. Select branch: `connection-comment-error-fix`
5. Choose **Docker** as the environment
6. Set the following **Environment Variables**:

| Variable | Description |
|----------|-------------|
| `LINKEDIN_EMAIL` | Your LinkedIn login email |
| `LINKEDIN_PASSWORD` | Your LinkedIn password |
| `OPENAI_API_KEY` | OpenAI API key for AI comments |
| `GOOGLE_SHEET_ID` | Google Sheet ID for lead data |
| `PLAY_API_KEY` | Secret API key (for security) |

7. Click **Create Web Service**

### 2. Your API URL

After deployment, your API will be available at:
```
https://tsi-linkedin-automation.onrender.com
```

---

## 📡 API Endpoints (for TSI Website Integration)

### Health Check
```bash
GET /health
```

### Send Connection Requests
```bash
POST /send_request
Headers: X-API-KEY: your-api-key
Body: {
  "profiles": ["https://linkedin.com/in/username"],
  "note": "Hi, I'd love to connect!"
}
```

### Check Connection Status
```bash
POST /check_acceptance
Headers: X-API-KEY: your-api-key
Body: {
  "profiles": ["https://linkedin.com/in/username"]
}
```

### Warmup & Engagement
```bash
POST /warmup
Headers: X-API-KEY: your-api-key
Body: {
  "profiles": [],
  "max": 5,
  "post_comments": true
}
```

---

## 🔌 TSI Automation Website Integration Prompt

Use this prompt to integrate the LinkedIn automation into your TSI Automation Next.js website:

```
I'm building TSI Automation, an AI-powered marketing platform. I need to integrate a LinkedIn automation API that's deployed on Render. Here's what I need:

DEPLOYED API: https://tsi-linkedin-automation.onrender.com

API ENDPOINTS:
1. POST /send_request - Send LinkedIn connection requests
   Body: { profiles: string[], note: string }
   
2. POST /check_acceptance - Check connection status
   Body: { profiles: string[] }
   
3. POST /warmup - Like/comment on posts
   Body: { profiles: string[], max: number, post_comments: boolean }

4. POST /scrape_sales - Scrape leads from Apollo
   Body: { department, industry, company, max }

All endpoints require X-API-KEY header.

CREATE THE FOLLOWING FOR MY TSI AUTOMATION DASHBOARD:

1. **LinkedIn Outreach Page** (/dashboard/outreach)
   - Import leads from CSV or paste LinkedIn URLs
   - Connection note template editor
   - "Launch Campaign" button that calls /send_request
   - Status tracking showing pending/accepted
   - Daily limit display (25 per day)

2. **Engagement Manager** (/dashboard/engagement)
   - List of connected leads with activity
   - "Engage" button to trigger /warmup
   - AI comment preview toggle
   - Engagement history timeline

3. **Connection Tracker** (/dashboard/connections)
   - Auto-poll /check_acceptance every hour
   - Show which leads accepted
   - Move accepted leads to "Ready for Engagement"

4. **API Service Layer**
   Create /lib/linkedin-api.ts:
   - export async function sendConnectionRequests(profiles, note)
   - export async function checkConnections(profiles)
   - export async function runWarmup(profiles, max)
   - Handle API key from env LINKEDIN_API_KEY

5. **React Query Hooks**
   Create /hooks/useLinkedIn.ts:
   - useSendConnections mutation
   - useCheckConnections query
   - useWarmup mutation

TECH STACK:
- Next.js 14 with App Router
- Tailwind CSS
- React Query for data fetching
- Zustand for state
- The Sales Inc red (#E53E3E) as primary color

IMPORTANT:
- Add loading states with spinners
- Show toast notifications on success/error
- Rate limit warnings (25 connections/day)
- Error handling for API failures
```

---

## 🏗️ Full Stack Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 TSI AUTOMATION WEBSITE                       │
│                    (Next.js + Vercel)                       │
├─────────────────────────────────────────────────────────────┤
│  Dashboard                                                   │
│  ├── /outreach      → LinkedIn connection campaigns         │
│  ├── /engagement    → Like/comment automation               │
│  ├── /connections   → Track accepted connections            │
│  └── /reports       → Pain points & analytics               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ API Calls
┌─────────────────────────────────────────────────────────────┐
│              LINKEDIN AUTOMATION API                         │
│         https://tsi-linkedin-automation.onrender.com        │
├─────────────────────────────────────────────────────────────┤
│  Endpoints:                                                  │
│  POST /send_request     → Send connection requests           │
│  POST /check_acceptance → Check connection status            │
│  POST /warmup           → Like/comment on posts              │
│  POST /scrape_sales     → Scrape leads from Apollo           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Playwright Browser
┌─────────────────────────────────────────────────────────────┐
│                       LINKEDIN                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema for TSI Automation

```sql
-- Users & Workspaces
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id),
  role VARCHAR(50) DEFAULT 'user', -- 'admin' or 'user'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  profile_url VARCHAR(500) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  title VARCHAR(255),
  connection_status VARCHAR(50) DEFAULT 'not_sent',
  last_engaged_at TIMESTAMP,
  pain_points TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'outreach', 'engagement'
  status VARCHAR(50) DEFAULT 'draft',
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  lead_id UUID REFERENCES leads(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Next Steps

1. **Merge the branch to main**
2. **Deploy to Render** using the steps above
3. **Set environment variables** in Render dashboard
4. **Test the API** with curl or Postman
5. **Integrate with TSI website** using the prompt above
