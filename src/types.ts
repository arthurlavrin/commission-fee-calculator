export type UserType = 'natural' | 'juridical';
export type OperationType = 'cash_in' | 'cash_out';

export interface Operation {
  amount: number;
  currency: string;
}

export interface InputData {
  date: string;
  user_id: number;
  user_type: UserType;
  type: OperationType;
  operation: Operation;
}

export interface CashInConfig {
  percents: number;
  max: {
    amount: number;
    currency: string;
  };
}

export interface CashOutNaturalConfig {
  percents: number;
  week_limit: {
    amount: number;
    currency: string;
  };
}

export interface CashOutJuridicalConfig {
  percents: number;
  min: {
    amount: number;
    currency: string;
  };
}

export interface CashOutHistory {
  [userId: number]: { [week: number]: number };
}

export interface CashInOperationConfig {
  percents: number;
  maxAmount: number;
}

export interface CashOutNaturalOperationConfig {
  percents: number;
  weekLimit: number;
}

export interface CashOutLegalOperationConfig {
  percents: number;
  minAmount: number;
}
