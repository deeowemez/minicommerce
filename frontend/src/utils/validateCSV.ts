/**
 * src/utils/validateCSV.ts
 */

import Papa from 'papaparse';

import { type CsvRow, type CsvParseResult, type CsvAction, type ValidationError } from './types';

export function parseAndValidateCSV(file: File | string): Promise<CsvParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: ValidationError[] = [];
        const validRows: CsvRow[] = [];

        results.data.forEach((row, index) => {
          const rowErrors: string[] = [];
          const rowNumber = index + 2;

          // --- Required fields common to all actions ---
          if (!row.name) rowErrors.push('Missing product name');
          if (!row.price || isNaN(parseFloat(row.price))) {
            rowErrors.push('Invalid or missing price');
          }
          if (!row.description) rowErrors.push('Missing product description');
          if (!row.image_url) rowErrors.push('Missing image_url');

          const action = row.action?.toLowerCase();

          if (!action) {
            rowErrors.push('Missing action');
          } else if (!['add', 'update', 'delete'].includes(action)) {
            rowErrors.push(`Invalid action "${row.action}"`);
          } else {
            if ((action === 'update' || action === 'delete') && !row.id) {
              rowErrors.push(`id is required for ${action}`);
            }
          }

          if (rowErrors.length > 0) {
            errors.push({ row: rowNumber, message: rowErrors.join(', ') });
          } else {
            validRows.push({
              id: row.id || null,
              name: row.name,
              description: row.description,
              price: parseFloat(row.price),
              imageUrl: row.image_url,
              action: action as CsvAction,
            });
          }
        });

        resolve({ validRows, errors });
      },
      error: (err) => reject(err)
    });
  });
}
