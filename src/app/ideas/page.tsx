"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NewsletterCTA from "@/components/NewsletterCTA";

interface Idea {
  id: string;
  title: string;
  category: string;
  detail: string;
  nickname: string;
  likes: number;
  createdAt: string;
}

const CATEGORIES = [
  { value: "all", label: "すべて", color: "#00ff00" },
  { value: "daily", label: "生活の不便", color: "#00ff00" },
  { value: "business", label: "ビジネス効率化", color: "#00ffff" },
  { value: "entertainment", label: "エンタメ", color: "#ff6688" },
  { value: "education", label: "教育", color: "#ffaa00" },
  { value: "other", label: "その他", color: "#aa66ff" },
];

const SUBMIT_CATEGORIES = CATEGORIES.filter((c) => c.value !== "all");

function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

function categoryColor(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.color || "#00ff00";
}

function timeAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  const months = Math.floor(days / 30);
  return `${months}ヶ月前`;
}

const FAQ_ITEMS = [
  {
    q: "投稿したアイデアはどうなるの？",
    a: "EnablerDAOチームが定期的にレビューし、実現可能性の高いアイデアはプロジェクト化を検討します。進捗はこのページやニュースレターでお知らせします。",
  },
  {
    q: "報酬はあるの？",
    a: "採用されたアイデアの投稿者には、EBRトークンを付与します。さらにプロジェクト化された場合、開発への参加やフィードバックでも追加のEBRを獲得できます。",
  },
  {
    q: "技術的な知識がなくても大丈夫？",
    a: "もちろんです。「こんなものがあったらいいな」という気持ちが一番大切です。技術的な実現は私たちが考えます。",
  },
  {
    q: "似たアイデアが既にあったら？",
    a: "大歓迎です。同じ課題を感じている人が多いほど、優先度が上がります。既存のアイデアに「いいね」を押していただくのも効果的です。",
  },
];

