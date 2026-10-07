import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MousePointer2, ClipboardList, CheckCircle2 } from 'lucide-react';
import { usePhysicsLab } from '../../context/PhysicsLabContext';

export default function PhysicsLabHome() {
  const { experiments } = usePhysicsLab();

  return (
    <div className="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero Poster Banner */}
      <section className="bg-brutalYellow border-4 border-charcoal p-8 md:p-12 shadow-brutal-xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 notebook-grid pointer-events-none" />
        <div className="bg-white border-3 border-charcoal px-3 py-1 text-xs font-mono font-black uppercase shadow-brutal-sm mb-4">
          MH State Board Curriculum
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-charcoal uppercase tracking-tight max-w-4xl leading-none mb-4">
          Explore Physics.<br />Perform Experiments.<br />Understand Science.
        </h1>
        <p className="text-sm md:text-base font-bold text-charcoal/80 max-w-2xl mb-8 leading-relaxed">
          A Virtual Physics Laboratory for Maharashtra State Board students. Conduct interactive simulations, record real observations, verify formulas, and attempt viva voce right from your browser.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
          <Link 
            to="/physicslab/standard/9" 
            className="btn-brutal bg-white text-charcoal font-black text-sm py-3 px-6 uppercase shadow-brutal"
          >
            Explore Standard 9
          </Link>
          <Link 
            to="/physicslab/standard/10" 
            className="btn-brutal-blue text-white font-black text-sm py-3 px-6 uppercase shadow-brutal"
          >
            Explore Standard 10
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-charcoal uppercase tracking-tight border-b-4 border-charcoal pb-2">
          Experimental Workflow
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card-brutal bg-white flex flex-col items-start p-5 gap-3">
            <div className="w-12 h-12 bg-brutalBlue text-white border-3 border-charcoal shadow-brutal-sm flex items-center justify-center font-bold">
              <BookOpen size={24} />
            </div>
            <h3 className="font-extrabold text-base uppercase text-charcoal">1. Learn Theory</h3>
            <p className="text-xs text-charcoal/80 font-medium">Read the aim, apparatus list, and physics principles behind each experiment.</p>
          </div>

          <div className="card-brutal bg-white flex flex-col items-start p-5 gap-3">
            <div className="w-12 h-12 bg-brutalYellow text-charcoal border-3 border-charcoal shadow-brutal-sm flex items-center justify-center font-bold">
              <MousePointer2 size={24} />
            </div>
            <h3 className="font-extrabold text-base uppercase text-charcoal">2. Interactive Lab</h3>
            <p className="text-xs text-charcoal/80 font-medium">Adjust parameters, drag object positions, and inspect real-time SVG ray diagrams.</p>
          </div>

          <div className="card-brutal bg-white flex flex-col items-start p-5 gap-3">
            <div className="w-12 h-12 bg-brutalRed text-white border-3 border-charcoal shadow-brutal-sm flex items-center justify-center font-bold">
              <ClipboardList size={24} />
            </div>
            <h3 className="font-extrabold text-base uppercase text-charcoal">3. Record & Verify</h3>
            <p className="text-xs text-charcoal/80 font-medium">Log your readings into observation tables and calculate lens formula $1/f = 1/v - 1/u$.</p>
          </div>

          <div className="card-brutal bg-white flex flex-col items-start p-5 gap-3">
            <div className="w-12 h-12 bg-brutalGreen text-white border-3 border-charcoal shadow-brutal-sm flex items-center justify-center font-bold">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-extrabold text-base uppercase text-charcoal">4. Attempt Viva</h3>
            <p className="text-xs text-charcoal/80 font-medium">Test your conceptual knowledge with instant Viva Voce scoring and detailed explanations.</p>
          </div>
        </div>
      </section>

      {/* Featured Experiments */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-charcoal uppercase tracking-tight border-b-4 border-charcoal pb-2">
          Featured Experiments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiments.map(exp => (
            <div key={exp.id} className="card-brutal bg-white flex flex-col justify-between p-6 gap-4 hover:-translate-y-1 transition-transform">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-brutalYellow border-2 border-charcoal px-2.5 py-0.5 font-mono text-[11px] font-black uppercase shadow-brutal-sm">
                    Std {exp.standard}
                  </span>
                  <span className="bg-cream border-2 border-charcoal px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    {exp.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-black text-charcoal uppercase leading-tight mb-2">
                  {exp.title}
                </h3>
                <p className="text-xs text-charcoal/70 font-medium mb-4">
                  Topic: <strong className="text-charcoal">{exp.topic}</strong>
                </p>
              </div>

              <Link 
                to={`/physicslab/experiment/${exp.slug}`}
                className="btn-brutal-yellow font-black text-xs uppercase py-2.5 w-full text-center"
              >
                Start Experiment →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
