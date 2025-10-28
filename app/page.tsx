'use client';

import { BaseDashboard } from '@/components/BaseDashboard';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🚀 Base Stats
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-2">
            Real-time Analytics for Base Network
          </p>
          <p className="text-gray-500 text-sm">
            Powered by Optimism • Built on Ethereum
          </p>
        </motion.div>

        <BaseDashboard />
      </div>
    </main>
  );
}

