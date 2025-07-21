import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages, 
  Mic, 
  MicOff, 
  Volume2, 
  Copy, 
  ArrowUpDown, 
  Sparkles, 
  BookOpen,
  Loader2,
  Check,
  AlertCircle,
  PlusCircle,
  Share2, ThumbsUp, ThumbsDown, Star
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import apiClient from '../utils/axios';
import LoadingSpinner, { WaveLoader } from './LoadingSpinner';
import AnimatedButton from './AnimatedButton';
import { useAuth } from '../contexts/AuthContext';

const TranslationInterface = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('sinhala');
  const [targetLang, setTargetLang] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
  const [examples, setExamples] = useState([]);
  const [showExamples, setShowExamples] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [vocabSaved, setVocabSaved] = useState(false);
  
  const recognition = useRef(null);
  const textareaRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [speechLang, setSpeechLang] = useState('en-US');

  const { user } = useAuth();

  const languages = [
    { code: 'sinhala', name: 'Sinhala', flag: '🇱🇰' },
    { code: 'tamil', name: 'Tamil', flag: '🇱🇰' },
    { code: 'english', name: 'English', flag: '🇺🇸' }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      setSpeechSupported(true);
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = speechLang;
      recognition.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setSourceText(finalTranscript);
        }
      };
      recognition.current.onerror = (e) => {
        setIsListening(false);
        setSpeechError('Voice recognition error: ' + e.error);
        toast.error('Voice recognition error. Please try again.');
      };
      recognition.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setSpeechSupported(false);
      setSpeechError('Web Speech API is not supported in this browser.');
    }
  }, [speechLang]);

  useEffect(() => {
    if (sourceText.trim() && sourceText.length > 2) {
      const timeoutId = setTimeout(() => {
        handleTranslate();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [sourceText, sourceLang, targetLang]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    try {
      let response;
      if (user) {
        response = await apiClient.post('/api/translation/translate', {
          text: sourceText,
          from: sourceLang,
          to: targetLang
        });
      } else {
        response = await apiClient.post('/api/translation/translate-guest', {
        text: sourceText,
        from: sourceLang,
        to: targetLang
      });
      }
      setTranslatedText(response.data.translatedText);
      if (response.data.saved) {
        toast.success('Translation saved to history!', { duration: 2000 });
      }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Translation failed');
        setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceInput = () => {
    setSpeechError('');
    if (!speechSupported || !recognition.current) {
      setSpeechError('Web Speech API is not supported in this browser.');
      toast.error('Voice recognition not supported in this browser');
      return;
    }
    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.lang = speechLang;
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handlePlayAudio = async (text, lang) => {
    try {
      setAudioError(false);
      const response = await apiClient.post('/api/translation/speech', { text, lang }, { responseType: 'blob' });
      const audioUrl = window.URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        setAudioError(true);
        toast.error('Audio playback failed');
      });
    } catch (error) {
      setAudioError(true);
      toast.error('Text-to-speech failed');
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleGenerateExamples = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text first');
      return;
    }
    
    setIsGeneratingExamples(true);
    try {
      const response = await apiClient.post('/api/translation/examples', {
        text: sourceText,
        lang: sourceLang
      });
      
      setExamples(response.data.examples);
      setShowExamples(true);
    } catch (error) {
      toast.error('Failed to generate examples');
    } finally {
      setIsGeneratingExamples(false);
    }
  };

  const handleSaveVocabulary = async () => {
    if (!user || !sourceText.trim() || !translatedText.trim()) return;
    try {
      const response = await apiClient.post('/api/translation/vocabulary', {
        word: sourceText.trim(),
        translation: translatedText.trim(),
        language: sourceLang,
        difficulty: 'medium'
      });
      setVocabSaved(true);
      setTimeout(() => setVocabSaved(false), 2000);
      toast.success('Saved to vocabulary!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save vocabulary');
    }
  };

  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setExamples([]);
    setShowExamples(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 relative">
      {!speechSupported && (
        <div className="mb-4 p-4 rounded-xl bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 flex items-center gap-3 shadow-lg">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div className="text-red-700 dark:text-red-300 font-semibold">
            Voice recognition is <span className="underline">not supported</span> in this browser.<br />
            Please use <span className="font-bold">Google Chrome</span> or <span className="font-bold">Microsoft Edge</span> for voice input.
          </div>
        </div>
      )}
      {/* Floating particles */}
      <div className="floating-elements">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-element w-4 h-4 bg-blue-500"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-8 relative z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow"
            >
              <Languages className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-gradient">
                AI Translator
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Powered by advanced neural networks
              </p>
            </div>
          </div>
          {(sourceText || translatedText) && (
            <AnimatedButton
              onClick={clearAll}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500"
            >
              Clear All
            </AnimatedButton>
          )}
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
              From
            </label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="input-field text-lg font-medium"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </motion.div>
          
          <motion.div
            className="mt-8"
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatedButton
              onClick={handleSwapLanguages}
              variant="ghost"
              size="lg"
              className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg hover:shadow-xl"
            >
              <ArrowUpDown className="w-6 h-6 text-blue-600" />
            </AnimatedButton>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
              To
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="input-field text-lg font-medium"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* Input/Output Area */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Source Text */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="input-field min-h-[250px] resize-none text-lg leading-relaxed"
                rows={10}
              />
              
              {/* Voice Input Button */}
              <motion.div
                className="absolute bottom-4 right-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button
                  onClick={handleVoiceInput}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-glow' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                  disabled={!speechSupported}
                  aria-pressed={isListening}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </motion.div>
            </div>
            
            {/* Source Text Controls */}
            <div className="flex items-center gap-2 mt-2">
              <AnimatedButton
                onClick={() => handlePlayAudio(sourceText, sourceLang)}
                variant="ghost"
                size="sm"
                disabled={!sourceText.trim()}
                className="text-blue-600"
              >
                <Volume2 className="w-5 h-5" />
              </AnimatedButton>
              
              <button
                onClick={handleGenerateExamples}
                disabled={!sourceText.trim() || isGeneratingExamples}
                className="btn-secondary disabled:opacity-50 flex items-center space-x-2"
              >
                {isGeneratingExamples ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Examples</span>
              </button>
            </div>
          </motion.div>

          {/* Translated Text */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative">
              <div className="input-field min-h-[250px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
                {isTranslating ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <WaveLoader variant="primary" />
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Translating with AI...
                    </span>
                  </div>
                ) : translatedText ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-gray-800 dark:text-gray-100 text-lg leading-relaxed"
                  >
                    {translatedText}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Languages className="w-12 h-12 mb-4 opacity-50" />
                    <span className="text-lg font-medium">Translation will appear here...</span>
                  </div>
                )}
              </div>
            </div>
            {/* Translation Controls */}
            <div className="flex items-center gap-2 mt-2">
              <AnimatedButton
                onClick={() => handlePlayAudio(translatedText, targetLang)}
                variant="ghost"
                size="sm"
                disabled={!translatedText.trim()}
                className="text-green-600"
              >
                <Volume2 className="w-5 h-5" />
              </AnimatedButton>
              <button
                onClick={() => handleCopy(translatedText)}
                disabled={!translatedText.trim()}
                className="btn-secondary disabled:opacity-50 flex items-center space-x-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'AI Translation',
                      text: `"${sourceText}" → "${translatedText}"`,
                      url: window.location.href
                    }).then(() => toast.success('Shared!')).catch(() => {});
                  } else {
                    toast('Use the links below to share!', { icon: '🔗' });
                  }
                }}
                disabled={!translatedText.trim()}
                className="btn-secondary disabled:opacity-50 flex items-center space-x-2"
                title="Share translation"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
            {/* Fallback Share Links */}
            {translatedText && !navigator.share && (
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <a
                  href={`mailto:?subject=AI Translation&body=${encodeURIComponent('"' + sourceText + '" → "' + translatedText + '"')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Email
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('AI Translation: "' + sourceText + '" → "' + translatedText + '"')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Twitter
                </a>
              </div>
            )}
            {/* Feedback/Rating Controls */}
            {translatedText && (
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rate this translation:</span>
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    onClick={() => toast.success(`You rated this translation ${star} star${star > 1 ? 's' : ''}!`)}
                    className="focus:outline-none"
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star className="w-5 h-5" style={{ color: '#fbbf24' }} />
                  </button>
                ))}
                <button
                  onClick={() => toast.success('You gave positive feedback!')}
                  className="ml-2 focus:outline-none"
                  title="Thumbs up"
                >
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                </button>
                <button
                  onClick={() => toast('You gave negative feedback.', { icon: '👎' })}
                  className="focus:outline-none"
                  title="Thumbs down"
                >
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Examples Section */}
        <AnimatePresence>
          {showExamples && examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  AI-Generated Examples
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {examples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-premium p-6 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {sourceLang}:
                        </span>
                        <p className="text-gray-800 dark:text-gray-100 mt-1">
                          {example.original}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {targetLang}:
                        </span>
                        <p className="text-purple-700 dark:text-purple-300 mt-1">
                          {example.translation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Error Message */}
        {audioError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              Audio playback is currently unavailable. Please try again later.
            </p>
          </motion.div>
        )}
      </motion.div>
      {user && translatedText && (
        <div className="flex justify-end mt-2">
          <motion.button
            onClick={handleSaveVocabulary}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.08 }}
            className={
              `relative flex items-center px-6 py-3 rounded-full shadow-xl bg-gradient-to-r from-green-400/80 to-blue-500/80 backdrop-blur-lg border border-white/30
              text-white font-semibold text-lg transition-all duration-300
              ${vocabSaved ? 'bg-green-500/90 to-green-600/90' : ''}`
            }
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              border: '1.5px solid rgba(255,255,255,0.18)',
              minWidth: 180
            }}
            disabled={vocabSaved}
          >
            <span className="mr-2">
              {vocabSaved ? <Check className="w-6 h-6 animate-bounce text-white" /> : <PlusCircle className="w-6 h-6 text-white" />}
            </span>
            {vocabSaved ? 'Added!' : 'Add to Vocabulary'}
            <span className="absolute -right-3 -top-3">
              {vocabSaved && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2, opacity: 0 }} transition={{ duration: 0.7 }} className="w-6 h-6 rounded-full bg-green-400/80 blur-lg" />}
            </span>
          </motion.button>
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Speech Language:
        </label>
        <select
          value={speechLang}
          onChange={e => setSpeechLang(e.target.value)}
          className="input-field text-sm w-56 max-w-xs rounded-xl bg-white/10 dark:bg-gray-800/40 backdrop-blur border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          disabled={!speechSupported}
        >
          <option value="en-US">English (US)</option>
          <option value="si-LK">Sinhala</option>
          <option value="ta-LK">Tamil</option>
        </select>
        {!speechSupported && (
          <span className="text-xs text-red-500 ml-2">Not supported</span>
        )}
      </div>
      {speechError && <div className="text-xs text-red-500 mb-2">{speechError}</div>}
    </div>
  );
};

export default TranslationInterface;
