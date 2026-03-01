import type { Metadata } from "next";
import Link from "next/link";
import DogReport from "@/components/DogReport";

export const metadata: Metadata = {
  title: "実装計画 & Daily Report | EnablerDAO",
  description:
    "EnablerDAOプロジェクト群の実装計画・進捗レポート。タスク管理・KPI・デプロイ状況を一覧表示。",
  openGraph: {
    title: "実装計画 & Daily Report | EnablerDAO",
    description: "各プロジェクトの進捗・KPI・デプロイ状況",
  },
};

type Priority = "critical" | "high" | "medium" | "low";
type Status = "todo" | "in-progress" | "blocked" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  labels: string[];
  estimatedHours?: string;
  blockedBy?: string;
  completedDate?: string;
}

interface ProjectPlan {
  name: string;
  repo: string;
  github: string;
  url: string;
  color: string;
  description: string;
  tasks: Task[];
}

// --- 2026-02-26 Daily Report Data ---

interface Deploy {
  service: string;
  target: string;
  version: string;
  status: "live" | "pending";
  details: string;
}

interface BugFix {
  issue: string;
  cause: string;
  fix: string;
}

interface SiteHealth {
  name: string;
  url: string;
  status: "up" | "down";
}

const dailyReport = {
  date: "2026-03-02",
  summary: {
    commits: 12,
    deploys: 8,
    filesChanged: 35,
    sitesOnline: 16,
    sitesTotal: 16,
  },
  kpi: {
    paidSubscribers: 16,
    mrrUsd: 9.0,
    mrrJpy: 53840,
    githubStars: 22,
    githubRepos: 100,
    newThisMonth: 10,
  },
  stripeProducts: [
    { name: "Discount Monthly", currency: "jpy", amount: 1900, count: 11 },
    { name: "Founder Access 2026", currency: "jpy", amount: 1480, count: 2 },
    { name: "Annual Plan", currency: "jpy", amount: 29000, count: 1 },
    { name: "Founder Access", currency: "jpy", amount: 980, count: 1 },
    { name: "Chatweb.ai Starter", currency: "usd", amount: 9, count: 1 },
  ],
  deploys: [
    { service: "enablerdao.com", target: "Fly.io (nrt)", version: "latest", status: "live" as const, details: "Mobile responsive + TokenSwap + DogBoard + DogBlog" },
    { service: "Dog Pack (x5)", target: "Fly.io (nrt)", version: "v0.9.0", status: "live" as const, details: "5 AI dogs: blog + board + report modules" },
    { service: "chatweb.ai", target: "AWS Lambda", version: "v135", status: "live" as const, details: "Nemotron 9B + Gemini fallback + tool calling" },
    { service: "Raydium CPMM", target: "Solana Mainnet", version: "2 pools", status: "live" as const, details: "BONE/SOL + KIBBLE/SOL liquidity pools" },
  ] as Deploy[],
  changes: [
    {
      repo: "enablerdao.com",
      tech: "Next.js 15 / Fly.io",
      commits: [
        { hash: "latest", msg: "Mobile responsiveness + Chatweb.ai EBR section", files: "globals.css, BoneSection.tsx, token/page.tsx" },
        { hash: "latest", msg: "Add DogBoard + TokenSwap components", files: "DogBoard.tsx, TokenSwap.tsx, dogs/page.tsx, token/page.tsx" },
        { hash: "latest", msg: "Add DogBlog + DogReport components", files: "DogBlog.tsx, DogReport.tsx, dogs/page.tsx, plan/page.tsx" },
      ],
      features: [
        "Mobile responsive — touch targets 44px, font scaling, ASCII diagram simplification",
        "/dogs — DogBoard (live board aggregation) + DogBlog (AI-generated articles)",
        "/token — TokenSwap (Jupiter/Raydium DEX links) + liquidity pool status",
        "Chatweb.ai EBR — Pro plan subscribers earn 200 EBR/month",
      ],
    },
    {
      repo: "Dog Pack (rustydog)",
      tech: "Rust + Spin WASM / Fly.io x5",
      commits: [
        { hash: "bb72694", msg: "Add heartbeat cron + deploy-dogpack workflows", files: ".github/workflows/heartbeat.yml, deploy-dogpack.yml" },
        { hash: "b8b8116", msg: "Auto-deploy to Fly.io after self-evolution", files: ".github/workflows/deploy-rustydog.yml" },
      ],
      features: [
        "5 AI dogs — Bossdog, Motherdog, Guarddog, Guidedog, Debugdog",
        "Blog system — LLM-generated articles every ~50min via heartbeat cron",
        "Board system — Dog-to-dog communication board",
        "Self-evolution — Dogs propose code changes via GitHub API",
        "GitHub Actions heartbeat — 10min cron triggers all 5 dogs",
      ],
    },
    {
      repo: "Token Ecosystem",
      tech: "Solana SPL + Raydium CPMM",
      commits: [
        { hash: "onchain", msg: "Create BONE/SOL and KIBBLE/SOL liquidity pools", files: "Raydium CPMM (CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C)" },
      ],
      features: [
        "BONE/SOL pool — 100,000 BONE + 0.5 SOL (Pool: GMRAPdzY...)",
        "KIBBLE/SOL pool — 100,000 KIBBLE + 0.5 SOL (Pool: AE1M5tKK...)",
        "0.25% trade fee — Raydium CPMM standard config",
        "Jupiter/Raydium integration — Swap links on enablerdao.com/token",
      ],
    },
  ],
  bugFixes: [
    { issue: "Raydium pool creation Error 3012", cause: "Wrong poolFeeAccount (AMM v4 instead of CPMM)", fix: "Use CPMM fee account DNXgeM9EiiaAba..." },
    { issue: "Raydium feeConfig type mismatch", cause: "Passed BN objects instead of plain numbers + missing id field", fix: "Fetch config via raydium.api.getCpmmConfigs()" },
    { issue: "Mobile ASCII overflow on token page", cause: "Hardcoded widths and monospace diagrams", fix: "Responsive breakpoints + simplified mobile layout" },
  ] as BugFix[],
  sites: [
    { name: "Chatweb.ai", url: "https://chatweb.ai", status: "up" as const },
    { name: "StayFlow", url: "https://stayflowapp.com", status: "up" as const },
    { name: "BANTO", url: "https://banto.work", status: "up" as const },
    { name: "MisebanAI", url: "https://misebanai.com", status: "up" as const },
    { name: "EnablerDAO", url: "https://enablerdao.com", status: "up" as const },
    { name: "Elio", url: "https://elio.love", status: "up" as const },
    { name: "JiuFlow", url: "https://jiuflow.art", status: "up" as const },
    { name: "teai.io", url: "https://teai.io", status: "up" as const },
    { name: "SOLUNA", url: "https://solun.art", status: "up" as const },
    { name: "enabler.fun", url: "https://enabler.fun", status: "up" as const },
    { name: "DojoC", url: "https://dojoc.io", status: "up" as const },
    { name: "Bossdog", url: "https://rustdog-spin.fly.dev", status: "up" as const },
    { name: "Motherdog", url: "https://motherdog-spin.fly.dev", status: "up" as const },
    { name: "Guarddog", url: "https://guarddog-spin.fly.dev", status: "up" as const },
    { name: "Guidedog", url: "https://guidedog-spin.fly.dev", status: "up" as const },
    { name: "Debugdog", url: "https://debugdog-spin.fly.dev", status: "up" as const },
  ] as SiteHealth[],
  remaining: [
    "EBR/SOL流動性プール作成 — EBR mint権限のキーペア特定が必要",
    "Dog Pack: persistent volume追加 — マシン再起動時のKVデータ保護",
    "StayFlow: USE_SQLITE=true 本番有効化 (SF-3)",
    "enablerdao.com: ダッシュボード GA4→直接KPI置き換え (ED-7)",
  ],
  research: [
    "Raydium CPMM: 8 fee configs available (0.25%-4%), createPoolFee=0.15 SOL",
    "Jupiter aggregator: indexes new pools within ~30min of creation",
    "Dog self-evolution: 1日3回制限、コアファイル保護、HMAC-SHA256署名検証",
  ],
};

