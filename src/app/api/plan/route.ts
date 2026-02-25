import { NextResponse } from "next/server";

// Task data served as JSON for the CLI tool (`enablerdao plan`)
// This mirrors the data in /plan/page.tsx but as a JSON API

interface Task {
  id: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "todo" | "in-progress" | "blocked" | "done";
  estimatedHours: string;
  blockedBy?: string;
}

interface Project {
  name: string;
  repo: string;
  url: string;
  tasks: Task[];
}

const projects: Project[] = [
  {
    name: "StayFlow",
    repo: "stayflow",
    url: "https://stayflowapp.com",
    tasks: [
      { id: "SF-1", title: "Resendドメイン認証 (DNS設定)", priority: "critical", status: "todo", estimatedHours: "0.5h" },
      { id: "SF-2", title: "Supabase Auth SMTP設定", priority: "critical", status: "todo", estimatedHours: "0.5h" },
      { id: "SF-3", title: "Edge Functions再デプロイ", priority: "high", status: "todo", estimatedHours: "0.5h", blockedBy: "SF-1" },
      { id: "SF-4", title: "Cloudflare Pages DNS設定", priority: "high", status: "todo", estimatedHours: "0.5h" },
      { id: "SF-5", title: "SQLite完全移行 (Phase 5: Auth)", priority: "medium", status: "todo", estimatedHours: "8h" },
      { id: "SF-6", title: "Stripeウェブフック冪等性マイグレーション", priority: "high", status: "done", estimatedHours: "0.5h" },
      { id: "SF-7", title: "Supabase SERVICE_ROLE_KEY設定", priority: "critical", status: "todo", estimatedHours: "0.5h" },
    ],
  },
  {
    name: "Chatweb.ai",
    repo: "chatweb.ai",
    url: "https://chatweb.ai",
    tasks: [
      { id: "CW-1", title: "Stripe WEBHOOK_SECRET設定", priority: "critical", status: "todo", estimatedHours: "0.5h" },
      { id: "CW-2", title: "Explore Mode UIポリッシュ", priority: "medium", status: "done", estimatedHours: "4h" },
      { id: "CW-3", title: "管理ダッシュボード追加", priority: "medium", status: "todo", estimatedHours: "6h" },
    ],
  },
  {
    name: "BANTO",
    repo: "banto",
    url: "https://banto.work",
    tasks: [
      { id: "BT-1", title: "音声フローデプロイ", priority: "high", status: "done", estimatedHours: "1h" },
      { id: "BT-2", title: "Voice E2Eテスト", priority: "high", status: "todo", estimatedHours: "3h" },
      { id: "BT-3", title: "LPに音声デモ動画追加", priority: "medium", status: "todo", estimatedHours: "2h" },
      { id: "BT-4", title: "BANTO secrets設定", priority: "high", status: "todo", estimatedHours: "0.5h" },
    ],
  },
  {
    name: "DojoC",
    repo: "security-education",
    url: "https://www.dojoc.io",
    tasks: [
      { id: "DC-1", title: "Stripe本番シークレット設定", priority: "critical", status: "todo", estimatedHours: "0.5h" },
      { id: "DC-2", title: "Resendメール統合", priority: "critical", status: "done", estimatedHours: "1h" },
      { id: "DC-3", title: "決済フローE2Eテスト", priority: "high", status: "todo", estimatedHours: "2h", blockedBy: "DC-1" },
      { id: "DC-5", title: "本番デプロイ", priority: "high", status: "done", estimatedHours: "0.5h", blockedBy: "DC-1" },
      { id: "DC-6", title: "Fly.io secrets設定 (4つ)", priority: "critical", status: "todo", estimatedHours: "0.5h" },
    ],
  },
  {
    name: "Elio",
    repo: "elio",
    url: "https://elio.love",
    tasks: [
      { id: "EL-1", title: "Info.plistビルド番号修正", priority: "critical", status: "done", estimatedHours: "0.5h" },
      { id: "EL-2", title: "未コミット変更の整理", priority: "high", status: "done", estimatedHours: "1h" },
      { id: "EL-3", title: "TestFlightビルド提出", priority: "high", status: "todo", estimatedHours: "2h", blockedBy: "EL-1" },
    ],
  },
  {
    name: "ミセバンAI",
    repo: "miseban-ai",
    url: "https://misebanai.com",
    tasks: [
      { id: "MB-1", title: "Resendドメイン認証", priority: "high", status: "todo", estimatedHours: "0.5h" },
      { id: "MB-2", title: "ONNXモデル配置", priority: "medium", status: "done", estimatedHours: "1h" },
      { id: "MB-3", title: "ペアリングコードマイグレーション", priority: "high", status: "done", estimatedHours: "0.5h" },
    ],
  },
];

export async function GET() {
  const totalTasks = projects.reduce((a, p) => a + p.tasks.length, 0);
  const criticalCount = projects.reduce(
    (a, p) => a + p.tasks.filter((t) => t.priority === "critical").length,
    0
  );

  return NextResponse.json(
    {
      projects,
      summary: {
        totalTasks,
        criticalCount,
        updatedAt: "2026-02-25",
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
