# VIRTUAL-LAB Production Deployment Guide

This document details the configuration requirements and step-by-step instructions for deploying the **VIRTUAL-LAB** application to cloud environments (e.g., Render, Railway, Heroku, or VPS hosting).

---

## 1. Architecture Overview
In production, the application runs as a **single consolidated Express service**:
1. The Express server serves all API requests (`/api/*`) and WebSocket connections (`socket.io`).
2. The React frontend is compiled into static assets inside `/client/dist`.
3. In production (`NODE_ENV=production`), the Express server hosts these static files from `/client/dist` and resolves client-side routes (like `/dashboard`) back to `index.html`.

---

## 2. Environment Configurations

Ensure the following environment variables are configured in your production dashboard or server environment:

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | Set to `production` to activate static asset serving and optimized fallback routing. | `production` |
| `PORT` | Yes | The port the Express HTTP server binds to. | `5000` (or dynamically set by platform) |
| `MONGODB_URI` | Yes | MongoDB Connection string. | `mongodb+srv://user:pass@cluster.mongodb.net/virtual-lab` |
| `JWT_SECRET` | Yes | A cryptographically secure secret used for signing user authentication tokens. | `your_super_secret_jwt_key` |
| `GEMINI_API_KEY` | No | Google Gemini API Key used for the live physics professor. | `AIzaSy...` (Falls back to local rules-based engine if missing) |

---

## 3. Deployment Build & Run Command Scripts

### Build Script
Use this command to install dependencies for both the frontend and backend, and build the React frontend:
```bash
# Installs packages and compiles the client bundle
cd client && npm install && npm run build && cd ../server && npm install
```

### Start Script
Run the Express production server:
```bash
# Starts backend server which distributes compiled client static assets
cd server && npm start
```

---

## 4. Platform Deployment Settings

### Option A: Railway
1. Click **New Project** and select **Deploy from GitHub repository**.
2. Under **Variables**, add all values listed in the Environment Configurations section.
3. In **Settings**, set the **Build Command** to:
   ```bash
   cd client && npm install && npm run build && cd ../server && npm install
   ```
4. Set the **Start Command** to:
   ```bash
   cd server && npm start
   ```
5. Railway will automatically expose the service under a public domain with SSL.

### Option B: Split Deployment (Netlify + Railway)
For hosting the frontend statically on Netlify CDN and the backend API/WebSockets server on Railway:

#### 1. Backend: Railway Settings
1. Click **New Project** and select **Deploy from GitHub repository**.
2. Under **Variables**, add all required backend variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or leave it to Railway default)
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY` (optional)
   - `SELF_PING_URL` (optional: Set this to your Railway service's public domain URL, e.g. `https://virtual-lab-backend.up.railway.app`. This enables the built-in self-ping script to request `/health` every 14 minutes, keeping the backend active and awake).
3. In **Settings**, configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
4. Copy the public domain URL Railway generates for your service.

#### 2. Frontend: Netlify Settings
1. Click **Add New Site** -> **Import an existing project** from GitHub.
2. Select your repository.
3. Configure the build parameters:
   - **Base Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `client/dist` (or `dist` relative to the base `client` folder)
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Set this to your Railway backend's public domain URL copied in the previous step (e.g. `https://virtual-lab-backend.up.railway.app`). (Note: do not add a trailing slash `/`).
5. Deployment will start automatically. Netlify will serve the frontend. The `client/public/_redirects` file we created handles index.html routing fallback for paths like `/dashboard`.

---

## 5. Post-Deployment Verification
To ensure your deployment is healthy:
1. Navigate to your Railway backend domain's health route (e.g., `https://your-backend.railway.app/health`). You should receive a JSON payload with `status: "online"`.
2. Access your Netlify site URL (e.g., `https://your-site.netlify.app/`). The React Brutalist portal should load cleanly.
3. Open Developer Tools (Network tab) and register a user. Confirm request destinations point to your Railway API server instead of localhost.
4. Try creating a laboratory classroom and opening a template. Confirm WebSockets sync cleanly between windows.

