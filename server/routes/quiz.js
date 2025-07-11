const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate quiz questions
const generateQuizQuestions = async (vocabulary, difficulty = 'medium') => {
  const questions = [];
  
  for (let i = 0; i < Math.min(5, vocabulary.length); i++) {
    const word = vocabulary[i];
    const question = {
      id: i + 1,
      question: `What is the English translation of "${word.word}"?`,
      correctAnswer: word.translation,
      options: [
        word.translation,
        ...generateRandomOptions(word.translation, vocabulary)
      ].sort(() => Math.random() - 0.5),
      difficulty: word.difficulty
    };
    questions.push(question);
  }
  
  return questions;
};

const generateRandomOptions = (correctAnswer, vocabulary) => {
  const options = vocabulary
    .filter(v => v.translation !== correctAnswer)
    .map(v => v.translation)
    .slice(0, 3);
  
  // Fill with generic options if not enough vocabulary
  while (options.length < 3) {
    const generic = ['house', 'water', 'food', 'book', 'car', 'tree', 'sun', 'moon'];
    const randomOption = generic[Math.floor(Math.random() * generic.length)];
    if (!options.includes(randomOption) && randomOption !== correctAnswer) {
      options.push(randomOption);
    }
  }
  
  return options;
};

// Start quiz endpoint
router.post('/start', auth, async (req, res) => {
  try {
    const { difficulty = 'medium' } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user.vocabulary || user.vocabulary.length < 3) {
      return res.status(400).json({ 
        message: 'Not enough vocabulary. Please translate some words first.' 
      });
    }
    
    const questions = await generateQuizQuestions(user.vocabulary, difficulty);
    
    res.json({
      quizId: Date.now().toString(),
      questions,
      totalQuestions: questions.length,
      difficulty
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
  }
});

// Submit quiz results
router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, answers, score, totalQuestions } = req.body;
    // Save quiz score with answers
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        quizScores: {
          score,
          totalQuestions,
          category: 'vocabulary',
          timestamp: new Date(),
          answers // Store detailed answers
        }
      }
    });
    // Update vocabulary mastery levels
    for (const answer of answers) {
      if (answer.correct) {
        await User.findOneAndUpdate(
          { _id: req.userId, 'vocabulary.word': answer.word },
          { $inc: { 'vocabulary.$.masteryLevel': 1 }
        });
      }
    }
    res.json({
      message: 'Quiz submitted successfully',
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz', error: error.message });
  }
});

// Get quiz history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('quizScores');
    // Return answers as well for review
    res.json(user.quizScores.reverse().slice(0, 20)); // Last 20 quizzes
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quiz history', error: error.message });
  }
});

module.exports = router;
