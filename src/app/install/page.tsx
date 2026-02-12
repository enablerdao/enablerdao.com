import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Install - EnablerDAO CLI",
  description:
    "Install the EnablerDAO CLI to explore projects, check service status, open docs, and contribute to the ecosystem. macOS, Linux, Windows WSL supported.",
};

const commands = [
  {
    cmd: "enablerdao",
    desc: "Show welcome info, links, and quick-start guide",
  },
  {
    cmd: "enablerdao projects",
    desc: "List all 13+ EnablerDAO projects with URLs",
  },
  {
    cmd: "enablerdao status",
    desc: "Live-check HTTP status of all services",
  },
  {
    cmd: "enablerdao docs",
    desc: "Open enablerdao.com in your default browser",
  },
  {
    cmd: "enablerdao docs token",
    desc: "Open token page (also: install, security, projects, github)",
  },
  {
    cmd: "enablerdao token",
    desc: "Show EBR governance token details",
  },
  {
    cmd: "enablerdao repos",
    desc: "List GitHub repositories (live via gh CLI or cached)",
  },
  {
    cmd: "enablerdao work <repo>",
    desc: "Fork, clone, and start coding with Claude Code",
  },
  {
    cmd: "enablerdao pr <repo>",
    desc: "Commit changes and create a Pull Request",
  },
  {
    cmd: "enablerdao update",
    desc: "Update CLI to the latest version",
  },
  {
    cmd: "enablerdao help",
    desc: "Show all available commands",
  },
];

const troubleshooting = [
  {
    question: "command not found: enablerdao",
    answer:
      'The installer adds ~/.local/bin to your PATH. Run `source ~/.zshrc` (or ~/.bashrc) to reload, or open a new terminal. You can also run the CLI directly: `~/.local/bin/enablerdao`',
  },
  {
    question: "curl: command not found",
    answer:
      "macOS: curl is pre-installed. Linux: `sudo apt install curl` (Debian/Ubuntu) or `sudo yum install curl` (RHEL/CentOS). WSL: `sudo apt update && sudo apt install curl`.",
  },
  {
    question: "Permission denied during install",
    answer:
      "The script installs to ~/.local/bin/ which should not require sudo. If ~/.local/bin does not exist, the script creates it automatically. Check that your home directory is writable.",
  },
  {
    question: "'enablerdao work' fails with git errors",
    answer:
      "The `work` command requires git to be installed. Install git: macOS `xcode-select --install`, Linux `sudo apt install git`. For auto-forking, install GitHub CLI: https://cli.github.com/",
  },
  {
    question: "'enablerdao status' shows all services as DOWN",
    answer:
      "Check your internet connection. The status command uses curl to ping each service. If you are behind a proxy, configure your shell's proxy settings (http_proxy / https_proxy environment variables).",
  },
];

