import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1a3a1a] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Terminal-style links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Products */}
          <div>
            <p className="text-[#00aa00] text-xs mb-3">
              <span className="text-[#555]"># </span>ls ./projects/
            </p>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://stayflowapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  stayflowapp.com/
                </a>
              </li>
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
                  href="https://jiuflow.art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  jiuflow.art/
                </a>
              </li>
              <li>
                <a
                  href="https://elio.love"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  elio.love/
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
                  href="/projects"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  PROJECTS.md
                </Link>
              </li>
              <li>
                <Link
                  href="/ideas"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  IDEAS.md
                </Link>
              </li>
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
                  href="/dao"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  GOVERNANCE.md
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  BLOG.md
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

          {/* Resources */}
          <div>
            <p className="text-[#00aa00] text-xs mb-3">
              <span className="text-[#555]"># </span>ls ./docs/
            </p>
            <ul className="space-y-1">
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
                  href="/verify"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  verify.sh
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  SECURITY.md
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-xs text-[#555] hover:text-[#00ff00] transition-colors"
                >
                  STATUS.md
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
              <li className="text-xs text-[#555] pt-2">
                <span className="text-[#00ffff]">ENS:</span> enablerdao.eth
              </li>
              <li className="text-xs text-[#555]">
                <span className="text-[#00ffff]">SOL:</span> yukihamada.sol
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a3a1a] pt-6">
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
