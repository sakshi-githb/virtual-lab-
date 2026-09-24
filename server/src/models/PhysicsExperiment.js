import mongoose from 'mongoose';

const formulaSchema = new mongoose.Schema({
  label: String,
  formula: String,
  description: String
}, { _id: false });

const observationColumnSchema = new mongoose.Schema({
  key: String,
  label: String,
  unit: String
}, { _id: false });

const physicsExperimentSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  standardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Standard' },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: String,
  aim: String,
  theory: String,
  apparatus: [String],
  procedure: [String],
  formulas: [formulaSchema],
  simulationType: String,
  observationColumns: [observationColumnSchema],
  resultTemplate: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  estimatedMinutes: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('PhysicsExperiment', physicsExperimentSchema);
