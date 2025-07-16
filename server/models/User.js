const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: false, // Make optional for Google users
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  nativeLanguage: {
    type: String,
    enum: ['sinhala', 'tamil', 'english'],
    default: 'sinhala'
  },
  // Progress tracking fields
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
  currentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  translationHistory: [{
    originalText: String,
    translatedText: String,
    fromLang: String,
    toLang: String,
    timestamp: { type: Date, default: Date.now }
  }],
  quizScores: [{
    score: Number,
    totalQuestions: Number,
    category: String,
    timestamp: { type: Date, default: Date.now },
    answers: [
      {
        question: String,
        selectedAnswer: String,
        correctAnswer: String,
        correct: Boolean
      }
    ]
  }],
  vocabulary: [{
    word: String,
    translation: String,
    language: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    masteryLevel: { type: Number, default: 0 }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
