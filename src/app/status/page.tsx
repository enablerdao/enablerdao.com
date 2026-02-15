import Link from "next/link";

export const metadata = {
  title: "Project Status - EnablerDAO",
  description: "EnablerDAOの全プロジェクトのリアルタイムステータス",
};

interface Project {
  name: string;
  status: "active" | "beta" | "archived";
  traffic: string;
  tech: string[];
  url: string;
  lastUpdate: string;
  progress: number; // 0-100
  nextStep: string;
}

const projects: Project[] = [
  {
    name: "Chatweb.ai",
    status: "active",
    traffic: "289/mo",
    tech: ["Rust", "Lambda", "Next.js"],
    url: "https://chatweb.ai",
    lastUpdate: "2026-02-10",
    progress: 85,
    nextStep: "Explore Mode最適化",
  },
  {
    name: "Elio Chat",
    status: "active",
    traffic: "506/mo",
    tech: ["Swift", "Core ML"],
    url: "https://elio.love",
    lastUpdate: "2026-02-12",
    progress: 90,
    nextStep: "音声認識精度向上",
  },
  {
    name: "News.xyz",
    status: "active",
    traffic: "506/mo",
    tech: ["Next.js", "AI"],
    url: "https://news.xyz",
    lastUpdate: "2026-02-11",
    progress: 80,
    nextStep: "記事カテゴリ拡充",
  },
  {
    name: "News.cloud",
    status: "active",
    traffic: "892/mo",
    tech: ["Rust", "API"],
    url: "https://news.cloud",
    lastUpdate: "2026-02-15",
    progress: 100,
    nextStep: "News APIプラットフォーム運用中",
  },
  {
    name: "StayFlow",
    status: "active",
    traffic: "1.84k/mo",
    tech: ["React", "Node.js"],
    url: "https://stayflowapp.com",
    lastUpdate: "2026-02-13",
    progress: 95,
    nextStep: "多言語対応",
  },
  {
    name: "BANTO",
    status: "active",
    traffic: "186/mo",
    tech: ["Next.js", "PostgreSQL"],
    url: "https://banto.work",
    lastUpdate: "2026-02-09",
    progress: 75,
    nextStep: "請求書テンプレート追加",
  },
  {
    name: "Totonos",
    status: "beta",
    traffic: "103/mo",
    tech: ["React", "AWS"],
    url: "https://totonos.jp",
    lastUpdate: "2026-02-08",
    progress: 60,
    nextStep: "会計システム連携",
  },
  {
    name: "VOLT",
    status: "active",
    traffic: "205/mo",
    tech: ["Next.js", "WebSocket"],
    url: "https://volt.tokyo",
    lastUpdate: "2026-02-10",
    progress: 70,
    nextStep: "オークション機能強化",
  },
  {
    name: "Enabler",
    status: "active",
    traffic: "107/mo",
    tech: ["Next.js", "Stripe"],
    url: "https://enabler.fun",
    lastUpdate: "2026-02-07",
    progress: 65,
    nextStep: "サブスクリプション機能",
  },
  {
    name: "Security Scanner",
    status: "active",
    traffic: "113/mo",
    tech: ["Python", "Next.js"],
    url: "https://chatnews.tech",
    lastUpdate: "2026-02-11",
    progress: 85,
    nextStep: "脆弱性DB更新",
  },
  {
    name: "ChatNews.link",
    status: "active",
    traffic: "95/mo",
    tech: ["Next.js", "AI"],
    url: "https://chatnews.link",
    lastUpdate: "2026-02-15",
    progress: 80,
    nextStep: "AIニュース解説機能強化",
  },
  {
    name: "JitsuFlow",
    status: "active",
    traffic: "1.31k/mo",
    tech: ["React Native", "Firebase"],
    url: "https://jitsuflow.app",
    lastUpdate: "2026-02-12",
    progress: 88,
    nextStep: "コーチング機能追加",
  },
  {
    name: "Enabler.cc",
    status: "active",
    traffic: "150/mo",
    tech: ["Next.js", "AI"],
    url: "https://enabler.cc",
    lastUpdate: "2026-02-14",
    progress: 95,
    nextStep: "フィッシング防止SaaS運用中",
  },
  {
    name: "Enabler",
    status: "active",
    traffic: "107/mo",
    tech: ["Next.js"],
    url: "https://enabler.fun",
    lastUpdate: "2026-02-13",
    progress: 90,
    nextStep: "ライフスタイルサービス拡充",
  },
  {
    name: "SOLUNA",
    status: "active",
    traffic: "892/mo",
    tech: ["Next.js", "Events"],
    url: "https://solun.art",
    lastUpdate: "2026-02-15",
    progress: 100,
    nextStep: "ZAMNA.hawaii運営中",
  },
  {
    name: "EnablerDAO.com",
    status: "active",
    traffic: "520/mo",
    tech: ["Next.js", "Tailwind"],
    url: "https://enablerdao.com",
    lastUpdate: "2026-02-14",
    progress: 92,
    nextStep: "コミュニティ機能強化",
  },
];

