"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ComparisonNote } from "@/components/picker/ComparisonNote";
import { ConfigSnippet } from "@/components/picker/ConfigSnippet";
import { CostEstimate } from "@/components/picker/CostEstimate";
import { EcosystemCTA } from "@/components/picker/EcosystemCTA";
import { OpenRouterTooltip } from "@/components/picker/OpenRouterTooltip";
import { RecommendationCard } from "@/components/picker/RecommendationCard";
import { ShareButton } from "@/components/shared/ShareButton";
import { ShareResult } from "@/components/shared/ShareResult";
import { Tooltip } from "@/components/shared/Tooltip";
import { DEFAULT_PICKER_INPUT } from "@/data/defaults";
import { getRecommendation } from "@/data/decisionTree";
import { SOCIAL_LINKS } from "@/data/ecosystem";
import type { Budget, Billing, LocalOk, PickerInput, ToolCallsRequired, UseCase } from "@/types/picker";
import { decodeStateFromParams, encodeStateToParams } from "@/utils/urlState";

const useCaseOptions: Array<{ value: UseCase; label: string; detail: string }> = [
  { value: "coding", label: "Coding agent", detail: "Tool reliability and coding quality matter most." },
  { value: "assistant", label: "Personal assistant", detail: "Better tone, summaries, and helpful back-and-forth." },
  { value: "automation", label: "Automation", detail: "Stable repeated jobs with predictable spend." },
  { value: "research", label: "Research & browsing", detail: "Longer synthesis and deeper reasoning." },
  { value: "debrief", label: "Daily debrief", detail: "Short recaps, summaries, and reflective notes." },
  { value: "other", label: "Other", detail: "Use the safest general recommendation path." },
];

const budgetOptions: Array<{ value: Budget; label: string }> = [
  { value: "free", label: "Free" },
  { value: "under10", label: "Under $10" },
  { value: "10to15", label: "$10-$15" },
  { value: "15to20", label: "$15-$20" },
  { value: "20to40", label: "$20-$40" },
  { value: "40plus", label: "$40+" },
];

const billingOptions: Array<{ value: Billing; label: string; detail: string }> = [
  { value: "subscription", label: "Subscription plan", detail: "You mostly think in monthly allowance or bundled usage." },
  { value: "api", label: "Pay-per-token API", detail: "You care about token-priced spend on each run." },
];

