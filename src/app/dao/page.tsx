"use client";

import { useState } from "react";
import Link from "next/link";

// --- AI Analysis Types ---

interface AIAnalysis {
  summary: string;
  impact: string;
  recommendation: "for" | "against" | "neutral";
  recommendation_reason: string;
  confidence: number;
}

// --- Types ---

interface Advisor {
  name: string;
  role: string;
  color: string;
  quote: string;
  keyInsight: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  deadline: string;
  requiredEBR: number;
}

// --- Data ---

interface AdvisorySession {
  id: string;
  label: string;
  date: string;
  advisors: Advisor[];
  consensus: { label: string; color: string; text: string }[];
  blogSlug: string;
}

const sessions: AdvisorySession[] = [
  {
    id: "session2",
    label: "Session 2: AI自律化会議",
    date: "2026-03-25",
    advisors: [
      {
        name: "A. Karpathy",
        role: "AI Architecture & Software 2.0",
        color: "#ff9900",
        quote:
          "僕がTeslaでAutopilotチームを率いていた時、数百人のエンジニアが必要だった仕事の多くが、今やClaude一匹でできる時代になった。目的関数の設計こそが、唯一の人間の仕事になる。",
        keyInsight: "Human → Orchestrator → Specialist Agents → Evaluation の4層OS設計",
      },
      {
        name: "D. Amodei",
        role: "AI Safety & Trust Hierarchy",
        color: "#66bbff",
        quote:
          "うまくいっているという事実が、安全性の証明にはならない。障害ゼロ100回達成した操作カテゴリから順次自律権限を付与すべき。",
        keyInsight: "3層Trust Hierarchy: Tier1(AI自律) / Tier2(非同期承認) / Tier3(リアルタイム承認)",
      },
      {
        name: "G. Hotz",
        role: "Hacker Pragmatism",
        color: "#ff4488",
        quote:
          "\"AI writes code\"と\"AI runs a business\"の間には、自動運転のLevel 2とLevel 5くらいの差がある。AIにコードを書かせる暇があるなら、AIに営業させろ。",
        keyInsight: "16→2に絞れ。metricsだけを見るAI agentを作れ。$100K MRRまでDAO封印",
      },
      {
        name: "sakura-dev",
        role: "DAO Member / Enterprise",
        color: "#ff88cc",
        quote:
          "驚異的であることと、持続可能であることは別の話です。障害発生時のエスカレーションパスが最も重要。急がば回れ。",
        keyInsight: "16プロダクトはAIが書いていても品質保証の観点で破綻。インシデント対応体制が必須",
      },
      {
        name: "0xnomad",
        role: "DAO Member / Web3",
        color: "#88ffcc",
        quote:
          "DAOの本質はdecentralized governanceであって効率的なoperationではない。AI自律化の前にhuman decentralizationが先。bus factor = 1は致命的。",
        keyInsight: "AI agentがexecution layer、humanがstrategic layer。理想的なDAO設計に近い",
      },
      {
        name: "yukihamada.jp",
        role: "Founder / AI-First",
        color: "#00ff88",
        quote:
          "EnablerDAOの真の強みは「1人+AIで16個動かせる」という事実そのもの。普通のスタートアップなら1つに絞る。でもAI-native orgは違うゲームだ。",
        keyInsight: "AI Orchestrator構築 + Constitutional AI guardrails + 3層Trust Hierarchy実装",
      },
    ],
    consensus: [
      { label: "AI Orchestrator", color: "#ff9900", text: "タスク分解・優先順位・リソース配分を担うAI統合管理層を構築" },
      { label: "3層Trust Hierarchy", color: "#66bbff", text: "Tier1(AI自律)/Tier2(非同期承認)/Tier3(リアルタイム承認)で段階的に自律権限付与" },
      { label: "Revenue集中 + AI自律メンテ", color: "#ff4488", text: "StayFlowに集中しつつ、他プロダクトはAI自律メンテナンスモードに移行" },
    ],
    blogSlug: "ai-autonomy-advisory-board-2026-03-25",
  },
  {
    id: "session1",
    label: "Session 1: 戦略レビュー",
    date: "2026-03-18",
    advisors: [
      {
        name: "V. Buterin",
        role: "Governance & Mechanism Design",
        color: "#aa66ff",
        quote:
          "Premature decentralization を止めること。ガバナンスを分散させる相手がいない段階で、投票システムは不要だ。StayFlowでMRR \u00a5100万を達成してから、初めてgovernanceの設計を真剣に考える段階に入る。",
        keyInsight: "Quadratic Voting + Retroactive Public Goods Funding を将来導入すべき",
      },
      {
        name: "E. Musk",
        role: "Product Strategy & Growth",
        color: "#ff6644",
        quote:
          "16プロダクトは16本のロケットを同時に打ち上げようとしているのと同じだ。全部が低軌道で燃え尽きる。明日やること: 15プロダクトを殺せ。StayFlowだけを残せ。そして最初の有料顧客を10人獲れ。",
        keyInsight: "StayFlowに全集中。TAM 3万施設の6%で$100K MRR達成可能",
      },
      {
        name: "J. Dorsey",
        role: "Community & Open Protocols",
        color: "#4488ff",
        quote:
          "DAOとは、創設者が去っても動き続けるシステムのことだ。問題は「1人」の部分ではない。問題は「もしあなたがいなくなったら、何が残るか」だ。プロダクトは消える。プロトコルは残る。",
        keyInsight: "プロダクトの間にある共通レイヤーをオープンプロトコルとして定義せよ",
      },
    ],
    consensus: [
      { label: "フォーカス", color: "#00ff00", text: "16プロダクトは多すぎる。StayFlowに集中してPMFを証明せよ" },
      { label: "段階的分散化", color: "#00ffff", text: "DAOインフラは時期尚早。有料顧客10人、コントリビューター10人を超えてから" },
      { label: "プロトコル思考", color: "#aa66ff", text: "プロダクト間の共通レイヤーをオープンプロトコルとして定義すべき" },
    ],
    blogSlug: "virtual-advisory-board-2026-03-18",
  },
];

