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
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Standard {standardNumber} Physics</h1>
        <p className="text-gray-600 mt-2">Select a topic to view available experiments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map(topic => (
          <Link 
            key={topic.id} 
            to={`/physicslab/topic/${topic.slug}`}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1E3A5F] transition-all group flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-[#1E3A5F] rounded-lg flex items-center justify-center group-hover:bg-[#1E3A5F] group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {topic.count} {topic.count === 1 ? 'Exp' : 'Exps'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.name}</h3>
            <span className="text-[#F59E0B] font-medium text-sm mt-auto group-hover:underline">
              View experiments &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
