/**
 * AI Gateway - Central entry point for all AI calls
 * 
 * Design goals:
 * - Single place to switch providers
 * - Easy to add OpenAI, Anthropic, local models later
 * - No business logic depends on a specific provider
 */

import { AIProvider, AICompletionRequest, AICompletionResponse, AIProviderId } from "./types";
import { grokProvider } from "./providers/grokProvider";

// Registry of available providers
const providers: Record<AIProviderId, AIProvider> = {
  grok: grokProvider,
  // Future:
  // openai: openaiProvider,
  // anthropic: anthropicProvider,
  // local: localProvider,
  openai: grokProvider,      // temporary fallback
  anthropic: grokProvider,   // temporary fallback
  local: grokProvider,       // temporary fallback
  custom: grokProvider,      // temporary fallback
};

// Default provider (can be changed via env or settings later)
const DEFAULT_PROVIDER: AIProviderId = "grok";

export async function complete(
  request: AICompletionRequest
): Promise<AICompletionResponse> {
  const providerId = request.provider || DEFAULT_PROVIDER;
  const provider = providers[providerId] || providers[DEFAULT_PROVIDER];

  if (!(await provider.isAvailable())) {
    throw new Error(`Provider ${providerId} is not available`);
  }

  return provider.complete(request);
}

export function getAvailableProviders(): AIProviderId[] {
  return Object.keys(providers) as AIProviderId[];
}

export function getDefaultProvider(): AIProviderId {
  return DEFAULT_PROVIDER;
}

// Re-export types for convenience
export type { AICompletionRequest, AICompletionResponse, AIProviderId, AIMessage };
