"use client";
import { useEffect, useState } from "react";

interface Course {
  id: number;
  name: string;
  code: string;
  credits: number | null;
  semester: number | null;
}

interface Schedule {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string | null;
}

interface Teacher {
  id: number;
  fullName: string;
  email: string;
  department: string | null;
  teacherId: string | null;
  phone: string | null;
  totalCourses: number;
  courses: Course[];
  schedules: Schedule[];
}

const deptLabels: Record<string, string> = {
  data_analytics: "📊 Data Analytics",
  software_engineering: "💻 Software Engineering",
  economics: "📈 Iqtisodiyot",
  finance: "💰 Moliya",
  financial_technology: "🏦 Moliyaviy Texnologiyalar",
};

const deptBg: Record<string, string> = {
  data_analytics: "from-blue-500 to-blue-700",
  software_engineering: "from-purple-500 to-purple-700",
  economics: "from-green-500 to-green-700",
  finance: "from-yellow-500 to-yellow-600",
  financial_technology: "from-orange-500 to-orange-700",
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [selected, setSelected] = useState<Teacher | null>(null);

  useEffect(() => {
    fetch("/api/teachers")
      .then(r => r.json())
      .then(data => {
        setTeachers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filtered = teachers.filter(t => {
    const matchSearch = t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (t.teacherId || "").toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || t.department === filterDept;
    return matchSearch && matchDept;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center"><div className="text-4xl mb-3">⏳</div><div className="text-gray-500">Yuklanmoqda...</div></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👨‍🏫 O'qituvchilar</h1>
          <p className="text-gray-500 text-sm mt-1">Jami: {teachers.length} ta o'qituvchi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Qidirish (ism, ID)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]"
        />
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Barcha yo'nalishlar</option>
          {Object.entries(deptLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Teachers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover">
            <div className={`bg-gradient-to-r ${deptBg[teacher.department || ""] || "from-gray-500 to-gray-700"} p-5`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {teacher.fullName.charAt(0)}
                </div>
                <div className="text-white">
                  <div className="font-bold leading-tight">{teacher.fullName}</div>
                  <div className="text-white/70 text-xs mt-0.5">ID: {teacher.teacherId || "N/A"}</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-3">{deptLabels[teacher.department || ""] || "-"}</div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <span>✉️</span><span className="truncate">{teacher.email}</span>
              </div>
              {teacher.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <span>📞</span><span>{teacher.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  📚 {teacher.totalCourses} ta kurs
                </span>
                <button
                  onClick={() => setSelected(teacher)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  Batafsil →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">👨‍🏫 O'qituvchi Ma'lumotlari</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className={`bg-gradient-to-r ${deptBg[selected.department || ""] || "from-gray-500 to-gray-700"} rounded-xl p-5 mb-4 text-white`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selected.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg">{selected.fullName}</div>
                  <div className="text-white/80 text-sm">{deptLabels[selected.department || ""] || "-"}</div>
                  <div className="text-white/60 text-xs">ID: {selected.teacherId || "N/A"}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{selected.totalCourses}</div>
                <div className="text-xs text-gray-500">Kurslar soni</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{selected.schedules.length}</div>
                <div className="text-xs text-gray-500">Jadval yozuvlari</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>✉️</span><span>{selected.email}</span>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>📞</span><span>{selected.phone}</span>
                </div>
              )}
            </div>

            {selected.courses.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">📚 O'qitiladigan Fanlar</h3>
                <div className="space-y-2">
                  {selected.courses.map(c => (
                    <div key={c.id} className="bg-blue-50 rounded-lg p-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">Kod: {c.code} | Kredit: {c.credits}</div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{c.semester}-semester</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.schedules.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">📅 Dars Jadvali</h3>
                <div className="space-y-1">
                  {selected.schedules.map(s => (
                    <div key={s.id} className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                      <span className="font-medium w-20">{s.dayOfWeek}</span>
                      <span>{s.startTime} - {s.endTime}</span>
                      {s.room && <span className="bg-gray-200 px-2 py-0.5 rounded">{s.room}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
