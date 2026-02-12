"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-[10px] border border-[#1a3a1a] bg-[#0d0d0d] text-[#555] hover:text-[#00ff00] hover:border-[#00ff00]/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
      aria-label="Copy command"
      title="Copy"
    >
      {copied ? "[copied]" : "[copy]"}
    </button>
  );
}
