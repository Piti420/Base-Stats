import { createPublicClient, http, formatEther, formatUnits } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

export interface BaseStats {
  blockNumber: bigint;
  blockTime: number;
  gasPrice: bigint;
  totalTransactions: number;
  dailyTransactions: number;
  totalValueLocked: bigint;
}

export async function getBaseStats(): Promise<Partial<BaseStats>> {
  try {
    const [blockNumber, gasPrice] = await Promise.all([
      publicClient.getBlockNumber(),
      publicClient.getGasPrice(),
    ]);

    const block = await publicClient.getBlock({ blockNumber });

    return {
      blockNumber,
      blockTime: Number(block.timestamp),
      gasPrice,
      totalTransactions: 0, // Would need external API
      dailyTransactions: 0, // Would need external API
      totalValueLocked: 0n, // Would need external API
    };
  } catch (error) {
    console.error('Error fetching Base stats:', error);
    return {
      blockNumber: 0n,
      blockTime: 0,
      gasPrice: 0n,
    };
  }
}

export function formatGasPrice(gasPrice: bigint): string {
  return formatUnits(gasPrice, 'gwei');
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US');
}

// Mock data for demo purposes
export function getMockStats() {
  return {
    blockNumber: 55000000n,
    blockTime: Math.floor(Date.now() / 1000) - 10,
    gasPrice: 500000000n, // 0.5 gwei
    totalTransactions: 420000000,
    dailyTransactions: 1234567,
    totalValueLocked: 5000000000000000000000n, // ~5000 ETH
  };
}
