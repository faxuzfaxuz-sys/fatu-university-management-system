import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Build vaqtida modul import qilinishi mumkin, shuning uchun importda xato
  // bermaymiz — ulanish vaqtida aniq xabar chiqadi.
  console.warn(
    "[db] DATABASE_URL sozlanmagan. .env.example ni .env.local ga nusxalab, PostgreSQL ulanishini ko'rsating."
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool(
    databaseUrl
      ? { connectionString: databaseUrl, connectionTimeoutMillis: 5000 }
      : { connectionTimeoutMillis: 5000 }
  );

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
