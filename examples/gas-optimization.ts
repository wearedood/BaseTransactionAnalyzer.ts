/**
 * Gas Optimization Analysis Example
 * 
 * This example demonstrates how to analyze gas usage patterns,
 * identify optimization opportunities, and track gas efficiency
 * across different transaction types on Base.
 */

import { BaseTransactionAnalyzer } from '../src/index';

async function gasOptimizationAnalysis() {
  const analyzer = new BaseTransactionAnalyzer({
    rpcUrl: 'https://mainnet.base.org',
    cacheEnabled: true
  });

  console.log('⛽ Gas Optimization Analysis');
  console.log('===========================\n');

  // Example 1: Compare gas usage across different DEX protocols
  console.log('📊 Example 1: DEX Protocol Gas Comparison');
  console.log('==========================================');
  
  const dexTransactions = {
    uniswapV3: '0x1111111111111111111111111111111111111111111111111111111111111111',
    uniswapV2: '0x2222222222222222222222222222222222222222222222222222222222222222',
    sushiswap: '0x3333333333333333333333333333333333333333333333333333333333333333',
    curve: '0x4444444444444444444444444444444444444444444444444444444444444444'
  };

  const gasComparison = {};

  for (const [protocol, txHash] of Object.entries(dexTransactions)) {
    try {
      const gasAnalysis = await analyzer.analyzeGasUsage(txHash);
      gasComparison[protocol] = {
        gasUsed: gasAnalysis.gasUsed,
        gasPrice: gasAnalysis.gasPrice,
        costEth: gasAnalysis.costEth,
        efficiency: gasAnalysis.efficiency
      };
      
      console.log(`${protocol.toUpperCase()}:`);
      console.log(`  Gas Used: ${gasAnalysis.gasUsed.toLocaleString()}`);
      console.log(`  Gas Price: ${gasAnalysis.gasPrice} gwei`);
      console.log(`  Cost: ${gasAnalysis.costEth} ETH`);
      console.log(`  Efficiency: ${gasAnalysis.efficiency}%\n`);
      
    } catch (error) {
      console.error(`❌ Error analyzing ${protocol}:`, error.message);
    }
  }

  // Find most efficient protocol
  const mostEfficient = Object.entries(gasComparison)
    .sort(([,a], [,b]) => a.gasUsed - b.gasUsed)[0];
  
  if (mostEfficient) {
    console.log(`🏆 Most Gas Efficient: ${mostEfficient[0].toUpperCase()}`);
    console.log(`   Gas Used: ${mostEfficient[1].gasUsed.toLocaleString()}\n`);
  }

  // Example 2: Batch transaction gas analysis
  console.log('📈 Example 2: Batch Gas Analysis');
  console.log('================================');
  
  const batchTxs = [
    '0x5555555555555555555555555555555555555555555555555555555555555555',
    '0x6666666666666666666666666666666666666666666666666666666666666666',
    '0x7777777777777777777777777777777777777777777777777777777777777777'
  ];

  try {
    const batchAnalysis = await analyzer.analyzeBatch(batchTxs);
    
    let totalGas = 0;
    let totalCost = 0;
    const gasData = [];

    batchAnalysis.forEach((analysis, index) => {
      totalGas += analysis.gasUsed;
      totalCost += analysis.gasCost;
      gasData.push({
        txIndex: index + 1,
        gasUsed: analysis.gasUsed,
        gasPrice: analysis.gasPrice,
        cost: analysis.gasCost
      });
    });

    console.log('Batch Gas Summary:');
    console.log(`  Total Transactions: ${batchAnalysis.length}`);
    console.log(`  Total Gas Used: ${totalGas.toLocaleString()}`);
    console.log(`  Total Cost: ${totalCost.toFixed(6)} ETH`);
    console.log(`  Average Gas per TX: ${Math.round(totalGas / batchAnalysis.length).toLocaleString()}`);
    console.log(`  Average Cost per TX: ${(totalCost / batchAnalysis.length).toFixed(6)} ETH\n`);

    // Identify gas outliers
    const avgGas = totalGas / batchAnalysis.length;
    const outliers = gasData.filter(tx => tx.gasUsed > avgGas * 1.5);
    
    if (outliers.length > 0) {
      console.log('⚠️  High Gas Usage Transactions:');
      outliers.forEach(tx => {
        console.log(`  TX ${tx.txIndex}: ${tx.gasUsed.toLocaleString()} gas (${((tx.gasUsed / avgGas - 1) * 100).toFixed(1)}% above average)`);
      });
      console.log();
    }

  } catch (error) {
    console.error('❌ Error in batch gas analysis:', error.message);
  }

  // Example 3: Gas price trend analysis
  console.log('📊 Example 3: Gas Price Trend Analysis');
  console.log('======================================');
  
  try {
    const recentTxs = await analyzer.getRecentTransactions({
      limit: 50,
      includeGasData: true
    });

    const gasPrices = recentTxs.map(tx => tx.gasPrice);
    const avgGasPrice = gasPrices.reduce((sum, price) => sum + price, 0) / gasPrices.length;
    const minGasPrice = Math.min(...gasPrices);
    const maxGasPrice = Math.max(...gasPrices);

    console.log('Gas Price Statistics (last 50 transactions):');
    console.log(`  Average: ${avgGasPrice.toFixed(2)} gwei`);
    console.log(`  Minimum: ${minGasPrice} gwei`);
    console.log(`  Maximum: ${maxGasPrice} gwei`);
    console.log(`  Range: ${maxGasPrice - minGasPrice} gwei\n`);

    // Gas price recommendations
    const lowGasThreshold = avgGasPrice * 0.8;
    const highGasThreshold = avgGasPrice * 1.2;

    console.log('💡 Gas Price Recommendations:');
    console.log(`  Low Priority: ${lowGasThreshold.toFixed(1)} gwei`);
    console.log(`  Standard: ${avgGasPrice.toFixed(1)} gwei`);
    console.log(`  Fast: ${highGasThreshold.toFixed(1)} gwei\n`);

  } catch (error) {
    console.error('❌ Error in gas price analysis:', error.message);
  }

  // Example 4: Contract interaction gas analysis
  console.log('🔧 Example 4: Contract Interaction Analysis');
  console.log('===========================================');
  
  const contractAddress = '0x4200000000000000000000000000000000000006'; // WETH on Base
  
  try {
    const contractTxs = await analyzer.getContractTransactions(contractAddress, {
      limit: 20
    });

    const methodGasUsage = {};
    
    contractTxs.forEach(tx => {
      const method = tx.methodName || 'unknown';
      if (!methodGasUsage[method]) {
        methodGasUsage[method] = {
          count: 0,
          totalGas: 0,
          avgGas: 0
        };
      }
      
      methodGasUsage[method].count++;
      methodGasUsage[method].totalGas += tx.gasUsed;
      methodGasUsage[method].avgGas = methodGasUsage[method].totalGas / methodGasUsage[method].count;
    });

    console.log(`Contract: ${contractAddress}`);
    console.log('Method Gas Usage:');
    
    Object.entries(methodGasUsage)
      .sort(([,a], [,b]) => b.avgGas - a.avgGas)
      .forEach(([method, data]) => {
        console.log(`  ${method}: ${Math.round(data.avgGas).toLocaleString()} gas avg (${data.count} calls)`);
      });

  } catch (error) {
    console.error('❌ Error in contract analysis:', error.message);
  }

  console.log('\n');

  // Example 5: Gas optimization suggestions
  console.log('💡 Example 5: Optimization Suggestions');
  console.log('======================================');
  
  const optimizationTips = [
    {
      category: 'Transaction Timing',
      tips: [
        'Monitor gas prices and submit transactions during low-traffic periods',
        'Use gas price prediction tools to optimize timing',
        'Consider batching multiple operations into single transactions'
      ]
    },
    {
      category: 'Smart Contract Optimization',
      tips: [
        'Use more efficient data structures (mappings vs arrays)',
        'Minimize storage operations (SSTORE is expensive)',
        'Pack struct variables to reduce storage slots',
        'Use events instead of storage for data that doesn\'t need on-chain queries'
      ]
    },
    {
      category: 'Transaction Parameters',
      tips: [
        'Set appropriate gas limits (not too high, not too low)',
        'Use dynamic gas pricing based on network conditions',
        'Consider using meta-transactions for better UX'
      ]
    }
  ];

  optimizationTips.forEach(category => {
    console.log(`${category.category}:`);
    category.tips.forEach(tip => {
      console.log(`  • ${tip}`);
    });
    console.log();
  });
}

