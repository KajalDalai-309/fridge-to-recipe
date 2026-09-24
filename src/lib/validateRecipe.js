// Validates the raw JSON string from the LLM before anything reaches the UI.
// Returns a parsed recipe object if valid, or null if anything fails.

export function validateRecipe(rawText) {
  let data;

  // Step 1: Parse
  try {
    // LLMs sometimes wrap JSON in markdown code fences — strip them if present
    const cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/i, "");
    data = JSON.parse(cleaned);
  } catch {
    return null;
  }

  // Step 2: Top-level shape check
  if (
    typeof data.name !== "string" || data.name.trim() === "" ||
    typeof data.description !== "string" || data.description.trim() === "" ||
    typeof data.defaultServings !== "number" || data.defaultServings < 1 ||
    !Array.isArray(data.ingredients) ||
    !Array.isArray(data.steps)
  ) {
    return null;
  }

  // Step 3: Empty arrays
  if (data.ingredients.length === 0 || data.steps.length === 0) {
    return null;
  }

  // Step 4: Validate each ingredient
  for (const ing of data.ingredients) {
    if (
      typeof ing.id !== "string" ||
      typeof ing.name !== "string" || ing.name.trim() === "" ||
      typeof ing.quantity !== "number" ||
      typeof ing.unit !== "string"
    ) {
      return null;
    }
  }

  // Step 5: Validate each step
  for (const step of data.steps) {
    if (
      typeof step.id !== "string" ||
      typeof step.instruction !== "string" || step.instruction.trim() === ""
    ) {
      return null;
    }
  }

  return data;
}

// Validates the swap response JSON
export function validateSwap(rawText) {
  let data;

  try {
    const cleaned = rawText.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/i, "");
    data = JSON.parse(cleaned);
  } catch {
    return null;
  }

  if (
    typeof data.original !== "string" || data.original.trim() === "" ||
    typeof data.alternative !== "string" || data.alternative.trim() === "" ||
    typeof data.note !== "string"
  ) {
    return null;
  }

  return data;
}
