"use client";

import { useEffect, useState } from "react";

interface GitHubData {
  stars: number;
  repos: number;
  followers: number;
}

export default function KPIStats() {
  const [gh, setGh] = useState<GitHubData>({ stars: 0, repos: 0, followers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/yukihamada"),
          fetch("https://api.github.com/users/yukihamada/repos?per_page=100"),
        ]);
        const userData = await userRes.json();
        const reposData = await reposRes.json();
        const totalStars = Array.isArray(reposData)
          ? reposData.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
          : 0;
        setGh({
          stars: totalStars,
          repos: userData.public_repos || 0,
          followers: userData.followers || 0,
        });
      } catch (e) {
        console.error("GitHub fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGitHub();
  }, []);

  const infraStats = [
    {
      label: "API Requests",
      value: "215K",
      sub: "/週 (chatweb.ai)",
      color: "#ffaa00",
      live: true,
    },
    {
      label: "Lambda Version",
      value: "v275",
      sub: "99.99% uptime",
      color: "#00ff00",
      live: true,
    },
    {
      label: "Registered Users",
      value: "210",
      sub: "chatweb.ai",
      color: "#00ffff",
      live: true,
    },
    {
      label: "StayFlow UV",
      value: "1,860",
      sub: "/月",
      color: "#00ff00",
      live: true,
    },
    {
      label: "Edge Functions",
      value: "43",
      sub: "StayFlow",
      color: "#aa66ff",
      live: true,
    },
    {
      label: "BJJ Athletes",
      value: "355",
      sub: "JitsuFlow DB",
      color: "#4488ff",
      live: true,
    },
    {
      label: "GitHub Stars",
      value: loading ? "..." : gh.stars.toLocaleString(),
      sub: `${loading ? "..." : gh.repos} repos`,
      color: "#ffaa00",
      live: true,
    },
    {
      label: "DynamoDB Items",
      value: "30.8K",
      sub: "nanobot-config",
      color: "#ff6688",
      live: true,
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="terminal-box p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#00ff00] text-lg sm:text-xl text-glow">
                Infrastructure KPI
              </h2>
              <p className="text-[#555] text-xs mt-1">
                2026-02-16 時点の実データ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse"></div>
              <span className="text-xs text-[#888]">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {infraStats.map((stat, i) => (
              <div
                key={i}
                className="border border-[#1a3a1a] bg-[#0d0d0d] p-3 hover:border-[#2a4a2a] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#888]">{stat.label}</span>
                  <span className="w-1.5 h-1.5 bg-[#00ff00] rounded-full"></span>
                </div>
                <div className="font-mono text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-[#555] mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1a3a1a] flex items-center justify-between text-[10px] text-[#555]">
            <span>Data sources: AWS CloudWatch, DynamoDB, GitHub API, Supabase</span>
            <span>Updated: 2026-02-16</span>
          </div>
        </div>
      </div>
    </section>
  );
}
