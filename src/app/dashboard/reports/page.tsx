"use client";
import { useEffect, useState } from "react";

interface ReportData {
  summary: {
    students: number;
    teachers: number;
    deans: number;
    courses: number;
    enrollments: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
  };
  gradeStats: { grade: string | null; count: number }[];
  deptStats: { department: string | null; count: number }[];
  topStudents: { name: string; department: string | null; studentId: string | null; avgScore: number; avgAttendance: number }[];
  weakStudents: { name: string; department: string | null; studentId: string | null; avgScore: number; avgAttendance: number }[];
  teachersReport: { name: string; department: string | null; teacherId: string | null; totalCourses: number }[];
  recentApplications: { id: number; applicantName: string; email: string; department: string; status: string; createdAt: string }[];
  generatedAt: string;
}

const deptLabels: Record<string, string> = {
  data_analytics: "📊 Data Analytics",
  software_engineering: "💻 Software Engineering",
  economics: "📈 Iqtisodiyot",
  finance: "💰 Moliya",
  financial_technology: "🏦 Moliyaviy Texnologiyalar",
};

const gradeColors: Record<string, string> = {
  A: "bg-green-500",
  B: "bg-blue-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reports")
      .then(r => {
        if (!r.ok) throw new Error("Ruxsat yo'q");
        return r.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center"><div className="text-4xl mb-3">⏳</div><div className="text-gray-500">Hisobot tayyorlanmoqda...</div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <div className="text-5xl mb-3">🔒</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Hisobotlar</h1>
          <p className="text-gray-500 text-sm mt-1">
            Rektor uchun to'liq hisobot | Yangilangan: {new Date(data.generatedAt).toLocaleString("uz-UZ")}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="gradient-bg text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          🖨️ Chop Etish
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Talabalar", value: data.summary.students, icon: "👨‍🎓", color: "bg-blue-500" },
          { label: "O'qituvchilar", value: data.summary.teachers, icon: "👨‍🏫", color: "bg-green-500" },
          { label: "Dekanlar", value: data.summary.deans, icon: "🎓", color: "bg-purple-500" },
          { label: "Kurslar", value: data.summary.courses, icon: "📚", color: "bg-indigo-500" },
          { label: "Ro'yxatga olingan", value: data.summary.enrollments, icon: "📝", color: "bg-teal-500" },
          { label: "Kutilgan Arizalar", value: data.summary.pendingApplications, icon: "⏳", color: "bg-orange-500" },
          { label: "Qabul Qilingan", value: data.summary.approvedApplications, icon: "✅", color: "bg-green-600" },
          { label: "Rad Etilgan", value: data.summary.rejectedApplications, icon: "❌", color: "bg-red-500" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">📊 Baho Taqsimoti</h2>
          <div className="space-y-3">
            {["A", "B", "C", "D", "F"].map(grade => {
              const item = data.gradeStats.find(g => g.grade === grade);
              const val = item ? Number(item.count) : 0;
              const total = data.gradeStats.reduce((s, g) => s + Number(g.count), 0);
              const pct = total > 0 ? Math.round((val / total) * 100) : 0;
              return (
                <div key={grade} className="flex items-center gap-3">
                  <span className={`${gradeColors[grade]} text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>{grade}</span>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${gradeColors[grade]} rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium w-8">{val}</span>
                  <span className="text-xs text-gray-400 w-10">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dept Distribution */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">🏫 Yo'nalishlar bo'yicha</h2>
          <div className="space-y-2">
            {data.deptStats.map((dept, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-700">{deptLabels[dept.department || ""] || dept.department || "Noma'lum"}</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{dept.count} ta</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">⭐ Eng Yaxshi Talabalar (Top 5)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">#</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Talaba</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Yo'nalish</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">O'rtacha Ball</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Davomat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.topStudents.filter(s => s.avgScore).map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-bold text-green-600">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}</td>
                  <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{deptLabels[s.department || ""] || "-"}</td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600">{Math.round(Number(s.avgScore) * 10) / 10}</td>
                  <td className="px-4 py-3 text-sm text-green-600">{Math.round(Number(s.avgAttendance))}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weak Students */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">⚠️ Diqqatga Muhtoj Talabalar</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Talaba</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Yo'nalish</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">O'rtacha Ball</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Davomat</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Tavsiya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.weakStudents.filter(s => s.avgScore !== null).map((s, i) => (
                <tr key={i} className="hover:bg-red-50">
                  <td className="px-4 py-3 text-sm font-medium text-red-700">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{deptLabels[s.department || ""] || "-"}</td>
                  <td className="px-4 py-3 text-sm font-bold text-red-600">{Math.round(Number(s.avgScore) * 10) / 10}</td>
                  <td className="px-4 py-3 text-sm text-red-600">{Math.round(Number(s.avgAttendance))}%</td>
                  <td className="px-4 py-3 text-xs text-gray-500">Individual suhbat va qo'shimcha darslar</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teachers Report */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">👨‍🏫 O'qituvchilar Hisoboti</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">O'qituvchi</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Yo'nalish</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2">Kurslar soni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.teachersReport.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{deptLabels[t.department || ""] || "-"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{t.teacherId || "-"}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{t.totalCourses} ta</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">📝 So'nggi Arizalar</h2>
        <div className="space-y-2">
          {data.recentApplications.map(app => (
            <div key={app.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div>
                <div className="font-medium text-sm">{app.applicantName}</div>
                <div className="text-xs text-gray-500">{deptLabels[app.department] || app.department}</div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[app.status] || "bg-gray-100"}`}>
                  {app.status === "pending" ? "⏳ Kutilmoqda" : app.status === "approved" ? "✅ Qabul" : "❌ Rad"}
                </span>
                <div className="text-xs text-gray-400 mt-1">{new Date(app.createdAt).toLocaleDateString("uz-UZ")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
