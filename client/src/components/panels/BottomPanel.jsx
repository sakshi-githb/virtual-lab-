import React, { useState } from 'react';
import { Users, Send, MessageSquare } from 'lucide-react';

const BottomPanel = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Mike', text: "Let's try increasing the mass of the dynamic block.", time: '10:15 AM', color: 'bg-brutalBlue text-white' },
    { id: 2, sender: 'Sepideh', text: "Good idea! That will let us test friction values properly.", time: '10:16 AM', color: 'bg-brutalGreen text-white' },
    { id: 3, sender: 'Sam', text: "I'll adjust the spring friction slider on the right panel.", time: '10:16 AM', color: 'bg-brutalYellow text-charcoal' }
  ]);
  const [inputText, setInputText] = useState('');

  const activePlayers = [
    { name: 'Mike', initial: 'MK', color: 'bg-brutalBlue' },
    { name: 'Sepideh', initial: 'SP', color: 'bg-brutalGreen' },
    { name: 'Sam', initial: 'SM', color: 'bg-brutalYellow' },
    { name: 'Newton', initial: 'NW', color: 'bg-brutalRed' }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'You',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: 'bg-charcoal text-white'
      }
    ]);
    setInputText('');
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 select-none">
      
      {/* COLUMN A: PLAYERS HUD (Flat Yellow Banner) */}
      <div className="card-brutal bg-white p-4 w-full md:w-60 h-20 md:h-full flex flex-col justify-center relative pt-8 md:pt-10 flex-shrink-0">
        {/* Mockup Yellow Header Ribbon */}
        <div className="absolute top-0 left-0 bg-brutalYellow text-charcoal border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          👥 Players
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {activePlayers.map((p) => (
            <div
              key={p.name}
              className={`w-9 h-9 rounded-full ${p.color} border-3 border-charcoal flex items-center justify-center font-extrabold text-xs shadow-brutal-sm hover:-translate-y-0.5 transition-transform cursor-pointer`}
              title={`${p.name} - Online`}
            >
              {p.initial}
            </div>
          ))}
          <button className="w-9 h-9 rounded-full bg-white border-3 border-charcoal flex items-center justify-center font-bold text-lg shadow-brutal-sm hover:-translate-y-0.5 hover:bg-neutral-50 transition-transform cursor-pointer">
            +
          </button>
        </div>
      </div>

      {/* COLUMN B: CHAT FEED (Flat Blue Banner) */}
      <div className="card-brutal bg-white p-4 flex-1 flex flex-col justify-between h-40 md:h-full relative pt-8 md:pt-10 min-w-0">
        {/* Mockup Blue Header Ribbon */}
        <div className="absolute top-0 left-0 bg-brutalBlue text-white border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          💬 Chat
        </div>

        {/* Scrollable messages box */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 font-sans text-xs min-h-0 mb-2">
          {messages.map((m) => (
            <div key={m.id} className="flex justify-between items-start gap-2 text-left">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`px-2 py-0.5 border-2 border-charcoal font-extrabold text-[9px] uppercase flex-shrink-0 ${m.color}`}>
                  {m.sender}
                </span>
                <span className="font-semibold text-charcoal/80 leading-snug truncate">{m.text}</span>
              </div>
              <span className="text-[8px] font-bold text-charcoal/40 font-mono flex-shrink-0 mt-0.5">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Chat input line */}
        <form onSubmit={handleSendMessage} className="flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Suggest experiment settings..."
            className="flex-1 border-3 border-charcoal px-3 py-1.5 bg-cream text-xs font-bold focus:outline-none focus:bg-white"
          />
          <button
            type="submit"
            className="bg-brutalBlue border-3 border-charcoal px-3 py-1.5 shadow-brutal-sm text-white font-bold text-xs flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default BottomPanel;
