import { CashInOperationConfig } from '../types';

export const roundUp = (amount: number): number =>
  Math.ceil(amount * 100) / 100;

export const calculateCashOutLegalFee = (
  amount: number,
  percents: number,
  minAmount: number,
): number => roundUp(Math.max(amount * percents, minAmount));

export const calculateCashInFee = (
  amount: number,
  cashInConfig: CashInOperationConfig,
): number => {
  const fee = amount * cashInConfig.rate;
  return roundUp(Math.min(fee, cashInConfig.maxAmount));
};

export const calculateCashOutNaturalFee = (
  amount: number,
  weekLimit: number,
  weeklyTotal: number,
  percents: number,
): { fee: number; chargeableAmount: number } => {
  const freeAmount = Math.max(weekLimit - weeklyTotal, 0);
  const chargeableAmount = Math.max(amount - freeAmount, 0);
  const fee = roundUp(chargeableAmount * percents);
  return { fee, chargeableAmount };
};
