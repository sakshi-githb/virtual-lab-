import mongoose from 'mongoose';

const experimentAttemptSchema = new mongoose.Schema({
  experimentId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysicsExperiment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['started', 'in_progress', 'completed'], default: 'started' },
  score: { type: Number },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

export default mongoose.model('ExperimentAttempt', experimentAttemptSchema);
