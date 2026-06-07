# Project Flow: VIRTUAL-LAB

This document maps the user and data journeys through the VIRTUAL-LAB workspace.

---

## 1. Authentication & Router Entrance Flowchart

```
                 [ User visits Website ]
                            |
                   (Is token cached?)
                   /                \
                 Yes                 No
                 /                    \
        [ Auto-Auth Login ]      [ Show Portal Landing Page ]
                |                             |
                |                      Select Lab Mode
                |                      (Solo vs Classroom)
                |                             |
                |                     Choose Access Type
                |                     (Guest vs credentials)
                \                             /
                 +-------------+-------------+
                               |
                   [ Enter Sandbox Page ]
```

---

## 2. Interactive Physics Runtime Loop

```
       [ React UI Panel ]                       [ Matter.js Engine ]
               |                                         |
         Click Spawn shape                              |
               |                                         |
     (canvasRef.current.spawnBox)                        |
               |                                         |
               | ---- (Direct Ref Mutation) -----------> |
               |                                   Create Box
               |                                   Run Loop (60Hz)
               |                                   Update Positions
               |                                         |
               | <--- (afterUpdate Tick Event) ----------|
     Update inspector speed values
     Update Velocity Graph (Throttled 150ms)
```

---

## 3. Database Save Pipeline

1.  **Trigger**: User clicks the "Save" icon in the top header.
2.  **Auth Check**: Client checks if the user is in logged-in mode. Guests are shown a warning and prompted to register a credentials profile.
3.  **Extraction**: The React hook `usePhysics` triggers the canvas ref to extract all active rigid bodies, filtering out static boundaries (walls) and saving properties: `[{ shapeType, x, y, mass, restitution }]`.
4.  **API Call**: The client fires a `POST` request to `/api/experiments` with the JSON payload and the JWT authorization header.
5.  **Database Save**: The Express server verifies the JWT, links the user's `ObjectId` as the creator, parses the schema, and saves the document to the MongoDB database.
