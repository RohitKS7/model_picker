import { MODEL_PRICING } from "@/data/pricing";
import type { Budget, Billing, PickerInput, UseCase } from "@/types/picker";

interface UsageProfile {
  lowInputMillions: number;
  lowOutputMillions: number;
  highInputMillions: number;
  highOutputMillions: number;
}

const USAGE_PROFILES: Record<UseCase, UsageProfile> = {
  coding: { lowInputMillions: 0.6, lowOutputMillions: 0.35, highInputMillions: 1.4, highOutputMillions: 0.9 },
  assistant: { lowInputMillions: 0.35, lowOutputMillions: 0.2, highInputMillions: 0.9, highOutputMillions: 0.55 },
  automation: { lowInputMillions: 0.45, lowOutputMillions: 0.22, highInputMillions: 1.15, highOutputMillions: 0.7 },
  research: { lowInputMillions: 0.7, lowOutputMillions: 0.45, highInputMillions: 1.8, highOutputMillions: 1.15 },
  debrief: { lowInputMillions: 0.18, lowOutputMillions: 0.12, highInputMillions: 0.55, highOutputMillions: 0.35 },
  other: { lowInputMillions: 0.3, lowOutputMillions: 0.2, highInputMillions: 1.0, highOutputMillions: 0.6 },
};

const BUDGET_MULTIPLIERS: Record<Budget, number> = {
  free: 0,
  under20: 0.8,
  "20to50": 1.15,
  "50plus": 1.75,
};

const BILLING_MULTIPLIERS: Record<Billing, number> = {
  subscription: 0.85,
  api: 1,
};

const roundRangeValue = (value: number): number => {
  if (value <= 0) {
    return 0;
  }

  if (value < 5) {
    return Math.round(value * 10) / 10;
  }

  return Math.round(value);
};

const calculateModelCost = (
  modelId: string,
  inputMillions: number,
  outputMillions: number,
): number => {
  const price = MODEL_PRICING[modelId];

  if (!price || price.free || price.localCompute) {
    return 0;
  }

  return inputMillions * (price.input ?? 0) + outputMillions * (price.output ?? 0);
};

export const getEstimatedMonthlyRange = (
  input: PickerInput,
  primaryModelId: string,
  fallbackModelId: string,
): { low: number; high: number } => {
  if (input.budget === "free") {
    return { low: 0, high: input.localOk === "yes" ? 2 : 4 };
  }

  const profile = USAGE_PROFILES[input.useCase];
  const budgetMultiplier = BUDGET_MULTIPLIERS[input.budget];
  const billingMultiplier = BILLING_MULTIPLIERS[input.billing];
  const lowInputMillions = profile.lowInputMillions * budgetMultiplier * billingMultiplier;
  const lowOutputMillions = profile.lowOutputMillions * budgetMultiplier * billingMultiplier;
  const highInputMillions = profile.highInputMillions * budgetMultiplier * billingMultiplier;
  const highOutputMillions = profile.highOutputMillions * budgetMultiplier * billingMultiplier;

  const lowPrimary = calculateModelCost(primaryModelId, lowInputMillions, lowOutputMillions);
  const highPrimary = calculateModelCost(primaryModelId, highInputMillions, highOutputMillions);
  const lowFallback = calculateModelCost(fallbackModelId, lowInputMillions * 0.12, lowOutputMillions * 0.12);
  const highFallback = calculateModelCost(fallbackModelId, highInputMillions * 0.18, highOutputMillions * 0.18);

  return {
    low: roundRangeValue(lowPrimary + lowFallback),
    high: roundRangeValue(highPrimary + highFallback),
  };
};
