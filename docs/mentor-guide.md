# Mentor Mode Guide: Database, Authentication, WebSockets & 10-Day Roadmap

This educational guide details the system architecture, code blueprints, and engineering roadmaps for **VIRTUAL-LAB**. It serves as a study companion for academic evaluations, interviews, and continuing self-development.

---

## 1. MongoDB Schema Design & Mongoose Serialization

MongoDB is a document-oriented database. Unlike relational databases (SQL), MongoDB stores data in dynamic, JSON-like BSON documents. Mongoose is a schema-based modeling tool for Node.js that manages data validation and business logic.

### Mongoose Database Schemas

Here are the complete backend schemas implemented in **VIRTUAL-LAB**:

#### A. User Schema (`User.js`)
Manages screen name registration, cloud-synchronized login credentials, and user roles.
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    minlength: [3, 'Display name must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['member', 'guest', 'admin'],
    default: 'member'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index email for O(1) login lookup times
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
```

#### B. Experiment Schema (`Experiment.js`)
Archiving the canvas state. In physics, storing standard engines requires stripping recursive pointers and saving basic coordinates.
```javascript
import mongoose from 'mongoose';

const bodySchema = new mongoose.Schema({
  syncId: { type: String, required: true },
  labelName: { type: String, default: 'Rigid Body' },
  shapeType: { type: String, enum: ['box', 'circle', 'polygon'], required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number },
  height: { type: Number },
  radius: { type: Number },
  sides: { type: Number },
  mass: { type: Number, required: true },
  friction: { type: Number, required: true },
  restitution: { type: Number, required: true },
  isStatic: { type: Boolean, default: false },
  color: { type: String, default: '#FACC15' }
});

const experimentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Experiment title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null indicates guest user (saved locally)
  },
  gravityY: {
    type: Number,
    default: 1.0
  },
  bodies: [bodySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Experiment', experimentSchema);
```

### Serialization & Deserialization Strategy

Physics engines like Matter.js build highly circular object graphs (`Body` points to `World`, which points to `Composite`, which links back to `Body`). Attempting to serialize a raw Matter.js body using `JSON.stringify` throws a `TypeError: Converting circular structure to JSON` exception.

```
[ Matter.js World ] ──(contains)──> [ Body ]
       ▲                               │
       └──────────(refers to)──────────┘
```

#### The Client-Side Serialization Pipeline:
To archive a layout, the client extracts only the raw parameters needed to reconstruct the bodies:
```javascript
// client/src/utils/serializer.js
export const serializeWorld = (engine, title, description, creatorId) => {
  const bodiesData = engine.world.bodies
    .filter(b => !b.isBoundary) // Skip static boundary walls (floor, ceiling, walls)
    .map(b => ({
      syncId: b.syncId,
      labelName: b.labelName,
      shapeType: b.shapeType || 'box',
      x: b.position.x,
      y: b.position.y,
      width: b.width || null,   // custom tracking fields
      height: b.height || null,
      radius: b.radius || null,
      sides: b.sidesCount || null,
      mass: b.mass,
      friction: b.friction,
      restitution: b.restitution,
      isStatic: b.isStatic,
      color: b.customColor
    }));

  return {
    title,
    description,
    creator: creatorId,
    gravityY: engine.gravity.y,
    bodies: bodiesData
  };
};
```

#### The Deserialization Pipeline:
When loading, the canvas clears the existing world and passes each serialized definition to the spawning ref functions:
```javascript
// client/src/components/canvas/PhysicsCanvas.jsx
const loadSerializedExperiment = (serializedData) => {
  // 1. Clear world
  ref.current.resetWorld();
  
  // 2. Adjust gravity
  ref.current.setGravity(serializedData.gravityY);
  
  // 3. Sprout shapes
  serializedData.bodies.forEach(b => {
    if (b.shapeType === 'box') {
      ref.current.spawnBox(b.x, b.y, b.width, b.height, b.isStatic, b.syncId, b.color);
    } else if (b.shapeType === 'circle') {
      ref.current.spawnCircle(b.x, b.y, b.radius, b.syncId, b.color);
    } else if (b.shapeType === 'polygon') {
      ref.current.spawnPolygon(b.x, b.y, b.sides, b.radius, b.syncId, b.color);
    }
  });
};
```

---

## 2. Password Hashing & JWT Auth Middlewares

Authentication is divided into two parts: Hashing (storing credentials securely) and Tokens (verifying clients statelessly).

### Password Hashing Flow (Bcrypt)

We hash passwords before database storage to protect against exposure if the database is compromised. **Bcrypt** protects passwords through:
1.  **Salt Generation**: A random string (salt) is appended to the password before hashing.
2.  **Adaptive Cost Factor**: The number of hashing rounds scales exponentially ($2^{\text{cost}}$). We use a cost factor of **10**, which runs in ~100ms on a modern CPU, preventing brute-force attacks.

```
User Password ──> [ Add Salt ] ──> [ Hash 2^10 times ] ──> Hashed Output
```

#### Register Controller Implementation:
```javascript
// server/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // 1. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Create user with hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    // 3. Sign JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server registration error.' });
  }
};
```

### Stateless JWT Middleware

To prevent the server from storing session states in database RAM (which blocks horizontal scaling), we use signed **JSON Web Tokens**. The client attaches this token to the `Authorization` header of outgoing requests: `Bearer <token>`.

```
[ Client ] ──(Request + Header: Bearer <token>)──> [ server.js ]
                                                       │
                                            [ verifyJWT Middleware ]
                                                       │
                                            (Checks signature key)
                                                       │
                                            ┌──────────┴──────────┐
                                         [ Valid ]             [ Invalid ]
                                            │                     │
                                      (Pass to Route)       (401 Unauthorized)
