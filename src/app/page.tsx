"use client";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyData, setApplyData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    department: "",
    message: "",
  });
  const [applySuccess, setApplySuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const departments = [
    { value: "data_analytics", label: "📊 Data Analytics", desc: "Ma'lumotlar tahlili va vizualizatsiya" },
    { value: "software_engineering", label: "💻 Software Engineering", desc: "Dasturiy ta'minot muhandisligi" },
    { value: "economics", label: "📈 Iqtisodiyot", desc: "Zamonaviy iqtisodiyot nazariyasi" },
    { value: "finance", label: "💰 Moliya", desc: "Moliyaviy boshqaruv va tahlil" },
    { value: "financial_technology", label: "🏦 Moliyaviy Texnologiyalar", desc: "FinTech va Blockchain" },
  ];

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applyData),
      });
      if (res.ok) {
        setApplySuccess(true);
        setShowApplyForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Talabalar", value: "1200+", icon: "👨‍🎓" },
    { label: "O'qituvchilar", value: "85+", icon: "👨‍🏫" },
    { label: "Yo'nalishlar", value: "5", icon: "📚" },
    { label: "Laboratoriyalar", value: "12", icon: "🔬" },
  ];

  const news = [
    { title: "2024-2025 o'quv yili ochilishi", date: "01 Sep 2024", content: "Rektor Bayandikov Faxriddin barcha talabalarni yangi o'quv yili bilan muborak qildi." },
    { title: "Data Analytics olimpiadasi", date: "15 Nov 2024", content: "Data Analytics talabalari uchun olimpiada e'lon qilindi. G'oliblar mukofotlanadi." },
    { title: "Yangi laboratoriyalar", date: "10 Oct 2024", content: "Yangi kompyuter laboratoriyalari qurilishi tugallandi va talabalar ixtiyoriga berildi." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="gradient-bg text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">F</div>
            <div>
              <div className="font-bold text-lg leading-tight">FATU</div>
              <div className="text-xs text-blue-200 hidden sm:block">Faxriddin Axborot Texnologiyalari Universiteti</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-blue-200 transition-colors">Haqimizda</a>
            <a href="#departments" className="hover:text-blue-200 transition-colors">Yo'nalishlar</a>
            <a href="#news" className="hover:text-blue-200 transition-colors">Yangiliklar</a>
            <a href="#contact" className="hover:text-blue-200 transition-colors">Aloqa</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApplyForm(true)}
              className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📝 Ariza Berish
            </button>
            <Link
              href="/login"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              🔐 Kirish
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 text-sm">
            <span>🏛️</span>
            <span>O'zbekistonning yetakchi IT universiteti</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Faxriddin Axborot<br />
            <span className="text-yellow-300">Texnologiyalari</span><br />
            Universiteti
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Kelajak texnologiyalarini bugun o'rganing. Bizning universitetda 5 ta zamonaviy yo'nalishda bilim oling.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setShowApplyForm(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
            >
              📝 Hoziroq Ariza Bering
            </button>
            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              🔐 Tizimga Kirish
            </Link>
          </div>

          {applySuccess && (
            <div className="mt-6 bg-green-500/20 border border-green-400 rounded-xl p-4 text-green-200 inline-block">
              ✅ Arizangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-blue-50 card-hover">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-700">{stat.value}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Universitet Haqida</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Faxriddin Axborot Texnologiyalari Universiteti (FATU) - O'zbekistondagi eng zamonaviy va innovatsion ta'lim muassasalaridan biridir. Universitetimiz 2020-yilda tashkil etilgan bo'lib, hozirda 1200 dan ortiq talaba va 85 dan ziyod malakali o'qituvchi bilan ishlaydi.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Universitetimiz rektor Bayandikov Faxriddin rahbarligida zamonaviy ta'lim texnologiyalari va ilg'or uslublar asosida o'qitadi. Bizning maqsad - har bir talabani kelajakka tayyorlash.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🏆", text: "A akkreditatsiyasi" },
                  { icon: "🌍", text: "Xalqaro hamkorlik" },
                  { icon: "💼", text: "100% ish bilan ta'minlash" },
                  { icon: "🔬", text: "12 zamonaviy lab" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Rahbariyat</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900">B</div>
                  <div>
                    <div className="font-bold text-lg">Bayandikov Faxriddin</div>
                    <div className="text-blue-200 text-sm">Rektor</div>
                    <div className="text-blue-300 text-xs">rector@fatu.uz</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-xl font-bold text-gray-900">K</div>
                  <div>
                    <div className="font-semibold">Karimov Jasur</div>
                    <div className="text-blue-200 text-sm">Data Analytics Dekani</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-xl font-bold text-gray-900">T</div>
                  <div>
                    <div className="font-semibold">Toshmatov Bobur</div>
                    <div className="text-blue-200 text-sm">Software Engineering Dekani</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Yo'nalishlar</h2>
            <p className="text-gray-600">Kelajakka yo'naltirilgan 5 ta zamonaviy yo'nalish</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover">
                <div className="text-4xl mb-4">{dept.label.split(" ")[0]}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.label.slice(2)}</h3>
                <p className="text-gray-600 text-sm mb-4">{dept.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {i === 0 && ["Python", "ML", "Big Data", "Statistics"].map(t => (
                    <span key={t} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{t}</span>
                  ))}
                  {i === 1 && ["React", "Node.js", "DevOps", "Mobile"].map(t => (
                    <span key={t} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{t}</span>
                  ))}
                  {i === 2 && ["Makro", "Mikro", "Statistika"].map(t => (
                    <span key={t} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{t}</span>
                  ))}
                  {i === 3 && ["Banking", "Investment", "Risk"].map(t => (
                    <span key={t} className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{t}</span>
                  ))}
                  {i === 4 && ["Blockchain", "Crypto", "DeFi"].map(t => (
                    <span key={t} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => { setApplyData({ ...applyData, department: dept.value }); setShowApplyForm(true); }}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Ariza Berish →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Yangiliklar va E'lonlar</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm card-hover">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">{item.date}</span>
                <h3 className="font-bold text-gray-900 mt-3 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">F</div>
                <span className="font-bold text-lg">FATU</span>
              </div>
              <p className="text-gray-400 text-sm">Faxriddin Axborot Texnologiyalari Universiteti - O'zbekiston kelajagi uchun ta'lim.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Aloqa</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <div>📍 Toshkent, O'zbekiston</div>
                <div>📞 +998 71 123 45 67</div>
                <div>✉️ info@fatu.uz</div>
                <div>🌐 www.fatu.uz</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Tizimga Kirish</h4>
              <p className="text-gray-400 text-sm mb-4">Talaba, o'qituvchi yoki ma'murlar uchun maxsus panel.</p>
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors inline-block">
                🔐 Tizimga Kirish
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            © 2024 FATU - Faxriddin Axborot Texnologiyalari Universiteti. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">📝 Ariza Berish</h2>
              <button onClick={() => setShowApplyForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">To'liq Ism *</label>
                <input
                  required
                  type="text"
                  value={applyData.applicantName}
                  onChange={e => setApplyData({ ...applyData, applicantName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Familiya Ism Otasining ismi"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={applyData.email}
                  onChange={e => setApplyData({ ...applyData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Telefon</label>
                <input
                  type="tel"
                  value={applyData.phone}
                  onChange={e => setApplyData({ ...applyData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Yo'nalish *</label>
                <select
                  required
                  value={applyData.department}
                  onChange={e => setApplyData({ ...applyData, department: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tanlang...</option>
                  {departments.map(d => (
                    <option key={d.value} value={d.value}>{d.label.slice(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Murojaat (ixtiyoriy)</label>
                <textarea
                  rows={3}
                  value={applyData.message}
                  onChange={e => setApplyData({ ...applyData, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                {loading ? "Yuborilmoqda..." : "✅ Ariza Yuborish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
