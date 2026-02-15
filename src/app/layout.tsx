import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://enablerdao.com"),
  title: {
    default: "EnablerDAO - オープンソースで社会課題を解決する分散型組織",
    template: "%s | EnablerDAO",
  },
  description:
    "EnablerDAOは、オープンソースソフトウェアの開発を通じて日本のサイバーセキュリティとAI技術の発展に貢献する分散型自律組織です。SaveJapan Security Suite、Chatweb.ai等のプロジェクトを展開。",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "EnablerDAO - オープンソースで社会課題を解決する分散型組織",
    description:
      "オープンソースソフトウェアの開発を通じて日本のサイバーセキュリティとAI技術の発展に貢献する分散型自律組織。",
    url: "https://enablerdao.com",
    siteName: "EnablerDAO",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnablerDAO - オープンソースで社会課題を解決する分散型組織",
    description:
      "オープンソースソフトウェアの開発を通じて日本のサイバーセキュリティとAI技術の発展に貢献する分散型自律組織。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistMono.variable} font-mono`}>
        <Header />
        <main className="min-h-screen pt-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
