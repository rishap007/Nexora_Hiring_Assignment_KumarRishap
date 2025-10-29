import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

const dbPath = process.env.DATABASE_URL || (process.env.NODE_ENV === "production" ? "/data/production.db" : "./local.db");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
