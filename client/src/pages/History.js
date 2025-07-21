import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Languages, Award, Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import apiClient from '../utils/axios';

const History = () => {
  const [activeTab, setActiveTab] = useState('translations');
  const [translations, setTranslations] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterDate, setFilterDate] = useState('all');
  const [vocabulary, setVocabulary] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchVocabulary();
  }, []);

  const fetchHistory = async () => {
    try {
      console.log('Fetching history data...');
      const [translationResponse, quizResponse] = await Promise.all([
        apiClient.get('/api/translation/history'),
        apiClient.get('/api/quiz/history')
      ]);

      console.log('Translation history:', translationResponse.data);
      console.log('Quiz history:', quizResponse.data);
      console.log('Quiz history length:', quizResponse.data?.length);

      setTranslations(translationResponse.data);
      setQuizzes(quizResponse.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const fetchVocabulary = async () => {
    try {
      const response = await apiClient.get('/api/translation/vocabulary');
      setVocabulary(response.data.vocabulary || []);
    } catch (error) {
      setVocabulary([]);
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

  const handleOpenReview = (quiz) => {
    setSelectedQuiz(quiz);
    setReviewModalOpen(true);
  };
  const handleCloseReview = () => {
    setReviewModalOpen(false);
    setSelectedQuiz(null);
  };

  // Enhanced filter and sort logic for translations
  const filteredTranslations = translations
    .filter(t => {
      const matchesSearch = t.originalText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.translatedText?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (filterDate === 'all') return true;
      const date = new Date(t.timestamp || t.createdAt);
    const now = new Date();
    if (filterDate === 'today') {
        return date.toDateString() === now.toDateString();
    } else if (filterDate === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
    } else if (filterDate === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      }
      return true;
    })
    .sort((a, b) => sortOrder === 'newest'
      ? new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)
      : new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
    );
  // Enhanced filter and sort logic for quizzes
  const filteredQuizzes = quizzes
    .filter(q => {
      const matchesSearch = (q.answers || []).some(ans =>
        ans.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ans.translation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!matchesSearch) return false;
    if (filterDate === 'all') return true;
      const date = new Date(q.timestamp || q.createdAt);
    const now = new Date();
    if (filterDate === 'today') {
        return date.toDateString() === now.toDateString();
    } else if (filterDate === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
    } else if (filterDate === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
    }
    return true;
    })
    .sort((a, b) => sortOrder === 'newest'
      ? new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)
      : new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your history? This cannot be undone.')) return;
    try {
      await apiClient.delete('/api/translation/history');
      await apiClient.delete('/api/quiz/history');
      fetchHistory();
      toast.success('History cleared!');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">History</h1>
          <button onClick={clearHistory} className="btn-secondary">Clear History</button>
        </div>
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            className="input-field w-64"
            placeholder="Search history..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="input-field w-40"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select
            className="input-field w-40"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('translations')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'translations'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Languages size={20} />
            <span>Translations</span>
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'quizzes'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Award size={20} />
            <span>Quizzes</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'translations' ? (
          <div className="space-y-4">
            {filteredTranslations.length > 0 ? (
              filteredTranslations.map((translation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Languages className="text-blue-500" size={20} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {translation.fromLang} → {translation.toLang}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(translation.timestamp)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Original</h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {translation.originalText}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Translation</h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        {translation.translatedText}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Languages className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No translations found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {console.log('Filtered quizzes:', filteredQuizzes)}
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleOpenReview(quiz)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Award className="text-yellow-500" size={24} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {quiz.category} Quiz
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quiz.score}/{quiz.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        (quiz.score / quiz.totalQuestions) >= 0.8 
                          ? 'text-green-500' 
                          : (quiz.score / quiz.totalQuestions) >= 0.6 
                            ? 'text-yellow-500' 
                            : 'text-red-500'
                      }`}>
                        {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(quiz.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (quiz.score / quiz.totalQuestions) >= 0.8 
                          ? 'bg-green-500' 
                          : (quiz.score / quiz.totalQuestions) >= 0.6 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${(quiz.score / quiz.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">No quiz results found</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Quiz Review Modal */}
      {reviewModalOpen && selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              onClick={handleCloseReview}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quiz Review</h2>
            <div className="mb-4 text-gray-700 dark:text-gray-300">
              <div><b>Date:</b> {formatDate(selectedQuiz.timestamp)}</div>
              <div><b>Score:</b> {selectedQuiz.score}/{selectedQuiz.totalQuestions} ({Math.round((selectedQuiz.score/selectedQuiz.totalQuestions)*100)}%)</div>
              <div><b>Category:</b> {selectedQuiz.category}</div>
            </div>
            {selectedQuiz.answers && selectedQuiz.answers.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {selectedQuiz.answers.map((ans, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border-2 ${ans.correct ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Q{idx+1}: {ans.question}</span>
                      {ans.correct ? <span className="text-green-600">✔</span> : <span className="text-red-600">✘</span>}
                    </div>
                    <div className="text-sm mt-1">
                      <div><b>Your answer:</b> {ans.selectedAnswer || ans.userAnswer}</div>
                      <div><b>Correct answer:</b> {ans.correctAnswer}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Detailed answers are not available for this quiz. (Backend enhancement needed to store answers.)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
