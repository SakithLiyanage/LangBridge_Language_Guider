const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Translation = require('../models/Translation');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const Progress = require('../models/Progress');

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching progress for user:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get or create progress document
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = new Progress({ userId: req.user.id });
      await progress.save();
    }

    // Get translation history
    const translations = await Translation.find({ userId: req.user.id });
    
    // Get quiz history
    const quizzes = await Quiz.find({ userId: req.user.id });
    
    // Get flashcard stats
    const flashcards = await Flashcard.find({ userId: req.user.id });
    
    // Get community activity
    const Post = require('../models/Community').Post;
    const Resource = require('../models/Community').Resource;
    const posts = await Post.find({ author: req.user.id });
    const resources = await Resource.find({ author: req.user.id });
    // Count replies
    let replyCount = 0;
    posts.forEach(post => {
      if (Array.isArray(post.replies)) {
        replyCount += post.replies.filter(r => r.author && r.author.toString() === req.user.id).length;
      }
    });
    // Calculate XP points (10 per translation, 20 per quiz, 5 per flashcard review, 10 per post, 5 per reply, 15 per resource)
    const translationXP = translations.length * 10;
    const quizXP = quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
    const flashcardXP = flashcards.reduce((sum, card) => sum + (card.reviewHistory?.length || 0) * 5, 0);
    const postXP = posts.length * 10;
    const replyXP = replyCount * 5;
    const resourceXP = resources.length * 15;
    const totalXP = translationXP + quizXP + flashcardXP + postXP + replyXP + resourceXP;
    
    // Update progress with calculated XP
    progress.xpPoints = totalXP;
    
    // Calculate level based on XP
    progress.currentLevel = totalXP < 100 ? 'beginner' : totalXP < 500 ? 'intermediate' : 'advanced';
    
    // Calculate streak (count any activity)
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const recentActivity = await Promise.all([
      Translation.findOne({ userId: req.user.id, timestamp: { $gte: yesterday } }),
      Quiz.findOne({ userId: req.user.id, timestamp: { $gte: yesterday } }),
      Flashcard.findOne({ userId: req.user.id, lastReviewed: { $gte: yesterday } }),
      Post.findOne({ author: req.user.id, createdAt: { $gte: yesterday } }),
      Resource.findOne({ author: req.user.id, createdAt: { $gte: yesterday } })
    ]);
    // Check for replies in the last day
    let recentReply = false;
    const recentPosts = await Post.find({ 'replies.author': req.user.id, 'replies.createdAt': { $gte: yesterday } });
    recentPosts.forEach(post => {
      if (Array.isArray(post.replies)) {
        if (post.replies.some(r => r.author && r.author.toString() === req.user.id && r.createdAt >= yesterday)) {
          recentReply = true;
        }
      }
    });
    const hasRecentActivity = recentActivity.some(activity => activity !== null) || recentReply;
    const streakDays = hasRecentActivity ? (progress.streakDays || 0) + 1 : 0;
    
    // Update streak
    if (hasRecentActivity && (!progress.lastActivityDate || progress.lastActivityDate < yesterday)) {
      progress.streakDays = streakDays;
      progress.lastActivityDate = today;
    }
    
    // Course progress (simplified)
    progress.courseProgress = {
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
    progress.goals = {
      dailyTarget: 30, // minutes
      weeklyTarget: 210, // minutes
      vocabularyTarget: 100, // words
      currentDailyProgress: Math.min(30, (translations.length + quizzes.length + flashcards.length + posts.length + replyCount + resources.length) * 2),
      currentWeeklyProgress: Math.min(210, (translations.length + quizzes.length + flashcards.length + posts.length + replyCount + resources.length) * 14),
      currentVocabularyProgress: user.vocabulary?.length || 0
    };
    
    // Achievements (simplified)
    const achievements = [];
    if (translations.length >= 10) achievements.push({ name: 'First Steps', earnedAt: new Date() });
    if (translations.length >= 50) achievements.push({ name: 'Translation Master', earnedAt: new Date() });
    if (quizzes.length >= 5) achievements.push({ name: 'Quiz Enthusiast', earnedAt: new Date() });
    if (quizzes.length >= 20) achievements.push({ name: 'Quiz Champion', earnedAt: new Date() });
    if (flashcards.length >= 10) achievements.push({ name: 'Flashcard Learner', earnedAt: new Date() });
    if (flashcards.length >= 50) achievements.push({ name: 'Flashcard Master', earnedAt: new Date() });
    if (streakDays >= 7) achievements.push({ name: 'Week Warrior', earnedAt: new Date() });
    if (streakDays >= 30) achievements.push({ name: 'Month Master', earnedAt: new Date() });
    progress.achievements = achievements;
    
    await progress.save();
    
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
    // Use Progress model for XP and streaks
    const Progress = require('../models/Progress');
    const User = require('../models/User');
    // Aggregate top 10 users by XP
    const topProgress = await Progress.find({})
      .sort({ xpPoints: -1, streakDays: -1 })
      .limit(10)
      .lean();
    // Get usernames and achievements count
    const userIds = topProgress.map(p => p.userId);
    const users = await User.find({ _id: { $in: userIds } }, 'username').lean();
    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = u.username; });
    const leaderboard = topProgress.map((p, idx) => ({
      rank: idx + 1,
      username: userMap[p.userId.toString()] || 'User',
      xpPoints: p.xpPoints || 0,
      streakDays: p.streakDays || 0,
      achievements: Array.isArray(p.achievements) ? p.achievements.length : 0
    }));
    res.json(leaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error: error.message });
  }
});

// Update progress endpoint
router.post('/update', auth, async (req, res) => {
  try {
    const { xpGained, skill, level, lessonCompleted } = req.body;
    
    console.log('Updating progress for user:', req.user.id, { xpGained, skill, level, lessonCompleted });
    
    // Find or create progress document
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = new Progress({ userId: req.user.id });
    }
    
    // Update XP points
    if (xpGained) {
      progress.xpPoints = (progress.xpPoints || 0) + xpGained;
    }
    
    // Update skill levels
    if (skill && level !== undefined) {
      progress.skills = progress.skills || {};
      progress.skills[skill] = Math.min(100, (progress.skills[skill] || 0) + level);
    }
    
    // Update course progress
    if (lessonCompleted) {
      progress.courseProgress = progress.courseProgress || {};
      const language = lessonCompleted.language;
      if (!progress.courseProgress[language]) {
        progress.courseProgress[language] = {
          completedLessons: [],
          currentLesson: '',
          overallProgress: 0
        };
      }
      
      if (!progress.courseProgress[language].completedLessons.includes(lessonCompleted.lessonId)) {
        progress.courseProgress[language].completedLessons.push(lessonCompleted.lessonId);
        progress.courseProgress[language].overallProgress = Math.min(100, 
          (progress.courseProgress[language].completedLessons.length / 10) * 100
        );
      }
    }
    
    // Update level based on XP
    const totalXP = progress.xpPoints || 0;
    progress.currentLevel = totalXP < 100 ? 'beginner' : totalXP < 500 ? 'intermediate' : 'advanced';
    
    // Update last activity
    progress.lastActivityDate = new Date();
    
    await progress.save();
    
    console.log('Progress updated successfully:', progress);
    
    res.json({
      message: 'Progress updated successfully',
      xpGained,
      totalXP: progress.xpPoints,
      currentLevel: progress.currentLevel
    });
  } catch (error) {
    console.error('Failed to update progress:', error);
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
});

module.exports = router; 