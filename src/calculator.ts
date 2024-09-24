import {
  CashInOperationConfig,
  CashOutHistory,
  CashOutLegalOperationConfig,
  CashOutNaturalOperationConfig,
  InputData,
} from './types';
import {
  fetchCashInConfig,
  fetchCashOutNaturalConfig,
  fetchCashOutLegalConfig,
} from './configFetcher';
import { getWeekNumber, roundUp } from './utils';

const processOperation = (
  operation: InputData,
  cashOutHistory: CashOutHistory,
  cashInConfig: CashInOperationConfig | null,
  cashOutConfig:
    | CashOutNaturalOperationConfig
    | CashOutLegalOperationConfig
    | null,
): { fee: number; updatedHistory: CashOutHistory } => {
  const date = new Date(operation.date);
  const week = getWeekNumber(date);
  let fee = 0;

  if (operation.type === 'cash_in' && cashInConfig) {
    const cashInFee = operation.operation.amount * cashInConfig.percents;
    fee = roundUp(Math.min(cashInFee, cashInConfig.maxAmount));
    return { fee, updatedHistory: cashOutHistory };
  }

  if (operation.type === 'cash_out' && cashOutConfig) {
    if (operation.user_type === 'natural' && 'weekLimit' in cashOutConfig) {
      const userHistory = cashOutHistory[operation.user_id] || {};
      const weeklyTotal = userHistory[week] || 0;
      const freeAmount = Math.max(cashOutConfig.weekLimit - weeklyTotal, 0);
      const chargeableAmount = Math.max(
        operation.operation.amount - freeAmount,
        0,
      );
      fee = roundUp(chargeableAmount * cashOutConfig.percents);

      const updatedHistory = {
        ...cashOutHistory,
        [operation.user_id]: {
          ...userHistory,
          [week]: (userHistory[week] || 0) + operation.operation.amount,
        },
      };
      return { fee, updatedHistory };
    }

    if (operation.user_type === 'juridical' && 'minAmount' in cashOutConfig) {
      fee = roundUp(
        Math.max(
          operation.operation.amount * cashOutConfig.percents,
          cashOutConfig.minAmount,
        ),
      );
      return { fee, updatedHistory: cashOutHistory };
    }
  }

  throw new Error(`Unsupported operation type: ${operation.type}`);
};

export const calculateCommissions = async (
  data: InputData[],
): Promise<string[]> => {
  let cashOutHistory: CashOutHistory = {};

  const [cashInConfig, cashOutNaturalConfig, cashOutLegalConfig] =
    await Promise.all([
      fetchCashInConfig(),
      fetchCashOutNaturalConfig(),
      fetchCashOutLegalConfig(),
    ]);

  return data.map((operation) => {
    let configForCashOut:
      | CashOutNaturalOperationConfig
      | CashOutLegalOperationConfig
      | null = null;

    if (operation.type === 'cash_out') {
      if (operation.user_type === 'natural') {
        configForCashOut =
          cashOutNaturalConfig as CashOutNaturalOperationConfig;
      } else if (operation.user_type === 'juridical') {
        configForCashOut = cashOutLegalConfig as CashOutLegalOperationConfig;
      }
    }

    const cashInConfigForOperation: CashInOperationConfig | null =
      operation.type === 'cash_in'
        ? (cashInConfig as CashInOperationConfig)
        : null;

    const { fee, updatedHistory } = processOperation(
      operation,
      cashOutHistory,
      cashInConfigForOperation,
      configForCashOut,
    );

    cashOutHistory = updatedHistory;

    return fee.toFixed(2);
  });
};
