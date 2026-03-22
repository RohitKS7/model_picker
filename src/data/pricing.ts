export interface ModelPrice {
  provider: string;
  input?: number;
  output?: number;
  free?: boolean;
  rateLimitOnly?: boolean;
  localCompute?: boolean;
}

export const PRICING_LAST_UPDATED = "2026-03-11";

export const MODEL_PRICING: Record<string, ModelPrice> = {
  "anthropic/claude-opus-4-6": { provider: "Anthropic", input: 5, output: 25 },
  "anthropic/claude-sonnet-4-6": { provider: "Anthropic", input: 3, output: 15 },
  "anthropic/claude-haiku-4-5": { provider: "Anthropic", input: 1, output: 5 },
  "google/gemini-2.5-pro": { provider: "Google", input: 1.25, output: 10 },
  "google/gemini-2.5-flash": { provider: "Google", input: 0.3, output: 2.5 },
  "moonshot/kimi-k2.5": { provider: "Moonshot", input: 0.6, output: 2.5 },
  "minimax/minimax-m2.5": { provider: "MiniMax", input: 0.2, output: 1.1 },
  "openai/gpt-5.2": { provider: "OpenAI", input: 1.75, output: 14.00 },
  "openai/gpt-5.4": { provider: "OpenAI", input: 2.50, output: 15.00 },
  "openai/gpt-4o": { provider: "OpenAI", input: 2.50, output: 10.00 },
  "openai-codex/gpt-5.3-codex": {
    provider: "OpenAI Codex",
    free: true,
    rateLimitOnly: true,
  },
  "qwen-portal/coder-model": {
    provider: "Qwen",
    free: true,
    rateLimitOnly: true,
  },
  "ollama/llama3.3": {
    provider: "Ollama",
    input: 0,
    output: 0,
    localCompute: true,
  },
};
