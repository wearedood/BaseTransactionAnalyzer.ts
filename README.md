# BaseTransactionAnalyzer.ts

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Base](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://base.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

A comprehensive TypeScript library for analyzing Base blockchain transactions. Provides powerful utilities for parsing, filtering, and extracting insights from Base network transaction data with full support for ERC-20 transfers, contract interactions, and gas optimization analysis.

## 🚀 Features

- **Transaction Analysis**: Deep analysis of Base blockchain transactions
- **ERC-20 Support**: Full support for ERC-20 token transfers and interactions
- **Contract Interaction Parsing**: Decode and analyze smart contract calls
- **Gas Optimization**: Tools for analyzing and optimizing gas usage
- **Filtering & Querying**: Advanced filtering capabilities for transaction data
- **TypeScript First**: Full TypeScript support with comprehensive type definitions
- **Performance Optimized**: Efficient algorithms for large-scale transaction analysis

## 📦 Installation

```bash
npm install base-transaction-analyzer
```

```bash
yarn add base-transaction-analyzer
```

```bash
pnpm add base-transaction-analyzer
```

## 🔧 Quick Start

```typescript
import { BaseTransactionAnalyzer } from 'base-transaction-analyzer';

// Initialize the analyzer
const analyzer = new BaseTransactionAnalyzer({
  rpcUrl: 'https://mainnet.base.org',
  apiKey: 'your-api-key' // Optional
});

// Analyze a transaction
const txHash = '0x...';
const analysis = await analyzer.analyzeTransaction(txHash);

console.log('Transaction Analysis:', analysis);
```

## 📚 API Reference

### BaseTransactionAnalyzer

#### Constructor

```typescript
const analyzer = new BaseTransactionAnalyzer(options: AnalyzerOptions);
```

**Options:**
- `rpcUrl`: Base RPC endpoint URL
- `apiKey`: Optional API key for enhanced rate limits
- `cacheEnabled`: Enable/disable result caching (default: true)
- `timeout`: Request timeout in milliseconds (default: 30000)

#### Methods

##### `analyzeTransaction(txHash: string): Promise<TransactionAnalysis>`

Analyzes a single transaction and returns comprehensive data.

```typescript
const analysis = await analyzer.analyzeTransaction('0x...');
```

##### `analyzeBatch(txHashes: string[]): Promise<TransactionAnalysis[]>`

Analyzes multiple transactions in batch for improved performance.

```typescript
const analyses = await analyzer.analyzeBatch(['0x...', '0x...']);
```

##### `getERC20Transfers(txHash: string): Promise<ERC20Transfer[]>`

Extracts all ERC-20 token transfers from a transaction.

```typescript
const transfers = await analyzer.getERC20Transfers('0x...');
```

##### `analyzeGasUsage(txHash: string): Promise<GasAnalysis>`

Provides detailed gas usage analysis and optimization suggestions.

```typescript
const gasAnalysis = await analyzer.analyzeGasUsage('0x...');
```

## 🔍 Examples

### Analyzing DeFi Transactions

```typescript
import { BaseTransactionAnalyzer } from 'base-transaction-analyzer';

const analyzer = new BaseTransactionAnalyzer({
  rpcUrl: 'https://mainnet.base.org'
});

// Analyze a Uniswap swap transaction
const swapTx = '0x...';
const analysis = await analyzer.analyzeTransaction(swapTx);

if (analysis.type === 'SWAP') {
  console.log(`Swapped ${analysis.tokenIn.amount} ${analysis.tokenIn.symbol} for ${analysis.tokenOut.amount} ${analysis.tokenOut.symbol}`);
  console.log(`Gas used: ${analysis.gasUsed} (${analysis.gasPrice} gwei)`);
}
```

### Batch Analysis for Portfolio Tracking

```typescript
// Analyze multiple transactions for portfolio tracking
const userTxs = ['0x...', '0x...', '0x...'];
const analyses = await analyzer.analyzeBatch(userTxs);

const totalGasSpent = analyses.reduce((sum, tx) => sum + tx.gasCost, 0);
const erc20Transfers = analyses.flatMap(tx => tx.erc20Transfers);

console.log(`Total gas spent: ${totalGasSpent} ETH`);
console.log(`Total ERC-20 transfers: ${erc20Transfers.length}`);
```

### Gas Optimization Analysis

```typescript
// Analyze gas usage patterns
const gasAnalysis = await analyzer.analyzeGasUsage('0x...');

console.log('Gas Analysis:', {
  gasUsed: gasAnalysis.gasUsed,
  gasLimit: gasAnalysis.gasLimit,
  efficiency: gasAnalysis.efficiency,
  optimizationSuggestions: gasAnalysis.suggestions
});
```

## 🏗️ Architecture

```
BaseTransactionAnalyzer/
├── src/
│   ├── analyzer/
│   │   ├── BaseTransactionAnalyzer.ts
│   │   ├── TransactionParser.ts
│   │   └── GasAnalyzer.ts
│   ├── types/
│   │   ├── Transaction.ts
│   │   ├── Analysis.ts
│   │   └── ERC20.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── constants.ts
│   └── index.ts
├── examples/
├── tests/
└── docs/
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/wearedood/BaseTransactionAnalyzer.ts.git

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Base Documentation](https://docs.base.org/)
- [Base Explorer](https://basescan.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🙏 Acknowledgments

- Base team for the excellent blockchain infrastructure
- The TypeScript community for amazing tooling
- Contributors who help improve this library

---

**Built with ❤️ for the Base ecosystem**
