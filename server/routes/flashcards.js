const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');

// Helper to safely get ObjectId
function getUserObjectId(id) {
  if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
    return new mongoose.Types.ObjectId(id); // <-- use 'new' here
  }
  return id; // assume already ObjectId
}

// Get user's flashcards
router.get('/', auth, async (req, res) => {
  try {
    const { language, targetLanguage, category, due } = req.query;
    let query = { userId: req.user.id };

    if (language) query.language = language;
    if (targetLanguage) query.targetLanguage = targetLanguage;
    if (category) query.category = category;
    if (due === 'true') {
      query.nextReview = { $lte: new Date() };
    }

    const flashcards = await Flashcard.find(query).sort({ nextReview: 1 });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flashcards', error: error.message });
  }
});

// Create new flashcard
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received flashcard creation request. Body:', req.body);
    console.log('User ID:', req.user.id);
    const { word, translation, language, targetLanguage, category, exampleSentence, pronunciation, notes } = req.body;
    if (!word || !translation || !language || !targetLanguage) {
      console.error('Missing required fields for flashcard creation');
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const flashcard = new Flashcard({
      userId: req.user.id,
      word,
      translation,
      language,
      targetLanguage,
      category: category || 'general',
      exampleSentence,
      pronunciation,
      notes
    });
    console.log('Flashcard object to save:', flashcard);
    await flashcard.save();
    console.log('Flashcard saved successfully:', flashcard._id);
    
    // Update progress
    try {
      let progress = await Progress.findOne({ userId: req.user.id });
      if (!progress) {
        progress = new Progress({ userId: req.user.id });
      }
      // Add XP for creating flashcard (15 XP per card)
      progress.xpPoints = (progress.xpPoints || 0) + 15;
      progress.currentLevel = progress.xpPoints < 100 ? 'beginner' : progress.xpPoints < 500 ? 'intermediate' : 'advanced';
      progress.lastActivityDate = new Date();
      // Increment vocabulary skill
      progress.skills = progress.skills || {};
      progress.skills.vocabulary = Math.min(100, (progress.skills.vocabulary || 0) + 10);
      await progress.save();
      console.log('Progress updated for flashcard creation');
    } catch (progressError) {
      console.log('Progress update failed (non-critical):', progressError.message);
    }
    
    res.status(201).json(flashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ message: 'Failed to create flashcard', error: error.message });
  }
});

// Update flashcard
router.put('/:id', auth, async (req, res) => {
  try {
    const { word, translation, category, exampleSentence, pronunciation, notes } = req.body;
    
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        word,
        translation,
        category,
        exampleSentence,
        pronunciation,
        notes
      },
      { new: true }
    );

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update flashcard', error: error.message });
  }
});

// Delete flashcard
router.delete('/:id', auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete flashcard', error: error.message });
  }
});

// Review flashcard (spaced repetition)
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { result, timeSpent } = req.body; // result: 'again', 'hard', 'good', 'easy'
    
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Update review history
    flashcard.reviewHistory.push({
      date: new Date(),
      result,
      timeSpent: timeSpent || 0
    });

    // Spaced repetition algorithm (SuperMemo 2)
    let newInterval, newEaseFactor, newRepetitions;

    if (result === 'again') {
      newInterval = 1;
      newRepetitions = 0;
      newEaseFactor = Math.max(1.3, flashcard.easeFactor - 0.2);
    } else if (result === 'hard') {
      newInterval = Math.max(1, flashcard.interval * 0.8);
      newRepetitions = flashcard.repetitions + 1;
      newEaseFactor = Math.max(1.3, flashcard.easeFactor - 0.15);
    } else if (result === 'good') {
      newInterval = flashcard.interval * flashcard.easeFactor;
      newRepetitions = flashcard.repetitions + 1;
      newEaseFactor = flashcard.easeFactor + 0.1;
    } else if (result === 'easy') {
      newInterval = flashcard.interval * flashcard.easeFactor * 1.3;
      newRepetitions = flashcard.repetitions + 1;
      newEaseFactor = flashcard.easeFactor + 0.15;
    }

    // Update flashcard
    flashcard.interval = newInterval;
    flashcard.repetitions = newRepetitions;
    flashcard.easeFactor = newEaseFactor;
    flashcard.nextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);
    flashcard.lastReviewed = new Date();

    // Update mastery level based on recent performance
    const recentReviews = flashcard.reviewHistory.slice(-5);
    const goodReviews = recentReviews.filter(r => r.result === 'good' || r.result === 'easy').length;
    flashcard.masteryLevel = Math.min(5, Math.floor((goodReviews / recentReviews.length) * 5));

    await flashcard.save();
    
    // Update progress
    try {
      let progress = await Progress.findOne({ userId: req.user.id });
      if (!progress) {
        progress = new Progress({ userId: req.user.id });
      }
      
      // Add XP for flashcard review (5 XP per review)
      progress.xpPoints = (progress.xpPoints || 0) + 5;
      progress.currentLevel = progress.xpPoints < 100 ? 'beginner' : progress.xpPoints < 500 ? 'intermediate' : 'advanced';
      progress.lastActivityDate = new Date();
      
      // Update vocabulary skill based on review result
      progress.skills = progress.skills || {};
      const vocabSkill = result === 'easy' || result === 'good' ? 10 : result === 'hard' ? 5 : 2;
      progress.skills.vocabulary = Math.min(100, (progress.skills.vocabulary || 0) + vocabSkill);
      
      await progress.save();
    } catch (progressError) {
      console.log('Progress update failed (non-critical):', progressError.message);
    }
    
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to review flashcard', error: error.message });
  }
});

