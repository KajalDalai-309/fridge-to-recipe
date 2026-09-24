import IngredientItem from "./IngredientItem";

export default function IngredientList({ ingredients, defaultServings, currentServings, recipeName }) {
  return (
    <section className="ingredients-section" aria-label="Ingredients">
      <h3 className="section-title">Ingredients</h3>
      <ul className="ingredient-list" aria-label="Ingredient list">
        {ingredients.map((ing) => (
          <IngredientItem
            key={ing.id}
            ingredient={ing}
            defaultServings={defaultServings}
            currentServings={currentServings}
            recipeName={recipeName}
          />
        ))}
      </ul>
    </section>
  );
}
