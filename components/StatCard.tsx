'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  description?: string;
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">
          {title}
        </div>
      </div>
      <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {value}
      </div>
      {description && (
        <div className="text-sm text-gray-400">{description}</div>
      )}
    </motion.div>
  );
}
