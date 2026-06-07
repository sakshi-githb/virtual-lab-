import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Matter from 'matter-js';
import { useSocket } from '../../context/SocketContext';

const PhysicsCanvas = forwardRef(({ onSelectBody, activeTool, activeColor = '#FACC15' }, ref) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  const mouseConstraintRef = useRef(null);
  
  // Track selected body ref to modify in real-time
  const selectedBodyRef = useRef(null);

  // Consume WebSockets hooks for collaboration sync
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const isHost = socketContext?.isHost;
  const roomCode = socketContext?.roomCode;

  const socketRef = useRef(null);
  const roomCodeRef = useRef(null);

  useEffect(() => {
    socketRef.current = socket;
    roomCodeRef.current = roomCode;
  }, [socket, roomCode]);

  useImperativeHandle(ref, () => ({
    // Spawns a box body
    spawnBox: (x = 400, y = 150, width = 60, height = 60, isStatic = false, syncId = null, color = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const fillStyle = color || activeColor;
      const box = Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: isStatic,
        restitution: 0.5,
        friction: 0.1,
        render: {
          fillStyle: fillStyle,
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });

      box.syncId = syncId || `${Date.now()}-box-${Math.random().toString(36).substr(2, 9)}`;
      box.labelName = `Box #${engine.world.bodies.filter(b => b.shapeType === 'box').length + 1}`;
      box.customColor = fillStyle;
      box.shapeType = 'box';

      Matter.Composite.add(engine.world, box);
      selectBody(box);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'spawn',
          data: { shapeType: 'box', x, y, width, height, isStatic, syncId: box.syncId, color: fillStyle }
        });
      }
    },

    // Spawns a circle body
    spawnCircle: (x = 400, y = 150, radius = 30, syncId = null, color = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const fillStyle = color || activeColor;
      const circle = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.6,
        friction: 0.1,
        render: {
          fillStyle: fillStyle,
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });

      circle.syncId = syncId || `${Date.now()}-circle-${Math.random().toString(36).substr(2, 9)}`;
      circle.labelName = `Circle #${engine.world.bodies.filter(b => b.shapeType === 'circle').length + 1}`;
      circle.customColor = fillStyle;
      circle.shapeType = 'circle';

      Matter.Composite.add(engine.world, circle);
      selectBody(circle);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'spawn',
          data: { shapeType: 'circle', x, y, radius, syncId: circle.syncId, color: fillStyle }
        });
      }
    },

    // Spawns a polygon
    spawnPolygon: (x = 400, y = 150, sides = 5, radius = 40, syncId = null, color = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const fillStyle = color || activeColor;
      const poly = Matter.Bodies.polygon(x, y, sides, radius, {
        restitution: 0.4,
        friction: 0.1,
        render: {
          fillStyle: fillStyle,
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });

      poly.syncId = syncId || `${Date.now()}-poly-${Math.random().toString(36).substr(2, 9)}`;
      poly.labelName = `${sides}-gon #${engine.world.bodies.filter(b => b.shapeType === 'polygon').length + 1}`;
      poly.customColor = fillStyle;
      poly.shapeType = 'polygon';
      poly.sidesCount = sides;

      Matter.Composite.add(engine.world, poly);
      selectBody(poly);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'spawn',
          data: { shapeType: 'polygon', x, y, sides, radius, syncId: poly.syncId, color: fillStyle }
        });
      }
    },

    // Spawns a pendulum (Pivot + Cable + End Mass)
    spawnPendulum: (x = 400, y = 100, pivotSyncId = null, bobSyncId = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const length = 150;
      const radius = 30;

      const actualPivotId = pivotSyncId || `${Date.now()}-pivot-${Math.random().toString(36).substr(2, 9)}`;
      const actualBobId = bobSyncId || `${Date.now()}-bob-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Anchor (Static pivot)
      const pivot = Matter.Bodies.circle(x, y, 8, {
        isStatic: true,
        render: { fillStyle: '#1A1A1A' }
      });
      pivot.syncId = actualPivotId;

      // 2. Heavy bob (Moving body)
      const bob = Matter.Bodies.circle(x, y + length, radius, {
        restitution: 0.8,
        friction: 0.05,
        density: 0.02, // heavier
        render: {
          fillStyle: '#3B82F6', // brutalBlue
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      bob.labelName = "Pendulum Bob";
      bob.shapeType = 'circle';
      bob.syncId = actualBobId;

      // 3. Elastic spring constraint (acts as cable)
      const constraint = Matter.Constraint.create({
        bodyA: pivot,
        bodyB: bob,
        length: length,
        stiffness: 1, // rigid
        render: {
          strokeStyle: '#1A1A1A',
          lineWidth: 3
        }
      });

      Matter.Composite.add(engine.world, [pivot, bob, constraint]);
      selectBody(bob);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'preset',
          data: { presetType: 'pendulum', x, y, pivotSyncId: actualPivotId, bobSyncId: actualBobId }
        });
      }
    },

    // Spawns a spring-anchored block
    spawnSpringBlock: (x = 400, y = 200, anchorSyncId = null, blockSyncId = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const actualAnchorId = anchorSyncId || `${Date.now()}-springanchor-${Math.random().toString(36).substr(2, 9)}`;
      const actualBlockId = blockSyncId || `${Date.now()}-springblock-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Static anchor
      const anchor = Matter.Bodies.rectangle(x, y - 100, 40, 20, {
        isStatic: true,
        render: { fillStyle: '#1A1A1A' }
      });
      anchor.syncId = actualAnchorId;

      // 2. Moving spring block
      const block = Matter.Bodies.rectangle(x, y, 50, 50, {
        restitution: 0.2,
        friction: 0.2,
        render: {
          fillStyle: '#EF4444', // brutalRed
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      block.labelName = "Spring Block";
      block.shapeType = 'box';
      block.syncId = actualBlockId;

      // 3. Spring constraint
      const spring = Matter.Constraint.create({
        bodyA: anchor,
        pointB: { x: 0, y: 0 },
        bodyB: block,
        stiffness: 0.05, // highly elastic spring
        damping: 0.05,
        render: {
          strokeStyle: '#1A1A1A',
          lineWidth: 4,
          type: 'spring' // Tells Matter.js to draw spring waves
        }
      });

      Matter.Composite.add(engine.world, [anchor, block, spring]);
      selectBody(block);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'preset',
          data: { presetType: 'spring', x, y, anchorSyncId: actualAnchorId, blockSyncId: actualBlockId }
        });
      }
    },

    // Controls: Play / Pause
    setRunning: (isRunning) => {
      const runner = runnerRef.current;
      const engine = engineRef.current;
      if (!runner || !engine) return;

      if (isRunning) {
        Matter.Runner.run(runner, engine);
      } else {
        Matter.Runner.stop(runner);
      }
    },

    // Controls: Reset world
    resetWorld: (isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      // Clear world bodies except boundaries
      const bodiesToKeep = engine.world.bodies.filter(b => b.isBoundary);
      
      // Clear entire composite
      Matter.Composite.clear(engine.world, false);
      
      // Add back boundaries
      Matter.Composite.add(engine.world, bodiesToKeep);
      
      selectedBodyRef.current = null;
      onSelectBody(null);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', { actionType: 'reset', data: {} });
      }
    },

    // Inspector API: Edit selected body parameters
    updateSelectedBodyProperty: (key, value, isRemote = false) => {
      const body = selectedBodyRef.current;
      if (!body) return;

      if (key === 'mass') {
        Matter.Body.setMass(body, parseFloat(value));
      } else if (key === 'friction') {
        body.friction = parseFloat(value);
      } else if (key === 'restitution') {
        body.restitution = parseFloat(value);
      } else if (key === 'static') {
        Matter.Body.setStatic(body, value);
      } else if (key === 'labelName') {
        body.labelName = value;
      }
      
      // Send fresh packet to update React UI states
      triggerBodySelectionUpdate(body);

      if (!isRemote && roomCodeRef.current && socketRef.current && body.syncId) {
        socketRef.current.emit('physics:action', {
          actionType: 'updateProperty',
          data: { syncId: body.syncId, key, value }
        });
      }
    },

    // Update body property remotely by syncId
    updateBodyPropertyBySyncId: (syncId, key, value) => {
      const engine = engineRef.current;
      if (!engine) return;

      const body = engine.world.bodies.find(b => b.syncId === syncId);
      if (!body) return;

      if (key === 'mass') {
        Matter.Body.setMass(body, parseFloat(value));
      } else if (key === 'friction') {
        body.friction = parseFloat(value);
      } else if (key === 'restitution') {
        body.restitution = parseFloat(value);
      } else if (key === 'static') {
        Matter.Body.setStatic(body, value);
      } else if (key === 'labelName') {
        body.labelName = value;
      }

      if (selectedBodyRef.current && selectedBodyRef.current.syncId === syncId) {
        triggerBodySelectionUpdate(body);
      }
    },

    // Adjust global gravity
    setGravity: (yVal) => {
      const engine = engineRef.current;
      if (engine) {
        engine.gravity.y = parseFloat(yVal);
      }
    }
  }));

  const selectBody = (body) => {
    selectedBodyRef.current = body;
    triggerBodySelectionUpdate(body);
  };

  const triggerBodySelectionUpdate = (body) => {
    if (!body) {
      onSelectBody(null);
      return;
    }
    onSelectBody({
      id: body.id,
      syncId: body.syncId,
      labelName: body.labelName || body.label,
      mass: body.mass.toFixed(2),
      friction: body.friction.toFixed(2),
      restitution: body.restitution.toFixed(2),
      density: (body.density * 1000).toFixed(2),
      isStatic: body.isStatic,
      position: { x: Math.round(body.position.x), y: Math.round(body.position.y) },
      velocity: { x: body.velocity.x.toFixed(1), y: body.velocity.y.toFixed(1) },
      shapeType: body.shapeType || 'polygon'
    });
  };

  // WebSockets synchronization listeners
  useEffect(() => {
    if (!socket || !roomCode) return;

    // Listen to remote actions (spawn, preset, reset, property updates, drag)
    const handleIncomingAction = ({ actionType, data }) => {
      const engine = engineRef.current;
      if (!engine) return;

      switch (actionType) {
        case 'spawn':
          if (data.shapeType === 'box') {
            ref.current?.spawnBox(data.x, data.y, data.width, data.height, data.isStatic, data.syncId, data.color, true);
          } else if (data.shapeType === 'circle') {
            ref.current?.spawnCircle(data.x, data.y, data.radius, data.syncId, data.color, true);
          } else if (data.shapeType === 'polygon') {
            ref.current?.spawnPolygon(data.x, data.y, data.sides, data.radius, data.syncId, data.color, true);
          }
          break;
        case 'preset':
          if (data.presetType === 'pendulum') {
            ref.current?.spawnPendulum(data.x, data.y, data.pivotSyncId, data.bobSyncId, true);
          } else if (data.presetType === 'spring') {
            ref.current?.spawnSpringBlock(data.x, data.y, data.anchorSyncId, data.blockSyncId, true);
          }
          break;
        case 'reset':
          ref.current?.resetWorld(true);
          break;
        case 'updateProperty':
          ref.current?.updateBodyPropertyBySyncId(data.syncId, data.key, data.value);
          break;
        case 'drag':
          const draggedBody = engine.world.bodies.find(b => b.syncId === data.syncId);
          if (draggedBody) {
            Matter.Body.setPosition(draggedBody, { x: data.x, y: data.y });
            Matter.Body.setVelocity(draggedBody, { x: 0, y: 0 }); // stop velocity during drag
          }
          break;
        default:
          break;
      }
    };

    // Listen to Host high-frequency coordinate sync
    const handleIncomingSync = (syncData) => {
      if (isHost) return; // Host has authority, ignores sync updates

      const engine = engineRef.current;
      if (!engine) return;

      syncData.bodies.forEach(b => {
        const localBody = engine.world.bodies.find(l => l.syncId === b.syncId);
        if (localBody) {
          Matter.Body.setPosition(localBody, { x: b.x, y: b.y });
          Matter.Body.setAngle(localBody, b.angle);
          Matter.Body.setVelocity(localBody, { x: b.vx, y: b.vy });
        }
      });
    };

    socket.on('physics:action', handleIncomingAction);
    socket.on('physics:sync', handleIncomingSync);

    return () => {
      socket.off('physics:action', handleIncomingAction);
      socket.off('physics:sync', handleIncomingSync);
    };
  }, [socket, roomCode, isHost]);

  // Host High-Frequency Sync Broadcaster (~30Hz)
  useEffect(() => {
    if (!socket || !roomCode || !isHost) return;

    const syncInterval = setInterval(() => {
      const engine = engineRef.current;
      if (!engine) return;

      const bodiesData = engine.world.bodies
        .filter(b => b.syncId && !b.isStatic)
        .map(b => ({
          syncId: b.syncId,
          x: b.position.x,
          y: b.position.y,
          angle: b.angle,
          vx: b.velocity.x,
          vy: b.velocity.y
        }));

      if (bodiesData.length > 0) {
        socket.emit('physics:sync', { bodies: bodiesData });
      }
    }, 33);

    return () => {
      clearInterval(syncInterval);
    };
  }, [socket, roomCode, isHost]);

  // Matter.js Initial Setup & Engine mount
  useEffect(() => {
    const sceneContainer = sceneRef.current;
    if (!sceneContainer) return;

    const width = sceneContainer.clientWidth;
    const height = sceneContainer.clientHeight;

    // 1. Create Engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 }
    });
    engineRef.current = engine;

    // 2. Create Renderer
    const render = Matter.Render.create({
      element: sceneContainer,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: 'transparent',
        showVelocity: true,
        showAngleIndicator: false
      }
    });
    renderRef.current = render;
    Matter.Render.run(render);

    // 3. Create Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 4. Boundaries
    const thickness = 60;
    const wallOptions = { 
      isStatic: true, 
      isBoundary: true,
      render: { 
        fillStyle: '#1A1A1A',
        strokeStyle: '#1A1A1A'
      }
    };

    const floor = Matter.Bodies.rectangle(width / 2, height + thickness / 2 - 4, width, thickness, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2 + 4, width, thickness, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2 + 4, height / 2, thickness, height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2 - 4, height / 2, thickness, height, wallOptions);

    Matter.Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // 5. Mouse Grabbing
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
          strokeStyle: '#3B82F6',
          lineWidth: 2
        }
      }
    });
    
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    Matter.Composite.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;

    // 6. Mouse Interaction listeners
    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const clickedBody = event.source.body;
      if (clickedBody && !clickedBody.isStatic && !clickedBody.isBoundary) {
        selectBody(clickedBody);
      } else if (!clickedBody) {
        selectedBodyRef.current = null;
        onSelectBody(null);
      }
    });

    // Relay active cursor dragging
    Matter.Events.on(mouseConstraint, 'drag', (event) => {
      const body = event.body;
      if (body && body.syncId && socketRef.current && roomCodeRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'drag',
          data: { syncId: body.syncId, x: body.position.x, y: body.position.y }
        });
      }
    });

    // 7. Dynamic UI Tick Updates
    Matter.Events.on(engine, 'afterUpdate', () => {
      const selected = selectedBodyRef.current;
      if (selected && !selected.isStatic) {
        triggerBodySelectionUpdate(selected);
      }
    });

    // Resize orchestration
    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      const w = sceneRef.current.clientWidth;
      const h = sceneRef.current.clientHeight;
      
      renderRef.current.bounds.max.x = w;
      renderRef.current.bounds.max.y = h;
      renderRef.current.options.width = w;
      renderRef.current.options.height = h;
      
      if (renderRef.current.canvas) {
        renderRef.current.canvas.width = w;
        renderRef.current.canvas.height = h;
      }
      
      Matter.Body.setPosition(floor, { x: w / 2, y: h + thickness / 2 - 4 });
      Matter.Body.setPosition(rightWall, { x: w + thickness / 2 - 4, y: h / 2 });
    };
    window.addEventListener('resize', handleResize);

    // 8. Clean Dismount
    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* CSS Dotted Grid Container */}
      <div 
        ref={sceneRef} 
        className="w-full h-full notebook-grid border-4 border-charcoal shadow-brutal relative overflow-hidden"
      >
        {/* Decorative Compass Lines indicating digital twin design */}
        <div className="absolute top-4 left-4 pointer-events-none text-charcoal/20 select-none font-bold text-lg">
          + 2D PHYSICS GRAPH
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none text-charcoal/20 select-none font-bold text-lg">
          VIRTUAL-LAB PLATFORM
        </div>
      </div>
    </div>
  );
});

PhysicsCanvas.displayName = 'PhysicsCanvas';

export default PhysicsCanvas;
