import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';

import Standard from '../models/Standard.js';
import Topic from '../models/Topic.js';
import Chapter from '../models/Chapter.js';
import PhysicsExperiment from '../models/PhysicsExperiment.js';
import VivaQuestion from '../models/VivaQuestion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await Standard.deleteMany({});
    await Topic.deleteMany({});
    await Chapter.deleteMany({});
    await PhysicsExperiment.deleteMany({});
    await VivaQuestion.deleteMany({});

    // Standards
    const std9 = await Standard.create({ standardNumber: 9, name: 'Standard 9' });
    const std10 = await Standard.create({ standardNumber: 10, name: 'Standard 10' });

    // Topics
    const mechanics = await Topic.create({ name: 'Mechanics', slug: 'mechanics' });
    const workEnergy = await Topic.create({ name: 'Work & Energy', slug: 'work-energy' });
    const soundWaves = await Topic.create({ name: 'Sound & Waves', slug: 'sound-waves' });
    const heat = await Topic.create({ name: 'Heat', slug: 'heat' });
    const electricity = await Topic.create({ name: 'Electricity', slug: 'electricity' });
    const magnetism = await Topic.create({ name: 'Magnetism & Electromagnetism', slug: 'magnetism' });
    const optics = await Topic.create({ name: 'Light & Optics', slug: 'optics' });

    // Chapters
    const chMotion9 = await Chapter.create({ standardId: std9._id, topicId: mechanics._id, name: 'Laws of Motion', chapterNumber: 1 });
    const chWork9 = await Chapter.create({ standardId: std9._id, topicId: workEnergy._id, name: 'Work and Energy', chapterNumber: 2 });
    const chElec9 = await Chapter.create({ standardId: std9._id, topicId: electricity._id, name: 'Current Electricity', chapterNumber: 3 });
    const chSound9 = await Chapter.create({ standardId: std9._id, topicId: soundWaves._id, name: 'Study of Sound', chapterNumber: 4 });
    const chHeat9 = await Chapter.create({ standardId: std9._id, topicId: heat._id, name: 'Heat', chapterNumber: 5 });
    const chOptics9 = await Chapter.create({ standardId: std9._id, topicId: optics._id, name: 'Reflection of Light', chapterNumber: 11 });

    const chElec10 = await Chapter.create({ standardId: std10._id, topicId: electricity._id, name: 'Effects of Electric Current', chapterNumber: 4 });
    const chMag10 = await Chapter.create({ standardId: std10._id, topicId: magnetism._id, name: 'Electromagnetism', chapterNumber: 5 });
    const chRefraction10 = await Chapter.create({ standardId: std10._id, topicId: optics._id, name: 'Refraction of Light', chapterNumber: 6 });
    const chLenses10 = await Chapter.create({ standardId: std10._id, topicId: optics._id, name: 'Lenses', chapterNumber: 7 });

    // ==========================================
    // STD 9 EXPERIMENTS
    // ==========================================

    // 1. Newton's Motion
    const expMotion9 = await PhysicsExperiment.create({
      chapterId: chMotion9._id,
      standardId: std9._id,
      topicId: mechanics._id,
      title: "Force, Motion & Newton's Laws",
      slug: 'newton-motion',
      shortDescription: "Study Newton's Second Law of Motion F = ma.",
      aim: "To verify Newton's Second Law of Motion by measuring force, mass, and acceleration.",
      theory: "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass: F = ma.",
      apparatus: ['Linear Friction Track', 'Dynamics Cart', 'Slotted Masses', 'Spring Balance', 'Distance Scale', 'Digital Timer'],
      procedure: [
        'Place the dynamics cart on the friction track.',
        'Select the cart mass (m) and apply a pulled force (F) using the spring balance slider.',
        'Click Start Motion to release the cart.',
        'Note the measured acceleration (a) and time taken (t).',
        'Record readings into the observation table.',
        'Repeat for different values of mass and force to plot Force vs Acceleration.'
      ],
      formulas: [
        { label: 'Newton\'s 2nd Law', formula: 'F = m × a', description: 'Force equals mass times acceleration' },
        { label: 'Acceleration', formula: 'a = F / m', description: 'Acceleration calculation' }
      ],
      simulationType: 'newton_motion',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'mass', label: 'Mass m', unit: 'kg' },
        { key: 'force', label: 'Applied Force F', unit: 'N' },
        { key: 'acceleration', label: 'Acceleration a', unit: 'm/s²' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 20
    });

    const newtonQuestions = [
      {
        question: "What is the SI unit of Force?",
        questionType: "mcq",
        options: ["Newton (N)", "Joule (J)", "Pascal (Pa)", "Watt (W)"],
        correctAnswer: "Newton (N)",
        explanation: "The SI unit of force is the Newton (N), defined as 1 kg·m/s²."
      },
      {
        question: "If mass is doubled while keeping force constant, what happens to acceleration?",
        questionType: "mcq",
        options: ["It is halved", "It doubles", "It quadruples", "It stays the same"],
        correctAnswer: "It is halved",
        explanation: "From a = F/m, acceleration is inversely proportional to mass."
      }
    ];
    for (const q of newtonQuestions) await VivaQuestion.create({ experimentId: expMotion9._id, ...q });

    // 2. Work & Energy
    const expWork9 = await PhysicsExperiment.create({
      chapterId: chWork9._id,
      standardId: std9._id,
      topicId: workEnergy._id,
      title: 'Work & Energy',
      slug: 'work-energy',
      shortDescription: 'Calculate Work Done W = Fd, Kinetic Energy, and Potential Energy.',
      aim: 'To study the relationship between applied force, displacement, work done, and mechanical energy.',
      theory: 'Work is done when a force produces displacement in the direction of force: W = F × d. Potential Energy PE = mgh and Kinetic Energy KE = ½mv².',
      apparatus: ['Weighted Block', 'Horizontal/Vertical Surface', 'Spring Balance', 'Height Scale', 'Distance Meter'],
      procedure: [
        'Adjust the mass (m) of the object and height (h) or displacement distance (d).',
        'Push/lift the object across the surface.',
        'Observe the work done W = F × d and Potential Energy PE = mgh.',
        'Record the values into the observation table.'
      ],
      formulas: [
        { label: 'Work Done', formula: 'W = F × d', description: 'Work = Force × displacement' },
        { label: 'Potential Energy', formula: 'PE = m × g × h', description: 'Gravitational potential energy' },
        { label: 'Kinetic Energy', formula: 'KE = ½ × m × v²', description: 'Kinetic energy of motion' }
      ],
      simulationType: 'work_energy',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'mass', label: 'Mass m', unit: 'kg' },
        { key: 'force', label: 'Force F', unit: 'N' },
        { key: 'distance', label: 'Displacement d', unit: 'm' },
        { key: 'work', label: 'Work W', unit: 'J' }
      ],
      difficulty: 'easy',
      estimatedMinutes: 20
    });

    // 3. Simple Electric Circuit
    const expCircuit9 = await PhysicsExperiment.create({
      chapterId: chElec9._id,
      standardId: std9._id,
      topicId: electricity._id,
      title: 'Simple Electric Circuit',
      slug: 'simple-electric-circuit',
      shortDescription: 'Build and test a simple electric circuit with interactive switch and meters.',
      aim: 'To assemble a simple electric circuit and test open, closed, and short circuits.',
      theory: 'An electric circuit is a closed loop through which electric current flows driven by potential difference across a power source.',
      apparatus: ['Battery Cell (6V)', 'Switch Key', 'Light Bulb', 'Ammeter', 'Voltmeter', 'Connecting Wires'],
      procedure: [
        'Connect the battery positive terminal to the switch key.',
        'Connect the switch key to the lamp bulb.',
        'Connect the ammeter in series and voltmeter in parallel across the load.',
        'Toggle the switch ON/OFF and observe circuit status, current, and voltage readings.',
        'Record readings.'
      ],
      formulas: [
        { label: 'Power', formula: 'P = V × I', description: 'Electrical power' }
      ],
      simulationType: 'circuit_builder',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'state', label: 'Switch State', unit: '' },
        { key: 'voltage', label: 'Voltage V', unit: 'V' },
        { key: 'current', label: 'Current I', unit: 'A' }
      ],
      difficulty: 'easy',
      estimatedMinutes: 15
    });

    // 4. Sound & Wave Properties
    const expSound9 = await PhysicsExperiment.create({
      chapterId: chSound9._id,
      standardId: std9._id,
      topicId: soundWaves._id,
      title: 'Sound & Wave Properties',
      slug: 'sound-waves',
      shortDescription: 'Study wave frequency, amplitude, wavelength, and wave speed v = fλ.',
      aim: 'To analyze transverse/longitudinal sound wave parameters on a virtual oscilloscope.',
      theory: 'A wave transports energy through periodic oscillations. Wave velocity v is the product of frequency f and wavelength λ: v = f × λ.',
      apparatus: ['Signal Audio Generator', 'Virtual Oscilloscope Screen', 'Frequency Control Dial', 'Amplitude Control Dial'],
      procedure: [
        'Adjust the signal frequency slider (f in Hz).',
        'Adjust the wave amplitude slider (A in cm).',
        'Observe the dynamic waveform on the oscilloscope grid.',
        'Measure wavelength λ and period T = 1/f.',
        'Calculate wave speed v = f × λ and record observation.'
      ],
      formulas: [
        { label: 'Wave Speed', formula: 'v = f × λ', description: 'Velocity = frequency × wavelength' },
        { label: 'Time Period', formula: 'T = 1 / f', description: 'Period is reciprocal of frequency' }
      ],
      simulationType: 'sound_waves',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'frequency', label: 'Frequency f', unit: 'Hz' },
        { key: 'amplitude', label: 'Amplitude A', unit: 'cm' },
        { key: 'wavelength', label: 'Wavelength λ', unit: 'm' },
        { key: 'speed', label: 'Wave Speed v', unit: 'm/s' }
      ],
      difficulty: 'easy',
      estimatedMinutes: 20
    });

    // 5. Heat Transfer
    const expHeat9 = await PhysicsExperiment.create({
      chapterId: chHeat9._id,
      standardId: std9._id,
      topicId: heat._id,
      title: 'Heat Transfer',
      slug: 'heat-transfer',
      shortDescription: 'Demonstrate conduction, convection, and radiation modes of heat flow.',
      aim: 'To observe thermal energy transfer through conduction in metal rods, convection in fluids, and radiation.',
      theory: 'Heat transfers from higher temperature regions to lower temperature regions via conduction (direct particle collisions in solids), convection (fluid bulk movement), or thermal radiation.',
      apparatus: ['Bunsen Burner Heat Source', 'Metal Rods (Copper/Iron)', 'Thermometer Sensors', 'Liquid Convection Vessel', 'Digital Stopwatch'],
      procedure: [
        'Select the heat transfer mode (Conduction, Convection, or Radiation).',
        'Choose metal conductor rod material (Copper vs Iron).',
        'Turn on the heat burner.',
        'Observe thermal expansion and temperature rise at sensor locations along the rod over time.',
        'Record temperature T vs time t readings.'
      ],
      formulas: [],
      simulationType: 'heat_transfer',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'mode', label: 'Mode', unit: '' },
        { key: 'material', label: 'Material', unit: '' },
        { key: 'time', label: 'Time t', unit: 's' },
        { key: 'temp', label: 'Temp T', unit: '°C' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 20
    });

    // 6. Laws of Reflection
    const expReflection9 = await PhysicsExperiment.create({
      chapterId: chOptics9._id,
      standardId: std9._id,
      topicId: optics._id,
      title: 'Laws of Reflection',
      slug: 'laws-of-reflection',
      shortDescription: 'Verify the Laws of Reflection: Angle of Incidence equals Angle of Reflection.',
      aim: 'To verify that the angle of incidence (i) equals the angle of reflection (r) using a plane mirror.',
      theory: 'When light reflects off a smooth plane mirror, the incident ray, reflected ray, and normal line lie in the same plane, and the angle of incidence i equals the angle of reflection r.',
      apparatus: ['Plane Mirror', 'Laser Ray Box', 'Protractor Dial Scale', 'Optical Normal Axis'],
      procedure: [
        'Place the plane mirror along the normal baseline.',
        'Rotate the laser ray box slider to change the incident angle i.',
        'Observe the reflected ray along angle r.',
        'Record values of i and r.',
        'Verify that angle i = angle r.'
      ],
      formulas: [
        { label: 'Law of Reflection', formula: '∠i = ∠r', description: 'Angle of incidence equals angle of reflection' }
      ],
      simulationType: 'reflection',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'angle_i', label: 'Angle i', unit: 'deg' },
        { key: 'angle_r', label: 'Angle r', unit: 'deg' }
      ],
      difficulty: 'easy',
      estimatedMinutes: 15
    });

    // ==========================================
    // STD 10 EXPERIMENTS
    // ==========================================

    // 1. Ohm's Law
    const expOhms10 = await PhysicsExperiment.create({
      chapterId: chElec10._id,
      standardId: std10._id,
      topicId: electricity._id,
      title: "Ohm's Law",
      slug: 'ohms-law',
      shortDescription: 'Verify V = IR, wire electrical circuit, vary rheostat, and plot V-I graph.',
      aim: 'To verify Ohm\'s law and determine the electrical resistance of a given resistor.',
      theory: 'Ohm\'s Law states that the current flowing through a metallic conductor is directly proportional to the potential difference across its ends, provided physical conditions remain constant: V = IR.',
      apparatus: ['Variable DC Power Supply', 'Plug Key', 'Rheostat Slider', 'Unknown Resistor', 'Ammeter (Series)', 'Voltmeter (Parallel)'],
      procedure: [
        'Follow the guided wiring checklist: Connect Battery -> Key -> Rheostat -> Resistor -> Ammeter in series -> Voltmeter in parallel.',
        'Close the circuit plug key.',
        'Adjust the rheostat slider to vary current I.',
        'Read potential difference V on voltmeter and current I on ammeter.',
        'Record at least 5 trial readings into the observation table.',
        'Plot the V-I graph and calculate resistance R from the slope R = ΔV / ΔI.'
      ],
      formulas: [
        { label: "Ohm's Law", formula: 'V = I × R', description: 'Voltage = Current × Resistance' },
        { label: 'Resistance', formula: 'R = V / I', description: 'Resistance = Voltage / Current' }
      ],
      simulationType: 'ohms_law',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'voltage', label: 'Voltage V', unit: 'V' },
        { key: 'current', label: 'Current I', unit: 'A' },
        { key: 'resistance', label: 'Calculated R', unit: 'Ω' }
      ],
      difficulty: 'hard',
      estimatedMinutes: 30
    });

    const ohmsQuestions = [
      {
        question: "How should a voltmeter be connected in a circuit to measure voltage across a resistor?",
        questionType: "mcq",
        options: ["In Parallel", "In Series", "Anywhere", "Across power supply only"],
        correctAnswer: "In Parallel",
        explanation: "A voltmeter has high resistance and must be connected in parallel across the load so it doesn't restrict current flow."
      },
      {
        question: "What does the slope of a V vs I graph represent?",
        questionType: "mcq",
        options: ["Resistance (R)", "Power (P)", "Charge (Q)", "Capacitance (C)"],
        correctAnswer: "Resistance (R)",
        explanation: "Since V = IR, the slope ΔV / ΔI equals the resistance R."
      }
    ];
    for (const q of ohmsQuestions) await VivaQuestion.create({ experimentId: expOhms10._id, ...q });

    // 2. Resistance Series & Parallel
    const expSeriesParallel10 = await PhysicsExperiment.create({
      chapterId: chElec10._id,
      standardId: std10._id,
      topicId: electricity._id,
      title: 'Resistance in Series & Parallel',
      slug: 'resistance-series-parallel',
      shortDescription: 'Compare equivalent resistance in Series (Rs = R1+R2) and Parallel (1/Rp = 1/R1+1/R2).',
      aim: 'To verify equivalent resistance for resistors connected in series and parallel combinations.',
      theory: 'In series, total resistance Rs = R1 + R2. In parallel, reciprocal of equivalent resistance 1/Rp = 1/R1 + 1/R2.',
      apparatus: ['DC Power Supply', 'Resistors R1 and R2', 'Switch', 'Digital Ammeter', 'Digital Voltmeter'],
      procedure: [
        'Select connection configuration (Series or Parallel).',
        'Set values for resistor R1 and R2.',
        'Close the switch.',
        'Measure total voltage V and total current I.',
        'Calculate equivalent resistance Req = V / I and compare with theoretical formula values.'
      ],
      formulas: [
        { label: 'Series Resistance', formula: 'Rs = R1 + R2', description: 'Sum of resistances in series' },
        { label: 'Parallel Resistance', formula: '1/Rp = 1/R1 + 1/R2', description: 'Reciprocal sum in parallel' }
      ],
      simulationType: 'series_parallel',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'mode', label: 'Circuit Mode', unit: '' },
        { key: 'r1', label: 'R1', unit: 'Ω' },
        { key: 'r2', label: 'R2', unit: 'Ω' },
        { key: 'req', label: 'Measured Req', unit: 'Ω' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 25
    });

    // 3. Magnetic Effect of Electric Current
    const expMag10 = await PhysicsExperiment.create({
      chapterId: chMag10._id,
      standardId: std10._id,
      topicId: magnetism._id,
      title: 'Magnetic Effect of Electric Current',
      slug: 'magnetic-effect-electric-current',
      shortDescription: "Observe Oersted's experiment: magnetic field deflection around current wire.",
      aim: 'To observe magnetic field lines and compass deflection around a current-carrying straight conductor.',
      theory: 'An electric current flowing through a conductor creates a concentric magnetic field around it according to the Right-Hand Thumb Rule.',
      apparatus: ['Copper Wire Conductor', 'Battery Unit', 'Reversing Switch', 'Magnetic Compass Needle', 'Cardboard Platform'],
      procedure: [
        'Set up the straight conductor wire over the magnetic compass needle.',
        'Switch current ON.',
        'Observe compass needle deflection direction.',
        'Reverse the current direction using the reversing switch.',
        'Observe that compass deflection reverses direction in accordance with Right-Hand Thumb Rule.'
      ],
      formulas: [],
      simulationType: 'magnetic_compass',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'current_state', label: 'Current State', unit: '' },
        { key: 'direction', label: 'Current Direction', unit: '' },
        { key: 'deflection', label: 'Compass Deflection', unit: '' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 20
    });

    // 4. Force on Current Conductor
    const expForceConductor10 = await PhysicsExperiment.create({
      chapterId: chMag10._id,
      standardId: std10._id,
      topicId: magnetism._id,
      title: 'Force on a Current-Carrying Conductor',
      slug: 'force-current-conductor',
      shortDescription: 'Demonstrate force on conductor in magnetic field & Fleming\'s Left-Hand Rule.',
      aim: 'To observe magnetic force on a current-carrying rod inside a magnetic field.',
      theory: 'A current-carrying conductor placed in a magnetic field experiences a mechanical force perpendicular to both current and magnetic field, predicted by Fleming\'s Left-Hand Rule.',
      apparatus: ['Horseshoe Magnet', 'Suspended Copper Conductor Rod', 'DC Battery Source', 'Polarity Reversing Switch'],
      procedure: [
        'Place the conductor rod between the poles (North-South) of the horseshoe magnet.',
        'Switch current ON.',
        'Observe rod displacement direction.',
        'Reverse current or magnet polarity.',
        'Verify direction shift using Fleming\'s Left-Hand Rule visualizer.'
      ],
      formulas: [],
      simulationType: 'force_conductor',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'field_dir', label: 'Magnetic Field', unit: '' },
        { key: 'current_dir', label: 'Current Direction', unit: '' },
        { key: 'force_dir', label: 'Force Direction', unit: '' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 20
    });

    // 5. Electromagnetic Induction
    const expInduction10 = await PhysicsExperiment.create({
      chapterId: chMag10._id,
      standardId: std10._id,
      topicId: magnetism._id,
      title: 'Electromagnetic Induction',
      slug: 'electromagnetic-induction',
      shortDescription: 'Induce electric current by moving bar magnet relative to coil (Faraday & Lenz Law).',
      aim: 'To study electromagnetic induction and induced current magnitude using a bar magnet and coil.',
      theory: 'Faraday\'s Law of Electromagnetic Induction states that a changing magnetic flux through a coil induces an electromotive force (EMF). Lenz\'s Law dictates the direction of induced current.',
      apparatus: ['Copper Wire Coil', 'Bar Magnet (N-S)', 'Center-Zero Galvanometer', 'Speed Slider'],
      procedure: [
        'Move the bar magnet towards the coil.',
        'Observe galvanometer needle deflection.',
        'Hold magnet stationary inside coil — notice zero deflection.',
        'Pull magnet away from coil — notice needle deflects in opposite direction.',
        'Vary motion speed (slow vs fast) and observe relative magnitude of deflection.'
      ],
      formulas: [],
      simulationType: 'induction',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'magnet_motion', label: 'Magnet Motion', unit: '' },
        { key: 'speed', label: 'Speed', unit: '' },
        { key: 'deflection', label: 'Galvanometer Deflection', unit: '' }
      ],
      difficulty: 'hard',
      estimatedMinutes: 25
    });

    // 6. Refraction through Glass Slab
    const expGlassSlab10 = await PhysicsExperiment.create({
      chapterId: chRefraction10._id,
      standardId: std10._id,
      topicId: optics._id,
      title: 'Refraction Through Glass Slab',
      slug: 'refraction-glass-slab',
      shortDescription: 'Trace ray paths through rectangular glass slab & calculate refractive index Snell Law.',
      aim: 'To trace the path of a ray of light passing through a rectangular glass slab and measure angle of incidence i, refraction r, and emergence e.',
      theory: 'Light bends towards the normal when traveling from rare (air) to denser (glass) medium according to Snell\'s Law: n = sin(i) / sin(r). Emergent ray is parallel to incident ray (i = e).',
      apparatus: ['Rectangular Glass Slab', 'Laser Ray Box', 'Protractor Dial', 'Drawing Board Grid'],
      procedure: [
        'Place glass slab on grid.',
        'Adjust laser box to set incident angle i.',
        'Observe refracted ray angle r inside glass and emergent ray angle e in air.',
        'Measure lateral displacement.',
        'Verify Snell\'s Law n = sin(i) / sin(r) and check that i = e.'
      ],
      formulas: [
        { label: 'Snell\'s Law', formula: 'n = sin(i) / sin(r)', description: 'Refractive index' },
        { label: 'Emergent Angle', formula: '∠i = ∠e', description: 'Incident angle equals emergent angle' }
      ],
      simulationType: 'glass_slab',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'angle_i', label: 'Angle i', unit: 'deg' },
        { key: 'angle_r', label: 'Angle r', unit: 'deg' },
        { key: 'angle_e', label: 'Angle e', unit: 'deg' },
        { key: 'index_n', label: 'Calculated n', unit: '' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 25
    });

    // 7. Convex Lens Image Formation
    const expConvexLens10 = await PhysicsExperiment.create({
      chapterId: chLenses10._id,
      standardId: std10._id,
      topicId: optics._id,
      title: 'Convex Lens — Image Formation',
      slug: 'convex-lens-image-formation',
      shortDescription: 'Study image formation by convex lens: object beyond 2F, at 2F, F, & between F and O.',
      aim: 'To study the nature, position and relative size of the image formed by a convex lens.',
      theory: 'A convex lens is a converging optical lens. Image formation satisfies the lens formula 1/f = 1/v - 1/u using Cartesian Sign Convention.',
      apparatus: ['Optical Bench', 'Convex Lens Stand', 'Candle Object', 'Image Screen', 'Meter Scale'],
      procedure: [
        'Set focal length f.',
        'Adjust object position u (e.g. beyond 2F, at 2F, between F and 2F, at F, or between F and O).',
        'Move screen slider to locate sharp image position v.',
        'Observe image properties (real/virtual, erect/inverted, magnified/diminished).',
        'Record readings and verify 1/f = 1/v - 1/u in Calculations.'
      ],
      formulas: [
        { label: 'Lens Formula', formula: '1/f = 1/v - 1/u', description: 'Lens formula' },
        { label: 'Magnification', formula: 'm = v / u', description: 'Magnification' }
      ],
      simulationType: 'lens_convex',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'u', label: 'Object Dist u', unit: 'cm' },
        { key: 'v', label: 'Image Dist v', unit: 'cm' },
        { key: 'f', label: 'Focal Length f', unit: 'cm' },
        { key: 'nature', label: 'Nature', unit: '' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 30
    });

    const convexQuestions = [
      {
        question: "What type of image is formed by a convex lens when object is between F and O?",
        questionType: "mcq",
        options: ["Virtual, erect and magnified", "Real, inverted and magnified", "Real, inverted and diminished", "Virtual, erect and diminished"],
        correctAnswer: "Virtual, erect and magnified",
        explanation: "When object is placed between focus F and optical centre O, rays diverge and appear to form a virtual, erect, magnified image on the same side."
      }
    ];
    for (const q of convexQuestions) await VivaQuestion.create({ experimentId: expConvexLens10._id, ...q });

    // 8. Concave Lens Image Formation
    const expConcaveLens10 = await PhysicsExperiment.create({
      chapterId: chLenses10._id,
      standardId: std10._id,
      topicId: optics._id,
      title: 'Concave Lens — Image Formation',
      slug: 'concave-lens-image-formation',
      shortDescription: 'Study image formation by concave lens (always virtual, erect, & diminished).',
      aim: 'To observe image formation and virtual ray paths for a concave diverging lens.',
      theory: 'A concave lens always forms a virtual, erect, and diminished image on the same side of the lens as the object, regardless of object distance.',
      apparatus: ['Optical Bench', 'Concave Lens Stand', 'Object Pin', 'Virtual Ray Tracing Screen'],
      procedure: [
        'Mount concave lens on bench.',
        'Vary object distance u along optical scale.',
        'Observe virtual diverging rays extending backwards to form virtual image at v.',
        'Note that image is always virtual, erect, and diminished.',
        'Record values of u, v, f.'
      ],
      formulas: [
        { label: 'Lens Formula', formula: '1/f = 1/v - 1/u', description: 'Lens formula (f is negative)' }
      ],
      simulationType: 'lens_concave',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'u', label: 'Object Dist u', unit: 'cm' },
        { key: 'v', label: 'Image Dist v', unit: 'cm' },
        { key: 'f', label: 'Focal Length f', unit: 'cm' },
        { key: 'nature', label: 'Nature', unit: '' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 20
    });

    console.log('Seed database completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
