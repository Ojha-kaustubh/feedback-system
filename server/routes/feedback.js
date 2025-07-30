import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, admin } from '../middleware/auth.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// @route   POST /api/feedback
// @desc    Create new feedback
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('message')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Feedback message must be at least 10 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, rating, message } = req.body;
    
    // Create feedback object
    const feedbackData = {
      name,
      email,
      rating,
      message
    };

    // If user is authenticated, add user reference
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        feedbackData.user = decoded.id;
      } catch (error) {
        // Token is invalid, continue without user reference
        console.log('Invalid token, creating anonymous feedback');
      }
    }

    const feedback = await Feedback.create(feedbackData);
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.json({
      feedback,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/feedback/public
// @desc    Get public feedback (no auth required)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find()
      .select('name rating message createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.json({
      feedback,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get public feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    await feedback.deleteOne();
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/feedback/stats
// @desc    Get feedback statistics (admin only)
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const avgRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    const ratingDistribution = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalFeedback,
      avgRating: avgRating[0]?.avgRating || 0,
      ratingDistribution,
      recentFeedback
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 