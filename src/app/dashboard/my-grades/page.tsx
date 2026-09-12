"use client";
import { useEffect, useState } from "react";

interface Grade {
  id: number;
  grade: string | null;
  score: string | null;
  attendance: number | null;
  enrolledAt: string | null;
  courseName: string | null;
  courseCode: string | null;
  credits: number | null;
  semester: number | null;
  teacherName: string | null;
}

const gradeConfig: Record<string, { color: string; label: string; bg: string }> = {
  A: { color: "text-green-700", label: "A'lo", bg: "bg-green-500" },
  B: { color: "text-blue-700", label: "Yaxshi", bg: "bg-blue-500" },
  C: { color: "text-yellow-700", label: "Qoniqarli", bg: "bg-yellow-500" },
  D: { color: "text-orange-700", label: "Yomon", bg: "bg-orange-500" },
  F: { color: "text-red-700", label: "Baho berilmadi", bg: "bg-red-500" },
};

export default function MyGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-grades")
      .then(r => r.json())
      .then(data => {
        setGrades(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const avgScore = grades.length > 0
    ? grades.reduce((sum, g) => sum + parseFloat(g.score || "0"), 0) / grades.length
    : 0;

  const avgAttendance = grades.length > 0
    ? grades.reduce((sum, g) => sum + (g.attendance || 0), 0) / grades.length
    : 0;

  const gpaPoints: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const gpa = grades.length > 0
    ? grades.reduce((sum, g) => sum + (gpaPoints[g.grade || ""] || 0), 0) / grades.length
    : 0;

  const performance = avgScore >= 80 ? "excellent" : avgScore >= 60 ? "average" : "poor";

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
        <h1 className="text-2xl font-bold text-gray-900">📊 Mening Baholarim</h1>
        <p className="text-gray-500 text-sm mt-1">O'quv natijalari va baholar</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600">{Math.round(avgScore * 10) / 10}</div>
          <div className="text-xs text-gray-500 mt-1">O'rtacha Ball</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className={`text-3xl font-bold ${avgAttendance >= 80 ? "text-green-600" : "text-red-600"}`}>
            {Math.round(avgAttendance)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Davomat</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-purple-600">{(Math.round(gpa * 100) / 100).toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">GPA</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-gray-900">{grades.length}</div>
          <div className="text-xs text-gray-500 mt-1">Kurslar</div>
        </div>
      </div>

      {/* Performance Banner */}
      <div className={`rounded-xl p-4 ${
        performance === "excellent" ? "bg-green-50 border border-green-200" :
        performance === "average" ? "bg-yellow-50 border border-yellow-200" :
        "bg-red-50 border border-red-200"
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">
            {performance === "excellent" ? "⭐" : performance === "average" ? "📊" : "⚠️"}
          </span>
          <div>
            <div className={`font-bold ${
              performance === "excellent" ? "text-green-700" :
              performance === "average" ? "text-yellow-700" : "text-red-700"
            }`}>
              {performance === "excellent" ? "A'lo talaba! Davom eting!" :
               performance === "average" ? "O'rtacha daraja. Ko'proq harakat qiling!" :
               "Diqqat! Ko'proq o'qish kerak!"}
            </div>
            <div className="text-sm text-gray-600 mt-0.5">
              {performance === "poor" && "🎯 Maslahat: Darsga muntazam keling, topshiriqlarni o'z vaqtida bajaring, o'qituvchilar bilan ko'proq muloqot qiling."}
              {performance === "excellent" && "🎯 Siz universitetning eng yaxshi talabalari safida turibsiz! Olimpiadaga qatnashishni ko'ring!"}
              {performance === "average" && "🎯 Biroz ko'proq harakat bilan A'lo darajaga chiqishingiz mumkin!"}
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">📚 Fanlar bo'yicha Baholar</h2>
        </div>
        {grades.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <div>Baholar mavjud emas</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Fan</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">O'qituvchi</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Kredit</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Ball</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Davomat</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Baho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grades.map(g => (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-gray-900">{g.courseName}</div>
                      <div className="text-xs text-gray-400">{g.courseCode} | {g.semester}-semester</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.teacherName || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.credits || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-12 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              parseFloat(g.score || "0") >= 80 ? "bg-green-500" :
                              parseFloat(g.score || "0") >= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${g.score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{g.score || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        (g.attendance || 0) >= 80 ? "text-green-600" : "text-red-600"
                      }`}>
                        {g.attendance || 0}%
                        {(g.attendance || 0) < 80 && " ⚠️"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {g.grade ? (
                        <div className="flex items-center gap-2">
                          <span className={`${gradeConfig[g.grade]?.bg} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold`}>
                            {g.grade}
                          </span>
                          <span className={`text-xs ${gradeConfig[g.grade]?.color}`}>
                            {gradeConfig[g.grade]?.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grade Scale */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">📏 Baho Tizimi</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(gradeConfig).map(([grade, config]) => (
            <div key={grade} className="text-center">
              <div className={`${config.bg} text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto`}>{grade}</div>
              <div className={`text-xs ${config.color} mt-1 font-medium`}>{config.label}</div>
              <div className="text-xs text-gray-400">
                {grade === "A" ? "90-100" : grade === "B" ? "75-89" : grade === "C" ? "60-74" : grade === "D" ? "50-59" : "<50"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
