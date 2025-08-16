src/GasOptimizer.ts  import { ethers } from 'ethers';
import { BaseTransaction } from './BaseTransactionAnalyzer';

export interface GasOptimizationSuggestion {
  type: 'gas_price' | 'gas_limit' | 'contract_optimization' | 'batch_transactions';
  description: string;
  potentialSavings: string;
  confidence: 'high' | 'medium' | 'low';
  implementation: string;
}

export interface OptimizationReport {
  currentGasCost: string;
  optimizedGasCost: string;
  totalSavings: string;
  savingsPercentage: number;
  suggestions: GasOptimizationSuggestion[];
}

export class GasOptimizer {
  private readonly BASE_GAS_PRICE_GWEI = 0.1;
  private readonly OPTIMAL_GAS_USAGE_THRESHOLD = 0.7;

  analyzeGasUsage(transaction: BaseTransaction): OptimizationReport {
    const suggestions: GasOptimizationSuggestion[] = [];
    const currentGasCost = this.calculateGasCost(transaction);
    
    const gasPriceSuggestion = this.analyzeGasPrice(transaction);
    if (gasPriceSuggestion) suggestions.push(gasPriceSuggestion);
    
    const gasLimitSuggestion = this.analyzeGasLimit(transaction);
    if (gasLimitSuggestion) suggestions.push(gasLimitSuggestion);
    
    const contractSuggestion = this.analyzeContractOptimization(transaction);
    if (contractSuggestion) suggestions.push(contractSuggestion);
    
    const totalSavings = this.calculateTotalSavings(suggestions, currentGasCost);
    const optimizedGasCost = (parseFloat(currentGasCost) - parseFloat(totalSavings)).toString();
    const savingsPercentage = (parseFloat(totalSavings) / parseFloat(currentGasCost)) * 100;
    
    return {
      currentGasCost,
      optimizedGasCost,
      totalSavings,
      savingsPercentage,
      suggestions
    };
  }

  private analyzeGasPrice(transaction: BaseTransaction): GasOptimizationSuggestion | null {
    const gasPriceGwei = parseFloat(ethers.formatUnits(transaction.gasPrice, 'gwei'));
    
    if (gasPriceGwei > this.BASE_GAS_PRICE_GWEI * 2) {
      return {
        type: 'gas_price',
        description: 'Gas price is significantly higher than Base network average',
        potentialSavings: this.calculateGasPriceSavings(transaction),
        confidence: 'high',
        implementation: 'Reduce gas price to 0.1-0.2 Gwei for Base network transactions'
      };
    }
    
    return null;
  }

  private analyzeGasLimit(transaction: BaseTransaction): GasOptimizationSuggestion | null {
    const gasUsed = BigInt(transaction.gasUsed);
    const estimatedGasLimit = gasUsed * BigInt(120) / BigInt(100);
    const gasUsageRatio = Number(gasUsed * BigInt(100) / estimatedGasLimit) / 100;
    
    if (gasUsageRatio < this.OPTIMAL_GAS_USAGE_THRESHOLD) {
      return {
        type: 'gas_limit',
        description: 'Gas limit is set too high, wasting potential gas fees',
        potentialSavings: this.calculateGasLimitSavings(transaction),
        confidence: 'medium',
        implementation: 'Set gas limit closer to estimated gas usage with 10-15% buffer'
      };
    }
    
    return null;
  }

  private analyzeContractOptimization(transaction: BaseTransaction): GasOptimizationSuggestion | null {
    if (!transaction.logs || transaction.logs.length === 0) {
      return null;
    }
    
    const transferEvents = transaction.logs.filter(log => 
      log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    );
    
    if (transferEvents.length > 3) {
      return {
        type: 'batch_transactions',
        description: 'Multiple token transfers detected - consider batching operations',
        potentialSavings: this.calculateBatchingSavings(transferEvents.length),
        confidence: 'high',
        implementation: 'Use multicall or batch transfer functions to combine operations'
      };
    }
    
    return null;
  }

  private calculateGasCost(transaction: BaseTransaction): string {
    const gasUsed = BigInt(transaction.gasUsed);
    const gasPrice = BigInt(transaction.gasPrice);
    const gasCostWei = gasUsed * gasPrice;
    return ethers.formatEther(gasCostWei);
  }

  private calculateGasPriceSavings(transaction: BaseTransaction): string {
    const currentGasPrice = BigInt(transaction.gasPrice);
    const optimalGasPrice = ethers.parseUnits(this.BASE_GAS_PRICE_GWEI.toString(), 'gwei');
    const gasUsed = BigInt(transaction.gasUsed);
    
    if (currentGasPrice <= optimalGasPrice) return '0';
    
    const savings = (currentGasPrice - optimalGasPrice) * gasUsed;
    return ethers.formatEther(savings);
  }

  private calculateGasLimitSavings(transaction: BaseTransaction): string {
    const gasUsed = BigInt(transaction.gasUsed);
    const gasPrice = BigInt(transaction.gasPrice);
    const potentialSavings = gasUsed * gasPrice * BigInt(5) / BigInt(100);
    return ethers.formatEther(potentialSavings);
  }

  private calculateBatchingSavings(operationCount: number): string {
    const baseGasCost = 21000;
    const savedTransactions = operationCount - 1;
    const savedGas = savedTransactions * baseGasCost;
    const gasPrice = ethers.parseUnits(this.BASE_GAS_PRICE_GWEI.toString(), 'gwei');
    const savings = BigInt(savedGas) * gasPrice;
    return ethers.formatEther(savings);
  }

  private calculateTotalSavings(suggestions: GasOptimizationSuggestion[], currentCost: string): string {
    const totalSavings = suggestions.reduce((sum, suggestion) => {
      return sum + parseFloat(suggestion.potentialSavings);
    }, 0);
    
    const maxSavings = parseFloat(currentCost) * 0.9;
    return Math.min(totalSavings, maxSavings).toString();
  }

  getBaseNetworkRecommendations(): string[] {
    return [
      'Use gas price of 0.1-0.2 Gwei for Base network transactions',
      'Set gas limit with 10-15% buffer above estimated usage',
      'Batch multiple operations using multicall patterns',
      'Optimize contract storage layout to minimize SSTORE operations'
    ];
  }

  async estimateOptimalGasPrice(provider: ethers.Provider): Promise<string> {
    try {
      const feeData = await provider.getFeeData();
      const baseFee = feeData.gasPrice || ethers.parseUnits('0.1', 'gwei');
      const priorityFee = ethers.parseUnits('0.01', 'gwei');
      const optimalGasPrice = baseFee + priorityFee;
      return ethers.formatUnits(optimalGasPrice, 'gwei');
    } catch (error) {
      return this.BASE_GAS_PRICE_GWEI.toString();
    }
  }
}

export default GasOptimizer;
