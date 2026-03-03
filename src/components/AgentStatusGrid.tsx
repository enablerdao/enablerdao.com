"use client";

import { useState, useEffect, useCallback } from "react";

// --- Agent definitions ---

interface AgentDef {
  name: string;
  emoji: string;
  role: string;
  description: string;
  skills: string[];
  color: string;
  healthUrl: string;
  homeUrl: string;
  pack: "dog" | "claw";
  telegramBot?: string;
}

const DOG_AGENTS: AgentDef[] = [
  {
    name: "Bossdog",
    emoji: "\u{1F415}",
    role: "Project Lead",
    description:
      "プロジェクト統括犬。全プロダクトを見守り、コード品質管理・自動デプロイ・トークンエコノミーを統括するボス。",
    skills: ["コードレビュー", "自動デプロイ", "品質管理", "トークン経済"],
    color: "#00ff00",
    healthUrl: "https://rustdog-spin.fly.dev/health",
    homeUrl: "https://rustdog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "Enabler_Bossdog_bot",
  },
  {
    name: "Motherdog",
    emoji: "\u{1F9AE}",
    role: "Community Care",
    description:
      "コミュニティケア犬。新メンバーのオンボーディング、質問対応、温かいDAOコミュニティ作りを担当。",
    skills: ["オンボーディング", "質問対応", "コミュニティ運営", "多言語対応"],
    color: "#f472b6",
    healthUrl: "https://motherdog-spin.fly.dev/health",
    homeUrl: "https://motherdog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "motherdog_enabler_bot",
  },
  {
    name: "Guarddog",
    emoji: "\u{1F6E1}\u{FE0F}",
    role: "Security",
    description:
      "セキュリティ番犬。全プロダクトの脆弱性チェック、OWASP Top 10対策、依存関係の監査を担当。",
    skills: ["脆弱性スキャン", "OWASP対策", "依存関係監査", "シークレット検出"],
    color: "#ff4444",
    healthUrl: "https://guarddog-spin.fly.dev/health",
    homeUrl: "https://guarddog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "guarddog_enabler_bot",
  },
  {
    name: "Debugdog",
    emoji: "\u{1F50D}",
    role: "Bug Hunter",
    description:
      "バグハンター犬。全プロダクトのバグ追跡、スタックトレース解析、エラーの根本原因分析を担当。",
    skills: ["バグ追跡", "スタックトレース解析", "根本原因分析", "パフォーマンス診断"],
    color: "#ffaa00",
    healthUrl: "https://debugdog-spin.fly.dev/health",
    homeUrl: "https://debugdog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "debugdog_enabler_bot",
  },
  {
    name: "Chatwebdog",
    emoji: "\u{1F4AC}",
    role: "Chatweb.ai",
    description:
      "Chatweb.ai専門犬。Rust Lambda最適化、ストリーミング改善、マルチモデル対応を担当。",
    skills: ["Rust Lambda", "ストリーミング", "マルチモデル", "API設計"],
    color: "#06b6d4",
    healthUrl: "https://chatwebdog-spin.fly.dev/health",
    homeUrl: "https://chatwebdog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "chatwebdog_enabler_bot",
  },
  {
    name: "Jiuflowdog",
    emoji: "\u{1F94B}",
    role: "JiuFlow",
    description:
      "JiuFlow専門犬。柔術アートプラットフォームのRust SSR改善、アスリートプロフィール充実を担当。",
    skills: ["Rust SSR", "アスリートDB", "ビジュアル", "Supabase"],
    color: "#f59e0b",
    healthUrl: "https://jiuflowdog-spin.fly.dev/health",
    homeUrl: "https://jiuflowdog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "jiuflowdog_enabler_bot",
  },
  {
    name: "Bantodog",
    emoji: "\u{1F4CA}",
    role: "BANTO",
    description:
      "BANTO専門犬。ビジネス管理ツールのHono/Drizzle最適化、ダッシュボードUI向上を担当。",
    skills: ["Hono/Drizzle", "PostgreSQL", "ダッシュボード", "レポート"],
    color: "#10b981",
    healthUrl: "https://bantodog-spin.fly.dev/health",
    homeUrl: "https://bantodog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "bantodog_enabler_bot",
  },
  {
    name: "Guidedog",
    emoji: "\u{1F4DA}",
    role: "Learning Guide",
    description:
      "学習ガイド犬。OSSコントリビュートの方法、プログラミング初心者の学習支援を担当。",
    skills: ["プログラミング指導", "OSS貢献ガイド", "チュートリアル作成", "コード解説"],
    color: "#00ffff",
    healthUrl: "https://guidedog-spin.fly.dev/health",
    homeUrl: "https://guidedog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "guidedog_enabler_bot",
  },
  {
    name: "Stayflowdog",
    emoji: "\u{1F3E0}",
    role: "StayFlow",
    description:
      "StayFlow専門犬。不動産管理SaaSの機能改善、予約フロー最適化を担当。",
    skills: ["予約最適化", "Supabase", "React UI", "不動産管理"],
    color: "#8b5cf6",
    healthUrl: "https://stayflowdog-spin.fly.dev/health",
    homeUrl: "https://stayflowdog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "stayflowdog_enabler_bot",
  },
  {
    name: "Eliodog",
    emoji: "\u{1F31F}",
    role: "Elio",
    description:
      "Elio専門犬。P2P分散推論のSwift実装改善、EBRトークンゲート、PIIフィルタを担当。",
    skills: ["Swift/iOS", "P2P推論", "Solana", "プライバシー"],
    color: "#ec4899",
    healthUrl: "https://eliodog-spin.fly.dev/health",
    homeUrl: "https://eliodog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "eliodog_enabler_bot",
  },
  {
    name: "Supportdog",
    emoji: "\u{1F3E5}",
    role: "Customer Support",
    description:
      "カスタマーサポート犬。全プロダクトのユーザーからの質問対応、トラブルシューティングを担当。",
    skills: ["質問対応", "トラブルシュート", "ユーザーガイド", "フィードバック"],
    color: "#ef4444",
    healthUrl: "https://supportdog-spin.fly.dev/health",
    homeUrl: "https://supportdog-spin.fly.dev/",
    pack: "dog",
    telegramBot: "supportdog_enabler_bot",
  },
];

