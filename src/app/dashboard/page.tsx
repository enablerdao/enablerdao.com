import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Business Metrics Dashboard",
  description:
    "EBRトークンホルダー専用ビジネスKPIダッシュボード。MRR・ユーザー数・コミュニティ指標をリアルタイム表示。",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
