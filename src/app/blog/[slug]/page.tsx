import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "記事が見つかりません" };
  return {
    title: `${post.title} — EnablerDAO Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

function renderMarkdown(content: string) {
  return content.split("\n\n").map((block, i) => {
    const trimmed = block.trim();

    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-10 mb-4 text-xl font-bold text-[#00ff00] font-mono"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="mt-6 mb-3 text-lg font-semibold text-[#e0e0e0] font-mono"
        >
          {trimmed.replace("### ", "")}
        </h3>
      );
    }

    // Table
    if (trimmed.includes("|") && trimmed.includes("---")) {
      const rows = trimmed
        .split("\n")
        .filter((r) => !r.match(/^\|[\s-|]+\|$/));
      const header = rows[0];
      const body = rows.slice(1);

      const parseRow = (row: string) =>
        row
          .split("|")
          .filter((c) => c.trim() !== "")
          .map((c) => c.trim());

      const headerCells = parseRow(header);

      return (
        <div key={i} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border border-[#1a3a1a]">
            <thead>
              <tr className="bg-[#1a3a1a]">
                {headerCells.map((cell, j) => (
                  <th
                    key={j}
                    className="px-3 py-2 text-left text-[#00ff00] font-mono text-xs"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, j) => (
                <tr key={j} className="border-t border-[#1a3a1a]">
                  {parseRow(row).map((cell, k) => (
                    <td key={k} className="px-3 py-2 text-[#999] text-xs">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Code block
    if (trimmed.startsWith("```")) {
      const lines = trimmed.split("\n");
      const code = lines.slice(1, -1).join("\n");
      return (
        <pre
          key={i}
          className="my-4 p-4 bg-[#111] border border-[#1a3a1a] rounded-lg overflow-x-auto text-sm text-[#ccc] font-mono"
        >
          <code>{code}</code>
        </pre>
      );
    }

    // Unordered list
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="my-3 ml-5 space-y-1">
          {items.map((line, j) => (
            <li key={j} className="text-sm text-[#999] list-disc">
              {renderInline(line.replace(/^- /, ""))}
            </li>
          ))}
        </ul>
      );
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l));
      return (
        <ol key={i} className="my-3 ml-5 space-y-1">
          {items.map((line, j) => (
            <li key={j} className="text-sm text-[#999] list-decimal">
              {renderInline(line.replace(/^\d+\.\s/, ""))}
            </li>
          ))}
        </ol>
      );
    }

    // Paragraph
    return (
      <p key={i} className="my-3 text-sm text-[#999] leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string) {
  // Bold + inline code
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[#e0e0e0]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 bg-[#1a1a1a] border border-[#1a3a1a] rounded text-[#00ff00] text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff00] hover:underline"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-[#555] hover:text-[#00ff00] font-mono transition-colors"
        >
          <span className="text-[#00aa00]">$</span> cd ~/blog/
        </Link>

        {/* Header */}
        <div className="mt-6 mb-8 pb-6 border-b border-[#1a3a1a]">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2 py-0.5 text-[10px] font-mono bg-[#1a3a1a] text-[#00ff00] rounded">
              {post.category}
            </span>
            <span className="text-xs text-[#555] font-mono">
              {post.publishedAt}
            </span>
            <span className="text-xs text-[#555] font-mono">
              by {post.author}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#e0e0e0] font-mono leading-tight">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-[#555] font-mono">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <article className="prose-terminal">
          {renderMarkdown(post.content)}
        </article>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#1a3a1a]">
          <Link
            href="/blog"
            className="text-sm text-[#00ff00] hover:underline font-mono"
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
