import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "実装計画 — やることリスト | EnablerDAO",
  description:
    "EnablerDAOプロジェクト群の実装計画・やることリスト。コントリビューター歓迎。Fork→Claude Code→PRの3ステップで貢献できます。",
  openGraph: {
    title: "実装計画 | EnablerDAO",
    description: "各プロジェクトのやることリスト。誰でも貢献可能。",
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

const projects: ProjectPlan[] = [
  {
    name: "StayFlow",
    repo: "stayflow",
    github: "https://github.com/enablerdao/stayflow",
    url: "https://stayflowapp.com",
    color: "#00ff00",
    description: "民泊管理SaaS — Resend移行 + SQLite完全移行",
    tasks: [
      {
        id: "SF-1",
        title: "Resendドメイン認証 (DNS設定)",
        description:
          "Resendダッシュボードでstayflowapp.comのDKIM/SPF/DMARCレコードを取得し、Cloudflare DNSに設定。noreply@stayflowapp.comからメール送信可能にする。",
        priority: "critical",
        status: "todo",
        labels: ["dns", "email"],
        estimatedHours: "0.5h",
      },
      {
        id: "SF-2",
        title: "Supabase Auth SMTP設定",
        description:
          "Supabase Dashboard > Authentication > SMTP Settings でResendのSMTPを設定。Host: smtp.resend.com, Port: 465, User: resend, Pass: RESEND_API_KEY。マジックリンク等のメールがstayflowapp.comドメインから送信されるように。",
        priority: "critical",
        status: "todo",
        labels: ["auth", "email"],
        estimatedHours: "0.5h",
      },
      {
        id: "SF-3",
        title: "Edge Functions再デプロイ",
        description:
          "メール送信元をnoreply@stayflowapp.comに統一したEdge Functionsをデプロイ: supabase functions deploy",
        priority: "high",
        status: "todo",
        labels: ["deploy"],
        estimatedHours: "0.5h",
        blockedBy: "SF-1",
      },
      {
        id: "SF-4",
        title: "Cloudflare Pages DNS (CNAME設定)",
        description:
          "stayflowapp.com → stayflowapp.pages.dev のCNAMEレコードをCloudflare DNSに設定。www.stayflowapp.comも同様。",
        priority: "high",
        status: "todo",
        labels: ["dns", "deploy"],
        estimatedHours: "0.5h",
      },
      {
        id: "SF-5",
        title: "SQLite完全移行 (Phase 5: Auth)",
        description:
          "Supabase Auth依存を解消し、Hono + better-sqlite3で認証を完結。USE_SQLITE=trueモードで全機能が動作するようにする。",
        priority: "medium",
        status: "todo",
        labels: ["backend", "auth", "sqlite"],
        estimatedHours: "8h",
      },
      {
        id: "SF-6",
        title: "Stripeウェブフック冪等性マイグレーション適用",
        description:
          "processed_webhook_eventsテーブルとincrement_user_credits RPC関数のSQLマイグレーションをSupabaseに適用。",
        priority: "high",
        status: "todo",
        labels: ["database", "stripe"],
        estimatedHours: "0.5h",
      },
      {
        id: "SF-7",
        title: "Supabase SERVICE_ROLE_KEY設定",
        description:
          "fly secrets set SUPABASE_SERVICE_ROLE_KEY=... -a stayflow-ssr でマジックリンク認証を有効化",
        priority: "critical",
        status: "todo",
        labels: ["secrets", "auth"],
        estimatedHours: "0.5h",
      },
    ],
  },
  {
    name: "Chatweb.ai",
    repo: "nanobot",
    github: "https://github.com/yukihamada/nanobot",
    url: "https://chatweb.ai",
    color: "#ffaa00",
    description: "AIチャットエージェント — Stripe + Explore Mode強化",
    tasks: [
      {
        id: "CW-1",
        title: "Stripe WEBHOOK_SECRET設定確認",
        description:
          "fly secrets set STRIPE_WEBHOOK_SECRET=whsec_... で署名検証を有効化。現在は未設定の場合503を返す仕様に変更済み。",
        priority: "critical",
        status: "todo",
        labels: ["stripe", "security"],
        estimatedHours: "0.5h",
      },
      {
        id: "CW-2",
        title: "Explore Mode UIポリッシュ",
        description:
          "複数モデル並行実行の結果表示を改善。レスポンスの比較表示、モデル名バッジ、速度表示。",
        priority: "medium",
        status: "todo",
        labels: ["frontend", "ux"],
        estimatedHours: "4h",
      },
      {
        id: "CW-3",
        title: "管理ダッシュボード追加",
        description:
          "ユーザー数、アクティブセッション、クレジット消費、プラン別集計のadminダッシュボード。DynamoDBからリアルタイム集計。",
        priority: "medium",
        status: "todo",
        labels: ["backend", "admin"],
        estimatedHours: "6h",
      },
    ],
  },
  {
    name: "BANTO",
    repo: "banto",
    github: "https://github.com/enablerdao/banto",
    url: "https://banto.work",
    color: "#ffaa00",
    description: "声だけで請求 — 音声フロー本番化",
    tasks: [
      {
        id: "BT-1",
        title: "音声フローデプロイ",
        description:
          "VoiceFlow.tsx + useVoiceRecognition + useVoiceSynthesis をプロダクションにデプロイ。Vercelまたは Fly.io。",
        priority: "high",
        status: "done",
        labels: ["deploy"],
        estimatedHours: "1h",
      },
      {
        id: "BT-2",
        title: "Voice E2Eテスト",
        description:
          "音声入力→AI処理→見積書作成→請求書変換→メール送信のフル音声フローをE2Eテスト。Playwrightで自動化。",
        priority: "high",
        status: "todo",
        labels: ["testing"],
        estimatedHours: "3h",
      },
      {
        id: "BT-3",
        title: "LPページに音声デモ動画追加",
        description:
          "/lp/onsei に実際の音声操作デモ動画を埋め込み。見積り→請求→支払確認の一連フローを1分で見せる。",
        priority: "medium",
        status: "todo",
        labels: ["marketing", "frontend"],
        estimatedHours: "2h",
      },
      {
        id: "BT-4",
        title: "BANTO secrets設定",
        description:
          "STRIPE, LINE, OPENAI, RESEND keys を banto-api に設定",
        priority: "high",
        status: "todo",
        labels: ["secrets"],
        estimatedHours: "0.5h",
      },
    ],
  },
  {
    name: "DojoC",
    repo: "security-education",
    github: "https://github.com/yukihamada/security-education",
    url: "https://www.dojoc.io",
    color: "#ff6688",
    description: "サイバーセキュリティ教育 — リリース準備",
    tasks: [
      {
        id: "DC-1",
        title: "Stripe本番シークレット設定",
        description:
          "fly secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_... JWT_SECRET=... -a security-education",
        priority: "critical",
        status: "todo",
        labels: ["stripe", "deploy"],
        estimatedHours: "0.5h",
      },
      {
        id: "DC-2",
        title: "Resendメール統合",
        description:
          "RESEND_API_KEYを設定し、購入確認・サブスク開始・解約通知メールをnoreply@dojoc.ioから送信。ドメイン認証(DNS)も必要。",
        priority: "critical",
        status: "todo",
        labels: ["email", "dns"],
        estimatedHours: "1h",
      },
      {
        id: "DC-3",
        title: "決済フローE2Eテスト",
        description:
          "Stripeテストモードでチェックアウト→Webhook→アクセス付与→コンテンツ表示の全フローを検証。",
        priority: "high",
        status: "todo",
        labels: ["testing", "stripe"],
        estimatedHours: "2h",
        blockedBy: "DC-1",
      },
      {
        id: "DC-4",
        title: "コース動画コンテンツ充実",
        description:
          "Lesson 7-12の動画解説とハンズオン教材を追加。AI Red Teamingコースを完成させる。",
        priority: "medium",
        status: "todo",
        labels: ["content"],
        estimatedHours: "10h",
      },
      {
        id: "DC-5",
        title: "本番デプロイ",
        description:
          "認証・課金・コンテンツゲーティング全て統合済み。fly deploy -a security-education --remote-only でデプロイ。",
        priority: "high",
        status: "done",
        labels: ["deploy"],
        estimatedHours: "0.5h",
        blockedBy: "DC-1",
      },
      {
        id: "DC-6",
        title: "Fly.io secrets設定 (4つ)",
        description:
          "STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, JWT_SECRET, RESEND_API_KEY を savejapan-education に設定",
        priority: "critical",
        status: "todo",
        labels: ["secrets"],
        estimatedHours: "0.5h",
      },
    ],
  },
  {
    name: "Elio",
    repo: "elio",
    github: "https://github.com/yukihamada/elio",
    url: "https://elio.love",
    color: "#00ffff",
    description: "オフラインAI iOS — TestFlight提出",
    tasks: [
      {
        id: "EL-1",
        title: "Info.plist ビルド番号修正",
        description:
          "CFBundleVersion が \"2\" のまま (正しくは \"49\")。project.pbxprojと同期させる。TestFlight拒否の原因になる。",
        priority: "critical",
        status: "done",
        labels: ["ios", "build"],
        estimatedHours: "0.5h",
      },
      {
        id: "EL-2",
        title: "未コミット変更の整理・コミット",
        description:
          "24ファイルの未コミット変更をフィーチャー別にコミット分割: LLM推論修正、UIストリーミング最適化、Mac Catalyst対応、ビルド設定。",
        priority: "high",
        status: "todo",
        labels: ["git", "cleanup"],
        estimatedHours: "1h",
      },
      {
        id: "EL-3",
        title: "TestFlightビルド & 提出",
        description:
          "DEVELOPMENT_TEAMを設定し、Fastlane経由でTestFlightにビルド提出。App Store Connect設定も必要。",
        priority: "high",
        status: "todo",
        labels: ["ios", "deploy"],
        estimatedHours: "2h",
        blockedBy: "EL-1",
      },
    ],
  },
  {
    name: "ミセバンAI",
    repo: "miseban-ai",
    github: "https://github.com/yukihamada/miseban-ai",
    url: "https://misebanai.com",
    color: "#aa66ff",
    description: "店番AI — ドメイン認証 + モデルセットアップ",
    tasks: [
      {
        id: "MB-1",
        title: "Resendドメイン認証",
        description:
          "misebanai.comのDKIM/SPF DNSレコードをResendダッシュボードから取得し設定。お問い合わせ自動返信がmisebanai.comから送信されるように。",
        priority: "high",
        status: "todo",
        labels: ["dns", "email"],
        estimatedHours: "0.5h",
      },
      {
        id: "MB-2",
        title: "ONNXモデルダウンロード・配置",
        description:
          "本番環境にONNXモデルファイルを配置。Graceful fallback実装済みなので起動は問題ないが、AI機能を有効化するために必要。",
        priority: "medium",
        status: "todo",
        labels: ["ai", "deploy"],
        estimatedHours: "1h",
      },
      {
        id: "MB-3",
        title: "ペアリングコードテーブルマイグレーション",
        description:
          "002_pairing_codes.sql を本番PostgreSQLに適用。カメラ↔スマホのペアリング機能に必要。",
        priority: "high",
        status: "done",
        labels: ["database"],
        estimatedHours: "0.5h",
      },
    ],
  },
  {
    name: "News.xyz (iOS)",
    repo: "news.xyz",
    github: "https://github.com/yukihamada/news.xyz",
    url: "https://news.xyz",
    color: "#4488ff",
    description: "AIニュースアプリ iOS — TestFlight準備",
    tasks: [
      {
        id: "NX-1",
        title: "DEVELOPMENT_TEAM設定",
        description:
          "Xcode project.pbxprojにDEVELOPMENT_TEAMを設定。Apple Developer Accountが必要。",
        priority: "high",
        status: "todo",
        labels: ["ios", "build"],
        estimatedHours: "0.5h",
      },
      {
        id: "NX-2",
        title: "AppIcon実アセット作成",
        description:
          "プレースホルダーアイコンを本番用デザインに差し替え。1024x1024 PNGで作成。",
        priority: "high",
        status: "todo",
        labels: ["design", "ios"],
        estimatedHours: "1h",
      },
      {
        id: "NX-3",
        title: "TestFlightビルド提出",
        description:
          "ビルド成功確認済み。DEVELOPMENT_TEAM設定後にTestFlightへ提出。",
        priority: "medium",
        status: "todo",
        labels: ["ios", "deploy"],
        estimatedHours: "1h",
        blockedBy: "NX-1",
      },
    ],
  },
  {
    name: "enablerdao.com",
    repo: "enablerdao.com",
    github: "https://github.com/enablerdao/enablerdao.com",
    url: "https://enablerdao.com",
    color: "#00ff00",
    description: "メインサイト — KPIダッシュボード強化",
    tasks: [
      {
        id: "ED-1",
        title: "KPIダッシュボード: Chatweb.ai Admin連携",
        description:
          "CHATWEB_ADMIN_KEYを設定し、Chatweb.aiのユーザー数・アクティブ数・チャネル別セッションをダッシュボードに表示。",
        priority: "medium",
        status: "todo",
        labels: ["dashboard", "api"],
        estimatedHours: "2h",
      },
      {
        id: "ED-2",
        title: "Solscan EBRホルダー数取得",
        description:
          "Solscan公開APIからEBRトークンホルダー数を取得してダッシュボードに表示。",
        priority: "low",
        status: "todo",
        labels: ["dashboard", "web3"],
        estimatedHours: "1h",
      },
    ],
  },
];

function priorityColor(p: Priority): string {
  switch (p) {
    case "critical":
      return "#ff4444";
    case "high":
      return "#ffaa00";
    case "medium":
      return "#00ffff";
    case "low":
      return "#555";
  }
}

function priorityLabel(p: Priority): string {
  switch (p) {
    case "critical":
      return "P0:CRITICAL";
    case "high":
      return "P1:HIGH";
    case "medium":
      return "P2:MEDIUM";
    case "low":
      return "P3:LOW";
  }
}

function statusIcon(s: Status): string {
  switch (s) {
    case "done":
      return "[x]";
    case "in-progress":
      return "[~]";
    case "blocked":
      return "[!]";
    case "todo":
      return "[ ]";
  }
}

export default function PlanPage() {
  const totalTasks = projects.reduce((a, p) => a + p.tasks.length, 0);
  const criticalTasks = projects.reduce(
    (a, p) => a + p.tasks.filter((t) => t.priority === "critical").length,
    0
  );
  const highTasks = projects.reduce(
    (a, p) => a + p.tasks.filter((t) => t.priority === "high").length,
    0
  );

  return (
    <div className="grid-bg">
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">
                enablerdao@web3:~/plan$
              </span>
              <span className="text-[#00ff00] text-xs">
                cat TODO.md --all-projects
              </span>
            </div>

            <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-3 text-glow">
              # 実装計画 — やることリスト
            </h1>
            <p className="text-[#888] text-sm mb-4">
              全プロジェクトのタスク一覧。誰でもFork→実装→PRで貢献できます。
            </p>

            {/* Summary stats */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="text-xs">
                <span className="text-[#555]">TOTAL: </span>
                <span className="text-[#00ff00]">{totalTasks}</span>
                <span className="text-[#555]"> tasks</span>
              </div>
              <div className="text-xs">
                <span className="text-[#555]">CRITICAL: </span>
                <span className="text-[#ff4444]">{criticalTasks}</span>
              </div>
              <div className="text-xs">
                <span className="text-[#555]">HIGH: </span>
                <span className="text-[#ffaa00]">{highTasks}</span>
              </div>
              <div className="text-xs">
                <span className="text-[#555]">UPDATED: </span>
                <span className="text-[#888]">2026-02-25</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao work &lt;repo&gt;
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4">
              # 貢献の始め方 (3ステップ)
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex gap-3">
                <span className="text-[#00ff00] shrink-0">1.</span>
                <div>
                  <p className="text-[#e0e0e0]">CLIをインストール & プロジェクトをFork</p>
                  <p className="text-[#555] mt-1">
                    <span className="text-[#00aa00]">$ </span>
                    <span className="text-[#888]">
                      curl -fsSL https://enablerdao.com/install.sh | bash
                    </span>
                  </p>
                  <p className="text-[#555]">
                    <span className="text-[#00aa00]">$ </span>
                    <span className="text-[#888]">
                      enablerdao work &lt;repo-name&gt;
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#00ff00] shrink-0">2.</span>
                <div>
                  <p className="text-[#e0e0e0]">Claude Codeで実装 (自動起動)</p>
                  <p className="text-[#555] mt-1">
                    <span className="text-[#888]">
                      下のタスクIDをClaude Codeに伝えるだけ。設計→実装→テストまで自動。
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#00ff00] shrink-0">3.</span>
                <div>
                  <p className="text-[#e0e0e0]">PRを作成</p>
                  <p className="text-[#555] mt-1">
                    <span className="text-[#00aa00]">$ </span>
                    <span className="text-[#888]">
                      enablerdao pr &lt;repo-name&gt;
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project tasks */}
      {projects.map((project) => (
        <section
          key={project.name}
          className="pb-8 sm:pb-12 border-t border-[#1a3a1a]"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <p className="text-[#555] text-xs mb-4">
              <span className="text-[#00aa00]">$ </span>
              enablerdao plan {project.repo}
            </p>
            <div className="terminal-box p-4 sm:p-6">
              {/* Project header */}
              <div className="flex flex-wrap items-center gap-3 mb-4 pb-3 border-b border-[#1a3a1a]">
                <h2
                  className="text-sm font-bold"
                  style={{ color: project.color }}
                >
                  {project.name}
                </h2>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#555] text-xs hover:text-[#888]"
                >
                  {project.url}
                </a>
                <span className="text-[#333] text-xs">|</span>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#00ffff] hover:text-[#00ff00] transition-colors"
                >
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  {project.github.replace("https://github.com/", "")}
                </a>
              </div>
              <p className="text-[#888] text-xs mb-4">
                {project.description}
              </p>

              {/* Tasks */}
              <div className="space-y-3">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-[#1a3a1a] rounded p-3 hover:border-[#2a4a2a] transition-colors"
                  >
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="text-[#555] text-xs shrink-0">
                        {statusIcon(task.status)}
                      </span>
                      <span
                        className="text-xs shrink-0 px-1 border rounded"
                        style={{
                          color: priorityColor(task.priority),
                          borderColor: priorityColor(task.priority) + "44",
                          backgroundColor:
                            priorityColor(task.priority) + "11",
                        }}
                      >
                        {priorityLabel(task.priority)}
                      </span>
                      <span
                        className="text-xs shrink-0 px-1 border border-[#333] rounded"
                        style={{ color: project.color }}
                      >
                        {task.id}
                      </span>
                      <span className="text-[#e0e0e0] text-xs">
                        {task.title}
                      </span>
                      {task.estimatedHours && (
                        <span className="text-[#555] text-xs ml-auto shrink-0">
                          ~{task.estimatedHours}
                        </span>
                      )}
                    </div>
                    <p className="text-[#666] text-xs mt-2 ml-6">
                      {task.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 ml-6">
                      {task.labels.map((label) => (
                        <span
                          key={label}
                          className="text-[#555] text-xs px-1 border border-[#222] rounded"
                        >
                          {label}
                        </span>
                      ))}
                      {task.blockedBy && (
                        <span className="text-[#ff4444] text-xs px-1 border border-[#441111] rounded">
                          blocked-by:{task.blockedBy}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contribute CTA */}
              <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
                <p className="text-[#555] text-xs">
                  <span className="text-[#00aa00]">$ </span>
                  enablerdao work {project.repo}
                  <span className="text-[#333]">
                    {" "}
                    # Fork & start coding
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CLI section */}
      <section className="py-8 sm:py-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            enablerdao plan --help
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4">
              # CLIからも確認できます
            </h2>
            <div className="space-y-2 text-xs">
              <p className="text-[#e0e0e0]">
                <span className="text-[#00aa00]">$ </span>
                <span className="text-[#888]">enablerdao plan</span>
                <span className="text-[#555]">
                  {" "}
                  # 全プロジェクトのタスク一覧
                </span>
              </p>
              <p className="text-[#e0e0e0]">
                <span className="text-[#00aa00]">$ </span>
                <span className="text-[#888]">
                  enablerdao plan stayflow
                </span>
                <span className="text-[#555]">
                  {" "}
                  # 特定プロジェクトのタスク
                </span>
              </p>
              <p className="text-[#e0e0e0]">
                <span className="text-[#00aa00]">$ </span>
                <span className="text-[#888]">
                  enablerdao work stayflow
                </span>
                <span className="text-[#555]">
                  {" "}
                  # Fork & Claude Codeで開発開始
                </span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/install"
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 border border-[#1a3a1a] text-[#00ff00] hover:bg-[#1a3a1a] transition-colors rounded"
              >
                ~/install — CLIインストール
              </Link>
              <a
                href="https://github.com/yukihamada"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 border border-[#1a3a1a] text-[#888] hover:text-[#00ff00] hover:bg-[#111] transition-colors rounded"
              >
                GitHub — 全リポジトリ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* EBR rewards */}
      <section className="py-8 sm:py-12 border-t border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#aa66ff] text-sm mb-4">
              # 貢献報酬: EBR Governance Token
            </h2>
            <p className="text-[#888] text-xs mb-3">
              マージされたPRには貢献度に応じてEBRトークンが付与されます。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="border border-[#1a3a1a] rounded p-3">
                <p className="text-[#00ff00]">P0 (Critical)</p>
                <p className="text-[#888] mt-1">500 EBR</p>
              </div>
              <div className="border border-[#1a3a1a] rounded p-3">
                <p className="text-[#ffaa00]">P1 (High)</p>
                <p className="text-[#888] mt-1">200 EBR</p>
              </div>
              <div className="border border-[#1a3a1a] rounded p-3">
                <p className="text-[#00ffff]">P2/P3</p>
                <p className="text-[#888] mt-1">50-100 EBR</p>
              </div>
            </div>
            <p className="text-[#555] text-xs mt-3">
              詳細:{" "}
              <Link href="/token" className="text-[#aa66ff] hover:underline">
                ~/token
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
