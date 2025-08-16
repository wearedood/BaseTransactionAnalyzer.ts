/**
 * Base Network Utilities
 * 
 * Essential utilities for interacting with Base network including
 * contract addresses, network configuration, and Base-specific helpers.
 */

import { ethers } from 'ethers';

export interface BaseNetworkConfig {
  chainId: number;
  name: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface BaseContract {
  name: string;
  address: string;
  abi: any[];
  category: 'defi' | 'bridge' | 'nft' | 'infrastructure' | 'gaming';
}

export interface BaseToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  coingeckoId?: string;
}

export class BaseNetworkUtils {
  private static readonly MAINNET_CONFIG: BaseNetworkConfig = {
    chainId: 8453,
    name: 'Base',
    rpcUrls: [
      'https://mainnet.base.org',
      'https://base.llamarpc.com',
      'https://base-mainnet.public.blastapi.io'
    ],
    blockExplorerUrls: ['https://basescan.org'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  };

  private static readonly TESTNET_CONFIG: BaseNetworkConfig = {
    chainId: 84532,
    name: 'Base Sepolia',
    rpcUrls: [
      'https://sepolia.base.org',
      'https://base-sepolia.public.blastapi.io'
    ],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  };

  // Major Base ecosystem contracts
  private static readonly BASE_CONTRACTS: BaseContract[] = [
    {
      name: 'Uniswap V3 Router',
      address: '0x2626664c2603336E57B271c5C0b26F421741e481',
      abi: [], // Would contain actual ABI
      category: 'defi'
    },
    {
      name: 'Uniswap V3 Factory',
      address: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
      abi: [],
      category: 'defi'
    },
    {
      name: 'Aerodrome Router',
      address: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
      abi: [],
      category: 'defi'
    },
    {
      name: 'Aerodrome Factory',
      address: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
      abi: [],
      category: 'defi'
    },
    {
      name: 'Compound V3 USDC',
      address: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
      abi: [],
      category: 'defi'
    },
    {
      name: 'Base Bridge',
      address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
      abi: [],
      category: 'bridge'
    },
    {
      name: 'WETH',
      address: '0x4200000000000000000000000000000000000006',
      abi: [],
      category: 'infrastructure'
    }
  ];

  // Popular Base tokens
  private static readonly BASE_TOKENS: BaseToken[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      coingeckoId: 'ethereum'
    },
    {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      coingeckoId: 'weth'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
      coingeckoId: 'usd-coin'
    },
    {
      symbol: 'USDbC',
      name: 'USD Base Coin',
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      decimals: 6,
      coingeckoId: 'bridged-usdc-base'
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      decimals: 18,
      coingeckoId: 'dai'
    },
    {
      symbol: 'AERO',
      name: 'Aerodrome Finance',
      address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
      decimals: 18,
      coingeckoId: 'aerodrome-finance'
    },
    {
      symbol: 'COMP',
      name: 'Compound',
      address: '0x9e1028F5F1D5eDE59748FFceE5532509976840E0',
      decimals: 18,
      coingeckoId: 'compound-governance-token'
    }
  ];

  /**
   * Get Base network configuration
   */
  static getNetworkConfig(isMainnet: boolean = true): BaseNetworkConfig {
    return isMainnet ? this.MAINNET_CONFIG : this.TESTNET_CONFIG;
  }

  /**
   * Check if an address is a known Base contract
   */
  static isKnownContract(address: string): boolean {
    return this.BASE_CONTRACTS.some(
      contract => contract.address.toLowerCase() === address.toLowerCase()
    );
  }

  /**
   * Get contract information by address
   */
  static getContractInfo(address: string): BaseContract | null {
    return this.BASE_CONTRACTS.find(
      contract => contract.address.toLowerCase() === address.toLowerCase()
    ) || null;
  }

  /**
   * Get all contracts by category
   */
  static getContractsByCategory(category: BaseContract['category']): BaseContract[] {
    return this.BASE_CONTRACTS.filter(contract => contract.category === category);
  }

  /**
   * Get token information by address or symbol
   */
  static getTokenInfo(addressOrSymbol: string): BaseToken | null {
    const search = addressOrSymbol.toLowerCase();
    return this.BASE_TOKENS.find(
      token => 
        token.address.toLowerCase() === search || 
        token.symbol.toLowerCase() === search
    ) || null;
  }

  /**
   * Get all available tokens
   */
  static getAllTokens(): BaseToken[] {
    return [...this.BASE_TOKENS];
  }

  /**
   * Format token amount with proper decimals
   */
  static formatTokenAmount(amount: string | number, decimals: number): string {
    const amountBN = typeof amount === 'string' ? 
      ethers.parseUnits(amount, 0) : 
      BigInt(amount);
    
    return ethers.formatUnits(amountBN, decimals);
  }

  /**
   * Parse token amount to wei
   */
  static parseTokenAmount(amount: string, decimals: number): bigint {
    return ethers.parseUnits(amount, decimals);
  }

