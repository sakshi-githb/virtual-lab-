import React, { useState } from 'react';
import { BookOpen, Save, FileText, Sparkles } from 'lucide-react';

const NotebookPanel = () => {
  const [notes, setNotes] = useState([
    { id: 1, topic: 'Experiment #01 - Elastic Restitution', content: 'Testing dynamic collision of circles against floor wall. Restitution (e) set to 0.8 achieves near-perfect bounce retention. Mass does not affect terminal restitution velocity.', timestamp: 'Observation #1' },
    { id: 2, topic: 'Experiment #02 - Hookes Law', content: 'Oscillating spring block with stiffness 0.05. SHM curves mapped successfully.', timestamp: 'Observation #2' }
  ]);
  
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!topic.trim() || !content.trim()) return;

    setNotes(prev => [
      ...prev,
      {
        id: prev.length + 1,
        topic: topic,
        content: content,
        timestamp: `Observation #${prev.length + 1}`
      }
    ]);
    setTopic('');
    setContent('');
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 select-none">
      
      {/* COLUMN A: LAB STATUS METRICS (Flat Yellow Banner) */}
      <div className="card-brutal bg-white p-4 w-full md:w-60 h-20 md:h-full flex flex-col justify-center relative pt-8 md:pt-10 flex-shrink-0">
        {/* Mockup Yellow Header Ribbon */}
        <div className="absolute top-0 left-0 bg-brutalYellow text-charcoal border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          📊 Stats
        </div>
        
        <div className="flex flex-col gap-1 text-[10px] font-mono font-bold text-left">
          <div className="flex justify-between border-b border-dashed border-charcoal/20 pb-0.5">
            <span className="text-charcoal/50">Total Logs:</span>
            <span>{notes.length} entries</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-charcoal/20 pb-0.5">
            <span className="text-charcoal/50">Framework:</span>
            <span className="text-brutalBlue">Solo Sandbox</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/50">Backups:</span>
            <span className="text-brutalGreen">Active</span>
          </div>
        </div>
      </div>

      {/* COLUMN B: THE LINED JOURNAL NOTEBOOK (Flat Blue Banner) */}
      <div className="card-brutal bg-white p-4 flex-1 flex flex-col sm:flex-row gap-4 h-44 md:h-full relative pt-8 md:pt-10 min-w-0">
        {/* Mockup Blue Header Ribbon */}
        <div className="absolute top-0 left-0 bg-brutalBlue text-white border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          📓 Journal
        </div>

        {/* Lined paper observations scroll list */}
        <div className="w-full sm:w-1/2 flex flex-col gap-1.5 border-b-2 sm:border-b-0 sm:border-r-2 border-charcoal/20 pb-2 sm:pb-0 sm:pr-4 overflow-y-auto max-h-16 sm:max-h-none text-left">
          {notes.map((n) => (
            <div key={n.id} className="border border-charcoal/30 bg-cream p-1.5 flex flex-col gap-1 text-[9px] hover:border-charcoal transition-all">
              <div className="flex justify-between items-center border-b border-dashed border-charcoal/20 pb-0.5">
                <span className="font-extrabold uppercase text-brutalBlue text-[8px]">{n.timestamp}</span>
                <span className="font-bold text-charcoal/70 truncate">{n.topic}</span>
              </div>
              <p className="font-medium text-charcoal/80 leading-snug">{n.content}</p>
            </div>
          ))}
        </div>

        {/* Observation log form */}
        <form onSubmit={handleAddNote} className="w-full sm:w-1/2 flex flex-col gap-1.5 h-full min-h-0 justify-between">
          <div className="flex flex-col gap-1 flex-1 min-h-0 justify-between">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Gravity Observations"
              className="border-2 border-charcoal px-2 py-0.5 bg-cream text-[10px] font-bold focus:outline-none focus:bg-white"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record velocity values or physical traits..."
              className="border-2 border-charcoal px-2 py-0.5 bg-cream text-[10px] font-medium focus:outline-none focus:bg-white resize-none flex-1 min-h-[30px]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brutalYellow border-3 border-charcoal py-1 shadow-brutal-sm text-charcoal font-black text-[10px] flex items-center justify-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer flex-shrink-0 uppercase"
          >
            <Save className="w-3 h-3" />
            <span>Archive Entry</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default NotebookPanel;
