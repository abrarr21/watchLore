interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`w-36 flex-shrink-0 ${className}`}>
      {/* Poster skeleton */}
      <div
        className="w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-container-high)]"
        style={{ aspectRatio: '2/3' }}
      />
      {/* Title skeleton */}
      <div className="mt-2 space-y-1.5">
        <div className="h-3 w-4/5 animate-pulse rounded bg-[var(--color-surface-container-high)]" />
        <div className="h-2.5 w-3/5 animate-pulse rounded bg-[var(--color-surface-container-high)]" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
