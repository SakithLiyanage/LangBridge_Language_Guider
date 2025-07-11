import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ModernHero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative flex flex-col justify-center items-center min-h-[90vh] w-full overflow-hidden">
      {/* Animated SVG Blobs */}
      <svg className="absolute top-0 left-0 w-[60vw] h-[60vw] opacity-30 -z-10" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(300,300)">
          <motion.path
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            d="M120,-156.6C154.2,-128.2,176.2,-86.2,181.2,-43.7C186.2,-1.2,174.2,41.8,153.2,80.2C132.2,118.6,102.2,152.4,63.2,170.2C24.2,188,-24.8,189.8,-67.2,175.2C-109.6,160.6,-145.4,129.6,-168.2,89.2C-191,48.8,-200.8,-1,-186.2,-41.2C-171.6,-81.4,-132.6,-112,-91.2,-139.2C-49.8,-166.4,-5,-190.2,38.2,-194.2C81.4,-198.2,162.8,-185,120,-156.6Z"
            fill="url(#heroGradient)"
          />
        </g>
        <defs>
          <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="absolute bottom-0 right-0 w-[40vw] h-[40vw] opacity-20 -z-10" viewBox="0 0 600,600" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(300,300)">
          <motion.path
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            d="M120,-156.6C154.2,-128.2,176.2,-86.2,181.2,-43.7C186.2,-1.2,174.2,41.8,153.2,80.2C132.2,118.6,102.2,152.4,63.2,170.2C24.2,188,-24.8,189.8,-67.2,175.2C-109.6,160.6,-145.4,129.6,-168.2,89.2C-191,48.8,-200.8,-1,-186.2,-41.2C-171.6,-81.4,-132.6,-112,-91.2,-139.2C-49.8,-166.4,-5,-190.2,38.2,-194.2C81.4,-198.2,162.8,-185,120,-156.6Z"
            fill="url(#heroGradient2)"
          />
        </g>
        <defs>
          <linearGradient id="heroGradient2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 bg-clip-text text-transparent"
        >
          AI Language Translation, <br /> Learning & Fun
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl mx-auto"
        >
          Master Sinhala, Tamil, and English with instant AI-powered translation, voice, quizzes, and more.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="btn-primary shadow-glow text-lg px-10 py-4"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/how-to-use')}
            className="btn-secondary text-lg px-10 py-4"
          >
            How to Use
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHero; 