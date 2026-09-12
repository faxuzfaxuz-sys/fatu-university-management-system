"use client";
import { useEffect, useState } from "react";

interface Student {
  id: number;
  fullName: string;
  email: string;
  department: string | null;
  studentId: string | null;
  avgScore: number;
  avgAttendance: number;
  performance: string;
  enrollments: {
    courseName: string | null;
    grade: string | null;
    score: string | null;
    attendance: number | null;
  }[];
}

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

export default function MyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ department?: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then(r => r.json()),
      fetch("/api/auth/me").then(r => r.json()),
    ]).then(([studentsData, userData]) => {
      setUser(userData);
      // Filter students by teacher's department
      const filtered = Array.isArray(studentsData)
        ? studentsData.filter((s: Student) => s.department === userData.department)
        : [];
      setStudents(filtered);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center"><div className="text-4xl mb-3">⏳</div><div className="text-gray-500">Yuklanmoqda...</div></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">👨‍🎓 Mening Talabalarim</h1>
        <p className="text-gray-500 text-sm mt-1">Yo'nalihingizdagi talabalar: {students.length} ta</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{students.filter(s => s.performance === "excellent").length}</div>
          <div className="text-sm text-green-600 mt-1">⭐ A'lo Talabalar</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-700">{students.filter(s => s.performance === "average").length}</div>
          <div className="text-sm text-yellow-600 mt-1">📊 O'rta Talabalar</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-700">{students.filter(s => s.performance === "poor").length}</div>
          <div className="text-sm text-red-600 mt-1">⚠️ Zaif Talabalar</div>
        </div>
      </div>

      {students.filter(s => s.performance === "poor").length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-bold text-red-800 mb-2">⚠️ Diqqat - Zaif Talabalar</h3>
          <div className="space-y-2">
            {students.filter(s => s.performance === "poor").map(s => (
              <div key={s.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
                <div>
                  <div className="font-medium text-sm text-gray-900">{s.fullName}</div>
                  <div className="text-xs text-gray-500">{s.studentId}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">Ball: {s.avgScore}</div>
                  <div className="text-xs text-gray-500">Davomat: {s.avgAttendance}%</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-3">
            💡 Tavsiya: Ushbu talabalar bilan individual suhbat o'tkazing va qo'shimcha darslar rejalashtiring.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Talaba</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">O'rtacha Ball</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Davomat</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Daraja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-8">Talabalar yo'q</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          s.performance === "excellent" ? "bg-green-500" :
                          s.performance === "average" ? "bg-yellow-500" : "bg-red-500"
                        }`}>{s.fullName.charAt(0)}</div>
                        <div>
                          <div className="font-medium text-sm">{s.fullName}</div>
                          <div className="text-xs text-gray-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{s.studentId}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{s.avgScore}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={s.avgAttendance >= 80 ? "text-green-600" : "text-red-600"}>
                        {s.avgAttendance}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${perfColors[s.performance]}`}>
                        {perfLabels[s.performance]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
