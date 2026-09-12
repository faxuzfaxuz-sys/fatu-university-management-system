"use client";
import { useEffect, useState, useRef } from "react";

interface ChatMessage {
  id: number;
  message: string;
  response: string | null;
  createdAt: string;
}

interface User {
  fullName: string;
  role: string;
}

const quickQuestions = [
  "Dars vaqti qachon?",
  "Baholarim qanday?",
  "Davomat haqida",
  "Ariza berish",
  "Kurslar haqida",
  "Yaxshi o'qish uchun maslahat",
  "Universitet haqida",
  "Imtihon haqida",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/ai-chat").then(r => r.json()),
      fetch("/api/auth/me").then(r => r.json()),
    ]).then(([chatData, userData]) => {
      setMessages(Array.isArray(chatData) ? chatData : []);
      setUser(userData);
      setInitialLoading(false);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (msg?: string) => {
    const text = msg || input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    // Optimistic update
    const tempMsg: ChatMessage = {
      // A temporary negative id cannot collide with a database-generated id.
      id: -1,
      message: text,
      response: null,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();

    if (data.chat) {
      setMessages(prev => prev.map(m => m.id === tempMsg.id ? data.chat : m));
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center"><div className="text-4xl mb-3">⏳</div><div className="text-gray-500">Yuklanmoqda...</div></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🤖 AI Yordamchi</h1>
        <p className="text-gray-500 text-sm mt-1">FATU AI - Barcha savollaringizga javob beradi</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Quick Questions */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">⚡ Tezkor Savollar</h3>
            <div className="space-y-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg p-2.5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 mt-4 text-white">
            <div className="text-2xl mb-2">🤖</div>
            <div className="font-bold text-sm mb-1">FATU AI Bot</div>
            <div className="text-xs text-blue-200">
              Dars jadvali, baholar, kurslar, ariza berish va boshqa savollaringizga javob beraman!
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col" style={{ height: "60vh" }}>
            {/* Chat Header */}
            <div className="gradient-bg rounded-t-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
              <div className="text-white">
                <div className="font-bold">FATU AI Yordamchi</div>
                <div className="text-xs text-blue-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  Online | Har doim tayyor
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">👋</div>
                  <div className="font-medium text-gray-700">Salom, {user?.fullName}!</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Men FATU AI yordamchisiman. Qanday yordam bera olaman?
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2 chat-bubble">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                      {msg.message}
                    </div>
                  </div>

                  {/* AI response */}
                  {msg.response ? (
                    <div className="flex justify-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                      <div className="max-w-[80%] bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm whitespace-pre-line">
                        {msg.response}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Savolingizni yozing... (Enter bosing)"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="gradient-bg text-white px-4 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  {loading ? "⏳" : "📤 Yuborish"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                🤖 FATU AI | Dars jadvali, baholar, maslahatlar va ko'proq narsalar haqida so'rang
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
