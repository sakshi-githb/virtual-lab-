import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { usePhysicsLab } from '../../context/PhysicsLabContext';
import AimTheorySection from '../../components/physicslab/experiment/AimTheorySection';
import ApparatusSection from '../../components/physicslab/experiment/ApparatusSection';
import ProcedureSection from '../../components/physicslab/experiment/ProcedureSection';
import ObservationSection from '../../components/physicslab/experiment/ObservationSection';
import CalculationsSection from '../../components/physicslab/experiment/CalculationsSection';
import GraphSection from '../../components/physicslab/experiment/GraphSection';
import ResultSection from '../../components/physicslab/experiment/ResultSection';
import VivaSection from '../../components/physicslab/experiment/VivaSection';
import LensSimulator from '../../components/physicslab/simulations/LensSimulator';

const TABS = [
  { id: 'theory', label: 'Aim & Theory' },
  { id: 'apparatus', label: 'Apparatus' },
  { id: 'procedure', label: 'Procedure' },
  { id: 'lab', label: 'Lab' },
  { id: 'observations', label: 'Observations' },
  { id: 'calculations', label: 'Calculations' },
  { id: 'result', label: 'Result' },
  { id: 'viva', label: 'Viva' }
];

export default function ExperimentPage() {
  const { slug } = useParams();
  const { experiments } = usePhysicsLab();
  const [activeTab, setActiveTab] = useState('theory');
  const [experiment, setExperiment] = useState(null);
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    // Attempt to match from context or slug directly
    let exp = experiments.find(e => e.slug === slug || e.slug === 'convex-lens-image-formation');
    if (!exp && (slug === 'convex-lens' || slug === 'convex-lens-image-formation')) {
      exp = { id: 1, title: 'Convex Lens Image Formation', slug: 'convex-lens-image-formation', standard: 10, topic: 'Optics', difficulty: 'Medium' };
    }
    if (exp) {
      setExperiment({
        ...exp,
        aim: 'To study the nature, position and relative size of the image formed by a convex lens.',
        theory: 'A convex lens is thicker at the center and thinner at the edges. It converges parallel rays of light to a principal focus. The lens formula is given by 1/f = 1/v - 1/u, where v is the image distance, u is the object distance, and f is the focal length. Cartesian Sign Convention: distances measured in the direction of incident light are positive (+), while distances measured opposite to incident light are negative (-).',
        apparatus: ['Convex Lens', 'Lens Stand', 'Illuminated Object (Candle / Mesh)', 'Screen', 'Optical Bench with Meter Scale'],
        procedure: [
          'Mount the convex lens on the stand on the optical bench.',
          'Place the illuminated object at a known distance u on one side of the lens (e.g. beyond 2F, at 2F, between F and 2F, at F, or between F and O).',
          'Move the screen on the opposite side of the lens until a clear, sharp image is focused.',
          'Note down the object distance u and image distance v on the optical scale.',
          'Observe the nature (real/virtual), orientation (erect/inverted), and size (magnified/diminished) of the image.',
          'Click "Add to Observation Table" in the simulator to record readings.',
          'Verify your measurements using the lens formula 1/f = 1/v - 1/u in the Calculations section.'
        ],
        observationColumns: ['Trial', 'Object Distance u (cm)', 'Image Distance v (cm)', 'Focal Length f (cm)', 'Magnification m', 'Nature of Image'],
        simulationType: (exp.slug === 'convex-lens' || exp.slug === 'convex-lens-image-formation') ? 'lens_convex' : 'coming_soon'
      });
    }
  }, [slug, experiments]);

  if (!experiment) {
    return <div className="p-12 text-center text-gray-500">Loading experiment...</div>;
  }

  const handleAddObservation = (obs) => {
    setObservations([...observations, obs]);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theory':
        return <AimTheorySection aim={experiment.aim} theory={experiment.theory} />;
      case 'apparatus':
        return <ApparatusSection apparatus={experiment.apparatus} />;
      case 'procedure':
        return <ProcedureSection procedure={experiment.procedure} />;
      case 'lab':
        if (experiment.simulationType === 'lens_convex') {
          return <LensSimulator onAddObservation={handleAddObservation} />;
        }
        return <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">Simulation Coming Soon</div>;
      case 'observations':
        return <ObservationSection columns={experiment.observationColumns} observations={observations} />;
      case 'calculations':
        return <CalculationsSection observations={observations} />;
      case 'result':
        return <ResultSection observations={observations} />;
      case 'viva':
        return <VivaSection experimentId={experiment.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-gray-50 border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center text-sm text-gray-500">
          <Link to="/physicslab" className="hover:text-[#1E3A5F]">Home</Link>
          <ChevronRight size={16} className="mx-1" />
          <Link to={`/physicslab/standard/${experiment.standard}`} className="hover:text-[#1E3A5F]">Standard {experiment.standard}</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-gray-900 font-medium">{experiment.title}</span>
        </div>
        <div className="max-w-7xl mx-auto mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F]">{experiment.title}</h1>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-[#1E3A5F] text-[#1E3A5F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
        {renderTabContent()}
      </div>
    </div>
  );
}
