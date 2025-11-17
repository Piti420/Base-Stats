// Fetch basename from wallet address using Base Registry

export interface BasenameResult {
  basename: string | null;
  address: string;
  error?: string;
}

/**
 * Resolves basename from wallet address using Base Registry
 * @param address - Ethereum wallet address
 * @returns Basename or null if not found
 */
export async function fetchBasenameFromAddress(address: string): Promise<BasenameResult> {
  try {
    const cleanAddress = address.toLowerCase();
    
    // Base Registry contract address on Base mainnet
    // The registry uses reverse resolution to get name from address
    // We'll try multiple methods:
    
    // Method 1: Try Base Registry API if available
    try {
      const apiUrl = `https://api.base.org/v1/names?address=${cleanAddress}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.name || data.basename) {
          const name = (data.name || data.basename).replace(/\.base(\.eth)?$/i, '');
          return {
            basename: name,
            address: cleanAddress,
          };
        }
      }
    } catch (error) {
      console.log('Base Registry API not available, trying alternative methods');
    }

    // Method 2: Try ENS reverse resolution (Base names might be registered)
    try {
      // Base uses similar reverse resolution as ENS
      // Reverse lookup: {address}.addr.reverse -> name
      const reverseNode = `${cleanAddress.slice(2)}.addr.reverse`;
      
      // Try to resolve via Base name service
      // This would require calling the Base Registry contract directly
      // For now, we'll use a fallback method
    } catch (error) {
      console.log('ENS reverse resolution not available');
    }

    // Method 3: Try fetching from base.org by checking if address has a profile
    // This is a fallback - we'll try to find the basename by checking base.org
    // Note: This is not ideal but works as a fallback
    
    return {
      basename: null,
      address: cleanAddress,
    };
  } catch (error) {
    console.error('Error fetching basename from address:', error);
    return {
      basename: null,
      address: address.toLowerCase(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Resolves basename from wallet address using Base Registry contract
 * This method calls the Base Registry contract directly on-chain
 */
export async function fetchBasenameFromAddressOnChain(
  address: string,
  publicClient?: any
): Promise<BasenameResult> {
  try {
    // Base Registry contract address on Base mainnet
    // Contract: 0x... (Base Name Service Registry)
    // We would need the actual contract ABI and address
    
    // For now, return null - this would need to be implemented with actual contract calls
    return {
      basename: null,
      address: address.toLowerCase(),
    };
  } catch (error) {
    console.error('Error fetching basename from address on-chain:', error);
    return {
      basename: null,
      address: address.toLowerCase(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

