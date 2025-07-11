import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient = 'from-blue-600 to-purple-600',
  delay = 0,
  size = 'md',
  interactive = true 
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.5, delay: delay + 0.2 }
    }
  };

  const sizes = {
    sm: {
      card: 'p-6',
      icon: 'w-12 h-12',
      iconContainer: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      card: 'p-8',
      icon: 'w-8 h-8',
      iconContainer: 'w-20 h-20',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      card: 'p-10',
      icon: 'w-10 h-10',
      iconContainer: 'w-24 h-24',
      title: 'text-2xl',
      description: 'text-lg'
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={interactive ? { 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
      } : {}}
      className={`
        relative group card-premium ${sizes[size].card}
        ${interactive ? 'cursor-pointer' : ''}
      `}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          variants={iconVariants}
          className={`
            ${sizes[size].iconContainer}
            bg-gradient-to-r ${gradient} 
            rounded-2xl flex items-center justify-center 
            mb-6 shadow-lg group-hover:shadow-xl
            transform-gpu transition-all duration-300
            group-hover:scale-110
          `}
        >
          <Icon className={`${sizes[size].icon} text-white`} />
        </motion.div>
        
        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.4 }}
          className={`${sizes[size].title} font-bold text-gray-800 dark:text-gray-100 mb-4`}
        >
          {title}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.6 }}
          className={`${sizes[size].description} text-gray-600 dark:text-gray-400 leading-relaxed`}
        >
          {description}
        </motion.p>
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 rounded-2xl`} />
    </motion.div>
  );
};

export default FeatureCard;
