import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { enrollments, courses, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const myGrades = await db
    .select({
      id: enrollments.id,
      grade: enrollments.grade,
      score: enrollments.score,
      attendance: enrollments.attendance,
      enrolledAt: enrollments.enrolledAt,
      courseName: courses.name,
      courseCode: courses.code,
      credits: courses.credits,
      semester: courses.semester,
      teacherName: users.fullName,
    })
    .from(enrollments)
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .leftJoin(users, eq(courses.teacherId, users.id))
    .where(eq(enrollments.studentId, currentUser.userId));

  return NextResponse.json(myGrades);
}
