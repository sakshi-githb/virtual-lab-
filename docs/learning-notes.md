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

