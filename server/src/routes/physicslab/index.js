import express from 'express';
import { protect } from '../../middleware/auth.js';
import Standard from '../../models/Standard.js';
import Topic from '../../models/Topic.js';
import PhysicsExperiment from '../../models/PhysicsExperiment.js';
import ExperimentAttempt from '../../models/ExperimentAttempt.js';
import ObservationRecord from '../../models/ObservationRecord.js';
import VivaQuestion from '../../models/VivaQuestion.js';
import VivaAttempt from '../../models/VivaAttempt.js';

const router = express.Router();

router.get('/standards', async (req, res) => {
  try {
    const standards = await Standard.find();
    res.json(standards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/experiments', async (req, res) => {
  try {
    const { standard, topic } = req.query;
    const filter = {};
    if (standard) {
      const std = await Standard.findOne({ standardNumber: standard });
      if (std) filter.standardId = std._id;
    }
    if (topic) {
      const top = await Topic.findOne({ name: new RegExp('^' + topic + '$', 'i') });
      if (top) filter.topicId = top._id;
    }
    const experiments = await PhysicsExperiment.find(filter).populate('standardId').populate('topicId').populate('chapterId');
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/experiments/:slug', async (req, res) => {
  try {
    const experiment = await PhysicsExperiment.findOne({ slug: req.params.slug })
      .populate('standardId')
      .populate('topicId')
      .populate('chapterId');
    if (!experiment) return res.status(404).json({ message: 'Experiment not found' });
    res.json(experiment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (err) {
    // ignore invalid token in optional auth
  }
  next();
};

router.post('/experiments/:id/attempts', optionalAuth, async (req, res) => {
  try {
    const { status, score } = req.body;
    const userId = req.user ? req.user.id : null;
    let attempt = null;
    if (userId) {
      attempt = await ExperimentAttempt.findOne({ experimentId: req.params.id, userId });
      if (!attempt) {
        attempt = await ExperimentAttempt.create({ experimentId: req.params.id, userId, status: status || 'started' });
      } else {
        if (status) attempt.status = status;
        if (score !== undefined) attempt.score = score;
        if (status === 'completed' && !attempt.completedAt) attempt.completedAt = Date.now();
        await attempt.save();
      }
    }
    res.json(attempt || { status: status || 'started' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/experiments/:id/observations', optionalAuth, async (req, res) => {
  try {
    const { data } = req.body;
    const userId = req.user ? req.user.id : null;
    const record = await ObservationRecord.create({
      experimentId: req.params.id,
      userId,
      data
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/experiments/:id/viva', async (req, res) => {
  try {
    const { includeAnswers } = req.query;
    let query = VivaQuestion.find({ experimentId: req.params.id });
    if (!includeAnswers) {
      query = query.select('-correctAnswer -explanation');
    }
    const questions = await query;
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/viva/:experimentId/submit', optionalAuth, async (req, res) => {
  try {
    const { answers } = req.body; // array of { questionId, userAnswer }
    const questions = await VivaQuestion.find({ experimentId: req.params.experimentId });

    let score = 0;
    const processedAnswers = (answers || []).map(ans => {
      const q = questions.find(q => q._id.toString() === ans.questionId);
      const isCorrect = q && q.correctAnswer === ans.userAnswer;
      if (isCorrect) score++;
      return {
        questionId: ans.questionId,
        userAnswer: ans.userAnswer,
        isCorrect,
        correctAnswer: q ? q.correctAnswer : '',
        explanation: q ? q.explanation : ''
      };
    });

    const userId = req.user ? req.user.id : null;
    let attempt = null;
    if (userId) {
      attempt = await VivaAttempt.create({
        userId,
        experimentId: req.params.experimentId,
        score,
        answers: processedAnswers
      });
    }

    res.json({ attempt, score, total: questions.length, answers: processedAnswers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/progress', protect, async (req, res) => {
  try {
    const attempts = await ExperimentAttempt.find({ userId: req.user.id }).populate('experimentId');
    const vivaAttempts = await VivaAttempt.find({ userId: req.user.id });
    res.json({ attempts, vivaAttempts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
