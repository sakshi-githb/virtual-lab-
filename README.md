# VIRTUAL-LAB: Collaborative 2D Physics Sandbox

VIRTUAL-LAB is a real-time, collaborative 2D physics simulation sandbox and digital twin environment designed for university-level learning. The platform allows users to build physical systems, test constraints, and observe real-time forces in a shared workspace.

---

## Key Features

1. **Interactive Physics Canvas**: Create rigid body shapes (boxes, circles, and polygons) and interact with them using a drag-and-drop mouse constraint.
2. **Constraint Systems**: Run simple harmonic motion experiments using pendulum rigs and spring oscillator blocks.
3. **Real-Time Analytics**: View velocity and displacement curves on live line charts.
4. **Interactive Lab Assistant**: Provides inline explanations of physical formulas based on inspected body parameters.
5. **Collaborative Rooms**: Synchronize simulation states across multiple clients in real-time using Socket.io room events.
6. **Authentication & Persistence**: Supports guest logins and authenticated accounts to save custom canvas layouts to a cloud database.

---

## System Architecture

The application is structured into two main components:
- **Client**: Built with React, Vite, and Tailwind CSS. The physics calculations run at 60 FPS in a Matter.js engine isolated from standard React render loops using React refs.
- **Server**: A Node.js and Express application that manages user sessions, persists experiment states, and orchestrates WebSockets communication.
- **Database**: MongoDB (configured with Mongoose) stores user credentials and serialized canvas layout states.

---

## Project Structure

```
virtual-lab/
├── client/                     # React frontend built with Vite
│   ├── src/
│   │   ├── components/         # Canvas and panel layout modules
│   │   ├── context/            # React state context providers
│   │   ├── App.jsx             # Main layout orchestrator
│   │   └── index.css           # Global stylesheets
├── server/                     # Node.js Express backend
│   └── src/
│       ├── models/             # Mongoose schemas
│       ├── routes/             # REST API endpoints
│       └── server.js           # Server entry point
├── docs/                       # Project documentation
└── README.md                   # Project README
```

---

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or a cloud database instance on MongoDB Atlas)

### 1. Backend API Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying the example template:
   ```bash
   cp .env.example .env
   ```

4. Configure the environment variables in `.env`:
   - Set `PORT` (default is `5000`)
   - Set `MONGODB_URI` to your connection string. 
     * Local MongoDB example: `mongodb://127.0.0.1:27017/virtual-lab`
     * MongoDB Atlas example: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/virtual_lab`

5. Start the server in development mode:
   ```bash
   npm run dev
   ```

   Once running, the server listens at `http://localhost:5000/` and logs:
   ```text
   VIRTUAL-LAB server listening on port: 5000
   MongoDB Database Connected successfully!
   ```

### 2. Client Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser at `http://localhost:5173/`.

---

## Core API Routes

### Authentication
- `POST /api/auth/register` - Registers a new user.
- `POST /api/auth/login` - Authenticates a user and returns a JSON Web Token (JWT).

### Experiment Library
- `GET /api/experiments` - Retrieves all saved experiment layouts for the authenticated user.
- `POST /api/experiments` - Saves the current physics world configuration.
- `DELETE /api/experiments/:id` - Deletes a saved layout.

---

## Project Documentation

For detailed guides and architecture deep-dives, refer to the files in the `docs` directory:
- [docs/architecture.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/architecture.md) - React state architecture and Matter.js bridge.
- [docs/database-design.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/database-design.md) - Database schema layouts.
- [docs/api-documentation.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/api-documentation.md) - REST API endpoints and payloads.
- [docs/socket-events.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/socket-events.md) - WebSocket event lifecycle maps.
- [docs/deployment-guide.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/deployment-guide.md) - Production server deployment guide.
- [docs/viva-questions.md](file:///c:/Users/kedar/Desktop/virtual%20lab/docs/viva-questions.md) - Conceptual physics and web architecture questions.

