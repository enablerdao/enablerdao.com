import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アイデア投稿 - みんなのアイデアが次のプロダクトに",
  description:
    "EnablerDAOのアイデア投稿ページ。日常の不便やビジネス課題を投稿して、みんなで次のプロダクトを作りましょう。採用されたアイデアにはEBRトークン報酬があります。",
  openGraph: {
    title: "アイデア投稿 | EnablerDAO",
    description:
      "あなたのアイデアが次のプロダクトになる。技術知識不要、日常の「こんなのあったらいいな」を投稿しよう。",
  },
};

export default function IdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
