import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DAO Governance - EnablerDAO",
  description: "EnablerDAOのガバナンス - 提案、投票、トレジャリー、貢献者ダッシュボード",
};

export default function DAOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
