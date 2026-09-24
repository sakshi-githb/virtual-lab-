import mongoose from 'mongoose';

const vivaAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  experimentId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysicsExperiment', required: true },
  score: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'VivaQuestion' },
    userAnswer: String,
    isCorrect: Boolean
  }],
  attemptedAt: { type: Date, default: Date.now }
});

export default mongoose.model('VivaAttempt', vivaAttemptSchema);
