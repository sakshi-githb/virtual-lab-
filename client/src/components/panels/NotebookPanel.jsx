import React, { useState } from 'react';
import { BookOpen, Save, FileText, Sparkles, CheckSquare, HelpCircle, X } from 'lucide-react';

const NotebookPanel = ({ onSpawnPreset, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState('guide'); // 'guide' | 'journal'
  const [selectedExpId, setSelectedExpId] = useState('pendulum');

  const [notes, setNotes] = useState([
    { id: 1, topic: 'Experiment #01 - Elastic Restitution', content: 'Testing dynamic collision of circles against floor wall. Restitution (e) set to 0.8 achieves near-perfect bounce retention. Mass does not affect terminal restitution velocity.', timestamp: 'Observation #1' },
    { id: 2, topic: 'Experiment #02 - Hookes Law', content: 'Oscillating spring block with stiffness 0.05. SHM curves mapped successfully.', timestamp: 'Observation #2' }
  ]);
  
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');

  const experimentsList = [
    {
      id: 'pendulum',
      title: '1. Simple Pendulum Rig',
      topic: 'Simple Harmonic Motion',
      objective: 'Study how mass & gravity impact oscillation frequency.',
      explanation: 'A pendulum swings due to gravity. The swing period depends ONLY on length (L) and gravity (g). Changing the mass of the bob does NOT change the swing speed or timing! Try it and see.',
      steps: 'Click "Auto-Setup". Select the bob. Toggle "Velocity X" in the inspector graph. Change the Bob Mass—observe that the wave period stays identical. Now slide Gravity to see it speed up or slow down!',
      preset: 'pendulum'
    },
    {
      id: 'spring',
      title: '2. Mass-Spring Oscillator',
      topic: 'Hooke\'s Law & Damping',
      objective: 'Study spring elasticity & friction damping.',
      explanation: 'Springs pull back with force proportional to stretch (F = -kx). A larger mass slows down the bounce. Friction acts as a damper, causing the bounces to decay over time.',
      steps: 'Click "Auto-Setup". Grab and drag the red block down, then let go. In the graph, select "Displacement X" to see the decaying sine wave. Adjust block Mass or Friction and observe the damping changes.',
      preset: 'spring'
    },
    {
      id: 'friction',
      title: '3. Friction on Inclined Plane',
      topic: 'Static vs Kinetic Friction',
      objective: 'Observe how surface friction prevents sliding.',
      explanation: 'Gravity pulls things down ramps. Friction acts as a brake. If the friction coefficient is low (ice), the box slides. If it is high (rubber), the block locks in place!',
      steps: 'Click "Auto-Setup". The block is sliding down. Select the block. In the inspector properties, increase the Friction slider from 0.05 to 0.8. The block will friction-lock and stop.',
      preset: 'friction'
    },
    {
      id: 'bounciness',
      title: '4. Elastic vs Inelastic Collisions',
      topic: 'Coefficient of Restitution',
      objective: 'Compare bouncy vs dull collision energy.',
      explanation: 'Restitution (e) measures bounciness. A value of 1.0 means a perfect bounce (keeps all bounce energy). A value of 0.15 drops flat like wet clay, losing its kinetic energy to impact heat.',
      steps: 'Click "Auto-Setup". Watch both balls drop. The yellow sphere (e=0.9) bounces continuously. The blue sphere (e=0.15) lands flat. Select them to tweak bounciness values!',
      preset: 'bounciness'
    },
    {
      id: 'projectile',
      title: '5. Projectile Motion Cannon',
      topic: 'Classical Kinematics',
      objective: 'Launch a projectile and hit the target basket.',
      explanation: 'A launched projectile flies in a parabolic arc. Gravity constantly pulls it down vertically, while it moves forward horizontally at a constant speed.',
      steps: 'Click "Auto-Setup". The ball launches from the cannon mouth in a parabolic path trying to hit the target. Adjust gravity to see how it changes the landing spot!',
      preset: 'projectile'
    },
    {
      id: 'catapult',
      title: '6. Catapult Physics Lever',
      topic: 'Rotational Torque & Levers',
      objective: 'Launch a projectile using counter-weight torque.',
      explanation: 'Levers translate force. A heavy block falling on the short arm of a seesaw generates a rapid rotational torque that flings the light projectile on the long arm high into the air.',
      steps: 'Click "Auto-Setup". The heavy block falls, flinging the red projectile sphere. Adjust block weight or spring constants to see how projectile distance is affected.',
      preset: 'catapult'
    },
    {
      id: 'bridge',
      title: '7. Suspension Bridge Stress',
      topic: 'Structural Mechanics',
      objective: 'Analyse load stress on dynamic bridge planks.',
      explanation: 'A suspension bridge distributes load across linked nodes. Adding weight to the center pulls on both anchor chains, demonstrating tension forces.',
      steps: 'Click "Auto-Setup". A dynamic block drops onto the link planks of the bridge. Select planks to monitor how displacement scales under stress load.',
      preset: 'bridge'
    }
  ];

  const activeExp = experimentsList.find(e => e.id === selectedExpId) || experimentsList[0];

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

  const triggerAutoSetup = () => {
    if (onSpawnPreset) {
      onSpawnPreset(activeExp.preset);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 select-none min-h-0">
      
      {/* COLUMN A: TAB / MODE CONTROLLERS (Flat Yellow Banner) */}
      <div className="card-brutal bg-white p-2.5 w-full flex justify-between items-center gap-2 relative pt-6 flex-shrink-0 select-none">
        {/* Mockup Yellow Header Ribbon */}
        <div className="absolute top-0 left-0 bg-brutalYellow text-charcoal border-r-3 border-b-3 border-charcoal px-3 py-0.5 font-extrabold text-[9px] uppercase tracking-widest leading-none select-none">
          🗂️ Chamber Modes
        </div>
        
        {/* Tabs switcher */}
        <button
          onClick={() => setActiveSubTab('guide')}
          className={`flex-1 text-center font-extrabold border-2 border-charcoal px-2 py-1.5 flex items-center justify-center gap-1.5 transition-all text-[9px] uppercase tracking-wide leading-none ${
            activeSubTab === 'guide' 
              ? 'bg-brutalYellow shadow-brutal-sm translate-x-[1px] translate-y-[1px]' 
              : 'bg-white hover:-translate-y-[1px] cursor-pointer'
          }`}
        >
          <BookOpen className="w-3 h-3 text-charcoal" />
          <span>📖 Lab Guide</span>
        </button>

        <button
          onClick={() => setActiveSubTab('journal')}
          className={`flex-1 text-center font-extrabold border-2 border-charcoal px-2 py-1.5 flex items-center justify-center gap-1.5 transition-all text-[9px] uppercase tracking-wide leading-none ${
            activeSubTab === 'journal' 
              ? 'bg-brutalBlue text-white shadow-brutal-sm translate-x-[1px] translate-y-[1px] border-charcoal' 
              : 'bg-white text-charcoal hover:-translate-y-[1px] cursor-pointer'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>✍️ Journal Notes</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-charcoal hover:bg-neutral-100 transition-colors cursor-pointer bg-white flex items-center justify-center flex-shrink-0"
            title="Minimize Guide"
          >
            <X className="w-3.5 h-3.5 text-charcoal" />
          </button>
        )}
      </div>

      {/* COLUMN B: MAIN DETAILS MATRIX (Changes based on selected active tab) */}
      {activeSubTab === 'guide' ? (
        // LAB MANUAL SCREEN
        <div className="card-brutal bg-white p-3 flex-1 flex flex-col gap-3 relative pt-7 min-w-0 min-h-0">
          {/* Mockup Blue Header Ribbon */}
          <div className="absolute top-0 left-0 bg-brutalBlue text-white border-r-3 border-b-3 border-charcoal px-3 py-0.5 font-extrabold text-[9px] uppercase tracking-widest leading-none select-none">
            🔬 Interactive Lab Manual
          </div>

          {/* Top part: Dropdown & Concept details */}
          <div className="flex flex-col gap-2 border-b border-charcoal/15 pb-2 flex-shrink-0 text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[9px] text-charcoal/50 uppercase tracking-wide">Select:</span>
              <select
                value={selectedExpId}
                onChange={(e) => setSelectedExpId(e.target.value)}
                className="flex-1 bg-cream border-2 border-charcoal px-1.5 py-0.5 text-[10px] font-bold focus:outline-none cursor-pointer"
              >
                {experimentsList.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.title}</option>
                ))}
              </select>
            </div>

            <div>
              <span className="font-extrabold text-[8px] text-brutalBlue uppercase tracking-wider block">Physics Concept:</span>
              <p className="text-[10px] font-semibold text-charcoal leading-snug mt-0.5">
                {activeExp.explanation}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[8px] font-bold text-charcoal/60 uppercase font-mono select-none">
              <HelpCircle className="w-3 h-3 text-brutalBlue flex-shrink-0" />
              <span className="truncate">Goal: {activeExp.objective}</span>
            </div>
          </div>

          {/* Bottom part: Steps & Setup Button */}
          <div className="flex-1 flex flex-col justify-between min-h-0">
            <div className="text-left overflow-y-auto pr-1 flex-1 min-h-[50px]">
              <span className="font-extrabold text-[8px] text-brutalGreen uppercase tracking-wider flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-brutalGreen flex-shrink-0" />
                Guided Lab Steps:
              </span>
              <p className="text-[9px] font-medium text-charcoal/80 leading-relaxed mt-1 whitespace-pre-line">
                {activeExp.steps}
              </p>
            </div>

            <button
              onClick={triggerAutoSetup}
              className="w-full bg-brutalGreen text-white border-3 border-charcoal py-1.5 shadow-brutal-sm font-black text-[9px] flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer flex-shrink-0 uppercase mt-2"
            >
              <Sparkles className="w-3 h-3 fill-current text-brutalYellow" />
              <span>🛠️ Auto-Setup Experiment</span>
            </button>
          </div>
        </div>
      ) : (
        // JOURNAL NOTES SCREEN
        <div className="card-brutal bg-white p-3 flex-1 flex flex-col gap-3 relative pt-7 min-w-0 min-h-0">
          {/* Mockup Blue Header Ribbon */}
          <div className="absolute top-0 left-0 bg-brutalBlue text-white border-r-3 border-b-3 border-charcoal px-3 py-0.5 font-extrabold text-[9px] uppercase tracking-widest leading-none select-none">
            📓 Observation Journal
          </div>

          {/* Lined paper observations scroll list */}
          <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto text-left min-h-[80px] border-b border-charcoal/15 pb-2">
            {notes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[8px] font-bold text-charcoal/30 uppercase tracking-widest">
                No entries saved yet.
              </div>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="border border-charcoal/30 bg-cream p-1.5 flex flex-col gap-1 text-[9px] hover:border-charcoal transition-all">
                  <div className="flex justify-between items-center border-b border-dashed border-charcoal/20 pb-0.5">
                    <span className="font-extrabold uppercase text-brutalBlue text-[8px]">{n.timestamp}</span>
                    <span className="font-bold text-charcoal/70 truncate">{n.topic}</span>
                  </div>
                  <p className="font-medium text-charcoal/80 leading-snug">{n.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Observation log form */}
          <form onSubmit={handleAddNote} className="flex flex-col gap-1.5 flex-shrink-0">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic: e.g. Pendulum Gravity Tries"
              className="border-2 border-charcoal px-2 py-0.5 bg-cream text-[10px] font-bold focus:outline-none focus:bg-white"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your physics findings..."
              className="border-2 border-charcoal px-2 py-0.5 bg-cream text-[10px] font-medium focus:outline-none focus:bg-white resize-none h-[40px]"
              required
            />
            <button
              type="submit"
              className="w-full bg-brutalYellow border-3 border-charcoal py-1 shadow-brutal-sm text-charcoal font-black text-[9px] flex items-center justify-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer flex-shrink-0 uppercase"
            >
              <Save className="w-3 h-3" />
              <span>Archive Entry</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NotebookPanel;
