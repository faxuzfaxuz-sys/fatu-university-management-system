import "dotenv/config";
import { seedDatabase } from "../src/lib/seed";
import { pool } from "../src/db";

async function main() {
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