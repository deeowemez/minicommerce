/**
 * src/utils/dbWrite.ts
 */

import { type CsvRow } from './types';

// In-memory mock DB (for local testing)
const mockDb: Record<string, CsvRow> = {};

/**
 * Generates a random ID for newly added items.
 * Replace with UUID or DB-generated IDs in production.
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function addItems(items: CsvRow[]): Promise<void> {
  console.log('Adding', items);
  for (const item of items) {
    const id = item.id ?? generateId();
    mockDb[id] = { ...item, id };
  }
}

export async function updateItems(items: CsvRow[]): Promise<void> {
  console.log('Updating', items);
  for (const item of items) {
    if (!item.id || !mockDb[item.id]) {
      console.warn(`Skipping update: id ${item.id ?? '(missing)'} not found`);
      continue;
    }
    mockDb[item.id] = { ...mockDb[item.id], ...item };
  }
}

export async function deleteItems(items: CsvRow[]): Promise<void> {
  console.log('Deleting', items);
  for (const item of items) {
    if (!item.id || !mockDb[item.id]) {
      console.warn(`Skipping delete: id ${item.id ?? '(missing)'} not found`);
      continue;
    }
    delete mockDb[item.id];
  }
}

// For inspection/testing
export function getMockDb(): Record<string, CsvRow> {
  return mockDb;
}