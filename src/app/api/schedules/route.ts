import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { schedules, courses, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allSchedules = await db
    .select({
      id: schedules.id,
      dayOfWeek: schedules.dayOfWeek,
      startTime: schedules.startTime,
      endTime: schedules.endTime,
      room: schedules.room,
      department: schedules.department,
      courseName: courses.name,
      courseCode: courses.code,
      teacherName: users.fullName,
    })
    .from(schedules)
    .leftJoin(courses, eq(schedules.courseId, courses.id))
    .leftJoin(users, eq(schedules.teacherId, users.id))
    .orderBy(schedules.dayOfWeek, schedules.startTime);

  return NextResponse.json(allSchedules);
}
