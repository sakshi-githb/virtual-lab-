import mongoose from 'mongoose';

const vivaQuestionSchema = new mongoose.Schema({
  experimentId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysicsExperiment', required: true },
  question: { type: String, required: true },
  questionType: { type: String, enum: ['mcq', 'truefalse', 'short'], required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  explanation: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('VivaQuestion', vivaQuestionSchema);
