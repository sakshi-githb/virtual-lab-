import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const BottomPanel = () => {
  const { users, messages, sendChatMessage } = useSocket();
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(inputText);
    setInputText('');
  };

  // Helper to assign a color block to users based on username hash
  const getUserColor = (username) => {
    if (username === 'SYSTEM') return 'bg-charcoal text-brutalYellow';
    const colors = [
      'bg-brutalBlue text-white',
      'bg-brutalGreen text-white',
      'bg-brutalYellow text-charcoal',
      'bg-brutalRed text-white'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper to extract initials
  const getInitials = (username) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 select-none">
      
      {/* COLUMN A: PLAYERS HUD (Flat Yellow Banner) */}
      <div className="card-brutal bg-white p-4 w-full md:w-60 h-20 md:h-full flex flex-col justify-center relative pt-8 md:pt-10 flex-shrink-0">
        {/* Mockup Yellow Header Ribbon */}
        <div className="absolute top-0 left-0 bg-brutalYellow text-charcoal border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          👥 Players ({users.length})
        </div>
        
        <div className="flex items-center gap-2 flex-wrap overflow-y-auto max-h-full py-1">
          {users.map((u, index) => {
            const initial = getInitials(u.username);
            const colorClass = getUserColor(u.username);
            return (
              <div
                key={u.socketId || index}
                className={`w-9 h-9 rounded-full ${colorClass.split(' ')[0]} border-3 border-charcoal flex items-center justify-center font-extrabold text-xs shadow-brutal-sm hover:-translate-y-0.5 transition-transform cursor-pointer`}
                title={`${u.username} - Online`}
              >
                {initial}
              </div>
            );
          })}
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
          {messages.length === 0 ? (
            <div className="text-charcoal/40 font-bold italic py-2 text-center">
              No messages in workspace. Start collaboration chat!
            </div>
          ) : (
            messages.map((m) => {
              const colorClass = getUserColor(m.username);
              const timeString = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={m.id} className="flex justify-between items-start gap-2 text-left">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`px-2 py-0.5 border-2 border-charcoal font-extrabold text-[9px] uppercase flex-shrink-0 ${colorClass}`}>
                      {m.username}
                    </span>
                    <span className={`font-semibold leading-snug truncate ${m.isSystem ? 'text-charcoal/50 italic' : 'text-charcoal/80'}`}>
                      {m.text}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-charcoal/40 font-mono flex-shrink-0 mt-0.5">
                    {timeString}
                  </span>
                </div>
              );
            })
          )}
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

