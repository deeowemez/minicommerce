/**
 * src/utils/types.ts
 */

export type CsvAction = 'add' | 'update' | 'delete';

export interface CsvRow {
  id?: string | null;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  action: CsvAction;
}

export interface CsvParseResult {
  validRows: CsvRow[];
  errors: ValidationError[];
}

export interface ValidationError {
  row: number;
  message: string;
}

export interface BranchOutput {
  adds: CsvRow[];
  updates: CsvRow[];
  deletes: CsvRow[];
}
