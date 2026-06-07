import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Matter from 'matter-js';

const PhysicsCanvas = forwardRef(({ onSelectBody, activeTool, activeColor = '#FACC15' }, ref) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  const mouseConstraintRef = useRef(null);
  
  // Track selected body ref to modify in real-time
  const selectedBodyRef = useRef(null);

  useImperativeHandle(ref, () => ({
    // Spawns a box body
    spawnBox: (x = 400, y = 150, width = 60, height = 60, isStatic = false) => {
      const engine = engineRef.current;
      if (!engine) return;

      const box = Matter.Bodies.rectangle(x, y, width, height, {
        restitution: 0.5,
        friction: 0.1,
        render: {
          fillStyle: activeColor,
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });

      // Custom tag to easily display in our UI Inspector
      box.labelName = `Box #${engine.world.bodies.filter(b => b.label === 'Rectangle Body').length + 1}`;
      box.customColor = activeColor;
      box.shapeType = 'box';

      Matter.Composite.add(engine.world, box);
      selectBody(box);
    },

    // Spawns a circle body
    spawnCircle: (x = 400, y = 150, radius = 30) => {
      const engine = engineRef.current;
      if (!engine) return;

      const circle = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.6,
        friction: 0.1,
        render: {
          fillStyle: activeColor,
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });

      circle.labelName = `Circle #${engine.world.bodies.filter(b => b.label === 'Circle Body').length + 1}`;
      circle.customColor = activeColor;
      circle.shapeType = 'circle';

      Matter.Composite.add(engine.world, circle);
      selectBody(circle);
    },

    // Spawns a polygon
    spawnPolygon: (x = 400, y = 150, sides = 5, radius = 40) => {
      const engine = engineRef.current;
      if (!engine) return;

      const poly = Matter.Bodies.polygon(x, y, sides, radius, {
        restitution: 0.4,
        friction: 0.1,
        render: {
          fillStyle: activeColor,
          strokeStyle: '#1A1A1A',
          lineWidth: 4
        }
      });

      poly.labelName = `${sides}-gon #${engine.world.bodies.filter(b => b.label === 'Polygon Body').length + 1}`;
      poly.customColor = activeColor;
      poly.shapeType = 'polygon';
      poly.sidesCount = sides;

      Matter.Composite.add(engine.world, poly);
      selectBody(poly);
    },

    // Spawns a pendulum (Pivot + Cable + End Mass)
    spawnPendulum: (x = 400, y = 100) => {
      const engine = engineRef.current;
      if (!engine) return;

      const length = 150;
      const radius = 30;

      // 1. Anchor (Static pivot)
      const pivot = Matter.Bodies.circle(x, y, 8, {
        isStatic: true,
        render: { fillStyle: '#1A1A1A' }
      });

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
    },

    // Spawns a spring-anchored block
    spawnSpringBlock: (x = 400, y = 200) => {
      const engine = engineRef.current;
      if (!engine) return;

      // 1. Static anchor
      const anchor = Matter.Bodies.rectangle(x, y - 100, 40, 20, {
        isStatic: true,
        render: { fillStyle: '#1A1A1A' }
      });

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
    resetWorld: () => {
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
    },

    // Inspector API: Edit selected body parameters
    updateSelectedBodyProperty: (key, value) => {
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
    // Package selected parameters into a standard JS object for React state
    onSelectBody({
      id: body.id,
      labelName: body.labelName || body.label,
      mass: body.mass.toFixed(2),
      friction: body.friction.toFixed(2),
      restitution: body.restitution.toFixed(2),
      density: (body.density * 1000).toFixed(2), // formatted readable density
      isStatic: body.isStatic,
      position: { x: Math.round(body.position.x), y: Math.round(body.position.y) },
      velocity: { x: body.velocity.x.toFixed(1), y: body.velocity.y.toFixed(1) },
      shapeType: body.shapeType || 'polygon'
    });
  };

  useEffect(() => {
    const sceneContainer = sceneRef.current;
    if (!sceneContainer) return;

    // Get exact bounding box dimensions of our container
    const width = sceneContainer.clientWidth;
    const height = sceneContainer.clientHeight;

    // 1. Create Engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 } // standard earth gravity
    });
    engineRef.current = engine;

    // 2. Create Renderer (wired to DOM container)
    const render = Matter.Render.create({
      element: sceneContainer,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false, // Solid styling
        background: 'transparent', // CSS grid acts as paper dot matrix!
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

    // 4. Create Outer Protective Boundaries (with isBoundary flags)
    const thickness = 60;
    const wallOptions = { 
      isStatic: true, 
      isBoundary: true,
      render: { 
        fillStyle: '#1A1A1A', // solid charcoal borders
        strokeStyle: '#1A1A1A'
      }
    };

    const floor = Matter.Bodies.rectangle(width / 2, height + thickness / 2 - 4, width, thickness, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2 + 4, width, thickness, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2 + 4, height / 2, thickness, height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2 - 4, height / 2, thickness, height, wallOptions);

    Matter.Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // 5. Add Mouse & Tactile Mouse Interaction
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2, // bouncy tactile response
        render: {
          visible: true,
          strokeStyle: '#3B82F6', // brutalBlue cursor lines
          lineWidth: 2
        }
      }
    });
    
    // Wire canvas mouse scroll bypass so page scroll doesn't lock
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    Matter.Composite.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;

    // 6. Listen to click/drag selection events
    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const clickedBody = event.source.body;
      if (clickedBody && !clickedBody.isStatic && !clickedBody.isBoundary) {
        selectBody(clickedBody);
      } else if (!clickedBody) {
        // Clicked blank space -> de-select
        selectedBodyRef.current = null;
        onSelectBody(null);
      }
    });

    // 7. Dynamic high-frequency tick bridge
    // Keep React Inspector numbers updating live as objects fall/roll!
    Matter.Events.on(engine, 'afterUpdate', () => {
      const selected = selectedBodyRef.current;
      if (selected && !selected.isStatic) {
        triggerBodySelectionUpdate(selected);
      }
    });

    // Handle container resize cleanly
    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      const w = sceneRef.current.clientWidth;
      const h = sceneRef.current.clientHeight;
      
      // Update canvas bounds
      renderRef.current.bounds.max.x = w;
      renderRef.current.bounds.max.y = h;
      renderRef.current.options.width = w;
      renderRef.current.options.height = h;
      
      // Reposition walls
      Matter.Body.setPosition(floor, { x: w / 2, y: h + thickness / 2 - 4 });
      Matter.Body.setPosition(rightWall, { x: w + thickness / 2 - 4, y: h / 2 });
    };
    window.addEventListener('resize', handleResize);

    // 8. Clean Dismount releases all resources to prevent canvas double-rendering (React 18 StrictMode)
    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
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
