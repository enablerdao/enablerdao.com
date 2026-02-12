"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "pass" | "fail" | "warn";

interface CheckItem {
  label: string;
  status: Status;
  detail?: string;
}

interface SiteResult {
  domain: string;
  score: number;
  checks: CheckItem[];
}

function getScoreColor(score: number): string {
  if (score <= 30) return "#ff3333";
  if (score <= 60) return "#ffaa00";
  return "#00ff00";
}

function getScoreBarColor(score: number): string {
  if (score <= 30) return "bg-[#ff3333]";
  if (score <= 60) return "bg-[#ffaa00]";
  return "bg-[#00ff00]";
}

function getScoreLabel(score: number): string {
  if (score <= 30) return "CRITICAL";
  if (score <= 60) return "WARNING";
  return "GOOD";
}

function getScoreLabelColor(score: number): string {
  if (score <= 30) return "text-[#ff3333]";
  if (score <= 60) return "text-[#ffaa00]";
  return "text-[#00ff00]";
}

function statusIcon(status: Status): string {
  if (status === "pass") return "\u2705";
  if (status === "fail") return "\u274c";
  return "\u26a0\ufe0f";
}

function statusColor(status: Status): string {
  if (status === "pass") return "text-[#00ff00]";
  if (status === "fail") return "text-[#ff3333]";
  return "text-[#ffaa00]";
}

