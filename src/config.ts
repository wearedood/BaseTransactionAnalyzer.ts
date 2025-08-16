/**
 * Configuration file for Base Transaction Analyzer
 * Provides network settings, API endpoints, and analysis parameters
 */

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  name: string;
}

export interface AnalyzerConfig {
  batchSize: number;
  maxRetries: number;
  timeoutMs: number;
  cacheEnabled: boolean;
  metricsEnabled: boolean;
}

export const BASE_NETWORKS: Record<string, NetworkConfig> = {
  mainnet: {
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    name: 'Base Mainnet'
  },
  sepolia: {
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    name: 'Base Sepolia'
  }
};

export const DEFAULT_ANALYZER_CONFIG: AnalyzerConfig = {
  batchSize: 100,
  maxRetries: 3,
  timeoutMs: 30000,
  cacheEnabled: true,
  metricsEnabled: true
};

export const SUPPORTED_PROTOCOLS = [
  'uniswap-v3',
  'aave-v3',
  'compound-v3',
  'curve',
  'balancer-v2'
] as const;

export type SupportedProtocol = typeof SUPPORTED_PROTOCOLS[number];
