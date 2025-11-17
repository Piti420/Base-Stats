'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useBaseStats } from '@/hooks/useBaseStats';
import { BaseStatsCard } from './BaseStatsCard';

interface UserStatsDashboardProps {
  basename?: string;
}

export function UserStatsDashboard({ basename = 'piti420' }: UserStatsDashboardProps) {
  const { address, isConnected } = useAccount();
  const { stats, loading, error, refreshStats } = useBaseStats(basename, address);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('UserStatsDashboard - basename:', basename, 'address:', address, 'isConnected:', isConnected);
    console.log('UserStatsDashboard - stats:', JSON.stringify(stats, null, 2));
    console.log('UserStatsDashboard - stats.onchainScore:', stats?.onchainScore, 'stats.builderScore:', stats?.builderScore);
    console.log('UserStatsDashboard - loading:', loading, 'error:', error);
  }, [basename, address, isConnected, stats, loading, error]);

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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-2">Error loading stats: {error}</p>
        <p className="text-gray-400 text-sm mb-4">
          {!isConnected 
            ? 'Please connect your wallet to view Builder Score'
            : 'Failed to load statistics. Please try again.'}
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Always show stats cards, even if stats is null or values are null
  const displayStats = stats || {
    basename: basename,
    onchainScore: null,
    builderScore: null,
  };

  return (
    <div className="w-full">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BaseStatsCard
            title="Onchain Score"
            value={
              displayStats.onchainScore !== null && displayStats.onchainScore !== undefined
                ? `${displayStats.onchainScore}/100`
                : 'N/A'
            }
            icon="📊"
            subtitle=""
            color="blue"
            delay={0}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BaseStatsCard
            title="Builder Score"
            value={
              displayStats.builderScore !== null && displayStats.builderScore !== undefined
                ? `${displayStats.builderScore}`
                : 'N/A'
            }
            icon="🔧"
            subtitle="from base.org"
            color="cyan"
            delay={0}
          />
        </motion.div>
      </div>
      
      {/* Show error message if there's an error but still show cards */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <p className="text-yellow-400 text-sm mb-2">
            ⚠️ Some data may be unavailable: {error}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