const sites: SiteResult[] = [
  {
    domain: "enablerdao.com",
    score: 100,
    checks: [
      { label: "SSL/TLS", status: "pass", detail: "TLSv1.3 + Let's Encrypt" },
      { label: "HTTPS", status: "pass", detail: "Forced redirect" },
      { label: "Mixed Content", status: "pass" },
      { label: "CSP", status: "pass", detail: "default-src 'self'; frame-ancestors 'none'" },
      { label: "X-Frame-Options", status: "pass", detail: "DENY" },
      { label: "X-Content-Type-Options", status: "pass", detail: "nosniff" },
      { label: "HSTS", status: "pass", detail: "max-age=63072000; includeSubDomains; preload" },
      { label: "Permissions-Policy", status: "pass", detail: "camera=(), microphone=(), geolocation=()" },
      { label: "Referrer-Policy", status: "pass", detail: "strict-origin-when-cross-origin" },
      { label: "Server\u60c5\u5831", status: "pass", detail: "\u975e\u516c\u958b" },
      { label: "SPF", status: "pass", detail: "v=spf1 -all" },
      { label: "DMARC", status: "pass", detail: "v=DMARC1; p=reject" },
      { label: "DKIM", status: "pass", detail: "Null DKIM (no email)" },
      { label: "CAA", status: "pass", detail: "letsencrypt.org" },
      { label: "DNSSEC", status: "pass", detail: "\u6709\u52b9" },
      { label: "security.txt", status: "pass", detail: "/.well-known/security.txt" },
      { label: "robots.txt", status: "pass", detail: "/robots.txt" },
    ],
  },
  {
    domain: "chatnews.tech",
    score: 100,
    checks: [
      { label: "SSL/TLS", status: "pass", detail: "TLSv1.3 + Let's Encrypt" },
      { label: "HTTPS", status: "pass", detail: "Forced redirect" },
      { label: "Mixed Content", status: "pass" },
      { label: "CSP", status: "pass", detail: "default-src 'self'; frame-ancestors 'none'" },
      { label: "X-Frame-Options", status: "pass", detail: "DENY" },
      { label: "X-Content-Type-Options", status: "pass", detail: "nosniff" },
      { label: "HSTS", status: "pass", detail: "max-age=63072000; includeSubDomains; preload" },
      { label: "Permissions-Policy", status: "pass", detail: "camera=(), microphone=(), geolocation=()" },
      { label: "Referrer-Policy", status: "pass", detail: "strict-origin-when-cross-origin" },
      { label: "Server\u60c5\u5831", status: "pass", detail: "\u975e\u516c\u958b" },
      { label: "SPF", status: "pass", detail: "v=spf1 -all" },
      { label: "DMARC", status: "pass", detail: "v=DMARC1; p=reject" },
      { label: "DKIM", status: "pass", detail: "Null DKIM (no email)" },
      { label: "CAA", status: "pass", detail: "letsencrypt.org" },
      { label: "DNSSEC", status: "pass", detail: "\u6709\u52b9" },
      { label: "security.txt", status: "pass", detail: "/.well-known/security.txt" },
      { label: "robots.txt", status: "pass", detail: "/robots.txt" },
    ],
  },
  {
    domain: "enabler.cc",
    score: 100,
    checks: [
      { label: "SSL/TLS", status: "pass", detail: "TLSv1.3 + Let's Encrypt" },
      { label: "HTTPS", status: "pass", detail: "Forced redirect" },
      { label: "Mixed Content", status: "pass" },
      { label: "CSP", status: "pass", detail: "default-src 'self'; frame-ancestors 'none'" },
      { label: "X-Frame-Options", status: "pass", detail: "DENY" },
      { label: "X-Content-Type-Options", status: "pass", detail: "nosniff" },
      { label: "HSTS", status: "pass", detail: "max-age=63072000; includeSubDomains; preload" },
      { label: "Permissions-Policy", status: "pass", detail: "camera=(), microphone=(), geolocation=()" },
      { label: "Referrer-Policy", status: "pass", detail: "strict-origin-when-cross-origin" },
      { label: "Server\u60c5\u5831", status: "pass", detail: "\u975e\u516c\u958b" },
      { label: "SPF", status: "pass", detail: "v=spf1 -all" },
      { label: "DMARC", status: "pass", detail: "v=DMARC1; p=reject" },
      { label: "DKIM", status: "pass", detail: "Configured" },
      { label: "CAA", status: "pass", detail: "letsencrypt.org" },
      { label: "DNSSEC", status: "pass", detail: "\u6709\u52b9" },
      { label: "security.txt", status: "pass", detail: "/.well-known/security.txt" },
      { label: "robots.txt", status: "pass", detail: "/robots.txt" },
    ],
  },
  {
    domain: "dojoc.io",
    score: 100,
    checks: [
      { label: "SSL/TLS", status: "pass", detail: "TLSv1.3 + Let's Encrypt" },
      { label: "HTTPS", status: "pass", detail: "Forced redirect" },
      { label: "Mixed Content", status: "pass" },
      { label: "CSP", status: "pass", detail: "default-src 'self'; frame-ancestors 'none'" },
      { label: "X-Frame-Options", status: "pass", detail: "DENY" },
      { label: "X-Content-Type-Options", status: "pass", detail: "nosniff" },
      { label: "HSTS", status: "pass", detail: "max-age=63072000; includeSubDomains; preload" },
      { label: "Permissions-Policy", status: "pass", detail: "camera=(), microphone=(), geolocation=()" },
      { label: "Referrer-Policy", status: "pass", detail: "strict-origin-when-cross-origin" },
      { label: "Server\u60c5\u5831", status: "pass", detail: "\u975e\u516c\u958b" },
      { label: "SPF", status: "pass", detail: "v=spf1 -all" },
      { label: "DMARC", status: "pass", detail: "v=DMARC1; p=reject" },
      { label: "DKIM", status: "pass", detail: "Null DKIM (no email)" },
      { label: "CAA", status: "pass", detail: "letsencrypt.org" },
      { label: "DNSSEC", status: "pass", detail: "\u6709\u52b9" },
      { label: "security.txt", status: "pass", detail: "/.well-known/security.txt" },
      { label: "robots.txt", status: "pass", detail: "/robots.txt" },
    ],
  },
  {
    domain: "yukihamada.jp",
    score: 75,
    checks: [
      { label: "SSL/TLS", status: "pass", detail: "TLSv1.3 + Google Trust Services" },
      { label: "HTTPS", status: "pass", detail: "Cloudflare Always HTTPS" },
      { label: "Mixed Content", status: "pass" },
      { label: "CSP", status: "warn", detail: "Cloudflare\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3067\u8a2d\u5b9a\u63a8\u5968" },
      { label: "X-Frame-Options", status: "warn", detail: "Cloudflare Transform Rules\u3067\u8a2d\u5b9a\u63a8\u5968" },
      { label: "X-Content-Type-Options", status: "pass", detail: "nosniff" },
      { label: "HSTS", status: "pass", detail: "max-age=31536000" },
      { label: "Permissions-Policy", status: "warn", detail: "Cloudflare\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9\u3067\u8a2d\u5b9a\u63a8\u5968" },
      { label: "Referrer-Policy", status: "pass", detail: "strict-origin-when-cross-origin" },
      { label: "Server\u60c5\u5831", status: "pass", detail: "cloudflare" },
      { label: "SPF", status: "pass", detail: "v=spf1 include:_spf.google.com" },
      { label: "DMARC", status: "pass", detail: "p=quarantine" },
      { label: "DKIM", status: "warn", detail: "Google Workspace DKIM\u8a2d\u5b9a\u63a8\u5968" },
      { label: "CAA", status: "pass", detail: "letsencrypt.org, pki.goog" },
      { label: "DNSSEC", status: "pass", detail: "\u6709\u52b9" },
    ],
  },
];

