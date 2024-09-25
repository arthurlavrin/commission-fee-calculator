export interface CashInConfig {
  percents: number;
  max: {
    amount: number;
    currency: string;
  };
}

export interface CashInOperationConfig {
  rate: number;
  maxAmount: number;
}

export interface CashOutNaturalConfig {
  percents: number;
  week_limit: {
    amount: number;
    currency: string;
  };
}

export interface CashOutNaturalOperationConfig {
  rate: number;
  weekLimit: number;
}

export interface CashOutJuridicalConfig {
  percents: number;
  min: {
    amount: number;
    currency: string;
  };
}

export interface CashOutLegalOperationConfig {
  rate: number;
  minAmount: number;
}

export type CashOutOperationConfig =
  | CashOutNaturalOperationConfig
  | CashOutLegalOperationConfig
  | null;