type SortMode = "likes" | "newest";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("likes");

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("daily");
  const [detail, setDetail] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  // Like cooldown (per-session)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const fetchIdeas = useCallback(async () => {
    try {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch {
      console.error("Failed to fetch ideas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, detail, nickname, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      setSubmitted(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && (window as any).plausible) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).plausible('Idea Submit');
      }
      setTitle("");
      setCategory("daily");
      setDetail("");
      setNickname("");
      setEmail("");
      fetchIdeas();
    } catch {
      setError("送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLike(id: string) {
    if (likedIds.has(id)) return;

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", id }),
      });

      if (res.ok) {
        setLikedIds((prev) => new Set(prev).add(id));
        setIdeas((prev) =>
          prev.map((idea) =>
            idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
          )
        );
      }
    } catch {
      console.error("Failed to like idea");
    }
  }

  // Filtered and sorted ideas
  const displayIdeas = ideas
    .filter((idea) => filterCategory === "all" || idea.category === filterCategory)
    .sort((a, b) => {
      if (sortMode === "likes") return b.likes - a.likes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="grid-bg">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="terminal-box p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao:~$</span>
              <span className="text-[#00ff00] text-xs">submit --idea</span>
              <span className="text-[#00ff00] text-xs animate-pulse">_</span>
            </div>

            <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow">
              あなたのアイデアが、次のプロダクトになる
            </h1>
            <p className="text-[#888] text-sm leading-relaxed">
              日常のちょっとした不満、「こんなのあったらいいな」を教えてください。
              <br />
              <span className="text-[#00ffff]">
                みんなで膨らませて、形にして、みんなで育てていく
              </span>
              コミュニティです。
            </p>

            <div className="flex flex-wrap gap-3 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#00ff00] rounded-full"></div>
                <span className="text-[#888]">
                  <span className="text-[#00ff00]">{ideas.length}</span>{" "}
                  アイデア投稿済み
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#ffaa00] rounded-full"></div>
                <span className="text-[#888]">
                  <span className="text-[#ffaa00]">EBR</span> トークン報酬あり
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#00ffff] rounded-full"></div>
                <span className="text-[#888]">
                  技術知識<span className="text-[#00ffff]">不要</span>
                </span>
              </div>
            </div>

            {/* Primary CTA button */}
            <div className="mt-5">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00ff00] to-[#00ffff] text-[#000] font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {showForm ? "フォームを閉じる" : "アイデアを投稿する"}
              </button>
            </div>
          </div>

          {/* Idea Submission Form - Collapsible */}
          {showForm && (
            <div className="terminal-box p-4 sm:p-6 mb-6 animate-fade-in-up">
              <h2 className="text-[#00ffff] text-sm mb-4">
                <span className="text-[#555]">$ </span>new Idea()
              </h2>

              {submitted ? (
                <div className="border border-[#00ff00]/30 bg-[#00ff00]/5 p-4">
                  <p className="text-[#00ff00] text-sm mb-2">
                    アイデアを受け付けました
                  </p>
                  <p className="text-[#888] text-xs">
                    チームが定期的にレビューします。
                    採用された場合はEBRトークンを付与します。
                  </p>
                  <p className="text-[#ffaa00] text-xs mt-2">
                    メールアドレスを入力された方には、EBRトークン受け取り用のウォレットアドレスを確認するメールをお送りしました。
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 px-4 py-1.5 text-xs border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10 transition-colors"
                  >
                    $ submit another idea
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-[#555] text-xs mb-1">
                      <span className="text-[#00aa00]">&gt; </span>
                      タイトル *（50文字以内）
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={50}
                      placeholder="例: 町内会の回覧板をデジタル化したい"
                      className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors"
                    />
                    <p className="text-[#333] text-[10px] mt-1 text-right">
                      {title.length}/50
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[#555] text-xs mb-1">
                      <span className="text-[#00aa00]">&gt; </span>
                      カテゴリ
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUBMIT_CATEGORIES.map((cat) => (
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

                  {/* Detail */}
                  <div>
                    <label className="block text-[#555] text-xs mb-1">
                      <span className="text-[#00aa00]">&gt; </span>
                      詳細 *（500文字以内）
                    </label>
                    <textarea
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      required
                      rows={4}
                      maxLength={500}
                      placeholder="どんな問題を解決したいですか？どんなものがあったら嬉しいですか？"
                      className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors resize-vertical"
                    />
                    <p className="text-[#333] text-[10px] mt-1 text-right">
                      {detail.length}/500
                    </p>
                  </div>

                  {/* Nickname & Email in a row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#555] text-xs mb-1">
                        <span className="text-[#00aa00]">&gt; </span>
                        ニックネーム（任意）
                      </label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        maxLength={30}
                        placeholder="anonymous"
                        className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#555] text-xs mb-1">
                        <span className="text-[#00aa00]">&gt; </span>
                        メール（任意・EBR受取用）
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={200}
                        placeholder="you@example.com"
                        className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-sm px-3 py-2 placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="border border-[#ff3333]/30 bg-[#ff3333]/5 px-3 py-2">
                      <p className="text-[#ff3333] text-xs">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !title.trim() || !detail.trim()}
                    className="px-5 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {submitting ? "送信中..." : "$ submit idea"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Ideas List */}
          <div className="terminal-box p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-[#00ff00] text-sm">
                <span className="text-[#555]">$ </span>
                cat IDEAS.md
                <span className="text-[#555] text-xs ml-2">
                  -- みんなのアイデア ({displayIdeas.length}件)
                </span>
              </h2>

              {/* Sort toggle */}
              <div className="flex items-center gap-2 text-[10px]">
                <button
                  onClick={() => setSortMode("likes")}
                  className={`px-2 py-1 border transition-colors ${
                    sortMode === "likes"
                      ? "border-[#00ff00]/40 text-[#00ff00] bg-[#00ff00]/10"
                      : "border-[#1a3a1a] text-[#555] hover:text-[#00ff00]"
                  }`}
                >
                  いいね順
                </button>
                <button
                  onClick={() => setSortMode("newest")}
                  className={`px-2 py-1 border transition-colors ${
                    sortMode === "newest"
                      ? "border-[#00ffff]/40 text-[#00ffff] bg-[#00ffff]/10"
                      : "border-[#1a3a1a] text-[#555] hover:text-[#00ffff]"
                  }`}
                >
                  新着順
                </button>
              </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value)}
                  className="px-2 py-0.5 text-[10px] border transition-colors"
                  style={{
                    borderColor:
                      filterCategory === cat.value ? cat.color : "#1a3a1a",
                    color: filterCategory === cat.value ? cat.color : "#555",
                    backgroundColor:
                      filterCategory === cat.value
                        ? `${cat.color}10`
                        : "transparent",
                  }}
                >
                  {cat.label}
                  {cat.value !== "all" && (
                    <span className="ml-1 opacity-60">
                      ({ideas.filter((i) => i.category === cat.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-[#555] text-xs animate-pulse">
                Loading ideas...
              </div>
            ) : displayIdeas.length === 0 ? (
              <div className="text-[#555] text-xs border border-[#1a3a1a] p-4 text-center">
                {filterCategory !== "all" ? (
                  <>
                    このカテゴリにはまだアイデアがありません。
                    <br />
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setCategory(filterCategory);
                      }}
                      className="text-[#00ff00] mt-2 hover:underline"
                    >
                      最初のアイデアを投稿する
                    </button>
                  </>
                ) : (
                  <>
                    まだアイデアはありません。
                    <br />
                    最初のアイデアを投稿してみましょう。
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {displayIdeas.map((idea, idx) => (
                  <div
                    key={idea.id}
                    className="border border-[#1a3a1a] p-4 hover:border-[#00ff00]/20 transition-colors"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className="text-[10px] px-1.5 py-0.5 border"
                            style={{
                              color: categoryColor(idea.category),
                              borderColor: `${categoryColor(idea.category)}40`,
                            }}
                          >
                            {categoryLabel(idea.category)}
                          </span>
                          <span className="text-[#555] text-[10px]">
                            {timeAgo(idea.createdAt)}
                          </span>
                          {idea.nickname && (
                            <span className="text-[#555] text-[10px]">
                              by {idea.nickname}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-[#00ff00] text-sm mb-1">
                          {idea.title}
                        </h3>

                        {/* Detail */}
                        <p className="text-[#888] text-xs leading-relaxed whitespace-pre-wrap">
                          {idea.detail}
                        </p>
                      </div>

                      {/* Like button */}
                      <button
                        onClick={() => handleLike(idea.id)}
                        disabled={likedIds.has(idea.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-2 border transition-colors flex-shrink-0 ${
                          likedIds.has(idea.id)
                            ? "border-[#00ff00]/40 bg-[#00ff00]/10 text-[#00ff00]"
                            : "border-[#1a3a1a] text-[#555] hover:border-[#00ff00]/30 hover:text-[#00ff00]"
                        }`}
                        aria-label={`いいね (${idea.likes})`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={likedIds.has(idea.id) ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        <span className="text-xs font-bold">{idea.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="terminal-box p-4 sm:p-6 mb-6">
            <h2 className="text-[#00ff00] text-sm mb-4">
              <span className="text-[#555]">$ </span>
              cat FAQ.md
            </h2>

            <div className="space-y-2">
              {FAQ_ITEMS.map((item, index) => (
                <div key={index} className="border border-[#1a3a1a]">
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-[#111] transition-colors"
                  >
                    <span className="text-[#00ffff] text-xs">
                      <span className="text-[#555]">Q: </span>
                      {item.q}
                    </span>
                    <span className="text-[#555] text-xs flex-shrink-0">
                      {openFaq === index ? "[-]" : "[+]"}
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-3 border-t border-[#1a3a1a]">
                      <p className="text-[#888] text-xs leading-relaxed pt-3 pl-4 border-l-2 border-[#00ff00]/30">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <NewsletterCTA />

          {/* CTA bottom */}
          <div className="terminal-box p-4 sm:p-6 text-center">
            <p className="text-[#888] text-xs mb-3">
              アイデアの実現状況は
              <Link
                href="/projects"
                className="text-[#00ff00] hover:text-[#33ff33] transition-colors mx-1"
              >
                ~/projects
              </Link>
              で確認できます
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="px-4 py-1.5 text-xs border border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10 transition-colors"
              >
                $ ls ./projects/
              </Link>
              <Link
                href="/"
                className="px-4 py-1.5 text-xs border border-[#1a3a1a] text-[#555] hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                $ cd ~/
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
