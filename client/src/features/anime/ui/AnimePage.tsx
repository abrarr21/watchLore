import { useEffect, useRef } from 'react';
import { useVaultShow } from '../../../shared/hooks/useVaultShow';
import { useAnime } from '../hooks/useAnime';
import LoadingSkeleton from '../../../shared/ui/LoadingSkeleton';
import addShowToVaultAPI from '../../../shared/api/AddShowToVaultApi';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import { Plus } from 'lucide-react';
import { Navbar } from '../../../shared/ui/Navbar';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

interface AnimeDATA {
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
  status?: string;
  backdrop_image?: {
    url: string;
  };
}

const MoviesPage = () => {
  const navigate = useNavigate();

  const { anime, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useAnime();

  const { vault } = useVaultShow();
  // console.log(vault);

  const queryClient = useQueryClient();
  const { mutate: addToVault, isPending: isAdding } = useMutation({
    mutationFn: addShowToVaultAPI,
    onSuccess: (_, variables) => {
      // Invalidate cache to trigger immediate refresh
      queryClient.invalidateQueries({ queryKey: ['vaultShows'] });
      alert(`${variables.title} - onSuccessfully added to vault`);
    },
    onError: (error) => {
      console.log('Failed to add anime to vault: ', error);
    },
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  // Set up intersection observer to detect when user reaches bottom
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending || !anime) return <LoadingSkeleton />;

  return (
    <>
      <Navbar currentPath="/anime" onVault={() => navigate('/vault')} />

      <section className="border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)] py-24">
        <div className="mx-auto max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] max-md:px-5">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-on-surface)] md:text-4xl">
              Discover Animes worth adding to your vault
            </h2>

            {/* Filter logic based on Action, Drama etc  */}
          </div>
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {anime.map((card: AnimeDATA, index: number) => {
              // Compare case-insensitive title to verify if present in user's vault
              const isAlreadyAdded = vault?.some(
                (show: any) => show.title.toLowerCase() === card.title.toLowerCase()
              );
              return (
                <div key={index} className="group cursor-pointer">
                  {/* Poster Container */}
                  <div
                    onClick={() => console.log(card)}
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-[var(--radius-md)] border border-white/5 bg-[var(--color-surface-container)]"
                  >
                    <img
                      src={card.images.url}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-[var(--transition-duration-slow)] group-hover:scale-105"
                    />
                    {/* Status Overlay (Using the Badge component) */}
                    <div className="absolute top-2.5 left-2.5">
                      <Badge
                        label={card.rating}
                        type="movie"
                        variant="status"
                        className="text-sm text-white"
                      />
                    </div>
                    {/* Black Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-[var(--transition-duration-base)] group-hover:bg-black/25" />
                  </div>
                  {/* Info */}
                  <div className="flex items-center justify-between gap-2 px-3 py-3">
                    <h4 className="truncate font-body text-sm font-semibold text-[var(--color-on-surface)] transition-colors duration-[var(--transition-duration-fast)] group-hover:text-[var(--color-primary)]">
                      {card.title}
                    </h4>

                    {/* Add Button */}
                    <Button
                      variant={isAlreadyAdded ? 'secondary' : 'primary'}
                      size="xs"
                      disabled={isAlreadyAdded || isAdding}
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering details click handlers

                        addToVault({
                          title: card.title,
                          type: 'anime',
                          genre: card.genre,
                          rating: card.rating,
                          imageUrl: card.images.url,
                          status: 'planned',
                          overview: card.overview,
                          backDropImage: card.backdrop_image?.url,
                        });
                      }}
                    >
                      {isAlreadyAdded ? (
                        'Added'
                      ) : (
                        <>
                          <Plus size={16} /> Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 
            Intersection target element at the bottom of the grid.
            This triggers the next page fetch when scrolled into view.
          */}
          <div ref={loadMoreRef} className="mt-12 flex min-h-[40px] w-full justify-center">
            {isFetchingNextPage && (
              <div className="animate-pulse font-mono text-sm text-[var(--color-outline)]">
                Loading more...
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MoviesPage;
