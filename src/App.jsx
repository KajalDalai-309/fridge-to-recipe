import { useState, useRef } from "react";
import { generateRecipe } from "./lib/api";
import { validateRecipe } from "./lib/validateRecipe";
import PromptInput from "./components/PromptInput";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import RecipeView from "./components/RecipeView";

// Map of status values to understand the state machine:
// "idle"    -> nothing has happened yet (show EmptyState)
// "loading" -> waiting for recipe response (show LoadingState)
// "success" -> recipe parsed and validated (show RecipeView)
// "error"   -> something failed (show ErrorState)

export default function App() {
  const [inputText, setInputText] = useState("");
  const [inputError, setInputError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);
  const [recipe, setRecipe] = useState(null);

  // Stale response guard: each submission gets a unique ID.
  // If a newer submission arrives before an older one resolves,
  // the older result is discarded.
  const requestIdRef = useRef(0);

  function validateInput(text) {
    const trimmed = text.trim();
    if (!trimmed) return "Please enter at least one ingredient.";
    if (trimmed.length < 3) return "Please enter a bit more detail.";
    if (trimmed.length > 500) return "Input is too long. Please keep it under 500 characters.";
    return null;
  }

  function handleInputChange(text) {
    setInputText(text);
    if (inputError) setInputError(null);
  }

  async function handleSubmit() {
    const validationError = validateInput(inputText);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    setInputError(null);
    requestIdRef.current += 1;
    const thisId = requestIdRef.current;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const rawText = await generateRecipe(inputText);

      // Discard if a newer request has already started
      if (thisId !== requestIdRef.current) return;

      const parsed = validateRecipe(rawText);

      if (!parsed) {
        setStatus("error");
        setErrorMessage("The AI returned an unexpected format. Please try again.");
        return;
      }

      setRecipe(parsed);
      setStatus("success");
    } catch (err) {
      if (thisId !== requestIdRef.current) return;
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  function handleRetry() {
    handleSubmit();
  }

  function handleReset() {
    setStatus("idle");
    setRecipe(null);
    setErrorMessage(null);
    setInputText("");
    setInputError(null);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <span className="logo-icon" aria-hidden="true">🍳</span>
          <h1 className="logo-text">PantryChef</h1>
        </div>
      </header>

      <main className="main-content" id="main-content">
        <PromptInput
          value={inputText}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={status === "loading"}
          inputError={inputError}
        />

        <section aria-live="polite" aria-atomic="true" className="result-area">
          {status === "idle" && <EmptyState />}
          {status === "loading" && <LoadingState />}
          {status === "error" && (
            <ErrorState message={errorMessage} onRetry={handleRetry} />
          )}
          {status === "success" && recipe && (
            <RecipeView recipe={recipe} onReset={handleReset} />
          )}
        </section>
      </main>
    </div>
  );
}
