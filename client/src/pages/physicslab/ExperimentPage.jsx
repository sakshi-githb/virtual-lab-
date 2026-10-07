import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { usePhysicsLab } from '../../context/PhysicsLabContext';

// Experiment Sections
import AimTheorySection from '../../components/physicslab/experiment/AimTheorySection';
import ApparatusSection from '../../components/physicslab/experiment/ApparatusSection';
import ProcedureSection from '../../components/physicslab/experiment/ProcedureSection';
import ObservationSection from '../../components/physicslab/experiment/ObservationSection';
import CalculationsSection from '../../components/physicslab/experiment/CalculationsSection';
import GraphSection from '../../components/physicslab/experiment/GraphSection';
import ResultSection from '../../components/physicslab/experiment/ResultSection';
import VivaSection from '../../components/physicslab/experiment/VivaSection';

// Simulation Components
import LensSimulator from '../../components/physicslab/simulations/LensSimulator';
import ConcaveLensSimulator from '../../components/physicslab/simulations/ConcaveLensSimulator';
import OhmsLawSimulator from '../../components/physicslab/simulations/OhmsLawSimulator';
import SeriesParallelSimulator from '../../components/physicslab/simulations/SeriesParallelSimulator';
import NewtonMotionSimulator from '../../components/physicslab/simulations/NewtonMotionSimulator';
import WorkEnergySimulator from '../../components/physicslab/simulations/WorkEnergySimulator';
import SimpleCircuitSimulator from '../../components/physicslab/simulations/SimpleCircuitSimulator';
import SoundWavesSimulator from '../../components/physicslab/simulations/SoundWavesSimulator';
import GlassSlabSimulator from '../../components/physicslab/simulations/GlassSlabSimulator';
import InductionSimulator from '../../components/physicslab/simulations/InductionSimulator';
import MagneticEffectSimulator from '../../components/physicslab/simulations/MagneticEffectSimulator';
import ForceConductorSimulator from '../../components/physicslab/simulations/ForceConductorSimulator';
import HeatTransferSimulator from '../../components/physicslab/simulations/HeatTransferSimulator';
import ReflectionSimulator from '../../components/physicslab/simulations/ReflectionSimulator';

const TABS = [
  { id: 'theory', label: 'Aim & Theory' },
  { id: 'apparatus', label: 'Apparatus' },
  { id: 'procedure', label: 'Procedure' },
  { id: 'lab', label: 'Lab Experiment' },
  { id: 'observations', label: 'Observations' },
  { id: 'graph', label: 'Graph' },
  { id: 'calculations', label: 'Calculations' },
  { id: 'result', label: 'Result' },
  { id: 'viva', label: 'Viva Voce' }
];

