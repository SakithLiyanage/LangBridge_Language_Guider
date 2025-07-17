import React from 'react';
import { motion } from 'framer-motion';
import TranslationInterface from '../components/TranslationInterface';
import { useState } from 'react';
import apiClient from '../utils/axios';
import { FileText, Loader2, XCircle, CheckCircle, UploadCloud, Languages, Award } from 'lucide-react';

const Translate = () => {
  const [docFile, setDocFile] = useState(null);
  const [docTargetLang, setDocTargetLang] = useState('english');
  const [docResult, setDocResult] = useState(null);
  const [docLoading, setDocLoading] = useState(false);
  const handleDocUpload = async (e) => {
    setDocFile(e.target.files[0]);
    setDocResult(null);
  };
  const handleDocClear = () => {
    setDocFile(null);
    setDocResult(null);
  };
  const handleDocTranslate = async () => {
    if (!docFile) return;
    setDocLoading(true);
    setDocResult(null);
    const formData = new FormData();
    formData.append('file', docFile);
    formData.append('targetLang', docTargetLang);
    try {
      const res = await apiClient.post('/api/translation/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDocResult(res.data);
    } catch (error) {
      setDocResult({ error: error.response?.data?.message || 'Failed to process document' });
    } finally {
      setDocLoading(false);
    }
  };

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

        {/* Modern Document Upload Section (moved below main translation) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Upload Document</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition">
                    <UploadCloud className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 dark:text-blue-200 font-medium">Choose File</span>
                    <input type="file" accept=".pdf,.docx,.txt" onChange={handleDocUpload} className="hidden" />
                  </label>
                  {docFile && (
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-700 dark:text-gray-200">{docFile.name}</span>
                      <button onClick={handleDocClear} className="ml-1 text-red-500 hover:text-red-700"><XCircle className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Target Language</label>
                <select value={docTargetLang} onChange={e => setDocTargetLang(e.target.value)} className="input-field">
                  <option value="english">English</option>
                  <option value="sinhala">Sinhala</option>
                  <option value="tamil">Tamil</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 mt-4 md:mt-0">
                <button className="btn-primary w-full md:w-auto" onClick={handleDocTranslate} disabled={!docFile || docLoading}>
                  {docLoading ? <Loader2 className="animate-spin inline w-5 h-5 mr-2" /> : <CheckCircle className="inline w-5 h-5 mr-2" />}
                  {docLoading ? 'Processing...' : 'Translate Document'}
                </button>
              </div>
            </div>
            {docResult && (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow flex flex-col">
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Extracted Text</h4>
                  <div className="text-sm max-h-40 overflow-y-auto whitespace-pre-wrap text-gray-700 dark:text-gray-200">{docResult.extractedText}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow flex flex-col">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-200"><Languages className="w-4 h-4" /> Translated Text</h4>
                  <div className="text-sm max-h-40 overflow-y-auto whitespace-pre-wrap text-blue-900 dark:text-blue-100">{docResult.translatedText}</div>
                </div>
              </div>
            )}
          </div>
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