function ProgressBar({ score }: { score: number }) {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  const color = getScoreColor(score);
  return (
    <span className="text-xs">
      <span className="text-[#555]">[</span>
      <span style={{ color }}>{"\u2588".repeat(filled)}</span>
      <span className="text-[#222]">{"\u2591".repeat(empty)}</span>
      <span className="text-[#555]">]</span>
      <span style={{ color }} className="ml-2">
        {score}/100
      </span>
    </span>
  );
}

function SiteCard({ site }: { site: SiteResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const passCount = site.checks.filter((c) => c.status === "pass").length;
  const failCount = site.checks.filter((c) => c.status === "fail").length;
  const warnCount = site.checks.filter((c) => c.status === "warn").length;

  return (
    <div className="terminal-box mb-3">
      {/* Header - clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 hover:bg-[#00ff00]/5 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* Domain name */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#00ffff] text-sm">{site.domain}</span>
            <span className={`text-[10px] px-1.5 py-0.5 border ${
              site.score <= 30
                ? "border-[#ff3333]/30 text-[#ff3333]"
                : site.score <= 60
                ? "border-[#ffaa00]/30 text-[#ffaa00]"
                : "border-[#00ff00]/30 text-[#00ff00]"
            }`}>
              {getScoreLabel(site.score)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex-1">
            <ProgressBar score={site.score} />
          </div>

          {/* Summary counts */}
          <div className="flex items-center gap-3 text-[10px] flex-shrink-0">
            <span className="text-[#00ff00]">{passCount} pass</span>
            <span className="text-[#ff3333]">{failCount} fail</span>
            {warnCount > 0 && (
              <span className="text-[#ffaa00]">{warnCount} warn</span>
            )}
          </div>

          {/* Accordion indicator */}
          <span className="text-[#555] text-xs flex-shrink-0">
            {isOpen ? "[-]" : "[+]"}
          </span>
        </div>
      </button>

      {/* Expandable detail */}
      {isOpen && (
        <div className="border-t border-[#1a3a1a] p-4">
          <p className="text-[#555] text-xs mb-3">
            <span className="text-[#00aa00]">$ </span>
            security-audit --target {site.domain} --verbose
          </p>
          <div className="space-y-1">
            {site.checks.map((check) => (
              <div
                key={check.label}
                className="flex items-start gap-2 text-xs py-0.5"
              >
                <span className="flex-shrink-0 w-4 text-center">
                  {statusIcon(check.status)}
                </span>
                <span className={`flex-shrink-0 min-w-[180px] ${statusColor(check.status)}`}>
                  {check.label}
                </span>
                <span className="text-[#555]">
                  {check.detail || (check.status === "pass" ? "OK" : check.status === "fail" ? "\u672a\u8a2d\u5b9a" : "")}
                </span>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          {site.score < 60 && (
            <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
              <p className="text-[#ffaa00] text-xs">
                <span className="text-[#555]">[</span>
                <span className="text-[#ffaa00]">RECOMMEND</span>
                <span className="text-[#555]">]</span>
                {" "}\u512a\u5148\u5bfe\u5fdc: {
                  site.checks
                    .filter((c) => c.status === "fail")
                    .slice(0, 3)
                    .map((c) => c.label)
                    .join(", ")
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SecurityPage() {
  const averageScore = Math.round(
    sites.reduce((sum, s) => sum + s.score, 0) / sites.length
  );
  const totalPass = sites.reduce(
    (sum, s) => sum + s.checks.filter((c) => c.status === "pass").length,
    0
  );
  const totalFail = sites.reduce(
    (sum, s) => sum + s.checks.filter((c) => c.status === "fail").length,
    0
  );
  const totalWarn = sites.reduce(
    (sum, s) => sum + s.checks.filter((c) => c.status === "warn").length,
    0
  );

  return (
    <div className="grid-bg">
      {/* ===== Header Section - Terminal Boot ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            {/* Terminal header bar */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@web3:~$</span>
              <span className="text-[#00ff00] text-xs">./security-audit.sh --all</span>
            </div>

            {/* Boot sequence */}
            <div className="space-y-1 mb-6 text-xs">
              <p className="animate-fade-in-up">
                <span className="text-[#555]">[</span>
                <span className="text-[#00ff00]"> OK </span>
                <span className="text-[#555]">]</span>
                <span className="text-[#888]"> Loading security audit module v1.0.0...</span>
              </p>
              <p className="animate-fade-in-up-delay-1">
                <span className="text-[#555]">[</span>
                <span className="text-[#00ff00]"> OK </span>
                <span className="text-[#555]">]</span>
                <span className="text-[#888]"> Scanning 5 domains...</span>
              </p>
              <p className="animate-fade-in-up-delay-2">
                <span className="text-[#555]">[</span>
                <span className="text-[#00ff00]"> OK </span>
                <span className="text-[#555]">]</span>
                <span className="text-[#888]"> Checking SSL/TLS, headers, DNS records...</span>
              </p>
              <p className="animate-fade-in-up-delay-3">
                <span className="text-[#555]">[</span>
                <span className="text-[#00ffff]">INFO</span>
                <span className="text-[#555]">]</span>
                <span className="text-[#00ffff]"> Audit complete. Results ready.</span>
              </p>
            </div>

            {/* Title */}
            <div className="border-l-2 border-[#00ff00]/30 pl-4 mb-4 animate-fade-in-up-delay-4">
              <h1 className="text-[#00ff00] text-lg sm:text-xl text-glow">
                # セキュリティ診断結果ダッシュボード
              </h1>
              <p className="text-[#666] text-xs mt-2">
                EnablerDAO が運営・開発するWebサイトのセキュリティ状態を定期的に診断し、結果を公開しています。
                透明性のある運営の一環として、SSL/TLS設定、セキュリティヘッダー、DNS設定等を包括的にチェックしています。
              </p>
            </div>

            {/* Supervised by */}
            <div className="flex items-center gap-2 text-xs animate-fade-in-up-delay-4">
              <span className="text-[#555]">監修:</span>
              <a
                href="https://yukihamada.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ffff] hover:text-[#00ff00] transition-colors"
              >
                濱田優貴 (yukihamada.jp)
              </a>
              <span className="text-[#333]">|</span>
              <span className="text-[#555]">最終診断:</span>
              <span className="text-[#888]">2026-02-12</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Summary Stats - Log Output ===== */}
      <section className="py-8 sm:py-12 border-y border-[#1a3a1a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm">
              <span className="text-[#555]">[</span>
              <span className="text-[#00ffff]">STAT</span>
              <span className="text-[#555]">]</span>
              <span className="text-[#555]"> Scanned Domains: </span>
              <span className="text-[#00ff00] text-glow">{sites.length}</span>
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-[#555]">[</span>
              <span className="text-[#00ffff]">STAT</span>
              <span className="text-[#555]">]</span>
              <span className="text-[#555]"> Average Score: </span>
              <span style={{ color: getScoreColor(averageScore) }} className="text-glow">
                {averageScore}/100
              </span>
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-[#555]">[</span>
              <span className="text-[#00ff00]">PASS</span>
              <span className="text-[#555]">]</span>
              <span className="text-[#555]"> Total Passed: </span>
              <span className="text-[#00ff00]">{totalPass}</span>
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-[#555]">[</span>
              <span className="text-[#ff3333]">FAIL</span>
              <span className="text-[#555]">]</span>
              <span className="text-[#555]"> Total Failed: </span>
              <span className="text-[#ff3333]">{totalFail}</span>
            </p>
            <p className="text-xs sm:text-sm">
              <span className="text-[#555]">[</span>
              <span className="text-[#ffaa00]">WARN</span>
              <span className="text-[#555]">]</span>
              <span className="text-[#555]"> Total Warnings: </span>
              <span className="text-[#ffaa00]">{totalWarn}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== Score Overview - Horizontal Bar Chart ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <p className="text-[#555] text-xs mb-4">
              <span className="text-[#00aa00]">$ </span>
              security-audit --summary --chart
            </p>

            <div className="space-y-3">
              {sites.map((site) => (
                <div key={site.domain} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="text-[#00ffff] text-xs w-full sm:w-[140px] flex-shrink-0 truncate">
                    {site.domain}
                  </span>
                  <div className="flex-1 h-4 bg-[#111] border border-[#1a3a1a] relative overflow-hidden">
                    <div
                      className={`h-full ${getScoreBarColor(site.score)} transition-all duration-1000`}
                      style={{ width: `${site.score}%` }}
                    />
                    {/* Score markers */}
                    <div className="absolute top-0 left-[30%] w-px h-full bg-[#333]" />
                    <div className="absolute top-0 left-[60%] w-px h-full bg-[#333]" />
                  </div>
                  <span
                    className={`text-xs flex-shrink-0 w-[80px] text-right ${getScoreLabelColor(site.score)}`}
                  >
                    {site.score}/100
                  </span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#1a3a1a] text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 bg-[#ff3333] inline-block" />
                <span className="text-[#555]">0-30 CRITICAL</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 bg-[#ffaa00] inline-block" />
                <span className="text-[#555]">31-60 WARNING</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 bg-[#00ff00] inline-block" />
                <span className="text-[#555]">61-100 GOOD</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Individual Site Results ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#555] text-xs">
              <span className="text-[#00aa00]">$ </span>
              security-audit --verbose --all
            </p>
          </div>

          {sites.map((site) => (
            <SiteCard key={site.domain} site={site} />
          ))}
        </div>
      </section>

      {/* ===== Checklist Summary - What to Fix ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <p className="text-[#555] text-xs mb-4">
              <span className="text-[#00aa00]">$ </span>
              cat SECURITY_TODO.md
            </p>

            <div className="border-l-2 border-[#00ff00]/30 pl-4">
              <h2 className="text-[#00ff00] text-sm mb-3 text-glow">
                ## 対応完了項目
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    Content-Security-Policy (CSP) ヘッダーを全Fly.ioサイトに設定
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    HSTS max-age=63072000; includeSubDomains; preload 設定
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    X-Frame-Options: DENY + CSP frame-ancestors 設定
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    X-Content-Type-Options: nosniff 設定
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    Referrer-Policy / Permissions-Policy 設定
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    SPF / DMARC / DKIM null を全ドメインに設定
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    CAA レコード (letsencrypt.org) を全ドメインに設定
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    DNSSEC を全5ドメインで有効化
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    Server ヘッダー情報の非公開化 + X-Powered-By 無効化
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    security.txt (RFC 9116) を全サイトに配置
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[DONE]</span>
                  <span className="text-[#888]">
                    robots.txt を全サイトに配置
                  </span>
                </div>
              </div>

              <h2 className="text-[#ffaa00] text-sm mb-3 mt-6 text-glow-amber">
                ## 残りの推奨事項 (yukihamada.jp)
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[#ffaa00] flex-shrink-0">[TODO]</span>
                  <span className="text-[#888]">
                    Cloudflare Transform Rules で CSP / X-Frame-Options / Permissions-Policy を追加
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ffaa00] flex-shrink-0">[TODO]</span>
                  <span className="text-[#888]">
                    Google Workspace Admin で DKIM を有効化
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Scoring Methodology ===== */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-3">
            <span className="text-[#00aa00]">$ </span>
            cat SCORING.md
          </p>
          <div className="terminal-box p-4">
            <pre className="text-xs text-[#666] leading-relaxed whitespace-pre-wrap">
{`# スコアリング方法
各チェック項目に対して以下の基準でスコアを算出:
  - PASS  = 加点 (項目により 5-10pt)
  - FAIL  = 0pt
  - WARN  = 減点なし (部分的に設定済み)

スコア基準:
  61-100  [GOOD]     適切なセキュリティ設定
  31-60   [WARNING]  改善の余地あり
  0-30    [CRITICAL] 早急な対応が必要

診断ツール: curl, openssl, dig, nmap
最終更新: 2026-02-12`}
            </pre>
          </div>
        </div>
      </section>

      {/* ===== Back to Home CTA ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6 text-center">
            <p className="text-[#666] text-xs mb-4">
              {`// セキュリティは継続的な改善が必要です。`}
              <br />
              {`// 脆弱性の報告は contact@enablerdao.com までお願いします。`}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
              >
                <span>$</span> cd ~/
              </Link>
              <Link
                href="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                <span>$</span> ls ./projects/
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
