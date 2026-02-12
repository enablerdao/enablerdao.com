import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "インストール - Chatweb.ai を始めよう",
  description:
    "Chatweb.ai エージェントをインストールして、AI駆動のWeb自動化を始めましょう。macOS、Linux、Windows WSL対応。",
};

const troubleshooting = [
  {
    question: "Node.js がインストールされていないと表示される",
    answer: "Node.js 18以降が必要です。https://nodejs.org/ から LTS版をインストールしてください。nvm をお使いの場合は `nvm install --lts` で最新のLTS版をインストールできます。",
  },
  {
    question: "npm install -g で権限エラーが出る",
    answer: "sudoを使わずに、npmのデフォルトディレクトリを変更する方法がおすすめです。`mkdir ~/.npm-global && npm config set prefix '~/.npm-global'` を実行し、PATHに `~/.npm-global/bin` を追加してください。",
  },
  {
    question: "WSL環境でcurlが使えない",
    answer: "`sudo apt update && sudo apt install curl` でcurlをインストールしてください。WSL2の利用を推奨します。",
  },
  {
    question: "プロキシ環境下でインストールできない",
    answer: "npm のプロキシ設定を行ってください: `npm config set proxy http://proxy:port` および `npm config set https-proxy http://proxy:port`",
  },
];

