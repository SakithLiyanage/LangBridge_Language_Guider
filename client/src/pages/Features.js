import React from 'react';
import { motion } from 'framer-motion';
import { 
  Languages, 
  Mic, 
  BookOpen, 
  Award, 
  Brain, 
  Zap, 
  Shield, 
  Globe,
  MessageCircle,
  Target,
  Sparkles,
  Heart
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import ParticleBackground from '../components/ParticleBackground';

const Features = () => {
  const mainFeatures = [
    {
      icon: Languages,
      title: 'AI-Powered Translation',
      description: 'Experience lightning-fast, context-aware translations between Sinhala, Tamil, and English using cutting-edge AI technology.',
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      icon: Mic,
      title: 'Voice Recognition',
      description: 'Speak naturally in any supported language and get instant translations with advanced voice processing.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: BookOpen,
      title: 'Smart Learning Assistant',
      description: 'Get personalized example sentences, grammar tips, and contextual explanations to accelerate your learning.',
      gradient: 'from-purple-600 to-purple-700'
    },
    {
      icon: Award,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with adaptive quizzes that adjust to your skill level and track your progress.',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const advancedFeatures = [
    {
      icon: Brain,
      title: 'Context Understanding',
      description: 'Our AI understands context, idioms, and cultural nuances for more accurate translations.',
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get instant translations as you type with our optimized real-time processing engine.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. We never store your personal translations.',
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      icon: Globe,
      title: 'Cultural Adaptation',
      description: 'Understand cultural context and regional variations in language usage.',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      title: 'Conversation Mode',
      description: 'Have natural conversations with real-time translation in multiple languages.',
      gradient: 'from-violet-600 to-purple-600'
    },
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'AI adapts to your learning style and creates personalized study plans.',
      gradient: 'from-red-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Translation Accuracy', icon: Target },
    { number: '50+', label: 'Languages Supported', icon: Globe },
    { number: '1M+', label: 'Happy Users', icon: Heart },
    { number: '24/7', label: 'Available', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <ParticleBackground density={30} />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 font-semibold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Powered by Advanced AI
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gray-800 dark:text-gray-100">Powerful</span>
              <br />
              <span className="text-gradient">Features</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-12">
              Discover the cutting-edge features that make LangBridge the ultimate 
              language learning and translation platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need for seamless language translation and learning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.2}
                size="md"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover the sophisticated features that set LangBridge apart
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                delay={index * 0.1}
                size="sm"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Why Choose LangBridge?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Traditional Tools
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Basic word-to-word translation</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>No context understanding</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Limited language support</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>No learning features</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="card p-8 text-center relative overflow-hidden border-2 border-blue-600 shadow-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full font-semibold mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  LangBridge
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  AI-Powered Platform
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Context-aware translations</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Cultural understanding</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>50+ languages supported</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Interactive learning tools</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/5"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Basic Alternatives
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>Moderate accuracy</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>Limited voice support</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>No personalization</li>
                  <li className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>Generic examples</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
