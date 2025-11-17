// Utility functions to fetch Base onchain data
// For now using mock data, but ready for real API integration

import { fetchBaseOrgOnchainScoreAPI } from './fetchBaseOrgScore';
import { fetchBasenameFromAddress } from './fetchBasenameFromAddress';
import { fetchTalentProtocolBuildScore } from './fetchTalentProtocol';

export interface UserStats {
  basename: string;
  onchainScore: number | null; // Onchain Score from base.org
  builderScore: number | null; // Builder Score from Talent Protocol
}

export async function fetchUserStats(basename: string, walletAddress?: string): Promise<UserStats> {
  let cleanBasename = basename || 'piti420';
  
  console.log('fetchUserStats called with:', { basename, walletAddress, cleanBasename });
  
  // If wallet address is provided, try to resolve basename from address
  // This allows automatic basename resolution when wallet is connected
  if (walletAddress) {
    try {
      console.log('Attempting to resolve basename from address:', walletAddress);
      const basenameResult = await fetchBasenameFromAddress(walletAddress);
      console.log('Basename resolution result:', basenameResult);
      if (basenameResult.basename) {
        cleanBasename = basenameResult.basename;
        console.log('Using resolved basename:', cleanBasename);
      }
    } catch (error) {
      console.error('Failed to fetch basename from address:', error);
      // Continue with provided basename if resolution fails
    }
  }
  
  // Fetch Onchain Score and Builder Score from base.org
  let onchainScore: number | null = null;
  let builderScore: number | null = null;
  try {
    console.log('Fetching Onchain Score and Builder Score for basename:', cleanBasename);
    const baseOrgData = await fetchBaseOrgOnchainScoreAPI(cleanBasename);
    console.log('Base.org data received:', JSON.stringify(baseOrgData, null, 2));
    console.log('Base.org - onchainScore:', baseOrgData.onchainScore, 'builderScore:', baseOrgData.builderScore);
    onchainScore = baseOrgData.onchainScore;
    builderScore = baseOrgData.builderScore; // Builder Score is also from Base.org (Builder Activity tab)
  } catch (error) {
    console.error('Failed to fetch base.org scores:', error);
  }
  
  const result = {
    basename: cleanBasename,
    onchainScore,
    builderScore,
  };
  
  console.log('fetchUserStats returning:', JSON.stringify(result, null, 2));
  console.log('fetchUserStats returning - onchainScore:', result.onchainScore, 'builderScore:', result.builderScore);
  return result;
}

export async function fetchUserStatsByAddress(address: string, basename?: string): Promise<UserStats> {
  // Try to resolve basename from address if not provided
  let resolvedBasename = basename;
  if (!resolvedBasename) {
    try {
      const basenameResult = await fetchBasenameFromAddress(address);
      resolvedBasename = basenameResult.basename || '';
    } catch (error) {
      console.error('Failed to fetch basename from address:', error);
      resolvedBasename = '';
    }
  }
  
  // Fetch Onchain Score from base.org
  let onchainScore: number | null = null;
  if (resolvedBasename) {
    try {
      const baseOrgData = await fetchBaseOrgOnchainScoreAPI(resolvedBasename);
      onchainScore = baseOrgData.onchainScore;
    } catch (error) {
      console.error('Failed to fetch base.org Onchain Score:', error);
    }
  }
  
  // Fetch Builder Score from Talent Protocol
  let builderScore: number | null = null;
  try {
    const talentData = await fetchTalentProtocolBuildScore(address);
    builderScore = talentData.buildScore;
  } catch (error) {
    console.error('Failed to fetch Talent Protocol Builder Score:', error);
  }
  
  return {
    basename: resolvedBasename || '',
    onchainScore,
    builderScore,
  };
}
