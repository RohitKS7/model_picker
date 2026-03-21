"use client";

import { motion } from "framer-motion";

import type { ModelEntry } from "@/types/picker";

interface RecommendationCardProps {
  label: "Primary" | "Fallback";
  entry: ModelEntry;
}

export function RecommendationCard({ label, entry }: RecommendationCardProps) {
  const isPrimary = label === "Primary";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-brand border p-5 ${
        isPrimary ? "border-accent/40 bg-background" : "border-primary/20 bg-secondary/35"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
            isPrimary
              ? "bg-accent text-accent-foreground"
              : "border border-primary/20 bg-background/80 text-foreground"
          }`}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{entry.provider}</span>
      </div>

      <h3 className="mt-4 text-2xl font-bold">{entry.displayName}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{entry.reason}</p>

      <div className="mt-4 rounded-brand border border-primary/15 bg-background/80 p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Model ID</p>
        <code className="mt-1 block break-all text-sm font-semibold text-foreground">{entry.modelId}</code>
      </div>

      {entry.triggerCondition ? (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Trigger:</span> {entry.triggerCondition}
        </p>
      ) : null}
    </motion.article>
  );
}
