import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gradient-to-br from-gray-900 to-blue-950 text-white py-12 mt-8 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="flex items-center gap-2 mb-2">
          <img src="/logo.png" alt="LangBridge Logo" className="h-10 w-auto" />
          <span className="text-2xl font-extrabold tracking-tight">LangBridge</span>
        </div>
        <div className="flex gap-4 mt-2">
          <a href="mailto:support@langbridge.com" className="hover:text-blue-400 transition" aria-label="Email"><Mail className="w-5 h-5" /></a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
        <Link to="/about" className="hover:text-blue-400 transition font-semibold">About</Link>
        <Link to="/contact" className="hover:text-blue-400 transition font-semibold">Contact</Link>
        <Link to="/privacy" className="hover:text-blue-400 transition font-semibold">Privacy</Link>
        <Link to="/terms" className="hover:text-blue-400 transition font-semibold">Terms</Link>
      </div>
      <div className="text-gray-400 text-sm text-center md:text-right mt-6 md:mt-0">
        &copy; {new Date().getFullYear()} LangBridge. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer; 