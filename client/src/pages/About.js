import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Sparkles } from 'lucide-react';

const team = [
  { name: 'Saki T.', role: 'Founder & Lead Developer', color: 'from-blue-500 to-purple-600' },
  { name: 'Priya S.', role: 'Language Expert', color: 'from-green-500 to-teal-400' },
  { name: 'Kasun P.', role: 'AI Engineer', color: 'from-pink-500 to-yellow-400' },
];

export default function About() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated background blob */}
      <motion.div
        className="absolute -top-32 -left-32 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="max-w-4xl mx-auto py-24 px-4 relative z-10">
        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 bg-clip-text text-transparent"
        >
          About LangBridge
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-center text-gray-700 dark:text-gray-200 mb-16 max-w-2xl mx-auto"
        >
          Breaking language barriers with AI. Learn, translate, and connect across cultures.
        </motion.p>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 flex flex-col items-center text-center"
          >
            <Globe className="w-10 h-10 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To empower everyone to communicate, learn, and connect across cultures using the power of AI.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 flex flex-col items-center text-center"
          >
            <Sparkles className="w-10 h-10 text-purple-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To be the world’s most accessible, fun, and effective language learning and translation platform.
            </p>
          </motion.div>
        </div>

        {/* Team */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-10 text-gradient"
        >
          Meet the Team
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`flex flex-col items-center glass-card p-6 w-full md:w-1/3`}
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg`}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</div>
              <div className="text-gray-600 dark:text-gray-400">{member.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 