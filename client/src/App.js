import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import History from './pages/History';
import Features from './pages/Features';
import ProtectedRoute from './components/ProtectedRoute';
import apiClient from './utils/axios';
import About from './pages/About';
import Learn from './pages/LearnSinhala';
import Progress from './pages/Progress';
import Flashcards from './pages/Flashcards';
import Community from './pages/Community';
import TestAPI from './pages/TestAPI';
import Translate from './pages/Translate';
import AITutor from './pages/AITutor';
import AITutorFloatingButton from './components/AITutorFloatingButton';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const location = useLocation();
  return (
    <GoogleOAuthProvider clientId="533463475113-ilvo28h0f843dd4fho9m6qqf2qkn6vt0.apps.googleusercontent.com">
      <AuthProvider>
        <ThemeProvider>
            <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/quiz" element={
                    <ProtectedRoute>
                      <Quiz />
                    </ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<About />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/translate" element={<Translate />} />
                  <Route path="/progress" element={
                    <ProtectedRoute>
                      <Progress />
                    </ProtectedRoute>
                  } />
                  <Route path="/flashcards" element={
                    <ProtectedRoute>
                      <Flashcards />
                    </ProtectedRoute>
                  } />
                  <Route path="/community" element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  } />
                  <Route path="/test" element={<TestAPI />} />
                  <Route path="/ai-tutor" element={<AITutor />} />
                </Routes>
              </main>
              {location.pathname !== '/ai-tutor' && <AITutorFloatingButton />}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
