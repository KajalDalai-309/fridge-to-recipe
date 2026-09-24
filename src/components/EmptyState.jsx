export default function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-label="Ready to generate a recipe">
      <div className="empty-illustration" aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pan body */}
          <ellipse cx="34" cy="44" rx="22" ry="12" fill="#2a2a2a" stroke="#f97316" strokeWidth="2"/>
          {/* Pan handle */}
          <rect x="54" y="41" width="14" height="6" rx="3" fill="#f97316"/>
          {/* Steam lines */}
          <path d="M24 32 Q26 26 24 20" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <path d="M34 30 Q36 24 34 18" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <path d="M44 32 Q46 26 44 20" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          {/* Egg in pan */}
          <ellipse cx="34" cy="44" rx="10" ry="6" fill="#1a1a1a"/>
          <circle cx="34" cy="44" r="4" fill="#fbbf24"/>
        </svg>
      </div>
      <p className="empty-tagline">Turn what you have into something delicious.</p>
      <h2 className="empty-title">Your recipe will appear here</h2>
      <p className="empty-desc">
        Type your ingredients above and hit Generate Recipe.
      </p>
    </div>
  );
}