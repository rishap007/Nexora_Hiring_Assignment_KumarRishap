import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";
import { mkdirSync } from "fs";
import { dirname } from "path";

const dbPath = process.env.DATABASE_URL || (process.env.NODE_ENV === "production" ? "/data/production.db" : "./local.db");

// Ensure directory exists
try {
  mkdirSync(dirname(dbPath), { recursive: true });
} catch (error) {
  // Directory already exists or cannot be created
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
