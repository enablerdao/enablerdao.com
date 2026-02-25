import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Collaboration - EnablerDAO",
  description: "Real-time screen sharing, voice chat, and collaboration platform for EnablerDAO members",
};

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
