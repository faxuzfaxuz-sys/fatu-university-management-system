"use client";
import { useEffect, useState } from "react";

interface Application {
  id: number;
  applicantName: string;
  email: string;
  phone: string | null;
  department: string;
  message: string | null;
  status: string;
  createdAt: string;
  reviewNote: string | null;
}

const deptLabels: Record<string, string> = {
  data_analytics: "📊 Data Analytics",
  software_engineering: "💻 Software Engineering",
  economics: "📈 Iqtisodiyot",
  finance: "💰 Moliya",
  financial_technology: "🏦 Moliyaviy Texnologiyalar",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "⏳ Kutilmoqda", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  approved: { label: "✅ Qabul qilindi", color: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "❌ Rad etildi", color: "bg-red-100 text-red-700 border-red-200" },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (status: string) => {
    if (!selected) return;
    setActionLoading(true);
    await fetch(`/api/applications/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewNote }),
    });
    setActionLoading(false);
    setSelected(null);
    setReviewNote("");
    fetchApplications();
  };

  const filtered = filterStatus
    ? applications.filter(a => a.status === filterStatus)
    : applications;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center"><div className="text-4xl mb-3">⏳</div><div className="text-gray-500">Yuklanmoqda...</div></div>
      </div>
    );
  }

  const pending = applications.filter(a => a.status === "pending").length;
  const approved = applications.filter(a => a.status === "approved").length;
  const rejected = applications.filter(a => a.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📝 Arizalar</h1>
          <p className="text-gray-500 text-sm mt-1">Yangi talabalar arizalari</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-700">{pending}</div>
          <div className="text-sm text-yellow-600 mt-1">⏳ Kutilmoqda</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{approved}</div>
          <div className="text-sm text-green-600 mt-1">✅ Qabul qilindi</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-700">{rejected}</div>
          <div className="text-sm text-red-600 mt-1">❌ Rad etildi</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        {["", "pending", "approved", "rejected"].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === s ? "gradient-bg text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {s === "" ? "Barchasi" : statusConfig[s]?.label}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Arizachi</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Yo'nalish</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Sana</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Holat</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-8">Arizalar yo'q</td></tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{app.applicantName}</div>
                        <div className="text-xs text-gray-400">{app.email}</div>
                        {app.phone && <div className="text-xs text-gray-400">{app.phone}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{deptLabels[app.department] || app.department}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString("uz-UZ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${statusConfig[app.status]?.color || ""}`}>
                        {statusConfig[app.status]?.label || app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSelected(app); setReviewNote(app.reviewNote || ""); }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ko'rish →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">📝 Ariza Ko'rish</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <div><span className="text-xs text-gray-500">Ism:</span> <span className="font-medium text-sm">{selected.applicantName}</span></div>
              <div><span className="text-xs text-gray-500">Email:</span> <span className="text-sm">{selected.email}</span></div>
              {selected.phone && <div><span className="text-xs text-gray-500">Tel:</span> <span className="text-sm">{selected.phone}</span></div>}
              <div><span className="text-xs text-gray-500">Yo'nalish:</span> <span className="text-sm">{deptLabels[selected.department] || selected.department}</span></div>
              <div><span className="text-xs text-gray-500">Sana:</span> <span className="text-sm">{new Date(selected.createdAt).toLocaleString("uz-UZ")}</span></div>
              <div>
                <span className="text-xs text-gray-500">Holat:</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${statusConfig[selected.status]?.color}`}>
                  {statusConfig[selected.status]?.label}
                </span>
              </div>
            </div>

            {selected.message && (
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-1">Murojaat:</div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700">{selected.message}</div>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">📋 Ko'rib chiqish izohi</label>
              <textarea
                rows={3}
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ariza bo'yicha izoh yozing..."
              />
            </div>

            {selected.status === "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("approved")}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                >
                  ✅ Qabul Qilish
                </button>
                <button
                  onClick={() => handleAction("rejected")}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                >
                  ❌ Rad Etish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