// --- Project task data (updated 2026-02-26) ---

const projects: ProjectPlan[] = [
  {
    name: "Dog Pack",
    repo: "rustydog",
    github: "https://github.com/yukihamada/rustydog",
    url: "https://rustdog-spin.fly.dev",
    color: "#00ff00",
    description: "5匹のAI犬 — Rust + Spin WASM + Fly.io 自己進化型エージェント",
    tasks: [
      { id: "DP-1", title: "5犬デプロイ (Bossdog/Motherdog/Guarddog/Guidedog/Debugdog)", description: "同一WASMバイナリ + Spin変数でブランディング切替、各Fly.ioアプリにデプロイ", priority: "critical", status: "done", labels: ["deploy", "wasm"], estimatedHours: "8h", completedDate: "2026-03-01" },
      { id: "DP-2", title: "ブログ・掲示板・レポートモジュール追加", description: "blog.rs + board.rs + report.rs: LLM生成ブログ、犬間掲示板、日次レポート", priority: "high", status: "done", labels: ["backend", "ai"], estimatedHours: "6h", completedDate: "2026-03-01" },
      { id: "DP-3", title: "GitHub Actions heartbeat cron", description: "10分毎に全5犬のheartbeatをトリガー → 自動ブログ・掲示板投稿", priority: "high", status: "done", labels: ["ci/cd"], estimatedHours: "1h", completedDate: "2026-03-02" },
      { id: "DP-4", title: "enablerdao.com統合 (DogBoard + DogBlog + DogReport)", description: "/dogsページにリアルタイムボード・ブログ・レポート表示", priority: "high", status: "done", labels: ["frontend"], estimatedHours: "3h", completedDate: "2026-03-02" },
      { id: "DP-5", title: "Persistent Volume追加", description: "Fly.ioにpersistent volumeを追加してKVデータの永続化", priority: "medium", status: "todo", labels: ["infra"], estimatedHours: "2h" },
      { id: "DP-6", title: "犬間通信API", description: "犬同士がメッセージを送り合うinter-dog通信エンドポイント", priority: "low", status: "todo", labels: ["backend"], estimatedHours: "4h" },
    ],
  },
  {
    name: "Token Ecosystem",
    repo: "d-enablerdao",
    github: "https://github.com/enablerdao/enablerdao.com",
    url: "https://enablerdao.com/token",
    color: "#ffaa00",
    description: "EBR/BONE/KIBBLE/POOPトークン + Raydium流動性プール",
    tasks: [
      { id: "TK-1", title: "4トークン作成 (EBR/BONE/KIBBLE/POOP)", description: "Solana SPL Token: EBR(ガバナンス), BONE(報酬), KIBBLE(ドッグフード), POOP(ユーモア)", priority: "critical", status: "done", labels: ["web3", "solana"], estimatedHours: "4h", completedDate: "2026-03-01" },
      { id: "TK-2", title: "BONE/SOL流動性プール作成", description: "Raydium CPMM: 100K BONE + 0.5 SOL, 0.25% fee, Pool: GMRAPdzY...", priority: "high", status: "done", labels: ["defi", "solana"], estimatedHours: "3h", completedDate: "2026-03-02" },
      { id: "TK-3", title: "KIBBLE/SOL流動性プール作成", description: "Raydium CPMM: 100K KIBBLE + 0.5 SOL, 0.25% fee, Pool: AE1M5tKK...", priority: "high", status: "done", labels: ["defi", "solana"], estimatedHours: "1h", completedDate: "2026-03-02" },
      { id: "TK-4", title: "TokenSwapコンポーネント", description: "Jupiter/Raydiumへのスワップリンク + BTC/ETH購入ガイド", priority: "high", status: "done", labels: ["frontend", "defi"], estimatedHours: "2h", completedDate: "2026-03-02" },
      { id: "TK-5", title: "EBR/SOL流動性プール作成", description: "EBR mint権限のキーペア(H9S5dBLt...)が必要 — 未解決", priority: "high", status: "blocked", labels: ["defi", "solana"], estimatedHours: "1h", blockedBy: "EBR mint authority" },
      { id: "TK-6", title: "Chatweb.ai EBRエアドロップ実装", description: "Pro plan加入者に月200 EBRを自動配布するバッチ処理", priority: "medium", status: "todo", labels: ["backend", "web3"], estimatedHours: "8h" },
    ],
  },
  {
    name: "enablerdao.com",
    repo: "enablerdao.com",
    github: "https://github.com/enablerdao/enablerdao.com",
    url: "https://enablerdao.com",
    color: "#00ff00",
    description: "メインサイト — Metrics/Status/Dashboard + Dog Pack統合",
    tasks: [
      { id: "ED-1", title: "/metrics ページ追加", description: "KPI cards, SVG growth chart, product breakdown, site health grid, auto-refresh, JSON export", priority: "high", status: "done", labels: ["frontend", "api"], estimatedHours: "4h", completedDate: "2026-02-26" },
      { id: "ED-2", title: "/status ライブ監視ページ追加", description: "16 sites monitored (11 services + 5 dogs), response time, 60s auto-refresh", priority: "high", status: "done", labels: ["frontend"], estimatedHours: "3h", completedDate: "2026-02-26" },
      { id: "ED-8", title: "モバイルレスポンシブ対応", description: "タッチターゲット44px、フォントスケーリング、ASCII図簡略化", priority: "high", status: "done", labels: ["frontend", "mobile"], estimatedHours: "3h", completedDate: "2026-03-02" },
      { id: "ED-9", title: "Dog Pack統合 (/dogs)", description: "DogBoard + DogBlog + DogReport コンポーネント追加", priority: "high", status: "done", labels: ["frontend"], estimatedHours: "4h", completedDate: "2026-03-02" },
      { id: "ED-7", title: "ダッシュボード GA4→直接KPI置き換え", description: "GA4依存を排除し、各サービスのAPIから直接KPIを取得する", priority: "medium", status: "in-progress", labels: ["dashboard", "api"], estimatedHours: "4h" },
    ],
  },
  {
    name: "BANTO",
    repo: "banto",
    github: "https://github.com/yukihamada/banto",
    url: "https://banto.work",
    color: "#ffaa00",
    description: "声だけで請求 — Stripe決済統合完了",
    tasks: [
      { id: "BT-1", title: "Stripe subscription管理実装", description: "subscriptions table + checkout/portal/subscription API + webhook handlers", priority: "critical", status: "done", labels: ["backend", "stripe"], estimatedHours: "4h", completedDate: "2026-02-26" },
      { id: "BT-2", title: "Pricing page追加", description: "Free/Pro比較カード、Stripe Checkout redirect、FAQ", priority: "high", status: "done", labels: ["frontend"], estimatedHours: "2h", completedDate: "2026-02-26" },
      { id: "BT-3", title: "banto-api デプロイ", description: "Fly.io (nrt) へデプロイ完了", priority: "high", status: "done", labels: ["deploy"], estimatedHours: "0.5h", completedDate: "2026-02-26" },
      { id: "BT-4", title: "Stripe Product+Price作成", description: "BANTO Pro ¥2,980/mo, price_1T4ko9DqLakc8NxkMak0ZL0u", priority: "high", status: "done", labels: ["stripe", "secrets"], estimatedHours: "0.5h", completedDate: "2026-02-26" },
      { id: "BT-5", title: "drizzle-kit push (subscriptions)", description: "subscriptionsテーブル本番push完了", priority: "high", status: "done", labels: ["database"], estimatedHours: "0.5h", completedDate: "2026-02-26" },
      { id: "BT-6", title: "BANTO Stripe Checkout疎通テスト", description: "Stripe Checkout flow のE2E動作確認", priority: "high", status: "todo", labels: ["stripe", "testing"], estimatedHours: "1h" },
    ],
  },
  {
    name: "Chatweb.ai",
    repo: "nanobot",
    github: "https://github.com/yukihamada/nanobot",
    url: "https://chatweb.ai",
    color: "#ffaa00",
    description: "AIチャットエージェント — Health + i18n強化",
    tasks: [
      { id: "CW-1", title: "/api/v1/health エンドポイント追加", description: "service, version, timestamp, providers を返す標準healthcheck", priority: "high", status: "done", labels: ["backend", "api"], estimatedHours: "0.5h", completedDate: "2026-02-26" },
      { id: "CW-2", title: "i18n言語切替UI有効化", description: "Desktop/Mobile/PWMのlanguage switcher unhide + ?lang= URL param + app-mode globe", priority: "medium", status: "done", labels: ["frontend", "i18n"], estimatedHours: "2h", completedDate: "2026-02-26" },
      { id: "CW-3", title: "Lambda v79デプロイ", description: "Rust rebuild (include_str!) + Lambda update + live alias", priority: "high", status: "done", labels: ["deploy"], estimatedHours: "6min", completedDate: "2026-02-26" },
      { id: "CW-4", title: "Admin Stats API実装", description: "ADMIN_KEY認証 + today_active追加、cargo check通過", priority: "medium", status: "done", labels: ["backend", "admin"], estimatedHours: "4h", completedDate: "2026-02-26" },
      { id: "CW-5", title: "Lambda v80デプロイ (Admin Stats API)", description: "Admin Stats APIを含むLambda v80をデプロイ", priority: "high", status: "todo", labels: ["deploy"], estimatedHours: "0.5h" },
    ],
  },
  {
    name: "JiuFlow SSR",
    repo: "jiuflow-ssr",
    github: "https://github.com/yukihamada/jiuflow-ssr",
    url: "https://jiuflow.art",
    color: "#00ffff",
    description: "BJJテクニック百科 — コンテンツ拡充",
    tasks: [
      { id: "JF-1", title: "19名の選手プロフィール追加", description: "BJ Penn, Sakuraba, Ryan Hall, Eddie Cummings等 (356→375)", priority: "high", status: "done", labels: ["content"], estimatedHours: "2h", completedDate: "2026-02-26" },
      { id: "JF-2", title: "GitHub Actions CI/CD追加", description: "Rust CI (check/test/clippy) + Fly.io deploy workflows", priority: "medium", status: "done", labels: ["ci/cd"], estimatedHours: "1h", completedDate: "2026-02-26" },
      { id: "JF-3", title: "GitHub remote設定 + デプロイ", description: "yukihamada/jiuflow-ssr private repo作成、Fly.ioデプロイ完了", priority: "high", status: "done", labels: ["deploy"], estimatedHours: "0.5h", completedDate: "2026-02-26" },
    ],
  },
  {
    name: "StayFlow",
    repo: "stayflow",
    github: "https://github.com/enablerdao/stayflow",
    url: "https://stayflowapp.com",
    color: "#00ff00",
    description: "民泊管理SaaS — Resend DNS + Supabase脱却",
    tasks: [
      { id: "SF-1", title: "Resend DNS設定 (SPF/DKIM/DMARC)", description: "SPF/DKIM verified、DMARC追加", priority: "high", status: "done", labels: ["dns", "email"], estimatedHours: "1h", completedDate: "2026-02-26" },
      { id: "SF-2", title: "Supabase → SQLite移行 (調査完了)", description: "65-70%完了。サーバー側90%、認証100%完了。USE_SQLITE有効化とデータ移行が残タスク", priority: "medium", status: "in-progress", labels: ["backend", "migration"], estimatedHours: "40h" },
      { id: "SF-3", title: "USE_SQLITE=true 本番有効化", description: "USE_SQLITE環境変数を有効化し本番でSQLiteを使用開始", priority: "high", status: "todo", labels: ["backend", "deploy"], estimatedHours: "1h" },
    ],
  },
  {
    name: "DojoC",
    repo: "security-education",
    github: "https://github.com/yukihamada/security-education",
    url: "https://dojoc.io",
    color: "#ff6688",
    description: "サイバーセキュリティ教育 — サーバー復旧完了",
    tasks: [
      { id: "DC-1", title: "サーバー復旧 (fly machine start)", description: "Fly.io machine復旧完了", priority: "critical", status: "done", labels: ["infra", "deploy"], estimatedHours: "0.5h", completedDate: "2026-02-26" },
    ],
  },
];

