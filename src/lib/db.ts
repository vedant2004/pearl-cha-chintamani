import fs from 'fs';
import path from 'path';
import os from 'os';
import { FullDatabaseState } from './types';
import { initialSeedData } from './seed-data';

// Persistent in-memory cache for serverless environments
let memoryState: FullDatabaseState | null = null;

const DATA_FILE = path.join(process.cwd(), 'data', 'db.json');
const TMP_DATA_FILE = path.join(os.tmpdir(), 'chintamani_db.json');

export function getDatabase(): FullDatabaseState {
  if (memoryState) {
    return memoryState;
  }

  // 1. Try reading from /tmp cache (useful in serverless lambdas where /tmp is writable)
  try {
    if (fs.existsSync(TMP_DATA_FILE)) {
      const tmpContent = fs.readFileSync(TMP_DATA_FILE, 'utf-8');
      memoryState = JSON.parse(tmpContent);
      return memoryState!;
    }
  } catch {
    // Ignore and proceed to main data file
  }

  // 2. Try reading from project data file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryState = JSON.parse(content);
      return memoryState!;
    }
  } catch (error) {
    console.warn('Could not read from data file, using seed data fallback:', error);
  }

  // 3. Fallback to initial seed data
  memoryState = JSON.parse(JSON.stringify(initialSeedData));
  saveDatabase(memoryState!);
  return memoryState!;
}

export function saveDatabase(data: FullDatabaseState): boolean {
  memoryState = data;

  // Always attempt writing to project data/db.json
  let written = false;
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    written = true;
  } catch {
    // Read-only filesystem in serverless production
  }

  // Also write to OS tmp directory for serverless persistence
  try {
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    written = true;
  } catch {
    // Ignore tmp write failure
  }

  return written || true;
}
