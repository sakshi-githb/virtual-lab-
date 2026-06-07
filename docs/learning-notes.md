# Learning Notes: VIRTUAL-LAB

This document details key engineering tradeoffs, challenges, and lessons learned while building this platform.

---

## 1. Physics Engine Integration Tradeoffs
*   **Challenge**: Linking physical objects to React states.
*   **Resolution**: Keeping the physics engine inside a `useRef` container and exposing actions via `useImperativeHandle` creates a clean interface. This preserves maximum physics frame rates while keeping the React codebase modular and clean.

---

## 2. Password Encryption Decisions
*   **Takeaway**: Using `bcryptjs` is safer than raw node cryptography because it manages salt generation and cost factors automatically. Locking down the cost factor to **10** provides a strong security boundary without overloading server CPU cycles during logins.

---

## 3. High-Frequency Websocket Traffic
*   **Takeaway**: Transmitting positions at 60Hz causes network congestion and overflows client buffers. Broadcasting updates at a reduced rate of **30Hz** (once every 33ms) paired with client-side linear interpolation achieves smooth movement while using half the network bandwidth.

---

## 4. MongoDB Atlas Connection Troubleshooting (DNS SRV Resolution)
*   **Takeaway**: The standard MONGODB_URI starts with `mongodb+srv://`, which queries DNS SRV records to find replica set shard locations dynamically. However, many consumer ISPs and home routers run basic DNS servers that block or return `ECONNREFUSED` on SRV record requests.
*   **Resolution**: By querying the SRV endpoints manually via Google's public DNS (`8.8.8.8`) and extracting the three replica shards, we constructed a classic `mongodb://` connection string detailing host addresses, ports, and replica set flags. This allows database connectivity to bypass the local DNS SRV restriction entirely.

---

## 5. Vite Dev Server Proxying & Authentication Flow
*   **Takeaway**: Hardcoding backend API endpoints (such as `http://localhost:5000/api`) in client code leads to CORS errors during development and configuration maintenance overhead. 
*   **Resolution**: By configuring a development server proxy in `vite.config.js`, all relative `/api` paths are routed automatically to the Express backend. This eliminates browser CORS pre-flight checks, simplifies code maintenance, and allows relative URLs to be used for seamless production deployment.

---

## 6. Socket.io Real-Time Collaborative Rooms & GC
*   **Takeaway**: Real-time room features easily cause memory leaks on the backend if socket registries retain records for disconnected sockets, or if empty rooms are left allocated in RAM indefinitely.
*   **Resolution**: Implemented automatic garbage collection (GC) inside `socketManager.js`. Whenever a client leaves a room or disconnects, they are cleanly deregistered. If the room's occupant count hits zero, the room configuration is deleted from the `rooms` Map registry, preventing server RAM leaks.

---

## 7. React Socket.io Context and Declarative State Sync
*   **Takeaway**: Directly instantiating socket listeners inside individual UI panels leads to duplicate connections and redundant event handlers.
*   **Resolution**: Implemented a centralized `SocketProvider` context. This hoists the socket instance to the root of the React application, ensuring a single connection channel. Sub-components like `BottomPanel` (chat/players list) or `TopBar` consume this context declaratively.




