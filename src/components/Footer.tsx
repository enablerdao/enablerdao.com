import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1a3a1a] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Terminal-style links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Projects */}
          <div>
            <p className="text-[#00aa00] text-xs mb-3">
              <span className="text-[#555]"># </span>ls ./projects/
            </p>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://chatweb.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  chatweb.ai/
                </a>
              </li>
              <li>
                <a
                  href="https://chatnews.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  chatnews.tech/
                </a>
              </li>
              <li>
                <a
                  href="https://enabler.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  enabler.cc/
                </a>
              </li>
              <li>
                <a
                  href="https://www.dojoc.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  dojoc.io/
                </a>
              </li>
            </ul>
          </div>

          {/* DAO */}
          <div>
            <p className="text-[#00aa00] text-xs mb-3">
              <span className="text-[#555]"># </span>ls ./dao/
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/token"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  EBR_TOKEN.sol
                </Link>
              </li>
              <li>
                <Link
                  href="/install"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  install.sh
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  PROJECTS.md
                </Link>
              </li>
              <li>
                <Link
                  href="/verify"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  verify.sh
                </Link>
              </li>
              <li>
                <Link
                  href="/qa"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  QA_LOG.md
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <p className="text-[#00aa00] text-xs mb-3">
              <span className="text-[#555]"># </span>cat LINKS.md
            </p>
            <ul className="space-y-1">
              <li>
                <a
                  href="mailto:contact@enablerdao.com"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  contact@enablerdao.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/yukihamada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  github.com/yukihamada
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/yukihamada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  x.com/yukihamada
                </a>
              </li>
            </ul>
          </div>

          {/* ENS / Web3 */}
          <div>
            <p className="text-[#00aa00] text-xs mb-3">
              <span className="text-[#555]"># </span>whois
            </p>
            <ul className="space-y-1">
              <li className="text-xs text-[#555]">
                <span className="text-[#00ffff]">ENS:</span> enablerdao.eth
              </li>
              <li className="text-xs text-[#555]">
                <span className="text-[#00ffff]">ENS:</span> yukihamada.eth
              </li>
              <li className="text-xs text-[#555]">
                <span className="text-[#00ffff]">NET:</span> Solana + Ethereum
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a3a1a] pt-6">
          {/* ASCII art mini border */}
          <pre className="text-[#1a3a1a] text-[10px] leading-tight mb-4 hidden sm:block select-none">
{`+${"=".repeat(72)}+`}
          </pre>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs">
              <span className="text-[#333]">
                &copy; {new Date().getFullYear()} EnablerDAO
              </span>
              <span className="hidden sm:inline text-[#1a3a1a]">|</span>
              <span className="text-[#333]">
                Created by{" "}
                <a
                  href="https://yukihamada.jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  Yuki Hamada
                </a>
              </span>
            </div>
            <div className="text-xs text-[#00aa00]">
              <span className="text-[#555]">Process exited with code </span>
              <span className="text-[#00ff00]">0</span>
              <span className="text-[#555]"> (success)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