const EXPERIMENT_REGISTRY = {
  'convex-lens-image-formation': {
    title: 'Convex Lens Image Formation',
    standard: 10,
    topic: 'Optics',
    simulationType: 'lens_convex',
    aim: 'To study the nature, position and relative size of the image formed by a convex lens for different object positions.',
    theory: 'A convex lens is thicker at the center and converges light rays. The lens formula is 1/f = 1/v - 1/u, and magnification m = v/u.',
    apparatus: ['Convex Lens (f=15cm)', 'Optical Bench', 'Illuminated Candle/Object', 'Screen with Grid', 'Meter Scale'],
    procedure: [
      'Mount the convex lens on the optical bench.',
      'Set the object distance u beyond 2F, at 2F, between F and 2F, or at F.',
      'Adjust the screen position until a sharp image is formed.',
      'Record u and v readings in the observation table.'
    ],
    observationColumns: ['Trial', 'Object Distance u (cm)', 'Image Distance v (cm)', 'Focal Length f (cm)', 'Magnification m', 'Nature']
  },
  'concave-lens-image-formation': {
    title: 'Concave Lens Ray Optics',
    standard: 10,
    topic: 'Optics',
    simulationType: 'lens_concave',
    aim: 'To observe the virtual, erect, and diminished image formed by a concave lens.',
    theory: 'A concave lens is thinner in the center and diverges light. Virtual images are formed on the same side as the object (v < 0, f < 0).',
    apparatus: ['Concave Lens', 'Optical Bench', 'Object Candle', 'Virtual Ray Tracing Grid'],
    procedure: [
      'Position the object at various distances in front of the concave lens.',
      'Trace the virtual image formed by extending divergent rays backwards.',
      'Record object distance u and virtual image distance v.'
    ],
    observationColumns: ['Trial', 'Object Distance u (cm)', 'Virtual Image v (cm)', 'Calculated f (cm)', 'Magnification m']
  },
  'ohms-law-verification': {
    title: 'Verification of Ohm\'s Law',
    standard: 10,
    topic: 'Electricity',
    simulationType: 'ohms_law',
    aim: 'To verify Ohm\'s Law by studying the relationship between Potential Difference (V) and Electric Current (I).',
    theory: 'Ohm\'s Law states that V = I × R at constant temperature. A plot of V versus I yields a straight line whose slope gives resistance R.',
    apparatus: ['DC Battery Source', 'Nichrome Resistor Wire', 'Voltmeter (0-10V)', 'Ammeter (0-5A)', 'Rheostat Variable Resistor', 'Plug Key'],
    procedure: [
      'Connect battery, ammeter, resistor, rheostat, and key in series; voltmeter in parallel across resistor.',
      'Close plug key and adjust rheostat slider.',
      'Note ammeter reading (I) and voltmeter reading (V).',
      'Repeat for 5 different rheostat positions.'
    ],
    observationColumns: ['Trial', 'Voltage V (Volts)', 'Current I (Amps)', 'Resistance R (Ohms)', 'Power P (Watts)']
  },
  'resistors-series-parallel': {
    title: 'Resistors in Series & Parallel',
    standard: 10,
    topic: 'Electricity',
    simulationType: 'series_parallel',
    aim: 'To determine equivalent resistance of resistors connected in series (Rs = R1 + R2) and parallel (1/Rp = 1/R1 + 1/R2).',
    theory: 'In series, current is constant and Rs = R1 + R2. In parallel, potential difference is constant and 1/Rp = 1/R1 + 1/R2.',
    apparatus: ['Two Known Resistors (R1, R2)', 'DC Power Supply', 'Digital Multimeter / Voltmeter & Ammeter', 'Connecting Wires'],
    procedure: [
      'Connect R1 and R2 in series and measure total current and total voltage.',
      'Calculate equivalent resistance Rs = V/I.',
      'Reconnect R1 and R2 in parallel and measure total current and voltage.',
      'Calculate equivalent resistance Rp = V/I.'
    ],
    observationColumns: ['Configuration', 'R1 (Ω)', 'R2 (Ω)', 'Voltage V (V)', 'Current I (A)', 'Req (Ω)']
  },
  'newtons-laws-of-motion': {
    title: 'Newton\'s 2nd Law of Motion (F = ma)',
    standard: 9,
    topic: 'Mechanics',
    simulationType: 'newton_motion',
    aim: 'To verify Newton\'s Second Law of Motion: Force F = m × a.',
    theory: 'The rate of change of momentum of a body is directly proportional to the applied force: F = ma.',
    apparatus: ['Frictionless Air Track Cart', 'Hanging Mass Pulley', 'Digital Photogates', 'Precision Weights'],
    procedure: [
      'Place cart of mass m on track connected to hanging mass M.',
      'Release cart and measure acceleration using photogates.',
      'Vary applied force by changing hanging weights and record resulting acceleration.'
    ],
    observationColumns: ['Trial', 'Mass m (kg)', 'Applied Force F (N)', 'Acceleration a (m/s²)', 'Calculated F=ma']
  },
  'work-energy-theorem': {
    title: 'Work-Energy Theorem & Conservation',
    standard: 9,
    topic: 'Work & Energy',
    simulationType: 'work_energy',
    aim: 'To verify Work Done W = F × d and Potential to Kinetic Energy conversion (PE = mgh, KE = 1/2 mv²).',
    theory: 'Work done equals force times displacement W = Fd. Mechanical energy E = PE + KE remains constant in an isolated system.',
    apparatus: ['Inclined Plane Ramp', 'Roller Block', 'Height Ruler', 'Speed Sensor'],
    procedure: [
      'Set ramp height h and release block of mass m.',
      'Measure velocity v at the bottom of the ramp.',
      'Calculate initial PE = mgh and final KE = 1/2 mv².'
    ],
    observationColumns: ['Trial', 'Mass m (kg)', 'Height h (m)', 'PE (Joules)', 'Velocity v (m/s)', 'KE (Joules)']
  },
  'simple-electric-circuit': {
    title: 'Simple Electric Circuit & Components',
    standard: 9,
    topic: 'Electricity',
    simulationType: 'circuit_builder',
    aim: 'To construct a simple electric circuit and test conductors vs insulators.',
    theory: 'Electric current flows in a closed circuit. Conductors allow free electron flow while insulators offer infinite resistance.',
    apparatus: ['Cell/Battery', 'Bulb Lamp', 'Switch Key', 'Test Materials (Copper, Wood, Aluminum, Plastic, Iron)'],
    procedure: [
      'Connect battery, bulb, and switch in a loop.',
      'Insert sample test material between terminals.',
      'Observe bulb glow status (Conducting vs Insulating).'
    ],
    observationColumns: ['Sample Item', 'Material Type', 'Circuit Closed?', 'Bulb Glowing?', 'Conductor / Insulator']
  },
  'sound-waves-oscilloscope': {
    title: 'Sound Waves & Oscilloscope (v = fλ)',
    standard: 9,
    topic: 'Sound',
    simulationType: 'sound_waves',
    aim: 'To determine speed of sound v = f × λ using an oscilloscope waveform representation.',
    theory: 'Sound travels as longitudinal pressure waves. Speed v = f × λ where f is frequency and λ is wavelength.',
    apparatus: ['Tuning Forks / Signal Generator', 'Microphone Probe', 'Digital Cathode Ray Oscilloscope'],
    procedure: [
      'Set audio signal frequency f on the sound generator.',
      'Measure peak-to-peak wavelength λ on oscilloscope grid.',
      'Calculate wave velocity v = f × λ.'
    ],
    observationColumns: ['Trial', 'Frequency f (Hz)', 'Wavelength λ (m)', 'Calculated Velocity v (m/s)', 'Air Temp (°C)']
  },
  'refraction-glass-slab': {
    title: 'Refraction Through Glass Slab & Snell\'s Law',
    standard: 10,
    topic: 'Optics',
    simulationType: 'glass_slab',
    aim: 'To trace the path of a ray of light passing through a glass slab and calculate Refractive Index n = sin(i) / sin(r).',
    theory: 'Light bends towards the normal when entering a denser medium. Refractive index n = sin i / sin r, and lateral displacement occurs.',
    apparatus: ['Rectangular Glass Slab', 'Drawing Board & Pins', 'Laser Source', 'Protractor'],
    procedure: [
      'Place glass slab on paper and draw boundary ABCD.',
      'Direct incident laser beam at angle i to the normal.',
      'Mark emergent beam and calculate angle of refraction r and lateral shift d.'
    ],
    observationColumns: ['Trial', 'Angle of Incidence i', 'Angle of Refraction r', 'sin i / sin r', 'Refractive Index n']
  },
  'electromagnetic-induction': {
    title: 'Faraday\'s Law of Induction',
    standard: 10,
    topic: 'Magnetism',
    simulationType: 'induction',
    aim: 'To observe electromagnetic induction by moving a bar magnet inside a copper coil.',
    theory: 'Whenever magnetic flux linked with a coil changes, an induced electromotive force (EMF) and current is generated (Faraday\'s Law).',
    apparatus: ['Multi-turn Solenoid Coil', 'Strong Neodymium Bar Magnet', 'Center-Zero Galvanometer'],
    procedure: [
      'Connect coil terminals to center-zero galvanometer.',
      'Move North pole of bar magnet rapidly inside coil.',
      'Note galvanometer deflection direction and magnitude.'
    ],
    observationColumns: ['Trial', 'Magnet Motion', 'Coil Turns N', 'Deflection Direction', 'Induced EMF (mV)']
  },
  'magnetic-effect-current': {
    title: 'Oersted\'s Magnetic Effect & Thumb Rule',
    standard: 10,
    topic: 'Magnetism',
    simulationType: 'magnetic_compass',
    aim: 'To study the magnetic field generated around a current-carrying straight conductor using a compass needle.',
    theory: 'An electric current produces a magnetic field (Oersted effect). Direction is given by Right-Hand Thumb Rule.',
    apparatus: ['Straight Copper Wire', 'Magnetic Compass Needle', 'DC Battery', 'Key Switch'],
    procedure: [
      'Place magnetic compass directly below copper wire.',
      'Pass current from North to South (or South to North).',
      'Observe needle deflection direction according to SNOW rule.'
    ],
    observationColumns: ['Trial', 'Current Dir', 'Compass Position', 'Deflection Angle', 'Rule Verified']
  },
  'force-conductor-magnetic-field': {
    title: 'Fleming\'s Left-Hand Rule & Conductor Force',
    standard: 10,
    topic: 'Magnetism',
    simulationType: 'force_conductor',
    aim: 'To demonstrate force on a current-carrying conductor in a magnetic field (F = BIL sin θ).',
    theory: 'When a current-carrying conductor is placed in a magnetic field, it experiences a force given by Fleming\'s Left-Hand Rule.',
    apparatus: ['Horseshoe Magnet', 'Suspended Copper Rod', 'Variable DC Power Unit', 'Ammeter'],
    procedure: [
      'Suspend copper rod between poles of horseshoe magnet.',
      'Switch ON electric current through rod.',
      'Observe mechanical displacement and direction of force F.'
    ],
    observationColumns: ['Trial', 'Current I (A)', 'Field B (T)', 'Length L (m)', 'Angle θ', 'Force F (N)']
  },
  'heat-transfer-conduction': {
    title: 'Specific Heat Capacity of Substances',
    standard: 9,
    topic: 'Heat',
    simulationType: 'heat_transfer',
    aim: 'To measure heat energy required to raise temperature of different substances (Q = m c ΔT).',
    theory: 'Heat absorbed Q = m × c × ΔT where c is specific heat capacity.',
    apparatus: ['Calorimeter Beaker', 'Heating Element', 'Substance Samples (Water, Cu, Al, Fe)', 'Digital Thermometer'],
    procedure: [
      'Take mass m of substance at initial temperature T1.',
      'Apply heat energy and monitor temperature change to T2.',
      'Calculate total heat energy Q = m c (T2 - T1).'
    ],
    observationColumns: ['Trial', 'Substance', 'Specific Heat c', 'Mass m (kg)', 'Initial T1', 'Final T2', 'Heat Q (kJ)']
  },
  'reflection-light-mirror': {
    title: 'Laws of Reflection of Light',
    standard: 9,
    topic: 'Optics',
    simulationType: 'reflection',
    aim: 'To verify the Laws of Reflection of Light: Angle of Incidence ∠i = Angle of Reflection ∠r.',
    theory: 'The incident ray, normal, and reflected ray lie in the same plane, and angle i equals angle r.',
    apparatus: ['Plane Mirror', 'Laser Light Module', 'Protractor Board', 'Normal Line Marker'],
    procedure: [
      'Align plane mirror on baseline of protractor.',
      'Direct laser beam at angle of incidence i.',
      'Measure corresponding angle of reflection r.'
    ],
    observationColumns: ['Trial', 'Surface Type', 'Angle i (°)', 'Angle r (°)', 'Verification Status']
  }
};

