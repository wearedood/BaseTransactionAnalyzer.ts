/**
 * BaseMetricsCollector - Advanced analytics and metrics collection for Base blockchain
 * Provides comprehensive transaction analysis, DeFi metrics, and network insights
 * @author BaseTransactionAnalyzer Contributors
 * @version 2.0.0
 */

import { ethers, BigNumber } from 'ethers';

export interface TransactionMetrics {
  hash: string;
  blockNumber: number;
  timestamp: number;
  gasUsed: BigNumber;
  gasPrice: BigNumber;
  value: BigNumber;
  from: string;
  to: string;
  status: number;
  contractInteraction: boolean;
  tokenTransfers: TokenTransfer[];
  defiProtocol?: string;
  category: TransactionCategory;
}

export interface TokenTransfer {
  token: string;
  from: string;
  to: string;
  amount: BigNumber;
  symbol: string;
  decimals: number;
}

export enum TransactionCategory {
  TRANSFER = 'transfer',
  DEFI_SWAP = 'defi_swap',
  DEFI_LIQUIDITY = 'defi_liquidity',
  NFT_TRADE = 'nft_trade',
  CONTRACT_DEPLOYMENT = 'contract_deployment',
  CONTRACT_INTERACTION = 'contract_interaction',
  BRIDGE = 'bridge',
  UNKNOWN = 'unknown'
}

export interface NetworkMetrics {
  blockNumber: number;
  timestamp: number;
  gasUsed: BigNumber;
  gasLimit: BigNumber;
  baseFeePerGas: BigNumber;
  transactionCount: number;
  avgGasPrice: BigNumber;
  totalValue: BigNumber;
  uniqueAddresses: number;
}

export interface DeFiMetrics {
  protocol: string;
  tvl: BigNumber;
  volume24h: BigNumber;
  transactions24h: number;
  uniqueUsers24h: number;
  topPairs: Array<{
    pair: string;
    volume: BigNumber;
    liquidity: BigNumber;
  }>;
}

export class BaseMetricsCollector {
  private provider: ethers.providers.Provider;
  private metricsCache: Map<string, any> = new Map();
  private knownContracts: Map<string, string> = new Map();

  constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
    this.initializeKnownContracts();
  }

  /**
   * Initialize known Base protocol contracts
   */
  private initializeKnownContracts(): void {
    // Base ecosystem contracts
    this.knownContracts.set('0x4200000000000000000000000000000000000006', 'WETH');
    this.knownContracts.set('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 'USDC');
    this.knownContracts.set('0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', 'DAI');
    // Add more known contracts as needed
  }

  /**
   * Analyzes a single transaction and extracts comprehensive metrics
   */
  async analyzeTransaction(txHash: string): Promise<TransactionMetrics> {
    const tx = await this.provider.getTransaction(txHash);
    const receipt = await this.provider.getTransactionReceipt(txHash);
    const block = await this.provider.getBlock(tx.blockNumber!);

    const tokenTransfers = await this.extractTokenTransfers(receipt);
    const category = this.categorizeTransaction(tx, receipt, tokenTransfers);
    const defiProtocol = this.identifyDeFiProtocol(tx.to);

    return {
      hash: txHash,
      blockNumber: tx.blockNumber!,
      timestamp: block.timestamp,
      gasUsed: receipt.gasUsed,
      gasPrice: tx.gasPrice!,
      value: tx.value,
      from: tx.from,
      to: tx.to || '',
      status: receipt.status!,
      contractInteraction: tx.to !== null && (await this.isContract(tx.to!)),
      tokenTransfers,
      defiProtocol,
      category
    };
  }

  /**
   * Collects network-wide metrics for a specific block
   */
  async collectNetworkMetrics(blockNumber: number): Promise<NetworkMetrics> {
    const cacheKey = `network_${blockNumber}`;
    if (this.metricsCache.has(cacheKey)) {
      return this.metricsCache.get(cacheKey);
    }

    const block = await this.provider.getBlockWithTransactions(blockNumber);
    const uniqueAddresses = new Set<string>();
    let totalGasUsed = BigNumber.from(0);
    let totalValue = BigNumber.from(0);
    let totalGasPrice = BigNumber.from(0);

    for (const tx of block.transactions) {
      uniqueAddresses.add(tx.from);
      if (tx.to) uniqueAddresses.add(tx.to);
      totalValue = totalValue.add(tx.value);
      totalGasPrice = totalGasPrice.add(tx.gasPrice || 0);
    }

    const metrics: NetworkMetrics = {
      blockNumber,
      timestamp: block.timestamp,
      gasUsed: totalGasUsed,
      gasLimit: block.gasLimit,
      baseFeePerGas: block.baseFeePerGas || BigNumber.from(0),
      transactionCount: block.transactions.length,
      avgGasPrice: block.transactions.length > 0 
        ? totalGasPrice.div(block.transactions.length) 
        : BigNumber.from(0),
      totalValue,
      uniqueAddresses: uniqueAddresses.size
    };

    this.metricsCache.set(cacheKey, metrics);
    return metrics;
  }

  /**
   * Analyzes DeFi protocol metrics
   */
  async analyzeDeFiMetrics(protocolAddress: string): Promise<DeFiMetrics> {
    // This would integrate with various DeFi protocols on Base
    // For now, returning a mock structure
    return {
      protocol: this.knownContracts.get(protocolAddress) || 'Unknown',
      tvl: BigNumber.from(0),
      volume24h: BigNumber.from(0),
      transactions24h: 0,
      uniqueUsers24h: 0,
      topPairs: []
    };
  }

  /**
   * Extracts token transfer events from transaction receipt
   */
  private async extractTokenTransfers(receipt: ethers.providers.TransactionReceipt): Promise<TokenTransfer[]> {
    const transfers: TokenTransfer[] = [];
    const transferEventSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

    for (const log of receipt.logs) {
      if (log.topics[0] === transferEventSignature && log.topics.length === 3) {
        try {
          const from = ethers.utils.getAddress('0x' + log.topics[1].slice(26));
          const to = ethers.utils.getAddress('0x' + log.topics[2].slice(26));
          const amount = BigNumber.from(log.data);

          transfers.push({
            token: log.address,
            from,
            to,
            amount,
            symbol: this.knownContracts.get(log.address) || 'UNKNOWN',
            decimals: 18 // Default, should be fetched from contract
          });
        } catch (error) {
          console.warn('Failed to parse transfer event:', error);
        }
      }
    }

    return transfers;
  }

  /**
   * Categorizes transaction based on its characteristics
   */
  private categorizeTransaction(
    tx: ethers.providers.TransactionResponse,
    receipt: ethers.providers.TransactionReceipt,
    tokenTransfers: TokenTransfer[]
  ): TransactionCategory {
    // Simple ETH transfer
    if (!tx.to || (tx.value.gt(0) && receipt.logs.length === 0)) {
      return TransactionCategory.TRANSFER;
    }

    // Contract deployment
    if (!tx.to) {
      return TransactionCategory.CONTRACT_DEPLOYMENT;
    }

    // Token transfers suggest DeFi activity
    if (tokenTransfers.length > 1) {
      return TransactionCategory.DEFI_SWAP;
    }

    // Single token transfer
    if (tokenTransfers.length === 1) {
      return TransactionCategory.TRANSFER;
    }

    // Contract interaction
    if (receipt.logs.length > 0) {
      return TransactionCategory.CONTRACT_INTERACTION;
    }

    return TransactionCategory.UNKNOWN;
  }

  /**
   * Identifies DeFi protocol from contract address
   */
  private identifyDeFiProtocol(address: string | null): string | undefined {
    if (!address) return undefined;
    
    // This would be expanded with actual Base DeFi protocols
    const protocolMap: { [key: string]: string } = {
      // Add Base DeFi protocol addresses here
    };

    return protocolMap[address.toLowerCase()];
  }

  /**
   * Checks if an address is a contract
   */
  private async isContract(address: string): Promise<boolean> {
    const code = await this.provider.getCode(address);
    return code !== '0x';
  }

  /**
   * Generates comprehensive analytics report
   */
  async generateAnalyticsReport(fromBlock: number, toBlock: number): Promise<{
    summary: {
      totalTransactions: number;
      totalValue: BigNumber;
      avgGasPrice: BigNumber;
      uniqueAddresses: number;
    };
    categories: { [key in TransactionCategory]: number };
    topTokens: Array<{ token: string; volume: BigNumber; transfers: number }>;
    gasAnalysis: {
      minGasPrice: BigNumber;
      maxGasPrice: BigNumber;
      avgGasUsed: BigNumber;
    };
  }> {
    const summary = {
      totalTransactions: 0,
      totalValue: BigNumber.from(0),
      avgGasPrice: BigNumber.from(0),
      uniqueAddresses: 0
    };

    const categories: { [key in TransactionCategory]: number } = {
      [TransactionCategory.TRANSFER]: 0,
      [TransactionCategory.DEFI_SWAP]: 0,
      [TransactionCategory.DEFI_LIQUIDITY]: 0,
      [TransactionCategory.NFT_TRADE]: 0,
      [TransactionCategory.CONTRACT_DEPLOYMENT]: 0,
      [TransactionCategory.CONTRACT_INTERACTION]: 0,
      [TransactionCategory.BRIDGE]: 0,
      [TransactionCategory.UNKNOWN]: 0
    };

    const tokenVolumes = new Map<string, { volume: BigNumber; transfers: number }>();
    const uniqueAddresses = new Set<string>();
    let totalGasPrice = BigNumber.from(0);
    let minGasPrice = BigNumber.from('999999999999999999');
    let maxGasPrice = BigNumber.from(0);
    let totalGasUsed = BigNumber.from(0);

    // Process blocks in batches to avoid overwhelming the provider
    for (let blockNum = fromBlock; blockNum <= toBlock; blockNum++) {
      try {
        const block = await this.provider.getBlockWithTransactions(blockNum);
        
        for (const tx of block.transactions) {
          summary.totalTransactions++;
          summary.totalValue = summary.totalValue.add(tx.value);
          uniqueAddresses.add(tx.from);
          if (tx.to) uniqueAddresses.add(tx.to);

          if (tx.gasPrice) {
            totalGasPrice = totalGasPrice.add(tx.gasPrice);
            if (tx.gasPrice.lt(minGasPrice)) minGasPrice = tx.gasPrice;
            if (tx.gasPrice.gt(maxGasPrice)) maxGasPrice = tx.gasPrice;
          }

          // Get transaction receipt for detailed analysis
          const receipt = await this.provider.getTransactionReceipt(tx.hash);
          totalGasUsed = totalGasUsed.add(receipt.gasUsed);

          const tokenTransfers = await this.extractTokenTransfers(receipt);
          const category = this.categorizeTransaction(tx, receipt, tokenTransfers);
          categories[category]++;

          // Track token volumes
          for (const transfer of tokenTransfers) {
            const existing = tokenVolumes.get(transfer.token) || { volume: BigNumber.from(0), transfers: 0 };
            tokenVolumes.set(transfer.token, {
              volume: existing.volume.add(transfer.amount),
              transfers: existing.transfers + 1
            });
          }
        }
      } catch (error) {
        console.error(`Error processing block ${blockNum}:`, error);
      }
    }

    summary.uniqueAddresses = uniqueAddresses.size;
    summary.avgGasPrice = summary.totalTransactions > 0 
      ? totalGasPrice.div(summary.totalTransactions) 
      : BigNumber.from(0);

    const topTokens = Array.from(tokenVolumes.entries())
      .map(([token, data]) => ({ token, ...data }))
      .sort((a, b) => b.volume.gt(a.volume) ? 1 : -1)
      .slice(0, 10);

    return {
      summary,
      categories,
      topTokens,
      gasAnalysis: {
        minGasPrice,
        maxGasPrice,
        avgGasUsed: summary.totalTransactions > 0 
          ? totalGasUsed.div(summary.totalTransactions) 
          : BigNumber.from(0)
      }
    };
  }

  /**
   * Clears the metrics cache
   */
  clearCache(): void {
    this.metricsCache.clear();
  }
}

export default BaseMetricsCollector;
