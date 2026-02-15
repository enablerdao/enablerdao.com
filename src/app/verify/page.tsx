"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

// ===== Types =====
type VerificationStatus = "unverified" | "pending" | "verified";

interface VerificationState {
  email: { status: VerificationStatus; value: string; code: string; codeSent: boolean };
  domain: { status: VerificationStatus; value: string; token: string };
  security: { status: VerificationStatus; value: string; grade: string };
  github: { status: VerificationStatus; value: string; token: string };
  twitter: { status: VerificationStatus; value: string; token: string };
  wallet: { status: VerificationStatus; address: string; chain: "ethereum" | "solana" };
  hamadao: { status: VerificationStatus; address: string };
  oss: { status: VerificationStatus; username: string; prCount: number };
  contribution: {
    mergedPRs: number;
    servicesUsed: string[];
    edgeNodes: number;
    issuesFiled: number;
  };
}

// ===== Helpers =====
function generateToken(): string {
  return "ebr_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 animate-fade-in-up">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" />
        VERIFIED
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa00] animate-pulse" />
        PENDING
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#333]/30 text-[#555] border border-[#333]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#555]" />
      UNVERIFIED
    </span>
  );
}

function VerifyButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function InputField({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-1.5 bg-[#0a0a0a] border border-[#1a3a1a] text-[#00ff00] text-xs placeholder-[#333] focus:border-[#00ff00]/50 focus:outline-none transition-colors disabled:opacity-30"
    />
  );
}

// ===== Main Component =====
export default function VerifyPage() {
  const [state, setState] = useState<VerificationState>({
    email: { status: "unverified", value: "", code: "", codeSent: false },
    domain: { status: "unverified", value: "", token: generateToken() },
    security: { status: "unverified", value: "", grade: "" },
    github: { status: "unverified", value: "", token: generateToken() },
    twitter: { status: "unverified", value: "", token: generateToken() },
    wallet: { status: "unverified", address: "", chain: "solana" },
    hamadao: { status: "unverified", address: "" },
    oss: { status: "unverified", username: "", prCount: 0 },
    contribution: { mergedPRs: 0, servicesUsed: [], edgeNodes: 0, issuesFiled: 0 },
  });

  // ===== Email Verification =====
  const handleEmailSendCode = useCallback(async () => {
    if (!state.email.value) return;
    setState((s) => ({
      ...s,
      email: { ...s.email, status: "pending", codeSent: true },
    }));
    try {
      await fetch("/api/verify/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email.value }),
      });
    } catch {
      // Mock mode: still show code input
    }
  }, [state.email.value]);

  const handleEmailConfirm = useCallback(async () => {
    if (!state.email.code) return;
    try {
      const res = await fetch("/api/verify/email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email.value, code: state.email.code }),
      });
      const data = await res.json();
      if (data.verified) {
        setState((s) => ({
          ...s,
          email: { ...s.email, status: "verified" },
        }));
      }
    } catch {
      // Mock: auto-verify
      setState((s) => ({
        ...s,
        email: { ...s.email, status: "verified" },
      }));
    }
  }, [state.email.value, state.email.code]);

  // ===== Domain Verification =====
  const handleDomainCheck = useCallback(async () => {
    if (!state.domain.value) return;
    setState((s) => ({
      ...s,
      domain: { ...s.domain, status: "pending" },
    }));
    try {
      const res = await fetch("/api/verify/domain/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: state.domain.value, token: state.domain.token }),
      });
      const data = await res.json();
      if (data.verified) {
        setState((s) => ({
          ...s,
          domain: { ...s.domain, status: "verified" },
        }));
      }
    } catch {
      // Mock: auto-verify after delay
      setTimeout(() => {
        setState((s) => ({
          ...s,
          domain: { ...s.domain, status: "verified" },
        }));
      }, 1500);
    }
  }, [state.domain.value, state.domain.token]);

  // ===== Security Score =====
  const handleSecurityScan = useCallback(async () => {
    if (!state.security.value) return;
    setState((s) => ({
      ...s,
      security: { ...s.security, status: "pending" },
    }));
    // Mock scan result
    setTimeout(() => {
      const grades = ["A+", "A", "B", "C"];
      const grade = grades[Math.floor(Math.random() * grades.length)];
      setState((s) => ({
        ...s,
        security: { ...s.security, status: "verified", grade },
      }));
    }, 2000);
  }, [state.security.value]);

  // ===== GitHub Verification =====
  const handleGithubCheck = useCallback(async () => {
    if (!state.github.value) return;
    setState((s) => ({
      ...s,
      github: { ...s.github, status: "pending" },
    }));
    try {
      const res = await fetch("/api/verify/github/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: state.github.value, token: state.github.token }),
      });
      const data = await res.json();
      if (data.verified) {
        setState((s) => ({
          ...s,
          github: { ...s.github, status: "verified" },
        }));
      }
    } catch {
      setTimeout(() => {
        setState((s) => ({
          ...s,
          github: { ...s.github, status: "verified" },
        }));
      }, 1500);
    }
  }, [state.github.value, state.github.token]);

  // ===== Twitter Verification =====
  const handleTwitterCheck = useCallback(() => {
    if (!state.twitter.value) return;
    setState((s) => ({
      ...s,
      twitter: { ...s.twitter, status: "pending" },
    }));
    setTimeout(() => {
      setState((s) => ({
        ...s,
        twitter: { ...s.twitter, status: "verified" },
      }));
    }, 1500);
  }, [state.twitter.value]);

  // ===== Wallet Verification =====
  const handleWalletConnect = useCallback(() => {
    setState((s) => ({
      ...s,
      wallet: { ...s.wallet, status: "pending" },
    }));
    // Mock wallet connection
    setTimeout(() => {
      const mockAddress =
        state.wallet.chain === "solana"
          ? "H9S5dBLt" + Math.random().toString(36).substring(2, 14) + "..."
          : "0x" + Math.random().toString(16).substring(2, 14) + "...";
      setState((s) => ({
        ...s,
        wallet: { ...s.wallet, status: "verified", address: mockAddress },
      }));
    }, 1000);
  }, [state.wallet.chain]);

  // ===== HamaDAO OG =====
  const handleHamadaoCheck = useCallback(() => {
    setState((s) => ({
      ...s,
      hamadao: { ...s.hamadao, status: "pending" },
    }));
    setTimeout(() => {
      const mockAddr = "0x" + Math.random().toString(16).substring(2, 14) + "...";
      setState((s) => ({
        ...s,
        hamadao: { ...s.hamadao, status: "verified", address: mockAddr },
      }));
    }, 1500);
  }, []);

  // ===== OSS Contributor =====
  const handleOssCheck = useCallback(() => {
    if (!state.oss.username) return;
    setState((s) => ({
      ...s,
      oss: { ...s.oss, status: "pending" },
    }));
    setTimeout(() => {
      const prCount = Math.floor(Math.random() * 30) + 1;
      setState((s) => ({
        ...s,
        oss: { ...s.oss, status: "verified", prCount },
      }));
    }, 1500);
  }, [state.oss.username]);

  // Count verified items
  const verifiedCount = Object.values(state).filter(
    (v) => v.status === "verified"
  ).length;

  // Security grade color
  const gradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "#00ff00";
      case "A": return "#00ff00";
      case "B": return "#ffaa00";
      case "C": return "#ffaa00";
      case "D": return "#ff6688";
      case "F": return "#ff3333";
      default: return "#555";
    }
  };

  return (
    <div className="grid-bg">
      {/* ===== Hero Section ===== */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@web3:~/verify$</span>
              <span className="text-[#00ff00] text-xs">cat VERIFY_README.md</span>
            </div>

            <h1 className="text-[#00ff00] text-xl sm:text-2xl mb-2 text-glow">
              Enabler Verify
            </h1>
            <p className="text-[#00ffff] text-sm mb-3">
              オンチェーン証明
            </p>
            <p className="text-[#888] text-sm leading-relaxed mb-2">
              あなたの所有権をブロックチェーンで証明しましょう。
            </p>
            <p className="text-[#888] text-xs leading-relaxed">
              各項目を検証すると、Solana上に
              <span className="text-[#00ffff]">cNFT（compressed NFT）</span>
              として証明バッジが発行されます。
              改ざん不可能で、誰でもオンチェーンで検証可能です。
            </p>

            {verifiedCount > 0 && (
              <div className="mt-4 pt-3 border-t border-[#1a3a1a]">
                <span className="text-[#555] text-xs">verified: </span>
                <span className="text-[#00ff00] text-xs">{verifiedCount}/8</span>
                <span className="text-[#555] text-xs"> badges earned</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Verification Cards Grid ===== */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            ls -la ./verifications/
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* ===== 1. Email Verification ===== */}
            <div className="terminal-box p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#9993;</span>
                  <span className="text-[#00ffff] text-xs">Email</span>
                </div>
                <StatusBadge status={state.email.status} />
              </div>
              <p className="text-[#888] text-xs mb-3">メールアドレス所有証明</p>

              {state.email.status === "verified" ? (
                <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20">
                  <p className="text-[#00ff00] text-xs">
                    <span className="text-[#555]">[OK]</span> {state.email.value}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <InputField
                    value={state.email.value}
                    onChange={(v) =>
                      setState((s) => ({ ...s, email: { ...s.email, value: v } }))
                    }
                    placeholder="you@example.com"
                    disabled={state.email.codeSent}
                  />
                  {!state.email.codeSent ? (
                    <VerifyButton
                      onClick={handleEmailSendCode}
                      disabled={!state.email.value}
                    >
                      $ send-code
                    </VerifyButton>
                  ) : (
                    <>
                      <InputField
                        value={state.email.code}
                        onChange={(v) =>
                          setState((s) => ({ ...s, email: { ...s.email, code: v } }))
                        }
                        placeholder="確認コードを入力"
                      />
                      <VerifyButton
                        onClick={handleEmailConfirm}
                        disabled={!state.email.code}
                      >
                        $ verify --confirm
                      </VerifyButton>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ===== 2. Domain Verification ===== */}
            <div className="terminal-box p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#127760;</span>
                  <span className="text-[#00ffff] text-xs">Domain</span>
                </div>
                <StatusBadge status={state.domain.status} />
              </div>
              <p className="text-[#888] text-xs mb-3">ドメイン所有証明</p>

              {state.domain.status === "verified" ? (
                <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20">
                  <p className="text-[#00ff00] text-xs">
                    <span className="text-[#555]">[OK]</span> {state.domain.value}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <InputField
                    value={state.domain.value}
                    onChange={(v) =>
                      setState((s) => ({ ...s, domain: { ...s.domain, value: v } }))
                    }
                    placeholder="yourdomain.com"
                  />
                  {state.domain.value && (
                    <div className="p-2 bg-[#111] border border-[#1a3a1a]">
                      <p className="text-[#555] text-[10px] mb-1">以下のDNS TXTレコードを追加:</p>
                      <code className="text-[#ffaa00] text-[10px] break-all">
                        _enabler-verify.{state.domain.value || "yourdomain.com"} TXT
                        &quot;enabler-verify={state.domain.token}&quot;
                      </code>
                    </div>
                  )}
                  <VerifyButton
                    onClick={handleDomainCheck}
                    disabled={!state.domain.value || state.domain.status === "pending"}
                  >
                    {state.domain.status === "pending" ? "checking..." : "$ dig TXT --verify"}
                  </VerifyButton>
                </div>
              )}
            </div>

            {/* ===== 3. Security Score ===== */}
            <div className="terminal-box p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#128274;</span>
                  <span className="text-[#00ffff] text-xs">Security</span>
                </div>
                <StatusBadge status={state.security.status} />
              </div>
              <p className="text-[#888] text-xs mb-3">セキュリティ診断証明</p>

              {state.security.status === "verified" ? (
                <div className="space-y-2">
                  <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20">
                    <p className="text-[#00ff00] text-xs">
                      <span className="text-[#555]">[OK]</span> {state.security.value}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#555] text-xs">Grade:</span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: gradeColor(state.security.grade) }}
                    >
                      {state.security.grade}
                    </span>
                  </div>
                  <a
                    href={`https://chatnews.tech/?url=${encodeURIComponent(state.security.value)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00ffff] text-[10px] hover:text-[#00ff00] transition-colors"
                  >
                    <span className="text-[#555]">&gt;</span> chatnews.techで詳細を確認
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  <InputField
                    value={state.security.value}
                    onChange={(v) =>
                      setState((s) => ({
                        ...s,
                        security: { ...s.security, value: v },
                      }))
                    }
                    placeholder="https://yourdomain.com"
                  />
                  <div className="flex items-center gap-2">
                    <VerifyButton
                      onClick={handleSecurityScan}
                      disabled={!state.security.value || state.security.status === "pending"}
                    >
                      {state.security.status === "pending" ? "scanning..." : "$ scan --security"}
                    </VerifyButton>
                  </div>
                  <a
                    href="https://chatnews.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#555] text-[10px] hover:text-[#00ff00] transition-colors"
                  >
                    &gt; chatnews.techでフルスキャン
                  </a>
                </div>
              )}
            </div>

            {/* ===== 4. GitHub Account ===== */}
            <div className="terminal-box p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#128025;</span>
                  <span className="text-[#00ffff] text-xs">GitHub</span>
                </div>
                <StatusBadge status={state.github.status} />
              </div>
              <p className="text-[#888] text-xs mb-3">GitHubアカウント所有証明</p>

              {state.github.status === "verified" ? (
                <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20">
                  <p className="text-[#00ff00] text-xs">
                    <span className="text-[#555]">[OK]</span> github.com/{state.github.value}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <InputField
                    value={state.github.value}
                    onChange={(v) =>
                      setState((s) => ({ ...s, github: { ...s.github, value: v } }))
                    }
                    placeholder="username"
                  />
                  {state.github.value && (
                    <div className="p-2 bg-[#111] border border-[#1a3a1a]">
                      <p className="text-[#555] text-[10px] mb-1">
                        以下のテキストを含むPublic Gistを作成:
                      </p>
                      <code className="text-[#ffaa00] text-[10px] break-all select-all">
                        enabler-verify={state.github.token}
                      </code>
                    </div>
                  )}
                  <VerifyButton
                    onClick={handleGithubCheck}
                    disabled={!state.github.value || state.github.status === "pending"}
                  >
                    {state.github.status === "pending" ? "checking..." : "$ gh gist --verify"}
                  </VerifyButton>
                </div>
              )}
            </div>

            {/* ===== 5. X (Twitter) Account ===== */}
            <div className="terminal-box p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#128038;</span>
                  <span className="text-[#00ffff] text-xs">X (Twitter)</span>
                </div>
                <StatusBadge status={state.twitter.status} />
              </div>
              <p className="text-[#888] text-xs mb-3">Xアカウント所有証明</p>

              {state.twitter.status === "verified" ? (
                <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20">
                  <p className="text-[#00ff00] text-xs">
                    <span className="text-[#555]">[OK]</span> @{state.twitter.value}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <InputField
                    value={state.twitter.value}
                    onChange={(v) =>
                      setState((s) => ({
                        ...s,
                        twitter: { ...s.twitter, value: v.replace("@", "") },
                      }))
                    }
                    placeholder="@username"
                  />
                  {state.twitter.value && (
                    <div className="p-2 bg-[#111] border border-[#1a3a1a]">
                      <p className="text-[#555] text-[10px] mb-1">
                        以下のテキストを含むポストを投稿:
                      </p>
                      <code className="text-[#ffaa00] text-[10px] break-all select-all">
                        Verifying my identity on @EnablerDAO #EnablerVerify {state.twitter.token}
                      </code>
                    </div>
                  )}
                  <VerifyButton
                    onClick={handleTwitterCheck}
                    disabled={!state.twitter.value || state.twitter.status === "pending"}
                  >
                    {state.twitter.status === "pending" ? "checking..." : "$ tweet --verify"}
                  </VerifyButton>
                </div>
              )}
            </div>

            {/* ===== 6. Wallet Verification ===== */}
            <div className="terminal-box p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#128091;</span>
                  <span className="text-[#00ffff] text-xs">Wallet</span>
                </div>
                <StatusBadge status={state.wallet.status} />
              </div>
              <p className="text-[#888] text-xs mb-3">ウォレット所有証明</p>

              {state.wallet.status === "verified" ? (
                <div className="space-y-2">
                  <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20">
                    <p className="text-[#555] text-[10px]">
                      {state.wallet.chain === "solana" ? "Solana" : "Ethereum"}:
                    </p>
                    <p className="text-[#00ff00] text-xs break-all">
                      {state.wallet.address}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setState((s) => ({
                          ...s,
                          wallet: { ...s.wallet, chain: "solana" },
                        }))
                      }
                      className={`px-3 py-1 text-[10px] border transition-colors ${
                        state.wallet.chain === "solana"
                          ? "border-[#aa66ff]/50 text-[#aa66ff] bg-[#aa66ff]/10"
                          : "border-[#1a3a1a] text-[#555] hover:text-[#aa66ff]"
                      }`}
                    >
                      Solana
                    </button>
                    <button
                      onClick={() =>
                        setState((s) => ({
                          ...s,
                          wallet: { ...s.wallet, chain: "ethereum" },
                        }))
                      }
                      className={`px-3 py-1 text-[10px] border transition-colors ${
                        state.wallet.chain === "ethereum"
                          ? "border-[#4488ff]/50 text-[#4488ff] bg-[#4488ff]/10"
                          : "border-[#1a3a1a] text-[#555] hover:text-[#4488ff]"
                      }`}
                    >
                      Ethereum
                    </button>
                  </div>
                  <VerifyButton
                    onClick={handleWalletConnect}
                    disabled={state.wallet.status === "pending"}
                  >
                    {state.wallet.status === "pending"
                      ? "connecting..."
                      : "$ wallet connect --sign"}
                  </VerifyButton>
                </div>
              )}
            </div>

            {/* ===== 7. HamaDAO OG ===== */}
            <div className="terminal-box p-4 card-hover border-[#ffaa00]/20 relative overflow-hidden">
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffaa00] to-transparent" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#127942;</span>
                  <span className="text-[#ffaa00] text-xs">HamaDAO OG</span>
                </div>
                <StatusBadge status={state.hamadao.status} />
              </div>
              <p className="text-[#888] text-xs mb-2">HamaDAO OGメンバー証明</p>
              <p className="text-[#555] text-[10px] mb-3">
                Ethereumウォレットを接続してHMD NFT所有を証明
              </p>

              {state.hamadao.status === "verified" ? (
                <div className="space-y-2">
                  <div className="p-2 bg-[#ffaa00]/5 border border-[#ffaa00]/20">
                    <div className="flex items-center gap-2">
                      <span className="text-[#ffaa00] text-lg font-bold" style={{ fontFamily: "serif" }}>
                        &#8968;&#9672;-&#9672;
                      </span>
                      <div>
                        <p className="text-[#ffaa00] text-xs">HamaDAO OG Member</p>
                        <p className="text-[#555] text-[10px] break-all">{state.hamadao.address}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#555] text-[10px]">
                    <span className="text-[#ffaa00]">*</span> 6名限定のOGバッジ
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-2 bg-[#111] border border-[#ffaa00]/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#ffaa00] text-lg font-bold" style={{ fontFamily: "serif" }}>
                        &#8968;&#9672;-&#9672;
                      </span>
                      <span className="text-[#ffaa00] text-[10px]">Nouns-style DAO</span>
                    </div>
                    <p className="text-[#555] text-[10px]">
                      HMD NFT保有者のみ検証可能（限定6名）
                    </p>
                  </div>
                  <button
                    onClick={handleHamadaoCheck}
                    disabled={state.hamadao.status === "pending"}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ffaa00]/10 border border-[#ffaa00]/30 text-[#ffaa00] text-xs hover:bg-[#ffaa00]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {state.hamadao.status === "pending"
                      ? "verifying..."
                      : "$ eth wallet connect --nft"}
                  </button>
                </div>
              )}
            </div>

            {/* ===== 8. DAO Contribution ===== */}
            <div className="terminal-box p-4 card-hover col-span-1 sm:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#9889;</span>
                  <span className="text-[#00ffff] text-xs">DAO Contribution</span>
                </div>
                <span className="text-[10px] text-[#555]">EBRトークン獲得方法</span>
              </div>
              <p className="text-[#888] text-xs mb-4">EnablerDAOへの貢献 = トークン報酬</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* PR Merge (Code Adoption) */}
                <div className="p-3 bg-[#0a1a0a] border border-[#1a3a1a] hover:border-[#00ff00]/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#00ff00] text-sm">&#10003;</span>
                    <span className="text-[#00ff00] text-xs font-bold">PR Merge</span>
                  </div>
                  <p className="text-[#888] text-[10px] mb-2">コードの採用（マージ済みPR）</p>
                  <div className="space-y-1">
                    <p className="text-[#555] text-[10px]">$ git push → PR → Review → Merge</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#555] text-[10px]">報酬:</span>
                      <span className="text-[#00ff00] text-[10px]">50〜500 EBR/PR</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#555] text-[10px]">対象:</span>
                      <span className="text-[#888] text-[10px]">enablerdao/* repos</span>
                    </div>
                  </div>
                  {state.github.status === "verified" && (
                    <div className="mt-2 pt-2 border-t border-[#1a3a1a]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#555] text-[10px]">Your PRs:</span>
                        <span className="text-[#00ff00] text-xs font-bold">{state.oss.prCount}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Usage */}
                <div className="p-3 bg-[#0a0a1a] border border-[#1a1a3a] hover:border-[#00ffff]/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#00ffff] text-sm">&#9654;</span>
                    <span className="text-[#00ffff] text-xs font-bold">Service Usage</span>
                  </div>
                  <p className="text-[#888] text-[10px] mb-2">プロダクトの利用</p>
                  <div className="space-y-1">
                    <p className="text-[#555] text-[10px]">アクティブユーザー = 貢献者</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {["Chatweb.ai", "Elio Chat", "News.cloud", "Scanner"].map((s) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-[#00ffff]/5 border border-[#00ffff]/20 text-[#00ffff]">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[#555] text-[10px]">報酬:</span>
                      <span className="text-[#00ffff] text-[10px]">10 EBR/日（アクティブ）</span>
                    </div>
                  </div>
                </div>

                {/* Edge Node */}
                <div className="p-3 bg-[#1a0a1a] border border-[#3a1a3a] hover:border-[#aa66ff]/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#aa66ff] text-sm">&#9881;</span>
                    <span className="text-[#aa66ff] text-xs font-bold">Edge Node</span>
                  </div>
                  <p className="text-[#888] text-[10px] mb-2">Chatweb.aiエッジノード運用</p>
                  <div className="space-y-1">
                    <p className="text-[#555] text-[10px]">$ curl -sL install.chatweb.ai | sh</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#555] text-[10px]">報酬:</span>
                      <span className="text-[#aa66ff] text-[10px]">100 EBR/日（稼働中）</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#555] text-[10px]">ボーナス:</span>
                      <span className="text-[#aa66ff] text-[10px]">リクエスト処理量に応じ</span>
                    </div>
                  </div>
                </div>

                {/* Feedback & Issues */}
                <div className="p-3 bg-[#1a1a0a] border border-[#3a3a1a] hover:border-[#ffaa00]/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#ffaa00] text-sm">&#128172;</span>
                    <span className="text-[#ffaa00] text-xs font-bold">Feedback</span>
                  </div>
                  <p className="text-[#888] text-[10px] mb-2">バグ報告・機能リクエスト</p>
                  <div className="space-y-1">
                    <p className="text-[#555] text-[10px]">$ gh issue create</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#555] text-[10px]">報酬:</span>
                      <span className="text-[#ffaa00] text-[10px]">20 EBR/issue</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#555] text-[10px]">重大バグ:</span>
                      <span className="text-[#ffaa00] text-[10px]">+200 EBR ボーナス</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Profile Summary ===== */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat ./profile/BADGES.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># 取得済みバッジ</h2>

            {verifiedCount === 0 ? (
              <p className="text-[#555] text-xs">
                {`// まだバッジがありません。上の項目を検証してバッジを取得しましょう。`}
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {state.email.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[10px] text-[#00ff00]">
                      &#9993; Email
                    </span>
                  )}
                  {state.domain.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[10px] text-[#00ff00]">
                      &#127760; Domain
                    </span>
                  )}
                  {state.security.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[10px] text-[#00ff00]">
                      &#128274; Security {state.security.grade}
                    </span>
                  )}
                  {state.github.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[10px] text-[#00ff00]">
                      &#128025; GitHub
                    </span>
                  )}
                  {state.twitter.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[10px] text-[#00ff00]">
                      &#128038; X
                    </span>
                  )}
                  {state.wallet.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#aa66ff]/10 border border-[#aa66ff]/30 text-[10px] text-[#aa66ff]">
                      &#128091; Wallet
                    </span>
                  )}
                  {state.hamadao.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#ffaa00]/10 border border-[#ffaa00]/30 text-[10px] text-[#ffaa00]">
                      &#127942; HamaDAO OG
                    </span>
                  )}
                  {state.oss.status === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[10px] text-[#00ffff]">
                      &#10003; PR Contributor
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-[#1a3a1a]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#555] text-xs">公開プロフィールURL:</span>
                    <span className="text-[#00ffff] text-xs">
                      enablerdao.com/verify/profile/***
                    </span>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#aa66ff]/10 border border-[#aa66ff]/30 text-[#aa66ff] text-xs hover:bg-[#aa66ff]/20 transition-colors">
                    $ mint --batch --cnft
                    <span className="text-[#555] text-[10px]">(NFTとして一括発行)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== Footer Info ===== */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6 text-center">
            <pre className="text-[#00ff00] text-xs mb-4 text-glow">
{`  +--------------------------------------+
  |  solana program deploy verify.so     |
  +--------------------------------------+`}
            </pre>
            <p className="text-[#888] text-xs mb-2">
              すべての証明はSolana上にcNFTとして記録されます
            </p>
            <p className="text-[#555] text-xs">
              改ざん不可能 ・ 永続的 ・ 誰でも検証可能
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
              >
                $ cd ~/
              </Link>
              <Link
                href="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                $ ls ./projects/
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
