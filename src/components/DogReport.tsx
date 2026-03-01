"use client";

import { useState, useEffect, useCallback } from "react";

const DOGS = [
  // Core pack
  { name: "Bossdog", emoji: "\u{1F415}", color: "#00ff00", role: "Project Lead", url: "https://rustdog-spin.fly.dev" },
  { name: "Motherdog", emoji: "\u{1F9AE}", color: "#f472b6", role: "Community Care", url: "https://motherdog-spin.fly.dev" },
  { name: "Guarddog", emoji: "\u{1F6E1}\u{FE0F}", color: "#ff4444", role: "Security", url: "https://guarddog-spin.fly.dev" },
  { name: "Guidedog", emoji: "\u{1F9AE}", color: "#00ffff", role: "Learning Guide", url: "https://guidedog-spin.fly.dev" },
  { name: "Debugdog", emoji: "\u{1F50D}", color: "#ffaa00", role: "Bug Hunter", url: "https://debugdog-spin.fly.dev" },
  // Project-specific dogs
  { name: "Stayflowdog", emoji: "\u{1F3E0}", color: "#8b5cf6", role: "StayFlow", url: "https://stayflowdog-spin.fly.dev" },
  { name: "Chatwebdog", emoji: "\u{1F4AC}", color: "#06b6d4", role: "Chatweb.ai", url: "https://chatwebdog-spin.fly.dev" },
  { name: "Jiuflowdog", emoji: "\u{1F94B}", color: "#f59e0b", role: "JiuFlow", url: "https://jiuflowdog-spin.fly.dev" },
  { name: "Bantodog", emoji: "\u{1F4CA}", color: "#10b981", role: "BANTO", url: "https://bantodog-spin.fly.dev" },
  { name: "Eliodog", emoji: "\u{1F31F}", color: "#ec4899", role: "Elio", url: "https://eliodog-spin.fly.dev" },
  { name: "Supportdog", emoji: "\u{1F3E5}", color: "#ef4444", role: "Support", url: "https://supportdog-spin.fly.dev" },
];

interface DogStatus {
  name: string;
  emoji: string;
  color: string;
  role: string;
  url: string;
  online: boolean;
  version?: string;
  blogCount: number;
  boardCount: number;
  latestBlog?: string;
  latestBoard?: string;
}

export default function DogReport() {
  const [statuses, setStatuses] = useState<DogStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled(
      DOGS.map(async (dog) => {
        const status: DogStatus = {
          ...dog,
          online: false,
          blogCount: 0,
          boardCount: 0,
        };

        try {
          // Health
          const health = await fetch(`${dog.url}/health`, { signal: AbortSignal.timeout(8000) });
          if (health.ok) {
            const h = await health.json();
            status.online = h.status === "ok";
            status.version = h.version;
          }
        } catch { /* offline */ }

        try {
          // Blog
          const blog = await fetch(`${dog.url}/api/blog/posts`, { signal: AbortSignal.timeout(8000) });
          if (blog.ok) {
            const b = await blog.json();
            status.blogCount = b.count || 0;
            if (b.posts?.[0]?.title) status.latestBlog = b.posts[0].title;
          }
        } catch { /* skip */ }

        try {
          // Board
          const board = await fetch(`${dog.url}/api/board/posts`, { signal: AbortSignal.timeout(8000) });
          if (board.ok) {
            const bd = await board.json();
            status.boardCount = bd.posts?.length || 0;
            if (bd.posts?.[0]?.content) {
              status.latestBoard = bd.posts[0].content.slice(0, 60) + (bd.posts[0].content.length > 60 ? "..." : "");
            }
          }
        } catch { /* skip */ }

        return status;
      })
    );

    const all: DogStatus[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") all.push(r.value);
    }
    setStatuses(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 120000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const totalBlogs = statuses.reduce((a, s) => a + s.blogCount, 0);
  const totalBoards = statuses.reduce((a, s) => a + s.boardCount, 0);
  const onlineCount = statuses.filter((s) => s.online).length;

  if (loading) {
    return (
      <div className="text-center py-6">
        <p className="text-[#555] text-xs animate-pulse">Fetching status from {DOGS.length} AI dogs...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="border border-[#1a3a1a] p-3">
          <div className="text-[#555] text-[10px] uppercase tracking-wider">Dogs Online</div>
          <div className={`text-2xl font-bold ${onlineCount === DOGS.length ? "text-[#00ff00]" : "text-[#ffaa00]"}`}>
            {onlineCount}/{DOGS.length}
          </div>
        </div>
        <div className="border border-[#1a3a1a] p-3">
          <div className="text-[#555] text-[10px] uppercase tracking-wider">Blog Posts</div>
          <div className="text-2xl font-bold text-[#00ffff]">{totalBlogs}</div>
        </div>
        <div className="border border-[#1a3a1a] p-3">
          <div className="text-[#555] text-[10px] uppercase tracking-wider">Board Posts</div>
          <div className="text-2xl font-bold text-[#00ffff]">{totalBoards}</div>
        </div>
      </div>

      {/* Per-dog status */}
      <div className="space-y-2">
        {statuses.map((s) => (
          <div key={s.name} className="flex items-center gap-3 p-2 border border-[#1a3a1a] hover:border-[#333] transition-colors">
            <span className="text-lg flex-shrink-0">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold" style={{ color: s.color }}>{s.name}</span>
                <span className="text-[9px] text-[#555]">{s.role}</span>
                {s.version && <span className="text-[9px] text-[#333]">v{s.version}</span>}
              </div>
              {s.latestBlog && (
                <p className="text-[10px] text-[#666] truncate mt-0.5">
                  Latest: {s.latestBlog}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-[10px]">
              <span className="text-[#888]">{s.blogCount} blog</span>
              <span className="text-[#888]">{s.boardCount} board</span>
              <span className={`w-2 h-2 rounded-full ${s.online ? "bg-[#00ff00]" : "bg-[#ff4444] animate-pulse"}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Refresh */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={fetchAll}
          disabled={loading}
          className="text-[10px] text-[#555] hover:text-[#00ffff] transition-colors disabled:opacity-50"
        >
          {loading ? "loading..." : "$ refresh"}
        </button>
        <span className="text-[9px] text-[#333]">auto-refresh: 120s</span>
      </div>
    </div>
  );
}
