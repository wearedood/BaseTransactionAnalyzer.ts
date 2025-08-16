/**
 * DeFi Transaction Analysis Example
 * 
 * This example demonstrates how to analyze DeFi transactions on Base,
 * including Uniswap swaps, liquidity provision, and yield farming activities.
 */

import { BaseTransactionAnalyzer } from '../src/index';

async function analyzeDeFiTransactions() {
  // Initialize the analyzer with Base mainnet
  const analyzer = new BaseTransactionAnalyzer({
    rpcUrl: 'https://mainnet.base.org',
    cacheEnabled: true,
    timeout: 30000
  });

  console.log('🔍 Starting DeFi Transaction Analysis...\n');

  // Example 1: Analyze a Uniswap V3 swap transaction
  console.log('📊 Example 1: Uniswap V3 Swap Analysis');
  console.log('=====================================');
  
  try {
    const uniswapTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const swapAnalysis = await analyzer.analyzeTransaction(uniswapTxHash);
    
    if (swapAnalysis.type === 'SWAP') {
      console.log(`✅ Swap detected:`);
      console.log(`   Token In: ${swapAnalysis.tokenIn.amount} ${swapAnalysis.tokenIn.symbol}`);
      console.log(`   Token Out: ${swapAnalysis.tokenOut.amount} ${swapAnalysis.tokenOut.symbol}`);
      console.log(`   Exchange Rate: 1 ${swapAnalysis.tokenIn.symbol} = ${swapAnalysis.exchangeRate} ${swapAnalysis.tokenOut.symbol}`);
      console.log(`   Gas Used: ${swapAnalysis.gasUsed} (${swapAnalysis.gasPrice} gwei)`);
      console.log(`   Transaction Fee: ${swapAnalysis.gasCost} ETH`);
      console.log(`   Slippage: ${swapAnalysis.slippage}%`);
    }
  } catch (error) {
    console.error('❌ Error analyzing Uniswap transaction:', error.message);
  }

  console.log('\n');

  // Example 2: Analyze liquidity provision
  console.log('💧 Example 2: Liquidity Provision Analysis');
  console.log('=========================================');
  
  try {
    const liquidityTxHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    const liquidityAnalysis = await analyzer.analyzeTransaction(liquidityTxHash);
    
    if (liquidityAnalysis.type === 'LIQUIDITY_ADD') {
      console.log(`✅ Liquidity addition detected:`);
      console.log(`   Pool: ${liquidityAnalysis.pool.token0.symbol}/${liquidityAnalysis.pool.token1.symbol}`);
      console.log(`   Amount 0: ${liquidityAnalysis.amounts.token0} ${liquidityAnalysis.pool.token0.symbol}`);
      console.log(`   Amount 1: ${liquidityAnalysis.amounts.token1} ${liquidityAnalysis.pool.token1.symbol}`);
      console.log(`   LP Tokens Received: ${liquidityAnalysis.lpTokens}`);
      console.log(`   Pool Share: ${liquidityAnalysis.poolShare}%`);
    }
  } catch (error) {
    console.error('❌ Error analyzing liquidity transaction:', error.message);
  }

  console.log('\n');

  // Example 3: Batch analysis for portfolio tracking
  console.log('📈 Example 3: Portfolio Batch Analysis');
  console.log('=====================================');
  
  try {
    const portfolioTxs = [
      '0x1111111111111111111111111111111111111111111111111111111111111111',
      '0x2222222222222222222222222222222222222222222222222222222222222222',
      '0x3333333333333333333333333333333333333333333333333333333333333333'
    ];
    
    const batchAnalysis = await analyzer.analyzeBatch(portfolioTxs);
    
    let totalGasSpent = 0;
    let swapCount = 0;
    let liquidityCount = 0;
    
    batchAnalysis.forEach((analysis, index) => {
      totalGasSpent += analysis.gasCost;
      
      if (analysis.type === 'SWAP') swapCount++;
      if (analysis.type === 'LIQUIDITY_ADD' || analysis.type === 'LIQUIDITY_REMOVE') liquidityCount++;
      
      console.log(`Transaction ${index + 1}: ${analysis.type} - Gas: ${analysis.gasCost} ETH`);
    });
    
    console.log(`\n📊 Portfolio Summary:`);
    console.log(`   Total Transactions: ${batchAnalysis.length}`);
    console.log(`   Swaps: ${swapCount}`);
    console.log(`   Liquidity Operations: ${liquidityCount}`);
    console.log(`   Total Gas Spent: ${totalGasSpent.toFixed(6)} ETH`);
    console.log(`   Average Gas per TX: ${(totalGasSpent / batchAnalysis.length).toFixed(6)} ETH`);
    
  } catch (error) {
    console.error('❌ Error in batch analysis:', error.message);
  }

  console.log('\n');

  // Example 4: ERC-20 transfer analysis
  console.log('🪙 Example 4: ERC-20 Transfer Analysis');
  console.log('=====================================');
  
  try {
    const transferTxHash = '0x4444444444444444444444444444444444444444444444444444444444444444';
    const transfers = await analyzer.getERC20Transfers(transferTxHash);
    
    console.log(`✅ Found ${transfers.length} ERC-20 transfers:`);
    
    transfers.forEach((transfer, index) => {
      console.log(`   Transfer ${index + 1}:`);
      console.log(`     Token: ${transfer.token.symbol} (${transfer.token.address})`);
      console.log(`     From: ${transfer.from}`);
      console.log(`     To: ${transfer.to}`);
      console.log(`     Amount: ${transfer.amount} ${transfer.token.symbol}`);
      console.log(`     USD Value: $${transfer.usdValue}`);
    });
    
  } catch (error) {
    console.error('❌ Error analyzing ERC-20 transfers:', error.message);
  }

  console.log('\n');

  // Example 5: Gas optimization analysis
  console.log('⛽ Example 5: Gas Optimization Analysis');
  console.log('======================================');
  
  try {
    const gasAnalysisTxHash = '0x5555555555555555555555555555555555555555555555555555555555555555';
    const gasAnalysis = await analyzer.analyzeGasUsage(gasAnalysisTxHash);
    
    console.log(`✅ Gas Analysis Results:`);
    console.log(`   Gas Used: ${gasAnalysis.gasUsed.toLocaleString()}`);
    console.log(`   Gas Limit: ${gasAnalysis.gasLimit.toLocaleString()}`);
    console.log(`   Gas Price: ${gasAnalysis.gasPrice} gwei`);
    console.log(`   Efficiency: ${gasAnalysis.efficiency}%`);
    console.log(`   Cost in ETH: ${gasAnalysis.costEth}`);
    console.log(`   Cost in USD: $${gasAnalysis.costUsd}`);
    
    if (gasAnalysis.suggestions.length > 0) {
      console.log(`\n💡 Optimization Suggestions:`);
      gasAnalysis.suggestions.forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error in gas analysis:', error.message);
  }

  console.log('\n🎉 DeFi analysis complete!');
}

// Advanced filtering example
async function advancedFiltering() {
  const analyzer = new BaseTransactionAnalyzer({
    rpcUrl: 'https://mainnet.base.org'
  });

  console.log('🔍 Advanced Filtering Examples');
  console.log('==============================\n');

  // Filter transactions by type
  const userAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
  const userTxs = await analyzer.getUserTransactions(userAddress, {
    limit: 100,
    types: ['SWAP', 'LIQUIDITY_ADD'],
    minValue: 1000, // Minimum USD value
    timeRange: {
      from: new Date('2024-01-01'),
      to: new Date('2024-12-31')
    }
  });

  console.log(`Found ${userTxs.length} filtered transactions for user`);
  
  // Analyze trading patterns
  const swaps = userTxs.filter(tx => tx.type === 'SWAP');
  const totalVolume = swaps.reduce((sum, swap) => sum + swap.volumeUsd, 0);
  
  console.log(`Trading Summary:`);
  console.log(`  Total Swaps: ${swaps.length}`);
  console.log(`  Total Volume: $${totalVolume.toLocaleString()}`);
  console.log(`  Average Trade Size: $${(totalVolume / swaps.length).toLocaleString()}`);
}

// Run the examples
if (require.main === module) {
  analyzeDeFiTransactions()
    .then(() => advancedFiltering())
    .catch(console.error);
}

export { analyzeDeFiTransactions, advancedFiltering };
