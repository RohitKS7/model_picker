"use client";

interface ComparisonNoteProps {
  gptIsPrimary?: boolean;
}

export function ComparisonNote({ gptIsPrimary = false }: ComparisonNoteProps) {
  return (
    <div className="mt-4 rounded-brand border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-5">
      <h3 className="text-lg font-bold mb-4">GPT-5 is also available at this price</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Claude Pro Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Claude Pro ($20/month)</span>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${gptIsPrimary ? 'border border-primary/20 bg-background/80 text-foreground' : 'bg-accent text-accent-foreground'}`}>
              {gptIsPrimary ? 'CAPABILITY' : 'RECOMMENDED'}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">{gptIsPrimary ? 'Stronger per-message quality' : 'Better capability'}</p>
          <p className="text-sm text-muted-foreground">
            {gptIsPrimary 
              ? 'Claude Sonnet 4.6 scores higher on coding and reasoning benchmarks. Fewer messages but stronger per-message quality. ~200 messages/day.'
              : 'Claude Sonnet 4.6 scores higher on coding and reasoning benchmarks. Fewer messages but stronger per-message quality. ~200 messages/day.'
            }
          </p>
        </div>

        {/* ChatGPT Plus Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">ChatGPT Plus ($20/month)</span>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${gptIsPrimary ? 'bg-accent text-accent-foreground' : 'border border-primary/20 bg-background/80 text-foreground'}`}>
              {gptIsPrimary ? 'RECOMMENDED' : 'HIGH VOLUME'}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">{gptIsPrimary ? 'More messages per day' : 'More volume'}</p>
          <p className="text-sm text-muted-foreground">
            {gptIsPrimary 
              ? 'GPT-5.2 gives ~1,280 messages/day — 6x more than Claude Pro at the same price. Better choice if you hit rate limits often.'
              : 'GPT-5.2 gives ~1,280 messages/day — 6x more than Claude Pro at the same price. Better choice if you hit rate limits often.'
            }
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {gptIsPrimary
          ? 'GPT recommended here because it offers more messages per day at the same price point. If you regularly hit Claude\'s daily limit, GPT Plus offers significantly more headroom.'
          : 'Recommendation based on benchmark performance. If you regularly hit Claude\'s daily limit, GPT Plus offers significantly more headroom at the same price.'
        }
      </p>
    </div>
  );
}
