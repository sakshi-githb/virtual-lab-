import express from 'express';
import Experiment from '../models/Experiment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/experiments
// @desc    Create/Save a new physics layout state
// @access  Private (Registered members)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description = '', gravityY = 1.0, bodies = [], constraints = [] } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Experiment title is required' });
    }

    const newExperiment = await Experiment.create({
      title,
      description,
      creator: req.user.id,
      gravityY,
      bodies,
      constraints
    });

    return res.status(201).json({
      message: 'Experiment saved successfully',
      experiment: newExperiment
    });
  } catch (error) {
    console.error(`[Save Experiment Error]: ${error.message}`);
    return res.status(500).json({ message: 'Server error saving experiment layout' });
  }
});

// @route   GET /api/experiments
// @desc    Get all saved experiments for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const experiments = await Experiment.find({ creator: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(experiments);
  } catch (error) {
    console.error(`[Fetch Experiments Error]: ${error.message}`);
    return res.status(500).json({ message: 'Server error retrieving experiment list' });
  }
});

// @route   DELETE /api/experiments/:id
// @desc    Delete a specific saved experiment by ID
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: 'Experiment layout not found' });
    }

    // Verify creator authority
    if (experiment.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Unauthorized deletion request' });
    }

    await Experiment.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Experiment deleted successfully' });
  } catch (error) {
    console.error(`[Delete Experiment Error]: ${error.message}`);
    return res.status(500).json({ message: 'Server error erasing experiment layout' });
  }
});

export default router;
