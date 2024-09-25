import fetch from 'node-fetch';
import {
  CashInConfig,
  CashInOperationConfig,
  CashOutJuridicalConfig,
  CashOutLegalOperationConfig,
  CashOutNaturalConfig,
  CashOutNaturalOperationConfig,
} from './types';
import { commissionFeesConfigApi } from './api';

const fetchWithHandling = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error(
        `Failed to fetch data from ${url}: ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export const fetchCashInConfig = async (): Promise<CashInOperationConfig> => {
  const config = await fetchWithHandling<CashInConfig>(
    commissionFeesConfigApi.cashInUrl,
  );
  return {
    rate: config.percents / 100,
    maxAmount: config.max.amount,
  };
};

export const fetchCashOutNaturalConfig =
  async (): Promise<CashOutNaturalOperationConfig> => {
    const config = await fetchWithHandling<CashOutNaturalConfig>(
      commissionFeesConfigApi.cashOutNaturalUrl,
    );
    return {
      rate: config.percents / 100,
      weekLimit: config.week_limit.amount,
    };
  };

export const fetchCashOutLegalConfig =
  async (): Promise<CashOutLegalOperationConfig> => {
    const config = await fetchWithHandling<CashOutJuridicalConfig>(
      commissionFeesConfigApi.cashOutJuridicalUrl,
    );
    return {
      rate: config.percents / 100,
      minAmount: config.min.amount,
    };
  };

export const fetchAllConfigs = async (): Promise<{
  cashInConfig: CashInOperationConfig;
  cashOutNaturalConfig: CashOutNaturalOperationConfig;
  cashOutLegalConfig: CashOutLegalOperationConfig;
}> => {
  try {
    const [cashInConfig, cashOutNaturalConfig, cashOutLegalConfig]: [
      CashInOperationConfig,
      CashOutNaturalOperationConfig,
      CashOutLegalOperationConfig,
    ] = await Promise.all([
      fetchCashInConfig(),
      fetchCashOutNaturalConfig(),
      fetchCashOutLegalConfig(),
    ]);

    return { cashInConfig, cashOutNaturalConfig, cashOutLegalConfig };
  } catch (error) {
    console.error('Error fetching all configs:', error);
    throw error;
  }
};
