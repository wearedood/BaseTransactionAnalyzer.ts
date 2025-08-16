/**
 * Base Bridge Monitoring Example
 * 
 * Comprehensive examples for monitoring and analyzing Base bridge operations,
 * including cross-chain transfers, security monitoring, and optimization.
 */

import { BaseBridgeAnalyzer } from '../src/BaseBridgeAnalyzer';

async function runBridgeMonitoringAnalysis() {
  // Initialize bridge analyzer with both L1 and L2 providers
  const bridgeAnalyzer = new BaseBridgeAnalyzer(
    'https://eth-mainnet.alchemyapi.io/v2/your-api-key', // Ethereum mainnet
    'https://mainnet.base.org' // Base mainnet
  );

  console.log('🌉 Base Bridge Monitoring & Analysis');
  console.log('===================================\n');

  // Example 1: Analyze bridge transactions
  console.log('🔍 Example 1: Bridge Transaction Analysis');
  console.log('=========================================');
  
  const bridgeTxHashes = [
    { hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', chain: 'ethereum' as const },
    { hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', chain: 'base' as const },
    { hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456', chain: 'ethereum' as const }
  ];

  for (const [index, { hash, chain }] of bridgeTxHashes.entries()) {
    try {
      const bridgeTx = await bridgeAnalyzer.analyzeBridgeTransaction(hash, chain);
      
      if (bridgeTx) {
        console.log(`Transaction ${index + 1} (${chain.toUpperCase()}):`);
        console.log(`  Direction: ${bridgeTx.direction.toUpperCase()}`);
        console.log(`  Route: ${bridgeTx.sourceChain.toUpperCase()} to ${bridgeTx.targetChain.toUpperCase()}`);
        
        console.log(`  Token: ${bridgeTx.token.amount} ${bridgeTx.token.symbol}`);
        console.log(`  User: ${bridgeTx.user}`);
        console.log(`  Status: ${bridgeTx.status.toUpperCase()}`);
        console.log(`  Gas Used: ${bridgeTx.gasUsed.toLocaleString()}`);
        console.log(`  Bridge Fee: ${bridgeTx.bridgeFee} ETH`);
        console.log(`  Estimated Time: ${bridgeTx.estimatedTime} minutes`);
        console.log('');
      }

    } catch (error) {
      console.error(`Error analyzing bridge transaction ${index + 1}:`, error.message);
    }
  }

  console.log('Bridge monitoring analysis complete!');
}

export { runBridgeMonitoringAnalysis };
