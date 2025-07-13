import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axios';
import toast from 'react-hot-toast';

const Progress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState({ earned: [], available: [], new: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProgress();
    fetchAchievements();
    fetchLeaderboard();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await apiClient.get('/api/progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      // Set default progress data to prevent errors
      setProgress({
        xpPoints: 0,
        streakDays: 0,
        currentLevel: 'beginner',
        achievements: [],
        courseProgress: {},
        goals: {
          dailyTarget: 30,
          weeklyTarget: 210,
          vocabularyTarget: 100,
          currentDailyProgress: 0,
          currentWeeklyProgress: 0,
          currentVocabularyProgress: 0
        },
        skills: {}
      });
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await apiClient.get('/api/progress/achievements');
      setAchievements(response.data);
      
      // Show notification for new achievements
      if (response.data.new && response.data.new.length > 0) {
        response.data.new.forEach(achievement => {
          toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`);
        });
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      // Set default achievements data
      setAchievements({ earned: [], available: [], new: [] });
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await apiClient.get('/api/progress/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-blue-600 bg-blue-100';
      case 'advanced': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSkillColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    if (value >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Learning Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your journey and celebrate your achievements
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'achievements', 'leaderboard', 'skills'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && progress && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">XP Points</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{progress.xpPoints || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Streak Days</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{progress.streakDays || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</p>
                    <p className={`text-lg font-semibold ${getLevelColor(progress.currentLevel || 'beginner')}`}>
                      {(progress.currentLevel || 'beginner').charAt(0).toUpperCase() + (progress.currentLevel || 'beginner').slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Achievements</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{(progress.achievements || []).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(progress.courseProgress || {}).map(([language, data]) => (
                  <div key={language} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {language}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round(data.overallProgress || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.overallProgress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(data.completedLessons || []).length} lessons completed
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Daily Target</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {progress.goals?.currentDailyProgress || 0}/{progress.goals?.dailyTarget || 30} min
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, ((progress.goals?.currentDailyProgress || 0) / (progress.goals?.dailyTarget || 30)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Target</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {progress.goals?.currentWeeklyProgress || 0}/{progress.goals?.weeklyTarget || 210} min
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, ((progress.goals?.currentWeeklyProgress || 0) / (progress.goals?.weeklyTarget || 210)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Vocabulary Target</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {progress.goals?.currentVocabularyProgress || 0}/{progress.goals?.vocabularyTarget || 100} words
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, ((progress.goals?.currentVocabularyProgress || 0) / (progress.goals?.vocabularyTarget || 100)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(achievements.earned || []).map((achievement) => (
                  <div key={achievement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{achievement.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(achievements.available || []).map((achievement) => {
                  const isEarned = (achievements.earned || []).some(a => a.id === achievement.id);
                  return (
                    <div key={achievement.id} className={`border rounded-lg p-4 ${
                      isEarned 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <span className={`text-2xl ${isEarned ? '' : 'opacity-50'}`}>{achievement.icon}</span>
                        <div>
                          <h4 className={`font-medium ${isEarned ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-white'}`}>
                            {achievement.name}
                          </h4>
                          <p className={`text-sm ${isEarned ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leaderboard</h3>
            <div className="space-y-3">
              {(leaderboard || []).map((user, index) => (
                <div key={user._id || index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.currentLevel || 'beginner'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{user.xpPoints || 0} XP</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.streakDays || 0} day streak</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && progress && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skill Mastery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(progress.skills || {}).map(([skill, level]) => (
                <div key={skill} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {skill}
                    </span>
                    <span className={`text-sm font-semibold ${getSkillColor(level || 0)}`}>
                      {level || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        (level || 0) >= 80 ? 'bg-green-600' :
                        (level || 0) >= 60 ? 'bg-yellow-600' :
                        (level || 0) >= 40 ? 'bg-orange-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${level || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress; 