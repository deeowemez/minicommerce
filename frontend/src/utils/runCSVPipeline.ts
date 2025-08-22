/**
 * src/utils/runCSVPipeline.ts
 */

import { parseAndValidateCSV } from './validateCSV';
import { branchByAction } from './branchByAction';
import { addItems, updateItems, deleteItems, getMockDb } from './dbWrite';

export async function runCsvPipeline(file: File | string) {
  const { validRows, errors } = await parseAndValidateCSV(file);
  if (errors.length) {
    console.warn('Validation errors found:');
    errors.forEach(err => console.warn(`  Row ${err.row}: ${err.message}`));
  }

  if (validRows.length === 0) {
    console.log('No valid rows to process.');
    return;
  }

  const { adds, updates, deletes } = branchByAction(validRows);

  await Promise.all([
    addItems(adds),
    updateItems(updates),
    deleteItems(deletes),
  ]);

  console.log('CSV processing complete.');
  console.log('Current DB state:', getMockDb());
}