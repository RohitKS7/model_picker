export type UseCase = "coding" | "assistant" | "automation" | "research" | "debrief" | "other";
export type Budget = "free" | "under20" | "20to50" | "50plus";
export type Billing = "subscription" | "api";
export type ToolCallsRequired = "yes" | "no" | "unsure";
export type LocalOk = "yes" | "no";

export interface PickerInput {
  useCase: UseCase;
  budget: Budget;
  billing: Billing;
  toolCalls: ToolCallsRequired;
  localOk: LocalOk;
}

export interface ModelEntry {
  displayName: string;
  provider: string;
  modelId: string;
  reason: string;
  triggerCondition?: string;
}

export interface PickerOutput {
  primary: ModelEntry & { estimatedMonthly: { low: number; high: number } };
  fallback: ModelEntry;
  openRouterWarning: boolean;
  costRange: { low: number; high: number };
}
