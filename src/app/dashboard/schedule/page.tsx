"use client";
import { useEffect, useState } from "react";

interface Schedule {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string | null;
  courseName: string | null;
  courseCode: string | null;
  teacherName: string | null;
  department: string | null;
}

const deptLabels: Record<string, string> = {
  data_analytics: "📊 Data Analytics",
  software_engineering: "💻 Software Engineering",
  economics: "📈 Iqtisodiyot",
  finance: "💰 Moliya",
  financial_technology: "🏦 Moliyaviy Texnologiyalar",
};

const deptColors: Record<string, string> = {
  data_analytics: "bg-blue-100 border-blue-300 text-blue-800",
  software_engineering: "bg-purple-100 border-purple-300 text-purple-800",
  economics: "bg-green-100 border-green-300 text-green-800",
  finance: "bg-yellow-100 border-yellow-300 text-yellow-800",
  financial_technology: "bg-orange-100 border-orange-300 text-orange-800",
};

const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("");

  useEffect(() => {
    fetch("/api/my-schedule")
      .then(r => r.json())
      .then(data => {
        setSchedules(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filtered = filterDept
    ? schedules.filter(s => s.department === filterDept)
    : schedules;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <div className="text-gray-500">Jadval yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Dars Jadvali</h1>
          <p className="text-gray-500 text-sm mt-1">Haftalik dars jadvali</p>
        </div>
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

      {/* Weekly grid */}
      <div className="grid md:grid-cols-5 gap-4">
        {days.map(day => {
          const daySchedules = filtered.filter(s => s.dayOfWeek === day);
          return (
            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="gradient-bg text-white p-3 text-center">
                <div className="font-bold text-sm">{day}</div>
              </div>
              <div className="p-3 space-y-2 min-h-[150px]">
                {daySchedules.length === 0 ? (
                  <div className="text-center text-gray-400 text-xs py-4">Dars yo'q</div>
                ) : (
                  daySchedules
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(s => (
                      <div
                        key={s.id}
                        className={`border rounded-lg p-2.5 text-xs ${deptColors[s.department || ""] || "bg-gray-100 border-gray-200 text-gray-700"}`}
                      >
                        <div className="font-bold mb-1 line-clamp-2">{s.courseName}</div>
                        <div className="flex items-center gap-1 text-xs opacity-80">
                          <span>🕐</span>
                          <span>{s.startTime} - {s.endTime}</span>
                        </div>
                        {s.room && (
                          <div className="flex items-center gap-1 text-xs opacity-80 mt-0.5">
                            <span>🚪</span>
                            <span>{s.room}</span>
                          </div>
                        )}
                        {s.teacherName && (
                          <div className="flex items-center gap-1 text-xs opacity-80 mt-0.5">
                            <span>👨‍🏫</span>
                            <span className="truncate">{s.teacherName}</span>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* List view */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">📋 Ro'yxat Ko'rinishi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Kun</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Vaqt</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Fan</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">O'qituvchi</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Xona</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Yo'nalish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">Jadval ma'lumotlari yo'q</td>
                </tr>
              ) : (
                filtered
                  .sort((a, b) => {
                    const dayOrder = days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                    if (dayOrder !== 0) return dayOrder;
                    return a.startTime.localeCompare(b.startTime);
                  })
                  .map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.dayOfWeek}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                          {s.startTime} - {s.endTime}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">{s.courseName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.teacherName || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.room || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${deptColors[s.department || ""] || "bg-gray-100"}`}>
                          {deptLabels[s.department || ""] || s.department || "-"}
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
