"use client";

interface ProductCTACardProps {
  name: string;
  href: string;
  color: string;
  access: string;
  desc: string;
  tag: string;
  price?: string;
  users?: string;
  trial?: boolean;
}

export default function ProductCTACard({
  name,
  href,
  color,
  access,
  desc,
  tag,
  price,
  users,
  trial = false,
}: ProductCTACardProps) {
  return (
    <div className="terminal-box p-4 card-hover block group relative overflow-hidden">
      {/* Trial badge */}
      {trial && (
        <div className="absolute top-2 right-2 text-[9px] px-2 py-0.5 bg-[#ffaa00]/20 border border-[#ffaa00]/40 text-[#ffaa00]">
          7日間無料
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold" style={{ color }}>
          {name}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 border"
          style={{ color, borderColor: `${color}40` }}
        >
          {tag}
        </span>
      </div>

      {/* Description */}
      <p className="text-[#888] text-xs leading-relaxed mb-3">{desc}</p>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-3 text-[10px]">
        <span className="text-[#555]">{access} visits/mo</span>
        {users && (
          <>
            <span className="text-[#333]">|</span>
            <span className="text-[#00ffff]">{users} users</span>
          </>
        )}
      </div>

      {/* Price & CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1a3a1a]">
        {price ? (
          <span className="text-[#00ff00] text-sm font-bold">{price}〜</span>
        ) : (
          <span className="text-[#888] text-xs">無料</span>
        )}

        <div className="flex items-center gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] px-3 py-1 border transition-colors"
            style={{
              color,
              borderColor: `${color}40`,
              backgroundColor: `${color}10`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${color}10`;
            }}
          >
            無料で試す →
          </a>
        </div>
      </div>
    </div>
  );
}
