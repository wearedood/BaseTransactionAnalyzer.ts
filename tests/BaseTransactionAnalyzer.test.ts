import { BaseTransactionAnalyzer } from '../src/BaseTransactionAnalyzer';
import { ethers } from 'ethers';

// Mock ethers provider for testing
jest.mock('ethers');

describe('BaseTransactionAnalyzer', () => {
  let analyzer: BaseTransactionAnalyzer;
  let mockProvider: jest.Mocked<ethers.Provider>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockProvider = {
      getTransaction: jest.fn(),
      getTransactionReceipt: jest.fn(),
      getBlock: jest.fn(),
    } as any;

    (ethers.JsonRpcProvider as jest.Mock).mockImplementation(() => mockProvider);
    analyzer = new BaseTransactionAnalyzer();
  });

  describe('constructor', () => {
    it('should create analyzer with default RPC URL', () => {
      const analyzer = new BaseTransactionAnalyzer();
      expect(ethers.JsonRpcProvider).toHaveBeenCalledWith('https://mainnet.base.org');
    });

    it('should create analyzer with custom RPC URL', () => {
      const customUrl = 'https://custom-base-rpc.com';
      const analyzer = new BaseTransactionAnalyzer(customUrl);
      expect(ethers.JsonRpcProvider).toHaveBeenCalledWith(customUrl);
    });
  });

  describe('analyzeTransaction', () => {
    const mockTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    
    const mockTransaction = {
      hash: mockTxHash,
      from: '0xfrom123',
      to: '0xto456',
      value: ethers.parseEther('1.0'),
      gasPrice: ethers.parseUnits('20', 'gwei'),
    };

    const mockReceipt = {
      blockNumber: 12345,
      gasUsed: ethers.parseUnits('21000', 'wei'),
      status: 1,
      contractAddress: null,
      logs: [],
    };

    const mockBlock = {
      timestamp: 1640995200,
    };

    beforeEach(() => {
      mockProvider.getTransaction.mockResolvedValue(mockTransaction as any);
      mockProvider.getTransactionReceipt.mockResolvedValue(mockReceipt as any);
      mockProvider.getBlock.mockResolvedValue(mockBlock as any);
    });

    it('should analyze transaction successfully', async () => {
      const result = await analyzer.analyzeTransaction(mockTxHash);

      expect(result).toEqual({
        hash: mockTxHash,
        from: '0xfrom123',
        to: '0xto456',
        value: mockTransaction.value.toString(),
        gasPrice: mockTransaction.gasPrice.toString(),
        gasUsed: mockReceipt.gasUsed.toString(),
        blockNumber: 12345,
        timestamp: 1640995200,
        status: 1,
        contractAddress: undefined,
        logs: [],
      });

      expect(mockProvider.getTransaction).toHaveBeenCalledWith(mockTxHash);
      expect(mockProvider.getTransactionReceipt).toHaveBeenCalledWith(mockTxHash);
      expect(mockProvider.getBlock).toHaveBeenCalledWith(12345);
    });

    it('should throw error when transaction not found', async () => {
      mockProvider.getTransaction.mockResolvedValue(null);

      await expect(analyzer.analyzeTransaction(mockTxHash))
        .rejects
        .toThrow(`Transaction ${mockTxHash} not found`);
    });
  });

  describe('extractERC20Transfers', () => {
    it('should extract ERC-20 transfers from logs', () => {
      const mockTransaction = {
        hash: '0x123',
        logs: [
          {
            address: '0xTokenContract',
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x000000000000000000000000from123456789012345678901234567890123456',
              '0x000000000000000000000000to123456789012345678901234567890123456',
            ],
            data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
          },
        ],
      };

      const transfers = analyzer.extractERC20Transfers(mockTransaction as any);

      expect(transfers).toHaveLength(1);
      expect(transfers[0]).toEqual({
        from: '0xfrom123456789012345678901234567890123456',
        to: '0xto123456789012345678901234567890123456',
        value: '1000000000000000000',
        tokenAddress: '0xTokenContract',
      });
    });

    it('should return empty array when no logs', () => {
      const mockTransaction = { logs: undefined };
      const transfers = analyzer.extractERC20Transfers(mockTransaction as any);
      expect(transfers).toEqual([]);
    });
  });

  describe('calculateGasEfficiency', () => {
    it('should calculate gas efficiency metrics', () => {
      const mockTransaction = {
        gasUsed: '21000',
        gasPrice: '20000000000',
      };

      const result = analyzer.calculateGasEfficiency(mockTransaction as any);

      expect(result.gasCostInEth).toBe('0.00042');
      expect(result.gasUsedPercentage).toBeGreaterThan(0);
      expect(['Excellent', 'Good', 'Average', 'Poor']).toContain(result.gasEfficiencyRating);
    });
  });

  describe('batchAnalyze', () => {
    it('should analyze multiple transactions', async () => {
      const txHashes = ['0x123', '0x456'];
      
      mockProvider.getTransaction
        .mockResolvedValueOnce({ hash: '0x123', from: '0xa', to: '0xb', value: '0', gasPrice: '0' } as any)
        .mockResolvedValueOnce({ hash: '0x456', from: '0xc', to: '0xd', value: '0', gasPrice: '0' } as any);
        
      mockProvider.getTransactionReceipt
        .mockResolvedValue({ blockNumber: 1, gasUsed: '21000', status: 1, logs: [] } as any);
        
      mockProvider.getBlock
        .mockResolvedValue({ timestamp: 1640995200 } as any);

      const results = await analyzer.batchAnalyze(txHashes);

      expect(results).toHaveLength(2);
      expect(results[0].hash).toBe('0x123');
      expect(results[1].hash).toBe('0x456');
    });
  });
});
