# LangBridge Language Translator

<img width="5000" height="2500" alt="langbridge" src="https://github.com/user-attachments/assets/5b58385c-ef61-4c73-886e-fafd4a2a2b9a" />

A modern, full-stack web app for translating between Sinhala, English, and Tamil, with advanced features for language learners: instant translation, document translation, voice input, text-to-speech, vocabulary management, flashcards, quizzes, XP system, password reset, AI examples, feedback system, and community features.

## 🌟 Features

### Core Translation
- **Instant Text Translation:**
  - Translate between Sinhala, English, and Tamil instantly.
  - Modern, responsive UI with dark mode support.
  - Copy, share, and save translations to vocabulary.
  - Rate translations and provide feedback.
- **Document Translation:**
  - Upload PDF, DOCX, or TXT files and translate the entire document.
  - Extracted and translated text are shown side-by-side.
  - XP is awarded for document translations.
  - Handles large documents with paragraph-by-paragraph processing.
- **Voice Input:**
  - Speak your text and get instant translation using browser speech recognition.
- **Text-to-Speech:**
  - Listen to translations with high-quality audio output.

### AI-Powered Features
- **AI-Generated Examples:**
  - Get contextual examples for any word or phrase.
  - Examples are translated to your target language.
- **AI-Generated Quizzes:**
  - Personalized quizzes based on your vocabulary and translation history.
  - Dynamic question generation using OpenRouter AI.
- **Translation Feedback System:**
  - Rate translations with 5-star system and thumbs up/down.
  - View positive feedback from other users on the dashboard.

### Vocabulary & Learning Tools
- **Vocabulary Builder:**
  - Save, review, and delete vocabulary words.
  - Track your vocabulary progress.
  - Search and filter vocabulary entries.
- **Spaced Repetition Flashcards:**
  - Smart review system for efficient vocabulary learning.
  - Track mastery and review history.
- **Quizzes:**
  - AI-generated quizzes based on your vocabulary and history.
  - Earn XP for quiz participation.
  - Track quiz performance and history.

### Progress & Gamification
- **XP System:**
  - Earn XP for translations, document uploads, quizzes, and flashcards.
  - Track your progress and level up (beginner, intermediate, advanced).
- **Achievements & Streaks:**
  - Earn badges and maintain learning streaks.
  - Streak counter starts from 1 for active users.
- **Progress Dashboard:**
  - Visualize your XP, streaks, and achievements.
  - View positive user feedback and testimonials.
- **Leaderboard:**
  - Compete with other users and see top performers.

### History & Management
- **Translation History:**
  - View all your past translations with search and filter.
  - Sort by date, language, or relevance.
  - Clear entire history with one click.
- **Quiz History:**
  - Track all quiz attempts and scores.
  - Search and filter quiz history.
- **Advanced Search & Filter:**
  - Search through translations and quizzes by text content.
  - Filter by date range and sort options.

### Community
- **Discussion Forums:**
  - Ask questions, share knowledge, and participate in discussions.
  - Search and filter topics by language/category.
- **User-Generated Content:**
  - Share and rate learning resources.

### Account & Security
- **Google Login:**
  - Sign in/up with Google for quick access.
  - Secure OAuth integration.
- **Password Reset:**
  - Secure email OTP-based password reset flow.
  - 3-step verification process (email → OTP → new password).

## 🚀 Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **APIs:** Google Translate (unofficial), Google TTS, Web Speech API, OpenRouter AI
- **Authentication:** JWT, bcrypt, Google OAuth
- **File Processing:** Multer, pdf-parse, mammoth
- **Email:** Nodemailer for password reset

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
     OPENROUTER_API_KEY=your_openrouter_api_key
     GOOGLE_CLIENT_ID=your_google_oauth_client_id
     ```
   - For Gmail, use an App Password if 2FA is enabled.
   - Get OpenRouter API key from [openrouter.ai](https://openrouter.ai)
   - Set up Google OAuth in Google Cloud Console

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
- **AI Examples:** Get contextual examples for any word or phrase.
- **Vocabulary:** Save words to your vocabulary list for review and flashcards.
- **Flashcards:** Use the flashcards page for spaced repetition learning.
- **Quizzes:** Take AI-generated quizzes based on your vocabulary and history.
- **Progress:** View your XP, streaks, and achievements on the dashboard.
- **History:** Search, filter, and manage your translation and quiz history.
- **Community:** Join discussions and share resources on the community page.
- **Password Reset:** Use the "Forgot Password?" link on the login page for secure email OTP-based password reset.

## 🔒 Email Setup

To enable password reset via email OTP, add the following to your `server/.env` file:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```
- Use a Gmail account or another provider supported by nodemailer.
- For Gmail, you may need to use an App Password if 2FA is enabled.

## 🔑 API Keys Setup

### OpenRouter AI
- Sign up at [openrouter.ai](https://openrouter.ai)
- Get your API key and add to `server/.env`:
  ```
  OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
  ```

### Google OAuth
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project and enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized JavaScript origins: `http://localhost:3000`, `http://127.0.0.1:3000`
- Add the client ID to `server/.env`:
  ```
  GOOGLE_CLIENT_ID=your-google-client-id
  ```

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a pull request

## 📄 License
MIT

---

**Made with ❤️ for language learners and educators.** 
