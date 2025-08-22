/**
 * src/utils/branchByAction.ts
 */

import { type CsvRow, type BranchOutput } from './types';

export function branchByAction(rows: CsvRow[]): BranchOutput {
  const adds: CsvRow[] = [];
  const updates: CsvRow[] = [];
  const deletes: CsvRow[] = [];

  for (const row of rows) {
    switch (row.action) {
      case 'add':
        adds.push(row);
        break;
      case 'update':
        updates.push(row);
        break;
      case 'delete':
        deletes.push(row);
        break;
      default:
        console.warn(`Unknown action "${row.action}" in row`, row);
        break;
    }
  }

  return { adds, updates, deletes };
}
