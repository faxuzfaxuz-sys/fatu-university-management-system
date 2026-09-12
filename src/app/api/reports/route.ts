import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { users, courses, enrollments, applications, announcements, schedules } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role !== "rector") {
    return NextResponse.json({ error: "Faqat rektor ko'rishi mumkin" }, { status: 403 });
  }

  // Total counts
  const [students] = await db.select({ count: count() }).from(users).where(eq(users.role, "student"));
  const [teachers] = await db.select({ count: count() }).from(users).where(eq(users.role, "teacher"));
  const [deans] = await db.select({ count: count() }).from(users).where(eq(users.role, "dean"));
  const [totalCourses] = await db.select({ count: count() }).from(courses);
  const [totalEnrollments] = await db.select({ count: count() }).from(enrollments);
  const [pendingApps] = await db.select({ count: count() }).from(applications).where(eq(applications.status, "pending"));
  const [approvedApps] = await db.select({ count: count() }).from(applications).where(eq(applications.status, "approved"));
  const [rejectedApps] = await db.select({ count: count() }).from(applications).where(eq(applications.status, "rejected"));

  // Grade distribution
  const gradeStats = await db
    .select({ grade: enrollments.grade, count: count() })
    .from(enrollments)
    .groupBy(enrollments.grade);

  // Department student count
  const deptStats = await db
    .select({ department: users.department, count: count() })
    .from(users)
    .where(eq(users.role, "student"))
    .groupBy(users.department);

  // Top students (high score)
  const topStudents = await db
    .select({
      name: users.fullName,
      department: users.department,
      studentId: users.studentId,
      avgScore: sql<number>`AVG(${enrollments.score}::numeric)`,
      avgAttendance: sql<number>`AVG(${enrollments.attendance}::numeric)`,
    })
    .from(users)
    .leftJoin(enrollments, eq(users.id, enrollments.studentId))
    .where(eq(users.role, "student"))
    .groupBy(users.id, users.fullName, users.department, users.studentId)
    .orderBy(sql`AVG(${enrollments.score}::numeric) desc nulls last`)
    .limit(5);

  // Weak students (low score)
  const weakStudents = await db
    .select({
      name: users.fullName,
      department: users.department,
      studentId: users.studentId,
      avgScore: sql<number>`AVG(${enrollments.score}::numeric)`,
      avgAttendance: sql<number>`AVG(${enrollments.attendance}::numeric)`,
    })
    .from(users)
    .leftJoin(enrollments, eq(users.id, enrollments.studentId))
    .where(eq(users.role, "student"))
    .groupBy(users.id, users.fullName, users.department, users.studentId)
    .orderBy(sql`AVG(${enrollments.score}::numeric) asc nulls last`)
    .limit(5);

  // All teachers with courses
  const teachersReport = await db
    .select({
      name: users.fullName,
      department: users.department,
      teacherId: users.teacherId,
      totalCourses: count(courses.id),
    })
    .from(users)
    .leftJoin(courses, eq(users.id, courses.teacherId))
    .where(eq(users.role, "teacher"))
    .groupBy(users.id, users.fullName, users.department, users.teacherId);

  // Recent applications
  const recentApplications = await db
    .select()
    .from(applications)
    .orderBy(sql`${applications.createdAt} desc`)
    .limit(10);

  return NextResponse.json({
    summary: {
      students: students.count,
      teachers: teachers.count,
      deans: deans.count,
      courses: totalCourses.count,
      enrollments: totalEnrollments.count,
      pendingApplications: pendingApps.count,
      approvedApplications: approvedApps.count,
      rejectedApplications: rejectedApps.count,
    },
    gradeStats,
    deptStats,
    topStudents,
    weakStudents,
    teachersReport,
    recentApplications,
    generatedAt: new Date().toISOString(),
  });
}
