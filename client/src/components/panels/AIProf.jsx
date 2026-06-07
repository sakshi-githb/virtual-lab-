import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal, Brain, Send, HelpCircle, BookOpen } from 'lucide-react';

const AIProf = ({ selectedBody, activePreset = 'none', isPlaying = true }) => {
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'prof',
      text: "Greetings, experimenter! I am **Prof. Vector**, your dynamic physics advisor. Ask me anything about the simulation, kinematics formulas, or templates, or write a custom query below!",
      insight: "Formula reference: Force = Mass x Acceleration"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat logs on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Dynamic AI feedback based on active physics metrics (Live Advisor Panel)
  const getProfAdvice = () => {
    if (!selectedBody) {
      if (activePreset === 'pendulum') {
        return {
          speech: "You loaded the **Pendulum Rig**. It is swinging under Earth gravity. Adjust the rope length or gravity constants to see how oscillation periods shift.",
          insight: "Formula: T = 2π√(L/g)"
        };
      }
      if (activePreset === 'spring') {
        return {
          speech: "The **Spring Mass** is active (Zero-G). Restoring force pulls the block back to the center horizontally, creating sinusoidal displacement decay.",
          insight: "Formula: F = -kx"
        };
      }
      if (activePreset === 'friction') {
        return {
          speech: "The **Friction Ramp** is loaded at an angle of 0.4 rad (~23°). The dynamic block slides down opposing kinetic friction forces.",
          insight: "Formula: F_friction = μ * Normal Force"
        };
      }
      if (activePreset === 'bounciness') {
        return {
          speech: "The **Collision Balls** are active. Yellow sphere rebounds elastically (restitution = 0.90) while Blue sphere drops inelastic (restitution = 0.15).",
          insight: "Formula: e = Rebound Speed / Approach Speed"
        };
      }
      return {
        speech: "Welcome to the VIRTUAL-LAB, experimenter! To start studying physical dynamics, spawn a body from the Left Dock or select a guided Template.",
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
        speech: `Ah, you selected a static object (**${selectedBody.labelName}**). It possesses infinite inertia and resists all gravitational forces!`,
        insight: "Kinematics: Velocity = 0 m/s (Static boundary)."
      };
    }

    if (restitution > 0.7) {
      return {
        speech: `Look at **${selectedBody.labelName}** bounce! With a high restitution of ${restitution}, impacts are nearly elastic, retaining ~${Math.round(restitution * 100)}% of kinetic energy.`,
        insight: `Kinematics: Velocity = (${selectedBody.velocity.x}, ${selectedBody.velocity.y}) m/s.`
      };
    }

    if (mass > 8) {
      return {
        speech: `Fascinating! **${selectedBody.labelName}** is highly massive (${mass} kg). It carries high momentum (p = mv) and easily sweeps lighter obstacles aside.`,
        insight: `Kinematics: Mass = ${mass} kg, Speed = ${speed.toFixed(1)} m/s.`
      };
    }

    return {
      speech: `Inspecting **${selectedBody.labelName}** (${selectedBody.shapeType}). Tweak its mass, friction, or bounciness sliders to observe trajectory shifts in real-time.`,
      insight: `Kinematics: Coordinates = (${selectedBody.position.x}, ${selectedBody.position.y}).`
    };
  };

  const advice = getProfAdvice();

  // Helper to parse simple markdown bold/code in chat bubble
  const renderMessageText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="font-extrabold text-xs uppercase tracking-wider text-charcoal border-b border-charcoal/20 pb-0.5 mb-1.5 mt-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="font-black text-sm uppercase tracking-wide text-charcoal border-b-2 border-charcoal/30 pb-0.5 mb-1.5 mt-2">{line.replace('## ', '')}</h2>;
      }
      // Bullet list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-1 ml-1 my-0.5">
            <span className="text-brutalYellow font-extrabold">•</span>
            <span className="text-[11px] leading-relaxed">{parseInlineMarkdown(itemText)}</span>
          </div>
        );
      }
      // Numbered list items
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-1 ml-1 my-0.5">
            <span className="font-extrabold text-[11px] text-charcoal/50">{numMatch[1]}.</span>
            <span className="text-[11px] leading-relaxed">{parseInlineMarkdown(numMatch[2])}</span>
          </div>
        );
      }
      // Blank line
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph
      return <p key={idx} className="text-[11px] leading-relaxed my-0.5">{parseInlineMarkdown(line)}</p>;
    });
  };

  const parseInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-charcoal">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-neutral-100 border border-neutral-300 px-1 py-0.5 rounded-sm font-mono text-[9px] text-brutalRed">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={i} className="font-serif italic text-charcoal font-bold">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  // Submit chat query to backend
  const handleSendQuery = async (queryText) => {
    if (!queryText.trim()) return;

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const payload = {
        message: queryText,
        activePreset,
        selectedBody: selectedBody ? {
          labelName: selectedBody.labelName,
          mass: selectedBody.mass,
          friction: selectedBody.friction,
          restitution: selectedBody.restitution,
          speed: Math.sqrt(selectedBody.velocity.x * selectedBody.velocity.x + selectedBody.velocity.y * selectedBody.velocity.y).toFixed(1),
          isStatic: selectedBody.isStatic,
          position: selectedBody.position,
          velocity: selectedBody.velocity,
          shapeType: selectedBody.shapeType
        } : null,
        isPlaying
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: `prof-${Date.now()}`,
        sender: 'prof',
        text: data.speech,
        insight: data.insight
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'prof',
        text: "Apologies, experimenter. My neural grid seems disconnected. Please check that the server is online!",
        insight: "Error: Connection refused."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (type) => {
    if (type === 'explain') {
      handleSendQuery('Explain what is currently happening in the sandbox?');
    } else if (type === 'guide') {
      handleSendQuery('Tell me how I can perform the experiment?');
    } else if (type === 'formula') {
      handleSendQuery('What mathematical formulas apply to this setup?');
    }
  };

  return (
    <div className="card-brutal bg-charcoal text-white p-4 flex flex-col gap-4 relative overflow-hidden select-none h-[520px]">
      {/* Decorative Blueprint lines */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none font-mono text-[70px] leading-none select-none">
        MC²
      </div>

      {/* Professor Avatar and Label */}
      <div className="flex items-center gap-3 border-b border-white/20 pb-2 z-10 flex-shrink-0">
        <div className="w-10 h-10 bg-brutalYellow text-charcoal border-2 border-white font-extrabold flex items-center justify-center text-lg rounded-none shadow-[2px_2px_0px_0px_#FFF] animate-bounce" style={{ animationDuration: '3.5s' }}>
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

      {/* Section 1: Live Kinematics Advisor (Updates instantly in real-time) */}
      <div className="bg-neutral-800/80 border-2 border-white/20 p-2.5 flex flex-col gap-1 text-left relative z-10 flex-shrink-0">
        <div className="text-[9px] font-mono text-brutalYellow uppercase tracking-wider font-bold border-b border-white/10 pb-0.5">
          🔮 Live Kinematics Advisor
        </div>
        <div className="text-[10px] leading-tight text-white/90">
          {advice.speech}
        </div>
        <div className="flex items-center gap-1 text-[8px] font-mono text-brutalYellow/80 font-bold mt-0.5">
          <Terminal className="w-3 h-3 flex-shrink-0" />
          <span>{advice.insight}</span>
        </div>
      </div>

      {/* Section 2: Q&A Chat Logs */}
      <div className="flex-1 min-h-0 border-3 border-charcoal bg-[#F7F4EB] text-charcoal p-2 flex flex-col gap-3 overflow-y-auto z-10">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[85%] ${
              m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            {/* Sender Label */}
            <span className="text-[8px] font-bold uppercase tracking-wider text-charcoal/40 mb-0.5 px-1">
              {m.sender === 'user' ? 'Experimenter' : 'Prof. Vector'}
            </span>

            {/* Bubble */}
            <div
              className={`border-2 border-charcoal p-2 text-left relative shadow-brutal-sm ${
                m.sender === 'user'
                  ? 'bg-brutalYellow rounded-none'
                  : 'bg-white rounded-none'
              }`}
            >
              {/* Message content */}
              <div className="text-charcoal flex flex-col gap-1">
                {renderMessageText(m.text)}
              </div>

              {/* Formula Terminal in Bubble */}
              {m.insight && (
                <div className="flex items-start gap-1 text-[9px] font-mono text-brutalRed font-extrabold border-t border-charcoal/10 pt-1 mt-1.5">
                  <Terminal className="w-3 h-3 flex-shrink-0 text-brutalRed" />
                  <span>{m.insight}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col max-w-[80%] self-start items-start">
            <span className="text-[8px] font-bold uppercase tracking-wider text-charcoal/40 mb-0.5 px-1">
              Prof. Vector
            </span>
            <div className="bg-white border-2 border-charcoal p-2 rounded-none shadow-brutal-sm flex items-center gap-1.5 text-[10px] font-bold font-mono">
              <span className="w-1.5 h-1.5 bg-charcoal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-charcoal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-charcoal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span>Analyzing kinematics...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex gap-1.5 flex-wrap z-10 flex-shrink-0">
        <button
          onClick={() => handleQuickQuestion('explain')}
          disabled={isLoading}
          className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 border-2 border-white/20 text-white hover:bg-brutalYellow hover:text-charcoal px-2 py-1 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-0.5"
        >
          <HelpCircle className="w-2.5 h-2.5" />
          <span>Explain Sim</span>
        </button>
        <button
          onClick={() => handleQuickQuestion('guide')}
          disabled={isLoading}
          className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 border-2 border-white/20 text-white hover:bg-brutalYellow hover:text-charcoal px-2 py-1 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-0.5"
        >
          <BookOpen className="w-2.5 h-2.5" />
          <span>Perform Experiment</span>
        </button>
        <button
          onClick={() => handleQuickQuestion('formula')}
          disabled={isLoading}
          className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 border-2 border-white/20 text-white hover:bg-brutalYellow hover:text-charcoal px-2 py-1 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-0.5"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Formulas</span>
        </button>
      </div>

      {/* Input box */}
      <div className="flex gap-2 z-10 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendQuery(inputValue);
          }}
          placeholder="Ask Prof. Vector a dynamics question..."
          disabled={isLoading}
          className="flex-1 bg-[#F7F4EB] text-charcoal border-3 border-charcoal px-3 py-1.5 text-xs font-bold focus:outline-none focus:bg-white placeholder-charcoal/40 disabled:opacity-50"
        />
        <button
          onClick={() => handleSendQuery(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className="bg-brutalYellow text-charcoal border-3 border-charcoal px-3 py-1.5 font-bold hover:bg-yellow-300 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AIProf;
