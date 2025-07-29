const express = require('express');
const multer = require('multer');
const gtts = require('gtts');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads with memory storage for serverless
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Text to speech using gTTS
router.post('/text-to-speech', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'No text provided' });
    }

    const languageMap = {
      'en': 'en',
      'si': 'en', // Fallback to English for Sinhala
      'ta': 'ta',
      'sinhala': 'en',
      'tamil': 'ta',
      'english': 'en'
    };

    const ttsLang = languageMap[language] || 'en';
    const tts = new gtts(text, ttsLang);
    
    // For serverless environments, use /tmp directory
    const filename = `tts_${Date.now()}.mp3`;
    const filepath = path.join('/tmp', filename);

    // Create a promise-based wrapper for the TTS save
    const saveTTS = () => {
      return new Promise((resolve, reject) => {
        tts.save(filepath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(filepath);
          }
        });
      });
    };

    try {
      await saveTTS();
      
      // Send file and clean up
      res.download(filepath, filename, (err) => {
        // Clean up file after sending
        setTimeout(() => {
          try {
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
            }
          } catch (cleanupErr) {
            console.error('Error cleaning up TTS file:', cleanupErr);
          }
        }, 5000); // Clean up after 5 seconds
      });
    } catch (ttsError) {
      res.status(500).json({ 
        message: 'TTS generation failed', 
        error: ttsError.message 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Text-to-speech conversion failed', 
      error: error.message 
    });
  }
});

module.exports = router;