```

#### Verification Middleware Implementation:
```javascript
// server/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Extract token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Splits "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided.' });
  }

  try {
    // Cryptographically verify token signature
    const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedPayload; // Inject payload metadata (userId, role) into req
    next(); // Pass control to the next controller
  } catch (err) {
    res.status(403).json({ message: 'Authentication Denied: Invalid or Expired Token.' });
  }
};
```

---

## 3. WebSockets, Room States & High-Frequency Delta Sync

Standard HTTP is unidirectional—clients request, servers reply. Multiplayer physics classrooms require high-frequency updates, which we implement using **WebSockets (Socket.io)** to maintain a persistent, bidirectional TCP connection.

### WebSocket Connection Topology

```
             ┌──────────┐
             │  Server  │
             └────┬─────┘
       ┌──────────┼──────────┐
       ▼          ▼          ▼
   [ Spectator] [ Host ] [ Spectator]
```

1.  **Room Registry**: Active classrooms are grouped using Socket.io rooms: `socket.join("room:UEH46N")`.
2.  **Broadcasting**: When a student chat is sent, it is broadcast only to users in that room, reducing network traffic:
    `socket.to(roomCode).emit("chat:message", payload)`.

### High-Frequency Delta Sync Architecture

Broadcasting coordinates of every physics body at 60Hz can saturate client bandwidth and crash browser event queues. We optimize this with:
1.  **Hz Capping**: Authoritative Host sync updates are throttled to **30Hz** (once every 33ms).
2.  **Local Interpolation**: Spectators receive updates and smoothly interpolate positions locally rather than resetting positions abruptly.
3.  **Client-Side Ignorance**: Spectator drag inputs take local priority, overriding host state broadcasts for the active body to prevent rubber-banding.

```
[ Authoritative Host ] ──(30Hz broadcast coordinates)──> [ Socket Server ] 
                                                                 │
                                                       (Forward to spectators)
                                                                 │
                                                                 ▼
                                                    [ Spectator Canvas Render ]
                                                     - Interpolates positions
                                                     - If user is dragging a body,
                                                       ignores host sync for that body!
```

---

## 4. 10-Day Mentor Mode Study Roadmap

This roadmap is designed to build full-stack engineering proficiency in 10 days.

```
DAY 1-2      DAY 3-4      DAY 5-6      DAY 7-8      DAY 9-10
Node &       Express &    MongoDB      WebSockets   Advanced LLM &
Vite Setup   Auth Route   Schemas      Rooms Sync   Project Wrap
```

### Day 1 & 2: Project Architecture & Environment Bootstrapping
- **Goal**: Understand development proxies, monorepo workspaces, and environment setups.
- **YouTube Search Terms**:
  - `Vite proxy configuration guide`
  - `Node.js project structure best practices`
- **Readings**:
  - [Vite Config Server Options Proxy](https://vite.dev/config/server-options.html#server-proxy)
- **Challenge**: Initialize a Node.js express backend and configure a Vite proxy to route backend requests to `/api` without CORS errors.

### Day 3 & 4: Password Security & JWT Middleware
- **Goal**: Master password hashing, salts, and stateless token verifications.
- **YouTube Search Terms**:
  - `How Bcrypt works under the hood`
  - `JWT authentication Node express tutorial`
- **Readings**:
  - [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- **Challenge**: Write a custom express middleware from scratch that verifies signed JWTs and handles expired or manipulated signatures with correct HTTP status codes (401/403).

### Day 5 & 6: MongoDB Atlas & Schema Design
- **Goal**: Master Mongoose models, validation, and DNS SRV troubleshooting.
- **YouTube Search Terms**:
  - `MongoDB schema design for beginners`
  - `Mongoose validations and index tutorial`
- **Readings**:
  - [MongoDB Database Design & Sharding Guidelines](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- **Challenge**: Troubleshoot a simulated connection failure by converting a `mongodb+srv://` URI into a standard replica set connection string.

### Day 7 & 8: High-Frequency WebSockets & Room Routing
- **Goal**: Implement low-latency bidirectional rooms, state syncs, and multiplayer drag handshakes.
- **YouTube Search Terms**:
  - `Socket.io rooms and namespaces tutorial`
  - `Realtime multiplayer physics sync concepts`
- **Readings**:
  - [Socket.io Room Documentation](https://socket.io/docs/v4/rooms/)
- **Challenge**: Build a spectator authority handshake that prevents body snapping when a spectator drags an object under host synchronization.

### Day 9 & 10: AI Chat Integration & Telemetry Telemetry
- **Goal**: Connect frontends to live LLMs (Gemini/OpenAI) using spatial sandbox details.
- **YouTube Search Terms**:
  - `System instructions prompt engineering tutorial`
  - `Google Gemini developer API integration Node`
- **Challenge**: Inject simulated physics coordinates (mass, speed, friction) into an LLM prompt dynamically to build a tutor that explains sandbox physics in real-time.
