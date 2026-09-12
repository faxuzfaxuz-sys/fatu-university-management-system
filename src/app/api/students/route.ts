import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { users, enrollments, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!["rector", "dean", "teacher"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const studentsList = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      department: users.department,
      studentId: users.studentId,
      phone: users.phone,
      avatar: users.avatar,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      currentUser.role === "rector"
        ? eq(users.role, "student")
        : and(
            eq(users.role, "student"),
            eq(users.department, currentUser.department as typeof users.department.enumValues[number])
          )
    );

  const studentsWithGrades = await Promise.all(
    studentsList.map(async (student) => {
      const studentEnrollments = await db
        .select({
          courseId: enrollments.courseId,
          grade: enrollments.grade,
          score: enrollments.score,
          attendance: enrollments.attendance,
          courseName: courses.name,
          courseCode: courses.code,
        })
        .from(enrollments)
        .leftJoin(courses, eq(enrollments.courseId, courses.id))
        .where(eq(enrollments.studentId, student.id));

      const avgScore = studentEnrollments.length > 0
        ? studentEnrollments.reduce((sum, e) => sum + (parseFloat(e.score?.toString() || "0")), 0) / studentEnrollments.length
        : 0;

      const avgAttendance = studentEnrollments.length > 0
        ? studentEnrollments.reduce((sum, e) => sum + (e.attendance || 0), 0) / studentEnrollments.length
        : 0;

      const performance = avgScore >= 80 ? "excellent" : avgScore >= 60 ? "average" : "poor";

      return {
        ...student,
        enrollments: studentEnrollments,
        avgScore: Math.round(avgScore * 10) / 10,
        avgAttendance: Math.round(avgAttendance),
        performance,
      };
    })
  );

  return NextResponse.json(studentsWithGrades);
}
