import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import apiClient from '../utils/axios';

const Quiz = () => {
  const [quizState, setQuizState] = useState('start'); // start, playing, finished
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (quizState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && quizState === 'playing') {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizState]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/quiz/start', { difficulty });
      setQuestions(response.data.questions);
      setQuizState('playing');
      setCurrentQuestion(0);
      setAnswers([]);
      setScore(0);
      setTimeLeft(30);
      toast.success('Quiz started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newAnswer = {
      question: questions[currentQuestion].question,
      selectedAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
      correct: isCorrect
    };

    setAnswers([...answers, newAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setTimeLeft(30);
    } else {
      finishQuiz([...answers, newAnswer]);
    }
  };

  const finishQuiz = async (finalAnswers) => {
    try {
      const correctAnswers = finalAnswers.filter(a => a.correct).length;
      const xpGained = Math.round((correctAnswers / questions.length) * 20); // 20 XP for perfect score
      
      console.log('Submitting quiz with data:', {
        quizId: Date.now().toString(),
        answers: finalAnswers,
        score: correctAnswers,
        totalQuestions: questions.length
      });
      
      const quizResponse = await apiClient.post('/api/quiz/submit', {
        quizId: Date.now().toString(),
        answers: finalAnswers,
        score: correctAnswers,
        totalQuestions: questions.length
      });

      console.log('Quiz submission response:', quizResponse.data);

      // Update progress with XP gained (optional - don't fail if this fails)
      try {
        await apiClient.post('/api/progress/update', {
          xpGained,
          skill: 'reading',
          level: Math.min(100, (correctAnswers / questions.length) * 100)
        });
        // Fetch latest progress after update
        if (typeof window !== 'undefined') {
          // If Progress page is mounted, trigger a refresh (optional: use a global state or event)
          // Or, just fetch and log for now
          const progress = await apiClient.get('/api/progress');
          console.log('Updated progress after quiz:', progress.data);
        }
      } catch (progressError) {
        console.log('Progress update failed (non-critical):', progressError);
      }
      
      setQuizState('finished');
      toast.success(`Quiz completed! You earned ${xpGained} XP!`);
    } catch (error) {
      console.error('Quiz submission error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    }
  };

  const resetQuiz = () => {
    setQuizState('start');
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setAnswers([]);
    setScore(0);
    setTimeLeft(30);
  };

  if (quizState === 'start') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Vocabulary Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Test your knowledge with vocabulary questions
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              onClick={startQuiz}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Play className="mr-2" size={20} />
                  Start Quiz
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (quizState === 'playing') {
    const question = questions[currentQuestion];
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className={`font-semibold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Score: {score}/{currentQuestion}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {question.question}
              </h2>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (quizState === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
          >
            <Award className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Complete!
            </h1>
            
            <div className="mb-8">
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {percentage}%
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {score} out of {questions.length} correct
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 mb-8">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    answer.correct
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Q{index + 1}: {answer.question}
                    </span>
                    {answer.correct ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-red-500" size={20} />
                    )}
                  </div>
                  {!answer.correct && (
                    <div className="mt-2 text-sm">
                      <div className="text-red-600 dark:text-red-400">
                        Your answer: {answer.selectedAnswer}
                      </div>
                      <div className="text-green-600 dark:text-green-400">
                        Correct answer: {answer.correctAnswer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={resetQuiz}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RotateCcw className="mr-2" size={20} />
              Take Another Quiz
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
