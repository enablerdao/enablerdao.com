import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import FeedbackWidget from "@/components/FeedbackWidget";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://enablerdao.com"),
  title: {
    default: "EnablerDAO - オープンソースで社会課題を解決する分散型組織",
    template: "%s | EnablerDAO",
  },
  description:
    "EnablerDAOは、オープンソースソフトウェアの開発を通じて日本のサイバーセキュリティとAI技術の発展に貢献する分散型自律組織(DAO)です。StayFlow、Chatweb.ai、JitsuFlow等のプロジェクトを展開。",
  keywords: [
    "EnablerDAO",
    "DAO",
    "分散型自律組織",
    "オープンソース",
    "AI",
    "サイバーセキュリティ",
    "StayFlow",
    "Chatweb.ai",
    "JitsuFlow",
    "EBRトークン",
    "Web3",
    "民泊管理",
    "AIエージェント",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "EnablerDAO - オープンソースで社会課題を解決する分散型組織",
    description:
      "オープンソースソフトウェアの開発を通じて日本のサイバーセキュリティとAI技術の発展に貢献する分散型自律組織。StayFlow、Chatweb.ai、JitsuFlow等のプロジェクトを展開。",
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
    creator: "@yukihamada",
  },
  alternates: {
    canonical: "https://enablerdao.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for Organization
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EnablerDAO",
  url: "https://enablerdao.com",
  logo: "https://enablerdao.com/favicon.svg",
  description:
    "オープンソースソフトウェアの開発を通じて日本のサイバーセキュリティとAI技術の発展に貢献する分散型自律組織",
  founder: {
    "@type": "Person",
    name: "Yuki Hamada",
    url: "https://yukihamada.jp",
  },
  sameAs: [
    "https://github.com/yukihamada",
    "https://x.com/yukihamada",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@enablerdao.com",
    contactType: "customer service",
    availableLanguage: ["Japanese", "English"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistMono.variable} font-mono`}>
        <Header />
        <main className="min-h-screen pt-10">{children}</main>
        <Footer />
        <Analytics />
        <FeedbackWidget />
      </body>
    </html>
  );
}
