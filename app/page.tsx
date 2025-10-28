'use client';

import { UserStatsDashboard } from '@/components/UserStatsDashboard';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [basename, setBasename] = useState('piti.base');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Base Stats 🔵
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            Your onchain profile on Base Network
          </p>
          
          {/* Basename input */}
          <div className="flex justify-center gap-2 mb-4">
            <input
              type="text"
              value={basename}
              onChange={(e) => setBasename(e.target.value)}
              placeholder="your.basename"
              className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
            <button
              onClick={() => {/* Refresh */}}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View Stats
            </button>
          </div>
        </motion.div>

        {/* Dashboard */}
        <UserStatsDashboard basename={basename} />
      </div>
    </main>
  );
}

