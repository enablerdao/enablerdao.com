"use client";

import { useState, useEffect, useCallback } from "react";

// --- Agent definitions ---

interface AgentDef {
  name: string;
  emoji: string;
  role: string;
  description: string;
  model: string;
  skills: string[];
  color: string;
  healthUrl: string;
  homeUrl: string;
  pack: "dog" | "claw";
}

const DOG_AGENTS: AgentDef[] = [
  {
    name: "Bossdog",
    emoji: "\u{1F415}",
    role: "Project Lead",
    description:
      "プロジェクト統括犬。全プロダクトを見守り、コード品質の管理と自動デプロイを司るボス。",
    model: "Claude Opus",
    skills: ["コードレビュー", "自動デプロイ", "品質管理", "プロダクト統括"],
    color: "#00ff00",
    healthUrl: "https://rustdog-spin.fly.dev/health",
    homeUrl: "https://rustdog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Motherdog",
    emoji: "\u{1F9AE}",
    role: "Community Care",
    description:
      "コミュニティケア犬。新メンバーのオンボーディング、質問対応、温かいDAOコミュニティ作りを担当。",
    model: "Claude Sonnet",
    skills: ["オンボーディング", "質問対応", "コミュニティ運営", "多言語対応"],
    color: "#f472b6",
    healthUrl: "https://motherdog-spin.fly.dev/health",
    homeUrl: "https://motherdog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Guarddog",
    emoji: "\u{1F6E1}\u{FE0F}",
    role: "Security",
    description:
      "セキュリティ番犬。全プロダクトの脆弱性チェック、OWASP Top 10対策、依存関係の監査を担当。",
    model: "Gemini 2.5 Pro",
    skills: ["脆弱性スキャン", "OWASP対策", "依存関係監査", "シークレット検出"],
    color: "#ff4444",
    healthUrl: "https://guarddog-spin.fly.dev/health",
    homeUrl: "https://guarddog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Debugdog",
    emoji: "\u{1F50D}",
    role: "Bug Hunter",
    description:
      "バグハンター犬。全プロダクトのバグ追跡、スタックトレース解析、エラーの根本原因分析を担当。",
    model: "Qwen3 Coder 72B",
    skills: ["バグ追跡", "スタックトレース解析", "根本原因分析", "パフォーマンス診断"],
    color: "#ffaa00",
    healthUrl: "https://debugdog-spin.fly.dev/health",
    homeUrl: "https://debugdog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Chatwebdog",
    emoji: "\u{1F4AC}",
    role: "Chatweb.ai",
    description:
      "Chatweb.ai専門犬。Rust Lambda最適化、ストリーミング改善、マルチモデル対応を担当。",
    model: "Qwen3 Coder 72B",
    skills: ["Rust Lambda", "ストリーミング", "マルチモデル", "API設計"],
    color: "#06b6d4",
    healthUrl: "https://chatwebdog-spin.fly.dev/health",
    homeUrl: "https://chatwebdog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Jiuflowdog",
    emoji: "\u{1F94B}",
    role: "JiuFlow",
    description:
      "JiuFlow専門犬。柔術アートプラットフォームのRust SSR改善、アスリートプロフィール充実を担当。",
    model: "Qwen3 Coder 72B",
    skills: ["Rust SSR", "アスリートDB", "ビジュアル", "Supabase"],
    color: "#f59e0b",
    healthUrl: "https://jiuflowdog-spin.fly.dev/health",
    homeUrl: "https://jiuflowdog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Bantodog",
    emoji: "\u{1F4CA}",
    role: "BANTO",
    description:
      "BANTO専門犬。ビジネス管理ツールのHono/Drizzle最適化、ダッシュボードUI向上を担当。",
    model: "Qwen3 Coder 72B",
    skills: ["Hono/Drizzle", "PostgreSQL", "ダッシュボード", "レポート"],
    color: "#10b981",
    healthUrl: "https://bantodog-spin.fly.dev/health",
    homeUrl: "https://bantodog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Guidedog",
    emoji: "\u{1F4DA}",
    role: "Learning Guide",
    description:
      "学習ガイド犬。OSSコントリビュートの方法、プログラミング初心者の学習支援を担当。",
    model: "Nemotron 9B",
    skills: ["プログラミング指導", "OSS貢献ガイド", "チュートリアル作成", "コード解説"],
    color: "#00ffff",
    healthUrl: "https://guidedog-spin.fly.dev/health",
    homeUrl: "https://guidedog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Stayflowdog",
    emoji: "\u{1F3E0}",
    role: "StayFlow",
    description:
      "StayFlow専門犬。不動産管理SaaSの機能改善、予約フロー最適化を担当。",
    model: "Nemotron 9B",
    skills: ["予約最適化", "Supabase", "React UI", "不動産管理"],
    color: "#8b5cf6",
    healthUrl: "https://stayflowdog-spin.fly.dev/health",
    homeUrl: "https://stayflowdog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Eliodog",
    emoji: "\u{1F31F}",
    role: "Elio",
    description:
      "Elio専門犬。P2P分散推論のSwift実装改善、EBRトークンゲート、PIIフィルタを担当。",
    model: "Nemotron 9B",
    skills: ["Swift/iOS", "P2P推論", "Solana", "プライバシー"],
    color: "#ec4899",
    healthUrl: "https://eliodog-spin.fly.dev/health",
    homeUrl: "https://eliodog-spin.fly.dev/",
    pack: "dog",
  },
  {
    name: "Supportdog",
    emoji: "\u{1F3E5}",
    role: "Customer Support",
    description:
      "カスタマーサポート犬。全プロダクトのユーザーからの質問対応、トラブルシューティングを担当。",
    model: "Nemotron 9B",
    skills: ["質問対応", "トラブルシュート", "ユーザーガイド", "フィードバック"],
    color: "#ef4444",
    healthUrl: "https://supportdog-spin.fly.dev/health",
    homeUrl: "https://supportdog-spin.fly.dev/",
    pack: "dog",
  },
];

