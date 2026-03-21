import { DEFAULT_PICKER_INPUT } from "@/data/defaults";
import type { Budget, Billing, LocalOk, PickerInput, ToolCallsRequired, UseCase } from "@/types/picker";

const USE_CASES: UseCase[] = ["coding", "assistant", "automation", "research", "debrief", "other"];
const BUDGETS: Budget[] = ["free", "under20", "20to50", "50plus"];
const BILLING_TYPES: Billing[] = ["subscription", "api"];
const TOOL_CALL_OPTIONS: ToolCallsRequired[] = ["yes", "no", "unsure"];
const LOCAL_OPTIONS: LocalOk[] = ["yes", "no"];

const coerceEnum = <T extends string>(value: string | null, allowed: T[], fallback: T): T =>
  value && allowed.includes(value as T) ? (value as T) : fallback;

export const decodeStateFromParams = (params: URLSearchParams): PickerInput => ({
  useCase: coerceEnum(params.get("uc"), USE_CASES, DEFAULT_PICKER_INPUT.useCase),
  budget: coerceEnum(params.get("b"), BUDGETS, DEFAULT_PICKER_INPUT.budget),
  billing: coerceEnum(params.get("bill"), BILLING_TYPES, DEFAULT_PICKER_INPUT.billing),
  toolCalls: coerceEnum(params.get("tc"), TOOL_CALL_OPTIONS, DEFAULT_PICKER_INPUT.toolCalls),
  localOk: coerceEnum(params.get("local"), LOCAL_OPTIONS, DEFAULT_PICKER_INPUT.localOk),
});

export const encodeStateToParams = (input: PickerInput): URLSearchParams => {
  const params = new URLSearchParams();

  params.set("uc", input.useCase);
  params.set("b", input.budget);
  params.set("bill", input.billing);
  params.set("tc", input.toolCalls);
  params.set("local", input.localOk);

  return params;
};
