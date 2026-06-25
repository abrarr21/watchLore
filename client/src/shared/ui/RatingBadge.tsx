interface RatingBadgeProps {
  rating: number;
  className?: string;
}

export function RatingBadge({ rating, className = '' }: RatingBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-black/60 px-1.5 py-0.5 font-mono text-xs font-medium text-[var(--color-primary)] backdrop-blur-sm ${className} `}
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8l-2.78 1.55.53-3.09L1.5 4.27l3.11-.45z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}
