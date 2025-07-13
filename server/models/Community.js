const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    enum: ['question', 'discussion', 'resource', 'cultural', 'general'],
    default: 'general'
  },
  language: {
    type: String,
    enum: ['sinhala', 'tamil', 'english'],
    required: true
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const resourceSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['vocabulary', 'grammar', 'pronunciation', 'cultural', 'exercise', 'other'],
    required: true
  },
  language: {
    type: String,
    enum: ['sinhala', 'tamil', 'english'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can be text, JSON for exercises, etc.
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
postSchema.index({ category: 1, language: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
resourceSchema.index({ type: 1, language: 1, difficulty: 1 });
resourceSchema.index({ author: 1, createdAt: -1 });

module.exports = {
  Post: mongoose.model('Post', postSchema),
  Resource: mongoose.model('Resource', resourceSchema)
}; 