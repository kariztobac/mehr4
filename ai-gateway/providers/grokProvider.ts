/**
 * Grok Provider (current default)
 * Later other providers will be added as separate adapters
 */

import { AIProvider, AICompletionRequest, AICompletionResponse } from "../types";

export const grokProvider: AIProvider = {
  id: "grok",
  name: "Grok (xAI)",

  isAvailable: () => {
    // In real environment, check for API key or connection
    return true;
  },

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    // Placeholder: In production this will call the real Grok API
    // For now we return a structured mock that indicates the provider

    const lastUserMessage = [...request.messages].reverse().find((m) => m.role === "user");

    return {
      content: `[Grok Provider - Mock Response]\n\nدرخواست شما دریافت شد.\nپیام آخر کاربر: ${lastUserMessage?.content?.slice(0, 200) || "—"}`,
      provider: "grok",
      model: request.model || "grok-default",
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  },
};
