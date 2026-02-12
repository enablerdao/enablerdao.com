"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "~/" },
    { href: "/projects", label: "~/projects" },
    { href: "/token", label: "~/token" },
    { href: "/verify", label: "~/verify" },
    { href: "/install", label: "~/install" },
    { href: "/security", label: "~/security" },
    { href: "/blog", label: "~/blog" },
    { href: "/qa", label: "~/qa" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-sm border-b border-[#1a3a1a]">
      {/* Terminal title bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Traffic light buttons + title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d4a528]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#24a835]" />
            </div>
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-[#666] text-xs">
                enablerdao@web3:~
              </span>
              <span className="text-[#00ff00] text-xs hidden sm:inline">
                -- bash
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Tab style */}
          <nav className="hidden md:flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 text-xs border border-[#1a3a1a] -ml-px first:ml-0 transition-colors ${
                  pathname === link.href
                    ? "bg-[#1a3a1a] text-[#00ff00] border-b-[#0d0d0d]"
                    : "text-[#555] hover:text-[#00ff00] hover:bg-[#111]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/yukihamada"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs border border-[#1a3a1a] -ml-px text-[#555] hover:text-[#00ff00] hover:bg-[#111] transition-colors"
            >
              git
            </a>
          </nav>

          {/* Wallet address style identifier */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-[#333]">|</span>
            <span className="text-[#555]">enablerdao.eth</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1 text-[#555] hover:text-[#00ff00]"
            aria-label="Menu"
          >
            <span className="text-xs font-mono">
              {isMenuOpen ? "[x]" : "[=]"}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-2 border-t border-[#1a3a1a]">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-2 py-1.5 text-xs transition-colors ${
                    pathname === link.href
                      ? "text-[#00ff00]"
                      : "text-[#555] hover:text-[#00ff00]"
                  }`}
                >
                  <span className="text-[#00aa00]">$ </span>
                  cd {link.label}
                </Link>
              ))}
              <a
                href="https://github.com/yukihamada"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="px-2 py-1.5 text-xs text-[#555] hover:text-[#00ff00] transition-colors"
              >
                <span className="text-[#00aa00]">$ </span>
                git remote -v
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
