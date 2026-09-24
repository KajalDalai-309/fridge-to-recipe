const EXAMPLE_CHIPS = [
  "eggs, tomatoes, onion, olive oil",
  "chicken, rice, garlic, lemon",
  "pasta, cream, mushrooms, parmesan",
];

export default function PromptInput({ value, onChange, onSubmit, isLoading, inputError }) {
  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      onSubmit();
    }
  }

  return (
    <section className="prompt-section" aria-label="Ingredient input">
      <div className="prompt-card">
        <label htmlFor="ingredient-input" className="prompt-label">
          What ingredients do you have?
        </label>

        <textarea
          id="ingredient-input"
          className={`prompt-textarea${inputError ? " prompt-textarea--error" : ""}`}
          placeholder="e.g. eggs, tomatoes, onion, olive oil, cheese..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-describedby={inputError ? "input-error" : "input-hint"}
          maxLength={500}
          rows={3}
        />

        {inputError ? (
          <p id="input-error" className="input-error" role="alert">
            {inputError}
          </p>
        ) : (
          <p id="input-hint" className="input-hint">
            Separate ingredients with commas. Press Ctrl+Enter to submit.
          </p>
        )}

        <div className="chip-row" aria-label="Example ingredients">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              className="chip"
              onClick={() => onChange(chip)}
              disabled={isLoading}
              type="button"
              aria-label={`Use example: ${chip}`}
            >
              {chip}
            </button>
          ))}
        </div>

        <button
          id="generate-btn"
          className="generate-btn"
          onClick={onSubmit}
          disabled={isLoading}
          type="button"
          aria-busy={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>
    </section>
  );
}
