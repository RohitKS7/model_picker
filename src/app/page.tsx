import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { MotionSection } from "@/components/shared/MotionSection";
import { V2FeaturesSection } from "@/components/shared/V2FeaturesSection";
import { FUTURE_TOOLS, SOCIAL_LINKS } from "@/data/ecosystem";
import Image from "next/image";

export const metadata: Metadata = {
  title: "OpenClaw Model Picker Overview | GuardClaw",
  description:
    "A short five-question flow that recommends the right OpenClaw model stack for your use case, budget, and tool-call needs.",
  alternates: {
    canonical: "https://guardclaw.dev/picker",
  },
  openGraph: {
    title: "OpenClaw Model Picker Overview | GuardClaw",
    description:
      "A short five-question flow that recommends the right OpenClaw model stack for your use case, budget, and tool-call needs.",
    url: "https://guardclaw.dev/picker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenClaw Model Picker Overview | GuardClaw",
    description:
      "Answer five questions and get a recommended OpenClaw primary and fallback model stack.",
  },
};

const quotes = [
  {
    quote: '"Picking the right model is the hardest part."',
    source: "Discord - #general",
  },
  {
    quote: "I just pick a model and hope it works — there’s no clear way to know.",
    source: "Discord - #users-helping-users",
  },
  {
    quote: "I only realize I picked the wrong model after things start breaking.",
    source: "Community feedback thread",
  },
];

const whatItDoes = [
  "Tell us what you're trying to build",
  "Get a recommended model + fallback",
  "Copy your config instantly",
  " Check cost before you run it",
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
               Answer 5 questions. Get the right model + fallback setup + ready to use config instantly.
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
              {`People keep guessing models.

That guess turns into:
- expensive runs
- unreliable outputs
- broken automations

This tool removes the guess.`}
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
              {/* <h2 className="mt-3 text-3xl font-bold">One tool should lead cleanly into the next.</h2> */}
              <div className="mt-3 text-muted-foreground">
                <h2 className="font-bold text-3xl mb-2">
                   Model Picker answers:
                </h2>
                <p className="mb-4">
                  what should you use.
                </p>

                <h2 className="font-bold text-3xl mb-2">
                  The calculator answers:
                </h2>
                <p className="mb-4">
                  what will it cost.
                </p>

                <p>
                  Together, you avoid bad decisions before they happen.
                </p>
              </div>
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
                  href={SOCIAL_LINKS.tool_github}
                  target="_blank"
                  className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
                >
                  Star on GitHub
                </Link>
                <Link
                  href={SOCIAL_LINKS.githubSponsor}
                  target="_blank"
                  className="rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground"
                >
                  Support the build
                </Link>
              </div>
            </section>
          </MotionSection>

          <MotionSection delay={0.12}>
            <V2FeaturesSection tool="picker" />
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
           <section className="rounded-brand border bg-background/85 p-6 max-md:text-center reveal-up">
            <h2 className="text-2xl font-bold">Builder Identity</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <div className="mx-auto w-full max-w-xs overflow-hidden rounded-brand border border-primary/20 md:mx-0 md:max-w-none">
                <Image
                  src="/headshot-bg.png"
                  alt="Rohit Kumar Suman"
                  width={640}
                  height={640}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">Built by Rohit Kumar Suman</p>
                <p className="mt-2 text-muted-foreground">
                  I build tools based on repeated problems I see in OpenClaw communities. Shared publicly as I build. Then I ship them fast.
                  Feedback shapes what comes next.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  If this tool was useful, a{" "}
                  <Link href="https://github.com/RohitKS7" target="_blank" className="underline underline-offset-2">
                    GitHub star genuinely helps. -&gt; github.com/RohitKS7
                  </Link>
                </p>
                <div className="mt-4 grid gap-3 text-sm font-semibold sm:flex sm:flex-wrap">
                  <Link href={SOCIAL_LINKS.github} target="_blank" className="inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2">
                    GitHub
                  </Link>
                  <Link href={SOCIAL_LINKS.twitter} target="_blank" className="inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2">
                    Twitter/X
                  </Link>
                  <Link href={SOCIAL_LINKS.linkedin} target="_blank" className="inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2">
                    LinkedIn
                  </Link>
                  <Link href={SOCIAL_LINKS.website} target="_blank" className="inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2">
                    Journey
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
