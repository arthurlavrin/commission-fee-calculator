import { CashOutHistory } from './history';
import { CashInOperationConfig, CashOutOperationConfig } from './config';

export interface ProcessedOperationResult {
  fee: number;
  updatedHistory: CashOutHistory;
}

export type OperationConfig = {
  cashInConfig: CashInOperationConfig | null;
  cashOutConfig: CashOutOperationConfig | null;
  cashOutHistory: CashOutHistory;
  week: number;
};
