# Database Design: VIRTUAL-LAB

This document details the MongoDB collection structures and Mongoose data validations.

---

## 1. Schema Specifications

### Users Collection (`users`)
Saves user logins. Passwords are encrypted using Bcrypt.
*   `name` (String, required): Display username.
*   `email` (String, required, unique, indexed): User email address.
*   `passwordHash` (String, required): Secure hashed password representation.
*   `createdAt` (Date): Auto-initialized timestamp.

### Experiments Collection (`experiments`)
Stores serialized physical sandbox representations.
*   `title` (String, required): Name of the experiment.
*   `description` (String): Lab logs or summaries.
*   `creator` (ObjectId, ref: 'User'): Owner reference (null for Guest offline caches).
*   `gravity` (Object): `{ x: Number, y: Number }`.
*   `bodies` (Array): Array of Matter.js physical states:
    *   `id` (String): Custom identification.
    *   `shapeType` (String): `box`, `circle`, `polygon`.
    *   `x`, `y` (Number): Physical coordinates.
    *   `width`, `height`, `radius`, `sides` (Number).
    *   `mass`, `friction`, `restitution` (Number).
    *   `isStatic` (Boolean).
    *   `color` (String): Color code.
    *   `labelName` (String).
*   `constraints` (Array): Springs, Ropes, or Pivots link models.

### Rooms Collection (`rooms`)
Orchestrates multiplayer classes.
*   `roomCode` (String, unique, indexed): 6-character room access code.
*   `host` (String): Username of room creator.
*   `users` (Array): List of connected members `{ socketId, username, joinedAt }`.
*   `activeExperiment` (ObjectId, ref: 'Experiment').

---

## 2. Serialization & Deserialization Flows
To save and load physics structures:
1.  **Serialization**: The client iterates through active Matter.js bodies, discards recursive engine properties (like collision matrices and event hooks), and compiles a clean JSON array of positions, masses, and rendering options.
2.  **Mongoose Validation**: The Express backend validates the payload structure against the schema, verifying fields like `shapeType` and coordinate ranges, and saves it.
3.  **Deserialization**: When loaded, the canvas clears the existing world, loops over the `bodies` array, rebuilds the rigid bodies using Matter.js constructors, and adds them back to the engine composite.
