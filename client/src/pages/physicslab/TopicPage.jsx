import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePhysicsLab } from '../../context/PhysicsLabContext';
import { ArrowLeft } from 'lucide-react';

export default function TopicPage() {
  const { topicSlug } = useParams();
  const { experiments } = usePhysicsLab();

  // In a real app we would fetch topic details. Here we just filter.
  // Using a simplistic filter for demonstration
  const topicExperiments = experiments.filter(e => e.topic.toLowerCase() === topicSlug.replace('-', ' '));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <Link to={-1} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#1E3A5F] mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>
        <h1 className="text-3xl font-bold text-[#1E3A5F] capitalize">{topicSlug.replace('-', ' ')}</h1>
        <p className="text-gray-600 mt-2">Experiments available in this topic.</p>
      </div>

      {topicExperiments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topicExperiments.map(exp => (
            <div key={exp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Std {exp.standard}</span>
                </div>
                <div className="flex gap-2 mb-6 mt-auto">
                  <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded border border-gray-200">{exp.difficulty}</span>
                </div>
                <Link 
                  to={`/physicslab/experiment/${exp.slug}`}
                  className="block w-full py-2 px-4 bg-white border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white text-center rounded-lg font-medium transition-colors"
                >
                  Start Experiment
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-xl border border-gray-200">
          <p className="text-gray-500">No experiments available for this topic yet.</p>
        </div>
      )}
    </div>
  );
}
