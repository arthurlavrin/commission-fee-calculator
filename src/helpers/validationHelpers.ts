import {
  InputData,
  CashInOperationConfig,
  CashOutOperationConfig,
} from '../types';

export const validateCashInConfig = (
  operation: InputData,
  cashInConfig: CashInOperationConfig | null,
): CashInOperationConfig => {
  if (operation.type === 'cash_in' && !cashInConfig) {
    throw new Error('Missing cash-in configuration');
  }
  return cashInConfig as CashInOperationConfig;
};

export const validateCashOutConfig = (
  operation: InputData,
  cashOutConfig: CashOutOperationConfig | null,
): CashOutOperationConfig => {
  if (operation.type === 'cash_out' && !cashOutConfig) {
    throw new Error('Missing cash-out configuration');
  }
  return cashOutConfig as CashOutOperationConfig;
};
