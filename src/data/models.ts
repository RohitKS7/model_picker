import type { ModelEntry } from "@/types/picker";

interface ModelDefinition {
  displayName: string;
  provider: string;
  modelId: string;
  openRouter?: boolean;
}

const MODEL_DEFINITIONS: Record<string, ModelDefinition> = {
  "anthropic/claude-opus-4-6": {
    displayName: "Claude Opus 4.6",
    provider: "Anthropic",
    modelId: "anthropic/claude-opus-4-6",
  },
  "anthropic/claude-sonnet-4-6": {
    displayName: "Claude Sonnet 4.6",
    provider: "Anthropic",
    modelId: "anthropic/claude-sonnet-4-6",
  },
  "anthropic/claude-haiku-4-5": {
    displayName: "Claude Haiku 4.5",
    provider: "Anthropic",
    modelId: "anthropic/claude-haiku-4-5",
  },
  "google/gemini-2.5-pro": {
    displayName: "Gemini 2.5 Pro",
    provider: "Google",
    modelId: "google/gemini-2.5-pro",
  },
  "google/gemini-2.5-flash": {
    displayName: "Gemini 2.5 Flash",
    provider: "Google",
    modelId: "google/gemini-2.5-flash",
  },
  "moonshot/kimi-k2.5": {
    displayName: "Kimi K2.5",
    provider: "Moonshot",
    modelId: "moonshot/kimi-k2.5",
  },
  "minimax/minimax-m2.5": {
    displayName: "MiniMax M2.5",
    provider: "MiniMax",
    modelId: "minimax/minimax-m2.5",
  },
  "openai-codex/gpt-5.3-codex": {
    displayName: "GPT-5.3 Codex",
    provider: "OpenAI Codex OAuth",
    modelId: "openai-codex/gpt-5.3-codex",
  },
  "qwen-portal/coder-model": {
    displayName: "Qwen Coder Portal",
    provider: "Qwen Portal",
    modelId: "qwen-portal/coder-model",
  },
  "ollama/llama3.3": {
    displayName: "Llama 3.3 Local",
    provider: "Ollama",
    modelId: "ollama/llama3.3",
  },
};

export const buildModelEntry = (
  modelId: string,
  reason: string,
  triggerCondition?: string,
): ModelEntry => {
  const model = MODEL_DEFINITIONS[modelId];

  if (!model) {
    throw new Error(`Unknown model definition: ${modelId}`);
  }

  return {
    displayName: model.displayName,
    provider: model.provider,
    modelId: model.modelId,
    reason,
    triggerCondition,
  };
};

export const hasOpenRouterModel = (modelIds: string[]): boolean =>
  modelIds.some((modelId) => MODEL_DEFINITIONS[modelId]?.openRouter);
