import Link from "next/link";

interface V2FeaturesSectionProps {
  tool: "picker" | "calculator";
}

const PICKER_FEATURES = [
  {
    title: "Use case presets",
    description: "Pick a preset and skip the questions",
  },
  {
    title: "Multi-agent stack mode",
    description: "Get a full orchestration stack recommendation",
  },
  {
    title: "Model reasoning",
    description: "Understand why, not just what was recommended",
  },
  {
    title: "Local model path",
    description: "Full Ollama and LM Studio config support",
  },
];

const CALCULATOR_FEATURES = [
  {
    title: "Context window estimator",
    description: "See when compaction will trigger",
  },
  {
    title: "Live pricing sync",
    description: "Prices update from provider APIs automatically",
  },
  {
    title: "Cost history",
    description: "Compare configs over time",
  },
  {
    title: "Setup phase simulator",
    description: "Model your first-week token spend",
  },
];

export function V2FeaturesSection({ tool }: V2FeaturesSectionProps) {
  const features = tool === "picker" ? PICKER_FEATURES : CALCULATOR_FEATURES;

  return (
    <section className="rounded-brand border border-primary/20 bg-background/90 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Features coming soon in v2 of Modlel Picker
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-brand border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] p-4 hover-lift"
          >
            <div className="flex items-center justify-between gap-2">
              <h3
                className="font-semibold"
                style={{
                  fontFamily: '"Lora", Georgia, serif',
                  fontSize: "1rem",
                }}
              >
                {feature.title}
              </h3>
              <span className="text-xs font-semibold coming-soon-shimmer">
                COMING SOON
              </span>
            </div>
            <p
              className="mt-2 text-muted-foreground"
              style={{
                fontFamily: '"Source Sans 3", system-ui, sans-serif',
                fontSize: "0.875rem",
              }}
            >
              {feature.description}
            </p>
          </article>
        ))}
      </div>
      <p
        className="mt-6 text-muted-foreground"
        style={{
          fontFamily: '"Source Sans 3", system-ui, sans-serif',
        }}
      >
        Follow along to see these ship →{" "}
        <Link
          href="https://twitter.com/SumanRohitK7"
          target="_blank"
          className="transition hover:text-[hsl(var(--accent))]"
        >
          @SumanRohitK7
        </Link>
      </p>
    </section>
  );
}
