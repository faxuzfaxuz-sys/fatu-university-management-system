import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { users, courses, schedules } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (currentUser.role !== "rector" && currentUser.role !== "dean") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const teachersList = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      department: users.department,
      teacherId: users.teacherId,
      phone: users.phone,
      avatar: users.avatar,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      currentUser.role === "rector"
        ? eq(users.role, "teacher")
        : and(
            eq(users.role, "teacher"),
            eq(users.department, currentUser.department as typeof users.department.enumValues[number])
          )
    );

  const teachersWithCourses = await Promise.all(
    teachersList.map(async (teacher) => {
      const teacherCourses = await db
        .select()
        .from(courses)
        .where(eq(courses.teacherId, teacher.id));

      const teacherSchedules = await db
        .select()
        .from(schedules)
        .where(eq(schedules.teacherId, teacher.id));

      return {
        ...teacher,
        courses: teacherCourses,
        schedules: teacherSchedules,
        totalCourses: teacherCourses.length,
      };
    })
  );

  return NextResponse.json(teachersWithCourses);
}
