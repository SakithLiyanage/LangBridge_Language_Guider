const express = require('express');
const multer = require('multer');
const gtts = require('gtts');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
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
    const filename = `tts_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, '../uploads', filename);

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    tts.save(filepath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'TTS generation failed', error: err.message });
      }

      // Send file and clean up after a delay
      res.download(filepath, filename, (err) => {
        if (!err) {
          setTimeout(() => {
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
            }
          }, 30000); // Clean up after 30 seconds
        }
      });
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Text-to-speech conversion failed', 
      error: error.message 
    });
  }
});

module.exports = router;
