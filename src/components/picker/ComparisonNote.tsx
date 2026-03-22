"use client";

export function ComparisonNote() {
  return (
    <div className="mt-4 rounded-brand border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-5">
      <h3 className="text-lg font-bold mb-4">GPT-5 is also available at this price</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Claude Pro Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Claude Pro ($20/month)</span>
            <span className="rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
              RECOMMENDED
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">Better capability</p>
          <p className="text-sm text-muted-foreground">
            Claude Sonnet 4.6 scores higher on coding and reasoning benchmarks.
            Fewer messages but stronger per-message quality. ~200 messages/day.
          </p>
        </div>

        {/* ChatGPT Plus Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">ChatGPT Plus ($20/month)</span>
          </div>
          <p className="text-sm font-medium text-foreground">More volume</p>
          <p className="text-sm text-muted-foreground">
            GPT-5.2 gives ~1,280 messages/day — 6x more than Claude Pro at the same price.
            Better choice if you regularly hit rate limits often.
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        If you regularly hit Claude's daily limit, GPT Plus offers significantly
        more headroom at the same price.
      </p>
    </div>
  );
}
