export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{message}</p>
      <button
        className="retry-btn"
        onClick={onRetry}
        type="button"
        aria-label="Retry generating the recipe"
      >
        Try Again
      </button>
    </div>
  );
}
