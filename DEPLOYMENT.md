# NoteFlow AI — Deployment & Publishing Guide

This guide provides step-by-step instructions for publishing **NoteFlow AI** to various cloud platforms.

---

## 🌟 1. Push to GitHub / GitLab (Source Control)

The Git repository has already been initialized and committed locally with version `v1.0.0`.

To publish to your GitHub account:
```bash
# 1. Add your GitHub repository remote URL
git remote add origin https://github.com/YOUR_USERNAME/noteflow-ai.git

# 2. Rename branch to main
git branch -M main

# 3. Push all files
git push -u origin main
```

---

## 🚀 2. Deploy on Render.com (Recommended Free/Low-Cost Blueprint)

We have included [`render.yaml`](file:///C:/Users/pandeboina%20ramgopal/.gemini/antigravity/scratch/noteflow-ai/render.yaml) which automates deploying both the **FastAPI Backend** and the **React Vite Frontend** in 1 click.

1. Push your code to GitHub.
2. Log in to [Render.com](https://render.com).
3. Click **"New +"** → **"Blueprint"**.
4. Connect your `noteflow-ai` GitHub repository.
5. Render will automatically detect `render.yaml` and provision:
   - `noteflow-backend` (Python web service running FastAPI)
   - `noteflow-frontend` (Static site hosting React Vite)
6. Add your `OPENAI_API_KEY` in the Render Environment Variables tab (optional for live AI).

---

## ⚡ 3. Deploy Frontend on Vercel + Backend on Render / Railway

### A. Deploy Frontend on Vercel
We have configured [`vercel.json`](file:///C:/Users/pandeboina%20ramgopal/.gemini/antigravity/scratch/noteflow-ai/vercel.json).
1. Install Vercel CLI: `npm i -g vercel` or import your GitHub repo on [vercel.com](https://vercel.com).
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy!

### B. Deploy Backend on Railway / Render
1. Connect `backend` folder.
2. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Environment variables:
   - `SQLITE_FALLBACK=true`
   - `SECRET_KEY=your_secure_jwt_secret`

---

## 🐳 4. Deploy with Docker Compose (Any VPS / Cloud Server)

We have provided [`docker-compose.yml`](file:///C:/Users/pandeboina%20ramgopal/.gemini/antigravity/scratch/noteflow-ai/docker-compose.yml) which spins up MySQL 8.0, FastAPI backend, and Nginx React frontend with a single command:

```bash
docker-compose up -d --build
```
- **Web Application:** `http://your-server-ip`
- **Backend API:** `http://your-server-ip:8000`

---

## 🌐 5. Instant Local Public Tunnel (Quick Demo Sharing)

To instantly share a public HTTPS link with friends, professors, or evaluators directly from your machine:
```powershell
npx localtunnel --port 5173
```
This generates a temporary public HTTPS URL like `https://noteflow-ai-demo.loca.lt`.
