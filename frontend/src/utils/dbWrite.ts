/**
 * src/utils/dbWrite.ts
 */

import { type CsvRow } from './types';
import { nanoid } from "nanoid";

const mockDb: Record<string, CsvRow> = {};

function generateId(): string {
  return nanoid(10);
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

export function getMockDb(): Record<string, CsvRow> {
  return mockDb;
}