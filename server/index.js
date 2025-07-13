const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const User = require('./models/User');
const Translation = require('./models/Translation');
const Quiz = require('./models/Quiz');

const authRoutes = require('./routes/auth');
const translationRoutes = require('./routes/translation');
const quizRoutes = require('./routes/quiz');
const voiceRoutes = require('./routes/voice');
const progressRoutes = require('./routes/progress');
const flashcardRoutes = require('./routes/flashcards');
const communityRoutes = require('./routes/community');

const app = express();

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
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/community', communityRoutes);

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
  res.json({ message: 'LangBridge API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