const CLAW_AGENTS: AgentDef[] = [
  {
    name: "CodeClaw",
    emoji: "\u{1F980}",
    role: "Code Quality Patrol",
    description:
      "コード品質パトロール。PRレビュー、コード規約チェック、リファクタリング提案を自動実行。",
    model: "Claude Sonnet",
    skills: ["PRレビュー", "コード規約", "リファクタリング", "テスト生成"],
    color: "#ff6644",
    healthUrl: "http://46.225.236.254:3000/healthz",
    homeUrl: "http://46.225.236.254:3000/",
    pack: "claw",
  },
  {
    name: "SecClaw",
    emoji: "\u{1F512}",
    role: "Security Patrol",
    description:
      "セキュリティパトロール。依存関係の脆弱性スキャン、シークレット漏洩検出、SAST解析を自動実行。",
    model: "Claude Sonnet",
    skills: ["脆弱性スキャン", "シークレット検出", "SAST", "依存関係監査"],
    color: "#ffcc00",
    healthUrl: "http://46.225.134.252:3000/healthz",
    homeUrl: "http://46.225.134.252:3000/",
    pack: "claw",
  },
  {
    name: "DevOpsClaw",
    emoji: "\u{2699}\u{FE0F}",
    role: "DevOps Patrol",
    description:
      "DevOpsパトロール。CI/CDパイプライン監視、インフラ設定チェック、デプロイ自動化を担当。",
    model: "Claude Sonnet",
    skills: ["CI/CD監視", "インフラ設定", "デプロイ自動化", "コスト最適化"],
    color: "#44aaff",
    healthUrl: "http://46.225.77.119:3000/healthz",
    homeUrl: "http://46.225.77.119:3000/",
    pack: "claw",
  },
];

type HealthStatus = "loading" | "online" | "offline" | "error";

interface AgentWithStatus extends AgentDef {
  status: HealthStatus;
  mumble?: string;
}

