"use client";

import { useState } from "react";

interface ConfigSnippetProps {
  snippet: string;
}

export function ConfigSnippet({ snippet }: ConfigSnippetProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-brand border border-primary/20 bg-background/95 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Paste-ready Config</p>
          <h3 className="mt-1 text-xl font-bold">Copy directly into your setup</h3>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-brand border border-primary/15 bg-secondary/35 p-4 text-sm text-foreground">
        <code>{snippet}</code>
      </pre>
    </section>
  );
}
