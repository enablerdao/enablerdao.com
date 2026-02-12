import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "ブログ — EnablerDAO",
  description: "EnablerDAOの開発ブログ。プロジェクトの最新情報、技術記事、セキュリティレポートなど。",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-[#555] mb-4 font-mono">
            <span className="text-[#00aa00]">$</span>
            <span>ls ~/blog/</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e0e0e0] font-mono">
            <span className="text-[#00ff00]">~/</span>blog
          </h1>
          <p className="mt-2 text-sm text-[#666]">
            開発ログ、セキュリティレポート、プロジェクト更新情報
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border border-[#1a3a1a] rounded-lg p-5 hover:border-[#00ff00]/30 hover:bg-[#0d1a0d]/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#1a3a1a] text-[#00ff00] rounded">
                  {post.category}
                </span>
                <span className="text-xs text-[#555] font-mono">
                  {post.publishedAt}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#e0e0e0] group-hover:text-[#00ff00] transition-colors font-mono">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-[#777] leading-relaxed">
                {post.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-[#555] font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-20 text-[#555] font-mono text-sm">
            <p>No posts yet.</p>
            <p className="mt-1 text-[#333]">$ echo &quot;Coming soon...&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
