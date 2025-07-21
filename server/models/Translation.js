const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalText: { type: String, required: true },
  translatedText: { type: String, required: true },
  fromLang: { type: String, required: true },
  toLang: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  feedback: {
    rating: { type: Number, min: 1, max: 5 }, // star rating
    positive: { type: Boolean }, // thumbs up/down
    comment: { type: String },
    feedbackAt: { type: Date }
  }
});

module.exports = mongoose.model('Translation', TranslationSchema); 