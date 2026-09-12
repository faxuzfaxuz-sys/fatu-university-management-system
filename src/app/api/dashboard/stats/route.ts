import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { users, courses, enrollments, applications, announcements } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (currentUser.role !== "rector" && currentUser.role !== "dean") {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  const [totalStudents] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.role, "student"));

  const [totalTeachers] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.role, "teacher"));

  const [totalCourses] = await db
    .select({ count: count() })
    .from(courses);

  const [totalApplications] = await db
    .select({ count: count() })
    .from(applications)
    .where(eq(applications.status, "pending"));

  const [totalEnrollments] = await db
    .select({ count: count() })
    .from(enrollments);

  // Grade distribution
  const gradeDistribution = await db
    .select({
      grade: enrollments.grade,
      count: count(),
    })
    .from(enrollments)
    .groupBy(enrollments.grade);

  // Department distribution
  const deptDistribution = await db
    .select({
      department: users.department,
      count: count(),
    })
    .from(users)
    .where(eq(users.role, "student"))
    .groupBy(users.department);

  // Recent announcements
  const recentAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(sql`${announcements.createdAt} desc`)
    .limit(5);

  return NextResponse.json({
    totalStudents: totalStudents.count,
    totalTeachers: totalTeachers.count,
    totalCourses: totalCourses.count,
    pendingApplications: totalApplications.count,
    totalEnrollments: totalEnrollments.count,
    gradeDistribution,
    deptDistribution,
    recentAnnouncements,
  });
}
