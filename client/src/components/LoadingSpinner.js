import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', variant = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    primary: 'border-blue-600',
    secondary: 'border-purple-600',
    accent: 'border-green-500',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} border-4 border-t-transparent ${variants[variant]} rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-b-transparent ${variants[variant]} rounded-full opacity-30`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const PulseLoader = ({ size = 'md', count = 3, variant = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    accent: 'bg-green-500',
    white: 'bg-white'
  };

  return (
    <div className="flex space-x-2">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} ${variants[variant]} rounded-full`}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

export const WaveLoader = ({ size = 'md', variant = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    accent: 'bg-green-500',
    white: 'bg-white'
  };

  return (
    <div className={`flex items-end space-x-1 ${sizeClasses[size]}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 ${variants[variant]} rounded-full`}
          animate={{ height: ['20%', '100%', '20%'] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
