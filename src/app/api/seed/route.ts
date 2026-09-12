import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function POST(request: Request) {
  const seedSecret = process.env.SEED_SECRET;
  if (!seedSecret) {
    return NextResponse.json({ error: "Seed endpoint o'chirilgan" }, { status: 404 });
  }

  // The seed route is intended only for an initial setup, never as a public endpoint.
  const requestSecret = request.headers.get("x-seed-secret");
  if (requestSecret !== seedSecret) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: "Database seeded" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
