import { BaseTransactionAnalyzer } from '../src/BaseTransactionAnalyzer';

/**
 * Basic usage example for BaseTransactionAnalyzer
 */

async function basicUsageExample() {
  const analyzer = new BaseTransactionAnalyzer();
  const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  try {
    console.log('🔍 Analyzing transaction:', txHash);
    
    const transaction = await analyzer.analyzeTransaction(txHash);
    
    console.log('📊 Transaction Analysis Results:');
    console.log('- Hash:', transaction.hash);
    console.log('- From:', transaction.from);
    console.log('- To:', transaction.to);
    console.log('- Value:', transaction.value, 'wei');
    console.log('- Gas Used:', transaction.gasUsed);
    console.log('- Status:', transaction.status === 1 ? '✅ Success' : '❌ Failed');
    
    // Extract ERC-20 transfers
    const transfers = analyzer.extractERC20Transfers(transaction);
    
    if (transfers.length > 0) {
      console.log('\n💰 ERC-20 Transfers Found:');
      transfers.forEach((transfer, index) => {
        console.log(`Transfer ${index + 1}:`);
        console.log('  - From:', transfer.from);
        console.log('  - To:', transfer.to);
        console.log('  - Value:', transfer.value);
        console.log('  - Token Address:', transfer.tokenAddress);
      });
    }
    
    // Calculate gas efficiency
    const gasMetrics = analyzer.calculateGasEfficiency(transaction);
    
    console.log('\n⛽ Gas Efficiency Analysis:');
    console.log('- Gas Used Percentage:', gasMetrics.gasUsedPercentage.toFixed(2) + '%');
    console.log('- Gas Cost in ETH:', gasMetrics.gasCostInEth);
    console.log('- Efficiency Rating:', gasMetrics.gasEfficiencyRating);
    
  } catch (error) {
    console.error('❌ Error analyzing transaction:', error);
  }
}

/**
 * Batch analysis example
 */
async function batchAnalysisExample() {
  const analyzer = new BaseTransactionAnalyzer();
  
  const txHashes = [
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  ];
  
  try {
    console.log('\n🔄 Batch analyzing transactions...');
    const transactions = await analyzer.batchAnalyze(txHashes);
    
    console.log('\n📈 Batch Analysis Results:');
    transactions.forEach((tx, index) => {
      console.log(`Transaction ${index + 1}:`);
      console.log('  - Hash:', tx.hash.substring(0, 10) + '...');
      console.log('  - Status:', tx.status === 1 ? '✅' : '❌');
      console.log('  - Gas Used:', tx.gasUsed);
    });
    
  } catch (error) {
    console.error('❌ Error in batch analysis:', error);
  }
}

// Run examples
async function runAllExamples() {
  console.log('🚀 BaseTransactionAnalyzer Examples\n');
  
  await basicUsageExample();
  await batchAnalysisExample();
  
  console.log('\n✅ All examples completed!');
}

if (require.main === module) {
  runAllExamples().catch(console.error);
}

export { basicUsageExample, batchAnalysisExample, runAllExamples };