const toolCallOptions: Array<{ value: ToolCallsRequired; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const localOptions: Array<{ value: LocalOk; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const BILLING_MODE_TOOLTIP =
  "Choose between Subscription (Claude Max/Codex plans) or Pay-per-token (API billing). This determines your actual cost structure.";

const getFallbackTriggerValue = (input: PickerInput): string => {
  if (input.toolCalls === "yes") {
    return "tool_call_failure";
  }

  if (input.budget === "free") {
    return "rate_limit_hit";
  }

  if (input.useCase === "research") {
    return "quality_drop";
  }

  return "context_or_quality_drift";
};

function generateConfigSnippet(primaryModelId: string, fallbackModelId: string, fallbackTrigger: string): string {
  const isMiniMax = primaryModelId.startsWith("minimax/");

  if (isMiniMax) {
    const modelName = primaryModelId.replace("minimax/", "");
    return JSON.stringify({
      agents: {
        defaults: {
          model: { primary: primaryModelId }
        }
      },
      models: {
        mode: "merge",
        providers: {
          minimax: {
            baseUrl: "https://api.minimax.chat/v1",
            apiKey: "${MINIMAX_API_KEY}",
            api: "openai-completions",
            models: [{ id: modelName, name: "MiniMax M2.5" }]
          }
        }
      }
    }, null, 2);
  }

  return JSON.stringify({
    model: primaryModelId,
    fallbackModel: fallbackModelId,
    fallbackTrigger,
  }, null, 2);
}

const getShareText = (input: PickerInput) => {
  if (!input.useCase) {
    return "Select your use case to get a recommendation.";
  }

  const recommendation = getRecommendation(input);
  const fallbackTrigger = getFallbackTriggerValue(input);
  const snippet = generateConfigSnippet(recommendation.primary.modelId, recommendation.fallback.modelId, fallbackTrigger);

  return [
    `Primary: ${recommendation.primary.modelId}`,
    `Fallback: ${recommendation.fallback.modelId}`,
    `Est. cost: $${recommendation.costRange.low}-$${recommendation.costRange.high}/month`,
    "",
    "Ready-to-paste config:",
    snippet,
    "",
    "Built with GuardClaw Model Picker",
  ].join("\n");
};

const optionButtonClass = (selected: boolean) =>
  `rounded-full border px-4 py-2 text-sm font-semibold transition ${
    selected
      ? "border-accent bg-accent text-accent-foreground"
      : "border-primary/20 bg-background/80 text-foreground hover:bg-secondary"
  }`;

export function QuestionForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [input, setInput] = useState<PickerInput>(() => {
    const initial = decodeStateFromParams(new URLSearchParams(searchParams.toString()));
    return initial ?? DEFAULT_PICKER_INPUT;
  });
  const [isUseCaseOpen, setIsUseCaseOpen] = useState(false);

  useEffect(() => {
    const syncFromUrl = () => {
      setInput(decodeStateFromParams(new URLSearchParams(window.location.search)));
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    const params = encodeStateToParams(input);
    const nextQuery = params.toString();
    const currentQuery = window.location.search.startsWith("?")
      ? window.location.search.slice(1)
      : window.location.search;

    if (nextQuery === currentQuery) {
      return;
    }

    const nextUrl = nextQuery.length > 0 ? `${pathname}?${nextQuery}` : pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [input, pathname]);

  const recommendation = getRecommendation(input);
  const shareUrl =
    typeof window === "undefined"
      ? `${SOCIAL_LINKS.tool_modelpicker}/pick?${encodeStateToParams(input).toString()}`
      : `${window.location.origin}${pathname}?${encodeStateToParams(input).toString()}`;
  const shareText = getShareText(input);
  const activeUseCase = useCaseOptions.find((option) => option.value === input.useCase);

  return (
    <div className="grid gap-8 pb-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <section className="min-w-0 rounded-brand border border-primary/20 bg-background/90 p-6 hover-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Five Questions</p>
            <h2 className="mt-2 text-2xl font-bold">Pick the stack that fits your work, not the hype.</h2>
          </div>
          <Link href="/" className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            Back to overview
          </Link>
        </div>

        <div className="mt-8 space-y-8">
          <div className="bg-secondary p-4 rounded-md hover-lift">
            <button
              type="button"
              onClick={() => setIsUseCaseOpen((current) => !current)}
              className="flex w-full items-center justify-between text-left"
              aria-expanded={isUseCaseOpen}
              aria-controls="use-case-options"
            >
              <span className="text-sm font-semibold text-foreground">1. What is your primary use case?</span>
              <span className="text-sm font-semibold py-1.5 px-3 bg-primary rounded text-primary-foreground">
                {isUseCaseOpen ? "Hide" : "Show"}
              </span>
            </button>
            {!isUseCaseOpen ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Selected: <span className="font-semibold text-foreground">{activeUseCase?.label}</span>
              </p>
            ) : null}
            {isUseCaseOpen ? (
              <div id="use-case-options" className="mt-3 grid gap-3">
                {useCaseOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setInput((current) => ({ ...current, useCase: option.value }))}
                    className={`rounded-brand border p-4 text-left transition ${
                      input.useCase === option.value
                        ? "border-accent bg-accent/10"
                        : "border-primary/20 bg-secondary/20 hover:bg-secondary/35"
                    }`}
                  >
                    <span className="block font-semibold">{option.label}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{option.detail}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="bg-secondary p-4 rounded-md hover-lift">
            <p className="text-sm font-semibold text-foreground ">2. How much do you want to spend per month?</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {budgetOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInput((current) => ({ ...current, budget: option.value }))}
                  className={optionButtonClass(input.budget === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {input.budget === "free" ? (
              <p className="mt-3 text-sm text-muted-foreground italic">
                Free options have fewer choices — we&apos;ll show you the best ones that actually work in OpenClaw.
              </p>
            ) : null}
          </div>

          {input.budget !== "free" ? (
            <>
              <div className="bg-secondary p-4 rounded-md hover-lift">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">3. How are you paying?</p>
                  <Tooltip label="Billing Mode" description={BILLING_MODE_TOOLTIP}>
                    <span className="text-sm font-semibold text-muted-foreground">?</span>
                  </Tooltip>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  This changes how aggressively we optimize for token-priced spend.
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {billingOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setInput((current) => ({ ...current, billing: option.value }))}
                      className={`rounded-brand border p-4 text-left transition ${
                        input.billing === option.value
                          ? "border-accent bg-accent/10"
                          : "border-primary/20 bg-background/70 hover:bg-secondary/35"
                      }`}
                    >
                      <span className="block font-semibold">{option.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{option.detail}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-secondary p-4 rounded-md hover-lift">
                <p className="text-sm font-semibold text-foreground">4. Does your use case require reliable tool calls?</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {toolCallOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setInput((current) => ({ ...current, toolCalls: option.value }))}
                      className={optionButtonClass(input.toolCalls === option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-secondary p-4 rounded-md hover-lift">
                <p className="text-sm font-semibold text-foreground">5. Are you comfortable running a local model alongside a cloud model?</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {localOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setInput((current) => ({ ...current, localOk: option.value }))}
                      className={optionButtonClass(input.localOk === option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-secondary p-4 rounded-md hover-lift">
              <p className="text-sm font-semibold text-foreground">3. Do you have a machine you can run a local model on?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {localOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setInput((current) => ({ ...current, localOk: option.value }))}
                    className={optionButtonClass(input.localOk === option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
        <section className="min-w-0 rounded-brand border border-primary/20 bg-background/95 p-6 hover-lift">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Live Recommendation</p>
          <h2 className="mt-2 text-3xl font-bold">Your suggested model stack</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Built for screenshots first: exact model IDs, clear reasons, and a paste-ready config.
          </p>
        </section>

        {!input.useCase ? (
          <div className="min-w-0 flex items-center justify-center p-12">
            <p className="text-center text-muted-foreground" style={{ fontFamily: '"Source Sans 3", system-ui, sans-serif' }}>
              Select your use case above to get a recommendation.
            </p>
          </div>
        ) : (
          <>
            <div className="min-w-0 grid gap-4 xl:grid-cols-2">
              <RecommendationCard label="Primary" entry={recommendation.primary} caveat={recommendation.caveat} />
              <RecommendationCard label="Fallback" entry={recommendation.fallback} />
            </div>

            {recommendation.showComparison ? <ComparisonNote /> : null}

            <CostEstimate low={recommendation.costRange.low} high={recommendation.costRange.high} isFlatRate={recommendation.costRange.isFlatRate} primaryModelId={recommendation.primary.modelId} />
            <OpenRouterTooltip visible={recommendation.openRouterWarning} />
            <ConfigSnippet
              primaryModelId={recommendation.primary.modelId}
              fallbackModelId={recommendation.fallback.modelId}
              fallbackTrigger={getFallbackTriggerValue(input)}
            />
            <EcosystemCTA
              primaryModelId={recommendation.primary.modelId}
              fallbackModelId={recommendation.fallback.modelId}
            />

            <section className="rounded-brand border border-primary/20 bg-secondary/35 p-5 hover-lift">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Next Step
              </p>
              <h3 className="mt-2 text-xl font-bold">Estimate spend before you ship this stack</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the calculator with this recommendation in mind, tune heartbeat and fallback settings,
                then validate monthly burn with your expected usage.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={SOCIAL_LINKS.tool_calculator}
                  target="_blank"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Next step: estimate spend
                </Link>
                <Link
                  href={SOCIAL_LINKS.tools}
                  target="_blank"
                  className="rounded-full border border-primary/30 px-5 py-2 text-sm font-semibold transition hover:bg-primary hover:text-primary-foreground"
                >
                  Browse GuardClaw tools hub
                </Link>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3 rounded-brand border border-primary/20 bg-secondary/30 p-4 hover-lift">
              <ShareButton url={shareUrl} />
              <p className="text-sm text-muted-foreground">Share this exact setup using a URL with encoded answers.</p>
            </div>

            <ShareResult text={shareText} />
          </>
        )}
      </div>
    </div>
  );
}
