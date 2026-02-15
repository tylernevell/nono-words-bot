import path from "node:path";
import { fileURLToPath } from "node:url";
import Database, { type Database as DatabaseType } from "better-sqlite3";

interface DbFactoryOptions {
	filename?: string;
	walMode?: boolean;
}

export function createDb(options: DbFactoryOptions = {}): DatabaseType {
	const { filename = "scores.db", walMode = true } = options;

	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const dbPath = path.resolve(__dirname, "../../", filename);

	const db = new Database(dbPath);

	if (walMode) {
		db.pragma("journal_mode = WAL");
	}

	// Schema setup lives here so any db instance (including test) gets the tables
	db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      user_id     TEXT PRIMARY KEY,
      username    TEXT NOT NULL,
      score       INTEGER NOT NULL DEFAULT 0,
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	return db;
}

// Singleton — reuse the same connection across the app
let instance: DatabaseType | null = null;

export function getDb(options?: DbFactoryOptions): DatabaseType {
	if (!instance) {
		instance = createDb(options);
	}
	return instance;
}

// Useful in tests to get a fresh in-memory database
export function createTestDb(): DatabaseType {
	return createDb({ filename: ":memory:" });
}
