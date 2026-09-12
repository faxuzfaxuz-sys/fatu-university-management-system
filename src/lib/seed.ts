import { db } from "@/db";
import { users, courses, schedules, enrollments, announcements, applications } from "@/db/schema";
import { hashPassword } from "./auth";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  // Check if already seeded
  const existing = await db.select().from(users).limit(1);
  if (existing.length > 0) return;

  // Create Rector (Bayandikov Faxriddin)
  const rectorPass = await hashPassword("rector2024");
  const [rector] = await db.insert(users).values({
    fullName: "Bayandikov Faxriddin",
    email: "rector@fatu.uz",
    password: rectorPass,
    role: "rector",
    phone: "+998901234567",
  }).returning();

  // Create Deans
  const deanPass = await hashPassword("dean2024");
  const [dean1] = await db.insert(users).values({
    fullName: "Karimov Jasur Mahmudovich",
    email: "dean.da@fatu.uz",
    password: deanPass,
    role: "dean",
    department: "data_analytics",
    phone: "+998901234568",
  }).returning();

  const [dean2] = await db.insert(users).values({
    fullName: "Toshmatov Bobur Aliyevich",
    email: "dean.se@fatu.uz",
    password: deanPass,
    role: "dean",
    department: "software_engineering",
    phone: "+998901234569",
  }).returning();

  const [dean3] = await db.insert(users).values({
    fullName: "Nazarova Dilnoza Xasanovna",
    email: "dean.eco@fatu.uz",
    password: deanPass,
    role: "dean",
    department: "economics",
    phone: "+998901234570",
  }).returning();

  // Create Teachers (AI va haqiqiy)
  const teacherPass = await hashPassword("teacher2024");

  const teachers = await db.insert(users).values([
    {
      fullName: "Abdullayev Mirzo Temurovich",
      email: "mirzo@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "data_analytics" as const,
      teacherId: "T-001",
      phone: "+998901111001",
    },
    {
      fullName: "Yusupova Nafisa Baxtiyorovna",
      email: "nafisa@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "data_analytics" as const,
      teacherId: "T-002",
      phone: "+998901111002",
    },
    {
      fullName: "Rahimov Sherzod Qodirov",
      email: "sherzod@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "software_engineering" as const,
      teacherId: "T-003",
      phone: "+998901111003",
    },
    {
      fullName: "Mirzayeva Gulnora Saidovna",
      email: "gulnora@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "software_engineering" as const,
      teacherId: "T-004",
      phone: "+998901111004",
    },
    {
      fullName: "Xasanov Eldor Normatovich",
      email: "eldor@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "economics" as const,
      teacherId: "T-005",
      phone: "+998901111005",
    },
    {
      fullName: "Sultonova Malika Ismoilova",
      email: "malika@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "finance" as const,
      teacherId: "T-006",
      phone: "+998901111006",
    },
    {
      fullName: "Botirov Ulugbek Hamidov",
      email: "ulugbek@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "financial_technology" as const,
      teacherId: "T-007",
      phone: "+998901111007",
    },
    {
      fullName: "Qodirov Jamshid Aliyev",
      email: "jamshid@fatu.uz",
      password: teacherPass,
      role: "teacher" as const,
      department: "data_analytics" as const,
      teacherId: "T-008",
      phone: "+998901111008",
    },
  ]).returning();

  // Create Students (yaxshi va yomon)
  const studentPass = await hashPassword("student2024");

  const students = await db.insert(users).values([
    // Data Analytics - Yaxshi
    { fullName: "Aliyev Sardor Behruzovich", email: "sardor@student.fatu.uz", password: studentPass, role: "student" as const, department: "data_analytics" as const, studentId: "DA-2024-001" },
    { fullName: "Tursunova Zulfiya Mamatova", email: "zulfiya@student.fatu.uz", password: studentPass, role: "student" as const, department: "data_analytics" as const, studentId: "DA-2024-002" },
    { fullName: "Ergashev Kamol Toxirovich", email: "kamol@student.fatu.uz", password: studentPass, role: "student" as const, department: "data_analytics" as const, studentId: "DA-2024-003" },
    // Data Analytics - Yomon
    { fullName: "Holiqov Mansur Bekmurodov", email: "mansur@student.fatu.uz", password: studentPass, role: "student" as const, department: "data_analytics" as const, studentId: "DA-2024-004" },

    // Software Engineering - Yaxshi
    { fullName: "Normatov Asilbek Temurovich", email: "asilbek@student.fatu.uz", password: studentPass, role: "student" as const, department: "software_engineering" as const, studentId: "SE-2024-001" },
    { fullName: "Rashidova Mohira Karimova", email: "mohira@student.fatu.uz", password: studentPass, role: "student" as const, department: "software_engineering" as const, studentId: "SE-2024-002" },
    // Software Engineering - Yomon
    { fullName: "Boymurodov Shamsiddin Aliev", email: "shamsiddin@student.fatu.uz", password: studentPass, role: "student" as const, department: "software_engineering" as const, studentId: "SE-2024-003" },

    // Economics
    { fullName: "Nazarova Barno Yusupova", email: "barno@student.fatu.uz", password: studentPass, role: "student" as const, department: "economics" as const, studentId: "EC-2024-001" },
    { fullName: "Xoliqov Jasurbek Sodiqov", email: "jasurbek@student.fatu.uz", password: studentPass, role: "student" as const, department: "economics" as const, studentId: "EC-2024-002" },

    // Finance
    { fullName: "Toshpulatova Dilorom Hamidova", email: "dilorom@student.fatu.uz", password: studentPass, role: "student" as const, department: "finance" as const, studentId: "FN-2024-001" },
    { fullName: "Salimov Otabek Mirzayev", email: "otabek@student.fatu.uz", password: studentPass, role: "student" as const, department: "finance" as const, studentId: "FN-2024-002" },

    // Financial Technology
    { fullName: "Yoqubov Ibrohim Raxmatullayev", email: "ibrohim@student.fatu.uz", password: studentPass, role: "student" as const, department: "financial_technology" as const, studentId: "FT-2024-001" },
    { fullName: "Jurayeva Sabohat Qodirov", email: "sabohat@student.fatu.uz", password: studentPass, role: "student" as const, department: "financial_technology" as const, studentId: "FT-2024-002" },
  ]).returning();

  // Create Courses
  const coursesData = await db.insert(courses).values([
    // Data Analytics
    { name: "Python for Data Science", code: "DA101", department: "data_analytics", teacherId: teachers[0].id, credits: 3, description: "Python dasturlash tilini ma'lumotlar tahlili uchun o'rganish", semester: 1 },
    { name: "Machine Learning Asoslari", code: "DA102", department: "data_analytics", teacherId: teachers[1].id, credits: 4, description: "Machine learning algoritmlarini o'rganish", semester: 2 },
    { name: "Big Data Texnologiyalari", code: "DA103", department: "data_analytics", teacherId: teachers[7].id, credits: 3, description: "Hadoop, Spark va boshqa Big Data texnologiyalari", semester: 3 },

    // Software Engineering
    { name: "Web Dasturlash (React/Next.js)", code: "SE101", department: "software_engineering", teacherId: teachers[2].id, credits: 4, description: "Zamonaviy web dasturlash texnologiyalari", semester: 1 },
    { name: "Mobil Ilova Ishlab Chiqish", code: "SE102", department: "software_engineering", teacherId: teachers[3].id, credits: 3, description: "iOS va Android ilovalar yaratish", semester: 2 },
    { name: "Ma'lumotlar Bazasi", code: "SE103", department: "software_engineering", teacherId: teachers[2].id, credits: 3, description: "SQL va NoSQL ma'lumotlar bazalari", semester: 1 },

    // Economics
    { name: "Makroiqtisodiyot", code: "EC101", department: "economics", teacherId: teachers[4].id, credits: 3, description: "Milliy iqtisodiyot nazariyasi", semester: 1 },
    { name: "Mikroiqtisodiyot", code: "EC102", department: "economics", teacherId: teachers[4].id, credits: 3, description: "Firma va iste'molchi xatti-harakati", semester: 2 },

    // Finance
    { name: "Moliya Asoslari", code: "FN101", department: "finance", teacherId: teachers[5].id, credits: 3, description: "Moliyaviy boshqaruv asoslari", semester: 1 },
    { name: "Investitsiya Tahlili", code: "FN102", department: "finance", teacherId: teachers[5].id, credits: 4, description: "Investitsiya loyihalarini baholash", semester: 2 },

    // Financial Technology
    { name: "Blockchain va Kriptovalyuta", code: "FT101", department: "financial_technology", teacherId: teachers[6].id, credits: 3, description: "Blockchain texnologiyasi va kriptovalyuta asoslari", semester: 1 },
    { name: "FinTech Innovatsiyalari", code: "FT102", department: "financial_technology", teacherId: teachers[6].id, credits: 3, description: "Zamonaviy moliyaviy texnologiyalar", semester: 2 },
  ]).returning();

  // Create Schedules
  await db.insert(schedules).values([
    { courseId: coursesData[0].id, teacherId: teachers[0].id, dayOfWeek: "Dushanba", startTime: "09:00", endTime: "10:30", room: "A-101", department: "data_analytics" },
    { courseId: coursesData[1].id, teacherId: teachers[1].id, dayOfWeek: "Seshanba", startTime: "11:00", endTime: "12:30", room: "A-102", department: "data_analytics" },
    { courseId: coursesData[2].id, teacherId: teachers[7].id, dayOfWeek: "Chorshanba", startTime: "14:00", endTime: "15:30", room: "A-103", department: "data_analytics" },
    { courseId: coursesData[3].id, teacherId: teachers[2].id, dayOfWeek: "Dushanba", startTime: "11:00", endTime: "12:30", room: "B-201", department: "software_engineering" },
    { courseId: coursesData[4].id, teacherId: teachers[3].id, dayOfWeek: "Payshanba", startTime: "09:00", endTime: "10:30", room: "B-202", department: "software_engineering" },
    { courseId: coursesData[5].id, teacherId: teachers[2].id, dayOfWeek: "Juma", startTime: "11:00", endTime: "12:30", room: "B-203", department: "software_engineering" },
    { courseId: coursesData[6].id, teacherId: teachers[4].id, dayOfWeek: "Seshanba", startTime: "09:00", endTime: "10:30", room: "C-301", department: "economics" },
    { courseId: coursesData[7].id, teacherId: teachers[4].id, dayOfWeek: "Chorshanba", startTime: "11:00", endTime: "12:30", room: "C-302", department: "economics" },
    { courseId: coursesData[8].id, teacherId: teachers[5].id, dayOfWeek: "Dushanba", startTime: "14:00", endTime: "15:30", room: "D-401", department: "finance" },
    { courseId: coursesData[9].id, teacherId: teachers[5].id, dayOfWeek: "Seshanba", startTime: "14:00", endTime: "15:30", room: "D-402", department: "finance" },
    { courseId: coursesData[10].id, teacherId: teachers[6].id, dayOfWeek: "Chorshanba", startTime: "09:00", endTime: "10:30", room: "E-501", department: "financial_technology" },
    { courseId: coursesData[11].id, teacherId: teachers[6].id, dayOfWeek: "Payshanba", startTime: "11:00", endTime: "12:30", room: "E-502", department: "financial_technology" },
  ]);

  // Create Enrollments with grades
  const enrollData = [];
  // Student 0 (Sardor - yaxshi, DA)
  enrollData.push({ studentId: students[0].id, courseId: coursesData[0].id, grade: "A" as const, score: "95.5", attendance: 98 });
  enrollData.push({ studentId: students[0].id, courseId: coursesData[1].id, grade: "A" as const, score: "92.0", attendance: 95 });
  // Student 1 (Zulfiya - yaxshi, DA)
  enrollData.push({ studentId: students[1].id, courseId: coursesData[0].id, grade: "A" as const, score: "98.0", attendance: 100 });
  enrollData.push({ studentId: students[1].id, courseId: coursesData[1].id, grade: "B" as const, score: "85.0", attendance: 90 });
  // Student 2 (Kamol - yaxshi, DA)
  enrollData.push({ studentId: students[2].id, courseId: coursesData[0].id, grade: "B" as const, score: "82.0", attendance: 88 });
  // Student 3 (Mansur - yomon, DA)
  enrollData.push({ studentId: students[3].id, courseId: coursesData[0].id, grade: "D" as const, score: "45.0", attendance: 50 });
  enrollData.push({ studentId: students[3].id, courseId: coursesData[1].id, grade: "F" as const, score: "30.0", attendance: 35 });
  // Student 4 (Asilbek - yaxshi, SE)
  enrollData.push({ studentId: students[4].id, courseId: coursesData[3].id, grade: "A" as const, score: "97.0", attendance: 99 });
  enrollData.push({ studentId: students[4].id, courseId: coursesData[4].id, grade: "A" as const, score: "94.0", attendance: 96 });
  // Student 5 (Mohira - yaxshi, SE)
  enrollData.push({ studentId: students[5].id, courseId: coursesData[3].id, grade: "B" as const, score: "88.0", attendance: 92 });
  // Student 6 (Shamsiddin - yomon, SE)
  enrollData.push({ studentId: students[6].id, courseId: coursesData[3].id, grade: "C" as const, score: "58.0", attendance: 55 });
  enrollData.push({ studentId: students[6].id, courseId: coursesData[4].id, grade: "F" as const, score: "28.0", attendance: 30 });
  // Other students
  enrollData.push({ studentId: students[7].id, courseId: coursesData[6].id, grade: "A" as const, score: "91.0", attendance: 93 });
  enrollData.push({ studentId: students[8].id, courseId: coursesData[6].id, grade: "C" as const, score: "65.0", attendance: 70 });
  enrollData.push({ studentId: students[9].id, courseId: coursesData[8].id, grade: "B" as const, score: "84.0", attendance: 89 });
  enrollData.push({ studentId: students[10].id, courseId: coursesData[8].id, grade: "A" as const, score: "93.0", attendance: 97 });
  enrollData.push({ studentId: students[11].id, courseId: coursesData[10].id, grade: "B" as const, score: "87.0", attendance: 91 });
  enrollData.push({ studentId: students[12].id, courseId: coursesData[10].id, grade: "A" as const, score: "96.0", attendance: 98 });

  await db.insert(enrollments).values(enrollData);

  // Create Announcements
  await db.insert(announcements).values([
    {
      title: "2024-2025 o'quv yili ochilishi",
      content: "Hurmatli talabalar va o'qituvchilar! 2024-2025 o'quv yili rasman boshlanmoqda. Barcha talabalar belgilangan vaqtda darsga kelishlari shart. Rektor Bayandikov Faxriddin.",
      authorId: rector.id,
      isPublic: true,
    },
    {
      title: "Data Analytics yo'nalishi bo'yicha olimpiada",
      content: "Data Analytics yo'nalishi talabalari uchun olimpiada 15-noyabr kuni bo'lib o'tadi. Qatnashish ixtiyoriy. G'oliblar mukofotlanadi.",
      authorId: dean1.id,
      department: "data_analytics",
      isPublic: true,
    },
    {
      title: "Yangi laboratoriya qurilmalari",
      content: "Software Engineering yo'nalishi laboratoriyasiga yangi kompyuterlar va dasturlash uskunalari keltirildi. Talabalar foydalanishlari mumkin.",
      authorId: dean2.id,
      department: "software_engineering",
      isPublic: true,
    },
    {
      title: "Moliya yo'nalishi bo'yicha seminar",
      content: "Xalqaro moliya mutaxassislari bilan uchrashuw 20-noyabr kuni soat 14:00 da bo'lib o'tadi. Barcha talabalar taklif etiladi.",
      authorId: dean3.id,
      isPublic: true,
    },
  ]);

  // Create sample applications
  await db.insert(applications).values([
    {
      applicantName: "Abdullayev Furqat Behruzovich",
      email: "furqat.applicant@gmail.com",
      phone: "+998901234999",
      department: "data_analytics",
      message: "Men data analytics yo'nalishida o'qishni istardim. Matematika va statistika bo'yicha chuqur bilimlarim bor.",
      status: "pending",
    },
    {
      applicantName: "Xolmatova Nilufar Sanjarovna",
      email: "nilufar.xolmatova@gmail.com",
      phone: "+998901234888",
      department: "software_engineering",
      message: "Dasturlash bilan shug'ullanaman. React va Python bilaman. Universitetingizda o'qishni orzu qilaman.",
      status: "pending",
    },
    {
      applicantName: "Sobirov Akbar Nematullayevich",
      email: "akbar.sobirov@gmail.com",
      phone: "+998901234777",
      department: "finance",
      message: "Moliya sohasida mutaxassis bo'lishni xohlayman. Iltimos arizam ko'rib chiqilsin.",
      status: "approved",
      reviewedBy: rector.id,
      reviewNote: "Arizachi juda yaxshi tavsiya xati taqdim etdi. Qabul qilindi.",
    },
    {
      applicantName: "Toshqo'ziyeva Dilrabo Alimova",
      email: "dilrabo@gmail.com",
      phone: "+998901234666",
      department: "financial_technology",
      message: "FinTech sohasiga qiziqaman. Blockchain va kriptovalyuta haqida ko'p o'qiganman.",
      status: "pending",
    },
  ]);

  console.log("Database seeded successfully!");
}
