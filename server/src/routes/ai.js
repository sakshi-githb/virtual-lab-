import express from 'express';

const router = express.Router();

// Local Rule-Based Physics Tutor Fallback
const getLocalResponse = (message, activePreset, selectedBody, isPlaying) => {
  const normalizedMsg = message.toLowerCase();
  let responseText = '';
  let insight = '';

  if (
    normalizedMsg.includes('perform') || 
    normalizedMsg.includes('how to run') || 
    normalizedMsg.includes('how to perform') || 
    normalizedMsg.includes('how do i') || 
    normalizedMsg.includes('what should i do') ||
    normalizedMsg.includes('guide')
  ) {
    if (activePreset === 'pendulum') {
      responseText = `### 👨‍🏫 How to Perform the Simple Pendulum Experiment:

1. **Auto-Setup**: Click **Auto-Setup** under the **Pendulum Rig** template on the left bar. This resets the canvas and spawns a static pivot constraint with a bob suspended at a 45-degree angle offset.
2. **Observe Oscillation**: Ensure the simulation is running (Play icon is active). The bob will swing under Earth's standard gravity.
3. **Inspect Metrics**: Click on the moving blue Pendulum Bob. Its properties will load in the **Kinematics Inspector** on the right.
4. **Plot Curves**: Under the inspector's chart, switch the metric to **Velocity X (m/s)** or **Displacement X (m)**. You will see a beautiful, clean sinusoidal wave representing Simple Harmonic Motion (SHM).
5. **Real-time Tweaks**: Adjust the **Mass** of the bob. Does the frequency of the wave change? *(Hint: In physics, the period of a simple pendulum is $T = 2\\pi\\sqrt{L/g}$—it depends only on the length of the cable $L$ and gravity $g$, not the mass!)*`;
      insight = "Try spawning custom objects under the path of the pendulum to test collision momentum!";
    } else if (activePreset === 'spring') {
      responseText = `### 👨‍🏫 How to Perform the Spring-Mass Resonance Experiment:

1. **Auto-Setup**: Click **Auto-Setup** under the **Spring Mass** template. This resets the canvas, sets gravity to zero (to isolate horizontal motion), and spawns a block pulled 80px to the right of its equilibrium point.
2. **Observe Oscillation**: Hit Play. The block will oscillate back and forth under the restoring force of the elastic constraint.
3. **Inspect Metrics**: Click the red Spring Block. Turn your eyes to the right inspector panel.
4. **Plot Damped Wave**: View the chart. Switch between **Displacement X** and **Velocity X**. Notice how the amplitude slowly decays over time due to the spring's damping factor ($c$).
5. **Tweak the Variables**: Try changing the mass of the block in the inspector. A heavier block increases inertia, reducing the frequency of oscillation ($f = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}$)!`;
      insight = "Stiffness (k) controls pulling force, while Damping (c) controls energy decay rate.";
    } else if (activePreset === 'friction') {
      responseText = `### 👨‍🏫 How to Perform the Friction Slope Experiment:

1. **Auto-Setup**: Click **Auto-Setup** under the **Friction Ramp** template. This creates a solid inclined plane angled at 0.4 rad (~23°) and spawns a dynamic red block on top.
2. **Observe Motion**: Under standard gravity, the block slides down.
3. **Inspect Metrics**: Click the sliding block to bind it to the inspector.
4. **Tweak Friction**: Slide the **Friction Coefficient** up. Notice how the sliding block slows down and eventually stops.
5. **Formulas in Action**: The block slides down because the gravitational force component ($F_g = mg \\sin\\theta$) exceeds the maximum static friction force ($f_s = \\mu_s mg \\cos\\theta$). When you increase $\\mu$ (friction), friction wins, and acceleration drops to zero!`;
      insight = "Static friction prevents starting; kinetic friction opposes active movement.";
    } else if (activePreset === 'bounciness') {
      responseText = `### 👨‍🏫 How to Perform the Bounciness (Restitution) Experiment:

1. **Auto-Setup**: Click **Auto-Setup** under the **Collision Balls** template. This spawns a yellow highly elastic sphere ($e = 0.90$) and a blue lead-like inelastic sphere ($e = 0.15$).
2. **Let them Collide**: Observe how they bounce off the floor. The yellow ball rebounds almost to its release height, while the blue ball drops flat.
3. **Inspect Restitution**: Click on either sphere and adjust the **Restitution** slider. 
4. **Understand Restitution ($e$)**: It represents the ratio of relative speeds before and after a collision. A value of $e = 1.0$ is a perfectly elastic collision (zero kinetic energy loss), while $e = 0$ is a perfectly inelastic stick.`;
      insight = "Restitution governs the kinetic energy retention ratio after collision impacts.";
    } else {
      responseText = `### 👨‍🏫 How to Get Started with the Sandbox:

1. **Spawn Rigid Bodies**: Use the **Tools** section on the Left Dock to drop Circles, Boxes, or Custom Polygons onto the canvas.
2. **Interact**: Click and drag bodies using your mouse cursor to throw them and test collisions.
3. **Edit Properties**: Click on any active body to bind it to the **Right Inspector**. Change its mass, friction, or restitution sliders.
4. **Run Templates**: Click any template under the **Templates** section (Pendulum, Spring, Friction, Bounciness) to run pre-designed physics experiments with guided explanations!`;
      insight = "Click any preset template on the Left Sidebar to start a guided experiment!";
    }
  } else if (
    normalizedMsg.includes('happening') || 
    normalizedMsg.includes('explain') || 
    normalizedMsg.includes('what is this') || 
    normalizedMsg.includes('why is') ||
    normalizedMsg.includes('how is this')
  ) {
    if (activePreset === 'pendulum') {
      responseText = `### 🔮 Current Simulation: Simple Pendulum SHM

You have loaded the **Simple Pendulum** template. Here is what is happening physically:
- **Restoring Force**: The tension in the string pulls the bob toward the anchor, while gravity pulls it down. The net force is a restoring force pulling the bob back toward the center vertical line.
- **Periodicity**: Because the displacement is small, the restoring force is proportional to displacement ($F \\approx -mg\\theta$), which creates **Simple Harmonic Motion (SHM)**.
- **Energy Transfer**: Kinetic energy is at its maximum at the lowest point of the swing (velocity peaks), while potential energy peaks at the highest point (velocity is zero).
${selectedBody ? `- **Inspection**: You currently have **${selectedBody.labelName}** selected. Mass: **${selectedBody.mass} kg**, Velocity: **(${selectedBody.velocity.x}, ${selectedBody.velocity.y}) m/s**.` : '- **Tip**: Click the swinging bob to inspect its kinematics and graph its velocity sinusoid!'}`;
      insight = `Pendulum Period T = 2π√(L/g) is independent of bob mass.`;
    } else if (activePreset === 'spring') {
      responseText = `### 🔮 Current Simulation: Damped Spring Oscillation

You have loaded the **Spring Mass** template. Here is the physical analysis:
- **Hooke's Law**: The spring constraint exerts a horizontal restoring force on the block: $F = -kx$.
- **Damping (Friction)**: The system decays slowly due to a damping factor ($c$) built into the constraint, representing air resistance or mechanical drag. This creates **damped harmonic oscillation**.
- **Gravity**: Gravity is set to **0.0** to prevent the block from sagging vertically, isolating horizontal motion.
${selectedBody ? `- **Inspection**: The selected **${selectedBody.labelName}** is sliding horizontally. Mass: **${selectedBody.mass} kg**, Restitution: **${selectedBody.restitution}**.` : '- **Tip**: Select the spring block to plot its damped oscillation curve in real-time!'}`;
      insight = "Hooke's Law restoring force F = -kx is proportional and opposite to displacement.";
    } else if (activePreset === 'friction') {
      responseText = `### 🔮 Current Simulation: Inclined Friction Ramp

You have loaded the **Friction Slope** template. Here is what is happening:
- **Component Forces**: Gravity pulls the block down the incline ($F_{\\text{down}} = mg \\sin\\theta$). Friction pushes up parallel to the ramp ($F_f = \\mu N = \\mu mg \\cos\\theta$).
- **Net Acceleration**: The net force is $F_{\\text{net}} = mg(\\sin\\theta - \\mu \\cos\\theta)$. If $\\sin\\theta > \\mu \\cos\\theta$, the block accelerates down the ramp.
- **Angle**: The ramp is set to 0.4 rad (~23 degrees).
${selectedBody ? `- **Inspection**: The block **${selectedBody.labelName}** has friction coefficient **${selectedBody.friction}**.` : '- **Tip**: Select the block and adjust the friction slider to see when it halts sliding.'}`;
      insight = "If friction coefficient μ > tan(θ), the block remains stationary on the slope!";
    } else if (activePreset === 'bounciness') {
      responseText = `### 🔮 Current Simulation: Restitution Comparison

You have loaded the **Collision Balls** template:
- **Elastic vs Inelastic**: The yellow ball ($e = 0.90$) loses very little kinetic energy when colliding with the boundary walls, so it rebounds high. The blue ball ($e = 0.15$) loses almost all kinetic energy, converting it to heat/deformation, and stays near the floor.
${selectedBody ? `- **Inspection**: Selected **${selectedBody.labelName}** has restitution: **${selectedBody.restitution}**.` : '- **Tip**: Inspect either ball and modify its restitution to test elastic coefficients!'}`;
      insight = "Restitution coefficient (e) ranges from 0 (inelastic) to 1 (perfectly elastic).";
    } else {
      responseText = `### 🔮 Current Simulation: Custom Rigid Body Sandbox

You are running a custom workspace layout:
- **Matter.js Engine**: Solving multi-body collision impulses at 60Hz.
- **Kinematics**: Dynamic shapes obey conservation of momentum, gravity acceleration, and boundary collisions.
${selectedBody ? `- **Inspection**: You have selected **${selectedBody.labelName}** (${selectedBody.shapeType}) at coordinate **(${selectedBody.position.x}, ${selectedBody.position.y})** with velocity **(${selectedBody.velocity.x}, ${selectedBody.velocity.y}) m/s**.` : '- **Tip**: Spawn shapes from the left bar, drag them to throw, and click them to view graphs!'}`;
      insight = "Adjust gravity on the Top Bar to see how objects float or drop.";
    }
  } else if (normalizedMsg.includes('gravity') || normalizedMsg.includes('g-force')) {
    responseText = `### 🌍 Understanding Gravity:

Gravity ($g$) is an acceleration field pulling all dynamic bodies downwards.
- In our engine, standard gravity is set to **1.0** (representing Earth's $9.8$ m/s$^2$).
- Under zero gravity (**0.0**), bodies will float weightlessly, making it perfect for horizontal spring-mass experiments!
- You can dynamically adjust gravity using the slider or dropdown in the Top Header.`;
    insight = "In vacuum, all masses accelerate under gravity at the exact same rate: a = g.";
  } else if (normalizedMsg.includes('spring') || normalizedMsg.includes('hooke')) {
    responseText = `### 🧬 Understanding Hooke's Law ($F = -kx$):

Hooke's Law describes the restoring force exerted by an elastic spring:
- **Formula**: $F = -kx$
  - $F$: Restoring force (in Newtons).
  - $k$: Stiffness coefficient (how stiff the spring is).
  - $x$: Displacement from equilibrium (how far the spring is stretched or compressed).
- **Direction**: The negative sign indicates that the spring force always pulls in the *opposite* direction of the displacement (back to the resting point).`;
    insight = "Stiff springs (high k) produce faster frequencies and larger restoring forces.";
  } else if (normalizedMsg.includes('restitution') || normalizedMsg.includes('bounce') || normalizedMsg.includes('elastic')) {
    responseText = `### 🏀 Understanding Restitution ($e$):

Restitution determines how bouncy an object is when it collides with another surface:
- **Coefficient ($e$)**: $e = \\frac{v_{\\text{rebound}}}{v_{\\text{approach}}}$
- **Values**:
  - $e = 1.0$: Perfectly elastic. The object bounces back with the exact speed it hit, losing **zero** kinetic energy.
  - $e = 0.0$: Perfectly inelastic. The object loses all vertical bounce speed and sticks flat to the surface.
  - $0 < e < 1$: Real-world objects (like rubber balls or lead blocks) that lose partial energy to heat and sound.`;
    insight = "Increase restitution to 1.0 in the inspector to see frictionless bouncing!";
  } else if (normalizedMsg.includes('friction') || normalizedMsg.includes('slope') || normalizedMsg.includes('ramp')) {
    responseText = `### 🪵 Understanding Friction ($\\mu$):

Friction is the resistive force opposing relative sliding motion:
- **Formula**: $F_f = \\mu N$
  - $\\mu$: Friction coefficient.
  - $N$: Normal force perpendicular to the surface.
- **Types**:
  - **Static Friction**: Resists initiating movement (usually higher).
  - **Kinetic Friction**: Resists active sliding (usually lower).
- **Slope Physics**: A block slides down a ramp only if the component of gravity along the slope ($mg \\sin\\theta$) is greater than static friction ($\\mu mg \\cos\\theta$).`;
    insight = "Friction coefficient (μ) determines mechanical surface roughness.";
  } else {
    const bodyText = selectedBody 
      ? `You currently have **${selectedBody.labelName}** selected. It has a mass of **${selectedBody.mass} kg**, a friction factor of **${selectedBody.friction}**, and a restitution of **${selectedBody.restitution}**.` 
      : 'No specific body is selected right now. You can click on any body on the canvas to inspect it.';

    responseText = `### 👨‍🏫 Prof. Vector's Lab Log:

Hello! I am **Prof. Vector**, your virtual physics assistant. I'm ready to answer any questions about kinematics, mechanical dynamics, and how to operate the lab sandbox.

${bodyText}

**Active preset template**: \`${activePreset.toUpperCase()}\`
**Simulation state**: \`${isPlaying ? 'RUNNING' : 'PAUSED'}\`

You can ask me questions like:
- *"How is this happening?"* (to analyze the physics in play)
- *"Tell me how I can perform the experiment"* (for step-by-step guidance)
- *"What is Hooke's Law?"* or *"Explain restitution"* (for textbook lessons)

What would you like to investigate next?`;
    insight = "Type a question below to query Prof. Vector about dynamics.";
  }

  return { speech: responseText, insight };
};

