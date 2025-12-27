# Production Deployment Guide 🚀

The repository is now fully prepared for production deployment. I have updated the `Dockerfile`, `render.yaml`, `requirements.txt`, and the API logic to support a seamless Vercel + Render orchestration.

## 📦 Deployment Overview

### 1. Backend (Render)
- **Service Type:** Web Service (Docker)
- **Branch:** `dashboard`
- **Recommended Plan:** Starter ($7/month) — *Required for persistent lead data.*
- **Environment Variables:**
  - `LINKEDIN_EMAIL`
  - `LINKEDIN_PASSWORD`
  - `OPENAI_API_KEY`
  - `DATABASE_URL`: `/app/data/tsi_leads.db` (Configured in `render.yaml`)
  - `PLAY_API_KEY`: (Optional) Your security key.

### 2. Frontend (Vercel)
- **Framework:** Next.js
- **Root Directory:** `frontend-dashboard`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: Your Render URL (e.g., `https://tsi-mission-control.onrender.com`)
  - `NEXT_PUBLIC_WS_URL`: Your Render WebSocket URL (e.g., `wss://tsi-mission-control.onrender.com`)

## 🛠️ Automated Setup
I have pushed the latest production-ready code to your repository:
[RajnishKumar960/Playwrite (dashboard branch)](https://github.com/RajnishKumar960/Playwrite/tree/dashboard)

### What has been updated:
- **WebSocket Stability:** Switched to the `gevent` worker in the Docker container for production-ready surveillance.
- **Persistent Memory:** Configured a Render Disk mount to ensure your `tsi_leads.db` stays safe across restarts.
- **CORS & Reliability:** Standardized API ports and added cross-origin support for Vercel.

## 🚀 Final Steps
1. Go to **Render** and create a "Web Service" from your `Playwrite` repo.
2. Go to **Vercel** and create a project pointing to the `frontend-dashboard` folder.
3. Add the environment variables mentioned above.

> [!NOTE]
> Once deployed, the frontend and backend will automatically synchronize. You can monitor the "Surveillance" status light in the dashboard to confirm the link is active.
