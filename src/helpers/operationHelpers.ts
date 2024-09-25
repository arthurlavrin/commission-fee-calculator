import {
  CashInOperationConfig,
  CashOutHistory,
  CashOutLegalOperationConfig,
  CashOutNaturalOperationConfig,
  CashOutOperationConfig,
  InputData,
  ProcessedOperationResult,
} from '../types';
import {
  calculateCashInFee,
  calculateCashOutLegalFee,
  calculateCashOutNaturalFee,
} from './feeCalculators';

export const isCashInOperation = (operation: InputData): boolean => {
  return operation.type === 'cash_in';
};

export const isCashOutOperation = (operation: InputData): boolean => {
  return operation.type === 'cash_out';
};

export const processCashInOperation = (
  amount: number,
  cashInConfig: CashInOperationConfig,
  cashOutHistory: CashOutHistory,
): ProcessedOperationResult => {
  const fee = calculateCashInFee(amount, cashInConfig);
  return { fee, updatedHistory: cashOutHistory };
};

export const processCashOutNaturalOperation = (
  operation: InputData,
  cashOutConfig: CashOutNaturalOperationConfig,
  cashOutHistory: CashOutHistory,
  week: number,
): ProcessedOperationResult => {
  const userHistory = cashOutHistory[operation.user_id] || {};
  const weeklyTotal = userHistory[week] || 0;
  const { fee } = calculateCashOutNaturalFee(
    operation.operation.amount,
    cashOutConfig.weekLimit,
    weeklyTotal,
    cashOutConfig.rate,
  );

  const updatedHistory = {
    ...cashOutHistory,
    [operation.user_id]: {
      ...userHistory,
      [week]: (userHistory[week] || 0) + operation.operation.amount,
    },
  };

  return { fee, updatedHistory };
};

export const processCashOutJuridicalOperation = (
  amount: number,
  cashOutConfig: CashOutLegalOperationConfig,
  cashOutHistory: CashOutHistory,
): ProcessedOperationResult => {
  const fee = calculateCashOutLegalFee(
    amount,
    cashOutConfig.rate,
    cashOutConfig.minAmount,
  );
  return { fee, updatedHistory: cashOutHistory };
};

export const handleCashInOperation = (
  operation: InputData,
  cashInConfig: CashInOperationConfig,
  cashOutHistory: CashOutHistory,
): ProcessedOperationResult => {
  return processCashInOperation(
    operation.operation.amount,
    cashInConfig,
    cashOutHistory,
  );
};

export const handleCashOutOperation = (
  operation: InputData,
  cashOutConfig: CashOutOperationConfig,
  cashOutHistory: CashOutHistory,
  week: number,
): ProcessedOperationResult => {
  if (
    cashOutConfig &&
    operation.user_type === 'natural' &&
    'weekLimit' in cashOutConfig
  ) {
    return processCashOutNaturalOperation(
      operation,
      cashOutConfig,
      cashOutHistory,
      week,
    );
  }
  if (
    cashOutConfig &&
    operation.user_type === 'juridical' &&
    'minAmount' in cashOutConfig
  ) {
    return processCashOutJuridicalOperation(
      operation.operation.amount,
      cashOutConfig,
      cashOutHistory,
    );
  }
  throw new Error(
    `Unsupported user type for cash_out operation: ${operation.user_type}`,
  );
};
