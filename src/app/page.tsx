import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { MotionSection } from "@/components/shared/MotionSection";
import { FUTURE_TOOLS, SOCIAL_LINKS } from "@/data/ecosystem";

export const metadata: Metadata = {
  title: "OpenClaw Model Picker Overview | GuardClaw",
  description:
    "A short five-question flow that recommends the right OpenClaw model stack for your use case, budget, and tool-call needs.",
};

const quotes = [
  {
    quote: "Model choice is the primary challenge. Quality, quantity, and price is a constant riddle.",
    source: "Discord - #model-discussion",
  },
  {
    quote: "As a beginner there is information overload - the best I could do is just pick something and play around.",
    source: "Discord - #users-helping-users",
  },
  {
    quote: "I use OpenRouter without really knowing what's behind it.",
    source: "Community feedback thread",
  },
];

const whatItDoes = [
  "Asks five practical questions on one screen.",
  "Recommends a primary and fallback model stack.",
  "Generates a copyable config snippet immediately.",
  "Hands you off to the calculator for exact spend verification.",
];

const heroBadges = [
  "Free and open source",
  "No paywalls",
  "No hidden limits",
  "No account",
  "No data stored",
  "Runs entirely in your browser",
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AnnouncementBar
        badge="FIELD NOTE"
        message="Already know your model? Check what it costs."
        linkLabel="Open the Calculator &#x2192;"
        linkHref={SOCIAL_LINKS.tool_calculator}
        external
      />

      <main className="pb-8">
        <section className="container-brand relative py-8 sm:py-10 md:py-12 lg:py-12">
          <div className="absolute left-1/2 top-2 z-10 w-max -translate-x-1/2 sm:top-4 lg:top-6">
            <div className="mx-auto inline-flex max-w-full items-center justify-center rounded-full bg-accent px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-sm reveal-up">
              Part of GuardClaw Ecosystem - Built by Rohit
            </div>
          </div>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
            <div className="mx-auto flex max-w-[40rem] flex-col justify-center pt-10 text-center sm:pt-12 lg:mx-0 lg:pt-14 lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Field Note #002</p>
              <h1 className="mt-4 text-[2rem] font-bold leading-[1.03] text-foreground reveal-up reveal-delay-1 sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.5rem]">
                Most OpenClaw users do not fail at setup.
                <span className="block text-accent">They fail at model choice.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-[21rem] text-[1.02rem] leading-[1.9] text-muted-foreground sm:max-w-[34rem] sm:text-[1.125rem] lg:mx-0 lg:mt-6 lg:max-w-[30rem] reveal-up reveal-delay-2">
                The Model Picker turns that guesswork into one clear action: answer five questions, get a recommended
                primary and fallback stack, copy the config, and move on.
              </p>

              <div className="mx-auto mt-8 flex max-w-[22rem] flex-wrap items-center justify-center gap-2.5 text-center lg:mx-0 lg:max-w-[30rem] lg:justify-start reveal-up reveal-delay-3">
                {heroBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.72rem] font-medium leading-5 text-muted-foreground"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 max-md:justify-center reveal-up reveal-delay-3">
                <div className="inline-flex pulse-cta">
                  <Link
                    href="/pick"
                    className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground transition hover:brightness-105"
                  >
                    Start the 5-question flow &#x2192;
                  </Link>
                </div>
                <Link
                  href={SOCIAL_LINKS.tool_calculator}
                  target="_blank"
                  className="rounded-full border border-primary/30 px-6 py-4 text-base font-semibold transition hover:bg-primary hover:text-primary-foreground"
                >
                  Open cost calculator
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl max-md:border max-md:border-border/70 max-md:bg-primary max-md:p-4 rounded-lg lg:mx-0 lg:block reveal-up reveal-delay-2">

            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] max-sm:text-primary-foreground sm:mb-4">
                Seen across Discord, Reddit, and X
              </p>
            <div className="grid gap-4">
              {quotes.map((item, index) => (
                <article
                  key={item.quote}
                  className={`rounded-brand border border-primary/20 bg-secondary p-6 ${
                    index % 2 === 0 ? "-rotate-1" : "rotate-1"
                  } hover-lift`}
                >
                  <p className="font-serif text-2xl italic leading-relaxed text-foreground">"{item.quote}"</p>
                  <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground [font-variant:small-caps]">
                    {item.source}
                  </p>
                </article>
              ))}
            </div>
          </div>
          </div>
        </section>

        <div className="container-brand space-y-8 pb-12">
        <div className="flex items-center gap-3 sm:gap-4">
              <p className="shrink-0 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                How it works
              </p>
              <div className="h-px flex-1 bg-border/80" aria-hidden="true" />
            </div>
          <MotionSection className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {whatItDoes.map((item, index) => (
              <article key={item} className="rounded-brand border border-primary/20 bg-background/85 p-5 hover-lift">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Step 0{index + 1}</p>
                <p className="mt-3 text-lg font-semibold text-foreground">{item}</p>
              </article>
            ))}
          </MotionSection>

          <MotionSection className="rounded-brand border border-primary/20 bg-secondary/35 p-6" delay={0.05}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Why this exists</p>
            <h2 className="mt-3 text-3xl font-bold">The community was paying for trial and error.</h2>
            <p className="mt-4 max-w-4xl whitespace-pre-line text-muted-foreground">
              {`People keep defaulting to familiar model names instead of models that actually fit their workflow.

That turns into invisible experimentation:
- expensive coding sessions pinned to the wrong model
- unreliable tool calls in automation paths
- routing layers people do not fully understand

This tool exists to give OpenClaw users a fast, opinionated answer they can act on immediately.`}
            </p>
          </MotionSection>

          <section className="reveal-up">
            <p className="mb-8 mt-3 whitespace-pre-line text-center text-lg font-semibold italic leading-tight text-accent sm:mb-10 sm:text-xl">
              {`"This is just one piece.

More tools are coming to solve the rest." - Rohit`}
            </p>
          </section>

          <MotionSection className="grid gap-6 lg:grid-cols-2" delay={0.1}>
            <section className="rounded-brand border border-primary/20 bg-background/90 p-6 hover-lift">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ecosystem</p>
              <h2 className="mt-3 text-3xl font-bold">One tool should lead cleanly into the next.</h2>
              <p className="mt-3 text-muted-foreground">
                Model Picker gives you the recommendation. The calculator gives you the detailed spend. Together they
                remove both halves of the model-choice problem.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={SOCIAL_LINKS.tool_calculator}
                  target="_blank"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Visit Calculator
                </Link>
                <Link
                  href={SOCIAL_LINKS.tools}
                  target="_blank"
                  className="rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground"
                >
                  Explore GuardClaw Tools
                </Link>
              </div>
            </section>

            <section className="rounded-brand border border-accent/30 bg-background/90 p-6 hover-lift">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Support</p>
              <h2 className="mt-3 text-3xl font-bold">Help more OpenClaw users find it.</h2>
              <p className="mt-3 text-muted-foreground">
                Stars, shares, and feedback all help shape what GuardClaw builds next.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
                >
                  Star on GitHub
                </Link>
                <Link
                  href={SOCIAL_LINKS.buyMeACoffee}
                  target="_blank"
                  className="rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground"
                >
                  Support the build
                </Link>
              </div>
            </section>
          </MotionSection>

          <MotionSection className="rounded-brand border border-primary/20 bg-background/90 p-6" delay={0.15}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Future tools</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {FUTURE_TOOLS.map((tool) => (
                <article key={tool.name} className="rounded-brand border border-primary/15 bg-secondary/25 p-4 hover-lift">
                  <h3 className="text-xl font-bold">{tool.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
                </article>
              ))}
            </div>
          </MotionSection>
        </div>
      </main>

      <Footer />
    </div>
  );
}
