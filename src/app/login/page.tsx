"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Kirish xatosi");
      }
    } catch {
      setError("Server bilan ulanishda xato");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: "Rektor", email: "rector@fatu.uz", pass: "rector2024", color: "bg-yellow-100 border-yellow-300", icon: "👑" },
    { role: "Dekan", email: "dean.da@fatu.uz", pass: "dean2024", color: "bg-blue-100 border-blue-300", icon: "🎓" },
    { role: "O'qituvchi", email: "mirzo@fatu.uz", pass: "teacher2024", color: "bg-green-100 border-green-300", icon: "👨‍🏫" },
    { role: "Talaba", email: "sardor@student.fatu.uz", pass: "student2024", color: "bg-purple-100 border-purple-300", icon: "👨‍💻" },
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-3 text-white mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl font-bold text-blue-700 shadow-lg">F</div>
              <div className="text-left">
                <div className="font-bold text-xl">FATU</div>
                <div className="text-blue-200 text-sm">Axborot Texnologiyalari</div>
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Tizimga Kirish</h1>
          <p className="text-blue-200 text-sm mt-1">Hisobingizga kiring</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">📧 Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@fatu.uz"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">🔒 Parol</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 shadow-md"
            >
              {loading ? "⏳ Kirilmoqda..." : "🚀 Tizimga Kirish"}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium">DEMO AKKAUNTLAR (bosing)</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc, i) => (
                <button
                  key={i}
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className={`${acc.color} border rounded-xl p-3 text-left transition-all hover:scale-105 cursor-pointer`}
                >
                  <div className="text-lg">{acc.icon}</div>
                  <div className="text-xs font-bold text-gray-800 mt-1">{acc.role}</div>
                  <div className="text-xs text-gray-500 truncate">{acc.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-blue-200 text-sm hover:text-white transition-colors">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
