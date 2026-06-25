import { useState } from 'react';
import { RatingBadge } from '../../../shared/ui/RatingBadge';
import { Badge } from '../../../shared/ui/Badge';
import type { ShowCardData } from './ShowCard';

interface SeriesCardProps {
  show: ShowCardData;
  onClick?: (show: ShowCardData) => void;
}

export function SeriesCard({ show, onClick }: SeriesCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => onClick?.(show)}
      className="group w-64 flex-shrink-0 text-left focus:outline-none"
    >
      <div
        className="relative w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-container)]"
        style={{ aspectRatio: '16/9' }}
      >
        {!imgError ? (
          <img
            src={show.images.url}
            alt={show.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-[var(--transition-duration-slow)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-container-high)]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[var(--color-outline)]"
            >
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <path d="M2 12l5-5 4 4 4-5 7 6" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <RatingBadge rating={show.rating} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-3">
          <p className="font-display text-sm leading-tight font-bold text-white">{show.title}</p>
          {show.overview && (
            <p className="mt-1 line-clamp-1 font-body text-[11px] leading-snug text-white/70">
              {show.overview}
            </p>
          )}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-white/50">{show.year}</span>
            <span className="text-white/30">·</span>
            <Badge label={show.type} variant="type" type={show.type} />
          </div>
        </div>
      </div>
    </button>
  );
}
