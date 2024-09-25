import {
  getCashOutConfig,
  getCashInConfig,
  roundUp,
  calculateCashOutLegalFee,
  calculateCashInFee,
  calculateCashOutNaturalFee,
  validateCashInConfig,
  validateCashOutConfig,
} from '../src/helpers';
import {
  CashInOperationConfig,
  CashOutNaturalOperationConfig,
  CashOutLegalOperationConfig,
  InputData,
  CashOutOperationConfig,
} from '../src/types';

describe('[helpers]', () => {
  describe('getCashOutConfig', () => {
    const cashOutNaturalConfig: CashOutNaturalOperationConfig = {
      rate: 0.003,
      weekLimit: 1000,
    };

    const cashOutLegalConfig: CashOutLegalOperationConfig = {
      rate: 0.003,
      minAmount: 0.5,
    };

    it('should return null if the operation type is not cash_out', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in', // Not cash_out
        operation: { amount: 200.0, currency: 'EUR' },
      };

      const result = getCashOutConfig(operation, {
        cashOutNaturalConfig,
        cashOutLegalConfig,
      });
      expect(result).toBeNull();
    });

    it('should return cashOutNaturalConfig for natural users', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural', // Natural user
        type: 'cash_out',
        operation: { amount: 200.0, currency: 'EUR' },
      };

      const result = getCashOutConfig(operation, {
        cashOutNaturalConfig,
        cashOutLegalConfig,
      });
      expect(result).toEqual(cashOutNaturalConfig);
    });

    it('should return cashOutLegalConfig for juridical users', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 2,
        user_type: 'juridical', // Juridical user
        type: 'cash_out',
        operation: { amount: 300.0, currency: 'EUR' },
      };

      const result = getCashOutConfig(operation, {
        cashOutNaturalConfig,
        cashOutLegalConfig,
      });
      expect(result).toEqual(cashOutLegalConfig);
    });
  });

  describe('getCashInConfig', () => {
    const cashInConfig: CashInOperationConfig = {
      rate: 0.0003,
      maxAmount: 5.0,
    };

    it('should return null if the operation type is not cash_in', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out', // Not cash_in
        operation: { amount: 200.0, currency: 'EUR' },
      };

      const result = getCashInConfig(operation, cashInConfig);
      expect(result).toBeNull();
    });

    it('should return null if cashInConfig does not have maxAmount', () => {
      const invalidCashInConfig = {
        rate: 0.0003,
      } as CashInOperationConfig; // Invalid config without maxAmount

      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200.0, currency: 'EUR' },
      };

      const result = getCashInConfig(operation, invalidCashInConfig);
      expect(result).toBeNull();
    });

    it('should return the cashInConfig if the operation type is cash_in and maxAmount exists', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200.0, currency: 'EUR' },
      };

      const result = getCashInConfig(operation, cashInConfig);
      expect(result).toEqual(cashInConfig);
    });
  });

  describe('roundUp', () => {
    it('should round up to the nearest two decimal places', () => {
      expect(roundUp(10.123)).toBe(10.13);
      expect(roundUp(10.125)).toBe(10.13); // Check rounding up
      expect(roundUp(10.12)).toBe(10.12); // Check rounding with no change
      expect(roundUp(10)).toBe(10); // Check integer rounding
    });
  });

  describe('calculateCashOutLegalFee', () => {
    it('should calculate the correct fee based on percentage and minimum amount', () => {
      const result = calculateCashOutLegalFee(1000, 0.005, 0.5);
      expect(result).toBe(5); // 1000 * 0.005 = 5, which is above the minAmount
    });

    it('should return the minimum amount if the calculated fee is below the minimum', () => {
      const result = calculateCashOutLegalFee(50, 0.005, 0.5);
      expect(result).toBe(0.5); // 50 * 0.005 = 0.25, but the minAmount is 0.50
    });

    it('should round the fee up to two decimal places', () => {
      const result = calculateCashOutLegalFee(333.33, 0.005, 0.5);
      expect(result).toBe(1.67); // 333.33 * 0.005 = 1.66665, rounded to 1.67
    });
  });

  describe('calculateCashInFee', () => {
    const cashInConfig: CashInOperationConfig = {
      rate: 0.0003, // 0.03%
      maxAmount: 5.0, // Max fee is 5 EUR
    };

    it('should calculate the correct cash-in fee based on rate', () => {
      const result = calculateCashInFee(1000, cashInConfig);
      expect(result).toBe(0.3); // 1000 * 0.0003 = 0.30
    });

    it('should apply the maximum fee if the calculated fee exceeds the maxAmount', () => {
      const result = calculateCashInFee(20000, cashInConfig);
      expect(result).toBe(5.0); // The calculated fee is 6, but the max is 5
    });

    it('should round the fee up to two decimal places', () => {
      const result = calculateCashInFee(333.33, cashInConfig);
      expect(result).toBe(0.1); // 333.33 * 0.0003 = 0.099999, rounded to 0.10
    });
  });

  describe('calculateCashOutNaturalFee', () => {
    it('should calculate the correct fee and chargeable amount', () => {
      const { fee, chargeableAmount } = calculateCashOutNaturalFee(
        1500,
        1000,
        800,
        0.003,
      );
      expect(chargeableAmount).toBe(1300); // 1500 + 800 - 1000 = 1300 chargeable
      expect(fee).toBe(3.9); // 1300 * 0.003 = 3.9
    });

    it('should return a fee of 0 if the weekly limit is not exceeded', () => {
      const { fee, chargeableAmount } = calculateCashOutNaturalFee(
        800,
        1000,
        100,
        0.003,
      );
      expect(chargeableAmount).toBe(0); // No chargeable amount because weekly limit is not exceeded
      expect(fee).toBe(0.0); // No fee because there is no chargeable amount
    });

    it('should calculate the fee correctly when the entire amount is chargeable', () => {
      const { fee, chargeableAmount } = calculateCashOutNaturalFee(
        1500,
        1000,
        1000,
        0.003,
      );
      expect(chargeableAmount).toBe(1500); // All of the 1500 is chargeable since weeklyTotal equals the weekLimit
      expect(fee).toBe(4.5); // 1500 * 0.003 = 4.50
    });

    it('should round the fee up to two decimal places', () => {
      const { fee, chargeableAmount } = calculateCashOutNaturalFee(
        333.33,
        1000,
        800,
        0.003,
      );
      expect(chargeableAmount).toBeCloseTo(133.33, 2); // 333.33 - (1000 - 800) = 133.33 chargeable
      expect(fee).toBe(0.4); // 133.33 * 0.003 = 0.39999, rounded to 0.40
    });
  });

  describe('validateCashInConfig', () => {
    it('should return the cash-in configuration when valid', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200, currency: 'EUR' },
      };

      const cashInConfig: CashInOperationConfig = {
        rate: 0.0003,
        maxAmount: 5.0,
      };

      const result = validateCashInConfig(operation, cashInConfig);
      expect(result).toBe(cashInConfig); // Should return the valid config
    });

    it('should throw an error when cash-in config is missing', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200, currency: 'EUR' },
      };

      expect(() => {
        validateCashInConfig(operation, null);
      }).toThrow('Missing cash-in configuration');
    });
  });

  describe('validateCashOutConfig', () => {
    it('should return the cash-out configuration when valid', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 200, currency: 'EUR' },
      };

      const cashOutConfig: CashOutOperationConfig = {
        rate: 0.003,
        minAmount: 0.5,
      };

      const result = validateCashOutConfig(operation, cashOutConfig);
      expect(result).toBe(cashOutConfig); // Should return the valid config
    });

    it('should throw an error when cash-out config is missing', () => {
      const operation: InputData = {
        date: '2023-09-01',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: { amount: 200, currency: 'EUR' },
      };

      expect(() => {
        validateCashOutConfig(operation, null);
      }).toThrow('Missing cash-out configuration');
    });
  });
});
