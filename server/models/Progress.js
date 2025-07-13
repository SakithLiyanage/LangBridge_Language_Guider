const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Learning path progress
  currentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  xpPoints: {
    type: Number,
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  // Course progress
  courseProgress: {
    sinhala: {
      completedLessons: [String],
      currentLesson: String,
      overallProgress: { type: Number, default: 0 }
    },
    english: {
      completedLessons: [String],
      currentLesson: String,
      overallProgress: { type: Number, default: 0 }
    },
    tamil: {
      completedLessons: [String],
      currentLesson: String,
      overallProgress: { type: Number, default: 0 }
    }
  },
  // Achievements and badges
  achievements: [{
    id: String,
    name: String,
    description: String,
    earnedAt: { type: Date, default: Date.now },
    icon: String
  }],
  // Learning goals
  goals: {
    dailyTarget: { type: Number, default: 10 }, // minutes
    weeklyTarget: { type: Number, default: 60 }, // minutes
    vocabularyTarget: { type: Number, default: 20 }, // words per week
    currentDailyProgress: { type: Number, default: 0 },
    currentWeeklyProgress: { type: Number, default: 0 },
    currentVocabularyProgress: { type: Number, default: 0 }
  },
  // Skill mastery tracking
  skills: {
    speaking: { type: Number, default: 0 }, // 0-100
    listening: { type: Number, default: 0 },
    reading: { type: Number, default: 0 },
    writing: { type: Number, default: 0 }
  },
  // Personalized learning preferences
  preferences: {
    preferredLearningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic'],
      default: 'visual'
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    focusAreas: [String], // e.g., ['grammar', 'vocabulary', 'pronunciation']
    interests: [String] // e.g., ['business', 'travel', 'culture']
  }
}, {
  timestamps: true
});

// Index for efficient queries
progressSchema.index({ userId: 1 });

module.exports = mongoose.model('Progress', progressSchema); 