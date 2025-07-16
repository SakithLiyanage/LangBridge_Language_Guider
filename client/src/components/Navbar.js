import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages, 
  Menu, 
  X, 
  Home, 
  User, 
  History, 
  Award, 
  Moon, 
  Sun,
  LogOut,
  ChevronDown,
  BookOpen,
  MessageSquare,
  BarChart3,
  Users,
  BookMarked,
  MessageCircle,
  GraduationCap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedButton from './AnimatedButton';
import apiClient from '../utils/axios';

// Organized navigation with logical grouping
const primaryNavItems = [
  { path: '/', label: 'Home', icon: Home, description: 'Dashboard overview' },
  { path: '/translate', label: 'Translate', icon: MessageCircle, description: 'AI translation tool' },
  { path: '/learn', label: 'Learn', icon: BookOpen, description: 'Interactive courses' },
  { path: '/quiz', label: 'Quiz', icon: Award, description: 'Test your knowledge' },
  { path: '/ai-tutor', label: 'AI Tutor', icon: MessageSquare, description: 'Chat with an AI tutor' }
];

const learningNavItems = [
  { path: '/flashcards', label: 'Flashcards', icon: BookMarked, description: 'Spaced repetition', protected: true },
  { path: '/progress', label: 'Progress', icon: TrendingUp, description: 'Track your journey', protected: true },
  { path: '/history', label: 'History', icon: History, description: 'Learning records', protected: true }
];

const communityNavItems = [
  { path: '/community', label: 'Community', icon: Users, description: 'Connect with learners', protected: true }
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLearningMenu, setShowLearningMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await apiClient.get('/api/progress');
        setProgress(response.data);
      } catch (error) {
        setProgress(null);
      }
    };
    if (user) fetchProgress();
  }, [user]);

  const handleLogout = async () => {
    try {
    await logout();
    navigate('/');
    setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActivePath = (path) => location.pathname === path;

  const NavItem = ({ item, onClick, className = "", showDescription = true }) => {
    const Icon = item.icon;
    const isActive = isActivePath(item.path);
    
    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        } ${className}`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{item.label}</span>
        {isActive && (
          <motion.div
            layoutId="navbar-active"
            className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg -z-10"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  const DropdownMenu = ({ isOpen, onClose, title, subtitle, items, className = "" }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={`absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 ${className}`}
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
          {items.map((item) => {
            if (item.protected && !user) return null;
            return (
              <NavItem 
                key={item.path} 
                item={item} 
                onClick={onClose}
                className="mx-2 my-1"
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm' 
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="LangBridge Logo"
              className="h-32 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              style={{ maxHeight: '8rem' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Primary Navigation */}
            {primaryNavItems.map((item) => {
              if (item.protected && !user) return null;
              return <NavItem key={item.path} item={item} />;
            })}

            {/* Learning Tools Dropdown */}
            {user && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLearningMenu(!showLearningMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    showLearningMenu
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">Learning</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                    showLearningMenu ? 'rotate-180' : ''
                  }`} />
                </motion.button>

                <DropdownMenu
                  isOpen={showLearningMenu}
                  onClose={() => setShowLearningMenu(false)}
                  title="Learning Tools"
                  subtitle="Track and enhance your progress"
                  items={learningNavItems}
                />
              </div>
            )}

            {/* Community Dropdown */}
            {user && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCommunityMenu(!showCommunityMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    showCommunityMenu
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Community</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                    showCommunityMenu ? 'rotate-180' : ''
                  }`} />
                </motion.button>

                <DropdownMenu
                  isOpen={showCommunityMenu}
                  onClose={() => setShowCommunityMenu(false)}
                  title="Community"
                  subtitle="Connect with other learners"
                  items={communityNavItems}
                />
          </div>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {progress?.currentLevel
                        ? progress.currentLevel.charAt(0).toUpperCase() + progress.currentLevel.slice(1)
                        : 'Beginner'}
                    </p>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                        </div>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <div>
                          <span className="text-sm font-medium">Dashboard</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">View your progress</p>
                        </div>
                      </Link>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left text-red-600 dark:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                          <div>
                            <span className="text-sm font-medium">Sign Out</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">End your session</p>
                          </div>
                      </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <AnimatedButton
                  onClick={() => navigate('/register')}
                  variant="primary"
                  size="sm"
                >
                  Get Started
                </AnimatedButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Primary Navigation */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Main</h3>
                <div className="space-y-1">
                  {primaryNavItems.map((item) => {
                if (item.protected && !user) return null;
                return (
                      <NavItem 
                    key={item.path}
                        item={item} 
                      onClick={() => setIsOpen(false)}
                        className="w-full"
                      />
                );
              })}
                </div>
              </div>

              {/* Learning Tools */}
              {user && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Learning Tools</h3>
                  <div className="space-y-1">
                    {learningNavItems.map((item) => (
                      <NavItem 
                        key={item.path} 
                        item={item} 
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Community */}
              {user && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Community</h3>
                  <div className="space-y-1">
                    {communityNavItems.map((item) => (
                      <NavItem 
                        key={item.path} 
                        item={item} 
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Auth Section */}
              {!user && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <AnimatedButton
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/register');
                    }}
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Get Started
                  </AnimatedButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
