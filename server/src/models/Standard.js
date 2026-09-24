import mongoose from 'mongoose';

const standardSchema = new mongoose.Schema({
  standardNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  board: {
    type: String,
    default: 'Maharashtra State Board'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Standard', standardSchema);