// Route Handler
router.post('/chat', async (req, res) => {
  const { message = '', activePreset = 'none', selectedBody = null, isPlaying = true } = req.body;

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const systemInstructions = `You are Prof. Vector, a friendly, encouraging, and highly knowledgeable AI physics tutor for a web-based 2D physics sandbox called VIRTUAL-LAB.
The student is interacting with a physics canvas in real-time. Here is the current state of the sandbox:
- Active preset template: ${activePreset} (e.g. pendulum, spring, friction, bounciness, or none)
- Simulation is currently: ${isPlaying ? 'running' : 'paused'}
- Selected body detail: ${selectedBody ? JSON.stringify(selectedBody) : 'No body is currently selected'}

Your goal is to answer the student's question clearly, concisely, and with educational value.
If they ask about "how is this happening" or "how does this work", explain the physics formulas in play (e.g., Hooke's law F = -kx, pendulum period T = 2pi*sqrt(L/g), sliding friction F_f = mu*N, coefficient of restitution e, etc.) and relate them directly to the active variables in the selected body (like its speed, mass, friction, or restitution).
If they ask "how to perform the experiment", give them clear step-by-step guidance on how to use the preset, adjust variables, and watch the kinematics graph.

Formatting guidelines:
- Use standard Markdown.
- Use headers (e.g. ### Header) for clear organization.
- Keep responses relatively brief (2-3 short paragraphs or clean lists) so it fits nicely in the chat log.
- Do NOT use wild HTML tags.
- Explain formulas mathematically, writing them clearly (e.g. $F = -kx$ or $T = 2\\pi\\sqrt{L/g}$).
- Make sure to keep the tone like a encouraging physics professor.`;

  // 1. Google Gemini API integration
  if (geminiKey && geminiKey.trim()) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `${systemInstructions}\n\nStudent's Question: "${message}"`
              }
            ]
          }
        ]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          // Extract a 1-sentence math summary or reference for the console insight bar
          let formulaInsight = "Kinematics Analysis active.";
          if (activePreset === 'pendulum') formulaInsight = "Pendulum Period T = 2π√(L/g)";
          else if (activePreset === 'spring') formulaInsight = "Hooke's Law: F = -kx";
          else if (activePreset === 'friction') formulaInsight = "Inclined plane: F = mg sin(θ)";
          else if (activePreset === 'bounciness') formulaInsight = "Restitution coefficient: e = rebound/approach";

          res.status(200).json({
            speech: text,
            insight: formulaInsight
          });
          return;
        }
      }
    } catch (err) {
      console.error("[Gemini AI Error]: Fallback active.", err);
    }
  }

  // 2. OpenAI API integration
  if (openaiKey && openaiKey.trim()) {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const payload = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemInstructions
          },
          {
            role: 'user',
            content: message
          }
        ]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim()) {
          let formulaInsight = "Kinematics Analysis active.";
          if (activePreset === 'pendulum') formulaInsight = "Pendulum Period T = 2π√(L/g)";
          else if (activePreset === 'spring') formulaInsight = "Hooke's Law: F = -kx";
          else if (activePreset === 'friction') formulaInsight = "Inclined plane: F = mg sin(θ)";
          else if (activePreset === 'bounciness') formulaInsight = "Restitution coefficient: e = rebound/approach";

          res.status(200).json({
            speech: text,
            insight: formulaInsight
          });
          return;
        }
      }
    } catch (err) {
      console.error("[OpenAI Error]: Fallback active.", err);
    }
  }

  // 3. Fallback: Local rule-based engine
  const localOutput = getLocalResponse(message, activePreset, selectedBody, isPlaying);
  res.status(200).json(localOutput);
});

export default router;