const proposals: Proposal[] = [
  {
    id: "EDP-001",
    title: "全プロダクトRust + Fly.io + SQLite統一アーキテクチャ移行",
    description:
      "Lovable/Supabase依存を脱却し、全プロダクトをRust(axum) + Fly.io + SQLite/libSQLに統一。開発コスト削減とパフォーマンス最大化を両立する。",
    author: "yukihamada.eth",
    status: "active",
    votesFor: 4200,
    votesAgainst: 300,
    votesAbstain: 500,
    deadline: "2026-03-31",
    requiredEBR: 100,
  },
  {
    id: "EDP-002",
    title: "EBRトークン自動配布システムの導入",
    description:
      "GitHub PRマージ時にEBRトークンを自動配布するスマートコントラクトを実装。貢献度に応じた公平な報酬分配を実現。",
    author: "community",
    status: "pending",
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    deadline: "2026-04-15",
    requiredEBR: 100,
  },
  {
    id: "EDP-003",
    title: "StayFlow集中戦略 -- 3スタープロダクトへのリソース再配分",
    description:
      "Virtual Advisory Board の提言に基づき、StayFlow/Chatweb.ai/JitsuFlowの3プロダクトに開発リソースを集中。他プロダクトはメンテナンスモードに移行。",
    author: "advisory-board",
    status: "active",
    votesFor: 3800,
    votesAgainst: 600,
    votesAbstain: 200,
    deadline: "2026-04-01",
    requiredEBR: 100,
  },
];

