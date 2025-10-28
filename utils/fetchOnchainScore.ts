// API integration with onchainscore.xyz and zksync.netlify.app

export interface OnchainScoreData {
  basename: string;
  expires: string;
  onchainScore: number;
  buildScore: number;
  supply?: number;
  lend?: number;
  borrow?: number;
}

export interface ZkSyncData {
  walletAge: string;
  volume: string;
  interactions: number;
  nativeBridge: string;
  feesETH: string;
  score: number; // Calculated 1-100
}

export interface CombinedStats {
  onchainScore: OnchainScoreData;
  zkSync: ZkSyncData;
  overallScore: number;
}

export async function fetchOnchainScore(address: string): Promise<OnchainScoreData> {
  try {
    // TODO: Replace with actual API call to onchainscore.xyz
    // const response = await fetch(`https://onchainscore.xyz/api/user/${address}`);
    // const data = await response.json();
    
    // Mock data for now
    return {
      basename: 'piti.base',
      expires: '2026-05-12',
      onchainScore: 82,
      buildScore: 67,
      supply: 12.5,
      lend: 8.3,
      borrow: 4.2,
    };
  } catch (error) {
    console.error('Error fetching onchain score:', error);
    throw error;
  }
}

export async function fetchZkSyncStats(address: string): Promise<ZkSyncData> {
  try {
    // TODO: Replace with actual API call to zksync.netlify.app
    // const response = await fetch(`https://zksync.netlify.app/base/${address}`);
    // const html = await response.text();
    // Parse HTML to extract data
    
    // Mock data for now
    return {
      walletAge: '14 days',
      volume: '$12,450',
      interactions: 89,
      nativeBridge: '2.5 ETH',
      feesETH: '0.15',
      score: 78, // Calculate from wallet activity
    };
  } catch (error) {
    console.error('Error fetching zksync stats:', error);
    throw error;
  }
}

export function calculateOverallScore(onchain: OnchainScoreData, zksync: ZkSyncData): number {
  // Weighted scoring system
  const weights = {
    onchainScore: 0.4,
    buildScore: 0.2,
    zksyncScore: 0.4,
  };
  
  return Math.round(
    onchain.onchainScore * weights.onchainScore +
    onchain.buildScore * weights.buildScore +
    zksync.score * weights.zksyncScore
  );
}

export async function fetchCombinedStats(address: string): Promise<CombinedStats> {
  const [onchain, zksync] = await Promise.all([
    fetchOnchainScore(address),
    fetchZkSyncStats(address),
  ]);
  
  const overallScore = calculateOverallScore(onchain, zksync);
  
  return {
    onchainScore: onchain,
    zkSync: zksync,
    overallScore,
  };
}
