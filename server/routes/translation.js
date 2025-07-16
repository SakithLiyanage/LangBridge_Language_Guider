const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Translation = require('../models/Translation');
const User = require('../models/User');
const Progress = require('../models/Progress');
const stream = require('stream');

const router = express.Router();

const mapLangCode = (lang) => {
  if (lang === 'english') return 'en';
  if (lang === 'sinhala') return 'si';
  if (lang === 'tamil') return 'ta';
  return lang;
};

// Google Translate Unofficial Free API
const translateText = async (text, fromLang, toLang) => {
  try {
    const apiUrl = 'https://translate.googleapis.com/translate_a/single';
    const params = {
      client: 'gtx',
      sl: mapLangCode(fromLang),
      tl: mapLangCode(toLang),
      dt: 't',
      q: text
    };
    const response = await axios.get(apiUrl, { params });
    // The response is a nested array, translation is in [0][0][0]
    return response.data[0][0][0];
  } catch (error) {
    console.error('Google Translate error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'Translation service error');
  }
};

// Guest translation endpoint (no auth required)
router.post('/translate-guest', async (req, res) => {
  try {
    const { text, from, to } = req.body;
    
    if (!text || !from || !to) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Simple mock translation for development
    const translatedText = await translateText(text, from, to);
    
    res.json({ 
      translatedText,
      saved: false 
    });
  } catch (error) {
    console.error('Guest translation error:', error);
    res.status(500).json({ message: error.message || 'Translation failed' });
  }
});

// Authenticated translation endpoint
router.post('/translate', auth, async (req, res) => {
  try {
    const { text, from, to } = req.body;
    
    if (!text || !from || !to) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const translatedText = await translateText(text, from, to);
    
    // Save to history for authenticated users
    try {
      const translation = new Translation({
        userId: req.user.id,
        originalText: text,
        translatedText,
        fromLang: from,
        toLang: to
      });
      
      await translation.save();
      
      // Update progress
      let progress = await Progress.findOne({ userId: req.user.id });
      if (!progress) {
        progress = new Progress({ userId: req.user.id });
      }
      
      // Add XP for translation
      progress.xpPoints = (progress.xpPoints || 0) + 10;
      progress.currentLevel = progress.xpPoints < 100 ? 'beginner' : progress.xpPoints < 500 ? 'intermediate' : 'advanced';
      progress.lastActivityDate = new Date();
      
      await progress.save();
    } catch (saveError) {
      console.error('Error saving translation:', saveError);
    }
    
    res.json({ 
      translatedText,
      saved: true 
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: error.message || 'Translation failed' });
  }
});

// Get translation history
router.get('/history', auth, async (req, res) => {
  try {
    console.log('Fetching translation history for user:', req.user.id);
    
    const translations = await Translation.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50);
    
    console.log('Found translations:', translations.length);
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translation history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

// Speech synthesis endpoint using Google Translate TTS
router.post('/speech', async (req, res) => {
  try {
    const { text, lang } = req.body;
    if (!text || !lang) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const ttsUrl = 'https://translate.google.com/translate_tts';
    const params = {
      ie: 'UTF-8',
      q: text,
      tl: mapLangCode(lang),
      client: 'tw-ob'
    };
    const response = await axios.get(ttsUrl, {
      params,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    res.set('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ message: error.message || 'Text-to-speech failed' });
  }
});

// Generate examples endpoint using Google Translate
router.post('/examples', async (req, res) => {
  try {
    const { text, lang } = req.body;
    if (!text || !lang) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // More practical, real-life usage templates
    const usageTemplates = [
      `I need to ${text} every day.`,
      `Could you please ${text} for me?`,
      `Many people find it hard to ${text}.`,
      `Children love to ${text} in the park.`,
      `It's important to learn how to ${text}.`,
      `Do you know how to ${text}?`,
      `Let's try to ${text} together.`,
      `Sometimes I forget to ${text}.`,
      `Why do you want to ${text}?`,
      `The best way to improve is to ${text} often.`,
      `I saw someone ${text} yesterday.`,
      `You should never ${text} without asking.`,
      `Can you teach me to ${text}?`,
      `What happens if you don't ${text}?`,
      `I wish I could ${text} better.`,
      `Is it easy to ${text}?`,
      `When did you learn to ${text}?`,
      `People usually ${text} when they are happy.`,
      `Have you ever tried to ${text}?`,
      `I will ${text} as soon as possible.`
    ];
    // Pick 3 random templates
    const selected = usageTemplates.sort(() => 0.5 - Math.random()).slice(0, 3);
    // Translate each template to the target language
    const targetLang = lang === 'english' ? 'sinhala' : 'english';
    const examples = await Promise.all(selected.map(async (sentence) => {
      const translated = await translateText(sentence, lang, targetLang);
      return {
        original: sentence,
        translation: translated
      };
    }));
    res.json({ examples });
  } catch (error) {
    console.error('Examples generation error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate examples' });
  }
});

// Save a vocabulary word (auth required)
router.post('/vocabulary', auth, async (req, res) => {
  try {
    const { word, translation, language, difficulty } = req.body;
    if (!word || !translation || !language) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found for userId:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    // Prevent duplicates
    if (user.vocabulary.some(v => v.word === word && v.language === language)) {
      return res.status(400).json({ message: 'Word already in vocabulary' });
    }
    user.vocabulary.push({ word, translation, language, difficulty });
    await user.save();
    res.json({ message: 'Word added to vocabulary', vocabulary: user.vocabulary });
  } catch (error) {
    console.error('Add vocabulary error:', error);
    res.status(500).json({ message: error.message || 'Failed to add vocabulary' });
  }
});

// Get user vocabulary (auth required)
router.get('/vocabulary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ vocabulary: user.vocabulary || [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vocabulary', error: error.message });
  }
});

// Delete a vocabulary word (auth required)
router.delete('/vocabulary', auth, async (req, res) => {
  try {
    const { word, language } = req.body;
    if (!word || !language) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const userDoc = await User.findById(req.user.id);
    if (!userDoc) {
      console.error('User not found for userId:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    userDoc.vocabulary = userDoc.vocabulary.filter(v => !(v.word === word && v.language === language));
    await userDoc.save();
    res.json({ message: 'Word removed from vocabulary', vocabulary: userDoc.vocabulary });
  } catch (error) {
    console.error('Delete vocabulary error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete vocabulary' });
  }
});

module.exports = router;
