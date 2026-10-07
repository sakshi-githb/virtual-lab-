import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const STD_9_TOPICS = [
  { id: 'mechanics', name: 'Mechanics', count: 3, slug: 'mechanics' },
  { id: 'work-energy', name: 'Work & Energy', count: 2, slug: 'work-energy' },
  { id: 'electricity', name: 'Electricity', count: 4, slug: 'electricity' },
  { id: 'optics', name: 'Optics', count: 2, slug: 'optics' },
  { id: 'sound', name: 'Sound', count: 1, slug: 'sound' },
  { id: 'space', name: 'Space', count: 1, slug: 'space' }
];

const STD_10_TOPICS = [
  { id: 'gravitation', name: 'Gravitation', count: 2, slug: 'gravitation' },
  { id: 'electricity-magnetism', name: 'Electricity & Magnetism', count: 4, slug: 'electricity-magnetism' },
  { id: 'heat', name: 'Heat', count: 2, slug: 'heat' },
  { id: 'optics', name: 'Optics', count: 3, slug: 'optics' },
  { id: 'space', name: 'Space', count: 1, slug: 'space' }
];

export default function StandardPage() {
  const { standardNumber } = useParams();
  const topics = standardNumber === '9' ? STD_9_TOPICS : STD_10_TOPICS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div className="border-b-4 border-charcoal pb-4">
        <span className="bg-brutalYellow border-2 border-charcoal px-3 py-1 font-mono text-xs font-black uppercase shadow-brutal-sm">
          State Board Curriculum
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-charcoal uppercase tracking-tight mt-3">
          Standard {standardNumber} Physics
        </h1>
        <p className="text-xs font-bold text-charcoal/70 mt-1">Select a topic below to view interactive laboratory experiments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map(topic => (
          <Link 
            key={topic.id} 
            to={`/physicslab/topic/${topic.slug}`}
            className="card-brutal bg-white p-6 shadow-brutal hover:-translate-y-1 transition-transform flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-brutalBlue text-white border-3 border-charcoal shadow-brutal-sm flex items-center justify-center font-bold">
                  <BookOpen size={24} />
                </div>
                <span className="bg-cream border-2 border-charcoal px-3 py-1 font-mono text-xs font-bold uppercase">
                  {topic.count} {topic.count === 1 ? 'Exp' : 'Exps'}
                </span>
              </div>
              <h3 className="text-2xl font-black text-charcoal uppercase tracking-tight mb-2">{topic.name}</h3>
            </div>
            
            <div className="pt-4 border-t-2 border-charcoal flex items-center justify-between font-mono text-xs font-black uppercase text-charcoal group-hover:text-brutalBlue">
              <span>View Experiments</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
