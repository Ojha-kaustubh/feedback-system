import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    trim: true,
    minlength: [10, 'Feedback message must be at least 10 characters long']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, for anonymous feedback
  }
}, {
  timestamps: true
});

// Index for better query performance
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ user: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback; 