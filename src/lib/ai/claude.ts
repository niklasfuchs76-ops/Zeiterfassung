import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  _client = new Anthropic({ apiKey });
  return _client;
}

// Default models per spec: Sonnet 4.6 for generation, Haiku 4.5 for classification/fast tasks.
export const MODELS = {
  generation: "claude-sonnet-4-6",
  fast: "claude-haiku-4-5-20251001",
} as const;

export type ClaudeModel = (typeof MODELS)[keyof typeof MODELS];
