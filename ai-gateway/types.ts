/**
 * AI Gateway Types
 * Designed from day one for multi-provider support (Airplane Principle)
 */

export type AIProviderId = "grok" | "openai" | "anthropic" | "local" | "custom";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: AIProviderId;
}

export interface AICompletionResponse {
  content: string;
  provider: AIProviderId;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  raw?: unknown;
}

export interface AIProvider {
  id: AIProviderId;
  name: string;
  isAvailable: () => boolean | Promise<boolean>;
  complete: (request: AICompletionRequest) => Promise<AICompletionResponse>;
}
