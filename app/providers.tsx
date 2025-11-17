'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { metaMask, coinbaseWallet, injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const config = createConfig({
  chains: [base],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Base Stats',
        url: typeof window !== 'undefined' ? window.location.origin : '',
      },
    }),
    coinbaseWallet({
      appName: 'Base Stats',
      appLogoUrl: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : undefined,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
