require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Single endpoint — handles both recipe generation and ingredient swap
app.post("/api/generate", async (req, res) => {
  const { type, input, context } = req.body;

  if (!type || !input) {
    return res.status(400).json({ error: "Missing required fields: type, input" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error: missing API key" });
  }

  let prompt = "";

  if (type === "recipe") {
    prompt = buildRecipePrompt(input);
  } else if (type === "swap") {
    if (!context || !context.recipeName) {
      return res.status(400).json({ error: "Missing context for swap request" });
    }
    prompt = buildSwapPrompt(input, context.recipeName);
  } else {
    return res.status(400).json({ error: "Invalid type. Must be 'recipe' or 'swap'" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Groq API error:", response.status, errorBody);
      return res.status(502).json({ error: "LLM provider error. Please try again." });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content ?? "";

    if (!rawText) {
      return res.status(502).json({ error: "LLM returned an empty response." });
    }

    res.json({ result: rawText });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

function buildRecipePrompt(ingredients) {
  return `You are a recipe generator API.
The user has these ingredients available: "${ingredients}"

Return ONLY a valid JSON object matching this exact shape. No prose, no markdown, no explanation outside the JSON:

{
  "name": string,
  "description": string,
  "defaultServings": number,
  "ingredients": [
    { "id": string, "name": string, "quantity": number, "unit": string }
  ],
  "steps": [
    { "id": string, "instruction": string }
  ]
}

Rules:
- quantity must always be a number, never a string like "a handful"
- id values must be unique: "ing-1", "ing-2", "step-1", "step-2", etc.
- You may use basic pantry staples (salt, pepper, water, oil) even if not listed
- Return nothing outside the JSON object. Do not wrap in markdown code fences.`;
}

function buildSwapPrompt(ingredientName, recipeName) {
  return `You are a cooking assistant API.
Suggest one direct substitute for this ingredient.

Ingredient to swap: "${ingredientName}"
Recipe: "${recipeName}"

Return ONLY a valid JSON object. No prose, no markdown, no code fences:

{
  "original": string,
  "alternative": string,
  "note": string
}`;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
