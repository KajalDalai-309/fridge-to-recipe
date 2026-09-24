import { useState } from "react";
import IngredientList from "./IngredientList";
import StepList from "./StepList";

export default function RecipeView({ recipe, onReset }) {
  const initialServings = Math.max(1, Math.min(8, Number(recipe.defaultServings) || 2));
  const [servings, setServings] = useState(initialServings);

  function decreaseServings() {
    setServings((s) => Math.max(1, s - 1));
  }

  function increaseServings() {
    setServings((s) => Math.min(8, s + 1));
  }

  return (
    <article className="recipe-card" aria-label={`Recipe: ${recipe.name}`}>
      <div className="recipe-header">
        <h2 className="recipe-name">{recipe.name}</h2>
        <p className="recipe-desc">{recipe.description}</p>

        <div className="servings-row">
          <span className="servings-label" id="servings-label">Servings:</span>
          <div className="servings-stepper" role="group" aria-labelledby="servings-label">
            <button
              className="stepper-btn"
              onClick={decreaseServings}
              disabled={servings <= 1}
              aria-label="Decrease servings"
              type="button"
            >
              −
            </button>
            <span className="stepper-value" aria-live="polite" aria-label={`${servings} servings`}>
              {servings}
            </span>
            <button
              className="stepper-btn"
              onClick={increaseServings}
              disabled={servings >= 8}
              aria-label="Increase servings"
              type="button"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <IngredientList
        ingredients={recipe.ingredients}
        defaultServings={recipe.defaultServings}
        currentServings={servings}
        recipeName={recipe.name}
      />

      <StepList steps={recipe.steps} />

      <div className="recipe-footer">
        <button
          className="reset-btn"
          onClick={onReset}
          type="button"
          aria-label="Start over with new ingredients"
        >
          Try New Recipe
        </button>
      </div>
    </article>
  );
}
