import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', nativeLanguage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Ensure nativeLanguage is valid and lowercase
      let nativeLanguage = formData.nativeLanguage ? formData.nativeLanguage.toLowerCase() : 'sinhala';
      if (!['sinhala', 'tamil', 'english'].includes(nativeLanguage)) nativeLanguage = 'sinhala';
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nativeLanguage
      };
      const result = await register(payload);
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background blob */}
      <motion.div
        className="absolute -top-32 -left-32 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-card p-10 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400">Join LangBridge and start your language journey!</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                className="input-field pl-10 pr-3 py-2"
                placeholder="Enter your username"
                />
              </div>
            </div>
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                className="input-field pl-10 pr-3 py-2"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                className="input-field pl-10 pr-3 py-2"
                placeholder="Enter your password"
              />
            </div>
          </div>
            <div>
            <label htmlFor="nativeLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Native Language</label>
                <input
              id="nativeLanguage"
              name="nativeLanguage"
              type="text"
                  required
              value={formData.nativeLanguage}
                  onChange={handleChange}
              className="input-field py-2"
              placeholder="e.g. Sinhala, Tamil, English"
                />
          </div>
            <button
              type="submit"
              disabled={isLoading}
            className="btn-primary w-full flex justify-center items-center gap-2"
            >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            Sign Up
            </button>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