export default function ExperimentPage() {
  const { slug } = useParams();
  const { experiments } = usePhysicsLab();
  const [activeTab, setActiveTab] = useState('lab');
  const [experiment, setExperiment] = useState(null);
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    // Lookup matching registry key or context experiment
    let expData = EXPERIMENT_REGISTRY[slug];

    if (!expData) {
      // Search by partial slug or context
      const matched = Object.keys(EXPERIMENT_REGISTRY).find(k => slug?.includes(k) || k?.includes(slug));
      if (matched) {
        expData = EXPERIMENT_REGISTRY[matched];
      } else {
        // Fallback default to convex lens
        expData = EXPERIMENT_REGISTRY['convex-lens-image-formation'];
      }
    }

    setExperiment({
      id: slug,
      slug,
      ...expData
    });
  }, [slug]);

  if (!experiment) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center font-mono">
        <div className="bg-white p-8 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black text-xl">Loading Physics Lab Experiment...</p>
        </div>
      </div>
    );
  }

  const handleAddObservation = (obs) => {
    setObservations((prev) => [...prev, obs]);
  };

  const renderSimulation = () => {
    switch (experiment.simulationType) {
      case 'lens_convex':
        return <LensSimulator onAddObservation={handleAddObservation} />;
      case 'lens_concave':
        return <ConcaveLensSimulator onAddObservation={handleAddObservation} />;
      case 'ohms_law':
        return <OhmsLawSimulator onAddObservation={handleAddObservation} />;
      case 'series_parallel':
        return <SeriesParallelSimulator onAddObservation={handleAddObservation} />;
      case 'newton_motion':
        return <NewtonMotionSimulator onAddObservation={handleAddObservation} />;
      case 'work_energy':
        return <WorkEnergySimulator onAddObservation={handleAddObservation} />;
      case 'circuit_builder':
        return <SimpleCircuitSimulator onAddObservation={handleAddObservation} />;
      case 'sound_waves':
        return <SoundWavesSimulator onAddObservation={handleAddObservation} />;
      case 'glass_slab':
        return <GlassSlabSimulator onAddObservation={handleAddObservation} />;
      case 'induction':
        return <InductionSimulator onAddObservation={handleAddObservation} />;
      case 'magnetic_compass':
        return <MagneticEffectSimulator onAddObservation={handleAddObservation} />;
      case 'force_conductor':
        return <ForceConductorSimulator onAddObservation={handleAddObservation} />;
      case 'heat_transfer':
        return <HeatTransferSimulator onAddObservation={handleAddObservation} />;
      case 'reflection':
        return <ReflectionSimulator onAddObservation={handleAddObservation} />;
      default:
        return <LensSimulator onAddObservation={handleAddObservation} />;
    }
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
        return renderSimulation();
      case 'observations':
        return <ObservationSection columns={experiment.observationColumns} observations={observations} />;
      case 'graph':
        return <GraphSection observations={observations} simulationType={experiment.simulationType} />;
      case 'calculations':
        return <CalculationsSection observations={observations} />;
      case 'result':
        return <ResultSection observations={observations} />;
      case 'viva':
        return <VivaSection experimentId={experiment.id} />;
      default:
        return renderSimulation();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-amber-50 font-mono text-black">
      {/* Header Banner */}
      <div className="bg-yellow-300 border-b-4 border-black py-4 px-4 sm:px-6 lg:px-8 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-xs font-black uppercase text-black gap-2 mb-1">
              <Link to="/physicslab" className="hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Lab
              </Link>
              <ChevronRight size={14} />
              <Link to={`/physicslab/standard/${experiment.standard}`} className="hover:underline">
                Std {experiment.standard} Physics
              </Link>
              <ChevronRight size={14} />
              <span className="bg-black text-white px-2 py-0.5 rounded">{experiment.topic}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-black">{experiment.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-400 border-2 border-black px-3 py-1 font-black text-xs rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Maharashtra Board Std {experiment.standard}
            </span>
            <span className="bg-blue-300 border-2 border-black px-3 py-1 font-black text-xs rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {observations.length} Observations Recorded
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b-4 border-black sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-2 overflow-x-auto py-2" aria-label="Tabs">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-2 px-4 rounded-lg font-black text-sm border-2 border-black transition-all
                    ${isActive
                      ? 'bg-yellow-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]'
                      : 'bg-gray-100 hover:bg-yellow-100 text-gray-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'}
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
        {renderTabContent()}
      </div>
    </div>
  );
}
