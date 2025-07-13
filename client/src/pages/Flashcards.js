import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Plus, 
  Search, 
  Filter, 
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

const Flashcards = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [dueCards, setDueCards] = useState([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    learningCards: 0,
    newCards: 0,
    dueCards: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('review');
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewStartTime, setReviewStartTime] = useState(null);
  const [reviewSession, setReviewSession] = useState({
    totalReviewed: 0,
    correctAnswers: 0,
    sessionStartTime: null
  });
  const [filters, setFilters] = useState({
    language: '',
    targetLanguage: '',
    category: '',
    due: false,
    masteryLevel: ''
  });

  // New flashcard form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    word: '',
    translation: '',
    language: 'sinhala',
    targetLanguage: 'english',
    category: 'general',
    exampleSentence: '',
    pronunciation: '',
    notes: ''
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFlashcards();
    fetchStats();
    fetchDueCards();
  }, [filters]);

  const fetchFlashcards = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await apiClient.get(`/api/flashcards?${params}`);
      setFlashcards(response.data || []);
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      setFlashcards([]);
    }
  };

  const fetchDueCards = async () => {
    try {
      const response = await apiClient.get('/api/flashcards/due');
      setDueCards(response.data || []);
    } catch (error) {
      console.error('Failed to fetch due cards:', error);
      setDueCards([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/flashcards/stats');
      setStats(response.data || {
        totalCards: 0,
        masteredCards: 0,
        learningCards: 0,
        newCards: 0,
        dueCards: 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalCards: 0,
        masteredCards: 0,
        learningCards: 0,
        newCards: 0,
        dueCards: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const startReview = () => {
    if (dueCards.length === 0) {
      toast.error('No cards due for review!');
      return;
    }
    setCurrentCard(dueCards[0]);
    setShowAnswer(false);
    setReviewStartTime(Date.now());
    setReviewSession({
      totalReviewed: 0,
      correctAnswers: 0,
      sessionStartTime: Date.now()
    });
  };

  const reviewCard = async (result) => {
    if (!currentCard) return;

    const timeSpent = Math.round((Date.now() - reviewStartTime) / 1000);
    const isCorrect = result === 'good' || result === 'easy';
    
    try {
      await apiClient.post(`/api/flashcards/${currentCard._id}/review`, {
        result,
        timeSpent
      });

      // Update session stats
      setReviewSession(prev => ({
        ...prev,
        totalReviewed: prev.totalReviewed + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
      }));

      // Remove reviewed card from due cards
      setDueCards(prev => prev.filter(card => card._id !== currentCard._id));
      
      // Get next card or finish review
      const remainingCards = dueCards.filter(card => card._id !== currentCard._id);
      if (remainingCards.length > 0) {
        setCurrentCard(remainingCards[0]);
        setShowAnswer(false);
        setReviewStartTime(Date.now());
      } else {
        const sessionDuration = Math.round((Date.now() - reviewSession.sessionStartTime) / 1000);
        const accuracy = Math.round((reviewSession.correctAnswers + (isCorrect ? 1 : 0)) / (reviewSession.totalReviewed + 1) * 100);
        
        toast.success(`Review session completed! Accuracy: ${accuracy}%`);
        setCurrentCard(null);
        
        // Refresh stats after review session
        fetchStats();
        fetchDueCards();
      }
    } catch (error) {
      console.error('Failed to review card:', error);
      toast.error('Failed to save review');
    }
  };

  const addFlashcard = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to add flashcards');
      return;
    }
    
    try {
      const response = await apiClient.post('/api/flashcards', newCard);
      toast.success('Flashcard added successfully!');
      setNewCard({
        word: '',
        translation: '',
        language: 'sinhala',
        targetLanguage: 'english',
        category: 'general',
        exampleSentence: '',
        pronunciation: '',
        notes: ''
      });
      setShowAddForm(false);
      fetchFlashcards();
      fetchStats();
      fetchDueCards();
    } catch (error) {
      console.error('Failed to add flashcard:', error);
      toast.error(`Failed to add flashcard: ${error.response?.data?.message || error.message}`);
    }
  };

  const deleteFlashcard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      await apiClient.delete(`/api/flashcards/${id}`);
      toast.success('Flashcard deleted successfully!');
      fetchFlashcards();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      toast.error('Failed to delete flashcard');
    }
  };

  const resetCard = async (id) => {
    try {
      await apiClient.post(`/api/flashcards/${id}/reset`);
      toast.success('Card reset successfully!');
      fetchFlashcards();
      fetchStats();
      fetchDueCards();
    } catch (error) {
      console.error('Failed to reset card:', error);
      toast.error('Failed to reset card');
    }
  };

  const filteredFlashcards = flashcards.filter(card => 
    searchTerm === '' || 
    card.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMasteryColor = (level) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMasteryText = (level) => {
    if (level >= 4) return 'Mastered';
    if (level >= 2) return 'Learning';
    return 'New';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Master vocabulary with spaced repetition
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cards</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCards}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mastered</p>
              <p className="text-2xl font-semibold text-green-600">{stats.masteredCards}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.learningCards}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.newCards}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Today</p>
              <p className="text-2xl font-semibold text-red-600">{stats.dueCards}</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['review', 'browse', 'add'].map((tab) => (
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

        {/* Review Tab */}
        {activeTab === 'review' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {!currentCard ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Review Session
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {dueCards.length} cards due for review
                  </p>
                  <button
                    onClick={startReview}
                    disabled={dueCards.length === 0}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Start Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                <div className="max-w-2xl mx-auto">
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>Progress: {reviewSession.totalReviewed + 1} / {dueCards.length + reviewSession.totalReviewed}</span>
                      <span>Accuracy: {reviewSession.totalReviewed > 0 ? Math.round((reviewSession.correctAnswers / reviewSession.totalReviewed) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((reviewSession.totalReviewed + 1) / (dueCards.length + reviewSession.totalReviewed)) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                      {currentCard.word}
                    </h3>
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                          {currentCard.translation}
                        </p>
                        {currentCard.exampleSentence && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            "{currentCard.exampleSentence}"
                          </p>
                        )}
                        {currentCard.pronunciation && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Pronunciation: {currentCard.pronunciation}
                          </p>
                        )}
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>Mastery Level: {currentCard.masteryLevel}/5</span>
                          <span>•</span>
                          <span>Next Review: {new Date(currentCard.nextReview).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {!showAnswer ? (
                    <div className="text-center">
                      <button
                        onClick={() => setShowAnswer(true)}
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 text-lg"
                      >
                        Show Answer
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => reviewCard('again')}
                        className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Again
                      </button>
                      <button
                        onClick={() => reviewCard('hard')}
                        className="bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 flex items-center justify-center"
                      >
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Hard
                      </button>
                      <button
                        onClick={() => reviewCard('good')}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Good
                      </button>
                      <button
                        onClick={() => reviewCard('easy')}
                        className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
                      >
                        <Star className="w-5 h-5 mr-2" />
                        Easy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search flashcards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Card
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={filters.language}
                  onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Languages</option>
                  <option value="sinhala">Sinhala</option>
                  <option value="tamil">Tamil</option>
                  <option value="english">English</option>
                </select>
                <select
                  value={filters.targetLanguage}
                  onChange={(e) => setFilters(prev => ({ ...prev, targetLanguage: e.target.value }))}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Target Languages</option>
                  <option value="sinhala">Sinhala</option>
                  <option value="tamil">Tamil</option>
                  <option value="english">English</option>
                </select>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option value="general">General</option>
                  <option value="business">Business</option>
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                  <option value="family">Family</option>
                </select>
                <select
                  value={filters.masteryLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, masteryLevel: e.target.value }))}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Levels</option>
                  <option value="0">New (0)</option>
                  <option value="1">Learning (1)</option>
                  <option value="2">Learning (2)</option>
                  <option value="3">Learning (3)</option>
                  <option value="4">Mastered (4)</option>
                  <option value="5">Mastered (5)</option>
                </select>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.due}
                    onChange={(e) => setFilters(prev => ({ ...prev, due: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Due for review</span>
                </label>
              </div>
            </div>

            {/* Flashcards List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Flashcards ({filteredFlashcards.length})
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredFlashcards.length} of {flashcards.length} cards
                  </div>
                </div>
                
                {filteredFlashcards.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm ? 'No flashcards match your search.' : 'No flashcards found.'}
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Add Your First Flashcard
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFlashcards.map((card) => (
                      <motion.div
                        key={card._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white text-lg">{card.word}</h4>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium text-gray-900 dark:text-white text-lg">{card.translation}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <span className="capitalize">{card.language}</span>
                              <span>→</span>
                              <span className="capitalize">{card.targetLanguage}</span>
                              <span>•</span>
                              <span className="capitalize">{card.category}</span>
                              <span>•</span>
                              <span className={`font-medium ${getMasteryColor(card.masteryLevel)}`}>
                                {getMasteryText(card.masteryLevel)} ({card.masteryLevel}/5)
                              </span>
                            </div>
                            {card.exampleSentence && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                                "{card.exampleSentence}"
                              </p>
                            )}
                            {card.pronunciation && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Pronunciation: {card.pronunciation}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>Next Review: {new Date(card.nextReview).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Interval: {card.interval} days</span>
                              <span>•</span>
                              <span>Reviews: {card.reviewHistory?.length || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => resetCard(card._id)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="Reset Card"
                            >
                              <RotateCcw size={18} />
                            </button>
                            <button
                              onClick={() => deleteFlashcard(card._id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Delete Flashcard"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Tab */}
        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Flashcard</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={addFlashcard} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Word
                  </label>
                  <input
                    type="text"
                    value={newCard.word}
                    onChange={(e) => setNewCard(prev => ({ ...prev, word: e.target.value }))}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the word to learn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Translation
                  </label>
                  <input
                    type="text"
                    value={newCard.translation}
                    onChange={(e) => setNewCard(prev => ({ ...prev, translation: e.target.value }))}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the translation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={newCard.language}
                    onChange={(e) => setNewCard(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sinhala">Sinhala</option>
                    <option value="tamil">Tamil</option>
                    <option value="english">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Language
                  </label>
                  <select
                    value={newCard.targetLanguage}
                    onChange={(e) => setNewCard(prev => ({ ...prev, targetLanguage: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="english">English</option>
                    <option value="sinhala">Sinhala</option>
                    <option value="tamil">Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newCard.category}
                    onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="business">Business</option>
                    <option value="travel">Travel</option>
                    <option value="food">Food</option>
                    <option value="family">Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Example Sentence (Optional)
                </label>
                <input
                  type="text"
                  value={newCard.exampleSentence}
                  onChange={(e) => setNewCard(prev => ({ ...prev, exampleSentence: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Example: I love to eat rice"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pronunciation (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCard.pronunciation}
                    onChange={(e) => setNewCard(prev => ({ ...prev, pronunciation: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="How to pronounce the word"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCard.notes}
                    onChange={(e) => setNewCard(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes or tips"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Flashcard
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Add Flashcard Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Flashcard</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={addFlashcard} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Word
                      </label>
                      <input
                        type="text"
                        value={newCard.word}
                        onChange={(e) => setNewCard(prev => ({ ...prev, word: e.target.value }))}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter the word to learn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Translation
                      </label>
                      <input
                        type="text"
                        value={newCard.translation}
                        onChange={(e) => setNewCard(prev => ({ ...prev, translation: e.target.value }))}
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter the translation"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={newCard.language}
                        onChange={(e) => setNewCard(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="sinhala">Sinhala</option>
                        <option value="tamil">Tamil</option>
                        <option value="english">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Language
                      </label>
                      <select
                        value={newCard.targetLanguage}
                        onChange={(e) => setNewCard(prev => ({ ...prev, targetLanguage: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="english">English</option>
                        <option value="sinhala">Sinhala</option>
                        <option value="tamil">Tamil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newCard.category}
                        onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General</option>
                        <option value="business">Business</option>
                        <option value="travel">Travel</option>
                        <option value="food">Food</option>
                        <option value="family">Family</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Example Sentence (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCard.exampleSentence}
                      onChange={(e) => setNewCard(prev => ({ ...prev, exampleSentence: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Example: I love to eat rice"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pronunciation (Optional)
                      </label>
                      <input
                        type="text"
                        value={newCard.pronunciation}
                        onChange={(e) => setNewCard(prev => ({ ...prev, pronunciation: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="How to pronounce the word"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={newCard.notes}
                        onChange={(e) => setNewCard(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional notes or tips"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Flashcard
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Flashcards; 