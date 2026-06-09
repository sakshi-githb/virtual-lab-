import mongoose from 'mongoose';

const bodySchema = new mongoose.Schema({
  syncId: { type: String, required: true },
  labelName: { type: String, default: 'Rigid Body' },
  shapeType: { type: String, enum: ['box', 'circle', 'polygon'], required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number },
  height: { type: Number },
  radius: { type: Number },
  sides: { type: Number },
  mass: { type: Number, required: true },
  friction: { type: Number, required: true },
  restitution: { type: Number, required: true },
  vx: { type: Number, default: 0 },
  vy: { type: Number, default: 0 },
  angle: { type: Number, default: 0 },
  isStatic: { type: Boolean, default: false },
  color: { type: String, default: '#FACC15' }
});

const experimentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Experiment title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  gravityY: {
    type: Number,
    default: 1.0
  },
  bodies: [bodySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index on creator and createdAt
experimentSchema.index({ creator: 1, createdAt: -1 });

export default mongoose.model('Experiment', experimentSchema);
