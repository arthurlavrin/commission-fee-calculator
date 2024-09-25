import { UserType } from './user';

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
