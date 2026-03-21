import Link from "next/link";

import { SOCIAL_LINKS } from "@/data/ecosystem";

interface EcosystemCTAProps {
  primaryModelId: string;
  fallbackModelId: string;
}

export function EcosystemCTA({ primaryModelId, fallbackModelId }: EcosystemCTAProps) {
  const href = `${SOCIAL_LINKS.tool_calculator}/calculate?pm=${encodeURIComponent(primaryModelId)}&fm=${encodeURIComponent(fallbackModelId)}`;

  return (
    <section className="rounded-brand border border-primary/20 bg-background/90 p-5 hover-lift">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ecosystem Handoff</p>
      <h3 className="mt-2 text-xl font-bold">Want to see the exact cost for this setup?</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The picker gives you the stack. The calculator gives you the spend breakdown.
      </p>
      <Link
        href={href}
        target="_blank"
        className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Verify in the Cost Calculator -&gt;
      </Link>
    </section>
  );
}
