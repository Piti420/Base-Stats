'use client';

import { UserStatsDashboard } from '@/components/UserStatsDashboard';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [basename, setBasename] = useState('piti420');
  
  // Debug: log connectors
  useEffect(() => {
    console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
  }, [connectors]);
  
  // Auto-resolve basename when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      // Try to fetch basename from address
      fetch(`/api/resolve-basename?address=${address}`)
        .then(res => res.json())
        .then(data => {
          if (data.basename) {
            setBasename(data.basename);
          }
        })
        .catch(err => {
          console.error('Failed to resolve basename:', err);
          // If basename resolution fails, keep the current basename or use default
        });
    } else if (!isConnected) {
      // Reset to default when wallet disconnects
      setBasename('piti420');
    }
  }, [isConnected, address]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {!isConnected ? (
          /* Welcome Screen - Before Wallet Connection */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                BASE STATS
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mb-8 rounded-full" />
            </motion.div>

            {/* Welcome Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide"
            >
              Connect your wallet to check your stats
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-lg mb-12"
            >
              Discover your Onchain Score and Builder Score on Base Network
            </motion.p>

            {/* Connect Wallet Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <button
                onClick={() => setShowWalletOptions(!showWalletOptions)}
                disabled={isPending}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl font-bold text-white text-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🔗</span>
                      Connect Wallet
                    </>
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </button>

              {/* Wallet Options Dropdown */}
              {showWalletOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-3 min-w-[280px] z-50 shadow-2xl shadow-cyan-500/20"
                >
                  {/* Always show both wallet options - MetaMask and Base Wallet */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      try {
                        // Find MetaMask connector
                        const metaMaskConnector = connectors.find(c => 
                          c.id === 'metaMask' || 
                          c.name?.toLowerCase().includes('metamask')
                        );
                        
                        if (metaMaskConnector) {
                          console.log('Connecting with MetaMask:', metaMaskConnector.id, metaMaskConnector.name);
                          await connect({ connector: metaMaskConnector });
                        } else {
                          console.log('MetaMask connector not found, trying first connector');
                          // Try first connector (should be MetaMask from config)
                          if (connectors[0]) {
                            await connect({ connector: connectors[0] });
                          } else {
                            throw new Error('No connectors available');
                          }
                        }
                        setShowWalletOptions(false);
                      } catch (error) {
                        console.error('Failed to connect MetaMask:', error);
                        alert(`Failed to connect MetaMask: ${error instanceof Error ? error.message : 'Please install MetaMask extension'}`);
                      }
                    }}
                    disabled={isPending}
                    className="w-full px-5 py-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-cyan-500/30 rounded-xl text-left transition-all flex items-center gap-4 mb-2 group disabled:opacity-50"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">🦊</span>
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">MetaMask</div>
                    </div>
                    <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      try {
                        // Find Base Wallet / Coinbase Wallet connector
                        const baseWalletConnector = connectors.find(c => 
                          c.id === 'coinbaseWalletSDK' || 
                          c.name?.toLowerCase().includes('coinbase') ||
                          c.name?.toLowerCase().includes('base')
                        );
                        
                        if (baseWalletConnector) {
                          console.log('Connecting with Base Wallet:', baseWalletConnector.id, baseWalletConnector.name);
                          await connect({ connector: baseWalletConnector });
                        } else {
                          console.log('Base Wallet connector not found, trying second connector');
                          // Try second connector (should be Coinbase Wallet from config)
                          if (connectors[1]) {
                            await connect({ connector: connectors[1] });
                          } else {
                            throw new Error('Base Wallet connector not available');
                          }
                        }
                        setShowWalletOptions(false);
                      } catch (error) {
                        console.error('Failed to connect Base Wallet:', error);
                        alert(`Failed to connect Base Wallet: ${error instanceof Error ? error.message : 'Please install Base Wallet'}`);
                      }
                    }}
                    disabled={isPending}
                    className="w-full px-5 py-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-cyan-500/30 rounded-xl text-left transition-all flex items-center gap-4 group disabled:opacity-50"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">🔵</span>
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">Base Wallet</div>
                      <div className="text-xs text-gray-400 mt-1">Coinbase Wallet</div>
                    </div>
                    <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </motion.button>
                  
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          /* Dashboard - After Wallet Connection */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-6xl mx-auto"
          >
            {/* Header with disconnect */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-8"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  BASE STATS
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 text-sm transition-all"
              >
                Disconnect
              </button>
            </motion.div>

            {/* Stats Dashboard */}
            <UserStatsDashboard basename={basename} />
          </motion.div>
        )}

        {/* Click outside to close wallet options */}
        {showWalletOptions && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowWalletOptions(false)}
          />
        )}
      </div>
    </main>
  );
}

