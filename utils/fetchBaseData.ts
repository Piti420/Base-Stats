// Utility functions to fetch Base onchain data
// For now using mock data, but ready for real API integration

export interface UserStats {
  basename: string;
  expires: string;
  onchainScore: number;
  buildScore: number;
  rank: string;
  rankIcon: string;
  txCount: number;
  gasBurned: string;
  nftMints: number;
  contractsInteracted: number;
}

export async function fetchUserStats(basename: string): Promise<UserStats> {
  // TODO: Replace with real API call
  // Example: https://basescan.org/api?module=account&action=txlist&address={address}
  // or https://basescore.xyz/api/stats/{basename}
  
  // Mock data for now
  return {
    basename: basename || 'piti.base',
    expires: '2026-05-12',
    onchainScore: 82,
    buildScore: 67,
    rank: 'Builder',
    rankIcon: '🧱',
    txCount: 142,
    gasBurned: '0.32',
    nftMints: 8,
    contractsInteracted: 23,
  };
}

export async function fetchUserStatsByAddress(address: string): Promise<UserStats> {
  // TODO: Fetch real data from BaseScan API
  // For now return mock data
  return fetchUserStats(''); // Will use mock data
}

export function getRankBadge(score: number): { name: string; icon: string; color: string } {
  if (score >= 90) return { name: 'Base OG 🌀', icon: '🌀', color: 'purple' };
  if (score >= 80) return { name: 'Builder 🧱', icon: '🧱', color: 'blue' };
  if (score >= 70) return { name: 'Contributor 🚀', icon: '🚀', color: 'cyan' };
  if (score >= 60) return { name: 'Explorer 🔍', icon: '🔍', color: 'green' };
  return { name: 'Newcomer 🌱', icon: '🌱', color: 'gray' };
}