export default function InstallPage() {
  const installCommand = "curl -fsSL https://enablerdao.com/install.sh | bash";

  return (
    <div className="grid-bg">
      {/* Full Terminal UI */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@web3:~$</span>
              <span className="text-[#00ff00] text-xs">./install.sh</span>
            </div>

            {/* Boot / Welcome message */}
            <div className="space-y-1 mb-6 text-xs">
              <pre className="text-[#00ff00] text-glow leading-tight text-[10px] sm:text-xs mb-4 overflow-x-auto">
{`
 ______           _     _          ___  ___  ___
|  ____|         | |   | |        |   \\/   |/ _ \\
| |__   _ __   __| |__ | | ___ _ _| |  /| | |_| |
|  __| | '_ \\ / _\` / _ \\| |/ _ \\ '_| | / | |  _  |
| |____| | | | (_| | (_) | |  __/ | | |/  | | | | |
|______|_| |_|\\__,_|\\___/|_|\\___|_| |___/|_|_| |_|
                                                    `}
              </pre>
              <p>
                <span className="text-[#555]">[</span>
                <span className="text-[#00ff00]"> OK </span>
                <span className="text-[#555]">]</span>
                <span className="text-[#888]"> EnablerDAO -- Chatweb.ai Agent Installer</span>
              </p>
              <p>
                <span className="text-[#555]">[</span>
                <span className="text-[#00ffff]">INFO</span>
                <span className="text-[#555]">]</span>
                <span className="text-[#888]"> AI駆動のWeb自動化を始めましょう</span>
              </p>
              <p className="text-[#555]">{"=".repeat(50)}</p>
            </div>

            {/* Supported environments */}
            <div className="mb-6">
              <p className="text-[#00aa00] text-xs mb-2">
                # Supported platforms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { name: "macOS", version: "12 Monterey+", check: true },
                  { name: "Linux", version: "Ubuntu 20.04+ / Debian 11+", check: true },
                  { name: "Windows WSL", version: "WSL 2 + Ubuntu 20.04+", check: true },
                ].map((env) => (
                  <div key={env.name} className="flex items-center gap-2 p-2 border border-[#1a3a1a]">
                    <span className="text-[#00ff00] text-xs">[{env.check ? "x" : " "}]</span>
                    <div>
                      <span className="text-[#00ffff] text-xs">{env.name}</span>
                      <p className="text-[#555] text-[10px]">{env.version}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Install command */}
            <div className="mb-6">
              <p className="text-[#00aa00] text-xs mb-2">
                # Quick install (1 line):
              </p>
              <div className="relative group">
                <div className="p-3 bg-[#111] border border-[#1a3a1a] text-xs overflow-x-auto">
                  <span className="text-[#00aa00]">$ </span>
                  <span className="text-[#00ff00] text-glow">
                    {installCommand}
                  </span>
                  <span className="cursor-blink" />
                </div>
                <CopyButton text={installCommand} />
              </div>
              <p className="text-[#555] text-[10px] mt-1">
                # Ctrl+C to cancel, Ctrl+V to paste
              </p>
            </div>

            {/* What the script does - simulated output */}
            <div className="mb-6">
              <p className="text-[#00aa00] text-xs mb-2">
                # Installation steps:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[1/3]</span>
                  <div>
                    <span className="text-[#00ffff]">Checking environment...</span>
                    <p className="text-[#555]">Node.js がインストールされているか確認。未インストールの場合はインストール方法を案内。</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[2/3]</span>
                  <div>
                    <span className="text-[#00ffff]">Installing chatweb-ai...</span>
                    <p className="text-[#555]">npm を使って chatweb-ai パッケージをグローバルにインストール。権限がない場合は npx で最新版を実行。</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">[3/3]</span>
                  <div>
                    <span className="text-[#00ffff]">Setup complete!</span>
                    <p className="text-[#555]">EBR トークンとNFTの受け取り方法が表示。すぐに Chatweb.ai を使い始められます。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated success output */}
            <div className="p-3 bg-[#111] border border-[#00ff00]/20 text-xs space-y-0.5">
              <p className="text-[#00ff00]">
                Installation complete!
              </p>
              <p className="text-[#888]">
                chatweb-ai installed successfully
              </p>
              <p className="text-[#555]">---</p>
              <p className="text-[#888]">
                ドキュメント: https://enablerdao.com/projects
              </p>
              <p className="text-[#888]">
                バグ報告・フィードバック: https://github.com/yukihamada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Script Preview */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-3">
            <span className="text-[#00aa00]">$ </span>
            cat install.sh
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <pre className="text-xs text-[#888] overflow-x-auto leading-relaxed">
              <code>
                <span className="text-[#00aa00]">#!/bin/bash</span>
                {"\n"}
                <span className="text-[#555]"># EnablerDAO - Chatweb.ai Agent Installer</span>
                {"\n"}
                <span className="text-[#555]"># Usage: curl -fsSL https://enablerdao.com/install.sh | bash</span>
                {"\n\n"}
                <span className="text-[#00ffff]">echo</span>
                <span className="text-[#00ff00]"> &quot;EnablerDAO -- Chatweb.ai Agent Installer&quot;</span>
                {"\n"}
                <span className="text-[#00ffff]">echo</span>
                <span className="text-[#00ff00]"> &quot;============================================&quot;</span>
                {"\n\n"}
                <span className="text-[#555]"># Check for Node.js</span>
                {"\n"}
                <span className="text-[#aa66ff]">if</span>
                <span className="text-[#888]"> ! </span>
                <span className="text-[#00ffff]">command</span>
                <span className="text-[#888]"> -v node &amp;&gt; /dev/null; </span>
                <span className="text-[#aa66ff]">then</span>
                {"\n"}
                <span className="text-[#888]">    </span>
                <span className="text-[#00ffff]">echo</span>
                <span className="text-[#00ff00]"> &quot;Node.js is required.&quot;</span>
                {"\n"}
                <span className="text-[#888]">    </span>
                <span className="text-[#aa66ff]">exit</span>
                <span className="text-[#ffaa00]"> 1</span>
                {"\n"}
                <span className="text-[#aa66ff]">fi</span>
                {"\n\n"}
                <span className="text-[#555]"># Install chatweb.ai CLI</span>
                {"\n"}
                <span className="text-[#00ffff]">echo</span>
                <span className="text-[#00ff00]"> &quot;Installing chatweb.ai...&quot;</span>
                {"\n"}
                <span className="text-[#888]">npm install -g chatweb-ai 2&gt;/dev/null || npx chatweb-ai@latest</span>
                {"\n\n"}
                <span className="text-[#00ffff]">echo</span>
                <span className="text-[#00ff00]"> &quot;Installation complete!&quot;</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-4">
            <span className="text-[#00aa00]">$ </span>
            cat FAQ.md
          </p>

          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4"># トラブルシューティング</h2>

            <div className="space-y-4">
              {troubleshooting.map((item, index) => (
                <div key={index}>
                  <p className="text-xs mb-1">
                    <span className="text-[#ffaa00]">Q:</span>{" "}
                    <span className="text-[#888]">{item.question}</span>
                  </p>
                  <p className="text-xs pl-3 border-l border-[#1a3a1a]">
                    <span className="text-[#00ff00]">A:</span>{" "}
                    <span className="text-[#555]">{item.answer}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Web Alternative */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6 text-center">
            <p className="text-[#555] text-xs mb-3">
              {`// コマンドラインが苦手な方向け`}
            </p>
            <p className="text-[#00ffff] text-sm mb-2">Web版を使う</p>
            <p className="text-[#555] text-xs mb-4">
              ブラウザから直接 Chatweb.ai を使えます。アカウント登録不要。
            </p>
            <a
              href="https://chatweb.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] text-xs hover:bg-[#00ffff]/20 transition-colors"
            >
              $ open https://chatweb.ai
            </a>
          </div>
        </div>
      </section>

      {/* Contribute link */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555] text-xs mb-3">
            {`// プロジェクトへの貢献を通じてDAOのガバナンスに参加できます`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/yukihamada"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#00ff00] text-xs hover:text-[#33ff33] transition-colors"
            >
              <span className="text-[#00aa00]">{`>`}</span> GitHub -- バグ報告・機能リクエスト
            </a>
            <Link
              href="/token"
              className="inline-flex items-center gap-2 text-[#888] text-xs hover:text-[#00ff00] transition-colors"
            >
              <span className="text-[#00aa00]">{`>`}</span> ガバナンストークンについて
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
