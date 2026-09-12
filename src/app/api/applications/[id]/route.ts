import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role !== "rector" && currentUser.role !== "dean") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const { id } = await params;
  const applicationId = Number.parseInt(id, 10);
  if (!Number.isInteger(applicationId) || applicationId < 1) {
    return NextResponse.json({ error: "Noto'g'ri ariza ID" }, { status: 400 });
  }

  const body = await request.json();
  const { status, reviewNote } = body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
  }
  if (reviewNote !== undefined && reviewNote !== null && (typeof reviewNote !== "string" || reviewNote.length > 5000)) {
    return NextResponse.json({ error: "Izoh juda uzun" }, { status: 400 });
  }

  const [updated] = await db
    .update(applications)
    .set({
      status,
      reviewNote: typeof reviewNote === "string" ? reviewNote.trim() : null,
      reviewedBy: currentUser.userId,
    })
    .where(
      currentUser.role === "rector"
        ? eq(applications.id, applicationId)
        : and(
            eq(applications.id, applicationId),
            eq(applications.department, currentUser.department as typeof applications.department.enumValues[number])
          )
    )
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Ariza topilmadi" }, { status: 404 });
  }

  return NextResponse.json({ success: true, application: updated });
}
