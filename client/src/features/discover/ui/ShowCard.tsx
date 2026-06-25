import { useState } from 'react';
import { RatingBadge } from '../../../shared/ui/RatingBadge';
import { Badge } from '../../../shared/ui/Badge';

export interface ShowCardData {
  id: string;
  title: string;
  year?: string | number;
  type: 'anime' | 'movie' | 'series';
  rating: number;
  images: {
    url: string;
  };
  genre: string[];
  overview: string;
}

interface ShowCardProps {
  show: ShowCardData;
  onClick?: (show: ShowCardData) => void;
  size?: 'sm' | 'md';
}

export function ShowCard({ show, onClick, size = 'md' }: ShowCardProps) {
  const [imgError, setImgError] = useState(false);
  const width = size === 'sm' ? 'w-32' : 'w-36';

  return (
    <button
      onClick={() => onClick?.(show)}
      className={`group flex-shrink-0 ${width} text-left focus:outline-none`}
    >
      {/* Poster */}
      <div
        className="relative w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-container)]"
        style={{ aspectRatio: '2/3' }}
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

        {/* Rating overlay */}
        <div className="absolute top-2 right-2">
          <RatingBadge rating={show.rating} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-[var(--radius-md)] bg-black/0 transition-colors duration-[var(--transition-duration-base)] group-hover:bg-black/30" />
      </div>

      {/* Meta */}
      <div className="mt-2 px-0.5">
        <p className="truncate font-body text-sm leading-tight font-semibold text-[var(--color-on-surface)] transition-colors duration-[var(--transition-duration-fast)] group-hover:text-[var(--color-primary)]">
          {show.title}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-[var(--color-outline)]">{show.year}</span>
          <span className="text-[var(--color-outline-variant)]">·</span>
          <Badge label={show.type} variant="type" type={show.type} />
        </div>
      </div>
    </button>
  );
}
