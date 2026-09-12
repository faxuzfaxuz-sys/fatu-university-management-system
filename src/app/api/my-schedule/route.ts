import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { schedules, courses, users, enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role === "student") {
    // Get student's enrolled courses schedules
    const [userRecord] = await db.select().from(users).where(eq(users.id, currentUser.userId));
    
    const mySchedules = await db
      .select({
        id: schedules.id,
        dayOfWeek: schedules.dayOfWeek,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        room: schedules.room,
        courseName: courses.name,
        courseCode: courses.code,
        teacherName: users.fullName,
        department: schedules.department,
      })
      .from(schedules)
      .leftJoin(courses, eq(schedules.courseId, courses.id))
      .leftJoin(users, eq(schedules.teacherId, users.id))
      .where(eq(schedules.department, userRecord.department!));

    return NextResponse.json(mySchedules);
  }

  if (currentUser.role === "teacher") {
    const mySchedules = await db
      .select({
        id: schedules.id,
        dayOfWeek: schedules.dayOfWeek,
        startTime: schedules.startTime,
        endTime: schedules.endTime,
        room: schedules.room,
        courseName: courses.name,
        courseCode: courses.code,
        department: schedules.department,
      })
      .from(schedules)
      .leftJoin(courses, eq(schedules.courseId, courses.id))
      .where(eq(schedules.teacherId, currentUser.userId));

    return NextResponse.json(mySchedules);
  }

  // Rector/Dean gets all
  const allSchedules = await db
    .select({
      id: schedules.id,
      dayOfWeek: schedules.dayOfWeek,
      startTime: schedules.startTime,
      endTime: schedules.endTime,
      room: schedules.room,
      courseName: courses.name,
      courseCode: courses.code,
      teacherName: users.fullName,
      department: schedules.department,
    })
    .from(schedules)
    .leftJoin(courses, eq(schedules.courseId, courses.id))
    .leftJoin(users, eq(schedules.teacherId, users.id));

  return NextResponse.json(allSchedules);
}