  /**
   * Check if address is valid Ethereum address
   */
  static isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Get Base block explorer URL for address or transaction
   */
  static getExplorerUrl(hashOrAddress: string, type: 'tx' | 'address' | 'token' = 'address'): string {
    const baseUrl = 'https://basescan.org';
    
    switch (type) {
      case 'tx':
        return `${baseUrl}/tx/${hashOrAddress}`;
      case 'address':
        return `${baseUrl}/address/${hashOrAddress}`;
      case 'token':
        return `${baseUrl}/token/${hashOrAddress}`;
      default:
        return `${baseUrl}/address/${hashOrAddress}`;
    }
  }

  /**
   * Get current Base network status
   */
  static async getNetworkStatus(rpcUrl?: string): Promise<{
    chainId: number;
    blockNumber: number;
    gasPrice: string;
    isHealthy: boolean;
  }> {
    try {
      const provider = new ethers.JsonRpcProvider(
        rpcUrl || this.MAINNET_CONFIG.rpcUrls[0]
      );

      const [network, blockNumber, gasPrice] = await Promise.all([
        provider.getNetwork(),
        provider.getBlockNumber(),
        provider.getFeeData()
      ]);

      return {
        chainId: Number(network.chainId),
        blockNumber,
        gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei'),
        isHealthy: true
      };
    } catch (error) {
      return {
        chainId: 0,
        blockNumber: 0,
        gasPrice: '0',
        isHealthy: false
      };
    }
  }

  /**
   * Get token price from CoinGecko (if coingeckoId is available)
   */
  static async getTokenPrice(tokenSymbol: string): Promise<number | null> {
    try {
      const token = this.getTokenInfo(tokenSymbol);
      if (!token?.coingeckoId) {
        return null;
      }

      // In a real implementation, this would call CoinGecko API
      // For now, return mock prices
      const mockPrices: Record<string, number> = {
        'ethereum': 2500,
        'weth': 2500,
        'usd-coin': 1.00,
        'bridged-usdc-base': 1.00,
        'dai': 1.00,
        'aerodrome-finance': 0.85,
        'compound-governance-token': 45.50
      };

      return mockPrices[token.coingeckoId] || null;
    } catch {
      return null;
    }
  }

  /**
   * Calculate USD value of token amount
   */
  static async calculateUSDValue(
    tokenSymbol: string, 
    amount: string
  ): Promise<number | null> {
    try {
      const token = this.getTokenInfo(tokenSymbol);
      const price = await this.getTokenPrice(tokenSymbol);
      
      if (!token || !price) {
        return null;
      }

      const formattedAmount = parseFloat(this.formatTokenAmount(amount, token.decimals));
      return formattedAmount * price;
    } catch {
      return null;
    }
  }

  /**
   * Get popular trading pairs on Base
   */
  static getPopularTradingPairs(): Array<{pair: string; tokens: [string, string]}> {
    return [
      { pair: 'ETH/USDC', tokens: ['ETH', 'USDC'] },
      { pair: 'WETH/USDC', tokens: ['WETH', 'USDC'] },
      { pair: 'USDC/USDbC', tokens: ['USDC', 'USDbC'] },
      { pair: 'ETH/DAI', tokens: ['ETH', 'DAI'] },
      { pair: 'AERO/ETH', tokens: ['AERO', 'ETH'] },
      { pair: 'COMP/ETH', tokens: ['COMP', 'ETH'] },
      { pair: 'AERO/USDC', tokens: ['AERO', 'USDC'] }
    ];
  }

  /**
   * Get Base ecosystem statistics
   */
  static async getEcosystemStats(): Promise<{
    totalValueLocked: number;
    dailyVolume: number;
    activeUsers: number;
    totalTransactions: number;
  }> {
    // In a real implementation, this would aggregate data from various sources
    return {
      totalValueLocked: 1500000000, // $1.5B
      dailyVolume: 50000000, // $50M
      activeUsers: 25000,
      totalTransactions: 15000000
    };
  }

  /**
   * Validate Base network transaction
   */
  static async validateTransaction(
    txHash: string, 
    rpcUrl?: string
  ): Promise<{
    isValid: boolean;
    isOnBase: boolean;
    blockNumber?: number;
    status?: number;
  }> {
    try {
      const provider = new ethers.JsonRpcProvider(
        rpcUrl || this.MAINNET_CONFIG.rpcUrls[0]
      );

      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return { isValid: false, isOnBase: false };
      }

      const network = await provider.getNetwork();
      const isOnBase = Number(network.chainId) === this.MAINNET_CONFIG.chainId;

      return {
        isValid: true,
        isOnBase,
        blockNumber: receipt.blockNumber,
        status: receipt.status || 0
      };
    } catch {
      return { isValid: false, isOnBase: false };
    }
  }

  /**
   * Get recommended gas settings for Base
   */
  static getRecommendedGasSettings(): {
    slow: { gasPrice: string; estimatedTime: string };
    standard: { gasPrice: string; estimatedTime: string };
    fast: { gasPrice: string; estimatedTime: string };
  } {
    return {
      slow: { gasPrice: '0.001', estimatedTime: '2-5 minutes' },
      standard: { gasPrice: '0.002', estimatedTime: '1-2 minutes' },
      fast: { gasPrice: '0.005', estimatedTime: '< 1 minute' }
    };
  }
}
