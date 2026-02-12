"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface QAItem {
  id: string;
  name: string;
  email: string;
  question: string;
  category: string;
  answer: string;
  answeredAt: string;
  createdAt: string;
}

const CATEGORIES = [
  { value: "general", label: "General", color: "#00ff00" },
  { value: "technical", label: "Technical", color: "#00ffff" },
  { value: "token", label: "Token", color: "#ffaa00" },
  { value: "contribution", label: "Contribution", color: "#aa66ff" },
  { value: "partnership", label: "Partnership", color: "#ff6688" },
];

function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

function categoryColor(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.color || "#00ff00";
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function QAContent() {
  const searchParams = useSearchParams();
  const isAdmin =
    searchParams.get("admin") === "true" && !!searchParams.get("token");
  const token = searchParams.get("token") || "";

  const [questions, setQuestions] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("general");

  // Admin answer state
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      const url = isAdmin ? `/api/qa?token=${token}` : "/api/qa";
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch {
      console.error("Failed to fetch Q&A");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, token]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question, category }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setQuestion("");
      setCategory("general");
      fetchQuestions();
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAnswer(id: string) {
    if (!answerText.trim()) return;
    setAnswerSubmitting(true);

    try {
      const res = await fetch(`/api/qa/${id}/answer?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerText }),
      });

      if (res.ok) {
        setAnsweringId(null);
        setAnswerText("");
        fetchQuestions();
      }
    } catch {
      console.error("Failed to submit answer");
    } finally {
      setAnswerSubmitting(false);
    }
  }

  const unanswered = questions.filter((q) => !q.answer);
  const answered = questions.filter((q) => q.answer);

  return (
    <>
      {/* Header */}
      <div className="terminal-box p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
          <span className="text-[#555] text-xs">enablerdao:~$</span>
          <span className="text-[#00ff00] text-xs">ask --dao</span>
          <span className="text-[#00ff00] text-xs animate-pulse">_</span>
        </div>

        <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow">
          Q&A / 質問箱
        </h1>
        <p className="text-[#888] text-sm leading-relaxed">
          EnablerDAOに関する質問をお気軽にどうぞ。
          <br />
          回答は通常1〜2営業日以内に掲載されます。
        </p>

        {isAdmin && (
          <div className="mt-3 px-3 py-1.5 bg-[#ffaa00]/10 border border-[#ffaa00]/30 inline-block">
            <span className="text-[#ffaa00] text-xs">
              [ADMIN MODE] 管理画面
            </span>
          </div>
        )}
      </div>

      {/* Question Form */}
      {!isAdmin && (
        <div className="terminal-box p-4 sm:p-6 mb-6">
          <h2 className="text-[#00ffff] text-sm mb-4">
            <span className="text-[#555]">$ </span>new Question()
          </h2>

          {submitted ? (
            <div className="border border-[#00ff00]/30 bg-[#00ff00]/5 p-4">
              <p className="text-[#00ff00] text-sm mb-2">
                質問を受け付けました
              </p>
              <p className="text-[#888] text-xs">
                回答が掲載されるまでしばらくお待ちください。
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-1.5 text-xs border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10 transition-colors"
              >
                $ ask another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[#555] text-xs mb-1">
                  <span className="text-[#00aa00]">&gt; </span>
                  名前 / ハンドル名（任意）
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="anonymous"
                  maxLength={100}
                  className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#555] text-xs mb-1">
                  <span className="text-[#00aa00]">&gt; </span>
                  メールアドレス（任意 - 回答通知用）
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={200}
                  className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[#555] text-xs mb-1">
                  <span className="text-[#00aa00]">&gt; </span>
                  カテゴリ
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className="px-3 py-1 text-xs border transition-colors"
                      style={{
                        borderColor:
                          category === cat.value ? cat.color : "#1a3a1a",
                        color: category === cat.value ? cat.color : "#555",
                        backgroundColor:
                          category === cat.value
                            ? `${cat.color}15`
                            : "transparent",
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question */}
              <div>
                <label className="block text-[#555] text-xs mb-1">
                  <span className="text-[#00aa00]">&gt; </span>
                  質問内容 *
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  rows={4}
                  maxLength={5000}
                  placeholder="質問を入力してください..."
                  className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors resize-vertical"
                />
                <p className="text-[#333] text-[10px] mt-1 text-right">
                  {question.length}/5000
                </p>
              </div>

              {error && (
                <div className="border border-[#ff3333]/30 bg-[#ff3333]/5 px-3 py-2">
                  <p className="text-[#ff3333] text-xs">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !question.trim()}
                className="px-5 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? "送信中..." : "$ submit question"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Admin: Unanswered Questions */}
      {isAdmin && unanswered.length > 0 && (
        <div className="terminal-box p-4 sm:p-6 mb-6">
          <h2 className="text-[#ffaa00] text-sm mb-4 text-glow-amber">
            <span className="text-[#555]">$ </span>
            未回答の質問 ({unanswered.length})
          </h2>

          <div className="space-y-4">
            {unanswered.map((q) => (
              <div
                key={q.id}
                className="border border-[#ffaa00]/30 bg-[#ffaa00]/5 p-4"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="text-[10px] px-1.5 py-0.5 border"
                    style={{
                      color: categoryColor(q.category),
                      borderColor: `${categoryColor(q.category)}40`,
                    }}
                  >
                    {categoryLabel(q.category)}
                  </span>
                  <span className="text-[#555] text-[10px]">
                    {formatDate(q.createdAt)}
                  </span>
                  <span className="text-[#555] text-[10px]">
                    ID: {q.id}
                  </span>
                </div>

                {(q.name || q.email) && (
                  <p className="text-[#555] text-xs mb-1">
                    {q.name && (
                      <span className="text-[#888]">{q.name}</span>
                    )}
                    {q.name && q.email && " / "}
                    {q.email && (
                      <span className="text-[#00ffff]">{q.email}</span>
                    )}
                  </p>
                )}

                <p className="text-[#00ff00] text-sm mb-3 whitespace-pre-wrap">
                  {q.question}
                </p>

                {answeringId === q.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      rows={4}
                      placeholder="回答を入力..."
                      className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors resize-vertical"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAnswer(q.id)}
                        disabled={answerSubmitting || !answerText.trim()}
                        className="px-4 py-1.5 text-xs bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/20 transition-colors disabled:opacity-30"
                      >
                        {answerSubmitting ? "送信中..." : "$ submit answer"}
                      </button>
                      <button
                        onClick={() => {
                          setAnsweringId(null);
                          setAnswerText("");
                        }}
                        className="px-4 py-1.5 text-xs border border-[#1a3a1a] text-[#555] hover:text-[#ff3333] hover:border-[#ff3333]/30 transition-colors"
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAnsweringId(q.id);
                      setAnswerText("");
                    }}
                    className="px-4 py-1.5 text-xs border border-[#ffaa00]/30 text-[#ffaa00] hover:bg-[#ffaa00]/10 transition-colors"
                  >
                    $ reply
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Q&A List */}
      <div className="terminal-box p-4 sm:p-6">
        <h2 className="text-[#00ff00] text-sm mb-4">
          <span className="text-[#555]">$ </span>
          cat QA_LOG.md
          {!isAdmin && (
            <span className="text-[#555] text-xs ml-2">
              -- 回答済みの質問
            </span>
          )}
        </h2>

        {loading ? (
          <div className="text-[#555] text-xs animate-pulse">
            Loading Q&A data...
          </div>
        ) : (isAdmin ? answered : questions).length === 0 ? (
          <div className="text-[#555] text-xs border border-[#1a3a1a] p-4 text-center">
            まだ回答済みの質問はありません。
            <br />
            最初の質問を投稿してみましょう。
          </div>
        ) : (
          <div className="space-y-4">
            {(isAdmin ? answered : questions).map((q) => (
              <div
                key={q.id}
                className="border border-[#1a3a1a] p-4 hover:border-[#00ff00]/20 transition-colors"
              >
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="text-[10px] px-1.5 py-0.5 border"
                    style={{
                      color: categoryColor(q.category),
                      borderColor: `${categoryColor(q.category)}40`,
                    }}
                  >
                    {categoryLabel(q.category)}
                  </span>
                  <span className="text-[#555] text-[10px]">
                    {formatDate(q.createdAt)}
                  </span>
                  {q.name && (
                    <span className="text-[#555] text-[10px]">
                      by {q.name}
                    </span>
                  )}
                </div>

                {/* Question */}
                <div className="mb-3">
                  <p className="text-[#00ffff] text-xs mb-1">
                    <span className="text-[#555]">Q: </span>
                  </p>
                  <p className="text-[#ccc] text-sm whitespace-pre-wrap pl-4 border-l-2 border-[#00ffff]/30">
                    {q.question}
                  </p>
                </div>

                {/* Answer */}
                <div>
                  <p className="text-[#00ff00] text-xs mb-1">
                    <span className="text-[#555]">A: </span>
                  </p>
                  {q.answer ? (
                    <>
                      <p className="text-[#888] text-sm whitespace-pre-wrap pl-4 border-l-2 border-[#00ff00]/30">
                        {q.answer}
                      </p>
                      {q.answeredAt && (
                        <p className="text-[#333] text-[10px] mt-1 pl-4">
                          回答日: {formatDate(q.answeredAt)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[#ffaa00] text-xs pl-4 border-l-2 border-[#ffaa00]/30 animate-pulse">
                      回答待ち...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function QALoading() {
  return (
    <>
      <div className="terminal-box p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
          <span className="text-[#555] text-xs">enablerdao:~$</span>
          <span className="text-[#00ff00] text-xs">ask --dao</span>
          <span className="text-[#00ff00] text-xs animate-pulse">_</span>
        </div>
        <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow">
          Q&A / 質問箱
        </h1>
        <p className="text-[#555] text-xs animate-pulse">Loading...</p>
      </div>
    </>
  );
}

export default function QAPage() {
  return (
    <div className="grid-bg">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<QALoading />}>
            <QAContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
