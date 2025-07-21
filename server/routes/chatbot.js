const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log('Loaded OpenRouter API Key:', OPENROUTER_API_KEY); // Debug print

// POST /api/chatbot/chat
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });
  try {
    const requestBody = {
      model: 'openrouter/auto',
      messages: [
        { role: 'system', content: 'You are a helpful language learning assistant.' },
        { role: 'user', content: message }
      ],
      max_tokens: 1000
    };
    console.log('OpenRouter request body:', requestBody);
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    console.log('OpenRouter request headers:', {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    }); // Debug print
    const reply = response.data.choices?.[0]?.message?.content || 'Sorry, I could not generate a reply.';
    res.json({ reply });
  } catch (err) {
    if (err.response) {
      console.error('Chatbot error details:', {
        status: err.response.status,
        data: err.response.data
      });
      res.status(500).json({ error: 'Chatbot error', details: err.response.data });
    } else {
      console.error('Chatbot error details:', err.message);
      res.status(500).json({ error: 'Chatbot error', details: err.message });
    }
  }
});

module.exports = router; 