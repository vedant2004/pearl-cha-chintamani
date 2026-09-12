import fs from 'fs';
import path from 'path';
import { FullDatabaseState } from './types';
import { initialSeedData } from './seed-data';

// Persistent in-memory cache for serverless environments
let memoryState: FullDatabaseState | null = null;

const DATA_FILE = path.join(process.cwd(), 'data', 'db.json');

export function getDatabase(): FullDatabaseState {
  if (memoryState) {
    return memoryState;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryState = JSON.parse(content);
      return memoryState!;
    }
  } catch (error) {
    console.warn('Could not read from data file, using seed data fallback:', error);
  }

  // If file doesn't exist yet, initialize with seed data
  memoryState = JSON.parse(JSON.stringify(initialSeedData));
  saveDatabase(memoryState!);
  return memoryState!;
}

export function saveDatabase(data: FullDatabaseState): boolean {
  memoryState = data;
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.warn('Could not write to data file (running in read-only environment):', error);
    return true; // Still preserved in memoryState for the running instance
  }
}
