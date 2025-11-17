'use client';

import { motion } from 'framer-motion';

interface BaseStatsCardProps {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
  color?: 'blue' | 'cyan' | 'purple' | 'green' | 'gray';
  delay?: number;
}

export function BaseStatsCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  color = 'blue',
  delay = 0 
}: BaseStatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    gray: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
  };

  const textGradients = {
    blue: 'from-blue-300 to-blue-100',
    cyan: 'from-cyan-300 to-cyan-100',
    purple: 'from-purple-300 to-purple-100',
    green: 'from-green-300 to-green-100',
    gray: 'from-gray-300 to-gray-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={`relative bg-gradient-to-br ${colorClasses[color]} border-2 rounded-3xl p-8 hover:border-opacity-60 transition-all backdrop-blur-xl min-h-[280px] flex flex-col justify-between overflow-hidden group`}
      style={{
        boxShadow: color === 'blue' 
          ? '0 0 30px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(59, 130, 246, 0.1)'
          : color === 'cyan'
          ? '0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 60px rgba(6, 182, 212, 0.1)'
          : '0 0 30px rgba(139, 92, 246, 0.3), inset 0 0 60px rgba(139, 92, 246, 0.1)',
      }}
    >
      {/* Animated glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${
          color === 'blue' ? 'from-blue-500/0 via-blue-500/20 to-blue-500/0' :
          color === 'cyan' ? 'from-cyan-500/0 via-cyan-500/20 to-cyan-500/0' :
          'from-purple-500/0 via-purple-500/20 to-purple-500/0'
        } opacity-0 group-hover:opacity-100 transition-opacity`}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <div className="relative z-10 flex items-start justify-between mb-6">
        <motion.span 
          className="text-5xl"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon}
        </motion.span>
        <span className="text-xs text-gray-300 uppercase tracking-[0.2em] font-bold">{title}</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <motion.div 
          className={`text-6xl md:text-7xl font-black bg-gradient-to-r ${textGradients[color]} bg-clip-text text-transparent mb-3`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {value}
        </motion.div>
        {subtitle && (
          <motion.div 
            className="text-sm text-gray-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            {subtitle}
          </motion.div>
        )}
      </div>

      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
        color === 'blue' ? 'from-blue-500/10' : 'from-cyan-500/10'
      } to-transparent rounded-bl-full`} />
    </motion.div>
  );
}