// Gas monitoring utility
class GasMonitor {
  private analyzer: BaseTransactionAnalyzer;
  private alerts: Array<{threshold: number, callback: Function}> = [];

  constructor(rpcUrl: string) {
    this.analyzer = new BaseTransactionAnalyzer({ rpcUrl });
  }

  addGasPriceAlert(threshold: number, callback: Function) {
    this.alerts.push({ threshold, callback });
  }

  async startMonitoring(intervalMs: number = 60000) {
    console.log('🔍 Starting gas price monitoring...');
    
    setInterval(async () => {
      try {
        const currentGasPrice = await this.analyzer.getCurrentGasPrice();
        
        console.log(`Current gas price: ${currentGasPrice} gwei`);
        
        this.alerts.forEach(alert => {
          if (currentGasPrice <= alert.threshold) {
            alert.callback(currentGasPrice);
          }
        });
        
      } catch (error) {
        console.error('Error monitoring gas price:', error.message);
      }
    }, intervalMs);
  }
}

// Usage example for gas monitoring
async function gasMonitoringExample() {
  const monitor = new GasMonitor('https://mainnet.base.org');
  
  // Set up alerts
  monitor.addGasPriceAlert(10, (gasPrice) => {
    console.log(`🚨 Low gas price alert: ${gasPrice} gwei - Good time to transact!`);
  });
  
  monitor.addGasPriceAlert(5, (gasPrice) => {
    console.log(`🎉 Very low gas price: ${gasPrice} gwei - Excellent time for batch operations!`);
  });
  
  // Start monitoring (in a real app, you'd want to handle this differently)
  // await monitor.startMonitoring(30000); // Check every 30 seconds
}

// Run the examples
if (require.main === module) {
  gasOptimizationAnalysis()
    .then(() => {
      console.log('🎉 Gas optimization analysis complete!');
      console.log('\n💡 To start gas monitoring, uncomment the gasMonitoringExample() call');
      // gasMonitoringExample();
    })
    .catch(console.error);
}

export { gasOptimizationAnalysis, GasMonitor, gasMonitoringExample };
