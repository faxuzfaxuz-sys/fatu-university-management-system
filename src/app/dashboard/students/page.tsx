"use client";
import { useEffect, useState } from "react";

interface Enrollment {
  courseId: number | null;
  grade: string | null;
  score: string | null;
  attendance: number | null;
  courseName: string | null;
  courseCode: string | null;
}

interface Student {
  id: number;
  fullName: string;
  email: string;
  department: string | null;
  studentId: string | null;
  phone: string | null;
  isActive: boolean | null;
  avgScore: number;
  avgAttendance: number;
  performance: string;
  enrollments: Enrollment[];
}

const deptLabels: Record<string, string> = {
  data_analytics: "📊 Data Analytics",
  software_engineering: "💻 Software Engineering",
  economics: "📈 Iqtisodiyot",
  finance: "💰 Moliya",
  financial_technology: "🏦 Moliyaviy Texnologiyalar",
};

const perfColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-700 border-green-200",
  average: "bg-yellow-100 text-yellow-700 border-yellow-200",
  poor: "bg-red-100 text-red-700 border-red-200",
};

const perfLabels: Record<string, string> = {
  excellent: "⭐ A'lo",
  average: "📊 O'rta",
  poor: "⚠️ Zaif",
};

const gradeColors: Record<string, string> = {
  A: "bg-green-500",
  B: "bg-blue-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterPerf, setFilterPerf] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);

  useEffect(() => {
    fetch("/api/students")
      .then(r => r.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filtered = students.filter(s => {
    const matchSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (s.studentId || "").toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || s.department === filterDept;
    const matchPerf = !filterPerf || s.performance === filterPerf;
    return matchSearch && matchDept && matchPerf;
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
          <h1 className="text-2xl font-bold text-gray-900">👨‍🎓 Talabalar</h1>
          <p className="text-gray-500 text-sm mt-1">Jami: {students.length} ta talaba</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-700 text-sm px-3 py-1.5 rounded-lg font-medium">
            ⭐ A'lo: {students.filter(s => s.performance === "excellent").length}
          </span>
          <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1.5 rounded-lg font-medium">
            📊 O'rta: {students.filter(s => s.performance === "average").length}
          </span>
          <span className="bg-red-100 text-red-700 text-sm px-3 py-1.5 rounded-lg font-medium">
            ⚠️ Zaif: {students.filter(s => s.performance === "poor").length}
          </span>
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
        <select
          value={filterPerf}
          onChange={e => setFilterPerf(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Barcha darajalar</option>
          <option value="excellent">⭐ A'lo (≥80)</option>
          <option value="average">📊 O'rta (60-79)</option>
          <option value="poor">⚠️ Zaif (&lt;60)</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Talaba</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Yo'nalish</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">O'rtacha Ball</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Davomat</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Daraja</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-400 py-8">Talabalar topilmadi</td></tr>
              ) : (
                filtered.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                          student.performance === "excellent" ? "bg-green-500" :
                          student.performance === "average" ? "bg-yellow-500" : "bg-red-500"
                        }`}>
                          {student.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{student.fullName}</div>
                          <div className="text-xs text-gray-400">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{student.studentId || "-"}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{deptLabels[student.department || ""] || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${student.avgScore >= 80 ? "bg-green-500" : student.avgScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${student.avgScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{student.avgScore || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`${student.avgAttendance >= 80 ? "text-green-600" : "text-red-600"} font-medium`}>
                        {student.avgAttendance}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${perfColors[student.performance]}`}>
                        {perfLabels[student.performance]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(student)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Batafsil →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">👨‍🎓 Talaba Ma'lumotlari</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="flex items-center gap-4 mb-6 bg-gray-50 rounded-xl p-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                selected.performance === "excellent" ? "bg-green-500" :
                selected.performance === "average" ? "bg-yellow-500" : "bg-red-500"
              }`}>
                {selected.fullName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900">{selected.fullName}</div>
                <div className="text-sm text-gray-500">{selected.email}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {selected.studentId} | {deptLabels[selected.department || ""] || "-"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">{selected.avgScore || 0}</div>
                <div className="text-xs text-gray-500">O'rtacha Ball</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-700">{selected.avgAttendance}%</div>
                <div className="text-xs text-gray-500">Davomat</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-700">{selected.enrollments.length}</div>
                <div className="text-xs text-gray-500">Kurslar</div>
              </div>
            </div>

            <div className={`rounded-xl p-3 mb-4 border ${perfColors[selected.performance]}`}>
              <div className="font-semibold text-sm">Daraja: {perfLabels[selected.performance]}</div>
              {selected.performance === "poor" && (
                <div className="text-xs mt-1 opacity-80">⚠️ Ushbu talaba qo'shimcha yordam va diqqatga muhtoj!</div>
              )}
              {selected.performance === "excellent" && (
                <div className="text-xs mt-1 opacity-80">⭐ Ajoyib talaba! Darsga muntazam qatnashadi va yuqori ball oladi.</div>
              )}
            </div>

            {selected.enrollments.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">📚 Fanlar va Baholar</h3>
                <div className="space-y-2">
                  {selected.enrollments.map((e, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5">
                      <div className="text-sm text-gray-700 flex-1">{e.courseName}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{e.score || "-"}</span>
                        {e.grade && (
                          <span className={`${gradeColors[e.grade]} text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold`}>
                            {e.grade}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">({e.attendance || 0}%)</span>
                      </div>
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
