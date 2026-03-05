"use client";

import { useState, useId } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("登録完了！ウェルカムメールをご確認ください。");
        setEmail("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== "undefined" && (window as any).plausible) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).plausible("Newsletter Signup");
        }
      } else {
        setStatus("error");
        setMessage(data.error || "エラーが発生しました。");
      }
    } catch (_error) {
      setStatus("error");
      setMessage("通信エラーが発生しました。");
    }
  };

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="py-12 sm:py-16 border-t border-[#1a3a1a]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="terminal-box p-6 sm:p-8 text-center">
          <div className="max-w-2xl mx-auto">
            {/* Terminal prompt */}
            <div className="flex items-center justify-center gap-2 mb-4 text-xs" aria-hidden="true">
              <span className="text-[#555]">enablerdao@web3:~$</span>
              <span className="text-[#00ff00]">subscribe --newsletter</span>
            </div>

            <h2
              id="newsletter-heading"
              className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow"
            >
              最新情報を受け取る
            </h2>
            <p className="text-[#888] text-sm mb-6">
              新プロダクトのリリース、限定オファー、技術記事を週1回配信。
              <br className="hidden sm:block" />
              <span className="text-[#00ffff]">登録者限定で初回10%オフクーポン進呈</span>
            </p>

            {/* Live region: screen readers announce status changes */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {status === "success" && message}
              {status === "error" && message}
            </div>

            {status === "success" ? (
              <div
                role="alert"
                className="bg-[#00ff00]/10 border border-[#00ff00]/30 p-4 text-[#00ff00] text-sm rounded"
              >
                <p>✓ {message}</p>
                <p className="text-xs text-[#888] mt-2">
                  クーポンコード:{" "}
                  <span className="text-[#00ffff] font-bold select-all">ENABLER10</span>
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                noValidate
              >
                <label htmlFor={inputId} className="sr-only">
                  メールアドレス
                </label>
                <input
                  id={inputId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={status === "loading"}
                  aria-describedby={status === "error" ? "newsletter-error" : undefined}
                  className="flex-1 px-4 py-2.5 bg-[#0d0d0d] border border-[#1a3a1a] text-[#e9e9ee] text-sm focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 disabled:opacity-50 rounded-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-busy={status === "loading"}
                  className="px-6 py-2.5 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 active:bg-[#00ff00]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm min-w-[88px]"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-pulse" aria-hidden="true">_</span>
                      送信中...
                    </span>
                  ) : (
                    "登録する"
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <p id="newsletter-error" role="alert" className="text-[#ff3333] text-xs mt-3">
                {message}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 mt-4 text-[#555] text-xs" aria-label="ニュースレターの特徴">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                週1回のみ
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                いつでも解除可
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                スパムなし
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
