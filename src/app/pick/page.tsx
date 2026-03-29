import type { Metadata } from "next";
import { Suspense } from "react";

import { QuestionForm } from "@/components/picker/QuestionForm";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { MotionSection } from "@/components/shared/MotionSection";
import { PRICING_LAST_UPDATED } from "@/data/pricing";
import { SOCIAL_LINKS } from "@/data/ecosystem";

export const metadata: Metadata = {
  title: "OpenClaw Model Picker | GuardClaw",
  description:
    "Answer five questions and get a recommended primary and fallback OpenClaw model stack with a copyable config snippet.",
  alternates: {
    canonical: "https://guardclaw.dev/picker",
  },
  openGraph: {
    title: "OpenClaw Model Picker | GuardClaw",
    description:
      "Answer five questions and get a recommended primary and fallback OpenClaw model stack with a copyable config snippet.",
    url: "https://guardclaw.dev/picker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenClaw Model Picker | GuardClaw",
    description:
      "Get a practical OpenClaw model recommendation based on use case, budget, and billing mode.",
  },
};

export default function PickPage() {
  return (
    <ToolLayout
      fieldNote="Field Note #002"
      title="Answer five questions. Leave with a model stack you can actually use."
      subtitle="The recommendation updates live as you change your answers. No submit button, no account, no backend."
      banner={
        <AnnouncementBar
          badge="FIELD NOTE"
          message="Already know your model? Check what it costs."
          linkLabel="Open the Calculator &#x2192;"
          linkHref={SOCIAL_LINKS.tool_calculator}
          external
        />
      }
    >
      <section className="mb-8 rounded-brand border border-primary/20 bg-secondary/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Field Note</p>
        <div className="mt-3 grid gap-2">
          <a
            href="https://guardclaw.dev/tools/openclaw-model-picker-workflow?source=picker"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-primary/15 bg-background/80 px-3 py-2 text-sm font-semibold transition hover:border-primary/40"
          >
            Most model mistakes come from guesswork -&gt; learn why
          </a>
          <a
            href="https://guardclaw.dev/tools/openclaw-model-cost-comparison?source=picker"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-primary/15 bg-background/80 px-3 py-2 text-sm font-semibold transition hover:border-primary/40"
          >
            Benchmark picks can still be expensive in production -&gt; learn why
          </a>
        </div>
      </section>
      <Suspense fallback={<div className="rounded-brand border border-primary/20 bg-background/90 p-6">Loading picker...</div>}>
        <QuestionForm />
      </Suspense>

      <MotionSection className="mb-12 rounded-brand border border-primary/20 bg-secondary/35 p-6 hover-lift">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Why this recommendation is opinionated</p>
        <h2 className="mt-3 text-3xl font-bold">The tool prefers reliable decisions over vague flexibility.</h2>
        <p className="mt-3 max-w-4xl text-muted-foreground">
          Tool-call reliability is treated as a hard constraint when you say it matters. Free and local paths only open
          when your answers make them realistic. If your combination does not match one of the verified branches, the
          picker falls back to Claude Sonnet 4.6 with Claude Haiku 4.5 as the safer default.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Pricing data is hardcoded from the calculator reference set. Last updated: {PRICING_LAST_UPDATED}.
        </p>
      </MotionSection>
    </ToolLayout>
  );
}
