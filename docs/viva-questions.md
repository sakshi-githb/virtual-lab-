# Viva Questions & Conceptual Answers: VIRTUAL-LAB

This guide contains key engineering questions frequently asked during academic project evaluations or technical job interviews.

---

## Conceptual Questions

### Q1: Why did you decouple Matter.js calculations from the React rendering engine?
*   **Answer**: React is declarative and updates the DOM through a virtual reconciliation loop. Triggering a React re-render at **60 frames per second** (which physics calculations require) would choke the browser thread and cause major layout lagging. 
*   Instead, Matter.js is stored inside a React `useRef` reference and runs entirely in raw memory. The DOM canvas updates independently, and React elements only sample coordinates when needed (like updating the inspector values or throttled velocity charts).

### Q2: Explain the stateless nature of JWT authentication.
*   **Answer**: With traditional session-based auth, the server must save session IDs in memory or a database to check if a user is logged in. 
*   A JSON Web Token (JWT) is **stateless** because the server does not store active tokens. The token contains signed payload metadata (like `userId`). The server checks if the incoming token signature matches its secret key using standard cryptographic algorithms. If the signature is valid, the request is authorized. This enables the backend to scale easily across multiple servers.

### Q3: How do you handle password security in your database?
*   **Answer**: We never store passwords as raw strings. We hash them using **Bcrypt**. Bcrypt runs a slow hashing routine combined with a random "Salt" string. This makes it impossible for attackers to recover passwords using lookup tables (rainbow tables) or brute-force search if the database is compromised.

### Q4: Why use WebSockets instead of HTTP polling for multiplayer?
*   **Answer**: HTTP is unidirectional; the client must constantly send requests to check if there are changes. WebSockets establish a **persistent, bidirectional connection**. Once opened, the client and server can transmit data packets back and forth with near-zero latency, which is required for smooth, real-time collaboration.

### Q5: What is the difference between `mongodb+srv://` and standard `mongodb://` connection strings, and how do you troubleshoot the `querySrv ECONNREFUSED` error?
*   **Answer**: 
    *   `mongodb+srv://` is a modern, simplified connection string format. It queries the Domain Name System (DNS) for **SRV records** (Service records) to automatically discover the database shard hosts and parameters (such as the replica set name). This avoids hardcoding hostnames.
    *   `mongodb://` is the standard connection string format where you explicitly list all shard hosts, ports, and replica set options (e.g., `replicaSet=atlas-l79ctx-shard-0&authSource=admin`).
    *   **Troubleshooting `querySrv ECONNREFUSED`**: This error occurs when the local DNS resolver (e.g., from an ISP or router) blocks or refuses DNS SRV queries. To fix this, you can either:
        1. Query SRV and TXT records using a public DNS resolver (like Google's `8.8.8.8`) to discover the shard hosts and replica set name, and then construct a standard `mongodb://` connection string.
        2. Set the Node.js process DNS servers to Google's public DNS using `dns.setServers(['8.8.8.8'])` before running database connection logic.

### Q6: What is a Development Proxy (like Vite Proxy), and why is it preferred over CORS headers in development?
*   **Answer**: 
    *   A development proxy is a configuration in the dev server (like Vite or Webpack) that intercepts specific client requests (e.g., prefix `/api`) and forwards them to a different backend server (e.g., `http://localhost:5000`).
    *   It is preferred over enabling broad CORS headers (`Access-Control-Allow-Origin: *`) in development because:
        1. It makes the browser believe that the frontend and backend are hosted on the same origin (protocol, domain, and port), thereby eliminating CORS security checks.
        2. It allows developers to use relative paths (e.g., `fetch('/api/auth/login')`), meaning no hardcoded URLs need to be edited when moving the code from a local environment to production.

### Q7: Why do we use room-based socket broadcasts (`socket.to(...)`) instead of global broadcasts (`io.emit(...)`) in multiplayer setups, and how do we prevent network saturation?
*   **Answer**: 
    *   **Room-based Broadcasting**: `socket.to("room:XYZ")` ensures that messages are sent only to sockets that have explicitly joined that specific room. A global broadcast (`io.emit`) sends messages to every single connected client on the server, which would cause severe network degradation, security leaks, and client crashes in a multi-room multiplayer application.
    *   **Preventing Network Saturation**:
        1. **Throttling/Frequency Capping**: Instead of sending updates on every single physics engine tick (60Hz), we throttle synchronization updates to 30Hz (every 33ms).
        2. **Action Sync vs. State Sync**: We only sync the full coordinate state of active physics bodies at 30Hz. Single events like spawning an object, clicking reset, or changing gravity are sent once as discrete actions (`physics:action`) rather than continuous streams.
        3. **Garbage Collection**: Sockets automatically clean up their memory by leaving rooms on disconnect, and rooms are deleted from server memory immediately when the last user exits.

### Q8: What are the benefits of wrapping a WebSocket connection inside a React Context Provider?
*   **Answer**: 
    *   **Single Connection Instance**: React Context guarantees that the WebSocket connection is initialized once and shared across the entire application, avoiding multiple parallel connections from different components.
    *   **Global Access**: Any child component in the component tree can consume the socket context (e.g., calling `const { roomCode } = useSocket()`) without having to prop-drill connection objects down through multiple layout layers.
    *   **Synchronized React State**: The context translates raw socket events (like `peer:joined` or `chat:message`) into standard React state updates, causing consuming components to re-render reactively when new data arrives.




