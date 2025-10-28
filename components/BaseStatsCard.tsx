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
      transition={{ delay }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 hover:scale-105 transition-all backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className={`text-2xl font-bold bg-gradient-to-r ${textGradients[color]} bg-clip-text text-transparent`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      )}
    </motion.div>
  );
}
