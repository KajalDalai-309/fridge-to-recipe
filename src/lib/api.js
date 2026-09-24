// All LLM API calls go through this file only.
// Components never call the LLM directly.
// The actual API key is on the server - this only calls /api/generate.

import { MOCK_RECIPE_JSON, getMockSwap } from "./mockData";

// Production safety guarantee: mock mode is strictly disabled in production builds.
// In development, mock mode is only enabled if explicitly requested via VITE_USE_MOCK === "true".
const USE_MOCK = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true";

const TIMEOUT_MS = 30000;

async function callGenerate(body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      let message = "Server error. Please try again.";
      try {
        const err = await response.json();
        if (err.error) message = err.error;
      } catch {
        // ignore JSON parse failure on error response
      }
      // Preserve the rate-limit sentinel so callers can show a specific message
      throw new Error(message);
    }

    const data = await response.json();
    return data.result;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
}

export async function generateRecipe(ingredients) {
  if (USE_MOCK) {
    // Brief simulated delay for realistic UI skeleton testing
    await new Promise((r) => setTimeout(r, 450));

    const trimmed = ingredients.trim().toLowerCase();
    if (trimmed === "trigger-error" || trimmed === "fail") {
      throw new Error("Failed to generate recipe from provider. Please try again.");
    }
    if (trimmed === "trigger-invalid") {
      return "{ invalidJson: ";
    }
    return MOCK_RECIPE_JSON;
  }

  return callGenerate({ type: "recipe", input: ingredients });
}

export async function swapIngredient(ingredientName, recipeName) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 350));

    if (ingredientName.toLowerCase().includes("fail")) {
      throw new Error("Failed to find alternative.");
    }
    return getMockSwap(ingredientName);
  }

  return callGenerate({
    type: "swap",
    input: ingredientName,
    context: { recipeName },
  });
}