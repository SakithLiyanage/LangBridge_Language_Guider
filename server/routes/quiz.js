const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
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
    
    const user = await User.findById(req.user.id);
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
    console.error('Failed to generate quiz:', error);
    res.status(500).json({ message: 'Failed to generate quiz', error: error.message });
  }
});

// Submit quiz results
router.post('/submit', auth, async (req, res) => {
  try {
    console.log('=== QUIZ SUBMISSION START ===');
    console.log('User ID:', req.user.id);
    console.log('Request headers:', req.headers);
    
    const { quizId, answers, score, totalQuestions, difficulty = 'medium' } = req.body;
    
    console.log('Quiz data:', { quizId, score, totalQuestions, difficulty, answersCount: answers?.length });
    console.log('Request body:', req.body);
    
    // Validate required fields
    if (!quizId || score === undefined || !totalQuestions || !answers) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: { quizId, score, totalQuestions, answers: !!answers } 
      });
    }
    
    console.log('Validation passed, creating quiz object...');
    
    // Save quiz result
    const quiz = new Quiz({
      userId: req.user.id,
      quizId,
      score,
      totalQuestions,
      difficulty,
      answers
    });
    
    console.log('Quiz object created:', quiz);
    
    console.log('Attempting to save quiz...');
    await quiz.save();
    console.log('Quiz saved successfully with ID:', quiz._id);
    
    // Update vocabulary mastery levels (optional - skip if no vocabulary words)
    if (answers && answers.length > 0) {
      console.log('Updating vocabulary mastery levels...');
      for (const answer of answers) {
        if (answer.correct && answer.word) {
          try {
            await User.findOneAndUpdate(
              { _id: req.user.id, 'vocabulary.word': answer.word },
              { $inc: { 'vocabulary.$.masteryLevel': 1 } }
            );
            console.log('Updated mastery for word:', answer.word);
          } catch (vocabError) {
            console.log('Vocabulary update failed (non-critical):', vocabError.message);
          }
        }
      }
    }
    
    console.log('Sending success response...');
    res.json({
      message: 'Quiz submitted successfully',
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100)
    });
    console.log('=== QUIZ SUBMISSION END ===');
  } catch (error) {
    console.error('=== QUIZ SUBMISSION ERROR ===');
    console.error('Failed to submit quiz:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      message: 'Failed to submit quiz', 
      error: error.message,
      details: error.stack 
    });
  }
});

// Get quiz history
router.get('/history', auth, async (req, res) => {
  try {
    console.log('Fetching quiz history for user:', req.user.id);
    
    const quizzes = await Quiz.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20);
    
    console.log('Found quizzes:', quizzes.length);
    console.log('Quiz details:', quizzes.map(q => ({ id: q._id, score: q.score, totalQuestions: q.totalQuestions, timestamp: q.timestamp })));
    res.json(quizzes);
  } catch (error) {
    console.error('Failed to fetch quiz history:', error);
    res.status(500).json({ message: 'Failed to fetch quiz history', error: error.message });
  }
});

// Test endpoint to verify Quiz model is working
router.get('/test', auth, async (req, res) => {
  try {
    console.log('Testing Quiz model...');
    console.log('Quiz model:', Quiz);
    console.log('Quiz schema:', Quiz.schema);
    
    // Try to create a test quiz
    const testQuiz = new Quiz({
      userId: req.user.id,
      quizId: 'test-' + Date.now(),
      score: 5,
      totalQuestions: 10,
      difficulty: 'medium',
      answers: [{
        question: 'Test question',
        selectedAnswer: 'Test answer',
        correctAnswer: 'Test answer',
        correct: true
      }]
    });
    
    console.log('Test quiz object:', testQuiz);
    
    res.json({
      message: 'Quiz model test successful',
      modelExists: !!Quiz,
      schemaExists: !!Quiz.schema,
      testQuiz: testQuiz.toObject()
    });
  } catch (error) {
    console.error('Quiz model test failed:', error);
    res.status(500).json({ 
      message: 'Quiz model test failed', 
      error: error.message,
      stack: error.stack 
    });
  }
});

module.exports = router;
