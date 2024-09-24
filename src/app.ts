import * as fs from 'fs';
import { calculateCommissions } from './calculator';
import { InputData } from './types';

const filePath = process.argv[2];

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) throw err;

  const operations: InputData[] = JSON.parse(data);

  try {
    const results = await calculateCommissions(operations);
    results.forEach((result) => console.log(result));
  } catch (error) {
    console.error('Error while calculating commissions:', error);
  }
});
