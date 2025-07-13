import React from 'react';
import { motion } from 'framer-motion';
import TranslationInterface from '../components/TranslationInterface';

const Translate = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Language Translator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Translate between Sinhala, Tamil, and English with advanced features including voice input, 
            text-to-speech, and vocabulary saving.
          </p>
        </motion.div>

        {/* Translation Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TranslationInterface />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Translation Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎤</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Voice Input
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Speak your text and get instant translation with voice recognition technology.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Text-to-Speech
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Listen to pronunciations with high-quality text-to-speech output.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Vocabulary Builder
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Save important translations to your personal vocabulary for later review.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Language Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Supported Languages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🇱🇰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sinhala
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Official language of Sri Lanka with rich cultural heritage.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🇱🇰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tamil
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Classical language with deep historical roots in South Asia.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🇺🇸</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                English
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Global language for international communication and learning.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Translate; 