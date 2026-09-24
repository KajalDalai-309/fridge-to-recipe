import { useState } from "react";
import { swapIngredient } from "../lib/api";
import { validateSwap } from "../lib/validateRecipe";

export default function IngredientItem({ ingredient, defaultServings, currentServings, recipeName }) {
  const [swapStatus, setSwapStatus] = useState("idle");
  const [swapped, setSwapped] = useState(null);
  const [swapError, setSwapError] = useState(null);

  // Scale quantity proportionally to current servings
  const baseQty = typeof ingredient.quantity === "number" ? ingredient.quantity : 1;
  const baseServings = typeof defaultServings === "number" && defaultServings > 0 ? defaultServings : 2;
  const scaledQty = (baseQty / baseServings) * currentServings;
  const displayQty = Number(scaledQty.toFixed(1));

  async function handleSwap() {
    setSwapStatus("loading");
    setSwapError(null);

    try {
      const rawText = await swapIngredient(ingredient.name, recipeName);
      const result = validateSwap(rawText);

      if (!result) {
        setSwapStatus("error");
        setSwapError("no-alternative");
        return;
      }

      setSwapped(result);
      setSwapStatus("done");
    } catch (err) {
      setSwapStatus("error");
      // Detect rate-limit sentinel from backend
      if (err?.message === "rate-limit") {
        setSwapError("rate-limit");
      } else {
        setSwapError("no-alternative");
      }
    }
  }

  function handleUndo() {
    setSwapStatus("idle");
    setSwapError(null);
    setSwapped(null);
  }

  const displayName = swapStatus === "done" && swapped ? swapped.alternative : ingredient.name;
  const isSwapped = swapStatus === "done" && Boolean(swapped);

  // Human-readable error text based on error type
  const swapErrorText =
    swapError === "rate-limit"
      ? "Too many requests — wait 15s and retry."
      : "No substitute found.";

  return (
    <li className={`ingredient-item${isSwapped ? " ingredient-item--swapped" : ""}`}>
      <span className="ingredient-qty">{displayQty} {ingredient.unit}</span>
      <span className="ingredient-name">
        {displayName}
        {isSwapped && (
          <span className="swap-note" title={swapped.note}> (swapped)</span>
        )}
      </span>

      {swapStatus === "idle" && (
        <button
          className="swap-btn"
          onClick={handleSwap}
          type="button"
          aria-label={`Find substitute for ${ingredient.name}`}
        >
          <span aria-hidden="true">&#8652;</span> Swap
        </button>
      )}

      {swapStatus === "loading" && (
        <span className="swap-loading" aria-label={`Finding alternative for ${ingredient.name}...`} aria-busy="true">
          ...
        </span>
      )}

      {swapStatus === "done" && (
        <button
          className="swap-btn swap-btn--undo"
          onClick={handleUndo}
          type="button"
          aria-label={`Undo swap for ${ingredient.name}`}
        >
          Undo
        </button>
      )}

      {swapStatus === "error" && (
        <span className="swap-error" role="alert">
          {swapErrorText}
          <button
            className="swap-btn swap-btn--retry"
            onClick={handleSwap}
            type="button"
            aria-label={`Retry finding substitute for ${ingredient.name}`}
          >
            Retry
          </button>
        </span>
      )}
    </li>
  );
}