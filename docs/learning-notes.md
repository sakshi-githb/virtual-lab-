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
