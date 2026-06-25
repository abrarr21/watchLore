import { useRef } from 'react';
import { ShowCard, type ShowCardData } from './ShowCard';
import { SkeletonRow } from '../../../shared/ui/SkeletonCard';

interface ShowRowProps {
  title: string;
  subtitle?: string;
  shows: ShowCardData[];
  loading?: boolean;
  onViewAll?: () => void;
  onCardClick?: (show: ShowCardData) => void;
}

export function ShowRow({
  title,
  subtitle,
  shows,
  loading = false,
  onViewAll,
  onCardClick,
}: ShowRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      {/* Row header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-[var(--color-on-surface)]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.12em] text-[var(--color-outline)] uppercase">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-[var(--color-primary)] uppercase transition-colors duration-[var(--transition-duration-fast)] hover:text-[var(--color-primary-container)]"
            >
              View Archive
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {/* Scroll arrows */}
          <div className="ml-2 hidden items-center gap-1 md:flex">
            <button
              onClick={() => scroll('left')}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-colors duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] transition-colors duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable row */}
      {loading ? (
        <SkeletonRow />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} onClick={onCardClick} />
          ))}
        </div>
      )}
    </section>
  );
}
