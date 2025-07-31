const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const User = require('./models/User');
const Translation = require('./models/Translation');
const Quiz = require('./models/Quiz');
const Progress = require('./models/Progress');

const authRoutes = require('./routes/auth');
const translationRoutes = require('./routes/translation');
const quizRoutes = require('./routes/quiz');
const voiceRoutes = require('./routes/voice');
const progressRoutes = require('./routes/progress');
const flashcardRoutes = require('./routes/flashcards');
const communityRoutes = require('./routes/community');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

// Check required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.log('Please set these variables in your Vercel environment');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/langbridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Stats endpoint for frontend
app.get('/api/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const translationCount = await Translation.countDocuments();
    // TODO: Calculate real accuracy and rating if available
    const accuracy = 98; // Placeholder
    const rating = 5.0; // Placeholder
    res.json({
      users: userCount,
      translations: translationCount,
      accuracy,
      rating
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'LangBridge API is running!',
    timestamp: new Date().toISOString(),
    env: {
      mongodb: process.env.MONGODB_URI ? 'Configured' : 'Missing',
      jwt: process.env.JWT_SECRET ? 'Configured' : 'Missing',
      email: process.env.EMAIL_USER ? 'Configured' : 'Missing',
      openrouter: process.env.OPENROUTER_API_KEY ? 'Configured' : 'Missing'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
