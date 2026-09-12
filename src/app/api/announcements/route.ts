import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { announcements, users } from "@/db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { isDepartment } from "@/lib/validation";

export async function GET() {
  const currentUser = await getCurrentUser();
  const allAnnouncements = await db
    .select({
      id: announcements.id,
      title: announcements.title,
      content: announcements.content,
      department: announcements.department,
      isPublic: announcements.isPublic,
      createdAt: announcements.createdAt,
      authorName: users.fullName,
      authorRole: users.role,
    })
    .from(announcements)
    .leftJoin(users, eq(announcements.authorId, users.id))
    .where(
      !currentUser
        ? eq(announcements.isPublic, true)
        : currentUser.role === "rector"
          ? undefined
          : or(
              eq(announcements.isPublic, true),
              eq(
                announcements.department,
                currentUser.department as typeof announcements.department.enumValues[number]
              )
            )
    )
    .orderBy(desc(announcements.createdAt));

  return NextResponse.json(allAnnouncements);
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!["rector", "dean", "teacher"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, department, isPublic } = body;
  if (
    typeof title !== "string" ||
    title.trim().length < 3 ||
    title.length > 500 ||
    typeof content !== "string" ||
    content.trim().length < 3 ||
    content.length > 10000 ||
    (department !== undefined && department !== null && department !== "" && !isDepartment(department)) ||
    (isPublic !== undefined && typeof isPublic !== "boolean")
  ) {
    return NextResponse.json({ error: "E'lon ma'lumotlari noto'g'ri" }, { status: 400 });
  }

  if (
    currentUser.role !== "rector" &&
    department !== currentUser.department
  ) {
    return NextResponse.json({ error: "Faqat o'z yo'nalishingiz uchun e'lon joylashingiz mumkin" }, { status: 403 });
  }

  const [newAnnouncement] = await db
    .insert(announcements)
    .values({
      title: title.trim(),
      content: content.trim(),
      authorId: currentUser.userId,
      department: department || null,
      isPublic: isPublic ?? true,
    })
    .returning();

  return NextResponse.json({ success: true, announcement: newAnnouncement });
}