const CLAW_AGENTS: AgentDef[] = [
  {
    name: "CodeClaw",
    emoji: "\u{1F980}",
    role: "Code Quality Patrol",
    description:
      "コード品質パトロール。PRレビュー、コード規約チェック、リファクタリング提案を自動実行。",
    skills: ["PRレビュー", "コード規約", "リファクタリング", "テスト生成"],
    color: "#ff6644",
    healthUrl: "",
    homeUrl: "",
    pack: "claw",
  },
  {
    name: "SecClaw",
    emoji: "\u{1F512}",
    role: "Security Patrol",
    description:
      "セキュリティパトロール。依存関係の脆弱性スキャン、シークレット漏洩検出、SAST解析を自動実行。",
    skills: ["脆弱性スキャン", "シークレット検出", "SAST", "依存関係監査"],
    color: "#ffcc00",
    healthUrl: "",
    homeUrl: "",
    pack: "claw",
  },
  {
    name: "DevOpsClaw",
    emoji: "\u{2699}\u{FE0F}",
    role: "DevOps Patrol",
    description:
      "DevOpsパトロール。CI/CDパイプライン監視、インフラ設定チェック、デプロイ自動化を担当。",
    skills: ["CI/CD監視", "インフラ設定", "デプロイ自動化", "コスト最適化"],
    color: "#44aaff",
    healthUrl: "",
    homeUrl: "",
    pack: "claw",
  },
];

type HealthStatus = "loading" | "online" | "offline" | "error";

interface HealthData {
  llm_model?: string;
  poop_pool?: number;
  poop_full?: boolean;
  auto_heartbeat?: boolean;
  version?: string;
  mumble?: string;
}

