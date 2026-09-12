"use client";
import { useEffect, useState } from "react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  department: string | null;
  isPublic: boolean | null;
  createdAt: string;
  authorName: string | null;
  authorRole: string | null;
}

interface User {
  role: string;
  fullName: string;
}

const deptLabels: Record<string, string> = {
  data_analytics: "📊 Data Analytics",
  software_engineering: "💻 Software Engineering",
  economics: "📈 Iqtisodiyot",
  finance: "💰 Moliya",
  financial_technology: "🏦 Moliyaviy Texnologiyalar",
};

const roleLabels: Record<string, string> = {
  rector: "👑 Rektor",
  dean: "🎓 Dekan",
  teacher: "👨‍🏫 O'qituvchi",
  student: "👨‍💻 Talaba",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", department: "", isPublic: true });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    const [annRes, userRes] = await Promise.all([
      fetch("/api/announcements"),
      fetch("/api/auth/me"),
    ]);
    const [annData, userData] = await Promise.all([annRes.json(), userRes.json()]);
    setAnnouncements(Array.isArray(annData) ? annData : []);
    setUser(userData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    setShowForm(false);
    setForm({ title: "", content: "", department: "", isPublic: true });
    fetchAll();
  };

  const canPost = user?.role === "rector" || user?.role === "dean" || user?.role === "teacher";

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
          <h1 className="text-2xl font-bold text-gray-900">📢 E'lonlar</h1>
          <p className="text-gray-500 text-sm mt-1">Universitet e'lonlari va xabarlari</p>
        </div>
        {canPost && (
          <button
            onClick={() => setShowForm(true)}
            className="gradient-bg text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
          >
            + Yangi E'lon
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-5xl mb-3">📭</div>
            <div className="text-gray-500">E'lonlar yo'q</div>
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{ann.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{ann.content}</p>
                  </div>
                  {ann.isPublic && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">🌐 Ommaviy</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  {ann.authorName && (
                    <span className="flex items-center gap-1">
                      {roleLabels[ann.authorRole || ""] || ""} <span className="font-medium text-gray-700">{ann.authorName}</span>
                    </span>
                  )}
                  {ann.department && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {deptLabels[ann.department] || ann.department}
                    </span>
                  )}
                  <span className="ml-auto">
                    🗓️ {new Date(ann.createdAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Announcement Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">📢 Yangi E'lon</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sarlavha *</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E'lon sarlavhasi..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Matn *</label>
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E'lon matni..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Yo'nalish (ixtiyoriy)</label>
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Barcha yo'nalishlar</option>
                  {Object.entries(deptLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={form.isPublic}
                  onChange={e => setForm({ ...form, isPublic: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">Ommaviy (Barcha ko'rishi mumkin)</label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full gradient-bg text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Joylashtirilmoqda..." : "📢 E'lonni Joylashtirish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
