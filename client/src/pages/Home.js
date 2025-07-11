import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Languages, 
  Mic, 
  BookOpen, 
  Award, 
  ArrowRight, 
  Sparkles,
  Users,
  TrendingUp,
  Star,
  CheckCircle
} from 'lucide-react';
import TranslationInterface from '../components/TranslationInterface';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import AnimatedButton from '../components/AnimatedButton';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ModernHero from '../components/ModernHero';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch real stats from backend
  const [stats, setStats] = useState([
    { number: '...', label: 'Active Users', icon: Users },
    { number: '...', label: 'Translations', icon: Languages },
    { number: '...', label: 'Accuracy Rate', icon: TrendingUp },
    { number: '...', label: 'User Rating', icon: Star }
  ]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats([
          { number: data.users, label: 'Active Users', icon: Users },
          { number: data.translations, label: 'Translations', icon: Languages },
          { number: data.accuracy + '%', label: 'Accuracy Rate', icon: TrendingUp },
          { number: data.rating, label: 'User Rating', icon: Star }
        ]);
      } catch (e) {
        // fallback to placeholders
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Update features to reflect new bilingual learning hub
  const features = [
    {
      icon: BookOpen,
      title: 'Bilingual Learning Hub',
      description: 'Interactive Sinhala and English courses with step-by-step lessons, activities, and cultural notes.',
      color: 'from-blue-600 to-purple-600'
    },
    {
      icon: Languages,
      title: 'AI-Powered Translation',
      description: 'Instantly translate between Sinhala, English, and Tamil with advanced AI models.',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Award,
      title: 'Quizzes & Progress',
      description: 'Test your vocabulary, grammar, and speaking skills with interactive quizzes and track your progress.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Mic,
      title: 'Audio & Voice',
      description: 'Practice pronunciation, listen to native audio, and use speech recognition for hands-free learning.',
      color: 'from-purple-600 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Language Teacher',
      content: 'LangBridge has revolutionized how I teach my students. The AI-powered examples are incredibly helpful!',
      rating: 5,
      avatar: 'PS'
    },
    {
      name: 'Kasun Perera',
      role: 'Student',
      content: 'The voice recognition feature is amazing. I can practice pronunciation and get instant feedback.',
      rating: 5,
      avatar: 'KP'
    },
    {
      name: 'Meera Patel',
      role: 'Business Professional',
      content: 'Perfect for my daily work. The translations are accurate and the interface is so user-friendly.',
      rating: 5,
      avatar: 'MP'
    }
  ];

  const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group relative overflow-hidden card-premium p-8 cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
      
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className={`w-20 h-20 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transform-gpu transition-all duration-300 group-hover:scale-110`}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.4 }}
          className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.6 }}
          className="text-base text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
      
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 rounded-2xl`} />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <ModernHero />
      <ParticleBackground density={40} />
      
      {/* Stats Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loadingStats
              ? Array(4).fill(0).map((_, index) => (
                  <div key={index} className="text-center animate-pulse">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4" />
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  </div>
                ))
              : stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-2xl transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.div 
                      className="text-4xl font-bold text-gradient mb-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Translation Interface */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Try Our AI Translator</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the power of AI-driven translation with voice recognition, 
              example generation, and real-time processing
            </p>
          </motion.div>
          
          <TranslationInterface />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for effective language learning and translation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Real feedback from language learners and professionals</p>
          </motion.div>
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={6000}
            className="rounded-2xl shadow-2xl bg-white/80 dark:bg-gray-900/80"
          >
            {testimonials.map((t, idx) => (
              <div key={idx} className="flex flex-col items-center py-8 px-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 text-white text-2xl font-bold">
                  {t.avatar}
                </div>
                <p className="text-xl text-gray-800 dark:text-gray-100 mb-4">“{t.content}”</p>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" />)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{t.name}, {t.role}</div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Start translating and learning in just a few steps</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 flex flex-col items-center text-center"
            >
              <Languages className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">1. Choose Language</h3>
              <p className="text-gray-600 dark:text-gray-400">Select your source and target languages for translation.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 flex flex-col items-center text-center"
            >
              <Mic className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">2. Speak or Type</h3>
              <p className="text-gray-600 dark:text-gray-400">Enter your text or use voice input for instant translation.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 flex flex-col items-center text-center"
            >
              <Sparkles className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">3. Get Results</h3>
              <p className="text-gray-600 dark:text-gray-400">See your translation, listen to audio, and get example sentences.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Ready to Start Your Language Journey?
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Join thousands of learners improving their language skills with LangBridge. 
                Start your free account today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <AnimatedButton
                  onClick={() => navigate('/register')}
                  variant="white"
                  size="xl"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
                >
                  Create Free Account
                </AnimatedButton>
                
                <AnimatedButton
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="xl"
                  className="border-2 border-white text-white hover:bg-white/10"
                >
                  Sign In
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;