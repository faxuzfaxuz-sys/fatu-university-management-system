// Embedded Postgres (PGlite) development server.
// PostgreSQL o'rnatmasdan turib ilovani lokal ishga tushirish uchun:
//   node scripts/dev-db.mjs
// So'ng DATABASE_URL=postgres://postgres@127.0.0.1:<PGLITE_PORT>/postgres
// Ma'lumotlar .pglite/ papkasida saqlanadi (git'ga kirmaydi).
import { mkdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { createServer, LogLevel } from "pglite-server";

const host = process.env.PGLITE_HOST || "127.0.0.1";
const port = Number(process.env.PGLITE_PORT || "5432");
const dataDir = process.env.PGLITE_DATA_DIR || "./.pglite/data";

mkdirSync(dataDir, { recursive: true });

const db = new PGlite(dataDir);
await db.query("SELECT 1"); // bazani tayyor holatga keltiradi

const server = createServer(db, { logLevel: LogLevel.Error });

server.on("error", (error) => {
  console.error("Embedded Postgres xatosi:", error.message);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(
    `Embedded Postgres (PGlite) tayyor: postgres://postgres@${host}:${port}/postgres`
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close();
    db.close().finally(() => process.exit(0));
  });
}
