import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
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

  // Diagnostic Debug HUD State
  const [debugInfo, setDebugInfo] = useState({
    w: 0,
    h: 0,
    mouseX: 0,
    mouseY: 0,
    button: -1,
    bodies: 0,
    ticks: 0,
    selected: 'None',
    latency: undefined
  });
  const tickCountRef = useRef(0);

  const [lagMs, setLagMs] = useState(0);
  const lagMsRef = useRef(0);
  useEffect(() => {
    lagMsRef.current = lagMs;
  }, [lagMs]);

  // Consume WebSockets hooks for collaboration sync
  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const isHost = socketContext?.isHost;
  const roomCode = socketContext?.roomCode;

  const socketRef = useRef(null);
  const roomCodeRef = useRef(null);
  const isHostRef = useRef(isHost);

  useEffect(() => {
    socketRef.current = socket;
    roomCodeRef.current = roomCode;
    isHostRef.current = isHost;
  }, [socket, roomCode, isHost]);

  const performResetWorld = (isRemote = false) => {
    const engine = engineRef.current;
    if (!engine) return;

    // Selectively remove all bodies except the outer boundary walls
    const bodiesToRemove = engine.world.bodies.filter(b => !b.isBoundary);
    Matter.Composite.remove(engine.world, bodiesToRemove);

    // Selectively remove all constraints except the mouse grabbing constraint itself
    if (mouseConstraintRef.current) {
      const constraintsToRemove = engine.world.constraints.filter(
        c => c !== mouseConstraintRef.current && c !== mouseConstraintRef.current.constraint
      );
      Matter.Composite.remove(engine.world, constraintsToRemove);
    } else {
      Matter.Composite.clear(engine.world, false);
    }
    
    selectedBodyRef.current = null;
    onSelectBody(null);

    if (!isRemote && roomCodeRef.current && socketRef.current) {
      socketRef.current.emit('physics:action', { actionType: 'reset', data: {} });
    }
  };

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
      box.width = width;
      box.height = height;

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
      circle.radius = radius;

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
      poly.radius = radius;

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
      pivot.shapeType = 'circle';
      pivot.radius = 8;

      // 2. Heavy bob (Moving body) - Spawned at 45 degree offset so it immediately oscillates on load
      const bob = Matter.Bodies.circle(x - 106, y + 106, radius, {
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
      bob.radius = radius;

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
    spawnSpringBlock: (x = 450, y = 200, anchorSyncId = null, blockSyncId = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const actualAnchorId = anchorSyncId || `${Date.now()}-springanchor-${Math.random().toString(36).substr(2, 9)}`;
      const actualBlockId = blockSyncId || `${Date.now()}-springblock-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Static anchor (placed horizontally on the left)
      const anchor = Matter.Bodies.rectangle(x - 150, y, 20, 40, {
        isStatic: true,
        render: { fillStyle: '#1A1A1A' }
      });
      anchor.syncId = actualAnchorId;
      anchor.shapeType = 'box';
      anchor.width = 20;
      anchor.height = 40;

      // 2. Moving spring block - Spawned stretched to the right (x + 80) so it oscillates immediately
      const block = Matter.Bodies.rectangle(x + 80, y, 50, 50, {
        restitution: 0.2,
        friction: 0.05, // low friction for smooth sliding
        render: {
          fillStyle: '#EF4444', // brutalRed
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      block.labelName = "Spring Block";
      block.shapeType = 'box';
      block.syncId = actualBlockId;
      block.width = 50;
      block.height = 50;

      // 3. Spring constraint (horizontal) with explicit resting length
      const spring = Matter.Constraint.create({
        bodyA: anchor,
        pointB: { x: 0, y: 0 },
        bodyB: block,
        length: 150, // Stretched by 80px on spawn
        stiffness: 0.05, // highly elastic spring
        damping: 0.02, // lower damping for longer oscillation waves
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

    // Spawns a friction slope inclined plane preset
    spawnFrictionSlope: (isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const rampSyncId = `${Date.now()}-ramp-${Math.random().toString(36).substr(2, 9)}`;
      const blockSyncId = `${Date.now()}-slidingblock-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Static inclined plane (ramp)
      const ramp = Matter.Bodies.rectangle(400, 300, 350, 20, {
        isStatic: true,
        angle: 0.4, // ~23 degrees
        render: {
          fillStyle: '#1A1A1A',
          strokeStyle: '#1A1A1A',
          lineWidth: 2
        }
      });
      ramp.syncId = rampSyncId;
      ramp.labelName = "Inclined Plane";
      ramp.shapeType = 'box';
      ramp.width = 350;
      ramp.height = 20;

      // 2. Dynamic sliding block on top
      const block = Matter.Bodies.rectangle(300, 200, 45, 45, {
        angle: 0.4,
        restitution: 0.1,
        friction: 0.05, // low initial friction
        render: {
          fillStyle: '#EF4444', // brutalRed
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      block.syncId = blockSyncId;
      block.labelName = "Sliding Block";
      block.shapeType = 'box';
      block.width = 45;
      block.height = 45;

      Matter.Composite.add(engine.world, [ramp, block]);
      selectBody(block);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'preset',
          data: { presetType: 'frictionSlope', rampSyncId, blockSyncId }
        });
      }
    },

    // Spawns a bouncing bounciness comparison preset
    spawnBouncingComparison: (isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const ballASyncId = `${Date.now()}-ballA-${Math.random().toString(36).substr(2, 9)}`;
      const ballBSyncId = `${Date.now()}-ballB-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Ball A (Highly Elastic - Bouncy)
      const ballA = Matter.Bodies.circle(300, 100, 25, {
        restitution: 0.9,
        friction: 0.1,
        render: {
          fillStyle: '#FACC15', // brutalYellow
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      ballA.syncId = ballASyncId;
      ballA.labelName = "Bouncy Ball (Elastic)";
      ballA.shapeType = 'circle';
      ballA.radius = 25;

      // 2. Ball B (Inelastic - Dull)
      const ballB = Matter.Bodies.circle(500, 100, 25, {
        restitution: 0.15,
        friction: 0.1,
        render: {
          fillStyle: '#3B82F6', // brutalBlue
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      ballB.syncId = ballBSyncId;
      ballB.labelName = "Lead Ball (Inelastic)";
      ballB.shapeType = 'circle';
      ballB.radius = 25;

      Matter.Composite.add(engine.world, [ballA, ballB]);
      selectBody(ballA);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'preset',
          data: { presetType: 'bouncingComparison', ballASyncId, ballBSyncId }
        });
      }
    },

    // Spawns a projectile motion cannon setup
    spawnProjectileMotion: (cannonSyncId = null, projectileSyncId = null, targetSyncId = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const cId = cannonSyncId || `${Date.now()}-cannon-${Math.random().toString(36).substr(2, 9)}`;
      const pId = projectileSyncId || `${Date.now()}-proj-${Math.random().toString(36).substr(2, 9)}`;
      const tId = targetSyncId || `${Date.now()}-target-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Static Cannon Pipe
      const cannon = Matter.Bodies.rectangle(120, 360, 80, 30, {
        isStatic: true,
        angle: -0.6, // tilt up
        render: {
          fillStyle: '#1A1A1A',
          strokeStyle: '#1A1A1A'
        }
      });
      cannon.syncId = cId;
      cannon.labelName = "Cannon Base";
      cannon.shapeType = 'box';
      cannon.width = 80;
      cannon.height = 30;

      // 2. Dynamic Projectile Ball (Spawn at cannon mouth)
      const ball = Matter.Bodies.circle(153, 338, 15, {
        restitution: 0.3,
        friction: 0.05,
        render: {
          fillStyle: '#EF4444', // brutalRed
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      ball.syncId = pId;
      ball.labelName = "Cannon Ball";
      ball.shapeType = 'circle';
      ball.radius = 15;

      // Set launch velocity
      Matter.Body.setVelocity(ball, { x: 9, y: -7 });

      // 3. Static Target Zone Basket
      const target = Matter.Bodies.rectangle(600, 420, 80, 20, {
        isStatic: true,
        render: {
          fillStyle: '#10B981', // brutalGreen
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      target.syncId = tId;
      target.labelName = "Target Basket";
      target.shapeType = 'box';
      target.width = 80;
      target.height = 20;

      Matter.Composite.add(engine.world, [cannon, ball, target]);
      selectBody(ball);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'preset',
          data: { presetType: 'projectile', cannonSyncId: cId, projectileSyncId: pId, targetSyncId: tId }
        });
      }
    },

    // Spawns a catapult lever launch setup
    spawnCatapult: (baseSyncId = null, armSyncId = null, weightSyncId = null, projectileSyncId = null, isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const bId = baseSyncId || `${Date.now()}-catbase-${Math.random().toString(36).substr(2, 9)}`;
      const aId = armSyncId || `${Date.now()}-catarm-${Math.random().toString(36).substr(2, 9)}`;
      const wId = weightSyncId || `${Date.now()}-catwt-${Math.random().toString(36).substr(2, 9)}`;
      const pId = projectileSyncId || `${Date.now()}-catproj-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Static Pivot Base
      const base = Matter.Bodies.circle(400, 400, 15, {
        isStatic: true,
        render: {
          fillStyle: '#1A1A1A'
        }
      });
      base.syncId = bId;
      base.labelName = "Catapult Pivot";
      base.shapeType = 'circle';
      base.radius = 15;

      // 2. Dynamic Arm Board (seesaw plank)
      const arm = Matter.Bodies.rectangle(400, 400, 280, 15, {
        density: 0.01,
        render: {
          fillStyle: '#FACC15', // brutalYellow
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      arm.syncId = aId;
      arm.labelName = "Catapult Arm";
      arm.shapeType = 'box';
      arm.width = 280;
      arm.height = 15;

      // 3. Pin Constraint pinning the arm to the pivot
      const pin = Matter.Constraint.create({
        bodyA: base,
        bodyB: arm,
        stiffness: 1.0,
        render: {
          visible: true,
          strokeStyle: '#1A1A1A',
          lineWidth: 3
        }
      });

      // 4. Heavy Block (counterweight) - Spawned high above left arm tip
      const weight = Matter.Bodies.rectangle(270, 150, 60, 60, {
        density: 0.05, // very heavy counterweight
        render: {
          fillStyle: '#3B82F6', // brutalBlue
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      weight.syncId = wId;
      weight.labelName = "Counterweight";
      weight.shapeType = 'box';
      weight.width = 60;
      weight.height = 60;

      // 5. Light Projectile Ball on right arm tip
      const projectile = Matter.Bodies.circle(530, 370, 16, {
        density: 0.001, // lightweight
        restitution: 0.5,
        render: {
          fillStyle: '#EF4444', // brutalRed
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      projectile.syncId = pId;
      projectile.labelName = "Launched Ball";
      projectile.shapeType = 'circle';
      projectile.radius = 16;

      Matter.Composite.add(engine.world, [base, arm, pin, weight, projectile]);
      selectBody(projectile);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'preset',
          data: { presetType: 'catapult', baseSyncId: bId, armSyncId: aId, weightSyncId: wId, projectileSyncId: pId }
        });
      }
    },

    // Spawns a suspension bridge stress setup
    spawnBridge: (leftPlatformSyncId = null, rightPlatformSyncId = null, loadBlockSyncId = null, plankIds = [], isRemote = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const lpId = leftPlatformSyncId || `${Date.now()}-brlplat-${Math.random().toString(36).substr(2, 9)}`;
      const rpId = rightPlatformSyncId || `${Date.now()}-brrplat-${Math.random().toString(36).substr(2, 9)}`;
      const lbId = loadBlockSyncId || `${Date.now()}-brload-${Math.random().toString(36).substr(2, 9)}`;

      // 1. Static left Platform
      const leftPlat = Matter.Bodies.rectangle(140, 280, 100, 30, {
        isStatic: true,
        render: { fillStyle: '#1A1A1A' }
      });
      leftPlat.syncId = lpId;
      leftPlat.labelName = "Left Deck";
      leftPlat.shapeType = 'box';
      leftPlat.width = 100;
      leftPlat.height = 30;

      // 2. Static right Platform
      const rightPlat = Matter.Bodies.rectangle(660, 280, 100, 30, {
        isStatic: true,
        render: { fillStyle: '#1A1A1A' }
      });
      rightPlat.syncId = rpId;
      rightPlat.labelName = "Right Deck";
      rightPlat.shapeType = 'box';
      rightPlat.width = 100;
      rightPlat.height = 30;

      // 3. Plank Chain
      const plankCount = 7;
      const plankWidth = 50;
      const plankHeight = 12;
      const startX = 220;
      const gap = 60;
      const y = 280;

      const planks = [];
      const constraints = [];

      for (let i = 0; i < plankCount; i++) {
        const px = startX + i * gap;
        const plank = Matter.Bodies.rectangle(px, y, plankWidth, plankHeight, {
          restitution: 0.1,
          friction: 0.2,
          density: 0.005,
          render: {
            fillStyle: '#FACC15', // brutalYellow
            strokeStyle: '#1A1A1A',
            lineWidth: 3
          }
        });
        plank.syncId = (plankIds && plankIds[i]) || `${Date.now()}-plank-${i}-${Math.random().toString(36).substr(2, 9)}`;
        plank.labelName = `Plank #${i + 1}`;
        plank.shapeType = 'box';
        plank.width = plankWidth;
        plank.height = plankHeight;
        planks.push(plank);
      }

      // Link left platform to first plank
      constraints.push(Matter.Constraint.create({
        bodyA: leftPlat,
        pointB: { x: -plankWidth / 2, y: 0 },
        bodyB: planks[0],
        stiffness: 0.7,
        length: 25,
        render: { strokeStyle: '#1A1A1A', lineWidth: 3 }
      }));

      // Link planks consecutively
      for (let i = 0; i < plankCount - 1; i++) {
        constraints.push(Matter.Constraint.create({
          bodyA: planks[i],
          pointA: { x: plankWidth / 2, y: 0 },
          bodyB: planks[i + 1],
          pointB: { x: -plankWidth / 2, y: 0 },
          stiffness: 0.7,
          length: 12,
          render: { strokeStyle: '#1A1A1A', lineWidth: 3 }
        }));
      }

      // Link last plank to right platform
      constraints.push(Matter.Constraint.create({
        bodyA: planks[plankCount - 1],
        pointA: { x: plankWidth / 2, y: 0 },
        bodyB: rightPlat,
        stiffness: 0.7,
        length: 25,
        render: { strokeStyle: '#1A1A1A', lineWidth: 3 }
      }));

      // 4. Heavy Load Block dropped onto center plank
      const load = Matter.Bodies.rectangle(400, 100, 45, 45, {
        density: 0.02,
        render: {
          fillStyle: '#EF4444', // brutalRed
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });
      load.syncId = lbId;
      load.labelName = "Stress Weight";
      load.shapeType = 'box';
      load.width = 45;
      load.height = 45;

      const elementsToAdd = [leftPlat, rightPlat, ...planks, ...constraints, load];
      Matter.Composite.add(engine.world, elementsToAdd);
      selectBody(load);

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'preset',
          data: { 
            presetType: 'bridge', 
            leftPlatformSyncId: lpId, 
            rightPlatformSyncId: rpId, 
            loadBlockSyncId: lbId,
            plankIds: planks.map(p => p.syncId)
          }
        });
      }
    },

    // Controls: Play / Pause
    setRunning: (isRunning) => {
      const runner = runnerRef.current;
      const engine = engineRef.current;
      if (!runner || !engine) return;

      if (isRunning) {
        // Prevent duplicate loops by stopping the runner before running it again
        Matter.Runner.stop(runner);
        Matter.Runner.run(runner, engine);
      } else {
        Matter.Runner.stop(runner);
      }
    },

    // Controls: Reset world
    resetWorld: (isRemote = false) => {
      performResetWorld(isRemote);
    },

    // Serializes the current active canvas state (ignoring static borders)
    serializeWorld: () => {
      const engine = engineRef.current;
      if (!engine) return { gravityY: 1.0, bodies: [], constraints: [] };

      const activeBodies = engine.world.bodies.filter(b => !b.isBoundary);
      
      const serializedBodies = activeBodies.map(b => {
        const shapeType = b.shapeType || 'polygon';
        return {
          syncId: b.syncId || `${Date.now()}-${shapeType}-${Math.random().toString(36).substr(2, 9)}`,
          labelName: b.labelName || b.label,
          shapeType: shapeType,
          x: b.position.x,
          y: b.position.y,
          vx: b.velocity ? b.velocity.x : 0,
          vy: b.velocity ? b.velocity.y : 0,
          angle: b.angle || 0,
          width: b.width || null,
          height: b.height || null,
          radius: b.radius || null,
          sides: b.sidesCount || null,
          mass: (b.mass === Infinity || isNaN(b.mass) || b.mass === null) ? 1.0 : b.mass,
          friction: (b.friction === Infinity || isNaN(b.friction) || b.friction === null) ? 0.1 : b.friction,
          restitution: (b.restitution === Infinity || isNaN(b.restitution) || b.restitution === null) ? 0.0 : b.restitution,
          isStatic: b.isStatic,
          color: b.customColor || b.render.fillStyle
        };
      });

      const activeConstraints = engine.world.constraints.filter(c => {
        if (mouseConstraintRef.current && (c === mouseConstraintRef.current || c === mouseConstraintRef.current.constraint)) {
          return false;
        }
        if (c.label === 'Mouse Constraint') {
          return false;
        }
        return true;
      });

      const serializedConstraints = activeConstraints.map(c => {
        return {
          bodyAId: c.bodyA ? c.bodyA.syncId : null,
          bodyBId: c.bodyB ? c.bodyB.syncId : null,
          pointA: c.pointA ? { x: c.pointA.x, y: c.pointA.y } : { x: 0, y: 0 },
          pointB: c.pointB ? { x: c.pointB.x, y: c.pointB.y } : { x: 0, y: 0 },
          length: c.length,
          stiffness: c.stiffness,
          damping: c.damping || 0,
          color: c.render && c.render.strokeStyle ? c.render.strokeStyle : '#1A1A1A',
          lineWidth: c.render && c.render.lineWidth ? c.render.lineWidth : 3,
          label: c.label || ''
        };
      });

      return {
        gravityY: engine.gravity.y,
        bodies: serializedBodies,
        constraints: serializedConstraints
      };
    },

    // Deserializes a loaded layout into Matter.js engine world
    deserializeWorld: (bodiesList = [], gravityY = 1.0, isRemote = false, constraintsList = []) => {
      const engine = engineRef.current;
      if (!engine) return;

      performResetWorld(isRemote);

      engine.gravity.y = parseFloat(gravityY !== undefined ? gravityY : 1.0);

      const bodyMap = {};

      bodiesList.forEach(b => {
        try {
          let body;
          const fillStyle = b.color || '#FACC15';
          const bodyOptions = {
            isStatic: b.isStatic,
            restitution: b.restitution !== undefined ? b.restitution : 0.5,
            friction: b.friction !== undefined ? b.friction : 0.1,
            render: {
              fillStyle: fillStyle,
              strokeStyle: '#1A1A1A',
              lineWidth: 4
            }
          };

          if (b.shapeType === 'box') {
            body = Matter.Bodies.rectangle(b.x, b.y, b.width || 60, b.height || 60, bodyOptions);
            body.width = b.width || 60;
            body.height = b.height || 60;
          } else if (b.shapeType === 'circle') {
            body = Matter.Bodies.circle(b.x, b.y, b.radius || 30, bodyOptions);
            body.radius = b.radius || 30;
          } else if (b.shapeType === 'polygon') {
            body = Matter.Bodies.polygon(b.x, b.y, b.sides || 5, b.radius || 40, bodyOptions);
            body.sidesCount = b.sides || 5;
            body.radius = b.radius || 40;
          }

          if (body) {
            body.syncId = b.syncId || `${Date.now()}-${b.shapeType}-${Math.random().toString(36).substr(2, 9)}`;
            body.labelName = b.labelName || `${b.shapeType} #${engine.world.bodies.length + 1}`;
            body.customColor = fillStyle;
            body.shapeType = b.shapeType;

            if (b.angle !== undefined && b.angle !== null) {
              Matter.Body.setAngle(body, parseFloat(b.angle));
            }
            
            // Only modify mass and velocity for dynamic (non-static) bodies
            if (!b.isStatic) {
              if (b.mass !== undefined && b.mass !== null) {
                Matter.Body.setMass(body, parseFloat(b.mass));
              }
              if (b.vx !== undefined && b.vy !== undefined && b.vx !== null && b.vy !== null) {
                Matter.Body.setVelocity(body, { x: parseFloat(b.vx), y: parseFloat(b.vy) });
              }
            }

            Matter.Composite.add(engine.world, body);
            bodyMap[body.syncId] = body;
          }
        } catch (err) {
          console.error(`[Deserialize Body Error] Failed to reconstruct body:`, err);
        }
      });

      if (constraintsList && Array.isArray(constraintsList)) {
        constraintsList.forEach(c => {
          try {
            const bodyA = c.bodyAId ? bodyMap[c.bodyAId] : null;
            const bodyB = c.bodyBId ? bodyMap[c.bodyBId] : null;

            if (c.bodyAId && !bodyA) return;
            if (c.bodyBId && !bodyB) return;

            const constraintOptions = {
              bodyA: bodyA || undefined,
              bodyB: bodyB || undefined,
              pointA: c.pointA,
              pointB: c.pointB,
              length: c.length,
              stiffness: c.stiffness,
              damping: c.damping !== undefined ? c.damping : 0,
              label: c.label || 'Constraint',
              render: {
                strokeStyle: c.color || '#1A1A1A',
                lineWidth: c.lineWidth || 3
              }
            };

            const constraint = Matter.Constraint.create(constraintOptions);
            Matter.Composite.add(engine.world, constraint);
          } catch (err) {
            console.error(`[Deserialize Constraint Error] Failed to reconstruct constraint:`, err);
          }
        });
      }

      if (!isRemote && roomCodeRef.current && socketRef.current) {
        socketRef.current.emit('physics:action', {
          actionType: 'loadLayout',
          data: { gravityY, bodies: bodiesList, constraints: constraintsList }
        });
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
    },

    // Expose system-wide kinematics and energy conservation metrics
    getSystemMetrics: () => {
      const engine = engineRef.current;
      if (!engine) return null;

      const bodies = engine.world.bodies.filter(b => !b.isBoundary && !b.isStatic);
      let totalKineticEnergy = 0;
      let totalPotentialEnergy = 0;
      let totalMass = 0;

      const canvasHeight = renderRef.current?.canvas?.height || 500;
      const g = engine.gravity.y;

      bodies.forEach(b => {
        const speed = b.speed;
        const ke = 0.5 * b.mass * speed * speed;
        // height from the bottom floor
        const height = Math.max(0, canvasHeight - b.position.y);
        const pe = b.mass * g * (height / 100); // normalized height factor for cleanly scaled values

        totalKineticEnergy += ke;
        totalPotentialEnergy += pe;
        totalMass += b.mass;
      });

      return {
        bodyCount: bodies.length,
        totalMass: parseFloat(totalMass.toFixed(1)),
        kineticEnergy: parseFloat(totalKineticEnergy.toFixed(1)),
        potentialEnergy: parseFloat(totalPotentialEnergy.toFixed(1)),
        totalEnergy: parseFloat((totalKineticEnergy + totalPotentialEnergy).toFixed(1)),
        rawBodiesList: bodies.map(b => ({
          label: b.labelName || b.label,
          x: Math.round(b.position.x),
          y: Math.round(b.position.y),
          vx: parseFloat(b.velocity.x.toFixed(2)),
          vy: parseFloat(b.velocity.y.toFixed(2)),
          speed: parseFloat(b.speed.toFixed(2)),
          mass: b.mass
        }))
      };
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
    const handleIncomingAction = (payload) => {
      const executeAction = () => {
        const { actionType, data } = payload;
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
            } else if (data.presetType === 'projectile') {
              ref.current?.spawnProjectileMotion(data.cannonSyncId, data.projectileSyncId, data.targetSyncId, true);
            } else if (data.presetType === 'catapult') {
              ref.current?.spawnCatapult(data.baseSyncId, data.armSyncId, data.weightSyncId, data.projectileSyncId, true);
            } else if (data.presetType === 'bridge') {
              ref.current?.spawnBridge(data.leftPlatformSyncId, data.rightPlatformSyncId, data.loadBlockSyncId, data.plankIds, true);
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
          case 'dragstart':
            const bodyToLock = engine.world.bodies.find(b => b.syncId === data.syncId);
            if (bodyToLock) {
              bodyToLock.draggedBy = data.dragUserId;
              bodyToLock.originalStrokeColor = bodyToLock.render.strokeStyle;
              bodyToLock.originalLineWidth = bodyToLock.render.lineWidth;
              bodyToLock.render.strokeStyle = '#EF4444'; // Neo-Brutalist red outline
              bodyToLock.render.lineWidth = 4;
            }
            break;
          case 'dragend':
            const bodyToUnlock = engine.world.bodies.find(b => b.syncId === data.syncId);
            if (bodyToUnlock) {
              bodyToUnlock.draggedBy = null;
              bodyToUnlock.render.strokeStyle = bodyToUnlock.originalStrokeColor || '#1A1A1A';
              bodyToUnlock.render.lineWidth = bodyToUnlock.originalLineWidth || 2;
            }
            break;
          case 'loadLayout':
            ref.current?.deserializeWorld(data.bodies, data.gravityY, true, data.constraints);
            break;
          default:
            break;
        }
      };

      if (lagMsRef.current > 0) {
        setTimeout(executeAction, lagMsRef.current);
      } else {
        executeAction();
      }
    };

    // Listen to Host high-frequency coordinate sync
    const handleIncomingSync = (syncData) => {
      const executeSync = () => {
        if (isHost) return; // Host has authority, ignores sync updates

        const engine = engineRef.current;
        if (!engine) return;

        syncData.bodies.forEach(b => {
          const localBody = engine.world.bodies.find(l => l.syncId === b.syncId);
          if (localBody) {
            // If this body is currently being dragged by the local user, do not let host positions snap it back
            if (mouseConstraintRef.current && mouseConstraintRef.current.body === localBody) {
              return;
            }
            // Store interpolation target parameters
            localBody.targetX = b.x;
            localBody.targetY = b.y;
            localBody.targetAngle = b.angle;
            // Set velocity immediately to keep collision calculations active
            Matter.Body.setVelocity(localBody, { x: b.vx, y: b.vy });
          }
        });
      };

      if (lagMsRef.current > 0) {
        setTimeout(executeSync, lagMsRef.current);
      } else {
        executeSync();
      }
    };

    // Host handlers for spectator late join requests
    const handleRequestState = ({ requesterSocketId }) => {
      if (!isHost) return;
      const engine = engineRef.current;
      if (!engine) return;

      const bodiesData = engine.world.bodies
        .filter(b => b.syncId && !b.isStatic && !b.isBoundary)
        .map(b => ({
          syncId: b.syncId,
          labelName: b.labelName || 'Rigid Body',
          shapeType: b.shapeType || 'box',
          x: b.position.x,
          y: b.position.y,
          width: b.width || null,
          height: b.height || null,
          radius: b.radius || null,
          sides: b.sidesCount || null,
          mass: b.mass,
          friction: b.friction,
          restitution: b.restitution,
          isStatic: b.isStatic,
          color: b.customColor || '#FACC15'
        }));

      const constraintsData = engine.world.constraints
        .filter(c => {
          if (mouseConstraintRef.current && (c === mouseConstraintRef.current || c === mouseConstraintRef.current.constraint)) {
            return false;
          }
          if (c.label === 'Mouse Constraint') {
            return false;
          }
          return true;
        })
        .map(c => ({
          bodyAId: c.bodyA ? c.bodyA.syncId : null,
          bodyBId: c.bodyB ? c.bodyB.syncId : null,
          pointA: c.pointA ? { x: c.pointA.x, y: c.pointA.y } : { x: 0, y: 0 },
          pointB: c.pointB ? { x: c.pointB.x, y: c.pointB.y } : { x: 0, y: 0 },
          length: c.length,
          stiffness: c.stiffness,
          damping: c.damping || 0,
          color: c.render && c.render.strokeStyle ? c.render.strokeStyle : '#1A1A1A',
          lineWidth: c.render && c.render.lineWidth ? c.render.lineWidth : 3,
          label: c.label || ''
        }));

      socket.emit('physics:state-response', {
        requesterSocketId,
        state: {
          bodies: bodiesData,
          constraints: constraintsData,
          gravityY: engine.gravity.y
        }
      });
    };

    const handleStateResponse = (state) => {
      if (isHost) return;
      ref.current?.deserializeWorld(state.bodies, state.gravityY, true, state.constraints);
    };

    socket.on('physics:action', handleIncomingAction);
    socket.on('physics:sync', handleIncomingSync);
    socket.on('physics:request-state', handleRequestState);
    socket.on('physics:state-response', handleStateResponse);

    return () => {
      socket.off('physics:action', handleIncomingAction);
      socket.off('physics:sync', handleIncomingSync);
      socket.off('physics:request-state', handleRequestState);
      socket.off('physics:state-response', handleStateResponse);
    };
  }, [socket, roomCode, isHost]);

  // Heartbeat to monitor real network RTT latency
  useEffect(() => {
    if (!socket || !roomCode) return;

    const pingInterval = setInterval(() => {
      socket.emit('ping:send', { timestamp: Date.now() });
    }, 2000);

    const handlePingReply = ({ timestamp }) => {
      const rtt = Date.now() - timestamp;
      setDebugInfo(prev => ({ ...prev, latency: rtt }));
    };

    socket.on('ping:reply', handlePingReply);

    return () => {
      clearInterval(pingInterval);
      socket.off('ping:reply', handlePingReply);
    };
  }, [socket, roomCode]);

  // Spectator initial catchup state recovery request
  useEffect(() => {
    if (!socket || !roomCode || isHost) return;
    socket.emit('physics:request-state');
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

    // Use container dimensions or default fallbacks
    const initialWidth = sceneContainer.clientWidth || 800;
    const initialHeight = sceneContainer.clientHeight || 500;

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
        width: initialWidth,
        height: initialHeight,
        wireframes: false,
        background: 'transparent',
        showVelocity: true,
        showAngleIndicator: false,
        pixelRatio: 1 // Forces 1:1 pixel mapping to resolve high-DPI coordinate mismatch
      }
    });
    renderRef.current = render;
    Matter.Render.run(render);

    // 3. Create Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 4. Boundaries (Using large static dimensions to prevent layout collapse on initial mount)
    const thickness = 60;
    const wallOptions = { 
      isStatic: true, 
      isBoundary: true,
      render: { 
        fillStyle: '#1A1A1A',
        strokeStyle: '#1A1A1A'
      }
    };

    const floor = Matter.Bodies.rectangle(initialWidth / 2, initialHeight + thickness / 2 - 4, 8000, thickness, wallOptions);
    const ceiling = Matter.Bodies.rectangle(initialWidth / 2, -thickness / 2 + 4, 8000, thickness, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2 + 4, initialHeight / 2, thickness, 8000, wallOptions);
    const rightWall = Matter.Bodies.rectangle(initialWidth + thickness / 2 - 4, initialHeight / 2, thickness, 8000, wallOptions);

    Matter.Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // 5. Mouse Grabbing
    const mouse = Matter.Mouse.create(render.canvas);
    render.mouse = mouse; // Sync mouse with renderer
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

    // 6. Mouse Interaction listeners - Hit test click to select or deselect bodies
    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const mousePosition = event.mouse.position;
      const allBodies = Matter.Composite.allBodies(engine.world);
      const clickedBodies = Matter.Query.point(allBodies, mousePosition);
      
      // Find the first body clicked (excluding outer boundaries)
      const validBody = clickedBodies.find(b => !b.isBoundary);
      
      if (validBody) {
        if (validBody.draggedBy && validBody.draggedBy !== socketRef.current?.id) {
          // Locked by another user, release constraint immediately
          mouseConstraint.constraint.bodyB = null;
          mouseConstraint.body = null;
          return;
        }
        selectBody(validBody);
      } else {
        selectedBodyRef.current = null;
        onSelectBody(null);
      }
    });

    // Conflict Resolution - Grab / Release Drag Lock events
    Matter.Events.on(mouseConstraint, 'startdrag', (event) => {
      const body = event.body;
      if (body && body.syncId) {
        if (body.draggedBy && body.draggedBy !== socketRef.current?.id) {
          // Locked by another user, release constraint immediately
          mouseConstraint.constraint.bodyB = null;
          mouseConstraint.body = null;
          return;
        }
        // Acquire local drag lock
        body.draggedBy = socketRef.current?.id;
        if (socketRef.current && roomCodeRef.current) {
          socketRef.current.emit('physics:action', {
            actionType: 'dragstart',
            data: { syncId: body.syncId, dragUserId: socketRef.current.id }
          });
        }
      }
    });

    Matter.Events.on(mouseConstraint, 'enddrag', (event) => {
      const body = event.body;
      if (body && body.syncId) {
        if (body.draggedBy === socketRef.current?.id) {
          body.draggedBy = null;
          if (socketRef.current && roomCodeRef.current) {
            socketRef.current.emit('physics:action', {
              actionType: 'dragend',
              data: { syncId: body.syncId }
            });
          }
        }
      }
    });

    // Relay active cursor dragging on mouse move if a body is being held
    Matter.Events.on(mouseConstraint, 'mousemove', () => {
      const body = mouseConstraint.body;
      if (body && body.syncId && socketRef.current && roomCodeRef.current) {
        if (body.draggedBy && body.draggedBy !== socketRef.current?.id) {
          // Safety fallback if mousemove triggers on locked body
          mouseConstraint.constraint.bodyB = null;
          mouseConstraint.body = null;
          return;
        }
        socketRef.current.emit('physics:action', {
          actionType: 'drag',
          data: { syncId: body.syncId, x: body.position.x, y: body.position.y }
        });
      }
    });

    // Linear interpolation loop (lerping client-side positions at 60Hz)
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (isHostRef.current) return;
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach(body => {
        if (body.targetX !== undefined && body.targetY !== undefined) {
          const dx = body.targetX - body.position.x;
          const dy = body.targetY - body.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 150) {
            // Teleport instantly if displacement is large (e.g. simulation reset / template load)
            Matter.Body.setPosition(body, { x: body.targetX, y: body.targetY });
            Matter.Body.setAngle(body, body.targetAngle);
          } else {
            // Smoothly lerp coordinates (0.25 interpolation rate)
            const newX = body.position.x + dx * 0.25;
            const newY = body.position.y + dy * 0.25;
            Matter.Body.setPosition(body, { x: newX, y: newY });
            
            // Lerp rotation angle
            const da = body.targetAngle - body.angle;
            const newAngle = body.angle + da * 0.25;
            Matter.Body.setAngle(body, newAngle);
          }
        }
      });
    });

    // 7. Dynamic UI Tick Updates
    Matter.Events.on(engine, 'afterUpdate', () => {
      const selected = selectedBodyRef.current;
      if (selected && !selected.isStatic) {
        triggerBodySelectionUpdate(selected);
      }

      // Throttled debug update (every 30 frames ~ 0.5s)
      tickCountRef.current += 1;
      if (tickCountRef.current % 30 === 0) {
        setDebugInfo(prev => ({
          ...prev,
          ticks: tickCountRef.current,
          bodies: engine.world.bodies.length,
          selected: selectedBodyRef.current ? (selectedBodyRef.current.labelName || selectedBodyRef.current.label) : 'None',
          mouseX: Math.round(mouse.position.x),
          mouseY: Math.round(mouse.position.y),
          button: mouse.button
        }));
      }
    });

    // Resize orchestration using ResizeObserver to handle mount size discovery and container updates
    const resizeObserver = new ResizeObserver((entries) => {
      if (!renderRef.current || !sceneRef.current) return;
      
      const entry = entries[0];
      const w = entry ? entry.contentRect.width : sceneRef.current.clientWidth;
      const h = entry ? entry.contentRect.height : sceneRef.current.clientHeight;

      if (w === 0 || h === 0) return;
      
      renderRef.current.bounds.max.x = w;
      renderRef.current.bounds.max.y = h;
      renderRef.current.options.width = w;
      renderRef.current.options.height = h;
      
      if (renderRef.current.canvas) {
        renderRef.current.canvas.width = w;
        renderRef.current.canvas.height = h;
        // Keep CSS style dimensions in perfect alignment with internal resolution
        renderRef.current.canvas.style.width = w + 'px';
        renderRef.current.canvas.style.height = h + 'px';
      }

      setDebugInfo(prev => ({ ...prev, w: Math.round(w), h: Math.round(h) }));
      

      // Dynamically reposition all boundary walls to align with the resized viewport w and h
      Matter.Body.setPosition(floor, { x: w / 2, y: h + thickness / 2 - 4 });
      Matter.Body.setPosition(ceiling, { x: w / 2, y: -thickness / 2 + 4 });
      Matter.Body.setPosition(leftWall, { x: -thickness / 2 + 4, y: h / 2 });
      Matter.Body.setPosition(rightWall, { x: w + thickness / 2 - 4, y: h / 2 });
    });
    
    // Native mouse/touch event tracking for diagnostic analysis
    const handleNativeMousedown = (e) => {
      setDebugInfo(prev => ({
        ...prev,
        button: e.button,
        mouseX: Math.round(e.clientX - sceneContainer.getBoundingClientRect().left),
        mouseY: Math.round(e.clientY - sceneContainer.getBoundingClientRect().top)
      }));
    };
    const handleNativeMouseup = () => {
      setDebugInfo(prev => ({ ...prev, button: -1 }));
    };
    
    sceneContainer.addEventListener('mousedown', handleNativeMousedown);
    sceneContainer.addEventListener('mouseup', handleNativeMouseup);

    resizeObserver.observe(sceneContainer);

    // 8. Clean Dismount
    return () => {
      sceneContainer.removeEventListener('mousedown', handleNativeMousedown);
      sceneContainer.removeEventListener('mouseup', handleNativeMouseup);
      resizeObserver.disconnect();
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
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

        {/* Diagnostic Debug HUD (Brutal styled) */}
        <div className="absolute bottom-4 left-4 bg-white border-3 border-charcoal p-2.5 font-mono text-[9px] z-50 shadow-brutal-sm pointer-events-auto select-none text-left flex flex-col gap-0.5">
          <div className="font-extrabold uppercase border-b-2 border-charcoal/20 pb-1 mb-1 text-[10px]">🛠️ Debug HUD</div>
          <div>Size: {debugInfo.w}x{debugInfo.h}</div>
          <div>Mouse: ({debugInfo.mouseX}, {debugInfo.mouseY})</div>
          <div>Button: {debugInfo.button}</div>
          <div>Bodies: {debugInfo.bodies}</div>
          <div>Ticks: {debugInfo.ticks}</div>
          <div>Selected: {debugInfo.selected}</div>
          {roomCode && (
            <>
              <div className="border-t border-charcoal/10 mt-1 pt-1 font-bold text-blue-600">MULTIPLAYER STATE:</div>
              <div>Role: {isHost ? 'Host (Authoritative)' : 'Spectator'}</div>
              <div>Room Code: {roomCode}</div>
              <div>Latency (RTT): {debugInfo.latency !== undefined ? `${debugInfo.latency}ms` : 'Calculating...'}</div>
              <div className="border-t border-charcoal/10 mt-1 pt-1 font-bold text-purple-600">LAG SIMULATOR:</div>
              <div className="flex gap-1 mt-0.5">
                {[0, 150, 300, 500].map(ms => (
                  <button
                    key={ms}
                    onClick={() => setLagMs(ms)}
                    className={`px-1 py-0.5 border border-charcoal font-bold cursor-pointer transition-all active:scale-95 text-[8px] ${
                      lagMs === ms 
                        ? 'bg-purple-500 text-white shadow-none' 
                        : 'bg-white text-charcoal hover:bg-purple-100 shadow-brutal-sm'
                    }`}
                  >
                    {ms}ms
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

PhysicsCanvas.displayName = 'PhysicsCanvas';

export default PhysicsCanvas;
