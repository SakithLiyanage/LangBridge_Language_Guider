# Language Translator & Bilingual Learning Hub

A modern, full-stack web app for mastering Sinhala, English, and Tamil, powered by AI translation, interactive courses, quizzes, vocabulary management, audio, and cultural learning.

## 🌟 Features

### Comprehensive Multilingual Learning
- **Full Interactive Syllabuses:**
  - Complete, step-based courses for Sinhala, English, and Tamil
  - Each language includes:
    - Alphabet (letters, pronunciation, tracing)
    - Basic Words & Phrases
    - Basic Grammar
    - Speaking Test (pronunciation practice)
    - Interactive Activities (matching, fill-in-the-blank, drag-and-drop, listening)
    - Advanced Vocabulary (with examples and activities)
    - Conversation Practice (real dialogues, role-play)
    - Reading Comprehension (passages, stories, questions)
    - Writing Practice (guided prompts, examples, tips)
    - Cultural Context (traditions, festivals, honorifics, idioms)
    - Advanced Grammar (complex structures, passive, reported speech)
    - Literature & Poetry (classical and modern works)
- **Multi-language Support:**
  - Seamless switching and learning for Sinhala, English, and Tamil
  - All modules and activities are available for each language

### Core Learning & Translation
- **Bilingual Learning Hub:**
  - Interactive, visually aligned UI for all languages
  - Modern, responsive design with clear progress indicators
- **AI-Powered Translation:**
  - Translate instantly between Sinhala, English, and Tamil
  - Voice input and audio output for natural practice
- **Vocabulary Management:**
  - Save, review, and delete vocabulary
  - Track your learning progress
- **Quizzes & Examples:**
  - AI-generated quizzes from your vocabulary
  - Example sentences for real-life usage
- **Audio & Speech Recognition:**
  - Listen to correct pronunciation
  - Practice speaking with browser-based speech recognition
- **Cultural & Advanced Learning:**
  - Idioms, honorifics, and cultural notes
  - Advanced grammar and real-world language tips

### Gamification & Progress Tracking
- **XP System & Achievements:**
  - Earn experience points for completing lessons and activities
  - Unlock badges and achievements for milestones
  - Track learning streaks and daily goals
- **Progress Dashboard:**
  - Visual progress tracking across all skills
  - Skill mastery levels (speaking, listening, reading, writing)
  - Personalized learning recommendations
- **Leaderboards:**
  - Compete with other learners
  - View top performers and achievements

### Spaced Repetition Flashcards
- **Smart Review System:**
  - Spaced repetition algorithm for optimal learning
  - Custom flashcard creation and management
  - Import/export functionality for vocabulary
- **Review Statistics:**
  - Track mastery levels and review history
  - Due cards focus for efficient learning
  - Performance analytics and insights

### Community & Social Features
- **Discussion Forums:**
  - Ask questions and share knowledge
  - Create and participate in discussions
  - Search and filter topics by language/category
- **User-Generated Content:**
  - Create and share learning resources
  - Rate and review community content
  - Resource library with vocabulary, grammar, and exercises
- **Trending Content:**
  - Discover popular discussions and resources
  - Real-time community activity feed

### Advanced Learning Tools
- **Personalized Learning Paths:**
  - Adaptive recommendations based on progress
  - Customizable learning preferences
  - Goal setting and tracking
- **Accessibility Features:**
  - High contrast mode
  - Screen reader support
  - Responsive design for all devices

## 📚 Course Structure Overview

Each language (Sinhala, English, Tamil) includes:
- **Alphabet**: Learn letters, sounds, and tracing
- **Basic Words & Grammar**: Build foundational vocabulary and grammar
- **Speaking & Listening**: Practice pronunciation and comprehension
- **Interactive Activities**: Matching, fill-in-the-blank, drag-and-drop, listening
- **Advanced Modules**: Vocabulary, conversation, reading, writing, culture, grammar, literature
- **Cultural Context**: Learn about traditions, festivals, and real-world usage
- **Progress Tracking**: Visual indicators and XP for every step

## 🚀 Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB with Mongoose ODM
- **APIs:** Google Translate (unofficial), Google TTS, Web Speech API
- **Authentication:** JWT with bcrypt password hashing
- **Real-time Features:** WebSocket support for live updates

## 🏁 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/language-translator.git
   cd language-translator
   ```
2. **Install dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. **Start the development servers:**
   - **Backend:**
     ```bash
     cd server && npm start
     ```
   - **Frontend:**
     ```bash
     cd client && npm start
     ```
4. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## 🧭 Usage

### Getting Started
- **Learn:** Go to the [Learn](/learn) page to start the Sinhala or English interactive course.
- **Translate:** Use the home page or dashboard to translate between Sinhala, English, and Tamil.
- **Quizzes:** Test your vocabulary and track your progress.
- **Audio:** Listen to and practice pronunciation for every word and sentence.

### New Features
- **Progress Tracking:** Visit the [Progress](/progress) page to view your learning statistics, achievements, and leaderboard.
- **Flashcards:** Use the [Flashcards](/flashcards) page for spaced repetition vocabulary learning.
- **Community:** Join discussions and share resources on the [Community](/community) page.
- **Dashboard:** View comprehensive stats and progress overview on your dashboard.

### Learning Path
1. **Start Learning:** Begin with the alphabet and basic vocabulary
2. **Practice Regularly:** Use flashcards and quizzes to reinforce learning
3. **Track Progress:** Monitor your XP, achievements, and skill levels
4. **Engage with Community:** Share knowledge and learn from others
5. **Set Goals:** Establish daily and weekly learning targets

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## 📄 License
MIT

---

**Made with ❤️ for language learners and educators.** 

## Password Reset Email Setup

To enable password reset via email OTP, add the following to your `server/.env` file:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```

- Use a Gmail account or another provider supported by nodemailer.
- For Gmail, you may need to use an App Password if 2FA is enabled. 