// Get due flashcards for review
router.get('/due', auth, async (req, res) => {
  try {
    const dueCards = await Flashcard.find({
      userId: req.user.id,
      nextReview: { $lte: new Date() }
    }).sort({ nextReview: 1 });

    res.json(dueCards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch due flashcards', error: error.message });
  }
});

// Get flashcard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userObjectId = getUserObjectId(req.user.id);
    console.log('Fetching stats for user:', req.user.id, 'ObjectId:', userObjectId);
    
    const stats = await Flashcard.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalCards: { $sum: 1 },
          masteredCards: { $sum: { $cond: [{ $gte: ['$masteryLevel', 4] }, 1, 0] } },
          learningCards: { $sum: { $cond: [{ $and: [{ $gte: ['$masteryLevel', 1] }, { $lt: ['$masteryLevel', 4] }] }, 1, 0] } },
          newCards: { $sum: { $cond: [{ $eq: ['$masteryLevel', 0] }, 1, 0] } },
          dueCards: { $sum: { $cond: [{ $lte: ['$nextReview', new Date()] }, 1, 0] } }
        }
      }
    ]);

    console.log('Stats result:', stats);

    const defaultStats = {
      totalCards: 0,
      masteredCards: 0,
      learningCards: 0,
      newCards: 0,
      dueCards: 0
    };

    res.json(stats[0] || defaultStats);
  } catch (error) {
    console.error('Failed to fetch flashcard stats:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Failed to fetch flashcard stats', error: error.message });
  }
});

// Import flashcards from CSV or JSON
router.post('/import', auth, async (req, res) => {
  try {
    const { flashcards } = req.body;
    
    if (!Array.isArray(flashcards)) {
      return res.status(400).json({ message: 'Invalid flashcards format' });
    }

    const importedCards = [];
    for (const card of flashcards) {
      const flashcard = new Flashcard({
        userId: req.user.id,
        word: card.word,
        translation: card.translation,
        language: card.language,
        targetLanguage: card.targetLanguage,
        category: card.category || 'general',
        exampleSentence: card.exampleSentence,
        pronunciation: card.pronunciation,
        notes: card.notes
      });
      
      await flashcard.save();
      importedCards.push(flashcard);
    }

    res.json({ message: `${importedCards.length} flashcards imported successfully`, cards: importedCards });
  } catch (error) {
    res.status(500).json({ message: 'Failed to import flashcards', error: error.message });
  }
});

// Reset flashcard progress
router.post('/:id/reset', auth, async (req, res) => {
  try {
    const userObjectId = getUserObjectId(req.user.id);
    console.log('Reset request for card:', req.params.id, 'User:', req.user.id, 'ObjectId:', userObjectId);
    const flashcard = await Flashcard.findOne({
      _id: req.params.id,
      userId: userObjectId
    });
    if (!flashcard) {
      console.error('Flashcard not found for reset:', req.params.id, 'User:', req.user.id);
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    // Reset spaced repetition fields
    flashcard.interval = 1;
    flashcard.repetitions = 0;
    flashcard.easeFactor = 2.5;
    flashcard.nextReview = new Date();
    flashcard.masteryLevel = 0;
    flashcard.reviewHistory = [];
    await flashcard.save();
    console.log('Flashcard reset successfully:', flashcard._id);
    res.json(flashcard);
  } catch (error) {
    console.error('Failed to reset flashcard:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Failed to reset flashcard', error: error.message });
  }
});

module.exports = router; 