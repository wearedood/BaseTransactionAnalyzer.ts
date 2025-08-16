src/index.ts  /**
 * BaseTransactionAnalyzer - A comprehensive TypeScript library for analyzing Base blockchain transactions
 * 
 * @author wearedood
 * @version 1.0.0
 * @license MIT
 */

// Main analyzer class
export { BaseTransactionAnalyzer, BaseTransaction, ERC20Transfer } from './BaseTransactionAnalyzer';

// Gas optimization utilities
export { 
  GasOptimizer, 
  GasOptimizationSuggestion, 
  OptimizationReport 
} from './GasOptimizer';

// Re-export ethers for convenience
export { ethers } from 'ethers';

// Library version
export const VERSION = '1.0.0';

// Base network constants
export const BASE_CONSTANTS = {
  CHAIN_ID: 8453,
  RPC_URL: 'https://mainnet.base.org',
  TYPICAL_GAS_PRICE_GWEI: 0.1,
  BLOCK_TIME_SECONDS: 2,
  NATIVE_TOKEN: 'ETH'
} as const;

// Common contract addresses on Base
export const BASE_CONTRACTS = {
  // Base native bridge
  L1_STANDARD_BRIDGE: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
  L2_STANDARD_BRIDGE: '0x4200000000000000000000000000000000000010',
  
  // Base system contracts
  L2_TO_L1_MESSAGE_PASSER: '0x4200000000000000000000000000000000000016',
  L1_BLOCK_ATTRIBUTES: '0x4200000000000000000000000000000000000015',
  
  // Common tokens (examples)
  WETH: '0x4200000000000000000000000000000000000006',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
} as const;

// Utility functions
export const utils = {
  /**
   * Convert wei to ETH
   */
  weiToEth: (wei: string | bigint): string => {
    return ethers.formatEther(wei);
  },
  
  /**
   * Convert ETH to wei
   */
  ethToWei: (eth: string): bigint => {
    return ethers.parseEther(eth);
  },
  
  /**
   * Convert gwei to wei
   */
  gweiToWei: (gwei: string): bigint => {
    return ethers.parseUnits(gwei, 'gwei');
  },
  
  /**
   * Convert wei to gwei
   */
  weiToGwei: (wei: string | bigint): string => {
    return ethers.formatUnits(wei, 'gwei');
  },
  
  /**
   * Check if address is valid
   */
  isValidAddress: (address: string): boolean => {
    try {
      ethers.getAddress(address);
      return true;
    } catch {
      return false;
    }
  },
  
  /**
   * Check if transaction hash is valid
   */
  isValidTxHash: (hash: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  },
  
  /**
   * Format large numbers with commas
   */
  formatNumber: (num: string | number): string => {
    return Number(num).toLocaleString();
  },
  
  /**
   * Calculate percentage
   */
  calculatePercentage: (part: number, total: number): number => {
    return total === 0 ? 0 : (part / total) * 100;
  }
};

// Export default analyzer instance
const defaultAnalyzer = new BaseTransactionAnalyzer();
export default defaultAnalyzer;
