const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = '533463475113-ilvo28h0f843dd4fho9m6qqf2qkn6vt0.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// Configure nodemailer (use your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    let { username, email, password, nativeLanguage } = req.body;
    
    // Normalize nativeLanguage
    const allowedLanguages = ['sinhala', 'tamil', 'english'];
    if (!nativeLanguage || !allowedLanguages.includes((nativeLanguage + '').toLowerCase())) {
      nativeLanguage = 'sinhala';
    } else {
      nativeLanguage = nativeLanguage.toLowerCase();
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password, nativeLanguage });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        nativeLanguage: user.nativeLanguage
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        nativeLanguage: user.nativeLanguage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google Login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Missing Google credential' });
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;
    if (!email) return res.status(400).json({ message: 'Google account has no email' });
    // Find or create user
    let user = await User.findOne({ $or: [ { googleId }, { email } ] });
    if (!user) {
      user = new User({
        username: name || email.split('@')[0],
        email,
        googleId,
        password: undefined, // No password for Google users
        nativeLanguage: 'sinhala'
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        nativeLanguage: user.nativeLanguage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

// Forgot Password - send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user with that email' });
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();
    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It expires in 15 minutes.`
    });
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ message: 'OTP not requested' });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    res.json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ message: 'OTP not requested' });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