const treasuryData = {
  totalBalance: 2840,
  monthlyCosts: [
    { name: "AWS Lambda + API Gateway", amount: 45 },
    { name: "Fly.io (5 apps)", amount: 25 },
    { name: "LLM API (Anthropic/OpenAI)", amount: 52 },
    { name: "Stripe fees", amount: 12 },
    { name: "Domains (5)", amount: 8 },
  ],
  monthlyRevenue: [
    { name: "Chatweb.ai (USD)", amount: 342 },
    { name: "StayFlow (JPY equiv.)", amount: 456 },
  ],
  assets: [
    { name: "SOL (Treasury)", amount: 1200, pct: 42 },
    { name: "USDC Reserve", amount: 842, pct: 30 },
    { name: "Monthly Revenue", amount: 798, pct: 28 },
    { name: "ENAI (1B supply)", amount: 0, pct: 0, isToken: true },
  ],
};

const contributors = [
  { address: "yukihamada.eth", rank: 1, contributions: 847, ebr: 125000 },
  { address: "claude-agent", rank: 2, contributions: 156, ebr: 45000 },
  { address: "H9S5dB...SBcW", rank: 3, contributions: 23, ebr: 8500 },
  { address: "community-01", rank: 4, contributions: 12, ebr: 3200 },
  { address: "community-02", rank: 5, contributions: 8, ebr: 1800 },
];

const actionItems = [
  { status: "done", text: "ビジネスKPIダッシュボード構築 (GA4→Stripe/直接指標)" },
  { status: "done", text: "ニュースレター配信基盤 + CTA最適化" },
  { status: "done", text: "DAOガバナンスページ全面リニューアル" },
  { status: "done", text: "Virtual Advisory Board Session 1 (Buterin/Musk/Dorsey)" },
  { status: "done", text: "Virtual Advisory Board Session 2 (Karpathy/Amodei/Hotz + DAO Members)" },
  { status: "active", text: "AI Orchestrator Agent 設計・構築" },
  { status: "active", text: "3層Trust Hierarchy 実装 (Tier1/Tier2/Tier3)" },
  { status: "active", text: "StayFlow有料転換率を5%に引き上げ" },
  { status: "active", text: "metrics監視AI agent構築 (geohot提案)" },
  { status: "pending", text: "AI peer review 仕組み構築 (Dario提案, Q3)" },
  { status: "pending", text: "他プロダクトをAI自律メンテナンスモードに移行" },
  { status: "pending", text: "Quadratic Voting実装（メンバー10人到達後）" },
];

// --- Tabs ---

type Tab = "advisory" | "proposals" | "treasury" | "contributors";

// --- Component ---