export default function InstallPage() {
  const installCommand =
    "curl -fsSL https://enablerdao.com/install.sh | bash";

  return (
    <div className="grid-bg">
      {/* Hero: Install command */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">
                enablerdao@web3:~$
              </span>
              <span className="text-[#00ff00] text-xs">./install.sh</span>
            </div>

            {/* ASCII banner */}
            <div className="space-y-1 mb-6 text-xs">
              <pre className="text-[#00ff00] text-glow leading-tight text-[10px] sm:text-xs mb-4 overflow-x-auto">
                {`
 ███████╗███╗   ██╗ █████╗ ██████╗ ██╗     ███████╗██████╗
 ██╔════╝████╗  ██║██╔══██╗██╔══██╗██║     ██╔════╝██╔══██╗
 █████╗  ██╔██╗ ██║███████║██████╔╝██║     █████╗  ██████╔╝
 ██╔══╝  ██║╚██╗██║██╔══██║██╔══██╗██║     ██╔══╝  ██╔══██╗
 ███████╗██║ ╚████║██║  ██║██████╔╝███████╗███████╗██║  ██║
 ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
                   ██████╗  █████╗  ██████╗
                   ██╔══██╗██╔══██╗██╔═══██╗
                   ██║  ██║███████║██║   ██║
                   ██║  ██║██╔══██║██║   ██║
                   ██████╔╝██║  ██║╚██████╔╝
                   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝`}
              </pre>
              <p>
                <span className="text-[#555]">[</span>
                <span className="text-[#00ff00]"> OK </span>
                <span className="text-[#555]">]</span>
                <span className="text-[#888]">
                  {" "}
                  EnablerDAO CLI Installer
                </span>
              </p>
              <p>
                <span className="text-[#555]">[</span>
                <span className="text-[#00ffff]">INFO</span>
                <span className="text-[#555]">]</span>
                <span className="text-[#888]">
                  {" "}
                  Explore projects, check status, contribute to the ecosystem
                </span>
              </p>
              <p className="text-[#555]">{"=".repeat(50)}</p>
            </div>

            {/* Supported platforms */}
            <div className="mb-6">
              <p className="text-[#00aa00] text-xs mb-2">
                # Supported platforms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    name: "macOS",
                    version: "12 Monterey+",
                    check: true,
                  },
                  {
                    name: "Linux",
                    version: "Ubuntu 20.04+ / Debian 11+",
                    check: true,
                  },
                  {
                    name: "Windows WSL",
                    version: "WSL 2 + Ubuntu 20.04+",
                    check: true,
                  },
                ].map((env) => (
                  <div
                    key={env.name}
                    className="flex items-center gap-2 p-2 border border-[#1a3a1a]"
                  >
                    <span className="text-[#00ff00] text-xs">
                      [{env.check ? "x" : " "}]
                    </span>
                    <div>
                      <span className="text-[#00ffff] text-xs">
                        {env.name}
                      </span>
                      <p className="text-[#555] text-[10px]">
                        {env.version}
                      </p>
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
                # No sudo required. Installs to ~/.local/bin/enablerdao
              </p>
            </div>

            {/* What it does */}
            <div className="mb-6">
              <p className="text-[#00aa00] text-xs mb-2">
                # What the installer does:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">
                    [1/3]
                  </span>
                  <div>
                    <span className="text-[#00ffff]">
                      Checking prerequisites...
                    </span>
                    <p className="text-[#555]">
                      Verifies git and curl/wget are available.
                      No Node.js or npm required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">
                    [2/3]
                  </span>
                  <div>
                    <span className="text-[#00ffff]">
                      Installing enablerdao CLI...
                    </span>
                    <p className="text-[#555]">
                      Writes a self-contained shell script to
                      ~/.local/bin/enablerdao. Adds ~/.local/bin to
                      your PATH if needed.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff00] flex-shrink-0">
                    [3/3]
                  </span>
                  <div>
                    <span className="text-[#00ffff]">
                      Setup complete!
                    </span>
                    <p className="text-[#555]">
                      The `enablerdao` command is ready. No accounts,
                      no API keys, no sign-up needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated success */}
            <div className="p-3 bg-[#111] border border-[#00ff00]/20 text-xs space-y-0.5">
              <p className="text-[#00ff00]">
                EnablerDAO CLI installed successfully!
              </p>
              <p className="text-[#888]">
                enablerdao v1.0.0
              </p>
              <p className="text-[#555]">---</p>
              <p className="text-[#888]">
                Run `enablerdao` to get started
              </p>
              <p className="text-[#888]">
                Run `enablerdao help` for all commands
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commands reference */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-3">
            <span className="text-[#00aa00]">$ </span>
            enablerdao help
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-4">
              # Available Commands
            </h2>

            <div className="space-y-1.5">
              {commands.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 text-xs"
                >
                  <code className="text-[#00ffff] font-mono whitespace-nowrap flex-shrink-0">
                    $ {item.cmd}
                  </code>
                  <span className="text-[#555] hidden sm:inline">
                    --
                  </span>
                  <span className="text-[#888] pl-4 sm:pl-0">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo: enablerdao projects */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-3">
            <span className="text-[#00aa00]">$ </span>
            enablerdao projects
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <div className="text-xs space-y-3">
              <p className="text-[#00ff00] text-glow">
                EnablerDAO Projects
              </p>
              <p className="text-[#555]">
                {"=".repeat(60)}
              </p>

              {/* AI */}
              <div>
                <p className="text-[#00ffff] mb-1">AI & Technology</p>
                <div className="space-y-0.5 pl-2">
                  {[
                    ["Chatweb.ai", "AI-driven web automation", "chatweb.ai"],
                    ["Wisbee", "Private AI assistant", "wisbee.ai"],
                    ["Elio Chat", "Offline AI chat for iPhone", "elio.love"],
                    ["News.xyz", "AI-powered news", "news.xyz"],
                  ].map(([name, desc, url]) => (
                    <p key={name}>
                      <span className="text-[#00ff00]">{name}</span>
                      <span className="text-[#555]"> -- </span>
                      <span className="text-[#888]">{desc}</span>
                      <span className="text-[#555]"> -- </span>
                      <span className="text-[#00aa00]">{url}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Business */}
              <div>
                <p className="text-[#ffaa00] mb-1">Business Tools</p>
                <div className="space-y-0.5 pl-2">
                  {[
                    ["StayFlow", "Vacation rental management", "stayflowapp.com"],
                    ["BANTO", "Invoice management", "banto.work"],
                    ["VOLT", "Live auction platform", "volt.tokyo"],
                  ].map(([name, desc, url]) => (
                    <p key={name}>
                      <span className="text-[#00ff00]">{name}</span>
                      <span className="text-[#555]"> -- </span>
                      <span className="text-[#888]">{desc}</span>
                      <span className="text-[#555]"> -- </span>
                      <span className="text-[#00aa00]">{url}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div>
                <p className="text-[#ff6666] mb-1">Security</p>
                <div className="space-y-0.5 pl-2">
                  {[
                    ["Security Scan", "Web security scanner (A-F)", "chatnews.tech"],
                    ["PhishGuard", "Phishing training", "enabler.cc"],
                    ["DojoC", "Cybersecurity learning", "dojoc.io"],
                  ].map(([name, desc, url]) => (
                    <p key={name}>
                      <span className="text-[#00ff00]">{name}</span>
                      <span className="text-[#555]"> -- </span>
                      <span className="text-[#888]">{desc}</span>
                      <span className="text-[#555]"> -- </span>
                      <span className="text-[#00aa00]">{url}</span>
                    </p>
                  ))}
                </div>
              </div>

              <p className="text-[#555]">
                Total: 13 active projects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo: enablerdao status */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-3">
            <span className="text-[#00aa00]">$ </span>
            enablerdao status
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <div className="text-xs space-y-1">
              <p className="text-[#00ff00] text-glow mb-2">
                EnablerDAO Service Status
              </p>
              <p className="text-[#555]">
                Checking live status of services...
              </p>
              <div className="mt-2 space-y-0.5 font-mono">
                {[
                  ["enablerdao.com", "UP", "142ms", "200"],
                  ["chatweb.ai", "UP", "89ms", "200"],
                  ["wisbee.ai", "UP", "124ms", "200"],
                  ["elio.love", "UP", "203ms", "200"],
                  ["stayflowapp.com", "UP", "167ms", "200"],
                  ["banto.work", "UP", "95ms", "200"],
                  ["news.xyz", "UP", "178ms", "200"],
                ].map(([svc, status, time, code]) => (
                  <p key={svc}>
                    <span className="text-[#888] inline-block w-40">
                      {svc}
                    </span>
                    <span className="text-[#00ff00] inline-block w-12">
                      {status}
                    </span>
                    <span className="text-[#555]">
                      {time} (HTTP {code})
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Script preview */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#555] text-xs mb-3">
            <span className="text-[#00aa00]">$ </span>
            head -30 install.sh
          </p>
          <div className="terminal-box p-4 sm:p-6">
            <pre className="text-xs text-[#888] overflow-x-auto leading-relaxed">
              <code>
                <span className="text-[#00aa00]">#!/bin/sh</span>
                {"\n"}
                <span className="text-[#555]">
                  # EnablerDAO CLI Installer
                </span>
                {"\n"}
                <span className="text-[#555]">
                  # Usage: curl -fsSL https://enablerdao.com/install.sh | bash
                </span>
                {"\n"}
                <span className="text-[#555]">
                  #
                </span>
                {"\n"}
                <span className="text-[#555]">
                  # This script installs the `enablerdao` command-line tool
                </span>
                {"\n"}
                <span className="text-[#555]">
                  # for interacting with EnablerDAO projects, checking service
                </span>
                {"\n"}
                <span className="text-[#555]">
                  # status, and contributing to the ecosystem.
                </span>
                {"\n\n"}
                <span className="text-[#aa66ff]">set</span>
                <span className="text-[#888]"> -e</span>
                {"\n\n"}
                <span className="text-[#555]"># What it installs:</span>
                {"\n"}
                <span className="text-[#555]">
                  #   ~/.local/bin/enablerdao    -- self-contained shell script
                </span>
                {"\n"}
                <span className="text-[#555]">
                  #   No Node.js, npm, or sudo required
                </span>
                {"\n\n"}
                <span className="text-[#555]"># The CLI supports:</span>
                {"\n"}
                <span className="text-[#555]">
                  #   enablerdao              -- welcome & info
                </span>
                {"\n"}
                <span className="text-[#555]">
                  #   enablerdao projects     -- list all projects
                </span>
                {"\n"}
                <span className="text-[#555]">
                  #   enablerdao status       -- check service status
                </span>
                {"\n"}
                <span className="text-[#555]">
                  #   enablerdao docs         -- open docs in browser
                </span>
                {"\n"}
                <span className="text-[#555]">
                  #   enablerdao work &lt;repo&gt;  -- fork, clone & start coding
                </span>
                {"\n"}
                <span className="text-[#555]">
                  #   enablerdao help         -- see all commands
                </span>
              </code>
            </pre>
            <div className="mt-3 pt-3 border-t border-[#1a3a1a]">
              <a
                href="/install.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ffff] text-xs hover:text-[#33ffff] transition-colors"
              >
                {"> "}View full install.sh source
              </a>
            </div>
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
            <h2 className="text-[#00ff00] text-sm mb-4">
              # Troubleshooting
            </h2>

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

      {/* Uninstall */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6">
            <h2 className="text-[#00ff00] text-sm mb-3">
              # Uninstall
            </h2>
            <p className="text-[#555] text-xs mb-3">
              To remove the EnablerDAO CLI:
            </p>
            <div className="relative group">
              <div className="p-3 bg-[#111] border border-[#1a3a1a] text-xs overflow-x-auto">
                <span className="text-[#00aa00]">$ </span>
                <span className="text-[#888]">
                  enablerdao uninstall
                </span>
              </div>
              <CopyButton text="enablerdao uninstall" />
            </div>
            <p className="text-[#555] text-[10px] mt-2">
              # Or manually: rm ~/.local/bin/enablerdao
            </p>
          </div>
        </div>
      </section>

      {/* Web alternative */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="terminal-box p-4 sm:p-6 text-center">
            <p className="text-[#555] text-xs mb-3">
              {`// Prefer a web browser?`}
            </p>
            <p className="text-[#00ffff] text-sm mb-2">
              Browse EnablerDAO Projects Online
            </p>
            <p className="text-[#555] text-xs mb-4">
              All project information is also available on the website.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff] text-xs hover:bg-[#00ffff]/20 transition-colors"
              >
                $ open /projects
              </Link>
              <a
                href="https://github.com/enablerdao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
              >
                $ open github.com/enablerdao
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contribute link */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#555] text-xs mb-3">
            {`// Contribute to EnablerDAO and earn EBR governance tokens`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://github.com/enablerdao"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#00ff00] text-xs hover:text-[#33ff33] transition-colors"
            >
              <span className="text-[#00aa00]">{`>`}</span> GitHub --
              Bug reports & feature requests
            </a>
            <Link
              href="/token"
              className="inline-flex items-center gap-2 text-[#888] text-xs hover:text-[#00ff00] transition-colors"
            >
              <span className="text-[#00aa00]">{`>`}</span> EBR
              Governance Token
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
