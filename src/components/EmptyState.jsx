export default function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-label="Ready to generate a recipe">
      <div className="empty-icon" aria-hidden="true">🥗</div>
      <h2 className="empty-title">Your recipe will appear here</h2>
      <p className="empty-desc">
        Type your ingredients above and hit Generate Recipe.
      </p>
    </div>
  );
}
