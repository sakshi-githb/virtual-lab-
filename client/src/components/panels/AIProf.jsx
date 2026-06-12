import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal, Brain, Send, HelpCircle, BookOpen, X } from 'lucide-react';

const AIProf = ({ selectedBody, activePreset = 'none', isPlaying = true, onClose }) => {
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
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
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
      if (activePreset === 'projectile') {
        return {
          speech: "The **Projectile Cannon** is active. The red ball is launched from a -0.6 rad cannon mouth with velocity (9, -7), following a parabolic path to hit the green target.",
          insight: "Formula: y = x*tan(θ) - (g*x²)/(2*v²*cos²(θ))"
        };
      }
      if (activePreset === 'catapult') {
        return {
          speech: "The **Counterweight Catapult** lever is active. The heavy 3B82F6 blue block drops on the short arm, producing torque that launches the light red ball.",
          insight: "Formula: Torque (τ) = Force * Distance"
        };
      }
      if (activePreset === 'bridge') {
        return {
          speech: "The **Plank Bridge** stress simulation is active. The weight creates dynamic tension stress, demonstrating load distribution across linked nodes.",
          insight: "Formula: Tension (T) = Stress Load / Linked Planks"
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
  const renderMessageText = (text, sender) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h3 key={idx} className={`font-extrabold text-xs uppercase tracking-wider border-b pb-0.5 mb-1.5 mt-2 ${sender === 'user' ? 'text-white border-white/20' : 'text-charcoal border-charcoal/25'}`}>{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className={`font-black text-sm uppercase tracking-wide border-b-2 pb-0.5 mb-1.5 mt-2 ${sender === 'user' ? 'text-white border-white/30' : 'text-charcoal border-charcoal/30'}`}>{line.replace('## ', '')}</h2>;
      }
      // Bullet list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-1 ml-1 my-0.5">
            <span className={sender === 'user' ? 'text-yellow-300 font-extrabold' : 'text-brutalBlue font-extrabold'}>•</span>
            <span className="text-xs md:text-[13px] leading-relaxed font-medium">{parseInlineMarkdown(itemText, sender)}</span>
          </div>
        );
      }
      // Numbered list items
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-1 ml-1 my-0.5">
            <span className={`font-extrabold text-xs md:text-[13px] ${sender === 'user' ? 'text-white/60' : 'text-charcoal/50'}`}>{numMatch[1]}.</span>
            <span className="text-xs md:text-[13px] leading-relaxed font-medium">{parseInlineMarkdown(numMatch[2], sender)}</span>
          </div>
        );
      }
      // Blank line
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph
      return <p key={idx} className="text-xs md:text-[13px] leading-relaxed font-medium my-0.5">{parseInlineMarkdown(line, sender)}</p>;
    });
  };

  const parseInlineMarkdown = (text, sender) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={`font-extrabold ${sender === 'user' ? 'text-white' : 'text-charcoal'}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className={`font-mono text-[11px] px-1 py-0.5 rounded-sm ${sender === 'user' ? 'bg-blue-800 text-yellow-200 border border-blue-700' : 'bg-neutral-100 border border-neutral-300 text-brutalRed'}`}>{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return <span key={i} className={`font-serif italic font-bold ${sender === 'user' ? 'text-white' : 'text-charcoal'}`}>{part.slice(1, -1)}</span>;
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

      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/ai/chat`, {
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
    } else if (type === 'graph') {
      handleSendQuery('How do I read the kinematics graph, and what does the sine wave represent?');
    }
  };

  return (
    <div className="card-brutal bg-charcoal text-white p-4 flex flex-col gap-4 relative overflow-hidden select-none h-full min-h-[320px] rounded-2xl shadow-brutal">
      {/* Decorative Blueprint lines */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none font-mono text-[70px] leading-none select-none">
        MC²
      </div>

      {/* Professor Avatar and Label */}
      <div className="flex items-center justify-between border-b border-white/20 pb-2.5 z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brutalYellow text-charcoal border-2 border-white font-extrabold flex items-center justify-center text-lg rounded-full shadow-[2px_2px_0px_0px_#FFF] animate-bounce" style={{ animationDuration: '3.5s' }}>
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
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-white hover:text-brutalYellow transition-colors cursor-pointer border-2 border-transparent hover:border-white rounded-full bg-neutral-800 flex items-center justify-center"
            title="Minimize Advisor"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Section 1: Live Kinematics Advisor (Collapsible Physics Explanation) */}
      <div className="bg-neutral-800/80 border-2 border-white/20 p-2.5 flex flex-col gap-1 text-left relative z-10 flex-shrink-0 rounded-xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-1 flex-shrink-0">
          <span className="text-[9px] font-mono text-brutalYellow uppercase tracking-wider font-bold">
            🔮 Live Kinematics Advisor
          </span>
          <button
            onClick={() => setIsAdvisorOpen(!isAdvisorOpen)}
            className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-700 hover:bg-brutalYellow hover:text-charcoal text-white px-2 py-0.5 transition-colors cursor-pointer border border-white/15 rounded-full"
            title="Toggle Experiment Physics Explanation"
          >
            {isAdvisorOpen ? "Hide Explanation" : "Explain Experiment"}
          </button>
        </div>
        {isAdvisorOpen && (
          <div className="flex flex-col gap-1 mt-1.5 animate-in fade-in duration-200">
            <div className="text-[10px] md:text-[11px] leading-relaxed text-white/90">
              {advice.speech}
            </div>
            <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-mono text-brutalYellow/80 font-bold mt-0.5">
              <Terminal className="w-3.5 h-3.5 flex-shrink-0 text-brutalYellow" />
              <span>{advice.insight}</span>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Q&A Chat Logs (ChatGPT Style) */}
      <div className="flex-1 min-h-0 border border-neutral-200 bg-[#FAF9F5] p-3.5 flex flex-col gap-4 overflow-y-auto z-10 rounded-xl text-charcoal scrollbar-thin">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 max-w-[90%] ${
              m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start flex-row'
            }`}
          >
            {/* AI Avatar */}
            {m.sender === 'prof' && (
              <div className="w-7 h-7 rounded-full bg-brutalYellow text-charcoal border border-neutral-300 flex items-center justify-center text-xs flex-shrink-0 shadow-sm select-none">
                👨‍🏫
              </div>
            )}
            
            {/* Message Bubble Column */}
            <div className="flex flex-col">
              <span className={`text-[8px] font-bold uppercase tracking-wider text-charcoal/40 mb-0.5 px-1 ${
                m.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {m.sender === 'user' ? 'You' : 'Prof. Vector'}
              </span>
              
              <div
                className={`p-3 text-left relative shadow-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brutalBlue text-white rounded-2xl rounded-tr-none border-none'
                    : 'bg-white text-charcoal rounded-2xl rounded-tl-none border border-neutral-200'
                }`}
              >
                <div className={`flex flex-col gap-1 text-xs md:text-[13px] font-medium leading-relaxed ${
                  m.sender === 'user' ? 'text-white' : 'text-charcoal'
                }`}>
                  {renderMessageText(m.text, m.sender)}
                </div>

                {/* Formula Terminal in Bubble */}
                {m.insight && (
                  <div className={`flex items-start gap-1 text-[11px] font-mono font-extrabold border-t pt-1 mt-1.5 ${
                    m.sender === 'user' 
                      ? 'border-white/20 text-white/95' 
                      : 'border-charcoal/10 text-brutalRed'
                  }`}>
                    <Terminal className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{m.insight}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 max-w-[80%] self-start items-start">
            <div className="w-7 h-7 rounded-full bg-brutalYellow text-charcoal border border-neutral-300 flex items-center justify-center text-xs flex-shrink-0 shadow-sm select-none">
              👨‍🏫
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase tracking-wider text-charcoal/40 mb-0.5 px-1">
                Prof. Vector
              </span>
              <div className="bg-white border border-neutral-200 p-2.5 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1.5 text-xs font-bold font-mono text-charcoal">
                <span className="w-1.5 h-1.5 bg-charcoal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-charcoal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-charcoal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span>Thinking...</span>
              </div>
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
          className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 border border-white/15 text-white hover:bg-brutalYellow hover:text-charcoal px-3 py-1 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-0.5 rounded-full"
        >
          <HelpCircle className="w-2.5 h-2.5" />
          <span>Explain Sim</span>
        </button>
        <button
          onClick={() => handleQuickQuestion('guide')}
          disabled={isLoading}
          className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 border border-white/15 text-white hover:bg-brutalYellow hover:text-charcoal px-3 py-1 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-0.5 rounded-full"
        >
          <BookOpen className="w-2.5 h-2.5" />
          <span>Perform Experiment</span>
        </button>
        <button
          onClick={() => handleQuickQuestion('formula')}
          disabled={isLoading}
          className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 border border-white/15 text-white hover:bg-brutalYellow hover:text-charcoal px-3 py-1 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-0.5 rounded-full"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>Formulas</span>
        </button>
        <button
          onClick={() => handleQuickQuestion('graph')}
          disabled={isLoading}
          className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-800 border border-white/15 text-white hover:bg-brutalYellow hover:text-charcoal px-3 py-1 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-0.5 rounded-full"
        >
          <HelpCircle className="w-2.5 h-2.5" />
          <span>Explain Graphs</span>
        </button>
      </div>

      {/* Input box (ChatGPT Pill Style) */}
      <div className="flex items-center gap-2 z-10 flex-shrink-0 bg-white border-2 border-neutral-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-charcoal transition-colors">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendQuery(inputValue);
          }}
          placeholder="Ask Prof. Vector a dynamics question..."
          disabled={isLoading}
          className="flex-1 bg-transparent text-charcoal text-xs md:text-[13px] font-medium focus:outline-none placeholder-charcoal/40 disabled:opacity-50 border-none outline-none"
        />
        <button
          onClick={() => handleSendQuery(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className="w-8 h-8 rounded-full bg-brutalBlue text-white hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AIProf;