function StatusBadge({ status }: { status: HealthStatus }) {
  const config = {
    loading: {
      text: "[CHECKING]",
      textColor: "text-[#555]",
      borderColor: "border-[#333]",
      dotColor: "bg-[#555]",
      animate: true,
    },
    online: {
      text: "[ONLINE]",
      textColor: "text-[#00ff00]",
      borderColor: "border-[#1a3a1a]",
      dotColor: "bg-[#00ff00]",
      animate: true,
    },
    offline: {
      text: "[OFFLINE]",
      textColor: "text-[#ff4444]",
      borderColor: "border-[#3a1a1a]",
      dotColor: "bg-[#ff4444]",
      animate: false,
    },
    error: {
      text: "[ERROR]",
      textColor: "text-[#ffaa00]",
      borderColor: "border-[#3a3a1a]",
      dotColor: "bg-[#ffaa00]",
      animate: false,
    },
  }[status];

  return (
    <span
      className={`text-[10px] px-2 py-0.5 border ${config.textColor} ${config.borderColor} flex items-center gap-1.5`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${
          config.animate ? "animate-pulse" : ""
        }`}
      />
      {config.text}
    </span>
  );
}

function AgentCard({ agent }: { agent: AgentWithStatus }) {
  const isClaw = agent.pack === "claw";

  return (
    <div className="terminal-box card-hover p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{agent.emoji}</span>
          <div>
            <h2
              className="text-base font-bold"
              style={{ color: agent.color }}
            >
              {agent.name}
            </h2>
            <span className="text-[10px] text-[#555]">{agent.role}</span>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Model */}
      <div className="mb-2">
        <span className="text-[10px] text-[#555]">model: </span>
        <span className="text-[10px] text-[#00ffff]">{agent.model}</span>
      </div>

      {/* Mumble (thinking aloud) */}
      {agent.mumble && (
        <div className="mb-2 px-2 py-1.5 bg-[#0d1117] border border-[#1a3a1a] rounded text-[11px] text-[#888] italic">
          <span className="not-italic">{agent.emoji}</span> {agent.mumble}
        </div>
      )}

      {/* Description */}
      <p className="text-[#888] text-xs leading-relaxed mb-4 flex-1">
        {agent.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {agent.skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-0.5 border border-[#1a1a1a] text-[#555]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Link */}
      <a
        href={agent.homeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
      >
        <span className="text-[#00aa00]">$ </span>
        curl {isClaw ? agent.healthUrl.replace("http://", "").replace("/healthz", "/healthz") : agent.healthUrl.replace("https://", "").replace("/health", "/health")}
      </a>
    </div>
  );
}

export default function AgentStatusGrid() {
  const [dogStatuses, setDogStatuses] = useState<AgentWithStatus[]>(
    DOG_AGENTS.map((a) => ({ ...a, status: "loading" as HealthStatus }))
  );
  const [clawStatuses, setClawStatuses] = useState<AgentWithStatus[]>(
    CLAW_AGENTS.map((a) => ({ ...a, status: "loading" as HealthStatus }))
  );

  const checkHealth = useCallback(async () => {
    // Check dogs (try CORS first for mumble, fallback to no-cors)
    const dogResults = await Promise.allSettled(
      DOG_AGENTS.map(async (agent): Promise<{ status: HealthStatus; mumble?: string }> => {
        try {
          // Try with CORS to get JSON (mumble)
          const res = await fetch(agent.healthUrl, {
            signal: AbortSignal.timeout(5000),
          });
          if (res.ok) {
            const data = await res.json();
            return { status: "online", mumble: data.mumble || undefined };
          }
          return { status: "offline" };
        } catch {
          // Fallback: no-cors (opaque = online but no mumble)
          try {
            const res = await fetch(agent.healthUrl, {
              signal: AbortSignal.timeout(5000),
              mode: "no-cors",
            });
            return { status: res.type === "opaque" ? "online" : "offline" };
          } catch {
            return { status: "offline" };
          }
        }
      })
    );

    setDogStatuses(
      DOG_AGENTS.map((agent, i) => ({
        ...agent,
        status:
          dogResults[i].status === "fulfilled"
            ? dogResults[i].value.status
            : "error",
        mumble:
          dogResults[i].status === "fulfilled"
            ? dogResults[i].value.mumble
            : undefined,
      }))
    );

    // Check claws
    const clawResults = await Promise.allSettled(
      CLAW_AGENTS.map(async (agent) => {
        try {
          const res = await fetch(agent.healthUrl, {
            signal: AbortSignal.timeout(5000),
            mode: "no-cors",
          });
          return res.type === "opaque" || res.ok ? "online" : "offline";
        } catch {
          return "offline";
        }
      })
    );

    setClawStatuses(
      CLAW_AGENTS.map((agent, i) => ({
        ...agent,
        status:
          clawResults[i].status === "fulfilled"
            ? (clawResults[i].value as HealthStatus)
            : "error",
      }))
    );
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const dogOnline = dogStatuses.filter((a) => a.status === "online").length;
  const clawOnline = clawStatuses.filter((a) => a.status === "online").length;

  return (
    <div>
      {/* Summary bar */}
      <div className="terminal-box p-3 mb-6">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <span className="text-[#555]">total_agents: </span>
            <span className="text-[#00ff00] font-bold">
              {DOG_AGENTS.length + CLAW_AGENTS.length}
            </span>
          </div>
          <div>
            <span className="text-[#555]">dogs_online: </span>
            <span className="text-[#00ff00] font-bold">
              {dogOnline}/{DOG_AGENTS.length}
            </span>
          </div>
          <div>
            <span className="text-[#555]">claws_online: </span>
            <span className="text-[#ff6644] font-bold">
              {clawOnline}/{CLAW_AGENTS.length}
            </span>
          </div>
          <button
            onClick={checkHealth}
            className="ml-auto text-[10px] text-[#555] hover:text-[#00ffff] transition-colors"
          >
            $ refresh
          </button>
        </div>
      </div>

      {/* Dog Pack Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#00ff00] mb-1 flex items-center gap-2">
          <span className="text-2xl">{"\u{1F415}"}</span>
          Dog Pack
        </h2>
        <p className="text-[#555] text-xs mb-4">
          11 Rust/WASM agents on Fly.io | Fermyon Spin runtime
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogStatuses.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </div>

      {/* Claw Pack Section */}
      <div>
        <h2 className="text-lg font-bold text-[#ff6644] mb-1 flex items-center gap-2">
          <span className="text-2xl">{"\u{1F980}"}</span>
          Claw Pack
        </h2>
        <p className="text-[#555] text-xs mb-4">
          3 OpenClaw agents on Hetzner VPS | Claude Sonnet powered
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clawStatuses.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
