import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { isDepartment, isEmail } from "@/lib/validation";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (currentUser.role !== "rector" && currentUser.role !== "dean") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const allApplications = await db
    .select()
    .from(applications)
    .where(
      currentUser.role === "rector"
        ? undefined
        : and(
            eq(applications.department, currentUser.department as typeof applications.department.enumValues[number])
          )
    )
    .orderBy(desc(applications.createdAt));

  return NextResponse.json(allApplications);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicantName, email, phone, department, message } = body;

    if (
      typeof applicantName !== "string" ||
      applicantName.trim().length < 2 ||
      applicantName.length > 200 ||
      !isEmail(email) ||
      !isDepartment(department) ||
      (phone !== undefined && phone !== null && (typeof phone !== "string" || phone.length > 50)) ||
      (message !== undefined && message !== null && (typeof message !== "string" || message.length > 5000))
    ) {
      return NextResponse.json(
        { error: "Ism, email va yo'nalish kiritilishi shart" },
        { status: 400 }
      );
    }

    const [newApplication] = await db
      .insert(applications)
      .values({
        applicantName: applicantName.trim(),
        email: email.trim().toLowerCase(),
        phone: typeof phone === "string" ? phone.trim() : null,
        department,
        message: typeof message === "string" ? message.trim() : null,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ success: true, application: newApplication });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
