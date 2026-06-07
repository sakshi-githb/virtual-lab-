# VIRTUAL-LAB: Collaborative 2D Physics Sandbox & Digital Twin

VIRTUAL-LAB is a real-time, collaborative 2D physics simulation sandbox and educational digital twin environment. It features a tactile, responsive Neo-Brutalist visual identity designed to make physics experimentation engaging and intuitive.

---

## 🚀 Key Features

1.  **Interactive Physics Canvas**: Spawns rigid body shapes (boxes, circles, polygons) and applies Matter.js mouse constraints for smooth drag-and-drop actions.
2.  **Constraint System Presets**: Simulates complex physical rigs (pendulum rigs, spring oscillator blocks) in real-time.
3.  **Real-Time Analytics**: Visualizes speed changes on line charts and displays dynamic vector force fields.
4.  **AI Lab Professor**: Provides live advice and explains equations based on the selected body's physics metrics.
5.  **Multiplayer Classrooms**: Syncs states across users in Socket.io rooms with integrated chat lobbies.
6.  **Dual Mode Access**: Supports both Guest and Registered profiles with local offline caching and cloud database saves.

---

## 🏗️ System Architecture

VIRTUAL-LAB splits concerns into two independent layers:
*   **Client (React + Vite + Tailwind CSS)**: Runs the 60 FPS Matter.js physics calculations inside a React reference bridge, decoupling high-frequency loops from React render cycles.
*   **Server (Node.js + Express + Socket.io)**: Handles user credentials, saved experiments, and relays real-time position updates to connected room occupants.
*   **Database (MongoDB + Mongoose)**: Stores user documents, saved sandboxes, and active room states.

---

## 📂 Project Structure

```
virtual-lab/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/         # Canvas and panel UI components
│   │   ├── context/            # Global state context providers
│   │   ├── App.jsx             # Router layout
│   │   └── index.css           # Neo-Brutalist styles
├── server/                     # Express Node Backend
│   └── src/
│       ├── models/             # Mongoose MongoDB schemas
│       ├── routes/             # API endpoints
│       └── server.js           # Server startup script
├── docs/                       # Comprehensive Academic Documentation
└── README.md                   # Master project guide
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   **Database**: Either a local installation of [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running on port `27017`) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database cluster.

### 1. Setup the Backend API Server
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by copying `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and set `MONGODB_URI` according to your database configuration:
    *   **Local MongoDB**: `mongodb://127.0.0.1:27017/virtual-lab`
    *   **Cloud MongoDB Atlas (Standard)**: `mongodb+srv://<username>:<password>@cluster0.ydh87r9.mongodb.net/virtual_lab`
    *   **Cloud MongoDB Atlas (Fallback for DNS SRV Blocked Networks)**: If your network ISP blocks SRV lookup records (resulting in a `querySrv ECONNREFUSED` error), connect directly to the replica set shards:
        ```env
        MONGODB_URI=mongodb://<username>:<password>@ac-penaw4r-shard-00-00.ydh87r9.mongodb.net:27017,ac-penaw4r-shard-00-01.ydh87r9.mongodb.net:27017,ac-penaw4r-shard-00-02.ydh87r9.mongodb.net:27017/virtual_lab?ssl=true&replicaSet=atlas-l79ctx-shard-0&authSource=admin
        ```
4.  Launch the hot-reload development server:
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:5000/`. On startup, it will attempt to connect to MongoDB and print:
    ```
    🔌 MongoDB Database Connected successfully!
    ```


### 2. Setup the Client Application
1.  Navigate to the client directory:
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the local Vite development server:
    ```bash
    npm run dev
    ```
    Open the application in your browser at `http://localhost:5173/`.

---

## 📡 Core API Routes

### Authentication
*   `POST /api/auth/register` - Registers a new user account.
*   `POST /api/auth/login` - Authenticates credentials and returns a JWT token.

### Experiment Library
*   `GET /api/experiments` - Fetches the user's saved experiments.
*   `POST /api/experiments` - Saves the current sandbox state.

---

## 🧪 Project Documentation
For an academic deep-dive, consult the files in our `docs/` folder:
*   [docs/architecture.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/architecture.md) - Design patterns and structural separations.
*   [docs/database-design.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/database-design.md) - MongoDB Mongoose schemas.
*   [docs/api-documentation.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/api-documentation.md) - Endpoint payloads and routes.
*   [docs/socket-events.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/socket-events.md) - Real-time socket event protocols.
*   [docs/viva-questions.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/viva-questions.md) - Academic questions and conceptual answers.
