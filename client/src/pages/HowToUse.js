import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Mic, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const steps = [
  { icon: Languages, title: 'Choose Language', desc: 'Select your source and target languages.' },
  { icon: Mic, title: 'Speak or Type', desc: 'Enter your text or use voice input.' },
  { icon: Sparkles, title: 'Get Results', desc: 'See your translation, listen to audio, and get examples.' },
];

const faqs = [
  { q: 'Is it free to use?', a: 'Yes! You can use the core features for free.' },
  { q: 'Do I need to register?', a: 'Registration is required for saving history and quizzes, but not for basic translation.' },
  { q: 'Which languages are supported?', a: 'Sinhala, Tamil, and English.' },
];

export default function HowToUse() {
  const [open, setOpen] = useState(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-3xl mx-auto py-24 px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 via-green-400 to-purple-600 bg-clip-text text-transparent"
        >
          How to Use
        </motion.h1>
        {/* Steps Timeline */}
        <div className="mb-20">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="flex items-center mb-10"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl mr-6 shadow-lg">
                <step.icon className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{step.title}</div>
                <div className="text-gray-600 dark:text-gray-400">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* FAQ Accordion */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <button
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white focus:outline-none"
                  onClick={() => setOpen(open === idx ? null : idx)}
                >
                  {faq.q}
                  {open === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  {open === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-gray-600 dark:text-gray-400 mt-2">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 