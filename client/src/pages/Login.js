import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import Modal from '../components/Modal';
import axios from '../utils/axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOTP, setForgotOTP] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handlers
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      if (forgotStep === 1) {
        await axios.post('/api/auth/forgot-password', { email: forgotEmail });
        toast.success('OTP sent to your email');
        setForgotStep(2);
      } else if (forgotStep === 2) {
        await axios.post('/api/auth/verify-otp', { email: forgotEmail, otp: forgotOTP });
        toast.success('OTP verified');
        setForgotStep(3);
      } else if (forgotStep === 3) {
        await axios.post('/api/auth/reset-password', { email: forgotEmail, otp: forgotOTP, newPassword: forgotNewPassword });
        toast.success('Password reset successful!');
        setShowForgot(false);
        setForgotStep(1);
        setForgotEmail('');
        setForgotOTP('');
        setForgotNewPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setForgotLoading(false);
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
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
          <p className="text-gray-600 dark:text-gray-400">Welcome back to LangBridge</p>
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                const result = await loginWithGoogle(credentialResponse.credential);
                if (result.success) {
                  toast.success('Google login successful!');
                  navigate('/dashboard');
                } else {
                  toast.error(result.error);
                }
              } else {
                toast.error('Google login failed.');
              }
            }}
            onError={() => toast.error('Google login failed.')}
            size="large"
            text="signin_with"
            shape="pill"
            theme="outline"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                autoComplete="email"
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10 py-2"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline focus:outline-none"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            Sign In
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </form>
        <Modal isOpen={showForgot} onClose={() => { setShowForgot(false); setForgotStep(1); setForgotEmail(''); setForgotOTP(''); setForgotNewPassword(''); }}>
          <h3 className="text-lg font-bold mb-4 text-center">Reset Password</h3>
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            {forgotStep === 1 && (
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="input-field w-full"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
                <button type="submit" className="btn-primary w-full mt-4" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            )}
            {forgotStep === 2 && (
              <div>
                <label className="block text-sm font-medium mb-1">Enter OTP</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={forgotOTP}
                  onChange={e => setForgotOTP(e.target.value)}
                  required
                  placeholder="Enter the OTP sent to your email"
                />
                <button type="submit" className="btn-primary w-full mt-4" disabled={forgotLoading}>
                  {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}
            {forgotStep === 3 && (
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="input-field w-full"
                  value={forgotNewPassword}
                  onChange={e => setForgotNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                />
                <button type="submit" className="btn-primary w-full mt-4" disabled={forgotLoading}>
                  {forgotLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            )}
          </form>
        </Modal>
      </motion.div>
    </div>
  );
}
