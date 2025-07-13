const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  word: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['sinhala', 'tamil', 'english'],
    required: true
  },
  targetLanguage: {
    type: String,
    enum: ['sinhala', 'tamil', 'english'],
    required: true
  },
  // Spaced repetition fields
  interval: {
    type: Number,
    default: 1 // days until next review
  },
  repetitions: {
    type: Number,
    default: 0
  },
  easeFactor: {
    type: Number,
    default: 2.5
  },
  nextReview: {
    type: Date,
    default: Date.now
  },
  // Additional metadata
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'general'
  },
  exampleSentence: String,
  pronunciation: String,
  notes: String,
  // Learning progress
  masteryLevel: {
    type: Number,
    default: 0 // 0-5 scale
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  reviewHistory: [{
    date: { type: Date, default: Date.now },
    result: { type: String, enum: ['again', 'hard', 'good', 'easy'] },
    timeSpent: Number // seconds
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
flashcardSchema.index({ userId: 1, nextReview: 1 });
flashcardSchema.index({ userId: 1, language: 1, targetLanguage: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema); 