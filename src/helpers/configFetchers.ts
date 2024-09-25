import {
  CashInOperationConfig,
  CashOutOperationConfig,
  InputData,
  CashOutNaturalOperationConfig,
  CashOutLegalOperationConfig,
} from '../types';

export const getCashOutConfig = (
  operation: InputData,
  configs: {
    cashOutNaturalConfig: CashOutNaturalOperationConfig;
    cashOutLegalConfig: CashOutLegalOperationConfig;
  },
): CashOutOperationConfig | null => {
  if (operation.type !== 'cash_out') return null;

  return operation.user_type === 'natural'
    ? configs.cashOutNaturalConfig
    : configs.cashOutLegalConfig;
};

export const getCashInConfig = (
  operation: InputData,
  cashInConfig: CashInOperationConfig,
): CashInOperationConfig | null => {
  return operation.type === 'cash_in' &&
    cashInConfig &&
    'maxAmount' in cashInConfig
    ? cashInConfig
    : null;
};
