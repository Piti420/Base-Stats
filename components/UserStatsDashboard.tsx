'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBaseStats } from '@/hooks/useBaseStats';
import { BaseStatsCard } from './BaseStatsCard';
import { getRankBadge } from '@/utils/fetchBaseData';

interface UserStatsDashboardProps {
  basename?: string;
}

export function UserStatsDashboard({ basename = 'piti.base' }: UserStatsDashboardProps) {
  const { stats, loading, error, refreshStats } = useBaseStats(basename);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStats();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading stats: {error}</p>
      </div>
    );
  }

  const rankBadge = getRankBadge(stats.onchainScore);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 relative"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"
        />
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {stats.basename}
        </h1>
        <p className="text-sm text-gray-400 mb-4">
          expires: {stats.expires}
        </p>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <motion.span
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            🔁
          </motion.span>
          Refresh
        </button>
      </motion.div>

      {/* Rank Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-r ${
          rankBadge.color === 'purple' ? 'from-purple-500/20' : 
          rankBadge.color === 'blue' ? 'from-blue-500/20' : 
          'from-cyan-500/20'
        } to-transparent rounded-xl p-4 mb-6 text-center border border-blue-500/20`}
      >
        <div className="text-4xl mb-2">{rankBadge.icon}</div>
        <div className="text-lg font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
          {rankBadge.name}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Onchain Score: {stats.onchainScore} / 100
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <BaseStatsCard
          title="Onchain Score"
          value={`${stats.onchainScore}/100`}
          icon="📊"
          subtitle="Your activity"
          color="blue"
          delay={0.1}
        />
        <BaseStatsCard
          title="Build Score"
          value={`${stats.buildScore}/100`}
          icon="🔧"
          subtitle="Creator level"
          color="cyan"
          delay={0.2}
        />
        <BaseStatsCard
          title="Transactions"
          value={stats.txCount.toLocaleString()}
          icon="💸"
          subtitle="Base network"
          color="blue"
          delay={0.3}
        />
        <BaseStatsCard
          title="Gas Burned"
          value={`${stats.gasBurned} ETH`}
          icon="⛽"
          subtitle="Total spent"
          color="purple"
          delay={0.4}
        />
        <BaseStatsCard
          title="NFT Mints"
          value={stats.nftMints.toString()}
          icon="🖼️"
          subtitle="Collections"
          color="green"
          delay={0.5}
        />
        <BaseStatsCard
          title="Contracts"
          value={stats.contractsInteracted.toString()}
          icon="📄"
          subtitle="dApps used"
          color="cyan"
          delay={0.6}
        />
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-gray-500"
      >
        Powered by Base Stats 🔵
      </motion.div>
    </div>
  );
}
