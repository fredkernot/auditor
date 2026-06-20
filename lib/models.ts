import { createOpenRouter } from "@openrouter/ai-sdk-provider";

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing from environment variables");
}

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Model configurations
export const MODELS = {
  AGENDA_SETTER: "google/gemini-2.5-flash-lite", // Cheap model for triage + agenda
  DEBATER_A: "google/gemini-2.5-flash-lite",     // Gemini 2.5 Flash Lite (frozen decision)
  DEBATER_B: "deepseek/deepseek-chat",           // DeepSeek V3 chat slug
};