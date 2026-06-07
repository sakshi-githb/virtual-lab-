# System Architecture: VIRTUAL-LAB

This document details the software design patterns, boundaries, and communication paths implemented in VIRTUAL-LAB.

---

## 1. Overview of Monorepo Separation
VIRTUAL-LAB splits concerns into two independent layers for scalability, modular testing, and clear separation of runtime loops:

```
+-----------------------------------+
|            CLIENT (Vite)          |  <-- Single Page App
|  React (UI), Matter.js (Physics)  |
+-----------------+-----------------+
                  | HTTP API Requests / WebSockets Real-time Duplex
                  v
+-----------------+-----------------+
|            SERVER (Node)          |  <-- REST API & WebSocket Broker
|   Express (Auth/CRUD), Socket.io  |
+-----------------+-----------------+
                  | Mongoose ODM Connections
                  v
+-----------------+-----------------+
|          DATABASE (MongoDB)       |  <-- Document Store
|     Users, Experiments, Rooms     |
+-----------------------------------+
```

---

## 2. Frontend Boundary: Canvas React Bridge
A major design challenge in interactive physics interfaces is merging the **60 FPS Matter.js game loop** with the **declarative React state engine**:
*   Matter.js calculations are stored entirely in memory inside React **useRef** blocks (e.g. `engineRef`).
*   Direct visual mutations (like shape spawning) bypass React’s Virtual DOM completely, invoking Matter.js functions directly via a forwardRef hook (`PhysicsCanvas.jsx`).
*   Inspector sliders bridge back to Matter.js coordinates through clean event dispatchers.
*   Kinematic Speed tracking is **throttled to 150ms** via a Ref checkpoint before updating the React Recharts state. This prevents rendering lags while maintaining highly responsive charts.

---

## 3. Real-Time Multiplayer Broker Pattern
The Node backend does not run the physics loop itself (which would overwhelm server CPU cycles). Instead, it acts as a **message broker**:
*   The **Room Host** calculates coordinates and broadcasts standard delta packets (`physics:sync`).
*   The **Server** receives the events and broadcasts them to all other sockets inside that code room namespace.
*   **Spectator Clients** render positions statically, bypassing local force updates.
