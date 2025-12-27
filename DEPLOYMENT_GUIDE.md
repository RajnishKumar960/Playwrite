# Production Deployment Guide 🚀

The repository has been restructured into an architecturally decoupled layout.

## 📦 Project Structure
- **`/frontend`**: Next.js Dashboard.
- **`/backend`**: Flask API and Playwright Agents.

---

## 🚀 Deployment Overview

### 1. Backend (Render)
- **Service Type:** Web Service (Docker)
- **Repo Branch:** `dashboard`
- **Root Directory:** `./` (Keep as root)
- **Dockerfile Path:** `./Dockerfile`
- **Environment Variables:**
  - `LINKEDIN_EMAIL`
  - `LINKEDIN_PASSWORD`
  - `OPENAI_API_KEY`
  - `DATABASE_URL`: `/app/data/tsi_leads.db`
  - `PLAY_API_KEY`: (Optional)

### 2. Frontend (Vercel)
- **Root Directory:** `frontend`  <-- **CRITICAL: SET THIS IN VERCEL SETTINGS**
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Environment Variables:** (Optional, as fallbacks are hardcoded)

## 🛠️ Restructuring Benefits
- **Clean Builds**: Vercel only sees the frontend code, reducing build times.
- **Isolated Logic**: Backend agents are clearly separated from the UI logic.
- **Zero Config**: The dashboard includes production fallbacks for immediate connectivity.

---
**Mission Status: ARCHITECTURALLY SOUND 💎**
