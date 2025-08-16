/**
 * NFT Marketplace Analysis Example
 * 
 * Comprehensive examples for analyzing NFT marketplaces on Base,
 * including collection analytics, trading patterns, and market trends.
 */

import { BaseNFTAnalyzer } from '../src/BaseNFTAnalyzer';

async function runNFTMarketplaceAnalysis() {
  // Initialize the NFT analyzer
  const nftAnalyzer = new BaseNFTAnalyzer('https://mainnet.base.org');

  console.log('🎨 Base NFT Marketplace Analysis');
  console.log('================================\n');

  // Example 1: Analyze trending collections
  console.log('📈 Example 1: Trending Collections Analysis');
  console.log('===========================================');
  
  try {
    const trendingCollections = await nftAnalyzer.getTrendingCollections('24h');
    
    console.log(`Found ${trendingCollections.length} trending collections:\n`);
    
    trendingCollections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name} (${collection.symbol})`);
      console.log(`   Address: ${collection.address}`);
      console.log(`   Floor Price: ${collection.floorPrice} ETH`);
      console.log(`   24h Volume: ${collection.volume24h} ETH`);
      console.log(`   Total Supply: ${collection.totalSupply.toLocaleString()}`);
      console.log(`   Owners: ${collection.owners.toLocaleString()}`);
      console.log(`   Category: ${collection.category}`);
      console.log(`   Verified: ${collection.verified ? '✅' : '❌'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error analyzing trending collections:', error.message);
  }

  // Example 2: Collection deep dive analysis
  console.log('🔍 Example 2: Collection Deep Dive');
  console.log('==================================');
  
  const collectionAddress = '0x1234567890123456789012345678901234567890';
  
  try {
    const collectionData = await nftAnalyzer.getCollectionAnalytics(collectionAddress);
    
    if (collectionData) {
      console.log(`Collection: ${collectionData.name}`);
      console.log(`Symbol: ${collectionData.symbol}`);
      console.log(`Total Supply: ${collectionData.totalSupply.toLocaleString()}`);
      console.log(`Floor Price: ${collectionData.floorPrice} ETH`);
      console.log(`Market Cap: ${(collectionData.floorPrice * collectionData.totalSupply).toFixed(2)} ETH`);
      console.log('');
      
      console.log('📊 Volume Analysis:');
      console.log(`  24h Volume: ${collectionData.volume24h} ETH`);
      console.log(`  7d Volume: ${collectionData.volume7d} ETH`);
      console.log(`  30d Volume: ${collectionData.volume30d} ETH`);
      console.log('');
      
      console.log('👥 Ownership Metrics:');
      console.log(`  Total Owners: ${collectionData.owners.toLocaleString()}`);
      console.log(`  Listed Items: ${collectionData.listedCount.toLocaleString()}`);
      console.log(`  Listing Rate: ${((collectionData.listedCount / collectionData.totalSupply) * 100).toFixed(1)}%`);
      console.log(`  Ownership Distribution: ${(collectionData.owners / collectionData.totalSupply * 100).toFixed(1)}%`);
    }

  } catch (error) {
    console.error('❌ Error analyzing collection:', error.message);
  }

  console.log('\n');

  // Example 3: NFT transaction analysis
  console.log('💰 Example 3: NFT Transaction Analysis');
  console.log('======================================');
  
  const nftTxHashes = [
    '0xabc123def456789012345678901234567890123456789012345678901234567890',
    '0xdef456abc789012345678901234567890123456789012345678901234567890123',
    '0x789012def345678901234567890123456789012345678901234567890123456abc'
  ];

  for (const [index, txHash] of nftTxHashes.entries()) {
    try {
      const nftTx = await nftAnalyzer.analyzeNFTTransaction(txHash);
      
      if (nftTx) {
        console.log(`Transaction ${index + 1}:`);
        console.log(`  Type: ${nftTx.type.toUpperCase()}`);
        console.log(`  Collection: ${nftTx.collection}`);
        console.log(`  Token ID: ${nftTx.tokenId}`);
        console.log(`  From: ${nftTx.from}`);
        console.log(`  To: ${nftTx.to}`);
        
        if (nftTx.price) {
          console.log(`  Price: ${nftTx.price} ${nftTx.currency}`);
        }
        
        if (nftTx.marketplace) {
          console.log(`  Marketplace: ${nftTx.marketplace}`);
        }
        
        console.log(`  Gas Used: ${nftTx.gasUsed.toLocaleString()}`);
        console.log(`  Gas Price: ${nftTx.gasPrice} gwei`);
        console.log('');
      }

    } catch (error) {
      console.error(`❌ Error analyzing transaction ${index + 1}:`, error.message);
    }
  }

  // Example 4: Market trends analysis
  console.log('📊 Example 4: Market Trends Analysis');
  console.log('====================================');
  
  try {
    const marketTrends = await nftAnalyzer.getMarketTrends();
    
    console.log('🌍 Overall Market Metrics:');
    console.log(`  Total Volume (24h): ${marketTrends.totalVolume24h} ETH`);
    console.log(`  Total Sales (24h): ${marketTrends.totalSales24h.toLocaleString()}`);
    console.log(`  Average Sale Price: ${marketTrends.averageSalePrice} ETH`);
    console.log('');
    
    console.log('🏆 Top Categories by Volume:');
    marketTrends.topCategories.forEach((category, index) => {
      const growthIcon = category.growth > 0 ? '📈' : category.growth < 0 ? '📉' : '➡️';
      console.log(`  ${index + 1}. ${category.category.toUpperCase()}: ${category.volume} ETH ${growthIcon} ${category.growth > 0 ? '+' : ''}${category.growth.toFixed(1)}%`);
    });
    console.log('');
    
    console.log('⛽ Gas Analysis:');
    console.log(`  Average Gas Used: ${marketTrends.gasAnalysis.averageGasUsed.toLocaleString()}`);
    console.log(`  Average Gas Cost: ${marketTrends.gasAnalysis.averageGasCost} ETH`);
    console.log(`  Most Efficient Marketplace: ${marketTrends.gasAnalysis.mostEfficientMarketplace}`);

  } catch (error) {
    console.error('❌ Error analyzing market trends:', error.message);
  }

  console.log('\n');

  // Example 5: User portfolio analysis
  console.log('👤 Example 5: User Portfolio Analysis');
  console.log('=====================================');
  
  const userAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
  
  try {
    const portfolio = await nftAnalyzer.getUserPortfolio(userAddress);
    
    console.log(`Portfolio for: ${userAddress}`);
    console.log(`Total Portfolio Value: ${portfolio.totalValue} ETH`);
    console.log(`Total NFTs Owned: ${portfolio.totalNFTs}`);
    console.log(`Average NFT Value: ${(portfolio.totalValue / portfolio.totalNFTs).toFixed(3)} ETH`);
    console.log('');
    
    console.log('📁 Collections Breakdown:');
    portfolio.collections.forEach((collection, index) => {
      const pnlIcon = collection.unrealizedPnL > 0 ? '💚' : collection.unrealizedPnL < 0 ? '❤️' : '💛';
      console.log(`  ${index + 1}. Collection ${collection.collection.slice(0, 10)}...`);
      console.log(`     Count: ${collection.count} NFTs`);
      console.log(`     Floor Value: ${collection.floorValue} ETH`);
      console.log(`     Unrealized P&L: ${pnlIcon} ${collection.unrealizedPnL > 0 ? '+' : ''}${collection.unrealizedPnL} ETH`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error analyzing user portfolio:', error.message);
  }

  // Example 6: Rarity analysis
  console.log('💎 Example 6: NFT Rarity Analysis');
  console.log('=================================');
  
  const sampleNFT = {
    tokenId: '1234',
    collection: collectionAddress,
    name: 'Cool NFT #1234',
    description: 'A rare and valuable NFT',
    image: 'https://example.com/nft.png',
    attributes: [
      { trait_type: 'Background', value: 'Rare Blue' },
      { trait_type: 'Eyes', value: 'Laser' },
      { trait_type: 'Hat', value: 'Crown' },
      { trait_type: 'Mouth', value: 'Smile' }
    ],
    owner: userAddress
  };

  // Mock collection traits data
  const collectionTraits = {
    'Background': {
      'Common Green': 3000,
      'Blue': 1500,
      'Rare Blue': 100,
      'Legendary Gold': 10
    },
    'Eyes': {
      'Normal': 4000,
      'Glowing': 500,
      'Laser': 50
    },
    'Hat': {
      'None': 5000,
      'Cap': 2000,
      'Crown': 100
    },
    'Mouth': {
      'Neutral': 4000,
      'Smile': 1000,
      'Frown': 500
    }
  };

  try {
    const rarityAnalysis = nftAnalyzer.analyzeRarity(sampleNFT, collectionTraits);
    
    console.log(`NFT: ${sampleNFT.name}`);
    console.log(`Rarity Score: ${rarityAnalysis.rarityScore.toFixed(2)}`);
    console.log(`Estimated Rank: Top ${((rarityAnalysis.rarityScore / 100) * 100).toFixed(1)}%`);
    console.log('');
    
    console.log('🎯 Trait Rarity Breakdown:');
    rarityAnalysis.traitRarities.forEach(trait => {
      const rarityLevel = trait.rarity < 1 ? '🔥 Legendary' : 
                         trait.rarity < 5 ? '💎 Rare' : 
                         trait.rarity < 20 ? '⭐ Uncommon' : '🟢 Common';
      console.log(`  ${trait.trait}: ${trait.value} - ${trait.rarity.toFixed(2)}% ${rarityLevel}`);
    });

  } catch (error) {
    console.error('❌ Error analyzing rarity:', error.message);
  }

  console.log('\n');

  // Example 7: Marketplace comparison
  console.log('🏪 Example 7: Marketplace Comparison');
  console.log('====================================');
  
  try {
    const marketplaceComparison = await nftAnalyzer.compareMarketplaces();
    
    console.log('Marketplace Performance Comparison:\n');
    
    marketplaceComparison.forEach((marketplace, index) => {
      console.log(`${index + 1}. ${marketplace.marketplace}`);
      console.log(`   24h Volume: ${marketplace.volume24h} ETH`);
      console.log(`   Average Gas Used: ${marketplace.averageGasUsed.toLocaleString()}`);
      console.log(`   Average Fees: ${marketplace.averageFees}%`);
      console.log(`   User Experience: ${marketplace.userExperience}/10`);
      console.log(`   Features: ${marketplace.supportedFeatures.join(', ')}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error comparing marketplaces:', error.message);
  }

  // Example 8: Wash trading detection
  console.log('🔍 Example 8: Wash Trading Detection');
  console.log('====================================');
  
  try {
    const washTradingAnalysis = await nftAnalyzer.detectWashTrading(collectionAddress);
    
    console.log(`Collection: ${collectionAddress}`);
    console.log(`Wash Trading Score: ${(washTradingAnalysis.washTradingScore * 100).toFixed(1)}%`);
    
    if (washTradingAnalysis.washTradingScore > 0.3) {
      console.log('⚠️  High wash trading risk detected!');
    } else if (washTradingAnalysis.washTradingScore > 0.1) {
      console.log('⚡ Moderate wash trading risk');
    } else {
      console.log('✅ Low wash trading risk');
    }
    
    console.log(`Suspicious Transactions: ${washTradingAnalysis.suspiciousTransactions.length}`);
    console.log(`Detected Patterns: ${washTradingAnalysis.patterns.length}`);

  } catch (error) {
    console.error('❌ Error detecting wash trading:', error.message);
  }

  console.log('\n🎉 NFT marketplace analysis complete!');
}

// Advanced NFT analytics functions
async function advancedNFTAnalytics() {
  const nftAnalyzer = new BaseNFTAnalyzer('https://mainnet.base.org');

  console.log('🚀 Advanced NFT Analytics');
  console.log('=========================\n');

  // Price prediction analysis
  console.log('📈 Price Prediction Analysis');
  console.log('============================');
  
  const collectionAddress = '0x1234567890123456789012345678901234567890';
  
  try {
    const pricePrediction = await nftAnalyzer.predictPriceTrends(collectionAddress);
    
    console.log(`Collection: ${collectionAddress}`);
    console.log(`Prediction: ${pricePrediction.prediction.toUpperCase()} 📊`);
    console.log(`Confidence: ${(pricePrediction.confidence * 100).toFixed(1)}%`);
    console.log(`Expected Change (${pricePrediction.priceTarget.timeframe}): ${pricePrediction.priceTarget.expectedChange > 0 ? '+' : ''}${pricePrediction.priceTarget.expectedChange.toFixed(1)}%`);
    console.log('');
    
    console.log('🎯 Contributing Factors:');
    pricePrediction.factors.forEach(factor => {
      const impactIcon = factor.impact === 'positive' ? '📈' : 
                        factor.impact === 'negative' ? '📉' : '➡️';
      console.log(`  ${impactIcon} ${factor.factor} (Weight: ${(factor.weight * 100).toFixed(0)}%)`);
    });

  } catch (error) {
    console.error('❌ Error predicting price trends:', error.message);
  }

  console.log('\n');

  // Collection health metrics
  console.log('🏥 Collection Health Metrics');
  console.log('============================');
  
  const healthMetrics = {
    liquidityScore: 8.5,
    ownershipDistribution: 7.2,
    tradingActivity: 9.1,
    priceStability: 6.8,
    communityEngagement: 8.9
  };

  console.log('Collection Health Dashboard:');
  Object.entries(healthMetrics).forEach(([metric, score]) => {
    const healthIcon = score >= 8 ? '🟢' : score >= 6 ? '🟡' : '🔴';
    const metricName = metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`  ${healthIcon} ${metricName}: ${score}/10`);
  });

  const overallHealth = Object.values(healthMetrics).reduce((a, b) => a + b, 0) / Object.values(healthMetrics).length;
  console.log(`\n📊 Overall Health Score: ${overallHealth.toFixed(1)}/10`);

  console.log('\n🎉 Advanced analytics complete!');
}

// Run the examples
if (require.main === module) {
  runNFTMarketplaceAnalysis()
    .then(() => advancedNFTAnalytics())
    .catch(console.error);
}

export { runNFTMarketplaceAnalysis, advancedNFTAnalytics };
