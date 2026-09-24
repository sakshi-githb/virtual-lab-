import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  standardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Standard',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Chapter', chapterSchema);
