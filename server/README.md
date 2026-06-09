# VIRTUAL-LAB Backend API Server

This directory contains the Node.js Express server that serves the VIRTUAL-LAB API endpoints and hosts the WebSockets connection channel.

## Technical Overview

The backend is built as a REST API and WebSocket broker that manages user profiles, persists physics sandbox configurations, and acts as a signaling broker to coordinate collaborative physical classrooms.

Key technical specifications:
- **Authentication**: Stateful user password hashing is implemented using Bcrypt with a work factor of 10. Sessions are managed statelessly using JSON Web Tokens (JWT) signed by a local environment secret.
- **WebSockets Server**: Socket.io coordinates classrooms and manages room namespaces (`room:ABC123`).
- **High-Frequency Synchronization**: Since running 60Hz physics calculations on the server would lead to CPU saturation, the server operates as a broker. It relays 30Hz host coordinate updates to spectators, resolving active drag interactions via conflict resolution protocols.
- **Database Persistence**: MongoDB is utilized via Mongoose ODM schemas to save credentials and serialized rigid-body physics attributes.
- **Tests**: Features native Node integration tests (`api.test.js`) and memory footprint leakage audits (`leakAudit.test.js`).

## Folder Directory

- `/src/config/`: Contains the database connection client (`db.js`).
- `/src/middleware/`: Contains stateless token verification middleware (`auth.js`).
- `/src/models/`: Holds user profile collections (`User.js`) and experiment layout collections (`Experiment.js`).
- `/src/routes/`: Contains Express router paths:
  - `auth.js`: Handles registry and login sessions.
  - `experiments.js`: Saves, lists, and deletes canvas configurations.
  - `ai.js`: Context-aware academic assistant routes with rules-based fallback routines.
- `/src/sockets/`: Manages Socket.io lifecycle events and active rooms.
- `/src/tests/`: Integration and memory audit scripts.

## Development Setup

To run the server standalone:
1. Install server dependencies:
   ```bash
   npm install
   ```
2. Configure environmental variables by creating a `.env` file (copying from `.env.example`).
3. Start the node dev server:
   ```bash
   npm run dev
   ```
4. API endpoints listen at `http://localhost:5000/`.
