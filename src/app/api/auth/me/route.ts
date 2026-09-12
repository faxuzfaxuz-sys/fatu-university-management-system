import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, currentUser.userId));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    department: user.department,
    studentId: user.studentId,
    teacherId: user.teacherId,
    phone: user.phone,
  });
}
