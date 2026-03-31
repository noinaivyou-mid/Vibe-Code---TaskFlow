import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const prismaDir = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(prismaDir, 'dev.db');
const initSqlPath = path.join(prismaDir, 'init.sql');

try {
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
  });
} catch (error) {
  if (existsSync(dbPath)) {
    throw error;
  }

  console.warn('Prisma db push failed on this machine; applying SQLite init.sql fallback.');

  const db = new DatabaseSync(dbPath);
  const sql = readFileSync(initSqlPath, 'utf8');

  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(sql);
  db.close();

  console.log(`SQLite schema created at ${dbPath}`);
}
