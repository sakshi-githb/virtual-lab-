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

