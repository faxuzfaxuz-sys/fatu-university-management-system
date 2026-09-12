import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  decimal,
  date,
} from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", [
  "rector",
  "dean",
  "teacher",
  "student",
]);

export const departmentEnum = pgEnum("department", [
  "data_analytics",
  "software_engineering",
  "economics",
  "finance",
  "financial_technology",
]);

export const gradeEnum = pgEnum("grade", ["A", "B", "C", "D", "F"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
]);

export const messageTypeEnum = pgEnum("message_type", [
  "student",
  "teacher",
  "ai_bot",
]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  password: varchar("password", { length: 500 }).notNull(),
  role: roleEnum("role").notNull().default("student"),
  department: departmentEnum("department"),
  studentId: varchar("student_id", { length: 50 }),
  teacherId: varchar("teacher_id", { length: 50 }),
  phone: varchar("phone", { length: 50 }),
  avatar: varchar("avatar", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses/Subjects
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 300 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  department: departmentEnum("department").notNull(),
  teacherId: integer("teacher_id").references(() => users.id),
  credits: integer("credits").default(3),
  description: text("description"),
  semester: integer("semester").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schedule / Dars vaqti
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  teacherId: integer("teacher_id").references(() => users.id),
  dayOfWeek: varchar("day_of_week", { length: 20 }).notNull(), // Monday, Tuesday, etc.
  startTime: varchar("start_time", { length: 10 }).notNull(), // 09:00
  endTime: varchar("end_time", { length: 10 }).notNull(), // 10:30
  room: varchar("room", { length: 100 }),
  department: departmentEnum("department"),
});

// Student enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  grade: gradeEnum("grade"),
  score: decimal("score", { precision: 5, scale: 2 }),
  attendance: integer("attendance").default(0), // percentage
});

// Attendance
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  date: date("date").notNull(),
  present: boolean("present").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Applications (Arizalar)
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicantName: varchar("applicant_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  department: departmentEnum("department").notNull(),
  message: text("message"),
  status: applicationStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNote: text("review_note"),
});

// Announcements (E'lonlar)
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  department: departmentEnum("department"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignments (Topshiriqlar)
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  maxScore: integer("max_score").default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignment submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").references(() => assignments.id),
  studentId: integer("student_id").references(() => users.id),
  content: text("content"),
  score: decimal("score", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// Chat messages (AI Bot)
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  content: text("content"),
  generatedBy: integer("generated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});
