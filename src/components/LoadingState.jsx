export default function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-label="Generating recipe, please wait">
      <div className="skeleton-card" aria-hidden="true">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-desc"></div>
        <div className="skeleton-line skeleton-desc skeleton-short"></div>
        <div className="skeleton-divider"></div>
        <div className="skeleton-line skeleton-item"></div>
        <div className="skeleton-line skeleton-item"></div>
        <div className="skeleton-line skeleton-item skeleton-short"></div>
        <div className="skeleton-divider"></div>
        <div className="skeleton-line skeleton-item"></div>
        <div className="skeleton-line skeleton-item"></div>
        <div className="skeleton-line skeleton-item"></div>
      </div>
      <p className="loading-text">Crafting your recipe...</p>
    </div>
  );
}
