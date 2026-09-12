"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  department?: string;
  studentId?: string;
  teacherId?: string;
}

const deptLabels: Record<string, string> = {
  data_analytics: "Data Analytics",
  software_engineering: "Software Engineering",
  economics: "Iqtisodiyot",
  finance: "Moliya",
  financial_technology: "Moliyaviy Texnologiyalar",
};

const roleLabels: Record<string, string> = {
  rector: "Rektor",
  dean: "Dekan",
  teacher: "O'qituvchi",
  student: "Talaba",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setUser(data);
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const getNavItems = () => {
    const base = [
      { href: "/dashboard", label: "🏠 Bosh Sahifa", roles: ["rector", "dean", "teacher", "student"] },
      { href: "/dashboard/schedule", label: "📅 Dars Jadvali", roles: ["rector", "dean", "teacher", "student"] },
      { href: "/dashboard/ai-chat", label: "🤖 AI Yordamchi", roles: ["rector", "dean", "teacher", "student"] },
    ];

    if (!user) return base;

    const roleItems: Record<string, { href: string; label: string; roles: string[] }[]> = {
      rector: [
        { href: "/dashboard/students", label: "👨‍🎓 Talabalar", roles: ["rector"] },
        { href: "/dashboard/teachers", label: "👨‍🏫 O'qituvchilar", roles: ["rector"] },
        { href: "/dashboard/applications", label: "📝 Arizalar", roles: ["rector"] },
        { href: "/dashboard/announcements", label: "📢 E'lonlar", roles: ["rector"] },
        { href: "/dashboard/reports", label: "📊 Hisobotlar", roles: ["rector"] },
      ],
      dean: [
        { href: "/dashboard/students", label: "👨‍🎓 Talabalar", roles: ["dean"] },
        { href: "/dashboard/teachers", label: "👨‍🏫 O'qituvchilar", roles: ["dean"] },
        { href: "/dashboard/applications", label: "📝 Arizalar", roles: ["dean"] },
        { href: "/dashboard/announcements", label: "📢 E'lonlar", roles: ["dean"] },
      ],
      teacher: [
        { href: "/dashboard/my-students", label: "👨‍🎓 Mening Talabalarim", roles: ["teacher"] },
        { href: "/dashboard/announcements", label: "📢 E'lonlar", roles: ["teacher"] },
      ],
      student: [
        { href: "/dashboard/my-grades", label: "📊 Mening Baholarim", roles: ["student"] },
        { href: "/dashboard/announcements", label: "📢 E'lonlar", roles: ["student"] },
      ],
    };

    return [...base, ...(roleItems[user.role] || [])];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-gray-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen ? (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">F</div>
              <div>
                <div className="font-bold text-sm">FATU</div>
                <div className="text-xs text-gray-400">Portal</div>
              </div>
            </Link>
          ) : (
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm mx-auto">F</div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors ml-auto"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* User info */}
        {user && sidebarOpen && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {user.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{user.fullName}</div>
                <div className="text-xs text-gray-400">{roleLabels[user.role] || user.role}</div>
                {user.department && (
                  <div className="text-xs text-blue-400 truncate">{deptLabels[user.department] || user.department}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all sidebar-item ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-base flex-shrink-0">{item.label.split(" ")[0]}</span>
                {sidebarOpen && (
                  <span className="truncate">{item.label.slice(item.label.indexOf(" ") + 1)}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-900/50 hover:text-red-300 transition-all`}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Chiqish</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm text-gray-500">
            {user && (
              <span>
                Xush kelibsiz, <span className="font-semibold text-gray-800">{user.fullName}</span>!
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{roleLabels[user.role]}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