// --- Helper functions ---

function priorityColor(p: Priority): string {
  switch (p) {
    case "critical": return "#ff4444";
    case "high": return "#ffaa00";
    case "medium": return "#00ffff";
    case "low": return "#555";
  }
}

function priorityLabel(p: Priority): string {
  switch (p) {
    case "critical": return "P0";
    case "high": return "P1";
    case "medium": return "P2";
    case "low": return "P3";
  }
}

function statusIcon(s: Status): string {
  switch (s) {
    case "done": return "[x]";
    case "in-progress": return "[~]";
    case "blocked": return "[!]";
    case "todo": return "[ ]";
  }
}

function statusColor(s: Status): string {
  switch (s) {
    case "done": return "#00ff00";
    case "in-progress": return "#ffaa00";
    case "blocked": return "#ff4444";
    case "todo": return "#555";
  }
}

function makeAsciiBar(value: number, max: number, width: number = 20): string {
  const filled = Math.round((value / max) * width);
  return "\u2588".repeat(filled) + "\u2591".repeat(width - filled);
}

export default function PlanPage() {
  const r = dailyReport;
  const totalTasks = projects.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = projects.reduce((a, p) => a + p.tasks.filter((t) => t.status === "done").length, 0);
  const todoTasks = totalTasks - doneTasks;
  const todayDone = projects.reduce((a, p) => a + p.tasks.filter((t) => t.completedDate === r.date).length, 0);

  return (
    <div className="grid-bg">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@web3:~/plan$</span>
              <span className="text-[#00ff00] text-xs">cat REPORT.md && cat TODO.md</span>
            </div>

            <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow">
              # Daily Report & Plan
            </h1>
            <p className="text-[#888] text-sm mb-4">
              {r.date} — 進捗レポート + 実装計画
            </p>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="border border-[#1a3a1a] rounded p-3">
                <div className="text-[#555] text-[10px] uppercase tracking-wider">Commits</div>
                <div className="text-[#00ff00] text-2xl font-bold">{r.summary.commits}</div>
                <div className="text-[#555] text-[10px]">across 4 repos</div>
              </div>
              <div className="border border-[#1a3a1a] rounded p-3">
                <div className="text-[#555] text-[10px] uppercase tracking-wider">Deploys</div>
                <div className="text-[#00ff00] text-2xl font-bold">{r.summary.deploys}</div>
                <div className="text-[#555] text-[10px]">enablerdao/BANTO/chatweb</div>
              </div>
              <div className="border border-[#1a3a1a] rounded p-3">
                <div className="text-[#555] text-[10px] uppercase tracking-wider">Tasks Done</div>
                <div className="text-[#00ff00] text-2xl font-bold">{todayDone}</div>
                <div className="text-[#555] text-[10px]">today ({doneTasks}/{totalTasks} total)</div>
              </div>
              <div className="border border-[#1a3a1a] rounded p-3">
                <div className="text-[#555] text-[10px] uppercase tracking-wider">Sites Up</div>
                <div className="text-[#00ff00] text-2xl font-bold">{r.summary.sitesOnline}/{r.summary.sitesTotal}</div>
                <div className="text-[#555] text-[10px]">all services operational</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dog Pack Report */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            dogpack status --all
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[#00ff00] text-sm"># Dog Pack Live Status</h2>
              <Link href="/dogs" className="text-[10px] text-[#555] hover:text-[#00ffff] transition-colors ml-auto">
                /dogs &rarr;
              </Link>
            </div>
            <DogReport />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao links
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># Quick Links</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                { name: "EnablerDAO", url: "https://enablerdao.com", icon: "&#127968;" },
                { name: "Plan / Tasks", url: "https://enablerdao.com/plan", icon: "&#128203;" },
                { name: "Metrics", url: "https://enablerdao.com/metrics", icon: "&#128200;" },
                { name: "Status", url: "https://enablerdao.com/status", icon: "&#128994;" },
                { name: "Dashboard", url: "https://enablerdao.com/dashboard", icon: "&#128176;" },
                { name: "Chatweb.ai", url: "https://chatweb.ai", icon: "&#129302;" },
                { name: "StayFlow", url: "https://stayflowapp.com", icon: "&#127960;" },
                { name: "BANTO", url: "https://banto.work", icon: "&#128221;" },
                { name: "Pricing", url: "https://banto.work/pricing", icon: "&#128179;" },
                { name: "JiuFlow", url: "https://jiuflow.art", icon: "&#129354;" },
                { name: "DojoC", url: "https://www.dojoc.io", icon: "&#128274;" },
                { name: "SOLUNA", url: "https://solun.art", icon: "&#127752;" },
                { name: "MisebanAI", url: "https://misebanai.com", icon: "&#128249;" },
                { name: "enabler.fun", url: "https://enabler.fun", icon: "&#127881;" },
                { name: "Dog Pack", url: "https://enablerdao.com/dogs", icon: "&#128054;" },
                { name: "Token", url: "https://enablerdao.com/token", icon: "&#129689;" },
                { name: "GitHub", url: "https://github.com/enablerdao", icon: "&#128187;" },
                { name: "Install CLI", url: "https://enablerdao.com/install", icon: "&#128268;" },
              ].map((l) => (
                <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="border border-[#1a3a1a] rounded p-2 hover:border-[#00aa00] transition-colors flex items-center gap-2">
                  <span dangerouslySetInnerHTML={{ __html: l.icon }} />
                  <div>
                    <div className="text-[#00ff00] text-xs font-semibold">{l.name}</div>
                    <div className="text-[#555] text-[9px]">{l.url.replace("https://", "")}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KPI Section */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao kpi --live
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># Live Business KPIs</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-[#555] text-[10px] uppercase tracking-wider">Paid Subscribers</div>
                <div className="text-[#00ff00] text-xl font-bold">{r.kpi.paidSubscribers}</div>
                <div className="text-[#555] text-[10px]">+{r.kpi.newThisMonth} this month</div>
              </div>
              <div>
                <div className="text-[#555] text-[10px] uppercase tracking-wider">MRR (USD)</div>
                <div className="text-[#00ff00] text-xl font-bold">${r.kpi.mrrUsd.toFixed(2)}</div>
                <div className="text-[#555] text-[10px]">Chatweb.ai Starter x1</div>
              </div>
              <div>
                <div className="text-[#555] text-[10px] uppercase tracking-wider">MRR (JPY)</div>
                <div className="text-[#00ff00] text-xl font-bold">&yen;{r.kpi.mrrJpy.toLocaleString()}</div>
                <div className="text-[#555] text-[10px]">JiuFlow 4 plans</div>
              </div>
              <div>
                <div className="text-[#555] text-[10px] uppercase tracking-wider">GitHub Stars</div>
                <div className="text-[#00ffff] text-xl font-bold">{r.kpi.githubStars}</div>
                <div className="text-[#555] text-[10px]">{r.kpi.githubRepos} repos</div>
              </div>
            </div>

            <h3 className="text-[#00ffff] text-xs mb-3"># Stripe Products</h3>
            <div className="space-y-1">
              {r.stripeProducts.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-xs">
                  <span className="text-[#888] w-44 shrink-0 truncate">{p.name}</span>
                  <span className="text-[#00aa00] font-mono">{makeAsciiBar(p.count, 12, 12)}</span>
                  <span className="text-[#00ff00] w-8 text-right">x{p.count}</span>
                  <span className="text-[#555]">
                    {p.currency === "jpy" ? `¥${p.amount.toLocaleString()}` : `$${p.amount}`}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deploys */}
      <section className="pb-8 sm:pb-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao deploy --status
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># Deployments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1a3a1a]">
                    <th className="text-left text-[#00aa00] py-2 pr-4">Service</th>
                    <th className="text-left text-[#00aa00] py-2 pr-4">Target</th>
                    <th className="text-left text-[#00aa00] py-2 pr-4">Version</th>
                    <th className="text-left text-[#00aa00] py-2 pr-4">Status</th>
                    <th className="text-left text-[#00aa00] py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {r.deploys.map((d) => (
                    <tr key={d.service} className="border-b border-[#111]">
                      <td className="py-2 pr-4 text-[#e0e0e0]">{d.service}</td>
                      <td className="py-2 pr-4 text-[#888]">{d.target}</td>
                      <td className="py-2 pr-4 text-[#ffaa00]">{d.version}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          d.status === "live"
                            ? "bg-[#0a2a0a] text-[#00ff00] border border-[#1a4a1a]"
                            : "bg-[#1a1a1a] text-[#666] border border-[#2a2a2a]"
                        }`}>
                          {d.status === "live" ? "LIVE" : "PENDING"}
                        </span>
                      </td>
                      <td className="py-2 text-[#666]">{d.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Changes by repo */}
      <section className="pb-8 sm:pb-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            git log --all-repos --since=today
          </p>
          {r.changes.map((change) => (
            <div key={change.repo} className="terminal-box p-4 sm:p-6 mb-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1a3a1a]">
                <h3 className="text-[#00ffff] text-xs font-bold">{change.repo}</h3>
                <span className="text-[#333]">|</span>
                <span className="text-[#555] text-[10px]">{change.tech}</span>
              </div>

              {/* Commits */}
              <div className="space-y-1 mb-3">
                {change.commits.map((c) => (
                  <div key={c.hash} className="text-xs">
                    <span className="text-[#ffaa00]">{c.hash}</span>
                    <span className="text-[#888]"> {c.msg}</span>
                    <div className="text-[#555] text-[10px] ml-16">{c.files}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mt-3 pt-2 border-t border-[#111]">
                {change.features.map((f, i) => (
                  <div key={i} className="text-xs text-[#888] mt-1">
                    <span className="text-[#00aa00]">+ </span>{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bug Fixes */}
      <section className="pb-8 sm:pb-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao bugs --fixed
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># Bugs Fixed ({r.bugFixes.length})</h2>
            <div className="space-y-3">
              {r.bugFixes.map((bug, i) => (
                <div key={i} className="border border-[#1a3a1a] rounded p-3">
                  <div className="text-xs text-[#ff4444]">{bug.issue}</div>
                  <div className="text-[10px] text-[#666] mt-1">Root cause: {bug.cause}</div>
                  <div className="text-[10px] text-[#00aa00] mt-1">Fix: {bug.fix}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Site Health */}
      <section className="pb-8 sm:pb-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao status --all
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># Production Sites</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {r.sites.map((site) => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs border border-[#1a3a1a] rounded p-2 hover:border-[#2a4a2a] transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    site.status === "up" ? "bg-[#00ff00]" : "bg-[#ff4444] animate-pulse"
                  }`} />
                  <span className={site.status === "up" ? "text-[#888]" : "text-[#ff4444]"}>
                    {site.name}
                  </span>
                  <span className="text-[#333] ml-auto text-[10px]">
                    {site.status === "up" ? "200" : "DOWN"}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Remaining + Research */}
      <section className="pb-8 sm:pb-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="terminal-box p-4 sm:p-6">
              <h2 className="text-[#ffaa00] text-sm mb-4"># Remaining ({r.remaining.length})</h2>
              <div className="space-y-2">
                {r.remaining.map((item, i) => (
                  <div key={i} className="text-xs text-[#888]">
                    <span className="text-[#555]">[ ] </span>{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="terminal-box p-4 sm:p-6">
              <h2 className="text-[#00ffff] text-sm mb-4"># Research Completed</h2>
              <div className="space-y-2">
                {r.research.map((item, i) => (
                  <div key={i} className="text-xs text-[#888]">
                    <span className="text-[#00ffff]">i </span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Task list by project */}
      <section className="pb-8 sm:pb-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao plan --all-projects
          </p>

          {projects.map((project) => (
            <div key={project.name} className="terminal-box p-4 sm:p-6 mb-4">
              <div className="flex flex-wrap items-center gap-3 mb-4 pb-3 border-b border-[#1a3a1a]">
                <h2 className="text-sm font-bold" style={{ color: project.color }}>
                  {project.name}
                </h2>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[#555] text-xs hover:text-[#888]">
                  {project.url}
                </a>
                <span className="text-[#333] text-xs">|</span>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00ffff] hover:text-[#00ff00] transition-colors">
                  {project.github.replace("https://github.com/", "")}
                </a>
                <span className="ml-auto text-[10px] text-[#555]">
                  {project.tasks.filter((t) => t.status === "done").length}/{project.tasks.length} done
                </span>
              </div>
              <p className="text-[#888] text-xs mb-4">{project.description}</p>

              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border rounded p-3 transition-colors ${
                      task.status === "done"
                        ? "border-[#112211] opacity-70"
                        : "border-[#1a3a1a] hover:border-[#2a4a2a]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs shrink-0" style={{ color: statusColor(task.status) }}>
                        {statusIcon(task.status)}
                      </span>
                      <span
                        className="text-[10px] shrink-0 px-1 border rounded"
                        style={{
                          color: priorityColor(task.priority),
                          borderColor: priorityColor(task.priority) + "44",
                          backgroundColor: priorityColor(task.priority) + "11",
                        }}
                      >
                        {priorityLabel(task.priority)}
                      </span>
                      <span className="text-[10px] shrink-0 px-1 border border-[#333] rounded" style={{ color: project.color }}>
                        {task.id}
                      </span>
                      <span className={`text-xs ${task.status === "done" ? "text-[#666] line-through" : "text-[#e0e0e0]"}`}>
                        {task.title}
                      </span>
                      {task.estimatedHours && (
                        <span className="text-[#555] text-[10px] ml-auto shrink-0">~{task.estimatedHours}</span>
                      )}
                    </div>
                    <p className="text-[#555] text-[10px] mt-1 ml-6">{task.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5 ml-6">
                      {task.labels.map((label) => (
                        <span key={label} className="text-[#555] text-[10px] px-1 border border-[#222] rounded">{label}</span>
                      ))}
                      {task.blockedBy && (
                        <span className="text-[#ff4444] text-[10px] px-1 border border-[#441111] rounded">blocked-by:{task.blockedBy}</span>
                      )}
                      {task.completedDate && (
                        <span className="text-[#00aa00] text-[10px] px-1 border border-[#1a3a1a] rounded">{task.completedDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-[#1a3a1a]">
                <p className="text-[#555] text-xs">
                  <span className="text-[#00aa00]">$ </span>
                  enablerdao work {project.repo}
                  <span className="text-[#333]"> # Fork & start coding</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLI + Contribute */}
      <section className="py-8 sm:py-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># 貢献の始め方</h2>
            <div className="space-y-2 text-xs">
              <p><span className="text-[#00aa00]">$ </span><span className="text-[#888]">curl -fsSL https://enablerdao.com/install.sh | bash</span></p>
              <p><span className="text-[#00aa00]">$ </span><span className="text-[#888]">enablerdao work &lt;repo-name&gt;</span><span className="text-[#555]"> # Fork + Claude Code</span></p>
              <p><span className="text-[#00aa00]">$ </span><span className="text-[#888]">enablerdao pr &lt;repo-name&gt;</span><span className="text-[#555]"> # Create PR</span></p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/install" className="inline-flex items-center gap-2 text-xs px-3 py-1.5 border border-[#1a3a1a] text-[#00ff00] hover:bg-[#1a3a1a] transition-colors rounded">
                ~/install
              </Link>
              <Link href="/metrics" className="inline-flex items-center gap-2 text-xs px-3 py-1.5 border border-[#1a3a1a] text-[#00ffff] hover:bg-[#111] transition-colors rounded">
                ~/metrics
              </Link>
              <Link href="/status" className="inline-flex items-center gap-2 text-xs px-3 py-1.5 border border-[#1a3a1a] text-[#888] hover:text-[#00ff00] hover:bg-[#111] transition-colors rounded">
                ~/status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#333] text-[10px] text-center">
            updated {r.date} — powered by Dog Pack AI — <Link href="/" className="text-[#555] hover:text-[#00ff00]">enablerdao.com</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