export default function DAOPage() {
  const [selectedTab, setSelectedTab] = useState<Tab>("advisory");
  const [userEBR] = useState(0);
  const [expandedAdvisor, setExpandedAdvisor] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState(0);
  const currentSession = sessions[activeSession];

  // AI Analysis state
  const [aiAnalyses, setAiAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  async function analyzeWithAI(proposalId: string, description: string) {
    setAnalyzingIds((prev) => new Set(prev).add(proposalId));
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalyses((prev) => ({ ...prev, [proposalId]: data.analysis as AIAnalysis }));
      }
    } catch (e) {
      console.error("AI analysis fetch error:", e);
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(proposalId);
        return next;
      });
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "advisory", label: "Advisory Board" },
    { id: "proposals", label: "Proposals" },
    { id: "treasury", label: "Treasury" },
    { id: "contributors", label: "Contributors" },
  ];

  const totalCosts = treasuryData.monthlyCosts.reduce((s, c) => s + c.amount, 0);
  const totalRevenue = treasuryData.monthlyRevenue.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Hero */}
      <div className="border-b border-[#1a3a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-[#00ff00] hover:text-[#33ff33] text-xs">
            ← Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#00ff00] mt-3 text-glow">
            DAO Governance
          </h1>
          <p className="text-sm text-[#888] mt-1">
            透明性のある意思決定。すべてオープン。
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Treasury", value: `$${treasuryData.totalBalance.toLocaleString()}`, color: "#00ff00" },
              { label: "Net Monthly", value: `+$${(totalRevenue - totalCosts).toLocaleString()}`, color: "#00ffff" },
              { label: "Contributors", value: contributors.length.toString(), color: "#ffaa00" },
              { label: "Your EBR", value: userEBR.toLocaleString(), color: "#ff88ff" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[10px] text-[#555]">{s.label}</p>
                <p className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1a3a1a] overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-3 text-xs border-b-2 transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? "border-[#00ff00] text-[#00ff00]"
                    : "border-transparent text-[#555] hover:text-[#888]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* --- Advisory Board --- */}
        {selectedTab === "advisory" && (
          <div className="space-y-4">
            {/* Session Switcher */}
            <div className="flex gap-2">
              {sessions.map((session, i) => (
                <button
                  key={session.id}
                  onClick={() => { setActiveSession(i); setExpandedAdvisor(null); }}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded transition-colors ${
                    activeSession === i
                      ? "bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/50"
                      : "bg-[#0d0d0d] text-[#555] border border-[#1a3a1a] hover:text-[#888]"
                  }`}
                >
                  {session.label}
                </button>
              ))}
            </div>

            <div className="terminal-box p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#555] text-xs">$</span>
                <span className="text-[#00ff00] text-xs">run virtual-advisory-board --session {currentSession.date}</span>
              </div>
              <p className="text-[#888] text-sm mb-2">
                {currentSession.advisors.length}人の仮想アドバイザーがEnablerDAOの戦略をレビュー。忖度なしの率直なフィードバック。
              </p>
              <p className="text-[#555] text-[10px]">
                * AIによるシミュレーション。実在の人物の見解ではありません。
              </p>
            </div>

            {/* Advisor Cards */}
            {currentSession.advisors.map((advisor) => (
              <div
                key={advisor.name}
                className="terminal-box p-4 sm:p-5 cursor-pointer hover:border-[#2a4a2a] transition-colors"
                onClick={() =>
                  setExpandedAdvisor(expandedAdvisor === advisor.name ? null : advisor.name)
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border"
                    style={{ borderColor: advisor.color, color: advisor.color }}
                  >
                    {advisor.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold" style={{ color: advisor.color }}>
                        {advisor.name}
                      </span>
                      <span className="text-[10px] text-[#555]">{advisor.role}</span>
                    </div>
                    <p className="text-xs text-[#ccc] leading-relaxed">
                      &ldquo;{advisor.quote}&rdquo;
                    </p>
                    {expandedAdvisor === advisor.name && (
                      <div className="mt-3 p-3 bg-[#0d0d0d] border border-[#1a3a1a]">
                        <p className="text-[10px] text-[#555] mb-1">KEY INSIGHT</p>
                        <p className="text-xs" style={{ color: advisor.color }}>
                          {advisor.keyInsight}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Consensus */}
            <div className="terminal-box p-4 sm:p-5 border-[#ffaa00]/30">
              <p className="text-[#ffaa00] text-xs font-bold mb-2">CONSENSUS: {currentSession.advisors.length}人の合意点</p>
              <div className="space-y-2 text-xs text-[#ccc]">
                {currentSession.consensus.map((c, i) => (
                  <p key={i}>{i + 1}. <span style={{ color: c.color }}>{c.label}</span> -- {c.text}</p>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="terminal-box p-4 sm:p-5">
              <p className="text-[#00ffff] text-xs font-bold mb-3">ACTION ITEMS</p>
              <div className="space-y-2">
                {actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className={
                      item.status === "done" ? "text-[#00ff00]" :
                      item.status === "active" ? "text-[#ffaa00]" :
                      "text-[#555]"
                    }>
                      {item.status === "done" ? "[DONE]" :
                       item.status === "active" ? "[WIP] " :
                       "[TODO]"}
                    </span>
                    <span className={item.status === "done" ? "text-[#555] line-through" : "text-[#ccc]"}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link
                href={`/blog/${currentSession.blogSlug}`}
                className="text-[#00ffff] text-xs hover:text-[#33ffff] transition-colors"
              >
                Full discussion transcript →
              </Link>
            </div>
          </div>
        )}

        {/* --- Proposals --- */}
        {selectedTab === "proposals" && (
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
              const forPct = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
              const againstPct = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;

              return (
                <div key={proposal.id} className="terminal-box p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-[#555]">{proposal.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      proposal.status === "active" ? "bg-[#00ff00]/20 text-[#00ff00]" :
                      proposal.status === "passed" ? "bg-[#00ffff]/20 text-[#00ffff]" :
                      proposal.status === "pending" ? "bg-[#ffaa00]/20 text-[#ffaa00]" :
                      "bg-[#ff6688]/20 text-[#ff6688]"
                    }`}>
                      {proposal.status === "active" ? "VOTING" :
                       proposal.status === "passed" ? "PASSED" :
                       proposal.status === "pending" ? "PENDING" : "REJECTED"}
                    </span>
                  </div>
                  <h3 className="text-[#e0e0e0] font-bold text-sm mb-1">{proposal.title}</h3>
                  <p className="text-xs text-[#888] mb-3">{proposal.description}</p>

                  {totalVotes > 0 && (
                    <div className="space-y-1.5 mb-3">
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-[#00ff00]">FOR {proposal.votesFor.toLocaleString()}</span>
                          <span className="text-[#00ff00]">{forPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                          <div className="h-full bg-[#00ff00]" style={{ width: `${forPct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-[#ff6688]">AGAINST {proposal.votesAgainst.toLocaleString()}</span>
                          <span className="text-[#ff6688]">{againstPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff6688]" style={{ width: `${againstPct}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[10px] text-[#555]">
                    <span>by: <span className="text-[#00ffff]">{proposal.author}</span></span>
                    <span>deadline: {proposal.deadline}</span>
                    <span>min: {proposal.requiredEBR} EBR</span>
                  </div>

                  {proposal.status === "active" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        disabled={userEBR < proposal.requiredEBR}
                        className="flex-1 px-3 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/50 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors disabled:opacity-30"
                      >
                        FOR
                      </button>
                      <button
                        disabled={userEBR < proposal.requiredEBR}
                        className="flex-1 px-3 py-1.5 bg-[#ff6688]/10 border border-[#ff6688]/50 text-[#ff6688] text-xs hover:bg-[#ff6688]/20 transition-colors disabled:opacity-30"
                      >
                        AGAINST
                      </button>
                      <button
                        disabled={userEBR < proposal.requiredEBR}
                        className="flex-1 px-3 py-1.5 bg-[#555]/10 border border-[#555]/50 text-[#888] text-xs hover:bg-[#555]/20 transition-colors disabled:opacity-30"
                      >
                        ABSTAIN
                      </button>
                    </div>
                  )}

                  {/* AI Analysis Panel */}
                  <div className="mt-3 border-t border-[#1a3a1a] pt-3">
                    {!aiAnalyses[proposal.id] ? (
                      <button
                        onClick={() => analyzeWithAI(proposal.id, proposal.description)}
                        disabled={analyzingIds.has(proposal.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a3a] border border-[#3333aa]/50 text-[#8888ff] text-xs hover:bg-[#1a1a4a] transition-colors disabled:opacity-50"
                      >
                        {analyzingIds.has(proposal.id) ? (
                          <>
                            <span className="inline-block w-3 h-3 border border-[#8888ff] border-t-transparent rounded-full animate-spin" />
                            分析中...
                          </>
                        ) : (
                          <>AI分析</>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-[#8888ff] font-bold">AI ANALYSIS</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              aiAnalyses[proposal.id].recommendation === "for"
                                ? "bg-[#00ff00]/20 text-[#00ff00]"
                                : aiAnalyses[proposal.id].recommendation === "against"
                                ? "bg-[#ff6688]/20 text-[#ff6688]"
                                : "bg-[#555]/20 text-[#888]"
                            }`}>
                              {aiAnalyses[proposal.id].recommendation === "for" ? "賛成" :
                               aiAnalyses[proposal.id].recommendation === "against" ? "反対" : "中立"}
                            </span>
                            <span className="text-[10px] text-[#555] font-mono">
                              {Math.round(aiAnalyses[proposal.id].confidence * 100)}%
                            </span>
                            <button
                              onClick={() => analyzeWithAI(proposal.id, proposal.description)}
                              disabled={analyzingIds.has(proposal.id)}
                              className="text-[10px] text-[#555] hover:text-[#8888ff] transition-colors disabled:opacity-50"
                            >
                              再分析
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#ccc] leading-relaxed">
                          {aiAnalyses[proposal.id].summary}
                        </p>
                        <p className="text-[10px] text-[#888] leading-relaxed">
                          {aiAnalyses[proposal.id].impact}
                        </p>
                        {aiAnalyses[proposal.id].recommendation_reason && (
                          <p className="text-[10px] text-[#8888ff]">
                            推奨理由: {aiAnalyses[proposal.id].recommendation_reason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Treasury --- */}
        {selectedTab === "treasury" && (
          <div className="space-y-4">
            {/* Balance */}
            <div className="terminal-box p-5 text-center">
              <p className="text-[10px] text-[#555] mb-1">TREASURY BALANCE</p>
              <p className="text-3xl font-bold text-[#00ff00] font-mono">
                ${treasuryData.totalBalance.toLocaleString()}
              </p>
            </div>

            {/* Monthly P&L */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="terminal-box p-4">
                <p className="text-[#00ff00] text-xs font-bold mb-3">REVENUE /mo</p>
                {treasuryData.monthlyRevenue.map((r, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span className="text-[#888]">{r.name}</span>
                    <span className="text-[#00ff00] font-mono">+${r.amount}</span>
                  </div>
                ))}
                <div className="border-t border-[#1a3a1a] mt-2 pt-2 flex justify-between text-xs">
                  <span className="text-[#ccc] font-bold">Total</span>
                  <span className="text-[#00ff00] font-mono font-bold">+${totalRevenue}</span>
                </div>
              </div>
              <div className="terminal-box p-4">
                <p className="text-[#ff6688] text-xs font-bold mb-3">COSTS /mo</p>
                {treasuryData.monthlyCosts.map((c, i) => (
                  <div key={i} className="flex justify-between text-xs py-1">
                    <span className="text-[#888]">{c.name}</span>
                    <span className="text-[#ff6688] font-mono">-${c.amount}</span>
                  </div>
                ))}
                <div className="border-t border-[#1a3a1a] mt-2 pt-2 flex justify-between text-xs">
                  <span className="text-[#ccc] font-bold">Total</span>
                  <span className="text-[#ff6688] font-mono font-bold">-${totalCosts}</span>
                </div>
              </div>
            </div>

            {/* Net */}
            <div className="terminal-box p-4 text-center border-[#00ffff]/20">
              <p className="text-[10px] text-[#555]">NET MONTHLY</p>
              <p className="text-xl font-bold text-[#00ffff] font-mono">
                +${totalRevenue - totalCosts}/mo
              </p>
              <p className="text-[10px] text-[#555] mt-1">
                Margin: {((1 - totalCosts / totalRevenue) * 100).toFixed(0)}%
              </p>
            </div>

            {/* Assets */}
            <div className="terminal-box p-4">
              <p className="text-[#ffaa00] text-xs font-bold mb-3">ASSETS</p>
              {treasuryData.assets.map((a, i) => {
                const asset = a as typeof a & { isToken?: boolean };
                if (asset.isToken) {
                  return (
                    <div key={i} className="mb-2 p-3 bg-[#0d0d0d] border border-[#4488ff]/30 rounded">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#4488ff] font-bold">{a.name}</span>
                        <a
                          href="https://solscan.io/token/8CeusiVAeibuBGv5xcf7kt7JQZzqwTS5pD7u2CfyoWnL"
                          target="_blank"
                          rel="noopener"
                          className="text-[#00ffff] hover:text-[#33ffff] text-[10px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Solscan →
                        </a>
                      </div>
                      <div className="text-[10px] text-[#555] space-y-0.5">
                        <div>Mint: <span className="text-[#888] font-mono">8Ceus...oWnL</span></div>
                        <div>Treasury: <span className="text-[#888] font-mono">DK29r...9XvQ</span></div>
                        <div className="text-[#4488ff]/80">1 ENAI = 10 chatweb.ai credits</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-[#888]">{a.name}</span>
                      <span className="text-[#ccc] font-mono">${a.amount} ({a.pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00ff00]" style={{ width: `${a.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="terminal-box p-3 bg-[#1a3a1a]/30">
              <p className="text-[10px] text-[#555]">
                All financial data is transparent by default.{" "}
                <a href="https://solscan.io" target="_blank" rel="noopener" className="text-[#00ffff] hover:text-[#33ffff]">
                  Verify on Solscan
                </a>
              </p>
            </div>
          </div>
        )}

        {/* --- Contributors --- */}
        {selectedTab === "contributors" && (
          <div className="space-y-4">
            <div className="terminal-box p-4">
              <p className="text-[#00ffff] text-xs font-bold mb-3">LEADERBOARD</p>
              <div className="space-y-2">
                {contributors.map((c) => (
                  <div
                    key={c.address}
                    className="flex items-center gap-3 p-3 bg-[#0d0d0d] border border-[#1a3a1a] rounded hover:border-[#2a4a2a] transition-colors"
                  >
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        color: c.rank <= 3 ? "#00ff00" : "#555",
                        backgroundColor: c.rank <= 3 ? "rgba(0,255,0,0.1)" : "transparent",
                        border: `1px solid ${c.rank <= 3 ? "rgba(0,255,0,0.3)" : "#1a3a1a"}`,
                      }}
                    >
                      {c.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#e0e0e0] font-mono truncate">{c.address}</p>
                      <p className="text-[10px] text-[#555]">{c.contributions} commits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#00ff00] font-mono">
                        {c.ebr.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#555]">EBR</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="terminal-box p-4">
              <p className="text-[#ffaa00] text-xs font-bold mb-3">EARN EBR</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] rounded">
                  <p className="text-[#00ff00] font-bold">Code</p>
                  <p className="text-[#888]">100-1000 EBR/PR</p>
                </div>
                <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] rounded">
                  <p className="text-[#ff6688] font-bold">Bug Report</p>
                  <p className="text-[#888]">50-500 EBR</p>
                </div>
                <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] rounded">
                  <p className="text-[#00ffff] font-bold">Docs</p>
                  <p className="text-[#888]">10-200 EBR</p>
                </div>
                <div className="p-3 bg-[#0d0d0d] border border-[#1a3a1a] rounded">
                  <p className="text-[#ffaa00] font-bold">Community</p>
                  <p className="text-[#888]">5-500 EBR</p>
                </div>
              </div>
              <Link
                href="/projects"
                className="block w-full mt-3 px-4 py-2 bg-[#1a3a1a] text-[#00ff00] text-center text-xs rounded hover:bg-[#2a4a2a] transition-colors"
              >
                $ git clone enablerdao && make contribute
              </Link>
            </div>

            <div className="terminal-box p-4 border-[#4488ff]/30">
              <p className="text-[#4488ff] text-xs font-bold mb-3">ENAI CREDITS</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-3 bg-[#0d0d0d] border border-[#4488ff]/20 rounded">
                  <span className="font-mono text-[#555]">$</span>
                  <span className="text-[#4488ff] font-mono">enai-buy</span>
                  <span className="text-[#888]">ENAIでクレジット購入</span>
                </div>
                <p className="text-[#555] pl-1">
                  1 ENAI = 10 chatweb.ai クレジット → <Link href="/token" className="text-[#4488ff] hover:text-[#6699ff]">/token で購入可能</Link>
                </p>
                <p className="text-[10px] text-[#444] pl-1">
                  DePIN報酬・DAO投票 · Mint: 8Ceus...oWnL · Supply: 1,000,000,000
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
