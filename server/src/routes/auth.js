import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate a signed JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token remains valid for 30 days
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user account
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all registration fields' });
    }

    // Check if the user already exists in our database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Encrypt the password using Bcrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save the user document
    const user = await User.create({
      name,
      email,
      passwordHash
    });

    // Generate session token
    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(`[Registration Error]: ${error.message}`);
    return res.status(500).json({ message: 'Server error during user registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user credentials & login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password credentials' });
    }

    // Locate the user document
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials, user not found' });
    }

    // Verify password by comparing incoming plaintext password to our stored Bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials, password mismatch' });
    }

    // Generate session token
    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(`[Login Error]: ${error.message}`);
    return res.status(500).json({ message: 'Server error during user login' });
  }
});

// @route   GET /api/auth/profile
// @desc    Fetch authenticated user metadata
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    // Locate user based on verified JWT req.user context (excluding hashed password)
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(`[Profile Fetch Error]: ${error.message}`);
    return res.status(500).json({ message: 'Server error during profile fetching' });
  }
});

export default router;