function StatusBadge({ status }: { status: Project["status"] }) {
  const styles = {
    active: { bg: "bg-[#00ff00]/10", text: "text-[#00ff00]", label: "Active" },
    beta: { bg: "bg-[#ffaa00]/10", text: "text-[#ffaa00]", label: "Beta" },
    archived: { bg: "bg-[#555]/10", text: "text-[#555]", label: "Archived" },
  };
  const s = styles[status];
  return (
    <span className={`text-xs px-2 py-0.5 ${s.bg} ${s.text} border border-current`}>
      {s.label}
    </span>
  );
}

export default function StatusPage() {
  const totalTraffic = projects.reduce((sum, p) => {
    const num = parseFloat(p.traffic.replace(/[^0-9.]/g, ''));
    const multiplier = p.traffic.includes('k') ? 1000 : 1;
    return sum + (num * multiplier);
  }, 0);

  const activeProjects = projects.filter(p => p.status === "active").length;
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  return (
    <div className="grid-bg min-h-screen">
      {/* Header */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="terminal-box p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">enablerdao@status:~$</span>
              <span className="text-[#00ff00] text-xs">./monitor --all</span>
            </div>

            <h1 className="text-[#00ff00] text-2xl mb-2 text-glow">
              Project Status Dashboard
            </h1>
            <p className="text-[#888] text-sm">
              リアルタイムステータス - 最終更新: {new Date().toLocaleDateString("ja-JP")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="terminal-box p-4">
              <div className="text-[#555] text-xs mb-1">Total Projects</div>
              <div className="text-[#00ff00] text-2xl font-bold">{projects.length}</div>
            </div>
            <div className="terminal-box p-4">
              <div className="text-[#555] text-xs mb-1">Monthly Traffic</div>
              <div className="text-[#00ffff] text-2xl font-bold">{Math.round(totalTraffic).toLocaleString()}+</div>
            </div>
            <div className="terminal-box p-4">
              <div className="text-[#555] text-xs mb-1">Active Projects</div>
              <div className="text-[#00ff00] text-2xl font-bold">{activeProjects}</div>
            </div>
            <div className="terminal-box p-4">
              <div className="text-[#555] text-xs mb-1">Avg Progress</div>
              <div className="text-[#ffaa00] text-2xl font-bold">{avgProgress}%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project List */}
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.name} className="terminal-box p-4 card-hover">
                {/* Project Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[#00ff00] text-sm font-bold">{project.name}</h3>
                    <StatusBadge status={project.status} />
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ffff] text-xs hover:text-[#33ffff] transition-colors"
                  >
                    Visit →
                  </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
                  <span className="text-[#888]">
                    <span className="text-[#555]">Traffic:</span> {project.traffic}
                  </span>
                  <span className="text-[#888]">
                    <span className="text-[#555]">Updated:</span> {project.lastUpdate}
                  </span>
                  <span className="text-[#888]">
                    <span className="text-[#555]">Tech:</span> {project.tech.join(", ")}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#555] text-xs">Progress</span>
                    <span className="text-[#00ff00] text-xs">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a3a1a]">
                    <div
                      className="h-full bg-[#00ff00]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Next Step */}
                <div className="text-xs">
                  <span className="text-[#555]">Next:</span>{" "}
                  <span className="text-[#888]">{project.nextStep}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="terminal-box p-6">
            <p className="text-[#888] text-sm mb-4">
              詳細レポート:
              <Link href="/blog" className="text-[#00ffff] hover:text-[#33ffff] ml-2">
                EnablerDAO Blog →
              </Link>
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-sm hover:bg-[#00ff00]/20 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
