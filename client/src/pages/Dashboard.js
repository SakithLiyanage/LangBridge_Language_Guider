import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Languages, Award, Clock, TrendingUp, Book } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TranslationInterface from '../components/TranslationInterface';
import axios from 'axios';
import apiClient from '../utils/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTranslations: 0,
    totalQuizzes: 0,
    averageScore: 0,
    vocabularyCount: 0,
    totalCorrect: 0 // New stat
  });
  const [progress, setProgress] = useState(null);
  const [recentTranslations, setRecentTranslations] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vocabulary, setVocabulary] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchVocabulary();
    fetchProgress();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [translationHistory, quizHistory] = await Promise.all([
        apiClient.get('/api/translation/history'),
        apiClient.get('/api/quiz/history')
      ]);

      const translations = translationHistory.data;
      const quizzes = quizHistory.data;

      // Calculate stats
      const totalScore = quizzes.reduce((sum, quiz) => sum + quiz.score, 0);
      const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
      // Calculate total correct answers (sum of all correct answers in all quizzes)
      let totalCorrect = 0;
      quizzes.forEach(quiz => {
        if (quiz.answers && Array.isArray(quiz.answers)) {
          totalCorrect += quiz.answers.filter(a => a.correct).length;
        } else if (typeof quiz.score === 'number') {
          totalCorrect += quiz.score;
        }
      });
      
      setStats({
        totalTranslations: translations.length,
        totalQuizzes: quizzes.length,
        averageScore: totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0,
        // vocabularyCount will be set by fetchVocabulary
        totalCorrect
      });

      setRecentTranslations(translations.slice(0, 5));
      setRecentQuizzes(quizzes.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVocabulary = async () => {
    try {
      const response = await apiClient.get('/api/translation/vocabulary');
      setVocabulary(response.data.vocabulary || []);
      // Update vocabulary count in stats
      setStats((prev) => ({ ...prev, vocabularyCount: (response.data.vocabulary || []).length }));
    } catch (error) {
      setVocabulary([]);
      setStats((prev) => ({ ...prev, vocabularyCount: 0 }));
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await apiClient.get('/api/progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const handleDeleteVocab = async (word, language) => {
    try {
      await apiClient.delete('/api/translation/vocabulary', { data: { word, language } });
      setVocabulary(vocabulary.filter(v => !(v.word === word && v.language === language)));
    } catch (error) {
      // Optionally show error toast
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-lg ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your language learning progress
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<Languages size={24} />}
            title="Total Translations"
            value={stats.totalTranslations}
            color="bg-blue-100 dark:bg-blue-900"
          />
          <StatCard
            icon={<Award size={24} />}
            title="Quizzes Completed"
            value={stats.totalQuizzes}
            color="bg-green-100 dark:bg-green-900"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            title="Average Score"
            value={`${stats.averageScore}%`}
            color="bg-yellow-100 dark:bg-yellow-900"
          />
          <StatCard
  icon={<Book size={24} />}
  title="Vocabulary"
  value={vocabulary.length}
  color="bg-purple-100 dark:bg-purple-900"
/>
          <StatCard
            icon={<Clock size={24} />}
            title="Total Correct Answers"
            value={stats.totalCorrect}
            color="bg-pink-100 dark:bg-pink-900"
          />
        </div>

        {/* Progress Overview */}
        {progress && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Learning Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{progress.xpPoints}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">XP Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{(progress.streakDays && progress.streakDays > 0) ? progress.streakDays : (progress.lastActivityDate ? 1 : 0)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 capitalize">{progress.currentLevel}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{progress.achievements.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
              </div>
            </div>
          </div>
        )}

        {/* Vocabulary List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            Vocabulary
          </h3>
          {vocabulary.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">No vocabulary saved yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {vocabulary.map((v, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div>
                    <div className="font-bold text-blue-700 dark:text-blue-300">{v.word}</div>
                    <div className="text-green-700 dark:text-green-300">{v.translation}</div>
                    <div className="text-xs text-gray-500">{v.language}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteVocab(v.word, v.language)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Translation Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Translate
          </h2>
          <TranslationInterface />
        </motion.div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Translations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Recent Translations
            </h3>
            <div className="space-y-3">
              {recentTranslations.length > 0 ? (
                recentTranslations.map((translation, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {translation.fromLang} → {translation.toLang}
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {translation.originalText}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400">
                          {translation.translatedText}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(translation.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No translations yet. Start translating to see your history!
                </p>
              )}
            </div>
          </motion.div>

          {/* Recent Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Award className="mr-2" size={20} />
              Recent Quiz Results
            </h3>
            <div className="space-y-3">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {quiz.category} Quiz
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quiz.score}/{quiz.totalQuestions} correct
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          (quiz.score / quiz.totalQuestions) >= 0.8 
                            ? 'text-green-600' 
                            : (quiz.score / quiz.totalQuestions) >= 0.6 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                        }`}>
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(quiz.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No quizzes completed yet. Take a quiz to test your knowledge!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
