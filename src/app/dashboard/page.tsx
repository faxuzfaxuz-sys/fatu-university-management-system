"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  pendingApplications: number;
  totalEnrollments: number;
  gradeDistribution: { grade: string | null; count: number }[];
  deptDistribution: { department: string | null; count: number }[];
  recentAnnouncements: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }[];
}

interface User {
  role: string;
  fullName: string;
  department?: string;
}

const deptLabels: Record<string, string> = {
  data_analytics: "📊 Data Analytics",
  software_engineering: "💻 Software Engineering",
  economics: "📈 Iqtisodiyot",
  finance: "💰 Moliya",
  financial_technology: "🏦 Moliyaviy Texnologiyalar",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then(r => r.json()),
      fetch("/api/auth/me").then(r => r.json()),
    ]).then(([statsData, userData]) => {
      setStats(statsData);
      setUser(userData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <div className="text-gray-500">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Jami Talabalar", value: stats?.totalStudents || 0, icon: "👨‍🎓", color: "bg-blue-500", link: "/dashboard/students" },
    { label: "O'qituvchilar", value: stats?.totalTeachers || 0, icon: "👨‍🏫", color: "bg-green-500", link: "/dashboard/teachers" },
    { label: "Kurslar", value: stats?.totalCourses || 0, icon: "📚", color: "bg-purple-500", link: "/dashboard/schedule" },
    { label: "Kutilgan Arizalar", value: stats?.pendingApplications || 0, icon: "📝", color: "bg-orange-500", link: "/dashboard/applications" },
  ];

  const gradeColors: Record<string, string> = {
    A: "bg-green-500",
    B: "bg-blue-500",
    C: "bg-yellow-500",
    D: "bg-orange-500",
    F: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-bg rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {user?.role === "rector" ? "👑 Rektor Paneli" :
               user?.role === "dean" ? "🎓 Dekan Paneli" :
               user?.role === "teacher" ? "👨‍🏫 O'qituvchi Paneli" :
               "👨‍💻 Talaba Paneli"}
            </h1>
            <p className="text-blue-100 text-sm">
              FATU - Faxriddin Axborot Texnologiyalari Universiteti
              {user?.department && ` | ${deptLabels[user.department] || user.department}`}
            </p>
          </div>
          <div className="text-6xl opacity-20">🏛️</div>
        </div>
      </div>

      {/* Stats Cards */}
      {(user?.role === "rector" || user?.role === "dean") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <Link key={i} href={card.link}>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 card-hover cursor-pointer">
                <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
                  {card.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        {(user?.role === "rector" || user?.role === "dean") && stats?.gradeDistribution && stats.gradeDistribution.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span> Baho Taqsimoti
            </h2>
            <div className="space-y-3">
              {["A", "B", "C", "D", "F"].map((grade) => {
                const item = stats.gradeDistribution.find(g => g.grade === grade);
                const val = item ? Number(item.count) : 0;
                const total = stats.gradeDistribution.reduce((s, g) => s + Number(g.count), 0);
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return (
                  <div key={grade} className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${gradeColors[grade]} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{grade}</div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${gradeColors[grade]} transition-all rounded-full`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 w-12 text-right">{val} ta</div>
                    <div className="text-xs text-gray-400 w-10 text-right">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Department Distribution */}
        {(user?.role === "rector" || user?.role === "dean") && stats?.deptDistribution && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏫</span> Yo'nalishlar bo'yicha Talabalar
            </h2>
            <div className="space-y-3">
              {stats.deptDistribution.map((dept, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {deptLabels[dept.department || ""] || dept.department || "Noma'lum"}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {dept.count} ta
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links for Students */}
        {user?.role === "student" && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">⚡ Tezkor Havolalar</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/dashboard/schedule", icon: "📅", label: "Dars Jadvali", color: "bg-blue-50 hover:bg-blue-100" },
                { href: "/dashboard/my-grades", icon: "📊", label: "Mening Baholarim", color: "bg-green-50 hover:bg-green-100" },
                { href: "/dashboard/ai-chat", icon: "🤖", label: "AI Yordamchi", color: "bg-purple-50 hover:bg-purple-100" },
                { href: "/dashboard/announcements", icon: "📢", label: "E'lonlar", color: "bg-orange-50 hover:bg-orange-100" },
              ].map((link, i) => (
                <Link key={i} href={link.href} className={`${link.color} rounded-xl p-4 text-center transition-colors cursor-pointer`}>
                  <div className="text-3xl mb-2">{link.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{link.label}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links for Teachers */}
        {user?.role === "teacher" && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">⚡ Tezkor Havolalar</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/dashboard/schedule", icon: "📅", label: "Dars Jadvali", color: "bg-blue-50 hover:bg-blue-100" },
                { href: "/dashboard/my-students", icon: "👨‍🎓", label: "Talabalarim", color: "bg-green-50 hover:bg-green-100" },
                { href: "/dashboard/ai-chat", icon: "🤖", label: "AI Yordamchi", color: "bg-purple-50 hover:bg-purple-100" },
                { href: "/dashboard/announcements", icon: "📢", label: "E'lonlar", color: "bg-orange-50 hover:bg-orange-100" },
              ].map((link, i) => (
                <Link key={i} href={link.href} className={`${link.color} rounded-xl p-4 text-center transition-colors cursor-pointer`}>
                  <div className="text-3xl mb-2">{link.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{link.label}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Announcements */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📢</span> So'nggi E'lonlar
          </h2>
          <div className="space-y-3">
            {stats?.recentAnnouncements?.length ? stats.recentAnnouncements.slice(0, 3).map((ann, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-3 py-1">
                <div className="font-medium text-sm text-gray-900">{ann.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ann.content}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(ann.createdAt).toLocaleDateString("uz-UZ")}
                </div>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">E'lonlar yo'q</p>
            )}
            <Link href="/dashboard/announcements" className="block text-blue-600 text-sm font-medium hover:underline mt-2">
              Barcha e'lonlarni ko'rish →
            </Link>
          </div>
        </div>
      </div>

      {/* University Info Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-6 text-white">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">🏛️ FATU Rahbariyati</h3>
            <p className="text-gray-300 text-sm mt-1">Rektor: <span className="text-yellow-300 font-semibold">Bayandikov Faxriddin</span></p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span>📞 +998 71 123 45 67</span>
            <span>✉️ rector@fatu.uz</span>
            <span>📍 Toshkent, O'zbekiston</span>
          </div>
        </div>
      </div>
    </div>
  );
}
