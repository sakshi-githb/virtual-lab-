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
| `MONGODB_URI` | Yes | MongoDB Connection string. **Do not wrap this in quotes (e.g. `"` or `'`) when entering it in the dashboard.** | `mongodb+srv://user:pass@cluster.mongodb.net/virtual-lab` |
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

### Option A: 100% Free Split Deployment (Netlify + Render/Koyeb)
For a completely free hosting stack, deploy the static frontend React client on **Netlify** and the backend Express WebSockets server on **Render** or **Koyeb**.

#### 1. Backend: Render (Free Tier with Keep-Awake)
Render's free tier spins down Node services after 15 minutes of inactivity. However, since we implemented the `SELF_PING_URL` keep-awake script, your server will stay active 24/7.
1. Sign up for a free account at [Render](https://render.com/).
2. Click **New** -> **Web Service** and select your GitHub repository.
3. Configure the following parameters:
   - **Name**: `virtual-lab-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (Your secret token signing key)
   - `SELF_PING_URL`: Set this to your Render service's generated URL (e.g. `https://virtual-lab-backend.onrender.com`). This ensures the server pings itself every 14 minutes, preventing it from spinning down.
5. Deploy. Render will expose your server on a public domain with SSL.

#### 2. Backend: Koyeb (Free Tier - No Sleep)
Koyeb is a high-performance free cloud host that does *not* put services to sleep on their free tier.
1. Sign up for a free account at [Koyeb](https://www.koyeb.com/).
2. Click **Create Service** -> select Github and choose your repository.
3. Configure the parameters:
   - **Builder**: `Node.js`
   - **Work Directory**: `server`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
4. Under **Environment Variables**, add `NODE_ENV=production`, `MONGODB_URI`, and `JWT_SECRET`.
5. Deploy. Copy the public domain URL Koyeb generates for your app.

#### 3. Frontend: Netlify (Free Static Hosting)
Netlify is completely free and fast for hosting compiled static frontends.
1. Sign up at [Netlify](https://www.netlify.com/).
2. Click **Add New Site** -> **Import an existing project** from GitHub.
3. Configure the build parameters:
   - **Base Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `client/dist` (or `dist` relative to the base `client` folder)
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Set this to your Render or Koyeb backend's public URL (e.g. `https://virtual-lab-backend.onrender.com` or `https://virtual-lab.koyeb.app`). *Do not add a trailing slash.*
5. Deploy. Netlify will host the frontend statically. The `client/public/_redirects` file we created handles page routing fallbacks.

---

## 5. Post-Deployment Verification
To ensure your deployment is healthy:
1. Navigate to your backend domain's health route (e.g., `https://your-backend.onrender.com/health`). You should receive a JSON payload with `status: "online"`.
2. Access your Netlify site URL (e.g., `https://your-site.netlify.app/`). The React Brutalist portal should load.
3. Open Developer Tools (Network tab) and verify auth/experiments requests resolve to your Render/Koyeb backend instead of localhost.
4. Try creating a collaborative room and confirm Socket.io exchanges sync cleanly.


