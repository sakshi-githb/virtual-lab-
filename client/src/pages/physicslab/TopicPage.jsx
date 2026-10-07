import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePhysicsLab } from '../../context/PhysicsLabContext';
import { ArrowLeft } from 'lucide-react';

export default function TopicPage() {
  const { topicSlug } = useParams();
  const { experiments } = usePhysicsLab();

  const formattedTopic = topicSlug ? topicSlug.replace(/-/g, ' ') : '';
  const topicExperiments = experiments.filter(e => e.topic.toLowerCase().includes(formattedTopic.toLowerCase()) || formattedTopic.toLowerCase().includes(e.topic.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div className="border-b-4 border-charcoal pb-4">
        <Link to="/physicslab" className="btn-brutal bg-white text-xs py-1 px-3 inline-flex items-center gap-1 font-mono uppercase mb-4">
          <ArrowLeft size={14} /> Back to Lab Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-charcoal uppercase tracking-tight capitalize">
          {formattedTopic}
        </h1>
        <p className="text-xs font-bold text-charcoal/70 mt-1">Experiments available under this curriculum topic.</p>
      </div>

      {topicExperiments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topicExperiments.map(exp => (
            <div key={exp.id} className="card-brutal bg-white p-6 shadow-brutal flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-brutalYellow border-2 border-charcoal px-2.5 py-0.5 font-mono text-[11px] font-black uppercase">
                    Std {exp.standard}
                  </span>
                  <span className="bg-cream border-2 border-charcoal px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    {exp.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-black text-charcoal uppercase leading-tight mb-4">{exp.title}</h3>
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
      ) : (
        <div className="card-brutal bg-white p-12 text-center shadow-brutal">
          <p className="font-mono text-xs font-bold text-charcoal/60 uppercase">No experiments currently loaded under this topic.</p>
        </div>
      )}
    </div>
  );
}
