import fetch from 'node-fetch';
import {
  CashInConfig,
  CashOutJuridicalConfig,
  CashOutNaturalConfig,
} from './types';

// API Endpoints
const CASH_IN_API = 'https://developers.paysera.com/tasks/api/cash-in';
const CASH_OUT_NATURAL_API =
  'https://developers.paysera.com/tasks/api/cash-out-natural';
const CASH_OUT_JURIDICAL_API =
  'https://developers.paysera.com/tasks/api/cash-out-juridical';

// Fetch Cash In Configuration
export const fetchCashInConfig = async (): Promise<{
  percents: number;
  maxAmount: number;
}> => {
  const response = await fetch(CASH_IN_API);
  const config = (await response.json()) as CashInConfig;
  return {
    percents: config.percents / 100,
    maxAmount: config.max.amount,
  };
};

// Fetch Cash Out Natural Configuration
export const fetchCashOutNaturalConfig = async (): Promise<{
  percents: number;
  weekLimit: number;
}> => {
  const response = await fetch(CASH_OUT_NATURAL_API);
  const config = (await response.json()) as CashOutNaturalConfig;
  return {
    percents: config.percents / 100,
    weekLimit: config.week_limit.amount,
  };
};

// Fetch Cash Out Legal Configuration
export const fetchCashOutLegalConfig = async (): Promise<{
  percents: number;
  minAmount: number;
}> => {
  const response = await fetch(CASH_OUT_JURIDICAL_API);
  const config = (await response.json()) as CashOutJuridicalConfig;
  return {
    percents: config.percents / 100,
    minAmount: config.min.amount,
  };
};
