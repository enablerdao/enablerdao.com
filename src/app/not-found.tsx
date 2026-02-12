import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid-bg min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="terminal-box p-6 sm:p-8">
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#1a3a1a]">
            <span className="text-[#555] text-xs">enablerdao@web3:~$</span>
            <span className="text-[#ff3333] text-xs">cat this_page</span>
          </div>

          {/* Error output */}
          <div className="space-y-2 text-xs mb-6">
            <pre className="text-[#ff3333] text-glow text-2xl sm:text-4xl leading-tight mb-4">
{` _  _    ___  _  _
| || |  / _ \\| || |
| || |_| | | | || |_
|__   _| | | |__   _|
   | | | |_| |  | |
   |_|  \\___/   |_|`}
            </pre>

            <p>
              <span className="text-[#555]">[</span>
              <span className="text-[#ff3333]"> ERR </span>
              <span className="text-[#555]">]</span>
              <span className="text-[#ff3333]"> Error: ENOENT: no such file or directory</span>
            </p>
            <p>
              <span className="text-[#555]">[</span>
              <span className="text-[#ffaa00]">WARN</span>
              <span className="text-[#555]">]</span>
              <span className="text-[#888]"> お探しのページは移動または削除された可能性があります</span>
            </p>
            <p className="text-[#555]">
              {`// bash: this_page: command not found`}
            </p>
          </div>

          {/* Suggestions */}
          <div className="mb-6">
            <p className="text-[#00aa00] text-xs mb-2">
              # Did you mean:
            </p>
            <div className="space-y-1 text-xs">
              <p className="text-[#888]">
                <span className="text-[#00aa00]">$</span> cd ~/
                <span className="text-[#555]"> # トップページ</span>
              </p>
              <p className="text-[#888]">
                <span className="text-[#00aa00]">$</span> ls ./projects/
                <span className="text-[#555]"> # プロジェクト一覧</span>
              </p>
              <p className="text-[#888]">
                <span className="text-[#00aa00]">$</span> cat TOKEN_INFO.json
                <span className="text-[#555]"> # トークン情報</span>
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors"
            >
              $ cd ~/
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#111] border border-[#1a3a1a] text-[#888] text-xs hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-colors"
            >
              $ ls ./projects/
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
