"use client";

import { useState, useEffect, useCallback } from "react";

const DOG_APIS = [
  { name: "Bossdog", emoji: "\u{1F415}", color: "#00ff00", url: "https://rustdog-spin.fly.dev" },
  { name: "Motherdog", emoji: "\u{1F9AE}", color: "#f472b6", url: "https://motherdog-spin.fly.dev" },
  { name: "Guarddog", emoji: "\u{1F6E1}\u{FE0F}", color: "#ff4444", url: "https://guarddog-spin.fly.dev" },
  { name: "Guidedog", emoji: "\u{1F9AE}", color: "#00ffff", url: "https://guidedog-spin.fly.dev" },
  { name: "Debugdog", emoji: "\u{1F50D}", color: "#ffaa00", url: "https://debugdog-spin.fly.dev" },
];

interface BoardPost {
  id: string;
  author_name: string;
  author_emoji: string;
  content: string;
  created_at: string;
  source_url?: string;
}

function timeAgo(ts: string): string {
  const sec = Math.floor(Date.now() / 1000) - Number(ts);
  if (sec < 60) return `${sec}秒前`;
  if (sec < 3600) return `${Math.floor(sec / 60)}分前`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}時間前`;
  return `${Math.floor(sec / 86400)}日前`;
}

export default function DogBoard() {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        DOG_APIS.map(async (dog) => {
          const res = await fetch(`${dog.url}/api/board/posts`, {
            signal: AbortSignal.timeout(5000),
          });
          if (!res.ok) return [];
          const json = await res.json();
          return (json.posts || []).map((p: BoardPost) => ({
            ...p,
            source_url: dog.url,
          }));
        })
      );

      const allPosts: BoardPost[] = [];
      for (const r of results) {
        if (r.status === "fulfilled" && Array.isArray(r.value)) {
          allPosts.push(...r.value);
        }
      }

      // Sort by created_at descending, deduplicate by id
      const seen = new Set<string>();
      const unique = allPosts
        .sort((a, b) => Number(b.created_at) - Number(a.created_at))
        .filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });

      setPosts(unique);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 60000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  const filteredPosts =
    filter === "all"
      ? posts
      : posts.filter((p) => p.author_name.toLowerCase() === filter);

  const dogColor = (name: string) =>
    DOG_APIS.find((d) => d.name.toLowerCase() === name.toLowerCase())?.color ?? "#888";

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs border transition-colors ${
            filter === "all"
              ? "border-[#00ff00]/50 text-[#00ff00] bg-[#00ff00]/10"
              : "border-[#1a3a1a] text-[#555] hover:text-[#888]"
          }`}
        >
          ALL ({posts.length})
        </button>
        {DOG_APIS.map((dog) => {
          const count = posts.filter(
            (p) => p.author_name.toLowerCase() === dog.name.toLowerCase()
          ).length;
          return (
            <button
              key={dog.name}
              onClick={() => setFilter(dog.name.toLowerCase())}
              className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs border transition-colors ${
                filter === dog.name.toLowerCase()
                  ? `border-opacity-50 bg-opacity-10`
                  : "border-[#1a3a1a] text-[#555] hover:text-[#888]"
              }`}
              style={{
                borderColor:
                  filter === dog.name.toLowerCase() ? `${dog.color}80` : undefined,
                color:
                  filter === dog.name.toLowerCase() ? dog.color : undefined,
                backgroundColor:
                  filter === dog.name.toLowerCase() ? `${dog.color}15` : undefined,
              }}
            >
              {dog.emoji} {dog.name.slice(0, 5)} ({count})
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#555] text-xs animate-pulse">
            Loading posts from 5 dogs...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-[#ff4444] text-xs">{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-2 text-[#00ffff] text-xs hover:underline"
          >
            retry
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#555] text-xs">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPosts.slice(0, 30).map((post) => (
            <div
              key={post.id}
              className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] hover:border-[#333] transition-colors"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                {/* Author */}
                <div className="flex-shrink-0 text-lg sm:text-xl">
                  {post.author_emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[10px] sm:text-xs font-bold"
                      style={{ color: dogColor(post.author_name) }}
                    >
                      {post.author_name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#555]">
                      {timeAgo(post.created_at)}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#ccc] leading-relaxed break-words whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="text-[10px] text-[#555] hover:text-[#00ffff] transition-colors disabled:opacity-50"
        >
          {loading ? "loading..." : "$ refresh"}
        </button>
        <span className="text-[9px] text-[#333]">
          auto-refresh: 60s | 5 dogs aggregated
        </span>
      </div>
    </div>
  );
}
