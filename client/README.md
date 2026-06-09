# VIRTUAL-LAB Client Application

This directory contains the Single Page Application (SPA) frontend for VIRTUAL-LAB, built with React, Vite, and Tailwind CSS. 

## Technical Overview

The client coordinates real-time user actions, calculates rigid-body physical forces inside the browser container, and manages WebSocket connections to sync sandbox state across users.

Key technical specifications:
- **Physics Engine**: Matter.js operates as the simulation engine. The physics loop (running at 60Hz) is isolated inside React references (`useRef`), decoupling high-frequency calculation ticks from declarative React state updates.
- **Data Visualization**: Recharts plots real-time kinematics metrics (such as Velocity X and Displacement X) by throttling engine state polling to 150ms.
- **Styling**: Structured using a high-contrast Neo-Brutalist design language with hard offsets, geometric grids, and CSS-based grid canvas layers.
- **WebSocket Gateway**: A central React context provider (`SocketContext`) hoists the Socket.io connection channel to manage synchronization updates and coordinate multiplayer lobby states.

## Folder Directory

- `/src/components/canvas/`: Holds `PhysicsCanvas.jsx`, which manages the Matter.js lifecycle, custom shape spawning, interactive drag-and-drop constraints, and physics state serialization.
- `/src/components/panels/`: Contains layout modules:
  - `LeftToolbar.jsx`: Handles shape tools and guided experiment template triggers.
  - `RightInspector.jsx`: Displays metrics, edits mass/friction parameters, and renders kinematics line charts.
  - `AIProf.jsx`: Renders the context-aware educational tutor panel.
  - `BottomPanel.jsx`: Manages real-time classroom participants and text logs.
  - `AnalyticsModal.jsx`: Plots overall system kinetic/potential energy curves.
  - `LibraryModal.jsx`: Interfaces with the database CRUD API to save and load canvas layouts.
- `/src/context/`: Contains the global React Context providers for WebSockets room communication.
- `/src/index.css`: Imports typography tokens and defines Neo-Brutalist border and shadow classes.

## Development Setup

To run the client standalone:
1. Install client dependencies:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.
