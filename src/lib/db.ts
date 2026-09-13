import fs from 'fs';
import path from 'path';
import os from 'os';
import { FullDatabaseState } from './types';
import { initialSeedData } from './seed-data';

// Persistent in-memory cache
let memoryState: FullDatabaseState | null = null;
let lastLoadedMtime = 0;

const DATA_FILE = path.join(process.cwd(), 'data', 'db.json');
const TMP_DATA_FILE = path.join(os.tmpdir(), 'chintamani_db.json');

export function getDatabase(): FullDatabaseState {
  let fileToRead: string | null = null;
  let highestMtime = 0;

  // 1. Check data/db.json first (source of truth)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const stats = fs.statSync(DATA_FILE);
      fileToRead = DATA_FILE;
      highestMtime = stats.mtimeMs;
    }
  } catch {
    // Ignore error reading DATA_FILE
  }

  // 2. Check /tmp cache only if it's strictly newer (useful in serverless lambdas where project fs is read-only)
  try {
    if (fs.existsSync(TMP_DATA_FILE)) {
      const stats = fs.statSync(TMP_DATA_FILE);
      if (stats.mtimeMs > highestMtime) {
        fileToRead = TMP_DATA_FILE;
        highestMtime = stats.mtimeMs;
      }
    }
  } catch {
    // Ignore error reading TMP_DATA_FILE
  }

  // If memoryState is fresh and file on disk hasn't changed since last read, return cached state
  if (memoryState && fileToRead && highestMtime <= lastLoadedMtime) {
    return memoryState;
  }

  // Read latest content from the freshest file
  if (fileToRead) {
    try {
      const content = fs.readFileSync(fileToRead, 'utf-8');
      memoryState = JSON.parse(content);
      lastLoadedMtime = highestMtime;
      return memoryState!;
    } catch (error) {
      console.warn(`Could not parse JSON from ${fileToRead}:`, error);
    }
  }

  if (memoryState) {
    return memoryState;
  }

  // 3. Fallback to initial seed data
  memoryState = JSON.parse(JSON.stringify(initialSeedData));
  saveDatabase(memoryState!);
  return memoryState!;
}

export function saveDatabase(data: FullDatabaseState): boolean {
  memoryState = data;
  const now = Date.now();
  let written = false;

  // Always write to project data/db.json
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    written = true;
    try {
      lastLoadedMtime = fs.statSync(DATA_FILE).mtimeMs;
    } catch {
      lastLoadedMtime = now;
    }
  } catch {
    // Read-only filesystem in serverless production
  }

  // Also write to OS tmp directory for serverless persistence
  try {
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    written = true;
    try {
      const tmpMtime = fs.statSync(TMP_DATA_FILE).mtimeMs;
      if (tmpMtime > lastLoadedMtime) {
        lastLoadedMtime = tmpMtime;
      }
    } catch {
      // Ignore
    }
  } catch {
    // Ignore tmp write failure
  }

  return written;
}
