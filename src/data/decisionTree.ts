// src/data/decisionTree.ts
import { buildModelEntry, hasOpenRouterModel } from "@/data/models";
import { getEstimatedMonthlyRange } from "@/utils/calcEstimate";
import type { PickerInput, PickerOutput } from "@/types/picker";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RuleConfig {
  primaryId: string;
  primaryReason: string;
  fallbackId: string;
  fallbackReason: string;
  fallbackTrigger: string;
  caveat?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const needsToolCalls = (input: PickerInput): boolean =>
  input.toolCalls === "yes" || input.toolCalls === "unsure";

// Key format: useCase:billing:budget:toolCallBucket
// toolCallBucket: "tool" = yes/unsure, "notool" = no
type ToolBucket = "tool" | "notool";

const toolBucket = (input: PickerInput): ToolBucket =>
  needsToolCalls(input) ? "tool" : "notool";

const key = (
  useCase: string,
  billing: string,
  budget: string,
  tc: ToolBucket
): string => `${useCase}:${billing}:${budget}:${tc}`;

// ─── GPT Alternative Logic ────────────────────────────────────────────────────
// At 20to40 subscription/api with Claude primary: show ComparisonNote
// At 20to40 with toolCalls=no: GPT is primary, no ComparisonNote

const GPT_PRIMARY: RuleConfig = {
  primaryId: "openai/gpt-5.2",
  primaryReason:
    "6x more messages per day than Claude Pro at the same price. Best choice when tool call reliability is not required.",
  fallbackId: "moonshot/kimi-k2.5",
  fallbackReason: "API-based backup when GPT daily limit is reached.",
  fallbackTrigger: "Falls back when daily message limit is reached.",
};

// Billings where 20to40 GPT-vs-Claude split applies
const GPT_SPLIT_BILLINGS = ["subscription", "api"] as const;

// UseCases where GPT split applies at 20to40
// Research is excluded — primary is Gemini Pro there, not Claude
const GPT_SPLIT_USE_CASES = [
  "coding",
  "assistant",
  "automation",
  "debrief",
] as const;

// ─── Rule Table ───────────────────────────────────────────────────────────────
// Only define Claude/non-GPT rules here.
// GPT rules at 20to40+notool are injected automatically below.

const RULE_TABLE: Record<string, RuleConfig> = {

  // ── FREE TIER (useCase agnostic) ──────────────────────────────────────────
  // handled separately in getRecommendation — budget=free bypasses table

  // ── CODING ────────────────────────────────────────────────────────────────
  // subscription
  "coding:subscription:under10:tool":    { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best budget coding pick when you still need solid tool-call support.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Useful rescue path when Kimi drifts.", fallbackTrigger: "Falls back when tool execution starts drifting." },
  "coding:subscription:under10:notool":  { primaryId: "google/gemini-2.5-flash", primaryReason: "Cheap and quick when throughput matters more than tool reliability.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget backup for lower-stakes code generation.", fallbackTrigger: "Falls back when Flash loses quality on longer prompts." },
  "coding:subscription:10to15:tool":     { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best capability-to-cost ratio under $15/month.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-friendly backup for lightweight coding tasks.", fallbackTrigger: "Falls back when Kimi is rate-limited." },
  "coding:subscription:10to15:notool":   { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best capability-to-cost ratio under $15/month.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-friendly backup for lightweight coding tasks.", fallbackTrigger: "Falls back when Kimi is rate-limited." },
  "coding:subscription:15to20:tool":     { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Claude Pro at $20 is the most capable option in this range.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "API-based fallback when subscription model is not suitable.", fallbackTrigger: "Falls back when Claude Pro is not available in your region." },
  "coding:subscription:15to20:notool":   { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Claude Pro at $20 is the most capable option in this range.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "API-based fallback when subscription model is not suitable.", fallbackTrigger: "Falls back when Claude Pro is not available in your region." },
  "coding:subscription:20to40:tool":     { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best tool call reliability at the $20 subscription tier.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Lower-cost backup that keeps behavior predictable.", fallbackTrigger: "Falls back when primary model is overkill for the next turn." },
  "coding:subscription:40plus:tool":     { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best tool call reliability when cost is not the main constraint.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Cheaper fallback with Anthropic-style tool behavior.", fallbackTrigger: "Falls back when long coding runs need a cheaper recovery path." },
  "coding:subscription:40plus:notool":   { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Maximum coding quality at this budget.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Lower-cost backup when you still want Anthropic-style behavior.", fallbackTrigger: "Falls back when the primary model is overkill for the next turn." },
  // api
  "coding:api:under10:tool":             { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best budget coding pick when you still need solid tool-call support.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Useful rescue path when Kimi drifts.", fallbackTrigger: "Falls back when tool execution starts drifting." },
  "coding:api:under10:notool":           { primaryId: "google/gemini-2.5-flash", primaryReason: "Cheap and quick when throughput matters more than tool reliability.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget backup for lower-stakes code generation.", fallbackTrigger: "Falls back when Flash loses quality on longer prompts." },
  "coding:api:10to15:tool":              { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable tool calls within $15 API budget.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Useful rescue path when Kimi drifts.", fallbackTrigger: "Falls back when tool execution starts drifting." },
  "coding:api:10to15:notool":            { primaryId: "google/gemini-2.5-flash", primaryReason: "Fast, cheap coding without tool call requirement.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget backup for lower-stakes code generation.", fallbackTrigger: "Falls back when the faster option loses quality on longer prompts." },
  "coding:api:15to20:tool":              { primaryId: "anthropic/claude-haiku-4-5", primaryReason: "Claude Haiku ~$4-8/month — best tool reliability per dollar.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cheaper backup when the main coding pass does not need Haiku quality.", fallbackTrigger: "Falls back when the primary run is too expensive for the next task." },
  "coding:api:15to20:notool":            { primaryId: "google/gemini-2.5-flash", primaryReason: "Best cost-per-token for coding in this range.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for higher-stakes coding tasks.", fallbackTrigger: "Falls back when the faster option loses quality on longer prompts." },
  "coding:api:20to40:tool":              { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best coding reliability within API budget.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Keeps costs down when the main coding pass does not need Sonnet quality.", fallbackTrigger: "Falls back when the primary run is too expensive for the next task." },
  "coding:api:40plus:tool":              { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best-in-class coding on API billing.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Cheaper fallback with Anthropic-style tool behavior.", fallbackTrigger: "Falls back when long coding runs need a cheaper recovery path." },
  "coding:api:40plus:notool":            { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Maximum coding quality on API billing.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Lower-cost backup when you still want Anthropic-style behavior.", fallbackTrigger: "Falls back when the primary model is overkill for the next turn." },

  // ── ASSISTANT ─────────────────────────────────────────────────────────────
  "assistant:subscription:under10:tool":   { primaryId: "moonshot/kimi-k2.5", primaryReason: "Capable assistant at zero cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support and chat flows.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:subscription:under10:notool": { primaryId: "moonshot/kimi-k2.5", primaryReason: "Capable assistant at zero cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support and chat flows.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:subscription:10to15:tool":    { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best assistant quality under $15.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support and chat flows.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:subscription:10to15:notool":  { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best assistant quality under $15.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support and chat flows.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:subscription:15to20:tool":    { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Claude Pro offers the best assistant experience at this price.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "API-based alternative with pay-as-you-go flexibility.", fallbackTrigger: "Falls back when subscription model is not preferred." },
  "assistant:subscription:15to20:notool":  { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Claude Pro offers the best assistant experience at this price.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "API-based alternative with pay-as-you-go flexibility.", fallbackTrigger: "Falls back when subscription model is not preferred." },
  "assistant:subscription:20to40:tool":    { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best assistant quality at the $20 price point.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "API-based backup when subscription model hits daily limit.", fallbackTrigger: "Falls back when Claude Pro message limits are reached." },
  "assistant:subscription:40plus:tool":    { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Best fit for high-touch assistant work where polish matters most.", fallbackId: "anthropic/claude-sonnet-4-6", fallbackReason: "Keeps the tone and quality close while lowering spend for routine turns.", fallbackTrigger: "Falls back when the request does not justify Opus-level spend." },
  "assistant:subscription:40plus:notool":  { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Best fit for high-touch assistant work where polish matters most.", fallbackId: "anthropic/claude-sonnet-4-6", fallbackReason: "Keeps the tone and quality close while lowering spend for routine turns.", fallbackTrigger: "Falls back when the request does not justify Opus-level spend." },
  "assistant:api:under10:tool":            { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best assistant quality within $10 API budget.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support and chat flows.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:api:under10:notool":          { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best assistant quality within $10 API budget.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support and chat flows.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:api:10to15:tool":             { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best assistant quality within $10-15 API budget.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:api:10to15:notool":           { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best assistant quality within $10-15 API budget.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget-safe backup for lighter support.", fallbackTrigger: "Falls back when the primary answer quality is more than you need." },
  "assistant:api:15to20:tool":             { primaryId: "moonshot/kimi-k2.5", primaryReason: "Capable assistant within $15-20 API spend.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Fast and cheap backup for routine assistant tasks.", fallbackTrigger: "Falls back when the task is simple enough for Flash." },
  "assistant:api:15to20:notool":           { primaryId: "moonshot/kimi-k2.5", primaryReason: "Capable assistant within $15-20 API spend.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Fast and cheap backup for routine assistant tasks.", fallbackTrigger: "Falls back when the task is simple enough for Flash." },
  "assistant:api:20to40:tool":             { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best assistant quality within $20-40 API budget.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine assistant turns.", fallbackTrigger: "Falls back when you want to preserve budget on simple turns." },
  "assistant:api:40plus:tool":             { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Best fit for high-touch assistant work where polish matters most.", fallbackId: "anthropic/claude-sonnet-4-6", fallbackReason: "Keeps tone and quality close while lowering spend for routine turns.", fallbackTrigger: "Falls back when the request does not justify Opus-level spend." },
  "assistant:api:40plus:notool":           { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Best fit for high-touch assistant work where polish matters most.", fallbackId: "anthropic/claude-sonnet-4-6", fallbackReason: "Keeps tone and quality close while lowering spend for routine turns.", fallbackTrigger: "Falls back when the request does not justify Opus-level spend." },

  // ── AUTOMATION ────────────────────────────────────────────────────────────
  "automation:subscription:under10:tool":   { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable automation at low cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget backup when Kimi is rate-limited.", fallbackTrigger: "Falls back when primary automation model is unavailable." },
  "automation:subscription:under10:notool": { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable automation at low cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget backup when Kimi is rate-limited.", fallbackTrigger: "Falls back when primary automation model is unavailable." },
  "automation:subscription:10to15:tool":    { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best automation reliability under $15.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget backup when Kimi is rate-limited.", fallbackTrigger: "Falls back when primary automation model is unavailable." },
  "automation:subscription:10to15:notool":  { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best automation reliability under $15.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Budget backup when Kimi is rate-limited.", fallbackTrigger: "Falls back when primary automation model is unavailable." },
  "automation:subscription:15to20:tool":    { primaryId: "google/gemini-2.5-flash", primaryReason: "Fast, reliable tool execution at low cost.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup when Flash is insufficient.", fallbackTrigger: "Falls back when task complexity exceeds Flash capabilities." },
  "automation:subscription:15to20:notool":  { primaryId: "google/gemini-2.5-flash", primaryReason: "Fast automation at low cost.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup when Flash is insufficient.", fallbackTrigger: "Falls back when task complexity exceeds Flash capabilities." },
  "automation:subscription:20to40:tool":    { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Most reliable automation with Claude Pro plan.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Lower-cost backup when the flow can tolerate a smaller model.", fallbackTrigger: "Falls back when automations need a cheaper retry path." },
  "automation:subscription:40plus:tool":    { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best-in-class automation reliability.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Lower-cost backup when the flow can tolerate a smaller model.", fallbackTrigger: "Falls back when automations need a cheaper retry path." },
  "automation:subscription:40plus:notool":  { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best-in-class automation reliability.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Lower-cost backup when the flow can tolerate a smaller model.", fallbackTrigger: "Falls back when automations need a cheaper retry path." },
  "automation:api:under10:tool":            { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable automation workhorse at low API cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Lower-cost backup for high-volume automation runs.", fallbackTrigger: "Falls back when cost per run needs to be minimized." },
  "automation:api:under10:notool":          { primaryId: "minimax/minimax-m2.5", primaryReason: "Low-cost automation when the job is mostly prompt-to-text.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for jobs needing more reasoning depth.", fallbackTrigger: "Falls back when repetitive automation prompts degrade in quality." },
  "automation:api:10to15:tool":             { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable automation workhorse with predictable API costs.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Lower-cost backup for high-volume automation runs.", fallbackTrigger: "Falls back when cost per run needs to be minimized." },
  "automation:api:10to15:notool":           { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable automation workhorse with predictable API costs.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Lower-cost backup for high-volume automation runs.", fallbackTrigger: "Falls back when cost per run needs to be minimized." },
  "automation:api:15to20:tool":             { primaryId: "google/gemini-2.5-flash", primaryReason: "Fast and cost-effective for automation workflows.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup when Gemini Flash is insufficient.", fallbackTrigger: "Falls back when task complexity exceeds Flash capabilities." },
  "automation:api:15to20:notool":           { primaryId: "google/gemini-2.5-flash", primaryReason: "Fast and cost-effective for automation workflows.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup when Gemini Flash is insufficient.", fallbackTrigger: "Falls back when task complexity exceeds Flash capabilities." },
  "automation:api:20to40:tool":             { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best tool call reliability in this API budget range.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Cheaper fallback for less critical automation steps.", fallbackTrigger: "Falls back when automations need a cheaper retry path." },
  "automation:api:40plus:tool":             { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best-in-class automation reliability on API billing.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Cheaper fallback for less critical automation steps.", fallbackTrigger: "Falls back when automations need a cheaper retry path." },
  "automation:api:40plus:notool":           { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best-in-class automation reliability on API billing.", fallbackId: "anthropic/claude-haiku-4-5", fallbackReason: "Cheaper fallback for less critical automation steps.", fallbackTrigger: "Falls back when automations need a cheaper retry path." },

  // ── RESEARCH ──────────────────────────────────────────────────────────────
  "research:subscription:under10:tool":    { primaryId: "google/gemini-2.5-flash", primaryReason: "Large context window for research at low cost.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:subscription:under10:notool":  { primaryId: "google/gemini-2.5-flash", primaryReason: "Large context window for research at low cost.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:subscription:10to15:tool":     { primaryId: "google/gemini-2.5-flash", primaryReason: "Best context-to-cost ratio under $15.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:subscription:10to15:notool":   { primaryId: "google/gemini-2.5-flash", primaryReason: "Best context-to-cost ratio under $15.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:subscription:15to20:tool":     { primaryId: "google/gemini-2.5-pro", primaryReason: "Deep research with large context at $15-20.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine research tasks.", fallbackTrigger: "Falls back when Pro model is not needed." },
  "research:subscription:15to20:notool":   { primaryId: "google/gemini-2.5-pro", primaryReason: "Deep research with large context at $15-20.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine research tasks.", fallbackTrigger: "Falls back when Pro model is not needed." },
  "research:subscription:20to40:tool":     { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Strong reasoning for research with Claude Pro.", fallbackId: "google/gemini-2.5-pro", fallbackReason: "Strong research backup with lower spend.", fallbackTrigger: "Falls back when you want broad research coverage without Sonnet pricing." },
  "research:subscription:20to40:notool":   { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Strong reasoning for research with Claude Pro.", fallbackId: "google/gemini-2.5-pro", fallbackReason: "Strong research backup with lower spend.", fallbackTrigger: "Falls back when you want broad research coverage without Sonnet pricing." },
  "research:subscription:40plus:tool":     { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Maximum reasoning depth for complex research.", fallbackId: "anthropic/claude-sonnet-4-6", fallbackReason: "Strong research backup with lower spend than Opus.", fallbackTrigger: "Falls back when you want broad research coverage without Opus pricing." },
  "research:subscription:40plus:notool":   { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Maximum reasoning depth for complex research.", fallbackId: "anthropic/claude-sonnet-4-6", fallbackReason: "Strong research backup with lower spend than Opus.", fallbackTrigger: "Falls back when you want broad research coverage without Opus pricing." },
  "research:api:under10:tool":             { primaryId: "google/gemini-2.5-flash", primaryReason: "Good research capabilities with low API costs.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:api:under10:notool":           { primaryId: "google/gemini-2.5-flash", primaryReason: "Good research capabilities with low API costs.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:api:10to15:tool":              { primaryId: "google/gemini-2.5-flash", primaryReason: "Good research capabilities with low API costs.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:api:10to15:notool":            { primaryId: "google/gemini-2.5-flash", primaryReason: "Good research capabilities with low API costs.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "More capable backup for deeper research tasks.", fallbackTrigger: "Falls back when research depth requires stronger model." },
  "research:api:15to20:tool":              { primaryId: "google/gemini-2.5-pro", primaryReason: "Strong research capabilities within this budget range.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine research tasks.", fallbackTrigger: "Falls back when Pro model is not needed." },
  "research:api:15to20:notool":            { primaryId: "google/gemini-2.5-pro", primaryReason: "Strong research capabilities within this budget range.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine research tasks.", fallbackTrigger: "Falls back when Pro model is not needed." },
  "research:api:20to40:tool":              { primaryId: "google/gemini-2.5-pro", primaryReason: "Strong research depth within $20-40 API spend.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for first-pass synthesis.", fallbackTrigger: "Falls back when a task only needs a fast first pass." },
  "research:api:20to40:notool":            { primaryId: "google/gemini-2.5-pro", primaryReason: "Strong research depth within $20-40 API spend.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for first-pass synthesis.", fallbackTrigger: "Falls back when a task only needs a fast first pass." },
  "research:api:40plus:tool":              { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Best fit for deep synthesis and long-form research.", fallbackId: "google/gemini-2.5-pro", fallbackReason: "Strong research backup with lower spend than Opus.", fallbackTrigger: "Falls back when you want broad research without Opus pricing." },
  "research:api:40plus:notool":            { primaryId: "anthropic/claude-opus-4-6", primaryReason: "Best fit for deep synthesis and long-form research.", fallbackId: "google/gemini-2.5-pro", fallbackReason: "Strong research backup with lower spend than Opus.", fallbackTrigger: "Falls back when you want broad research without Opus pricing." },

  // ── DEBRIEF ───────────────────────────────────────────────────────────────
  "debrief:subscription:under10:tool":    { primaryId: "moonshot/kimi-k2.5", primaryReason: "Solid daily debrief quality at low cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Cheaper backup for quick end-of-day summaries.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:subscription:under10:notool":  { primaryId: "moonshot/kimi-k2.5", primaryReason: "Solid daily debrief quality at low cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Cheaper backup for quick end-of-day summaries.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:subscription:10to15:tool":     { primaryId: "moonshot/kimi-k2.5", primaryReason: "Consistent daily debrief under $15.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Cheaper backup for quick end-of-day summaries.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:subscription:10to15:notool":   { primaryId: "moonshot/kimi-k2.5", primaryReason: "Consistent daily debrief under $15.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Cheaper backup for quick end-of-day summaries.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:subscription:15to20:tool":     { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable debrief quality in this range.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Faster backup for routine debrief tasks.", fallbackTrigger: "Falls back when the debrief is straightforward." },
  "debrief:subscription:15to20:notool":   { primaryId: "moonshot/kimi-k2.5", primaryReason: "Reliable debrief quality in this range.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Faster backup for routine debrief tasks.", fallbackTrigger: "Falls back when the debrief is straightforward." },
  "debrief:subscription:20to40:tool":     { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best summary quality at the subscription price point.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine debrief tasks.", fallbackTrigger: "Falls back when the debrief is straightforward." },
  "debrief:subscription:40plus:tool":     { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best summary quality at this budget.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine debrief tasks.", fallbackTrigger: "Falls back when the debrief is straightforward." },
  "debrief:subscription:40plus:notool":   { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best summary quality at this budget.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine debrief tasks.", fallbackTrigger: "Falls back when the debrief is straightforward." },
  "debrief:api:under10:tool":             { primaryId: "moonshot/kimi-k2.5", primaryReason: "Cost-effective for daily recaps at low API cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Cheaper backup for quick end-of-day summaries.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:api:under10:notool":           { primaryId: "moonshot/kimi-k2.5", primaryReason: "Cost-effective for daily recaps at low API cost.", fallbackId: "minimax/minimax-m2.5", fallbackReason: "Cheaper backup for quick end-of-day summaries.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:api:10to15:tool":              { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best debrief quality in this API budget range.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Fast backup for routine daily summaries.", fallbackTrigger: "Falls back when summary is short enough for Flash." },
  "debrief:api:10to15:notool":            { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best debrief quality in this API budget range.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Fast backup for routine daily summaries.", fallbackTrigger: "Falls back when summary is short enough for Flash." },
  "debrief:api:15to20:tool":              { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best debrief quality in this API budget range.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Fast backup for routine daily summaries.", fallbackTrigger: "Falls back when summary is short enough for Flash." },
  "debrief:api:15to20:notool":            { primaryId: "moonshot/kimi-k2.5", primaryReason: "Best debrief quality in this API budget range.", fallbackId: "google/gemini-2.5-flash", fallbackReason: "Fast backup for routine daily summaries.", fallbackTrigger: "Falls back when summary is short enough for Flash." },
  "debrief:api:20to40:tool":              { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best summary quality at this API budget.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine debrief tasks.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:api:40plus:tool":              { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best summary quality at this API budget.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine debrief tasks.", fallbackTrigger: "Falls back when the recap is straightforward." },
  "debrief:api:40plus:notool":            { primaryId: "anthropic/claude-sonnet-4-6", primaryReason: "Best summary quality at this API budget.", fallbackId: "moonshot/kimi-k2.5", fallbackReason: "Cost-effective backup for routine debrief tasks.", fallbackTrigger: "Falls back when the recap is straightforward." },
};

// ─── Default ──────────────────────────────────────────────────────────────────

const DEFAULT_RULE: RuleConfig = {
  primaryId: "anthropic/claude-sonnet-4-6",
  primaryReason: "Safest all-around choice when your inputs do not strongly point elsewhere.",
  fallbackId: "anthropic/claude-haiku-4-5",
  fallbackReason: "Lower-cost backup that keeps behavior predictable.",
  fallbackTrigger: "Falls back when the primary model is overkill for the next turn.",
};

// ─── Free tier rules ──────────────────────────────────────────────────────────

const FREE_RULES: Record<string, RuleConfig> = {
  "yes": {
    primaryId: "ollama/llama3.3",
    primaryReason: "Best zero-dollar option when you can run a capable local model.",
    fallbackId: "qwen-portal/coder-model",
    fallbackReason: "Free hosted fallback when local model is unavailable.",
    fallbackTrigger: "Falls back when the local model cannot handle the request or is offline.",
    caveat: "Local model requires capable hardware (8GB+ RAM recommended).",
  },
  "no": {
    primaryId: "qwen-portal/coder-model",
    primaryReason: "Reliable free hosted option when local setup is not available.",
    fallbackId: "openrouter/z-ai/glm-4.5-air",
    fallbackReason: "Alternative free hosted path when primary is rate-limited.",
    fallbackTrigger: "Falls back when the primary free route is rate-limited or busy.",
    caveat: "Free models rate-limit unpredictably. Expect slower responses.",
  },
};

// ─── Main export ──────────────────────────────────────────────────────────────

export function getRecommendation(input: PickerInput): PickerOutput {
  if (!input.useCase) {
    return {
      primary: { displayName: "No Model Selected", provider: "None", modelId: "none", reason: "Select a use case to get a recommendation", triggerCondition: undefined, estimatedMonthly: { low: 0, high: 0 } },
      fallback: { displayName: "No Fallback", provider: "None", modelId: "none", reason: "No fallback available", triggerCondition: undefined },
      openRouterWarning: false,
      costRange: { low: 0, high: 0 },
    };
  }

  // "other" resolves to assistant logic
  const resolvedInput = input.useCase === "other"
    ? { ...input, useCase: "assistant" as const }
    : input;

  // Free tier — bypass table
  if (resolvedInput.budget === "free") {
    const rule = FREE_RULES[resolvedInput.localOk] ?? FREE_RULES["no"];
    return buildOutput(rule, resolvedInput, false);
  }

  const tb = toolBucket(resolvedInput);
  const useCase = resolvedInput.useCase!;
  const { billing, budget } = resolvedInput;

  // GPT primary path: 20to40 + notool + supported useCase
  const isGptSplitUseCase = (GPT_SPLIT_USE_CASES as readonly string[]).includes(useCase);
  if (budget === "20to40" && tb === "notool" && isGptSplitUseCase) {
    return buildOutput(GPT_PRIMARY, resolvedInput, false);
  }

  // Lookup in table
  const lookupKey = key(useCase, billing, budget, tb);
  const rule = RULE_TABLE[lookupKey] ?? DEFAULT_RULE;

  // showComparison: Claude primary + 20to40 + tool bucket
  const showComparison =
    budget === "20to40" &&
    tb === "tool" &&
    isGptSplitUseCase &&
    rule.primaryId === "anthropic/claude-sonnet-4-6";

  // Local fallback override
  if (resolvedInput.localOk === "yes") {
    const output = buildOutput(rule, resolvedInput, showComparison);
    return {
      ...output,
      fallback: {
        displayName: "Llama 3.3 (Local)",
        provider: "Ollama",
        modelId: "ollama/llama3.3",
        reason: "Local model as fallback — no API cost when primary hits rate limit.",
        triggerCondition: "Falls back when primary model rate-limits or you want zero API cost.",
      },
    };
  }

  return buildOutput(rule, resolvedInput, showComparison);
}

function buildOutput(
  rule: RuleConfig,
  input: PickerInput,
  showComparison: boolean,
): PickerOutput {
  const costRange = getEstimatedMonthlyRange(input, rule.primaryId, rule.fallbackId);
  return {
    primary: { ...buildModelEntry(rule.primaryId, rule.primaryReason), estimatedMonthly: costRange },
    fallback: buildModelEntry(rule.fallbackId, rule.fallbackReason, rule.fallbackTrigger),
    openRouterWarning: hasOpenRouterModel([rule.primaryId, rule.fallbackId]),
    costRange,
    caveat: rule.caveat,
    showComparison,
  };
}