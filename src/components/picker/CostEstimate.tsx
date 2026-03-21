"use client";

import { AnimatedCountUp } from "@/components/shared/AnimatedCountUp";

interface CostEstimateProps {
  low: number;
  high: number;
}

export function CostEstimate({ low, high }: CostEstimateProps) {
  return (
    <section className="rounded-brand border border-primary/20 bg-secondary/40 p-5 hover-lift">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Estimated Monthly Cost</p>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <AnimatedCountUp value={low} prefix="$" className="text-4xl font-bold text-foreground" />
        <span className="pb-1 text-2xl font-bold text-muted-foreground">-</span>
        <AnimatedCountUp value={high} prefix="$" className="text-4xl font-bold text-foreground" />
        <span className="pb-1 text-sm text-muted-foreground">/ month</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Typical cost for this use case. Verify exact spend in the Token Cost Calculator before budgeting.
      </p>
    </section>
  );
}
