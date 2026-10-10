import "dotenv/config";
import { seedDatabase } from "../src/lib/seed";
import { pool } from "../src/db";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL topilmadi. .env.local faylida PostgreSQL ulanishini ko'rsating " +
        "(yoki embedded baza uchun: DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres npm run dev:db)."
    );
    process.exit(1);
  }
  await seedDatabase();
  console.log("Demo ma'lumotlari tayyor.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });