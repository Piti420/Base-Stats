'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUserStats, UserStats } from '@/utils/fetchBaseData';

export function useBaseStats(basename: string, walletAddress?: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // fetchUserStats will automatically resolve basename from wallet address if needed
      const data = await fetchUserStats(basename, walletAddress);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [basename, walletAddress]);

  const refreshStats = useCallback(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refreshStats,
  };
}
