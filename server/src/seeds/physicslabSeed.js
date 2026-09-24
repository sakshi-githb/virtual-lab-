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
    console.log('Connected to DB');

    await Standard.deleteMany({});
    await Topic.deleteMany({});
    await Chapter.deleteMany({});
    await PhysicsExperiment.deleteMany({});
    await VivaQuestion.deleteMany({});

    // Standards
    const std9 = await Standard.create({ standardNumber: 9, name: 'Standard 9' });
    const std10 = await Standard.create({ standardNumber: 10, name: 'Standard 10' });

    // Topics
    const optics = await Topic.create({ name: 'Optics', slug: 'optics' });
    const electricity = await Topic.create({ name: 'Electricity', slug: 'electricity' });
    const magnetism = await Topic.create({ name: 'Electricity and Magnetism', slug: 'electricity-and-magnetism' });

    // Chapters
    const chOptics10 = await Chapter.create({ standardId: std10._id, topicId: optics._id, name: 'Lenses', chapterNumber: 7 });
    const chElec9 = await Chapter.create({ standardId: std9._id, topicId: electricity._id, name: 'Current Electricity', chapterNumber: 3 });
    const chOptics9 = await Chapter.create({ standardId: std9._id, topicId: optics._id, name: 'Reflection of Light', chapterNumber: 11 });
    const chMag10 = await Chapter.create({ standardId: std10._id, topicId: magnetism._id, name: 'Effects of Electric Current', chapterNumber: 4 });

    // EXPERIMENT 1: Convex Lens Image Formation
    const exp1 = await PhysicsExperiment.create({
      chapterId: chOptics10._id,
      standardId: std10._id,
      topicId: optics._id,
      title: 'Convex Lens Image Formation',
      slug: 'convex-lens-image-formation',
      shortDescription: 'Study the image formation by a convex lens.',
      aim: 'To study the nature, position and relative size of the image formed by a convex lens.',
      theory: 'Explain convex lens, focal length, image formation, Cartesian sign convention',
      apparatus: ['Convex Lens', 'Optical Bench', 'Illuminated Object', 'Screen'],
      procedure: ['Place the lens on the bench.', 'Adjust the object distance (u).', 'Move the screen to get a sharp image (v).', 'Record u and v.', 'Repeat for different values of u.'],
      formulas: [
        { label: 'Lens Formula', formula: '1/f = 1/v - 1/u', description: 'Relationship between focal length, image distance, and object distance' },
        { label: 'Magnification', formula: 'm = v/u', description: 'Linear magnification' }
      ],
      simulationType: 'lens_convex',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'u', label: 'u', unit: 'cm' },
        { key: 'v', label: 'v', unit: 'cm' },
        { key: 'f', label: 'f', unit: 'cm' },
        { key: 'nature', label: 'Nature of Image', unit: '' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 30
    });

    const convexLensQuestions = [
      {
        question: 'What type of image is formed by a convex lens when the object is placed between focus (F₁) and optical centre (O)?',
        questionType: 'mcq',
        options: ['Virtual, erect and magnified', 'Real, inverted and magnified', 'Real, inverted and diminished', 'Virtual, erect and diminished'],
        correctAnswer: 'Virtual, erect and magnified',
        explanation: 'When an object is placed between the optical centre O and principal focus F₁ of a convex lens, the refracted rays diverge and appear to meet on the same side, forming a virtual, erect, and magnified image.'
      },
      {
        question: 'Where is the image formed when an object is placed at 2F₁ of a convex lens?',
        questionType: 'mcq',
        options: ['At 2F₂, real, inverted and same size', 'At F₂, real and diminished', 'Beyond 2F₂, real and magnified', 'At infinity'],
        correctAnswer: 'At 2F₂, real, inverted and same size',
        explanation: 'When an object is at 2F₁, light rays converge on the opposite side at 2F₂ to form a real, inverted image of the exact same size as the object (magnification m = -1).'
      },
      {
        question: 'According to Cartesian sign convention, the focal length of a convex lens is always taken as positive.',
        questionType: 'truefalse',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Since the principal focus of a convex lens lies on the right side of the optical centre (in the direction of incident light), its focal length f is always positive.'
      },
      {
        question: 'What is the correct lens formula relating focal length (f), object distance (u), and image distance (v)?',
        questionType: 'mcq',
        options: ['1/f = 1/v - 1/u', '1/f = 1/v + 1/u', '1/f = 1/u - 1/v', 'f = v - u'],
        correctAnswer: '1/f = 1/v - 1/u',
        explanation: 'The lens formula is 1/f = 1/v - 1/u. Note that it differs from the mirror formula (1/f = 1/v + 1/u).'
      },
      {
        question: 'A ray of light passing through the optical centre (O) of a convex lens will:',
        questionType: 'mcq',
        options: ['Pass undeviated without any refraction', 'Pass through focus F₂', 'Reflect back along the same path', 'Become parallel to the principal axis'],
        correctAnswer: 'Pass undeviated without any refraction',
        explanation: 'The optical centre O is the central point on the principal axis such that rays passing through it emerge without suffering any net deviation.'
      },
      {
        question: 'If the magnification (m) produced by a lens is -2, what is the nature and relative size of the image?',
        questionType: 'mcq',
        options: ['Real, inverted and magnified', 'Virtual, erect and magnified', 'Real, inverted and diminished', 'Virtual, erect and diminished'],
        correctAnswer: 'Real, inverted and magnified',
        explanation: 'A negative sign in magnification indicates a real and inverted image. |m| = 2 > 1 means the image is magnified to twice the object height.'
      },
      {
        question: 'A convex lens is also known as a converging lens because it converges parallel rays of light to a single point called the principal focus.',
        questionType: 'truefalse',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Convex lenses cause parallel incident light rays to bend inwards and converge at a single focus point F₂.'
      },
      {
        question: 'An object is placed at u = -30 cm in front of a convex lens of focal length f = +20 cm. What is the calculated image distance (v)?',
        questionType: 'mcq',
        options: ['+60 cm', '-60 cm', '+30 cm', '+12 cm'],
        correctAnswer: '+60 cm',
        explanation: 'Using 1/f = 1/v - 1/u: 1/20 = 1/v - (1/-30) => 1/20 = 1/v + 1/30 => 1/v = 1/20 - 1/30 = (3-2)/60 = 1/60 => v = +60 cm.'
      }
    ];

    for (const qData of convexLensQuestions) {
      await VivaQuestion.create({
        experimentId: exp1._id,
        ...qData
      });
    }

    // EXPERIMENT 2: Ohm's Law
    const exp2 = await PhysicsExperiment.create({
      chapterId: chElec9._id,
      standardId: std9._id,
      topicId: electricity._id,
      title: 'Ohm\'s Law',
      slug: 'ohms-law',
      shortDescription: 'Verify Ohm\'s Law for a given resistor.',
      aim: 'To verify Ohm\'s law and find the resistance of a given wire.',
      theory: 'Explain Ohm\'s Law, resistance, voltage, current relationship',
      apparatus: ['Voltmeter', 'Ammeter', 'Resistor', 'Battery', 'Rheostat'],
      procedure: ['Connect the circuit as shown in the diagram.', 'Vary the rheostat to change the current.', 'Record the voltmeter and ammeter readings.', 'Calculate V/I.'],
      formulas: [
        { label: 'Ohm\'s Law', formula: 'V = IR', description: 'Voltage equals current times resistance' },
        { label: 'Resistance', formula: 'R = V/I', description: 'Resistance calculation' }
      ],
      simulationType: 'ohms_law',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'voltage', label: 'Voltage V', unit: 'V' },
        { key: 'current', label: 'Current I', unit: 'A' },
        { key: 'resistance', label: 'Resistance R', unit: 'Ohm' }
      ],
      difficulty: 'medium',
      estimatedMinutes: 20
    });

    for (let i=1; i<=8; i++) {
      await VivaQuestion.create({
        experimentId: exp2._id,
        question: `Ohm's Law Question ${i}`,
        questionType: 'mcq',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: 'Because it is the right answer.'
      });
    }

    // EXPERIMENT 3: Laws of Reflection
    const exp3 = await PhysicsExperiment.create({
      chapterId: chOptics9._id,
      standardId: std9._id,
      topicId: optics._id,
      title: 'Laws of Reflection',
      slug: 'laws-of-reflection',
      shortDescription: 'Verify the laws of reflection of light.',
      aim: 'To verify the laws of reflection of light using a plane mirror.',
      theory: 'Explain laws of reflection, plane mirror, normal, angles',
      apparatus: ['Plane Mirror', 'Drawing Board', 'Pins', 'Protractor'],
      procedure: ['Draw a normal on paper.', 'Place the mirror on the line.', 'Place two pins on the incident ray.', 'Look at the image and place two more pins on the reflected ray.', 'Measure the angles.'],
      formulas: [
        { label: 'Law of Reflection', formula: 'Angle i = Angle r', description: 'Angle of incidence equals angle of reflection' }
      ],
      simulationType: 'reflection',
      observationColumns: [
        { key: 'trial', label: 'Trial', unit: '' },
        { key: 'angle_i', label: 'Angle of Incidence', unit: 'deg' },
        { key: 'angle_r', label: 'Angle of Reflection', unit: 'deg' }
      ],
      difficulty: 'easy',
      estimatedMinutes: 25
    });

    for (let i=1; i<=6; i++) {
      await VivaQuestion.create({
        experimentId: exp3._id,
        question: `Reflection Question ${i}`,
        questionType: 'mcq',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: 'Because it is the right answer.'
      });
    }

    // EXPERIMENT 4: Simple Electric Circuit
    const exp4 = await PhysicsExperiment.create({
      chapterId: chElec9._id,
      standardId: std9._id,
      topicId: electricity._id,
      title: 'Simple Electric Circuit',
      slug: 'simple-electric-circuit',
      shortDescription: 'Build and understand a simple electric circuit.',
      aim: 'To construct a simple electric circuit and understand the role of its components.',
      theory: 'Explain circuit, components, open/closed circuit, conductors',
      apparatus: ['Battery', 'Bulb', 'Switch', 'Connecting Wires'],
      procedure: ['Connect the battery to the switch.', 'Connect the switch to the bulb.', 'Connect the bulb back to the battery.', 'Close the switch and observe the bulb.'],
      formulas: [],
      simulationType: 'circuit_builder',
      observationColumns: [],
      difficulty: 'easy',
      estimatedMinutes: 15
    });

    for (let i=1; i<=6; i++) {
      await VivaQuestion.create({
        experimentId: exp4._id,
        question: `Circuit Question ${i}`,
        questionType: 'mcq',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: 'Because it is the right answer.'
      });
    }

    // EXPERIMENT 5: Magnetic Effect of Electric Current
    const exp5 = await PhysicsExperiment.create({
      chapterId: chMag10._id,
      standardId: std10._id,
      topicId: magnetism._id,
      title: 'Magnetic Effect of Electric Current',
      slug: 'magnetic-effect-electric-current',
      shortDescription: 'Observe the magnetic field produced by an electric current.',
      aim: 'To study the magnetic field produced by a straight current-carrying conductor.',
      theory: 'Oersted\'s experiment, magnetic field around current-carrying wire, right-hand rule',
      apparatus: ['Copper Wire', 'Battery', 'Magnetic Compass', 'Switch'],
      procedure: ['Set up a straight wire passing through a cardboard.', 'Place a compass on the cardboard.', 'Pass current through the wire.', 'Observe the deflection in the compass needle.'],
      formulas: [],
      simulationType: 'magnetic_compass',
      observationColumns: [],
      difficulty: 'medium',
      estimatedMinutes: 20
    });

    for (let i=1; i<=7; i++) {
      await VivaQuestion.create({
        experimentId: exp5._id,
        question: `Magnetic Effect Question ${i}`,
        questionType: 'mcq',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: 'Because it is the right answer.'
      });
    }

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
