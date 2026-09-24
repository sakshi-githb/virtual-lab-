import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MousePointer2, ClipboardList, CheckCircle2 } from 'lucide-react';
import { usePhysicsLab } from '../../context/PhysicsLabContext';

export default function PhysicsLabHome() {
  const { experiments } = usePhysicsLab();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E3A5F] to-indigo-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Explore Physics. Perform Experiments. Understand the Science.
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            A Virtual Physics Laboratory for Maharashtra State Board students.
            Conduct interactive simulations right from your browser.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/physicslab/standard/9" 
              className="px-8 py-4 bg-white text-[#1E3A5F] rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explore Standard 9
            </Link>
            <Link 
              to="/physicslab/standard/10" 
              className="px-8 py-4 bg-[#F59E0B] text-white rounded-lg font-bold text-lg hover:bg-amber-400 transition-colors shadow-lg"
            >
              Explore Standard 10
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1E3A5F] mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Learn Theory</h3>
              <p className="text-gray-600">Read the aim, apparatus, and physics principles behind the experiment.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <MousePointer2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Interact with Apparatus</h3>
              <p className="text-gray-600">Use intuitive controls to adjust parameters and perform the simulation.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <ClipboardList size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Record Observations</h3>
              <p className="text-gray-600">Log your readings directly into dynamic observation tables.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Get Your Result</h3>
              <p className="text-gray-600">Analyze auto-generated graphs and verify your final conclusions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiments */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1E3A5F] mb-12">Featured Experiments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiments.map(exp => (
              <div key={exp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                  <span className="text-gray-400 font-medium">Experiment Preview</span>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-white text-xs font-bold text-[#1E3A5F] rounded shadow-sm">Std {exp.standard}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                  </div>
                  <div className="flex gap-2 mb-6">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100">{exp.topic}</span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded border border-gray-200">{exp.difficulty}</span>
                  </div>
                  <Link 
                    to={`/physicslab/experiment/${exp.slug}`}
                    className="block w-full py-2 px-4 bg-[#1E3A5F] hover:bg-opacity-90 text-white text-center rounded-lg font-medium transition-colors"
                  >
                    Start Experiment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
