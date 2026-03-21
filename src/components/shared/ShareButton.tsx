"use client";

import { useState } from "react";

interface ShareButtonProps {
  url: string;
}

export function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground"
    >
      {copied ? "Share URL Copied" : "Copy Share URL"}
    </button>
  );
}
