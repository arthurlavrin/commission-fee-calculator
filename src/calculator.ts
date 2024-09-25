import {
  CashOutHistory,
  InputData,
  OperationConfig,
  ProcessedOperationResult,
} from './types';
import { fetchAllConfigs } from './configFetcher';
import {
  getCashInConfig,
  getCashOutConfig,
  getWeekNumber,
  handleCashInOperation,
  handleCashOutOperation,
  isCashInOperation,
  isCashOutOperation,
  validateCashInConfig,
  validateCashOutConfig,
} from './helpers';

export const processOperation = (
  operation: InputData,
  { cashOutHistory, cashInConfig, cashOutConfig, week }: OperationConfig,
): ProcessedOperationResult => {
  const validatedCashInConfig = validateCashInConfig(operation, cashInConfig);
  const validatedCashOutConfig = validateCashOutConfig(
    operation,
    cashOutConfig,
  );

  if (isCashInOperation(operation)) {
    return handleCashInOperation(
      operation,
      validatedCashInConfig,
      cashOutHistory,
    );
  }

  if (isCashOutOperation(operation)) {
    return handleCashOutOperation(
      operation,
      validatedCashOutConfig,
      cashOutHistory,
      week,
    );
  }

  throw new Error(`Unsupported operation type: ${operation.type}`);
};

export const calculateCommissions = async (
  data: InputData[],
): Promise<string[]> => {
  let cashOutHistory: CashOutHistory = {};

  try {
    const { cashInConfig, cashOutNaturalConfig, cashOutLegalConfig } =
      await fetchAllConfigs();

    return data.map((operation) => {
      const week = getWeekNumber(new Date(operation.date));

      const configForCashOut = getCashOutConfig(operation, {
        cashOutNaturalConfig,
        cashOutLegalConfig,
      });

      const cashInConfigForOperation = getCashInConfig(operation, cashInConfig);

      const operationConfig: OperationConfig = {
        cashOutHistory,
        cashInConfig: cashInConfigForOperation,
        cashOutConfig: configForCashOut,
        week,
      };

      const { fee, updatedHistory } = processOperation(
        operation,
        operationConfig,
      );
      cashOutHistory = updatedHistory;

      return fee.toFixed(2);
    });
  } catch (error) {
    console.error('Error calculating commissions:', error);
    throw error;
  }
};
