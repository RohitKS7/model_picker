"use client";

import { useState } from "react";

interface ShareResultProps {
  text: string;
}

export function ShareResult({ text }: ShareResultProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-brand border border-primary/20 bg-background/90 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Shareable Result</p>
          <h3 className="mt-2 text-xl font-bold">Screenshot-friendly summary for Discord or X</h3>
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
        >
          {copied ? "Result Copied" : "Copy Result Text"}
        </button>
      </div>

      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-brand border border-primary/15 bg-secondary/35 p-4 text-sm text-foreground [overflow-wrap:anywhere]">
        {text}
      </pre>
    </section>
  );
}
