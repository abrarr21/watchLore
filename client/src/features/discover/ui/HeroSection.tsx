import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { RatingBadge } from '../../../shared/ui/RatingBadge';

export interface HeroShow {
  id: string;
  title: string;
  images: {
    url: string;
  };
  rating: number;
  genres: string[];
  type: 'anime' | 'movie' | 'series';
  year?: string | number;
  overview?: string;
  backdrop_image?: {
    url: string;
  };
}

interface HeroSectionProps {
  show: HeroShow;
  onAddToVault?: (id: string) => void;
  onViewTrailer?: (id: string) => void;
}

export function HeroSection({ show, onAddToVault, onViewTrailer }: HeroSectionProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(480px, 62vh, 720px)' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={show.backdrop_image?.url}
          alt={show.title}
          className="h-full w-full object-cover object-center"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-end">
        <div className="mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] pb-16 max-md:px-5 max-md:pb-10">
          <div className="max-w-xl">
            {/* Genre + rating row */}
            <div className="mb-3 flex items-center gap-2">
              {show.genres?.length > 0 &&
                show.genres.slice(0, 2).map((g) => <Badge key={g} label={g} variant="genre" />)}
              <RatingBadge rating={show.rating} />
            </div>

            {/* Title */}
            <h1
              className="font-display leading-[1.05] font-bold tracking-tight text-white"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {show.title}
            </h1>

            {/* Description */}
            <p className="mt-3 line-clamp-2 max-w-md font-body text-sm leading-relaxed text-white/70">
              {show.overview}
            </p>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onAddToVault?.(show.id)}
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                }
              >
                Add to Vault
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onViewTrailer?.(show.id)}
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
                  </svg>
                }
              >
                View Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
