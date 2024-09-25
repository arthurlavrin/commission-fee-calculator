import { calculateCommissions } from '../src/calculator';
import { fetchAllConfigs } from '../src/configFetcher';
import { InputData, OperationType } from '../src/types';

jest.mock('../src/configFetcher');

describe('[calculator]', () => {
  describe('calculateCommissions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate correct commission fees for cash_in operations', async () => {
      (fetchAllConfigs as jest.Mock).mockResolvedValue({
        cashInConfig: { rate: 0.0003, maxAmount: 5.0 },
        cashOutNaturalConfig: { rate: 0.3, weekLimit: 1000 },
        cashOutLegalConfig: { rate: 0.3, minAmount: 0.5 },
      });

      const inputData: InputData[] = [
        {
          date: '2023-09-01',
          user_id: 1,
          user_type: 'natural',
          type: 'cash_in',
          operation: { amount: 200.0, currency: 'EUR' },
        },
      ];

      const result = await calculateCommissions(inputData);

      expect(result).toEqual(['0.06']);
    });

    it('should calculate correct commission fees for cash_out operations for natural users', async () => {
      (fetchAllConfigs as jest.Mock).mockResolvedValue({
        cashInConfig: { rate: 0.0003, maxAmount: 5.0 },
        cashOutNaturalConfig: { rate: 0.003, weekLimit: 1000 },
        cashOutLegalConfig: { rate: 0.3, minAmount: 0.5 },
      });

      const inputData: InputData[] = [
        {
          date: '2023-09-01',
          user_id: 1,
          user_type: 'natural',
          type: 'cash_out',
          operation: { amount: 1500.0, currency: 'EUR' },
        },
      ];

      const result = await calculateCommissions(inputData);

      expect(result).toEqual(['1.50']);
    });

    it('should calculate correct commission fees for cash_out operations for juridical users', async () => {
      (fetchAllConfigs as jest.Mock).mockResolvedValue({
        cashInConfig: { rate: 0.03, maxAmount: 5.0 },
        cashOutNaturalConfig: { rate: 0.3, weekLimit: 1000 },
        cashOutLegalConfig: { rate: 0.003, minAmount: 0.5 },
      });

      const inputData: InputData[] = [
        {
          date: '2023-09-01',
          user_id: 2,
          user_type: 'juridical',
          type: 'cash_out',
          operation: { amount: 300.0, currency: 'EUR' },
        },
      ];

      const result = await calculateCommissions(inputData);

      expect(result).toEqual(['0.90']);
    });

    it('should update cash-out history for sequential cash_out operations', async () => {
      (fetchAllConfigs as jest.Mock).mockResolvedValue({
        cashInConfig: { rate: 0.0003, maxAmount: 5.0 },
        cashOutNaturalConfig: { rate: 0.003, weekLimit: 1000 },
        cashOutLegalConfig: { rate: 0.003, minAmount: 0.5 },
      });

      const inputData: InputData[] = [
        {
          date: '2023-09-01',
          user_id: 1,
          user_type: 'natural',
          type: 'cash_out',
          operation: { amount: 800.0, currency: 'EUR' },
        },
        {
          date: '2023-09-02',
          user_id: 1,
          user_type: 'natural',
          type: 'cash_out',
          operation: { amount: 600.0, currency: 'EUR' },
        },
      ];

      const result = await calculateCommissions(inputData);

      expect(result).toEqual(['0.00', '1.20']);
    });

    it('should throw an error for unsupported operation types', async () => {
      (fetchAllConfigs as jest.Mock).mockResolvedValue({
        cashInConfig: { rate: 0.03, maxAmount: 5.0 },
        cashOutNaturalConfig: { rate: 0.3, weekLimit: 1000 },
        cashOutLegalConfig: { rate: 0.3, minAmount: 0.5 },
      });

      const inputData: InputData[] = [
        {
          date: '2023-09-01',
          user_id: 1,
          user_type: 'natural',
          type: 'unsupported_operation_type' as OperationType,
          operation: { amount: 800.0, currency: 'EUR' },
        },
      ];

      await expect(calculateCommissions(inputData)).rejects.toThrow(
        'Unsupported operation type: unsupported_operation_type',
      );
    });
  });
});
