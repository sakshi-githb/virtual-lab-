import React from 'react';
import { Sparkles, Terminal, Brain } from 'lucide-react';

const AIProf = ({ selectedBody }) => {
  // Dynamic AI feedback based on active physics metrics
  const getProfAdvice = () => {
    if (!selectedBody) {
      return {
        speech: "Welcome to the VIRTUAL-LAB, experimenter! To start studying physical dynamics, spawn a 'Spring Block' or a 'Pendulum Rig' from the Left Dock.",
        insight: "Tip: Friction determines kinetic drag, while Restitution (e) determines bounciness."
      };
    }

    const mass = parseFloat(selectedBody.mass);
    const restitution = parseFloat(selectedBody.restitution);
    const speed = Math.sqrt(
      selectedBody.velocity.x * selectedBody.velocity.x + 
      selectedBody.velocity.y * selectedBody.velocity.y
    );

    if (selectedBody.isStatic) {
      return {
        speech: `Ah, you frozen ${selectedBody.labelName}! By setting its state to static, you gave it infinite inertia. It will resist all gravity and collisions!`,
        insight: "Ideal for constructing fixed slopes, walls, or anchors."
      };
    }

    if (restitution > 0.7) {
      return {
        speech: `Look at ${selectedBody.labelName} go! With a high restitution of ${restitution}, collisions are nearly elastic. It retains ~${Math.round(restitution * 100)}% of its kinetic energy after impact!`,
        insight: `Active Velocity: ${speed.toFixed(1)} m/s.`
      };
    }

    if (mass > 8) {
      return {
        speech: `Fascinating! ${selectedBody.labelName} is highly massive (${mass} kg). It carries high momentum (p = mv) and will easily sweep lighter obstacles aside!`,
        insight: "Try dropping a smaller, lighter circle underneath it."
      };
    }

    return {
      speech: `You are inspecting ${selectedBody.labelName}. It is running dynamic calculations. Adjusting the attributes on the dials will immediately shift its kinetic trajectory.`,
      insight: `Current coordinates: [X: ${selectedBody.position.x}, Y: ${selectedBody.position.y}]`
    };
  };

  const advice = getProfAdvice();

  return (
    <div className="card-brutal bg-charcoal text-white p-4 flex flex-col gap-3 relative overflow-hidden select-none">
      {/* Decorative Blueprint lines */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none font-mono text-[70px] leading-none select-none select-none">
        MC²
      </div>

      {/* Professor Avatar and Label */}
      <div className="flex items-center gap-3 border-b border-white/20 pb-2 z-10">
        <div className="w-10 h-10 bg-brutalYellow text-charcoal border-2 border-white font-extrabold flex items-center justify-center text-lg rounded-none shadow-[2px_2px_0px_0px_#FFF] animate-bounce" style={{ animationDuration: '3s' }}>
          👨‍🏫
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-sm text-brutalYellow flex items-center gap-1">
            <Brain className="w-3.5 h-3.5 fill-current" />
            PROF. VECTOR
          </span>
          <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest leading-none">
            AI Lab Assistant
          </span>
        </div>
      </div>

      {/* Professor Dialogue bubble */}
      <div className="flex flex-col gap-2 z-10 text-left">
        <div className="bg-white text-charcoal p-3 border-2 border-charcoal relative rounded-none text-xs font-semibold leading-relaxed shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]">
          {/* Bubble Pointer */}
          <div className="absolute top-3 -left-2 w-3.5 h-3.5 bg-white border-l-2 border-b-2 border-charcoal transform rotate-45" />
          <p>{advice.speech}</p>
        </div>

        <div className="flex items-start gap-1.5 text-[10px] font-mono text-brutalYellow font-bold mt-1">
          <Terminal className="w-3.5 h-3.5 flex-shrink-0 text-brutalYellow animate-pulse" />
          <span>{advice.insight}</span>
        </div>
      </div>
    </div>
  );
};

export default AIProf;