interface AgentWithStatus extends AgentDef {
  status: HealthStatus;
  health?: HealthData;
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
      text: "[SLEEPING]",
      textColor: "text-[#888]",
      borderColor: "border-[#333]",
      dotColor: "bg-[#888]",
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
      className={`text-xs px-2 py-0.5 border ${config.textColor} ${config.borderColor} flex items-center gap-1.5`}
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
  const model = agent.health?.llm_model || "openrouter/auto";

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
            <span className="text-xs text-[#777]">{agent.role}</span>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Live stats row */}
      <div className="flex flex-wrap gap-3 mb-2 text-xs">
        <span>
          <span className="text-[#777]">model: </span>
          <span className="text-[#00ffff]">{model}</span>
        </span>
        {agent.health?.version && (
          <span>
            <span className="text-[#777]">v</span>
            <span className="text-[#aaa]">{agent.health.version}</span>
          </span>
        )}
      </div>

      {/* POOP economy bar */}
      {agent.health && typeof agent.health.poop_pool === "number" && (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-xs mb-1">
            <span className="text-[#777]">poop_pool:</span>
            <span className={agent.health.poop_full ? "text-[#ff4444]" : "text-[#aaa]"}>
              {agent.health.poop_pool}/100
            </span>
            {agent.health.poop_full && (
              <span className="text-[#ff4444]">FULL</span>
            )}
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${Math.min(agent.health.poop_pool, 100)}%`,
                backgroundColor: agent.health.poop_full ? "#ff4444" : agent.health.poop_pool > 70 ? "#ffaa00" : "#00ff00",
              }}
            />
          </div>
        </div>
      )}

      {/* Mumble (thinking aloud) */}
      {agent.health?.mumble && (
        <div className="mb-2 px-2 py-1.5 bg-[#0d1117] border border-[#1a3a1a] rounded text-xs text-[#aaa] italic">
          <span className="not-italic">{agent.emoji}</span> {agent.health.mumble}
        </div>
      )}

      {/* Description */}
      <p className="text-[#aaa] text-sm leading-relaxed mb-4 flex-1">
        {agent.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {agent.skills.map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 border border-[#1a1a1a] text-[#777]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* CTA: Talk to Dog */}
      {agent.homeUrl ? (
        <div className="flex flex-wrap gap-2 mb-3">
          <a
            href={agent.homeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm px-4 py-2.5 rounded font-bold transition-colors"
            style={{
              backgroundColor: `${agent.color}15`,
              color: agent.color,
              border: `1px solid ${agent.color}40`,
            }}
          >
            {agent.emoji} 話しかける
          </a>
          {agent.telegramBot && (
            <a
              href={`https://t.me/${agent.telegramBot}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2.5 rounded border border-[#29b6f6]/40 text-[#29b6f6] hover:bg-[#29b6f6]/10 transition-colors"
            >
              TG
            </a>
          )}
        </div>
      ) : (
        <div className="mb-3">
          <span className="text-xs text-[#555]">
            <span className="text-[#1a3a1a]">$ </span>
            private gateway
          </span>
        </div>
      )}

      {/* Links (subtle) */}
      <div className="text-xs text-[#555]">
        {agent.homeUrl && (
          <span>{agent.healthUrl.replace("https://", "").replace("http://", "")}</span>
        )}
      </div>
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
    const dogResults = await Promise.allSettled(
      DOG_AGENTS.map(async (agent): Promise<{ status: HealthStatus; health?: HealthData }> => {
        try {
          const res = await fetch(agent.healthUrl, {
            signal: AbortSignal.timeout(8000),
          });
          if (res.ok) {
            const data = await res.json();
            return {
              status: "online",
              health: {
                llm_model: data.llm_model,
                poop_pool: data.poop_pool,
                poop_full: data.poop_full,
                auto_heartbeat: data.auto_heartbeat,
                version: data.version,
                mumble: data.mumble,
              },
            };
          }
          return { status: "offline" };
        } catch {
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
        health:
          dogResults[i].status === "fulfilled"
            ? dogResults[i].value.health
            : undefined,
      }))
    );

    setClawStatuses(
      CLAW_AGENTS.map((agent) => ({
        ...agent,
        status: "online" as HealthStatus,
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
      <div className="terminal-box p-4 mb-6">
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <div>
            <span className="text-[#777]">total_agents: </span>
            <span className="text-[#00ff00] font-bold">
              {DOG_AGENTS.length + CLAW_AGENTS.length}
            </span>
          </div>
          <div>
            <span className="text-[#777]">dogs_online: </span>
            <span className="text-[#00ff00] font-bold">
              {dogOnline}/{DOG_AGENTS.length}
            </span>
          </div>
          <div>
            <span className="text-[#777]">claws_online: </span>
            <span className="text-[#ff6644] font-bold">
              {clawOnline}/{CLAW_AGENTS.length}
            </span>
          </div>
          <div>
            <span className="text-[#777]">runtime: </span>
            <span className="text-[#aaa]">Fermyon Spin (WASM)</span>
          </div>
          <div>
            <span className="text-[#777]">region: </span>
            <span className="text-[#aaa]">nrt (Tokyo)</span>
          </div>
          <button
            onClick={checkHealth}
            className="ml-auto text-xs text-[#777] hover:text-[#00ffff] transition-colors"
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
        <p className="text-[#777] text-sm mb-4">
          11 Rust/WASM agents on Fly.io (Tokyo) | OpenRouter Auto | NFT-gated access | KIBBLE/POOP token economy
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
        <p className="text-[#777] text-sm mb-4">
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
