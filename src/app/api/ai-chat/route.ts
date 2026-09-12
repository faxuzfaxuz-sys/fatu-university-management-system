import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";
import { db } from "@/db";
import { chatMessages, users, courses, enrollments, schedules } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Simple AI responses based on keywords
function generateAIResponse(message: string, userRole: string, userName: string): string {
  const msg = message.toLowerCase();

  // Greeting
  if (msg.includes("salom") || msg.includes("assalomu") || msg.includes("xayr")) {
    return `Salom, ${userName}! Men FATU AI Yordamchisiman. Sizga qanday yordam bera olaman? 🎓`;
  }

  // Schedule questions
  if (msg.includes("dars vaqti") || msg.includes("jadval") || msg.includes("schedule")) {
    return `📅 Dars jadvali haqida: Dars jadvalini ko'rish uchun "Jadval" bo'limiga o'ting. U yerda barcha yo'nalishlar bo'yicha darslar vaqtini ko'rishingiz mumkin. Darslar Dushanba-Juma kunlari 09:00 dan 17:00 gacha bo'ladi.`;
  }

  // Grade questions
  if (msg.includes("baho") || msg.includes("daraja") || msg.includes("grade") || msg.includes("ball")) {
    if (userRole === "student") {
      return `📊 Baholaringiz haqida: Baholaringizni "Mening Baholarim" bo'limida ko'rishingiz mumkin. A (90-100), B (75-89), C (60-74), D (50-59), F (50 dan past) tizimi qo'llaniladi. Yaxshi baholar olish uchun darsga muntazam qatnashing va topshiriqlarni o'z vaqtida bajaring! 💪`;
    }
    return `📊 Baho tizimi: A (90-100), B (75-89), C (60-74), D (50-59), F (50 dan past). Talabalar baholarini "Talabalar" bo'limida ko'rishingiz mumkin.`;
  }

  // Course/subject questions
  if (msg.includes("kurs") || msg.includes("fan") || msg.includes("subject") || msg.includes("course")) {
    return `📚 Kurslar haqida: FATU da 5 ta yo'nalish mavjud:\n1. Data Analytics - Python, ML, Big Data\n2. Software Engineering - Web, Mobil, DB\n3. Iqtisodiyot - Makro, Mikroiqtisodiyot\n4. Moliya - Moliya asoslari, Investitsiya\n5. Moliyaviy Texnologiyalar - Blockchain, FinTech\nBatafsil "Kurslar" bo'limida ko'rishingiz mumkin.`;
  }

  // Attendance questions
  if (msg.includes("davomat") || msg.includes("attendance") || msg.includes("kelish")) {
    return `✅ Davomat haqida: Davomat 80% dan past bo'lmasligi kerak. Aks holda imtihonga kirish huquqidan mahrum bo'lishingiz mumkin. Davomatingizni "Mening Baholarim" bo'limida kuzatishingiz mumkin.`;
  }

  // Application questions
  if (msg.includes("ariza") || msg.includes("qabul") || msg.includes("o'qish")) {
    return `📝 Ariza berish: FATU ga kirish uchun bosh sahifadagi "Ariza Berish" bo'limini to'ldiring. Kerakli hujjatlar: pasport, attestat, 3x4 rasm. Qabul bo'yicha savollar: rector@fatu.uz`;
  }

  // University info
  if (msg.includes("universitet") || msg.includes("fatu") || msg.includes("ma'lumot")) {
    return `🏛️ FATU haqida: Faxriddin Axborot Texnologiyalari Universiteti - Zamonaviy texnologiyalar va innovatsiyalar markazidir. Rektor: Bayandikov Faxriddin. Manzil: Toshkent, O'zbekiston. Tel: +998 71 123 45 67. Email: info@fatu.uz`;
  }

  // Teacher questions
  if (msg.includes("ustoz") || msg.includes("o'qituvchi") || msg.includes("professor")) {
    return `👨‍🏫 O'qituvchilar haqida: FATU da tajribali va malakali o'qituvchilar jamoasi mavjud. O'qituvchilar bilan muloqot qilish uchun "O'qituvchilar" bo'limini ko'ring yoki email orqali bog'laning.`;
  }

  // Poor student advice
  if (msg.includes("yaxshi o'qish") || msg.includes("muvaffaqiyat") || msg.includes("o'qish") || msg.includes("tavsiya")) {
    return `💡 Muvaffaqiyatli o'qish uchun maslahatlar:\n1. 📅 Darsga doim o'z vaqtida keling\n2. 📚 Har kuni kamida 2-3 soat mustaqil o'qing\n3. ✏️ Topshiriqlarni o'z vaqtida bajaring\n4. 🤝 Guruh a'zolari bilan hamkorlik qiling\n5. ❓ Savol bo'lsa o'qituvchiga murojaat qiling\n6. 💻 Online resurslardan foydalaning\nSiz muvaffaq bo'lasiz! 🌟`;
  }

  // Exam questions
  if (msg.includes("imtihon") || msg.includes("exam") || msg.includes("test")) {
    return `📝 Imtihon haqida: Imtihonlar har semester oxirida o'tkaziladi. Davomat 80% dan kam bo'lsa imtihonga kirish huquqi berilmaydi. Imtihon jadvalini dekanat e'lonlar taxtasida kuzatib boring.`;
  }

  // Default response
  const responses = [
    `🤖 Sizning savolingizni tushundim! Qo'shimcha ma'lumot olish uchun: dars jadvali, baholar, kurslar, ariza berish, davomat haqida so'rashingiz mumkin.`,
    `💬 Qiziq savol! Men FATU AI yordamchisiman. Dars jadvali, baholar, o'qish maslahatlar, universitet haqida ma'lumot bera olaman. Aniqroq savol bering!`,
    `🎓 FATU AI: Men barcha o'quv jarayoniga oid savollarga javob bera olaman. Jadval, baholar, kurslar, davomat, ariza haqida so'rang!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, currentUser.userId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(50);

  return NextResponse.json(messages.reverse());
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Xabar bo'sh bo'lishi mumkin emas" }, { status: 400 });
  }

  const aiResponse = generateAIResponse(message, currentUser.role, currentUser.fullName);

  const [saved] = await db.insert(chatMessages).values({
    userId: currentUser.userId,
    message,
    response: aiResponse,
  }).returning();

  return NextResponse.json({ success: true, chat: saved });
}
