# Project Analysis & Setup Guide

## 📋 Project Overview

**Playwrite** is a LinkedIn automation platform that uses Playwright for browser automation. It consists of:

### Architecture
- **Backend**: Python Flask API server (`dashboard_api.py`) - Main dashboard API
- **Frontend**: Next.js dashboard (`frontend-dashboard/`) - React-based web interface
- **Agents**: Multiple Python automation agents for LinkedIn interactions
- **Database**: SQLite databases for leads, engagements, and state management

### Key Components

#### Backend Services
1. **`dashboard_api.py`** (Port 4000) - Main dashboard API
   - Agent control endpoints
   - Real-time WebSocket streaming
   - Lead management
   - Analytics and reporting
   - LinkedIn session management

2. **`play_api.py`** (Port 4000) - Playwright API for n8n integration
   - Scraping endpoints
   - Connection request management
   - Warmup automation

#### Automation Agents
- `engagement_agent.py` - Feed engagement (likes/comments)
- `lead_engagement_agent.py` - Lead campaign automation
- `connection_checker.py` - Connection status checking
- `paired_agent.py` - Scanner/worker model for feed interactions
- `scraper_agent.py` - LinkedIn profile scraping
- `run_all_agents.py` - Orchestrator to run multiple agents concurrently

#### Frontend
- Next.js 16 application
- TypeScript
- Tailwind CSS
- Real-time dashboard with WebSocket support
- Multiple pages: Dashboard, Campaigns, Leads, Connections, Analytics, etc.

---

## 🚀 How to Run Frontend & Backend

### Prerequisites

1. **Python 3.12+** with virtual environment
2. **Node.js 18+** and npm
3. **Playwright browsers** installed
4. **Environment variables** configured (`.env` file)

### Step 1: Backend Setup

#### 1.1 Create and Activate Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\Activate.ps1
```

#### 1.2 Install Python Dependencies

```bash
# Install requirements
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install
```

#### 1.3 Configure Environment Variables

Create a `.env` file in the project root:

```env
# LinkedIn Credentials
LINKEDIN_EMAIL=your_email@example.com
LINKEDIN_PASSWORD=your_password

# Google Sheets (Optional)
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_FILE=path/to/service_account.json

# API Configuration
PLAY_API_KEY=your_secret_api_key
PLAY_API_PORT=4000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### 1.4 Start Backend Server

**Option A: Development Mode (Flask)**
```bash
# Activate venv first
source venv/bin/activate

# Run dashboard API
python dashboard_api.py
```

The backend will start on **http://localhost:4000**

**Option B: Production Mode (Waitress)**
```bash
# Install waitress if not already installed
pip install waitress

# Run production server
python run_prod.py
```

**Verify Backend is Running:**
```bash
curl http://localhost:4000/api/health
# Should return: {"status": "ok"}
```

---

### Step 2: Frontend Setup

#### 2.1 Navigate to Frontend Directory

```bash
cd frontend-dashboard
```

#### 2.2 Install Dependencies

```bash
npm install
```

#### 2.3 Configure Environment (Optional)

Create `.env.local` in `frontend-dashboard/` if you need to override backend URL:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

#### 2.4 Start Frontend Development Server

```bash
# Development mode
npm run dev

# Or production build
npm run build
npm start
```

The frontend will start on **http://localhost:3000**

---

### Step 3: Access the Application

1. **Frontend Dashboard**: Open http://localhost:3000 in your browser
2. **Backend API**: http://localhost:4000
3. **API Health Check**: http://localhost:4000/api/health

---

## 🔧 Running Individual Agents

### Engagement Agent
```bash
python engagement_agent.py --max 20 --headful --stream
```

### Lead Campaign Agent
```bash
python lead_engagement_agent.py --max 20 --duration 15 --stream
```

### Connection Checker
```bash
python connection_checker.py --limit 30 --duration 15 --stream
```

### Run All Agents Concurrently
```bash
python run_all_agents.py --duration 15 --headful
```

---

## 📁 Project Structure

```
Playwrite/
├── frontend-dashboard/          # Next.js frontend
│   ├── app/                      # Next.js app router pages
│   ├── components/               # React components
│   ├── lib/                      # Utilities and stores
│   └── package.json
├── lib/                          # Python library modules
│   ├── auth.py                   # LinkedIn authentication
│   ├── linkedin_session.py       # Session management
│   ├── lead_store.py            # Lead database operations
│   └── ...
├── logs/                         # Agent log files
├── sessions/                     # LinkedIn session storage
├── dashboard_api.py              # Main Flask API (Port 4000)
├── play_api.py                  # Playwright API for n8n
├── engagement_agent.py           # Feed engagement agent
├── lead_engagement_agent.py     # Lead campaign agent
├── connection_checker.py         # Connection status checker
├── run_all_agents.py            # Agent orchestrator
├── requirements.txt             # Python dependencies
└── .env                         # Environment variables (create this)
```

---

## 🔌 API Endpoints

### Dashboard API (`dashboard_api.py`)

**Health & Status**
- `GET /api/health` - Health check
- `GET /api/agents/status` - Get agent statuses

**Agent Control**
- `POST /api/agents/start/feedWarmer` - Start feed warmer
- `POST /api/agents/start/leadCampaign` - Start lead campaign
- `POST /api/agents/start/connectionChecker` - Start connection checker
- `POST /api/agents/stop/<agent_name>` - Stop specific agent
- `POST /api/agents/stop-all` - Stop all agents

**Data Endpoints**
- `GET /api/logs` - Get system logs
- `GET /api/leads` - Get leads list
- `GET /api/connections` - Get connection stats
- `GET /api/leads/stats` - Get lead analytics
- `GET /api/activity` - Get recent activity

**WebSocket**
- `ws://localhost:4000/ws/stream` - Browser stream
- `ws://localhost:4000/ws/logs` - Real-time logs

**LinkedIn Session**
- `GET /api/linkedin/status` - Check login status
- `POST /api/linkedin/login` - Trigger manual login

---

## 🐛 Troubleshooting

### Backend Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 4000
   lsof -i :4000
   # Kill the process
   kill -9 <PID>
   ```

2. **Playwright Browser Not Found**
   ```bash
   python -m playwright install
   ```

3. **Import Errors**
   ```bash
   # Ensure virtual environment is activated
   source venv/bin/activate
   # Reinstall dependencies
   pip install -r requirements.txt
   ```

### Frontend Issues

1. **Cannot Connect to Backend**
   - Verify backend is running on port 4000
   - Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
   - Check CORS settings in `dashboard_api.py`

2. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   npm install
   ```

3. **TypeScript Errors**
   ```bash
   npm run lint
   ```

---

## 🔐 Security Notes

- **Never commit `.env` files** to version control
- Use strong `PLAY_API_KEY` in production
- LinkedIn credentials should be kept secure
- Google service account JSON files are sensitive

---

## 📝 Next Steps

1. **First Login**: Use the dashboard to login to LinkedIn (will open browser)
2. **Start Agents**: Use the dashboard UI to start automation agents
3. **Monitor**: Watch real-time logs and activity in the dashboard
4. **Configure**: Set up Google Sheets integration if needed

---

## 🎯 Quick Start Commands

```bash
# Terminal 1: Start Backend
source venv/bin/activate
python dashboard_api.py

# Terminal 2: Start Frontend
cd frontend-dashboard
npm run dev

# Open browser: http://localhost:3000
```

---

## 📚 Additional Resources

- See `README.md` for detailed agent usage
- Check `LOCAL_TESTING.md` for local development tips
- Review `GOOGLE_SETUP.md` for Google Sheets integration

