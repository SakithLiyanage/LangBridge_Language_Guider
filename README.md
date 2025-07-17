# LangBridge Language Translator

A modern, full-stack web app for translating between Sinhala, English, and Tamil, with advanced features for language learners: instant translation, document translation, voice input, text-to-speech, vocabulary management, flashcards, quizzes, XP system, password reset, and community features.

## 🌟 Features

### Core Translation
- **Instant Text Translation:**
  - Translate between Sinhala, English, and Tamil instantly.
  - Modern, responsive UI with dark mode support.
- **Document Translation:**
  - Upload PDF, DOCX, or TXT files and translate the entire document.
  - Extracted and translated text are shown side-by-side.
  - XP is awarded for document translations.
- **Voice Input:**
  - Speak your text and get instant translation using browser speech recognition.
- **Text-to-Speech:**
  - Listen to translations with high-quality audio output.

### Vocabulary & Learning Tools
- **Vocabulary Builder:**
  - Save, review, and delete vocabulary words.
  - Track your vocabulary progress.
- **Spaced Repetition Flashcards:**
  - Smart review system for efficient vocabulary learning.
  - Track mastery and review history.
- **Quizzes:**
  - AI-generated quizzes based on your vocabulary and history.
  - Earn XP for quiz participation.

### Progress & Gamification
- **XP System:**
  - Earn XP for translations, document uploads, quizzes, and flashcards.
  - Track your progress and level up (beginner, intermediate, advanced).
- **Achievements & Streaks:**
  - Earn badges and maintain learning streaks.
- **Progress Dashboard:**
  - Visualize your XP, streaks, and achievements.
- **Leaderboard:**
  - Compete with other users and see top performers.

### Community
- **Discussion Forums:**
  - Ask questions, share knowledge, and participate in discussions.
  - Search and filter topics by language/category.
- **User-Generated Content:**
  - Share and rate learning resources.

### Account & Security
- **Google Login:**
  - Sign in/up with Google for quick access.
- **Password Reset:**
  - Secure email OTP-based password reset flow.

## 🚀 Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **APIs:** Google Translate (unofficial), Google TTS, Web Speech API
- **Authentication:** JWT, bcrypt

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
3. **Configure environment variables:**
   - In `server/.env`, add:
     ```
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_password_or_app_password
     JWT_SECRET=your_jwt_secret
     MONGODB_URI=your_mongodb_connection_string
     ```
   - For Gmail, use an App Password if 2FA is enabled.
4. **Start the development servers:**
   - **Backend:**
     ```bash
     cd server && npm start
     ```
   - **Frontend:**
     ```bash
     cd client && npm start
     ```
5. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## 🧭 Usage

- **Translate Text:** Use the main translation interface to translate between Sinhala, English, and Tamil.
- **Translate Documents:** Upload PDF, DOCX, or TXT files and translate the content. XP is awarded for each document translation.
- **Voice Input:** Click the microphone icon to speak and translate.
- **Text-to-Speech:** Click the speaker icon to listen to translations.
- **Vocabulary:** Save words to your vocabulary list for review and flashcards.
- **Flashcards:** Use the flashcards page for spaced repetition learning.
- **Quizzes:** Take quizzes generated from your vocabulary and history.
- **Progress:** View your XP, streaks, and achievements on the dashboard.
- **Community:** Join discussions and share resources on the community page.
- **Password Reset:** Use the "Forgot Password?" link on the login page for secure email OTP-based password reset.

## 🔒 Password Reset Email Setup

To enable password reset via email OTP, add the following to your `server/.env` file:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```
- Use a Gmail account or another provider supported by nodemailer.
- For Gmail, you may need to use an App Password if 2FA is enabled.

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## 📄 License
MIT

---

**Made with ❤️ for language learners and educators.** 