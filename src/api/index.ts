import * as dotenv from 'dotenv';

dotenv.config();

export const commissionFeesConfigApi = {
  cashInUrl: `${process.env.API_BASE_URL}/cash-in`,
  cashOutNaturalUrl: `${process.env.API_BASE_URL}/cash-out-natural`,
  cashOutJuridicalUrl: `${process.env.API_BASE_URL}/cash-out-juridical`,
};
