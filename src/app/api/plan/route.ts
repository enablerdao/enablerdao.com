import { NextResponse } from "next/server";

// Task data served as JSON for the CLI tool (`enablerdao plan`)
// Synced with /plan/page.tsx

interface Task {
  id: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "todo" | "in-progress" | "blocked" | "done";
  estimatedHours: string;
  blockedBy?: string;
  note?: string;
  completedDate?: string;
}

interface Project {
  name: string;
  repo: string;
  url: string;
  tasks: Task[];
}

const projects: Project[] = [
  {
    name: "enablerdao.com",
    repo: "enablerdao.com",
    url: "https://enablerdao.com",
    tasks: [
      { id: "ED-1", title: "/metrics ページ追加", priority: "high", status: "done", estimatedHours: "4h", completedDate: "2026-02-26" },
      { id: "ED-2", title: "/status ライブ監視ページ追加", priority: "high", status: "done", estimatedHours: "3h", completedDate: "2026-02-26" },
      { id: "ED-3", title: "Stripe Unknown商品名修正", priority: "critical", status: "done", estimatedHours: "1h", completedDate: "2026-02-26", note: "Prices API経由で全商品名取得。MRR JPY: ¥0→¥53,840" },
      { id: "ED-4", title: "GitHub Actions CI/CD", priority: "medium", status: "done", estimatedHours: "1h", completedDate: "2026-02-26" },
      { id: "ED-5", title: "CHATWEB_ADMIN_KEY設定", priority: "medium", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26", note: "cw_* APIキー生成、Fly.io secrets設定済み" },
      { id: "ED-6", title: "Solscan EBRホルダー数取得修正", priority: "low", status: "done", estimatedHours: "1h", completedDate: "2026-02-26", note: "Solscan→Solana RPC getProgramAccounts、133ホルダー確認" },
      { id: "ED-7", title: "ダッシュボード GA4→直接KPI置き換え", priority: "high", status: "in-progress", estimatedHours: "4h" },
    ],
  },
  {
    name: "BANTO",
    repo: "banto",
    url: "https://banto.work",
    tasks: [
      { id: "BT-1", title: "Stripe subscription管理実装", priority: "critical", status: "done", estimatedHours: "4h", completedDate: "2026-02-26" },
      { id: "BT-2", title: "Pricing page追加", priority: "high", status: "done", estimatedHours: "2h", completedDate: "2026-02-26" },
      { id: "BT-3", title: "banto-api デプロイ", priority: "high", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26" },
      { id: "BT-4", title: "Stripe Product+Price作成", priority: "high", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26", note: "BANTO Pro ¥2,980/mo, price_1T4ko9DqLakc8NxkMak0ZL0u" },
      { id: "BT-5", title: "drizzle-kit push (subscriptions)", priority: "high", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26", note: "subscriptionsテーブル本番push完了" },
      { id: "BT-6", title: "BANTO Stripe Checkout疎通テスト", priority: "high", status: "todo", estimatedHours: "1h" },
    ],
  },
  {
    name: "Chatweb.ai",
    repo: "nanobot",
    url: "https://chatweb.ai",
    tasks: [
      { id: "CW-1", title: "/api/v1/health エンドポイント追加", priority: "high", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26" },
      { id: "CW-2", title: "i18n言語切替UI有効化", priority: "medium", status: "done", estimatedHours: "2h", completedDate: "2026-02-26" },
      { id: "CW-3", title: "Lambda v79デプロイ", priority: "high", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26" },
      { id: "CW-4", title: "Admin Stats API実装", priority: "medium", status: "done", estimatedHours: "4h", completedDate: "2026-02-26", note: "ADMIN_KEY認証 + today_active追加、cargo check通過" },
      { id: "CW-5", title: "Lambda v80デプロイ (Admin Stats API)", priority: "high", status: "todo", estimatedHours: "0.5h" },
    ],
  },
  {
    name: "JiuFlow SSR",
    repo: "jiuflow-ssr",
    url: "https://jiuflow.art",
    tasks: [
      { id: "JF-1", title: "19名の選手プロフィール追加", priority: "high", status: "done", estimatedHours: "2h", completedDate: "2026-02-26" },
      { id: "JF-2", title: "GitHub Actions CI/CD追加", priority: "medium", status: "done", estimatedHours: "1h", completedDate: "2026-02-26" },
      { id: "JF-3", title: "GitHub remote設定 + デプロイ", priority: "high", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26", note: "yukihamada/jiuflow-ssr private repo作成、Fly.ioデプロイ完了" },
    ],
  },
  {
    name: "StayFlow",
    repo: "stayflow",
    url: "https://stayflowapp.com",
    tasks: [
      { id: "SF-1", title: "Resend DNS設定 (SPF/DKIM/DMARC)", priority: "high", status: "done", estimatedHours: "1h", completedDate: "2026-02-26", note: "SPF/DKIM verified、DMARC追加" },
      { id: "SF-2", title: "Supabase → SQLite移行", priority: "medium", status: "in-progress", estimatedHours: "40h", note: "65-70%完了。サーバー側90%、認証100%完了。USE_SQLITE有効化とデータ移行が残タスク" },
      { id: "SF-3", title: "USE_SQLITE=true 本番有効化", priority: "high", status: "todo", estimatedHours: "1h" },
    ],
  },
  {
    name: "DojoC",
    repo: "security-education",
    url: "https://dojoc.io",
    tasks: [
      { id: "DC-1", title: "サーバー復旧 (fly machine start)", priority: "critical", status: "done", estimatedHours: "0.5h", completedDate: "2026-02-26" },
    ],
  },
];

export async function GET() {
  const totalTasks = projects.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = projects.reduce((a, p) => a + p.tasks.filter((t) => t.status === "done").length, 0);
  const todoTasks = totalTasks - doneTasks;
  const criticalCount = projects.reduce(
    (a, p) => a + p.tasks.filter((t) => t.priority === "critical" && t.status !== "done").length,
    0
  );

  return NextResponse.json(
    {
      projects,
      summary: {
        totalTasks,
        doneTasks,
        todoTasks,
        criticalCount,
        updatedAt: "2026-02-26",
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
