# Socket.io Events: VIRTUAL-LAB

This document details the socket events, payloads, and protocols designed for the real-time multiplayer engine.

---

## 1. Connection Event Pipeline

### `room:create` (Client -> Server)
Sent by a user wanting to establish a collaborative lab.
*   **Payload**: None.
*   **Action**: Server generates a random 6-character alphanumeric string (e.g. `ABC123`), binds the socket as Host, and sends the code back.
*   **Return event**: `room:created` payload: `{ roomCode: "ABC123" }`.

### `room:join` (Client -> Server)
Sent by a user entering an active lab room.
*   **Payload**:
    ```json
    { "roomCode": "ABC123", "username": "SamSmith" }
    ```
*   **Action**: Binds the socket to the room code namespace, notifies other occupants, and synchronizes the active physics state.
*   **Broadcast event**: `peer:joined` payload: `{ username: "SamSmith" }`.

---

## 2. High-Frequency Real-Time Sync

### `physics:sync` (Host Client -> Server -> Spectators)
Synchronizes dynamic body positions to maintain identical layouts on all screens.
*   **Payload**:
    ```json
    {
      "bodies": [
        { "id": "b1", "x": 420.5, "y": 205.2, "angle": 0.45 },
        { "id": "b2", "x": 395.1, "y": 448.9, "angle": -0.12 }
      ]
    }
    ```
*   **Frequency**: ~30Hz (once every 33ms) to avoid saturating server sockets.
*   **Action**: Backend relays this packet directly to all spectator client connections inside the room.
*   **Relayed event**: `peer:sync` payload: `{ bodies: [...] }`.

### `cursor:move` (Client -> Server -> Peers)
Syncs cursor coordinates to render remote drag actions.
*   **Payload**:
    ```json
    { "x": 405, "y": 218, "username": "Mike" }
    ```
*   **Action**: relayed to other sockets inside the room to draw active vector indicators.
*   **Relayed event**: `peer:cursor` payload: `{ x, y, username }`.
