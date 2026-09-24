// Mock recipe and swap data for Phase 3 UI development
// Formatted as raw JSON strings to test validateRecipe() and validateSwap()

export const MOCK_RECIPE_JSON = JSON.stringify({
  name: "Garden Herb Frittata",
  description: "A fluffy, golden skillet frittata packed with sautéed onions, juicy ripe tomatoes, melted cheese, and fresh herbs.",
  defaultServings: 2,
  ingredients: [
    { id: "ing-1", name: "eggs", quantity: 4, unit: "large" },
    { id: "ing-2", name: "tomatoes", quantity: 2, unit: "medium" },
    { id: "ing-3", name: "onion", quantity: 1, unit: "medium" },
    { id: "ing-4", name: "cheddar cheese", quantity: 50, unit: "g" },
    { id: "ing-5", name: "olive oil", quantity: 1, unit: "tbsp" }
  ],
  steps: [
    { id: "step-1", instruction: "Whisk eggs with a pinch of salt and freshly cracked black pepper in a bowl." },
    { id: "step-2", instruction: "Dice the tomatoes and finely chop the onion." },
    { id: "step-3", instruction: "Heat olive oil in an 8-inch nonstick oven-safe skillet over medium heat." },
    { id: "step-4", instruction: "Sauté the chopped onion until translucent (about 3 minutes), then add diced tomatoes for 1 minute." },
    { id: "step-5", instruction: "Pour whisked eggs into the skillet and evenly scatter the cheese across the top." },
    { id: "step-6", instruction: "Cook over low heat until edges set (4-5 minutes), then transfer under broiler for 2 minutes until puffed and golden." }
  ]
});

export const MOCK_SWAP_MAP = {
  eggs: {
    original: "eggs",
    alternative: "silken tofu",
    note: "1/4 cup blended silken tofu mimics the moisture and texture of 1 egg."
  },
  tomatoes: {
    original: "tomatoes",
    alternative: "roasted red peppers",
    note: "Provides sweet, smoky flavor and tender moisture."
  },
  onion: {
    original: "onion",
    alternative: "shallots",
    note: "Shallots deliver a subtle, milder allium taste."
  },
  "cheddar cheese": {
    original: "cheddar cheese",
    alternative: "nutritional yeast",
    note: "Imparts a savory, nutty, dairy-free cheesy profile."
  },
  "olive oil": {
    original: "olive oil",
    alternative: "butter",
    note: "Offers rich flavor and smooth skillet browning."
  }
};

export function getMockSwap(ingredientName) {
  const lower = ingredientName.toLowerCase().trim();
  for (const [key, val] of Object.entries(MOCK_SWAP_MAP)) {
    if (lower.includes(key)) {
      return JSON.stringify(val);
    }
  }
  return JSON.stringify({
    original: ingredientName,
    alternative: "herbed breadcrumbs",
    note: "Adds texture and seasoned flavor to complete the dish."
  });
}
