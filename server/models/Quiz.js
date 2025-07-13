const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'vocabulary'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  answers: [{
    question: String,
    userAnswer: String,
    selectedAnswer: String, // Support both field names for compatibility
    correctAnswer: String,
    correct: Boolean,
    word: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
quizSchema.index({ userId: 1, timestamp: -1 });
quizSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Quiz', quizSchema); 