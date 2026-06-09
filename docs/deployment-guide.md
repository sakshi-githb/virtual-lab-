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

### Option B: Render
1. Create a new **Web Service** pointing to your repository.
2. Select **Node** as the environment.
3. Configure the following parameters:
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command**: `cd server && npm start`
4. Add all required keys under **Advanced** -> **Environment Variables**.
5. Set `PORT` to `10000` (or leave it to Render to inject automatically).

---

## 5. Post-Deployment Verification
To ensure your deployment is healthy:
1. Navigate to `https://your-app-domain.com/health`. You should receive a JSON payload with `status: "online"`.
2. Access the root URL `https://your-app-domain.com/`. The React Brutalist portal should load cleanly.
3. Try registering a user, creating a lab, and opening a template. Confirm socket room sync functions correctly under spectator mode.
