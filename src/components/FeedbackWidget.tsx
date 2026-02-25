"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "enablerdao_feedback_submitted";
const SUPPRESS_DAYS = 30;

export default function FeedbackWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ts = parseInt(raw, 10);
        if (Date.now() - ts < SUPPRESS_DAYS * 24 * 60 * 60 * 1000) return;
      }
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (score === null) return;
    setStatus("loading");
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          comment: comment.trim(),
          page: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
    } catch (err) {
      console.error("[FeedbackWidget] submit error:", err);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).plausible) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).plausible('Feedback Submit', { props: { score: score } });
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
    setStatus("done");
    setTimeout(() => {
      setOpen(false);
      setVisible(false);
    }, 1500);
  }, [score, comment]);

  if (!visible) return null;

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="フィードバックを送る"
          className="fixed bottom-5 right-5 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-[#0a0a0a] border border-[#1a3a1a] text-lg shadow-lg hover:border-[#00ff00]/60 hover:shadow-[0_0_12px_rgba(0,255,0,0.15)] transition-all cursor-pointer"
        >
          <span role="img" aria-hidden="true">💬</span>
        </button>
      )}

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Modal */}
          <div
            className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-[#0a0a0a] border border-[#1a3a1a] shadow-[0_0_24px_rgba(0,255,0,0.08)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-[#555] hover:text-[#00ff00] transition-colors text-sm cursor-pointer"
              aria-label="閉じる"
            >
              ✕
            </button>

            {status === "done" ? (
              <div className="text-center py-6">
                <p className="text-[#00ff00] text-sm text-glow">
                  ありがとうございます！
                </p>
              </div>
            ) : (
              <>
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 text-xs">
                  <span className="text-[#555]">enablerdao@web3:~$</span>
                  <span className="text-[#00ff00]">feedback --nps</span>
                </div>

                {/* NPS score */}
                <p className="text-[#888] text-xs mb-2">
                  EnablerDAOを友人に勧める可能性は？
                </p>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 11 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setScore(i)}
                      className={`flex-1 py-1.5 text-xs border cursor-pointer transition-colors ${
                        score === i
                          ? "bg-[#00ff00]/20 border-[#00ff00]/60 text-[#00ff00]"
                          : "bg-[#0d0d0d] border-[#1a3a1a] text-[#555] hover:border-[#00ff00]/30 hover:text-[#888]"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-[#555] mb-4 -mt-2">
                  <span>全く勧めない</span>
                  <span>強く勧める</span>
                </div>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="何か改善点はありますか？"
                  rows={2}
                  maxLength={500}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#1a3a1a] text-[#e9e9ee] text-sm placeholder-[#555] focus:outline-none focus:border-[#00ff00]/50 resize-none mb-4"
                />

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={score === null || status === "loading"}
                  className="w-full py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-pulse">_</span>
                      送信中...
                    </span>
                  ) : (
                    "送信する"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
