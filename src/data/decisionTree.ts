import { buildModelEntry, hasOpenRouterModel } from "@/data/models";
import { getEstimatedMonthlyRange } from "@/utils/calcEstimate";
import type { PickerInput, PickerOutput } from "@/types/picker";

interface RecommendationRule {
  match: (input: PickerInput) => boolean;
  primaryId: string;
  primaryReason: string;
  fallbackId: string;
  fallbackReason: string;
  fallbackTrigger: string;
}

const RULES: RecommendationRule[] = [
  {
    match: (input) => input.useCase === "coding" && input.toolCalls === "yes" && input.budget === "50plus",
    primaryId: "anthropic/claude-sonnet-4-6",
    primaryReason: "Best tool call reliability when cost is not the main constraint.",
    fallbackId: "anthropic/claude-haiku-4-5",
    fallbackReason: "Cheaper fallback when you still want Anthropic-style tool behavior.",
    fallbackTrigger: "Falls back when long coding runs need a cheaper recovery path.",
  },
  {
    match: (input) => input.useCase === "coding" && input.toolCalls === "yes" && input.budget === "20to50",
    primaryId: "anthropic/claude-sonnet-4-6",
    primaryReason: "Strong coding quality with more predictable tool use than cheaper options.",
    fallbackId: "moonshot/kimi-k2.5",
    fallbackReason: "Keeps costs down when the main coding pass does not need Sonnet quality.",
    fallbackTrigger: "Falls back when the primary run is too expensive for the next task.",
  },
  {
    match: (input) => input.useCase === "coding" && input.toolCalls === "yes" && input.budget === "under20",
    primaryId: "moonshot/kimi-k2.5",
    primaryReason: "Best budget coding pick when you still need solid tool-call support.",
    fallbackId: "anthropic/claude-haiku-4-5",
    fallbackReason: "Useful rescue path when Kimi drifts or needs tighter instruction following.",
    fallbackTrigger: "Falls back when tool execution starts drifting or responses lose precision.",
  },
  {
    match: (input) => input.useCase === "coding" && input.toolCalls === "yes" && input.budget === "free",
    primaryId: "openai-codex/gpt-5.3-codex",
    primaryReason: "Free OAuth path for coding workflows when budget is the hard stop.",
    fallbackId: "google/gemini-2.5-flash",
    fallbackReason: "Fast no-cost backup for lightweight coding turns.",
    fallbackTrigger: "Falls back when your free primary path is unavailable or rate-limited.",
  },
  {
    match: (input) => input.useCase === "coding" && input.toolCalls === "no" && input.budget === "under20",
    primaryId: "google/gemini-2.5-flash",
    primaryReason: "Cheap and quick when you care more about throughput than tool reliability.",
    fallbackId: "minimax/minimax-m2.5",
    fallbackReason: "Helpful budget backup for lower-stakes code generation and iteration.",
    fallbackTrigger: "Falls back when the faster option loses quality on longer prompts.",
  },
  {
    match: (input) => input.useCase === "assistant" && input.budget === "50plus",
    primaryId: "anthropic/claude-opus-4-6",
    primaryReason: "Best fit for high-touch assistant work where polish matters most.",
    fallbackId: "anthropic/claude-sonnet-4-6",
    fallbackReason: "Keeps the tone and quality close while lowering spend for routine turns.",
    fallbackTrigger: "Falls back when the request does not justify Opus-level spend.",
  },
  {
    match: (input) => input.useCase === "assistant" && input.budget === "20to50",
    primaryId: "anthropic/claude-sonnet-4-6",
    primaryReason: "Balanced assistant choice for quality, tone, and reliability.",
    fallbackId: "moonshot/kimi-k2.5",
    fallbackReason: "Cheaper backup for lower-stakes assistant tasks.",
    fallbackTrigger: "Falls back when you want to preserve budget on simple assistant turns.",
  },
  {
    match: (input) => input.useCase === "assistant" && input.budget === "under20",
    primaryId: "moonshot/kimi-k2.5",
    primaryReason: "Best budget-friendly assistant option when you still want strong output quality.",
    fallbackId: "minimax/minimax-m2.5",
    fallbackReason: "Budget-safe backup for lighter support and chat flows.",
    fallbackTrigger: "Falls back when the primary answer quality is more than you need.",
  },
  {
    match: (input) => input.useCase === "assistant" && input.budget === "free" && input.localOk === "yes",
    primaryId: "ollama/llama3.3",
    primaryReason: "Best zero-dollar path if you are comfortable keeping a local model around.",
    fallbackId: "google/gemini-2.5-flash",
    fallbackReason: "Cloud escape hatch for moments when the local model is not enough.",
    fallbackTrigger: "Falls back when the local model cannot handle the request cleanly.",
  },
  {
    match: (input) => input.useCase === "assistant" && input.budget === "free" && input.localOk === "no",
    primaryId: "openai-codex/gpt-5.3-codex",
    primaryReason: "Free hosted option when local setup is off the table.",
    fallbackId: "qwen-portal/coder-model",
    fallbackReason: "Another no-cost hosted path when the first free option is busy.",
    fallbackTrigger: "Falls back when the primary free route is rate-limited.",
  },
  {
    match: (input) => input.useCase === "automation" && input.toolCalls === "yes",
    primaryId: "anthropic/claude-sonnet-4-6",
    primaryReason: "Reliable automation usually starts with dependable tool behavior.",
    fallbackId: "anthropic/claude-haiku-4-5",
    fallbackReason: "Lower-cost backup when the flow can tolerate a smaller model.",
    fallbackTrigger: "Falls back when automations need a cheaper retry path after failure.",
  },
  {
    match: (input) => input.useCase === "automation" && input.toolCalls === "no" && input.budget === "under20",
    primaryId: "minimax/minimax-m2.5",
    primaryReason: "Low-cost automation pick when the job is mostly prompt-to-text.",
    fallbackId: "moonshot/kimi-k2.5",
    fallbackReason: "Useful backup for jobs that need a little more reasoning depth.",
    fallbackTrigger: "Falls back when repetitive automation prompts start degrading in quality.",
  },
  {
    match: (input) => input.useCase === "research" && input.budget === "50plus",
    primaryId: "anthropic/claude-opus-4-6",
    primaryReason: "Best fit for deep synthesis, nuance, and long-form research summaries.",
    fallbackId: "google/gemini-2.5-pro",
    fallbackReason: "Strong research backup with lower spend than Opus.",
    fallbackTrigger: "Falls back when you want broad research coverage without Opus pricing.",
  },
  {
    match: (input) => input.useCase === "research" && input.budget === "20to50",
    primaryId: "google/gemini-2.5-pro",
    primaryReason: "Good research depth at a more manageable monthly cost.",
    fallbackId: "moonshot/kimi-k2.5",
    fallbackReason: "Budget backup for first-pass synthesis and rough comparisons.",
    fallbackTrigger: "Falls back when a task only needs a fast first pass.",
  },
  {
    match: (input) => input.useCase === "debrief" && input.budget === "under20",
    primaryId: "moonshot/kimi-k2.5",
    primaryReason: "Cost-effective for reflective summaries, recaps, and daily review workflows.",
    fallbackId: "minimax/minimax-m2.5",
    fallbackReason: "Cheaper backup for quick end-of-day summaries.",
    fallbackTrigger: "Falls back when the recap is straightforward and does not need extra depth.",
  },
  {
    match: (input) => input.useCase === "debrief" && input.budget === "free",
    primaryId: "qwen-portal/coder-model",
    primaryReason: "Free hosted option for lightweight debrief and reflection tasks.",
    fallbackId: "google/gemini-2.5-flash",
    fallbackReason: "Fast cloud backup when the free primary route is not available.",
    fallbackTrigger: "Falls back when the primary free route is busy or unavailable.",
  },
];

const DEFAULT_RULE: RecommendationRule = {
  match: () => true,
  primaryId: "anthropic/claude-sonnet-4-6",
  primaryReason: "Safest all-around choice when your inputs do not strongly point elsewhere.",
  fallbackId: "anthropic/claude-haiku-4-5",
  fallbackReason: "Lower-cost backup that keeps behavior predictable.",
  fallbackTrigger: "Falls back when the primary model is overkill for the next turn.",
};

export function getRecommendation(input: PickerInput): PickerOutput {
  const rule = RULES.find((candidate) => candidate.match(input)) ?? DEFAULT_RULE;
  const costRange = getEstimatedMonthlyRange(input, rule.primaryId, rule.fallbackId);

  return {
    primary: {
      ...buildModelEntry(rule.primaryId, rule.primaryReason),
      estimatedMonthly: costRange,
    },
    fallback: buildModelEntry(rule.fallbackId, rule.fallbackReason, rule.fallbackTrigger),
    openRouterWarning: hasOpenRouterModel([rule.primaryId, rule.fallbackId]),
    costRange,
  };
}
