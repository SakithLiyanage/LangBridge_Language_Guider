const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Translation = require('../models/Translation');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching progress for user:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get translation history
    const translations = await Translation.find({ userId: req.user.id });
    
    // Get quiz history
    const quizzes = await Quiz.find({ userId: req.user.id });
    
    // Get flashcard stats
    const flashcards = await Flashcard.find({ userId: req.user.id });
    
    // Calculate XP points (10 per translation, 20 per quiz, 5 per flashcard review)
    const translationXP = translations.length * 10;
    const quizXP = quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
    const flashcardXP = flashcards.reduce((sum, card) => sum + (card.reviewHistory?.length || 0) * 5, 0);
    const totalXP = translationXP + quizXP + flashcardXP;
    
    // Calculate level based on XP
    const level = totalXP < 100 ? 'beginner' : totalXP < 500 ? 'intermediate' : 'advanced';
    
    // Calculate streak (simplified - just count consecutive days with activity)
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const recentActivity = await Promise.all([
      Translation.findOne({ userId: req.user.id, timestamp: { $gte: yesterday } }),
      Quiz.findOne({ userId: req.user.id, timestamp: { $gte: yesterday } }),
      Flashcard.findOne({ userId: req.user.id, lastReviewed: { $gte: yesterday } })
    ]);
    
    const hasRecentActivity = recentActivity.some(activity => activity !== null);
    const streakDays = hasRecentActivity ? (user.streakDays || 0) + 1 : 0;
    
    // Update user streak
    if (hasRecentActivity && (!user.lastActivityDate || user.lastActivityDate < yesterday)) {
      user.streakDays = streakDays;
      user.lastActivityDate = today;
      await user.save();
    }
    
    // Course progress (simplified)
    const courseProgress = {
      sinhala: {
        overallProgress: Math.min(100, (translations.filter(t => t.fromLang === 'sinhala' || t.toLang === 'sinhala').length / 10) * 100),
        completedLessons: translations.filter(t => t.fromLang === 'sinhala' || t.toLang === 'sinhala').length
      },
      tamil: {
        overallProgress: Math.min(100, (translations.filter(t => t.fromLang === 'tamil' || t.toLang === 'tamil').length / 10) * 100),
        completedLessons: translations.filter(t => t.fromLang === 'tamil' || t.toLang === 'tamil').length
      },
      english: {
        overallProgress: Math.min(100, (translations.filter(t => t.fromLang === 'english' || t.toLang === 'english').length / 10) * 100),
        completedLessons: translations.filter(t => t.fromLang === 'english' || t.toLang === 'english').length
      }
    };
    
    // Learning goals
    const goals = {
      dailyTarget: 30, // minutes
      weeklyTarget: 210, // minutes
      vocabularyTarget: 100, // words
      currentDailyProgress: Math.min(30, translations.length * 2 + quizzes.length * 5),
      currentWeeklyProgress: Math.min(210, translations.length * 14 + quizzes.length * 35),
      currentVocabularyProgress: user.vocabulary?.length || 0
    };
    
    // Achievements (simplified)
    const achievements = [];
    if (translations.length >= 10) achievements.push('First Steps');
    if (translations.length >= 50) achievements.push('Translation Master');
    if (quizzes.length >= 5) achievements.push('Quiz Enthusiast');
    if (quizzes.length >= 20) achievements.push('Quiz Champion');
    if (flashcards.length >= 10) achievements.push('Flashcard Learner');
    if (flashcards.length >= 50) achievements.push('Flashcard Master');
    if (streakDays >= 7) achievements.push('Week Warrior');
    if (streakDays >= 30) achievements.push('Month Master');
    
    const progress = {
      xpPoints: totalXP,
      streakDays: user.streakDays || 0,
      currentLevel: level,
      achievements,
      courseProgress,
      goals
    };
    
    console.log('Progress data:', progress);
    res.json(progress);
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
  }
});

// Get achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const translations = await Translation.find({ userId: req.user.id });
    const quizzes = await Quiz.find({ userId: req.user.id });
    const flashcards = await Flashcard.find({ userId: req.user.id });
    
    const allAchievements = [
      { id: 'first_steps', name: 'First Steps', description: 'Complete 10 translations', requirement: 10, type: 'translations' },
      { id: 'translation_master', name: 'Translation Master', description: 'Complete 50 translations', requirement: 50, type: 'translations' },
      { id: 'quiz_enthusiast', name: 'Quiz Enthusiast', description: 'Complete 5 quizzes', requirement: 5, type: 'quizzes' },
      { id: 'quiz_champion', name: 'Quiz Champion', description: 'Complete 20 quizzes', requirement: 20, type: 'quizzes' },
      { id: 'flashcard_learner', name: 'Flashcard Learner', description: 'Create 10 flashcards', requirement: 10, type: 'flashcards' },
      { id: 'flashcard_master', name: 'Flashcard Master', description: 'Create 50 flashcards', requirement: 50, type: 'flashcards' },
      { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', requirement: 7, type: 'streak' },
      { id: 'month_master', name: 'Month Master', description: 'Maintain a 30-day streak', requirement: 30, type: 'streak' }
    ];
    
    const earned = [];
    const available = [];
    const newAchievements = [];
    
    allAchievements.forEach(achievement => {
      let progress = 0;
      switch (achievement.type) {
        case 'translations':
          progress = translations.length;
          break;
        case 'quizzes':
          progress = quizzes.length;
          break;
        case 'flashcards':
          progress = flashcards.length;
          break;
        case 'streak':
          progress = user.streakDays || 0;
          break;
      }
      
      if (progress >= achievement.requirement) {
        earned.push({ ...achievement, progress, earned: true });
      } else {
        available.push({ ...achievement, progress, earned: false });
      }
    });
    
    res.json({ earned, available, new: newAchievements });
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    res.status(500).json({ message: 'Failed to fetch achievements', error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({}, 'username xpPoints streakDays achievements')
      .sort({ xpPoints: -1, streakDays: -1 })
      .limit(10);
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      xpPoints: user.xpPoints || 0,
      streakDays: user.streakDays || 0,
      achievements: user.achievements?.length || 0
    }));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
});

module.exports = router; 