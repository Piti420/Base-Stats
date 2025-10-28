'use client';

import { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { getMockStats, formatGasPrice } from '@/lib/baseStats';
import { motion } from 'framer-motion';

export function BaseDashboard() {
  const [stats, setStats] = useState(getMockStats());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // In production, you would fetch real stats here
      // const realStats = await getBaseStats();
      setStats(getMockStats());
      setLoading(false);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatCard
          title="Current Block"
          value={stats.blockNumber.toString()}
          icon="🔗"
          description="Latest Base block"
        />
        <StatCard
          title="Gas Price"
          value={`${formatGasPrice(stats.gasPrice)} gwei`}
          icon="⛽"
          description="Current network fee"
        />
        <StatCard
          title="Total Txns"
          value={stats.totalTransactions.toLocaleString()}
          icon="📊"
          description="All-time transactions"
        />
        <StatCard
          title="Daily Txns"
          value={stats.dailyTransactions.toLocaleString()}
          icon="📈"
          description="Last 24 hours"
        />
        <StatCard
          title="TVL"
          value={`${(Number(stats.totalValueLocked) / 1e18).toFixed(2)} ETH`}
          icon="💰"
          description="Total Value Locked"
        />
        <StatCard
          title="Network"
          value="Base"
          icon="🚀"
          description="Powered by Optimism"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-blue-500/20"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Base Network</h3>
          <p className="text-gray-400 text-sm mb-4">
            Base is a secure, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.
          </p>
          <a
            href="https://base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </div>
  );
}
